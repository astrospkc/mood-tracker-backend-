// import dotenv from "dotenv";
// dotenv.config();
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { data } from "./data.js";
// console.log(process.env.API_KEY);
// const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// const model = genAI.getGenerativeModel({
//   model: "gemini-1.5-flash",
//   generationConfig: {
//     response_mime_type: "application/json",
//   },
// });

// let prompt;
// console.log("data:", data);
// let text =
//   "gone are the days when people used to actually listens and understand the feelings of the other. So today is the where I am feeling nothing , its just a void where feelings are stuck , and sometimes I feel that , what will happen when I will get the right person and without hesitation I will be able to talk and share my all feelings. ";

// prompt = `based on this text, rate from 0-10 scale, the anger, joy, sadness, happiness, chilled , adventurous , loneliness, overall rate the emotions : ${text}. mention all the rating in json format and also add one more section where you mention the tips and improvements for the author to how to work on these emotions , overall what the status of the author's emotions  `;
// const result = await model.generateContent(prompt);

// const summary = result.response.text();

// console.log("summary: ", summary);

import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

console.log(process.env.OPENROUTER_API_KEY);

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey:
    "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",
  //   defaultHeaders: {
  //     "HTTP-Referer": "<YOUR_SITE_URL>", // Optional. Site URL for rankings on openrouter.ai.
  //     "X-Title": "<YOUR_SITE_NAME>", // Optional. Site title for rankings on openrouter.ai.
  //   },
});

// console.log("open ai : ", openai);

async function main() {
  let text =
    "I fee the life comes with its taste of giving sour and sweet moments";
  const completion = await openai.chat.completions.create({
    model: "liquid/lfm-7b",
    messages: [
      {
        role: "user",
        content: `based on this text, rate from 0-10 scale, the anger, joy, sadness, happiness, chilled , adventurous , loneliness, overall rate the emotions : ${text}. mention all the rating in json format and also add one more section where you mention the tips and improvements for the author to how to work on these emotions , overall what the status of the author's emotions  `,
      },
    ],
  });
  console.log(completion);
  console.log(completion.choices[0].message);

  //   console.log(completion.choices[0].message);
}
main();
