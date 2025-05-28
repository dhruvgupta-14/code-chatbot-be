import { ChatGroq } from "@langchain/groq";
import { configDotenv } from "dotenv";
import express from "express";
import cors from "cors";
configDotenv();
const app = express();
app.use(cors());
app.use(express.json());
const model = new ChatGroq({
  model: "meta-llama/llama-4-scout-17b-16e-instruct",
});
app.listen(process.env.PORT, () => {
  console.log("Server is listening");
});
app.post("/search", async (req, res) => {
  const { language, framework, feature } = req.body;
  try {
    const prompt = `You are an expert AI coding assistant powered by Meta's LLaMA-4 model. 
Your task is to provide **complete documentation-style explanations** that teach beginners how to build a particular feature using the given programming language and framework.

Context:
- Language: ${language}
- Framework/Library: ${framework}
- Feature to Build: ${feature}

Instructions:
1. Start with a clear and concise **introduction** to the feature and its use case in the selected language and framework.
2. Provide a **full, working code example** (as clean as possible) that implements the feature.
3. After the code, give a **step-by-step explanation** of what each part of the code does, in beginner-friendly language.
4. Include **important concepts or terms** a beginner should know to understand the code.
5. Add **extra notes, alternatives, or best practices** if applicable (e.g. security, performance, newer libraries, or known issues).
6. DO NOT expect the user to ask a follow-up. Be fully detailed and explanatory in your response.

Output should feel like a full tutorial or blog post entry that can be read and understood without asking anything further.
`;
    const result = await model.invoke(prompt);
    res.status(200).json({
      success: true,
      result: result,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      result: "Internal Server Error",
    });
  }
});
