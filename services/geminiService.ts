import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import type { Transaction } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFinancialAdvice = async (prompt: string, financialData: object) => {
  try {
    const model = 'gemini-2.5-flash';
    
    const fullPrompt = `
      **System Instruction:**
      You are an expert financial advisor named 'Fin-Bot'. Your goal is to provide helpful, clear, and encouraging financial advice to the user.
      - Analyze the user's financial data provided below.
      - Answer the user's question directly and concisely.
      - Use the provided data to support your advice with specific examples.
      - All monetary values are in Vietnamese Dong (VND). Format large numbers with commas for readability (e.g., 1,000,000 VND).
      - Your tone should be professional yet friendly. Avoid jargon.
      - Structure your response using markdown for better readability (headings, lists, bold text).
      - Do not lecture or criticize the user's spending habits. Instead, focus on positive suggestions and potential improvements.

      **User's Financial Data (JSON):**
      \`\`\`json
      ${JSON.stringify(financialData, null, 2)}
      \`\`\`

      **User's Question:**
      "${prompt}"

      **Your Analysis and Advice:**
    `;

    const response = await ai.models.generateContent({
        model: model,
        contents: fullPrompt
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Rất tiếc, đã có lỗi xảy ra khi kết nối với chuyên gia tài chính AI. Vui lòng thử lại sau.";
  }
};


export const analyzeBillImage = async (base64Image: string, mimeType: string, availableCategories: string[]): Promise<{
  description?: string;
  amount?: number;
  category?: string;
}> => {
  try {
    const model = 'gemini-2.5-flash';

    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: base64Image,
      },
    };
    
    const textPart = {
      text: `
        Analyze this receipt/bill image and extract the following information in JSON format:
        1. "description": A short, suitable description for the transaction (e.g., "Grocery shopping", "Dinner at restaurant"). Infer this from the store name or items.
        2. "amount": The final total amount paid. It must be a number, without any currency symbols or commas.
        3. "category": Suggest a relevant expense category from this list: ${JSON.stringify(availableCategories)}.

        If any field cannot be determined, omit it from the JSON. The response must be a valid JSON object.
      `
    };

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        description: { type: Type.STRING },
        amount: { type: Type.NUMBER },
        category: { type: Type.STRING },
      },
    };

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);

  } catch (error) {
    console.error("Error analyzing bill image with Gemini API:", error);
    return {};
  }
};

export interface ForecastResult {
  predictedIncome: number;
  predictedExpenses: number;
  predictedSavings: number;
  analysis: string;
}

export const getForecast = async (transactions: Transaction[]): Promise<ForecastResult> => {
  try {
    const model = 'gemini-2.5-flash';

    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    const recentTransactions = transactions.filter(t => new Date(t.date) >= ninetyDaysAgo);

    if (recentTransactions.length === 0) {
        return {
            predictedIncome: 0,
            predictedExpenses: 0,
            predictedSavings: 0,
            analysis: "Không có dữ liệu giao dịch gần đây để phân tích."
        };
    }
    
    const textPart = {
      text: `
        **System Instruction:**
        You are a financial analyst AI. Your task is to predict cash flow for the next 30 days based on the user's past transaction history provided in JSON format. All monetary values are in Vietnamese Dong (VND).

        **User's Transaction History (last 90 days):**
        \`\`\`json
        ${JSON.stringify(recentTransactions, null, 2)}
        \`\`\`

        **Task:**
        Based on the provided transaction history, analyze spending and income patterns. Then, predict the total income, total expenses, and the resulting net savings for the **next 30 days**. Provide a brief, insightful analysis (2-3 sentences) of the forecast, mentioning any notable patterns or suggestions.

        **Output Format:**
        The response must be a valid JSON object matching the provided schema. Do not include any markdown or other text outside of the JSON object.
      `
    };

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        predictedIncome: { type: Type.NUMBER, description: "Dự báo tổng thu nhập trong 30 ngày tới." },
        predictedExpenses: { type: Type.NUMBER, description: "Dự báo tổng chi tiêu trong 30 ngày tới." },
        predictedSavings: { type: Type.NUMBER, description: "Dự báo khoản tiết kiệm ròng (thu nhập - chi tiêu)." },
        analysis: { type: Type.STRING, description: "Một đoạn phân tích ngắn gọn về dự báo." },
      },
      required: ["predictedIncome", "predictedExpenses", "predictedSavings", "analysis"]
    };

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: { parts: [textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as ForecastResult;

  } catch (error) {
    console.error("Error getting forecast from Gemini API:", error);
    throw new Error("Failed to generate forecast.");
  }
};