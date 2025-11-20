import React from 'react';

interface ReviewFormProps {
  owner: string;
  setOwner: (val: string) => void;
  repo: string;
  setRepo: (val: string) => void;
  prNumber: string;
  setPrNumber: (val: string) => void;
  loading: boolean;
  status: string;
  onSubmit: (e: React.FormEvent) => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  owner, setOwner,
  repo, setRepo,
  prNumber, setPrNumber,
  loading, status, onSubmit
}) => {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <h2 className="text-lg font-medium mb-4">Target PR</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Owner</label>
          <input
            type="text"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g. facebook"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Repository</label>
          <input
            type="text"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g. react"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">PR Number</label>
          <input
            type="number"
            value={prNumber}
            onChange={(e) => setPrNumber(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g. 28756"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${
            loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Analyzing...' : 'Start Review'}
        </button>
      </form>
      {status && (
        <div className={`mt-4 p-3 rounded-md text-sm ${status.startsWith('Error') ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
          {status}
        </div>
      )}
    </div>
  );
};
