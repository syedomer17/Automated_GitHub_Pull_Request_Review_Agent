import React from 'react';

interface HeaderProps {
  activeTab: 'new' | 'history';
  setActiveTab: (tab: 'new' | 'history') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold">
          PR
        </div>
        <h1 className="text-xl font-semibold tracking-tight">Review Agent</h1>
      </div>
      <nav className="flex gap-4 text-sm font-medium text-gray-600">
        <button 
          onClick={() => setActiveTab('new')}
          className={`px-3 py-1 rounded-md transition-colors ${activeTab === 'new' ? 'bg-gray-100 text-gray-900' : 'hover:text-gray-900'}`}
        >
          New Review
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`px-3 py-1 rounded-md transition-colors ${activeTab === 'history' ? 'bg-gray-100 text-gray-900' : 'hover:text-gray-900'}`}
        >
          History
        </button>
      </nav>
    </header>
  );
};
