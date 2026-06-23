export interface TargetPersona {
  name: string;
  demographics: string;
  painPoints: string[];
  interests: string[];
  valueProposition: string;
}

export interface SocialMediaPost {
  platform: string;
  caption: string;
  graphicConcept: string;
  hashtags: string[];
}

export interface EmailMessage {
  type: string;
  subject: string;
  previewText: string;
  body: string;
}

export interface BlogBlueprint {
  title: string;
  metaDescription: string;
  suggestedHeaders: string[];
  targetKeywords: string[];
  briefOutline: string;
}

export interface GoogleAd {
  headline: string;
  description: string;
  cta: string;
}

export interface TimelinePhase {
  phase: string;
  duration: string;
  activities: string[];
}

export interface BudgetChannel {
  channel: string;
  percentage: number;
  recommendation: string;
}

export interface MarketingCampaign {
  slogan: string;
  theme: string;
  description: string;
  targetPersona: TargetPersona;
  socialMediaBundle: SocialMediaPost[];
  emailSequence: EmailMessage[];
  blogBlueprint: BlogBlueprint;
  googleAds: GoogleAd[];
  timelineStrategy: TimelinePhase[];
  budgetAllocation: BudgetChannel[];
}

export interface CampaignRequest {
  productName: string;
  productDescription: string;
  targetAudience: string;
  campaignGoals: string[];
  channels: string[];
  tone: string;
  budgetType: string;
}

export interface SavedCampaign {
  id: string;
  timestamp: string;
  request: CampaignRequest;
  campaign: MarketingCampaign;
}
