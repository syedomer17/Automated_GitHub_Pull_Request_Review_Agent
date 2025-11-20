import { LLMClient } from './llm.client';
import { FileChange } from './diffParser.agent';
import { parseLlmJson } from '../../utils/jsonParser';

const PROMPT_TEMPLATE_PERF = `You are a performance reviewer.\nFile: {path}\nHunk:\n{hunk}\n\nReturn a JSON array of performance issues: (category, approx_line, message). Examples: O(n^2), unnecessary-io, redundant-alloc.`;

export class PerformanceReviewAgent {
  llm: LLMClient;
  constructor(llm: LLMClient) {
    this.llm = llm;
  }
  async review(file: FileChange) {
    const results: any[] = [];
    for (const h of file.hunks) {
      const prompt = PROMPT_TEMPLATE_PERF.replace('{path}', file.path).replace('{hunk}', h.lines.join('\n'));
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