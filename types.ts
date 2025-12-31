
export enum AppView {
  LANDING = 'LANDING',
  AI_GENERATOR = 'AI_GENERATOR',
  AD_PREVIEW = 'AD_PREVIEW',
  ABOUT = 'ABOUT'
}

export interface UserGoal {
  id: string;
  label: string;
  icon: string;
}

export interface GeneratedContent {
  headline: string;
  primaryText: string;
  hashtags: string[];
  suggestedVisual: string;
}
