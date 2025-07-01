import { enumRole } from "../../DB/models/user.model.js";
import { asyncHandler, /*openai*/ openRouter } from "../../utils/index.js";
import axios from "axios";

export const startChat = asyncHandler(async (req,res,next) =>{
    // if (!req.user)
    // return next(new Error("Unauthorized", { cause: 401 }));

    const { cv, jobTitle } = req.body;

    const messages = [
        {
            role: enumRole.system,
            content: `You are a professional technical interviewer. Interview the user based on the following CV and job title:\nCV: ${cv}\nJob Title: ${jobTitle}`,
        },
        {
            role: enumRole.user,
            content: 'I am ready. Please start the interview.',
        }
    ];

    try {
        // Integration with openAi Paid
        // const completion = await openai.chat.completions.create({
        //     model: "gpt-3.5-turbo",
        //     messages,
        // });

        // Integration with OpenRouter free
        const completion = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "qwen/qwen2.5-vl-72b-instruct:free",
                messages,
            },
            {
                headers: {
                Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:3000",
                },
            }
        );


        const firstQuestion = completion.data.choices[0].message.content;
        messages.push({ role: enumRole.assistant, content: firstQuestion });
        
        return res.status(200).json({ question: firstQuestion, messages });
    } catch (err) {
        return res.status(500).json({
            error: err?.response?.data ?? 'Something went wrong',
        });
    }
})