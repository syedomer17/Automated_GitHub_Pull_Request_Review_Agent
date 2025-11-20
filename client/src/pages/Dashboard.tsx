import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { ReviewForm } from '../components/ReviewForm';
import { ReviewResult } from '../components/ReviewResult';
import { HistoryList } from '../components/HistoryList';
import type { ReviewResult as ReviewResultType } from '../types';

export const Dashboard: React.FC = () => {
  // State
  const [owner, setOwner] = useState('facebook');
  const [repo, setRepo] = useState('react');
  const [prNumber, setPrNumber] = useState('28756');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [result, setResult] = useState<ReviewResultType | null>(null);
  const [history, setHistory] = useState<ReviewResultType[]>([]);
  const [activeTab, setActiveTab] = useState<'new' | 'history'>('new');

  const API_BASE = 'http://localhost:6060/api';

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_BASE}/review/list`);
      const data = await res.json();
      if (data.success) {
        setHistory(data.data.items);
      }
    } catch (err) {
      console.error('Failed to fetch history', err);
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('Fetching PR Diff...');
    setResult(null);

    try {
      // 1. Fetch Diff
      const diffRes = await fetch(`${API_BASE}/github/pr-diff`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ owner, repo, prNumber: Number(prNumber) }),
      });
      const diffData = await diffRes.json();

      if (!diffData.success || !diffData.data.diff) {
        throw new Error(diffData.message || 'Failed to fetch diff');
      }

      const diff = diffData.data.diff;
      setStatus('Running AI Agents (Logic, Security, Performance)...');

      // 2. Run Review
      const reviewRes = await fetch(`${API_BASE}/review/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ owner, repo, prNumber: Number(prNumber), diff }),
      });
      const reviewData = await reviewRes.json();

      if (!reviewData.success) {
        throw new Error(reviewData.message || 'Review failed');
      }

      setResult(reviewData.data.saved);
      setStatus('');
      fetchHistory(); // Refresh history
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const loadFromHistory = (item: ReviewResultType) => {
    setResult(item);
    setOwner(item.repoOwner);
    setRepo(item.repoName);
    setPrNumber(String(item.prNumber));
    setActiveTab('new');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'new' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Input */}
            <div className="lg:col-span-1 space-y-6">
              <ReviewForm
                owner={owner} setOwner={setOwner}
                repo={repo} setRepo={setRepo}
                prNumber={prNumber} setPrNumber={setPrNumber}
                loading={loading} status={status}
                onSubmit={handleAnalyze}
              />

              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">How it works</h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex gap-2">
                    <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold">1</span>
                    Fetches PR diff from GitHub
                  </li>
                  <li className="flex gap-2">
                    <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold">2</span>
                    Parses code changes
                  </li>
                  <li className="flex gap-2">
                    <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold">3</span>
                    Runs Logic, Security, & Performance agents
                  </li>
                  <li className="flex gap-2">
                    <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold">4</span>
                    Aggregates results
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Column: Results */}
            <div className="lg:col-span-2">
              {result ? (
                <ReviewResult result={result} />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 min-h-[400px] border-2 border-dashed border-gray-200 rounded-lg">
                  <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-lg font-medium">No review selected</p>
                  <p className="text-sm">Run a new analysis or select from history</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* History Tab */
          <HistoryList history={history} onSelect={loadFromHistory} />
        )}
      </main>
    </div>
  );
};
