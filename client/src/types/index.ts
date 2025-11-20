export interface ReviewResult {
  _id: string;
  repoOwner: string;
  repoName: string;
  prNumber: number;
  summary: string;
  aggregated: FileReview[];
  createdAt: string;
}

export interface FileReview {
  file: string;
  logic: AgentResult[];
  security: AgentResult[];
  performance: AgentResult[];
}

export interface AgentResult {
  path: string;
  hunkHeader: string;
  issues: Issue[];
}

export interface Issue {
  category: string;
  approx_line: number;
  message: string;
  priority?: string;
}
