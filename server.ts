import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Parse incoming request JSON bodies with generous limits
app.use(express.json({ limit: '10mb' }));

// Lazy initializer for the Gemini client to ensure compile safety and helpful error feedback
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing. Configure it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Response Schema for a completely formed structured marketing campaign
const campaignResponseSchema = {
  type: Type.OBJECT,
  properties: {
    slogan: { type: Type.STRING, description: "A catchy, impactfully styled slogan or hook for the campaign" },
    theme: { type: Type.STRING, description: "The core creative theme/concept of this marketing campaign" },
    description: { type: Type.STRING, description: "A high-level energetic description explaining why this theme resonates and what the plan is" },
    targetPersona: {
      type: Type.OBJECT,
      description: "Detailed description of the ideal customer persona target for this campaign",
      properties: {
        name: { type: Type.STRING, description: "Give a memorable persona name, e.g., 'Tech-Savvy Tina' or 'Fitness Enthusiast Frank'" },
        demographics: { type: Type.STRING, description: "Age, role, income bracket, location" },
        painPoints: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING },
          description: "Top 3-4 frustrations, obstacles or struggles they face related to this product" 
        },
        interests: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING },
          description: "Major interests, hobbies or digital hangouts of this persona" 
        },
        valueProposition: { type: Type.STRING, description: "The single most compelling reason our product/service solves this persona's pain points" }
      },
      required: ["name", "demographics", "painPoints", "interests", "valueProposition"]
    },
    socialMediaBundle: {
      type: Type.ARRAY,
      description: "A pack of highly creative, copywriter-level social media ideas with detailed visual directions",
      items: {
        type: Type.OBJECT,
        properties: {
          platform: { type: Type.STRING, description: "E.g. LinkedIn, Instagram, Twitter/X" },
          caption: { type: Type.STRING, description: "The actual copy ready for publication. Maintain tone and format/emojis" },
          graphicConcept: { type: Type.STRING, description: "Detailed instruction on what the accompanying graphic/video should look like visually" },
          hashtags: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["platform", "caption", "graphicConcept", "hashtags"]
      }
    },
    emailSequence: {
      type: Type.ARRAY,
      description: "A 2-part email sequence meant to engage and drive key action",
      items: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING, description: "E.g. Launch Intro, Urgency/Fear-of-Missing-Out, or Value Teaser" },
          subject: { type: Type.STRING, description: "High-open-rate Email Subject line" },
          previewText: { type: Type.STRING, description: "Teasing summary showing up in inbox notification previews" },
          body: { type: Type.STRING, description: "The full message body with placeholder triggers like [Name] and clean layout" }
        },
        required: ["type", "subject", "previewText", "body"]
      }
    },
    blogBlueprint: {
      type: Type.OBJECT,
      description: "An SEO content outline designed to capture organic search traffic and establish thought leadership",
      properties: {
        title: { type: Type.STRING, description: "Engaging, SEO-optimized title" },
        metaDescription: { type: Type.STRING, description: "Under-160 characters description for search result page" },
        suggestedHeaders: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Drafted markdown headers (H2s and H3s) mapping out the draft" },
        targetKeywords: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of high-relevance high-volume keywords to sprinkle in" },
        briefOutline: { type: Type.STRING, description: "Short writer's brief on what each section must spotlight" }
      },
      required: ["title", "metaDescription", "suggestedHeaders", "targetKeywords", "briefOutline"]
    },
    googleAds: {
      type: Type.ARRAY,
      description: "High-CTR search/PPC ad assets",
      items: {
        type: Type.OBJECT,
        properties: {
          headline: { type: Type.STRING, description: "Limit to 30 characters search ad headline variant" },
          description: { type: Type.STRING, description: "Limit to 90 characters search ad description text variant" },
          cta: { type: Type.STRING, description: "Strong Call to Action label" }
        },
        required: ["headline", "description", "cta"]
      }
    },
    timelineStrategy: {
      type: Type.ARRAY,
      description: "3 structured stages of marketing execution",
      items: {
        type: Type.OBJECT,
        properties: {
          phase: { type: Type.STRING, description: "E.g. Phase 1: Buzz & Pre-Launch, Phase 2: Launch Activation, Phase 3: Engagement & Retention" },
          duration: { type: Type.STRING, description: "E.g. Days 1-7, Week 2, Ongoing" },
          activities: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Major milestones/actions to take during this phase" }
        },
        required: ["phase", "duration", "activities"]
      }
    },
    budgetAllocation: {
      type: Type.ARRAY,
      description: "Recommended percentage budget configuration with commentary on why",
      items: {
        type: Type.OBJECT,
        properties: {
          channel: { type: Type.STRING, description: "E.g. Paid Social, Search Ads, Content Marketing, Email Outreaches, Influencer Deals" },
          percentage: { type: Type.INTEGER, description: "Under 100 percentage allocation" },
          recommendation: { type: Type.STRING, description: "Quick justification detailing what to spend it on specifically" }
        },
        required: ["channel", "percentage", "recommendation"]
      }
    }
  },
  required: [
    "slogan", "theme", "description", "targetPersona", 
    "socialMediaBundle", "emailSequence", "blogBlueprint", 
    "googleAds", "timelineStrategy", "budgetAllocation"
  ]
};

// Helper to execute generation with multi-model robust fallbacks to bypass transient 503/429/demand-spike errors
async function generateWithFallback({
  prompt,
  systemInstruction,
  responseSchema,
  temperature
}: {
  prompt: string;
  systemInstruction: string;
  responseSchema: any;
  temperature: number;
}) {
  const ai = getGeminiClient();
  // Use gemini-3.5-flash as the primary text model and gemini-flash-latest as fallback
  const models = ["gemini-3.5-flash", "gemini-flash-latest"];
  let lastError: any = null;

  for (const model of models) {
    try {
      console.log(`[GrowthLab Server] Attempting marketing generation with model: ${model}`);
      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema,
          temperature,
        }
      });
      if (response && response.text) {
        console.log(`[GrowthLab Server] Success! Campaign generated using model: ${model}`);
        return response.text.trim();
      }
    } catch (error: any) {
      console.warn(`[GrowthLab Server] Model ${model} generation failed or overloaded:`, error.message || error);
      lastError = error;

      // Check if it is a missing/unauthorized API key error, in which case we fail fast instead of iterating
      const isAuthError = 
        error.message?.includes("API_KEY") || 
        error.status === 403 || 
        error.status === 400 || 
        error.message?.includes("API key");
      if (isAuthError) {
        throw new Error(`Authentication/Configuration Error: Your GEMINI_API_KEY is missing or invalid. Set it up inside the Settings panel. Detail: ${error.message}`);
      }

      // Small backoff before falling back
      await new Promise(resolve => setTimeout(resolve, 800));
    }
  }

  throw new Error(`All generative intelligence channels are currently heavily loaded. Please wait a moment and try again. Details: ${lastError?.message || lastError}`);
}

// 1. Core Campaign Generation Endpoint
app.post("/api/campaign/generate", async (req, res) => {
  try {
    const { 
      productName, 
      productDescription, 
      targetAudience, 
      campaignGoals, 
      channels, 
      tone, 
      budgetType 
    } = req.body;

    if (!productName || !productDescription) {
      return res.status(400).json({ error: "Product Name and Product Description are required fields." });
    }

    const systemInstruction = `You are an elite, chief growth officer and copywriting master. 
Your goal is to build highly cohesive, optimized, stellar marketing campaign architectures that map perfectly to the target product, tone, and audience.
All copy generated of headlines, emails, ads, and socials must be highly converting, distinct, modern and emotionally resonant. No generic placeholders except [Name] or [Company].`;

    const prompt = `Develop a total, pristine marketing campaign for:
Product Name: ${productName}
Product Description: ${productDescription}
Specified Target Audience Profile: ${targetAudience || "General target consumers"}
Key Campaign Goals: ${campaignGoals ? campaignGoals.join(", ") : "Growth and Awareness"}
Target Distribution Channels: ${channels ? channels.join(", ") : "All channels"}
Creative Tone: ${tone || "Professional, modern"}
Estimated Budget Profile: ${budgetType || "Medium scale"}

Focus on creating ultra-compelling content pieces that align strictly with this specified tone: "${tone}". Produce the campaign following the specified response schema exactly.`;

    const responseText = await generateWithFallback({
      prompt,
      systemInstruction,
      responseSchema: campaignResponseSchema,
      temperature: 1.0,
    });

    const campaignData = JSON.parse(responseText);
    return res.json(campaignData);
  } catch (error: any) {
    console.error("Failed to generate campaign:", error);
    return res.status(500).json({ 
      error: error.message || "An expected error occurred while generating the campaign. Please check the server logs." 
    });
  }
});

// 2. Refine Campaign Endpoint
app.post("/api/campaign/refine", async (req, res) => {
  try {
    const { currentCampaign, refinementInstructions } = req.body;

    if (!currentCampaign || !refinementInstructions) {
      return res.status(400).json({ error: "Current Campaign and Refinement Instructions are required." });
    }

    const systemInstruction = `You are a copywriting expert who modifies existing marketing collateral with extreme precision.
You must update the existing campaign JSON object strictly following the user's instructions.
Keep all aspects of the campaign structured identical to the original JSON shape, changing or updating only things relevant to the instruction.`;

    const prompt = `Here is the current marketing campaign:
${JSON.stringify(currentCampaign, null, 2)}

User request for refinement:
"${refinementInstructions}"

Update the campaign content strictly reflecting this instruction. Maintain high quality, cohesiveness, brand voice, and schema structure. Return the fully updated campaign JSON.`;

    const responseText = await generateWithFallback({
      prompt,
      systemInstruction,
      responseSchema: campaignResponseSchema,
      temperature: 0.8,
    });

    const refinedCampaignData = JSON.parse(responseText);
    return res.json(refinedCampaignData);
  } catch (error: any) {
    console.error("Failed to refine campaign:", error);
    return res.status(500).json({ 
      error: error.message || "An expected error occurred while refining the campaign." 
    });
  }
});

// Start listening and register dev/production asset serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Vite middleware for development
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Marketing Campaign Generator server listening on http://localhost:${PORT}`);
  });
}

startServer();
