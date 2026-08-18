export type ReelCategory =
  | 'Programming Meme'
  | 'Developer Career'
  | 'Career / Programming'
  | 'Hardware'
  | 'AI / Career'
  | 'DSA'
  | 'Cybersecurity'
  | 'System Design'
  | 'Cloud Computing'
  | 'Developer Tools'
  | 'AI Engineering'
  | 'Computer Architecture'
  | 'General Entertainment';

export interface ReelBehavior {
  watchedPct: number; // 0 - 100
  liked: boolean;
  saved: boolean;
  replay: boolean;
  replayed?: boolean;
  shared?: boolean;
  skippedEarly?: boolean;
}

export interface ContentQualityBreakdown {
  technicalAccuracy: number; // 0 - 100
  depthOfExplanation: number; // 0 - 100
  educationalValue: number; // 0 - 100
  hypePenalty: number; // 0 - 100
  compositeScore: number; // 0 - 100
  qualityGrade: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D';
  verdict: string;
  strengths: string[];
  weaknesses?: string[];
}

export interface Reel {
  id: string;
  reelNumber: string;
  title: string;
  category: ReelCategory;
  content: string;
  behavior: ReelBehavior;
  semanticTags: string[];
  directTopics: string[];
  latentTopics: string[];
  subtopics?: string[];
  qualityBreakdown?: ContentQualityBreakdown;
  hypeClassification?: {
    isHype: boolean;
    hypeRisk: 'Low' | 'Medium' | 'High';
    hypeScore: number; // 0 - 100
    detectedPatterns: string[];
  };
  durationSeconds: number;
  creatorHandle: string;
  viewCount: string;
  likeCount: string;
  commentCount: string;
  visualPreviewType: 'meme' | 'code' | 'career' | 'hardware' | 'ai_hype' | 'dsa_anim' | 'security' | 'system';
}

export interface SubtopicScore {
  id: string;
  parentCategory: string;
  name: string;
  score: number; // 0 - 100
  level: 'Very High' | 'High' | 'Medium' | 'Low';
  description: string;
  signals: string[];
}

export interface InterestScore {
  category: string;
  score: number; // 0 - 100
  level: 'Very High' | 'High' | 'Medium' | 'Low';
  isLatent: boolean;
  directEvidenceCount: number;
  description: string;
  evidenceSourceIds: string[];
  subtopics?: SubtopicScore[];
}

export interface InterestGraphNode {
  id: string;
  label: string;
  group: 'root' | 'primary' | 'secondary' | 'subtopic' | 'language' | 'leaf';
  category: string;
  parentId?: string;
  children?: string[];
  depth: number; // 0: Root, 1: Primary Domain, 2: Sub-Topic / Language, 3: Specific Specialization
  score: number;
  strength: number; // 0.1 to 1.0 for visual weight
  reasoning: string;
  sources: string[];
  qualityScore?: number;
  subtopics?: string[];
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

export interface InterestGraphLink {
  source: string;
  target: string;
  strength: number; // 1 to 5
  type: 'parent_child' | 'direct' | 'latent' | 'reinforcement';
  label?: string;
}

export interface RecommendationOutput {
  id: string;
  currentReelRef?: string;
  interestDetected: string;
  whyInterestDetected: string;
  recommendedTechReel: string;
  category: 'DSA' | 'System Design' | 'AI' | 'Java' | 'Cybersecurity' | 'Cloud' | 'Hardware' | 'Career' | 'Architecture' | 'Developer Tools';
  subtopic?: string;
  whyThisRecommendation: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  confidence: 'High' | 'Medium' | 'Low';
  valueScore: number; // 0 - 100
  interestMatch: number; // 0 - 100
  hypeRisk: 'Low' | 'Medium' | 'High';
  techRelevance: number; // 0 - 100
  qualityBreakdown?: ContentQualityBreakdown;
  evidenceChecklist: string[];
  channelName: string;
  durationString: string;
  keyLearningTakeaways: string[];
  antiKeywordsNote?: string;
  alternativeBadRecommendation?: {
    title: string;
    whyBad: string;
  };
}

export type FeedbackActionType =
  | 'more_like_this'
  | 'less_like_this'
  | 'too_easy'
  | 'too_advanced'
  | 'less_hype'
  | 'not_interested';

export interface FeedbackLogItem {
  id: string;
  type: FeedbackActionType;
  topic?: string;
  subtopic?: string;
  recommendationId?: string;
  recommendationTitle?: string;
  timestamp: number;
  impactNote: string;
}

export interface UserFeedbackState {
  difficultyBias: 'Beginner' | 'Intermediate' | 'Advanced' | 'Adaptive';
  hypeStrictness: 'Normal' | 'Strict' | 'Ultra';
  categoryBoosts: Record<string, number>;
  subtopicBoosts: Record<string, number>;
  dismissedRecommendationIds: string[];
  bookmarkedRecommendationIds: string[];
  feedbackLog: FeedbackLogItem[];
}

export interface DemoAnalysisStep {
  step: number;
  title: string;
  status: 'pending' | 'running' | 'completed';
  detail: string;
  discoveredInsight?: string;
}

export interface AnalysisSummary {
  headlineDiscovery: string; // e.g. "YOU DON'T JUST LIKE JAVA. YOU LIKE SOFTWARE ENGINEERING."
  primaryInterest: string;
  directInterestComparison: {
    naiveKeywordConclusion: string;
    latentAIConclusion: string;
  };
  behavioralStrengthSummary: string;
  evidenceItems: string[];
  topInterests: InterestScore[];
  hypeFilteredCount: number;
  averageQualityScore: number;
  topSubtopics: SubtopicScore[];
}
