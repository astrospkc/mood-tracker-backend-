import dotenv from "dotenv";
dotenv.config();
import { GoogleGenerativeAI } from "@google/generative-ai";
import { data } from "./data.js";

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    response_mime_type: "application/json",
  },
});

const item = data;

export async function run(data) {
  try {
    let prompt;

    let text = "";
    for (let i = 0; i < data.length; i++) {
      text += data[i].body;
    }

    prompt = `based on this text, rate from 0-10 scale, the anger, joy, sadness, happiness, chilled , adventurous , loneliness, overall rate the emotions : ${text}. mention all the rating in json format and also add one more section where you mention the tips and improvements for the author to how to work on these emotions , overall what the status of the author's emotions  `;
    const result = await model.generateContent(prompt);

    const summary = result.response.text();

    return summary;
  } catch (error) {
    console.error("Error generating content:", error);
  }
}
