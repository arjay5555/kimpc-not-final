const { GoogleGenAI } = require("@google/genai");

async function testConnection() {
    const apiKey = process.env.GEMINI_API_KEY;
    const ai = new GoogleGenAI({ apiKey });

    console.log("Attempting to list models...");
    try {
        // If list() is available. Based on new SDK, it should be.
        // Documentation suggests: client.models.list()
        const listResp = await ai.models.list();
        console.log("Available Models:", JSON.stringify(listResp, null, 2));
    } catch (err) {
        console.log("List failed:", err.message);
    }

    const modelsToTry = [
        'models/gemini-1.5-flash',
        'models/gemini-pro',
        'gemini-1.5-flash'
    ];

    for (const model of modelsToTry) {
        console.log(`\nTesting: ${model}...`);
        try {
            const resp = await ai.models.generateContent({
                model: model,
                contents: { parts: [{ text: "Hi" }] }
            });
            console.log(`✅ Success with ${model}`);
            return;
        } catch (e) {
            console.log(`❌ Failed: ${e.message}`);
        }
    }
}

testConnection();
