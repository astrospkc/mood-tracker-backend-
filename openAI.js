import dotenv from "dotenv";
dotenv.config();
import { GoogleGenerativeAI } from "@google/generative-ai";
import { data } from "./data.js";
console.log(process.env.API_KEY);
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const item = data;

export async function run(data) {
  try {
    let prompt;
    console.log("data:", data);
    let text = "";
    for (let i = 0; i < data.length; i++) {
      text += data[i].body;
    }
    console.log("text: ", text);
    prompt = `writer's emotion through this jouranal : ${text}, mention only the key points in list.No explanation please. The result should be in json format.`;
    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    console.log("summary: ", summary);
    return summary;
  } catch (error) {
    console.error("Error generating content:", error);
  }
}
