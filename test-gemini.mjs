import { GoogleGenerativeAI } from "@google/genai";
import path from "path";
import { fileURLToPath } from 'url';

// Polyfill for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars


async function testConnection() {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === "PLACEHOLDER_API_KEY") {
        console.error("❌ Error: GEMINI_API_KEY is missing or invalid in .env.local");
        console.log("Please get an API key from https://aistudio.google.com/ and update .env.local");
        process.exit(1);
    }

    console.log("Found API Key:", apiKey.substring(0, 8) + "...");

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        console.log("Attempting to connect to Google AI Studio...");
        const result = await model.generateContent("Hello! Verify this connection works.");
        const response = await result.response;
        const text = response.text();

        console.log("✅ Connection Successful!");
        console.log("Response from Gemini:", text);
    } catch (error) {
        console.error("❌ Connection Failed:", error.message);
    }
}

testConnection();
