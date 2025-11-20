import { LLMClient } from './llm.client';
import { FileChange } from './diffParser.agent';
import { parseLlmJson } from '../../utils/jsonParser';

const PROMPT_TEMPLATE = `You are a senior code reviewer focusing on correctness and logic.\nFile: {path}\nHunk:\n{hunk}\n\nReturn a JSON array of issues where each issue has: category, approx_line, message. Keep responses as valid JSON.`;

export class LogicReviewAgent {
  llm: LLMClient;
  constructor(llm: LLMClient) {
    this.llm = llm;
  }

  async review(file: FileChange) {
    const results: any[] = [];
    for (const h of file.hunks) {
      const prompt = PROMPT_TEMPLATE.replace('{path}', file.path).replace('{hunk}', h.lines.join('\n'));
      const raw = await this.llm.generateReview(prompt);
      const parsed = parseLlmJson(raw);
      if (parsed) {
        results.push({ path: file.path, hunkHeader: h.header, issues: parsed });
      } else {
        results.push({ path: file.path, hunkHeader: h.header, issues: [{ category: 'parsing', approx_line: 0, message: raw }] });
      }
    }
    return results;
  }
}