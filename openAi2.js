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
