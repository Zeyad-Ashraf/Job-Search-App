import { enumPayment, enumRole } from "../../DB/models/user.model.js";
import { asyncHandler, /*openai*/ openRouter } from "../../utils/index.js";
import axios from "axios";

export const startChat = asyncHandler(async (req,res,next) =>{
    if (!req.user || req.user.payment !== enumPayment.subscribed)
      return next(new Error("Unauthorized or don't have permission you should subscribe", { cause: 401 }));
    const { cv, jobTitle } = req.body;
    if(!cv || !jobTitle)
        return next(new Error("paste your skills and job title", { cause: 400}));

    const messages = [
        {
            role: enumRole.system,
            content: `You are a professional technical interviewer. Interview the user based on the following CV and job title:\nCV: ${cv}\nJob Title: ${jobTitle} only 15 question`,
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
                model: "mistralai/mistral-7b-instruct",
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

export const continueChat = asyncHandler(async (req, res) => {
  if (!req.user || req.user.payment !== enumPayment.subscribed)
      return next(new Error("Unauthorized or don't have permission you should subscribe", { cause: 401 }));
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages are required." });
  }

  try {
    const completion = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct", // أو أي موديل تاني متاح
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

    const reply = completion.data.choices[0].message.content;
    messages.push({ role: "assistant", content: reply });

    return res.status(200).json({ reply, messages });
  } catch (err) {
    res.status(500).json({
      error: err?.response?.data || "Failed to continue interview",
    });
  }
});
