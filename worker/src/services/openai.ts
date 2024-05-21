import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const classifyEmail = async (emailBody: string) => {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `Classify the following email text into one of these categories: Interested, Not Interested, More Information.\n\nEmail: ${emailBody}\n\nCategory:`,
      },
    ],
  });
  return response.choices[0].message.content;
};

export const generateResponse = async (emailBody: string, category: string) => {
  const promptMap: { [key: string]: string } = {
    'Interested': `Write a response asking the recipient to schedule a demo call.`,
    "Not Interested": `Write a polite response thanking the recipient.`,
    "More Information": `Write a response asking for more information and suggesting a time for a call.`,
  };

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `${promptMap[category]}\n\nEmail: ${emailBody}\n\nResponse:`,
      },
    ],
    max_tokens: 150,
  });
  return response.choices[0].message.content;
};
