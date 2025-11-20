import React from 'react';
import type { ReviewResult } from '../types';

interface HistoryListProps {
  history: ReviewResult[];
  onSelect: (item: ReviewResult) => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({ history, onSelect }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium">Recent Reviews</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {history.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No history available</div>
        ) : (
          history.map((item) => (
            <div key={item._id} className="p-6 hover:bg-gray-50 transition-colors flex items-center justify-between group">
              <div>
                <h3 className="text-base font-medium text-gray-900">
                  {item.repoOwner}/{item.repoName} <span className="text-gray-500">#{item.prNumber}</span>
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => onSelect(item)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                View Report
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
