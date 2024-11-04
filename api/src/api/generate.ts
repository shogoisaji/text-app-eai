import { GoogleGenerativeAI } from "@google/generative-ai";

async function generate(text: string, apiKey: string): Promise<string> {
  const defaultText =
    "すべて日本語で回答すること。出力はすべてマークダウン形式でコードはコードブロック。";
  try {
    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `${defaultText}: ${text}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    return await response.text();
  } catch (error) {
    throw error;
  }
}

export { generate };
