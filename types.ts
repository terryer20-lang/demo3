
export interface MenuItem {
  id: string;
  icon: string;
  text: string; // Used as fallback or key suffix
  path: string;
}

export interface ChallengeQuestion {
  id: number;
  // question and options moved to locales
  correctAnswer: number;
}

export interface SafetyQuestion {
  id: number;
  // question moved to locales
  category: 'health' | 'crime' | 'political' | 'nature';
  weight: number;
}

export interface NotificationItem {
  id: string;
  date: string;
  link: string;
  // title moved to locales
}

export interface KnowledgeCard {
  id: string;
  image: string;
  link: string;
  // title moved to locales
}

export interface KnowledgeItem {
  id: string;
  titleKey: string;
  contentKey: string;
  tags: string[];
}

export enum SafetyRating {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high"
}
