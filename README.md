# Automated GitHub Pull Request Review Agent

An intelligent, multi-agent system that automates code reviews for GitHub Pull Requests. It uses Large Language Models (Google Gemini) to analyze code changes and provide structured feedback on **Logic**, **Security**, and **Performance**.

## 🚀 Features

*   **Automated Diff Analysis**: Fetches PR diffs directly from GitHub.
*   **Multi-Agent Architecture**:
    *   **Logic Agent**: Checks for correctness, bugs, and logical errors.
    *   **Security Agent**: Identifies potential vulnerabilities (e.g., injection, secrets).
    *   **Performance Agent**: Suggests optimizations for speed and efficiency.
*   **Interactive Dashboard**: A clean React-based UI to trigger reviews and view results.
*   **History Tracking**: Saves past reviews for future reference.

## 📂 Project Structure

```
Automated_GitHub_Pull_Request_Review_Agent/
├── client/                 # Frontend (React + Vite + TailwindCSS)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Main application pages
│   │   └── types/          # TypeScript definitions
│   └── ...
├── server/                 # Backend (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── config/         # Environment & DB configuration
│   │   ├── modules/
│   │   │   ├── agents/     # AI Agents (Orchestrator, Logic, Security, Performance)
│   │   │   ├── github/     # GitHub API integration
│   │   │   └── review/     # Review management logic
│   │   └── utils/          # Helper functions (Logger, JSON Parser)
│   └── ...
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites

*   **Node.js** (v18 or higher)
*   **MongoDB** (Local or Atlas connection string)
*   **Google Gemini API Key** (for LLM capabilities)
*   **GitHub Personal Access Token** (for fetching PRs)

### 1. Backend Setup

1.  Navigate to the server directory:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `server` directory:
    ```env
    PORT=6060
    MONGODB_URI=
    GITHUB_TOKEN=your_github_token_here
    GOOGLE_API_KEY=your_gemini_api_key_here
    ```
4.  Start the server:
    ```bash
    npm run dev
    ```
    The server will start on `http://localhost:6060`.

### 2. Frontend Setup

1.  Open a new terminal and navigate to the client directory:
    ```bash
    cd client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  Open your browser and visit `http://localhost:5173`.

## 📖 Usage

1.  Open the frontend dashboard.
2.  Enter the **Owner**, **Repository Name**, and **PR Number** of the Pull Request you want to review.
3.  Click **Start Review**.
4.  The system will fetch the diff, run the AI agents, and display the results categorized by Logic, Security, and Performance.
5.  You can view past reviews in the **History** tab.

## 🏗️ Tech Stack

*   **Frontend**: React, Vite, TailwindCSS, TypeScript
*   **Backend**: Node.js, Express, TypeScript, Mongoose
*   **AI/LLM**: Google Gemini API (`gemini-2.5-pro`)
*   **Database**: MongoDB