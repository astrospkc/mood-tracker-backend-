import dotenv from "dotenv";
dotenv.config();
import { GoogleGenerativeAI } from "@google/generative-ai";
import { data } from "./data.js";
console.log(process.env.API_KEY);
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const item = data;

let stored = [];
export async function run(data) {
  try {
    let prompt;
    console.log("data:", data);
    for (let i = 0; i < data.length; i++) {
      // console.log("item: ", data[i].body);
      prompt = `what a writer is feeling about this text ${data[i]}, mention only the key points in list. The result should be in json format.`;
      const result = await model.generateContent(prompt); // Use await here
      stored.push(result.response.text());
    }
    console.log("stored: ", stored);
    return stored;
  } catch (error) {
    console.error("Error generating content:", error);
  }
}
