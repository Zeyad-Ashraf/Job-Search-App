import { enumRole } from "../../DB/models/user.model.js";
import { asyncHandler, openai } from "../../utils/index.js";

export const startChat = asyncHandler(async (req,res,next) =>{
    if (!req.user)
    return next(new Error("Unauthorized", { cause: 401 }));

    const { cv, jobTitle } = req.body;

    console.log(cv, jobTitle);


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
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages,
        });

        const firstQuestion = completion.data.choices[0].message.content;
        messages.push({ role: enumRole.assistant, content: firstQuestion });
        
        return res.status(200).json({ question: firstQuestion, messages });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'OpenAI request failed' });
    }
})