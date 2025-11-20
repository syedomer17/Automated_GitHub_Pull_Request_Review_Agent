import { FileChange, parseUnifiedDiff } from './diffParser.agent';
import { LLMClient } from './llm.client';
import { LogicReviewAgent } from './logicReview.agent';
import { SecurityReviewAgent } from './securityReview.agent';
import { PerformanceReviewAgent } from './performanceReview.agent';


export class OrchestratorAgent {
llm: LLMClient;
logic: LogicReviewAgent;
security: SecurityReviewAgent;
perf: PerformanceReviewAgent;


constructor() {
this.llm = new LLMClient();
this.logic = new LogicReviewAgent(this.llm);
this.security = new SecurityReviewAgent(this.llm);
this.perf = new PerformanceReviewAgent(this.llm);
}


async reviewDiff(diff: string) {
const files: FileChange[] = parseUnifiedDiff(diff);
const aggregated: any[] = [];


for (const file of files) {
// Run agents in parallel per file
const [logicRes, secRes, perfRes] = await Promise.all([
this.logic.review(file),
this.security.review(file),
this.perf.review(file),
]);


aggregated.push({ file: file.path, logic: logicRes, security: secRes, performance: perfRes });
}
return aggregated;
}
}