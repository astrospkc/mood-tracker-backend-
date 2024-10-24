import dotenv from "dotenv";
dotenv.config();
import { GoogleGenerativeAI } from "@google/generative-ai";
import { data } from "./data.js";
console.log(process.env.API_KEY);
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const item = data;

let stored = [];
export async function run() {
  try {
    let prompt;
    for (let i = 0; i < item.length; i++) {
      console.log("item: ", item[i]);
      prompt = `what the following data is expressing the mood ${item[i]}`;
      const result = await model.generateContent(prompt); // Use await here
      stored.push(result.response.text());
    }
    console.log("stored: ", stored);
    const pr = stored[0];
    const res = await model.generateContent(pr);
    const summarize = res.response.text();

    console.log("res: ", summarize);
    return summarize;
  } catch (error) {
    console.error("Error generating content:", error);
  }
}
