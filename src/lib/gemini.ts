import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
export const genAI = new GoogleGenAI({ apiKey });
