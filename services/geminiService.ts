
import { GoogleGenAI, Type } from "@google/genai";
import { FoodAnalysis, MealPlanDay, UserProfile, RecommendationItem, ChatMessage, NearbyFacility, HealthArticle } from "../types";

const getSystemPrompt = (profile?: UserProfile) => {
  const lang = profile?.language || 'id';
  return lang === 'en' 
    ? `You are a Medical & Nutrition AI Expert. 
       FORMAT RULES: 
       1. Response MUST be a numbered list (1., 2., 3., 4., 5.).
       2. NEVER use markdown symbols like **, *, or ###. 
       3. Use plain text only. 
       4. Max 5 points. Point 5 is always a medical disclaimer.`
    : `Anda adalah Pakar Medis & Gizi AI. 
       ATURAN FORMAT: 
       1. Jawaban WAJIB berupa daftar bernomor (1., 2., 3., 4., 5.).
       2. JANGAN PERNAH gunakan simbol markdown seperti **, *, atau ###. 
       3. Gunakan teks polos saja. 
       4. Maksimal 5 poin. Poin 5 selalu berupa disclaimer medis.`;
};

export const getHealthSurveyAdvice = async (data: any): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const profile: UserProfile = JSON.parse(localStorage.getItem('nutri_profile') || '{}');
  const systemInstruction = profile.language === 'en'
    ? `Analyze biometrics. Rule: 5 numbered points. NO markdown symbols.`
    : `Analisis biometrik. Aturan: 5 poin bernomor. TANPA simbol markdown.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Data: ${JSON.stringify(data)}`,
    config: { systemInstruction }
  });
  return response.text || "";
};

export const analyzeFoodImage = async (base64Image: string): Promise<FoodAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const profile: UserProfile = JSON.parse(localStorage.getItem('nutri_profile') || '{}');
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
        { text: `${getSystemPrompt(profile)} Analisis makanan ini.` }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING },
          nutrients: {
            type: Type.OBJECT,
            properties: {
              calories: { type: Type.NUMBER },
              protein: { type: Type.NUMBER },
              carbs: { type: Type.NUMBER },
              fat: { type: Type.NUMBER }
            },
            required: ["calories", "protein", "carbs", "fat"]
          },
          healthScore: { type: Type.NUMBER },
          recommendation: { type: Type.STRING }
        },
        required: ["name", "description", "nutrients", "healthScore", "recommendation"]
      }
    }
  });
  return JSON.parse(response.text || "{}");
};

export const getHealthAdvice = async (history: ChatMessage[], query: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const profile: UserProfile = JSON.parse(localStorage.getItem('nutri_profile') || '{}');
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: query,
    config: { systemInstruction: getSystemPrompt(profile) }
  });
  return response.text || "";
};

export const getMentalSupport = async (history: ChatMessage[], query: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const profile: UserProfile = JSON.parse(localStorage.getItem('nutri_profile') || '{}');
  const systemInstruction = profile.language === 'en'
    ? `Compassionate AI. Rule: 3 numbered points. NO stars/symbols. Tone: Warm.`
    : `AI Empati. Aturan: 3 poin bernomor. TANPA bintang/simbol. Nada: Hangat.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: query,
    config: { systemInstruction }
  });
  return response.text || "";
};

export const generateMealPlan = async (goal: string, dietType: string): Promise<MealPlanDay[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Meal plan for ${goal}, ${dietType}. 3 days.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            day: { type: Type.STRING },
            breakfast: { type: Type.STRING },
            lunch: { type: Type.STRING },
            dinner: { type: Type.STRING },
            snacks: { type: Type.ARRAY, items: { type: Type.STRING } },
            totalCalories: { type: Type.NUMBER },
            mentalWellnessTip: { type: Type.STRING }
          },
          required: ["day", "breakfast", "lunch", "dinner", "snacks", "totalCalories"]
        }
      }
    }
  });
  return JSON.parse(response.text || "[]");
};

export const getPersonalizedRecommendations = async (profile: UserProfile, history: any[]): Promise<RecommendationItem[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Recommend 4 foods for ${profile.goal}.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            calories: { type: Type.NUMBER },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            reason: { type: Type.STRING }
          },
          required: ["title", "description", "calories", "tags", "reason"]
        }
      }
    }
  });
  return JSON.parse(response.text || "[]");
};

export const findNearbyHospitals = async (lat: number, lng: number): Promise<NearbyFacility[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Cari fasilitas medis terdekat.",
    config: {
      tools: [{ googleMaps: {} }],
      toolConfig: { retrievalConfig: { latLng: { latitude: lat, longitude: lng } } }
    },
  });
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  return chunks.filter((c: any) => c.maps).map((c: any) => ({
    name: c.maps.title,
    address: c.maps.title,
    url: c.maps.uri
  }));
};

export const getHealthArticles = async (language: 'id' | 'en'): Promise<HealthArticle[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `8 health articles in ${language}.`,
    config: { tools: [{ googleSearch: {} }] }
  });
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  return chunks.filter((c: any) => c.web).map((c: any, i: number) => ({
    title: c.web.title,
    summary: "Informasi kesehatan terbaru dari sumber terpercaya.",
    sourceName: "Verified Source",
    sourceUrl: c.web.uri,
    category: "Health News",
    timestamp: Date.now()
  }));
};
