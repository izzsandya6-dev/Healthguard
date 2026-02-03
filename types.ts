
export interface NutrientInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  vitamins?: string[];
}

export interface FoodAnalysis {
  name: string;
  description: string;
  nutrients: NutrientInfo;
  healthScore: number;
  recommendation: string;
  timestamp?: number;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  timestamp: number;
}

export interface SmartFormula {
  metabolism: number; // 1-5
  recovery: number;   // 1-5
  focus: number;      // 1-5
  longevity: number;  // 1-5
}

export interface WeightRecord {
  date: number;
  weight: number;
}

export interface ActivityRecord {
  date: number;
  type: string;
  duration: number; // minutes
}

export interface UserProfile {
  name: string;
  email: string;
  password?: string;
  isVerified: boolean;
  language: 'id' | 'en';
  goal: string;
  targetWeight?: number;
  weightHistory: WeightRecord[];
  activityLog: ActivityRecord[];
  dietPreference: string;
  dietProtocol: 'Standard' | 'Paleo' | 'Keto' | 'Mediterranean' | 'Intermittent Fasting' | 'Low Sodium';
  allergies: string[];
  medicalConditions: string[];
  weight: number;
  height: number;
  age: number;
  gender: 'Pria' | 'Wanita';
  activityLevel: 'Sedenter' | 'Ringan' | 'Moderat' | 'Aktif' | 'Atletis';
  focusArea: 'Energi' | 'Otot' | 'Pencernaan' | 'Imunitas' | 'Kesehatan Mental';
  formula: SmartFormula;
  moodRating?: number;
  stressScore?: number;
  hydrationToday: number; // in ml
  hydrationGoal: number; // in ml
  sleepLast_night: number; // in hours
  sleepGoal: number; // in hours
  immunityStatus: 'Kuat' | 'Stabil' | 'Menurun' | 'Rentan';
  emergencyContacts: EmergencyContact[];
  connectedDevices: string[];
  wellnessPrefs: {
    meditation: boolean;
    exercise: boolean;
    deepSleep: boolean;
    hydration: boolean;
  };
}

export interface RecommendationItem {
  title: string;
  description: string;
  calories: number;
  tags: string[];
  reason: string;
}

export interface MealPlanDay {
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  snacks: string[];
  totalCalories: number;
  mentalWellnessTip?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface NearbyFacility {
  name: string;
  address: string;
  distance?: string;
  url: string;
}

export interface HealthArticle {
  title: string;
  summary: string;
  sourceName: string;
  sourceUrl: string;
  category: string;
  timestamp: number;
}

export type AppView = 'login' | 'dashboard' | 'analyzer' | 'history' | 'planner' | 'chat' | 'recommendations' | 'settings' | 'hospitals' | 'emergency' | 'survey' | 'mental-session';
