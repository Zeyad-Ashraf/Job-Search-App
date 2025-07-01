import dotenv from "dotenv";
dotenv.config({
    path: './config/.env',
})
// import OpenAI from "openai";


// export const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
// })
import axios from "axios";

export const openRouter = axios.create({
  baseURL: "https://openrouter.ai/api/v1",
  headers: {
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    "Content-Type": "application/json",
    "HTTP-Referer": "http://localhost:3000", // أو رابط موقعك
  },
});