import { GoogleGenAI } from '@google/genai';
import logger from '../../utils/logger';

export class LLMClient {
  private genAI: GoogleGenAI;
  private modelDefault = 'gemini-2.5-pro';

  constructor() {
    const apiKey = process.env.GOOGLE_API_KEY || '';
    if (!apiKey) {
      logger.warn('GOOGLE_API_KEY is not set');
    }
    this.genAI = new GoogleGenAI({ apiKey });
  }

  async generateReview(prompt: string, modelName = this.modelDefault) {
    let lastError;
    const maxRetries = 3;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await this.genAI.models.generateContent({
          model: modelName,
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }],
            },
          ],
        });

        const rawText = response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

        if (!rawText) {
          throw new Error('Gemini response did not contain text.');
        }

        return rawText;
      } catch (err: any) {
        lastError = err;
        logger.warn(`LLM attempt ${attempt} failed with model ${modelName}: ${err.message || err}`);

        // Check if it's a 503 or overload error, or just retry generic errors for robustness
        if (attempt < maxRetries) {
          const waitTime = Math.pow(2, attempt) * 1000;
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }
      }
    }

    logger.error('LLM generate error after retries', lastError?.message || lastError);
    throw new Error('LLM generation failed');
  }
}