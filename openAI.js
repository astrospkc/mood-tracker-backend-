import dotenv from "dotenv";
dotenv.config();
import OpenAI from "openai";
import { data } from "./data.js";

// const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// const model = genAI.getGenerativeModel({
//   model: "gemini-1.5-flash",
//   generationConfig: {
//     response_mime_type: "application/json",
//   },
// });
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey:
    "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",
});

export async function run(data) {
  try {
    let prompt;

    let text = "";
    for (let i = 0; i < data.length; i++) {
      text += data[i].body;
    }

    const completion = await openai.chat.completions.create({
      model: "liquid/lfm-7b",
      messages: [
        {
          role: "user",
          content: `based on this text, rate from 0-10 scale, the anger, joy, sadness, happiness, chilled , adventurous , loneliness, overall rate the emotions : ${text}. mention all the rating in json format and also add one more section where you mention the tips and improvements for the author to how to work on these emotions , overall what the status of the author's emotions  `,
        },
      ],
    });

    // prompt = `based on this text, rate from 0-10 scale, the anger, joy, sadness, happiness, chilled , adventurous , loneliness, overall rate the emotions : ${text}. mention all the rating in json format and also add one more section where you mention the tips and improvements for the author to how to work on these emotions , overall what the status of the author's emotions  `;
    // const result = await model.generateContent(prompt);

    // const summary = result.response.text();
    const summary = completion.choices[0].message.content;

    return summary;
  } catch (error) {
    console.error("Error generating content:", error);
  }
}
