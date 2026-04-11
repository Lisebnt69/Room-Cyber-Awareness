import { GoogleGenAI, Modality } from "@google/genai";
import fs from "node:fs";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

const prompt =
  process.argv[2] || "une affiche moderne de sensibilisation au phishing, style SaaS premium";

async function run() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: prompt,
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    let saved = false;

    for (const candidate of response.candidates || []) {
      for (const part of candidate.content?.parts || []) {
        if (part.inlineData?.data) {
          const bytes = Buffer.from(part.inlineData.data, "base64");
          fs.writeFileSync("output.png", bytes);
          console.log("✅ Image générée : output.png");
          saved = true;
        }

        if (part.text) {
          console.log("Texte du modèle :", part.text);
        }
      }
    }

    if (!saved) {
      console.log("⚠️ Aucune image n’a été renvoyée.");
    }
  } catch (err) {
    console.error("❌ Erreur Gemini :", err);
  }
}

run();