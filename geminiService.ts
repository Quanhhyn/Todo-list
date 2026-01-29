import { GoogleGenAI } from "@google/genai";
import { Task } from "../types";

// Note: In a real production app, you should proxy these requests through a backend
// to protect your API Key.
const apiKey = process.env.API_KEY || ''; 

const ai = new GoogleGenAI({ apiKey });

// Cache configuration to prevent 429 errors
const COACH_CACHE_KEY = 'duckdo_coach_cache';
const COACH_CACHE_TIMESTAMP = 'duckdo_coach_timestamp';
const CACHE_DURATION_MS = 1000 * 60 * 5; // 5 minutes

export const getProductivityCoach = async (tasks: Task[], userName: string): Promise<string> => {
  if (!apiKey) return "AI Coach is sleeping (Missing API Key).";

  // 1. Check Cache
  const cachedMsg = localStorage.getItem(COACH_CACHE_KEY);
  const cachedTime = localStorage.getItem(COACH_CACHE_TIMESTAMP);
  
  if (cachedMsg && cachedTime) {
      const age = Date.now() - parseInt(cachedTime);
      // If cache is fresh (less than 5 mins), return it to save quota
      if (age < CACHE_DURATION_MS) {
          return cachedMsg;
      }
  }

  const taskSummary = tasks.map(t => `- ${t.text} (${t.status}, Due: ${new Date(t.deadline).toLocaleDateString()})`).join('\n');
  
  const prompt = `
    You are a cheerful, energetic duck productivity coach named "Quack Coach".
    The user ${userName} has the following tasks:
    ${taskSummary}

    Give a short, motivating message (under 50 words). 
    If they have many tasks, prioritize one. 
    If they have no tasks, tell them to relax or plan ahead.
    Use duck puns occasionally.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    const text = response.text || "Quack! Keep going!";
    
    // 2. Save to Cache on success
    localStorage.setItem(COACH_CACHE_KEY, text);
    localStorage.setItem(COACH_CACHE_TIMESTAMP, Date.now().toString());

    return text;
  } catch (error: any) {
    console.error("Gemini Error:", error);
    
    // 3. Handle Rate Limiting (429) Gracefully
    const isRateLimit = error?.status === 429 || error?.code === 429 || error?.message?.includes('429') || error?.status === 'RESOURCE_EXHAUSTED';
    
    if (isRateLimit) {
        // Return cached message if it exists (even if old), otherwise a fallback
        if (cachedMsg) return cachedMsg;
        return "Quack! I need a quick nap (Quota Exceeded). I'll be back later!";
    }

    return "Quack! I'm having trouble connecting to the hive mind right now.";
  }
};

export const suggestSubtasks = async (taskText: string): Promise<string[]> => {
    if (!apiKey) return ["Plan step 1", "Plan step 2"];

    const prompt = `
      Break down the task "${taskText}" into 3-5 smaller, actionable sub-steps.
      Return ONLY the list of steps, one per line. No numbering.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });
        const text = response.text || "";
        return text.split('\n').filter(line => line.trim().length > 0).map(l => l.replace(/^[-*]\s*/, ''));
    } catch (error: any) {
        console.error("Subtask Error:", error);
        // Handle Rate Limit
        const isRateLimit = error?.status === 429 || error?.code === 429 || error?.message?.includes('429') || error?.status === 'RESOURCE_EXHAUSTED';
        if (isRateLimit) {
            return ["Break it down", "Take a deep breath", "Start small (Quota Limit)"];
        }
        return ["Check details", "Start working", "Review"];
    }
}