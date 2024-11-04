import dotenv from "dotenv";
dotenv.config();
import { GoogleGenerativeAI } from "@google/generative-ai";
import { data } from "./data.js";
console.log(process.env.API_KEY);
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
// const model = genAI.getGenerativeModel({
//   model: "gemini-1.5-flash",
//   response_mime_type: "application/json",
// });
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
    console.log("data:", data);
    let text = "";
    for (let i = 0; i < data.length; i++) {
      text += data[i].body;
    }
    // console.log("text: ", text);
    // prompt = `writer's emotion through this jouranal : ${text}, mention only the key points in list.No explanation please. The result should be in json format.`;
    prompt = `based on this text, rate from 0-10 scale, the anger, joy, sadness, happiness, chilled , adventurous , loneliness, overall rate the emotions : ${text}. mention all the rating in json format , overall what the status of the author's emotions  `;
    const result = await model.generateContent(prompt);
    // console.log("Result : ", result);
    // console.log("text : ", result.response.text());
    const summary = result.response.text();

    // console.log("summary: ", summary);
    return summary;
  } catch (error) {
    console.error("Error generating content:", error);
  }
}
