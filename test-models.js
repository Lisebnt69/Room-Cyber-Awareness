import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY,
});

async function run() {
  const models = await ai.models.list({
    config: { pageSize: 50 },
  });

  for await (const model of models) {
    console.log(model.name);
  }
}

run().catch((err) => {
  console.error("Erreur list models :", err);
});