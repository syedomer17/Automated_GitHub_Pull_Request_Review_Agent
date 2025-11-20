import React from 'react';
import type { ReviewResult as ReviewResultType, FileReview, AgentResult } from '../types';

interface ReviewResultProps {
  result: ReviewResultType;
}

export const ReviewResult: React.FC<ReviewResultProps> = ({ result }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Review Results</h2>
            <p className="text-gray-500 text-sm mt-1">
              {result.repoOwner}/{result.repoName} #{result.prNumber} • {new Date(result.createdAt).toLocaleString()}
            </p>
          </div>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            Completed
          </span>
        </div>
        <div className="prose prose-sm max-w-none text-gray-700 bg-gray-50 p-4 rounded-md border border-gray-100">
          <p>{result.summary}</p>
        </div>
      </div>

      <div className="space-y-4">
        {result.aggregated.map((file, idx) => (
          <FileReviewCard key={idx} file={file} />
        ))}
      </div>
    </div>
  );
};

function FileReviewCard({ file }: { file: FileReview }) {
  const hasIssues = file.logic.some(r => r.issues.length > 0) || 
                    file.security.some(r => r.issues.length > 0) || 
                    file.performance.some(r => r.issues.length > 0);

  if (!hasIssues) {
    return (
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
        <div className="font-mono text-sm text-gray-700 truncate max-w-md" title={file.file}>
          {file.file}
        </div>
        <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-md">
          No Issues Found
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <div className="font-mono text-sm font-medium text-gray-800 truncate" title={file.file}>
          {file.file}
        </div>
      </div>
      <div className="p-4 space-y-6">
        <IssueSection title="Logic & Correctness" results={file.logic} color="blue" />
        <IssueSection title="Security" results={file.security} color="red" />
        <IssueSection title="Performance" results={file.performance} color="amber" />
      </div>
    </div>
  );
}

function IssueSection({ title, results, color }: { title: string, results: AgentResult[], color: 'blue' | 'red' | 'amber' }) {
  const issues = results.flatMap(r => r.issues);
  if (issues.length === 0) return null;

  const colorClasses = {
    blue: 'bg-blue-50 text-blue-800 border-blue-100',
    red: 'bg-red-50 text-red-800 border-red-100',
    amber: 'bg-amber-50 text-amber-800 border-amber-100',
  };

  return (
    <div>
      <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2 ${color === 'red' ? 'text-red-600' : color === 'amber' ? 'text-amber-600' : 'text-blue-600'}`}>
        {title}
        <span className="px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px]">{issues.length}</span>
      </h4>
      <div className="space-y-3">
        {issues.map((issue, i) => (
          <div key={i} className={`p-3 rounded-md border text-sm ${colorClasses[color]}`}>
            <div className="flex justify-between items-start mb-1">
              <span className="font-semibold capitalize text-xs opacity-80">{issue.category}</span>
              {issue.approx_line > 0 && (
                <span className="font-mono text-xs opacity-60">Line {issue.approx_line}</span>
              )}
            </div>
            <p className="leading-relaxed">{issue.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
