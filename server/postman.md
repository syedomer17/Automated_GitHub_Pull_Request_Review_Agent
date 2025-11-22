# Postman Testing Guide

Follow these steps to test the Automated GitHub Pull Request Review Agent API using Postman.

## Prerequisites

1.  **Start the Server**: Ensure your backend server is running.
    ```bash
    cd server
    npm run dev
    ```
2.  **Check the Port**: Look at your terminal output to confirm the port (default is `3000` or `6060`). Replace `{{PORT}}` in the URLs below with your actual port (e.g., `http://localhost:6060`).

---

## Endpoints

### 1. Fetch PR Diff
Retrieves the raw unified diff for a specific Pull Request from GitHub.

*   **Method**: `POST`
*   **URL**: `http://localhost:{{PORT}}/api/github/pr-diff`
*   **Headers**:
    *   `Content-Type`: `application/json`
*   **Body (JSON)**:
    ```json
    {
      "owner": "facebook",
      "repo": "react",
      "prNumber": 28756
    }
    ```
    *(This is a real PR from the React repository. You can also use your own repo details if you have an open PR)*

*   **Expected Response**:
    ```json
    {
      "success": true,
      "message": "OK",
      "data": {
        "diff": "diff --git a/file.ts b/file.ts\n..."
      }
    }
    ```
    **Action**: Copy the `diff` string from the response `data` for the next step.

---

### 2. Run Review
Triggers the multi-agent AI system to analyze the provided diff.

*   **Method**: `POST`
*   **URL**: `http://localhost:{{PORT}}/api/review/run`
*   **Headers**:
    *   `Content-Type`: `application/json`
*   **Body (JSON)**:
    ```json
    {
      "owner": "facebook",
      "repo": "react",
      "prNumber": 28756,
      "diff": "diff --git a/packages/react-refresh/src/ReactFreshRuntime.js b/packages/react-refresh/src/ReactFreshRuntime.js\nindex 48eb2a66015f2..49dc35094841f 100644\n--- a/packages/react-refresh/src/ReactFreshRuntime.js\n+++ b/packages/react-refresh/src/ReactFreshRuntime.js\n@@ -192,10 +192,7 @@ export function performReactRefresh(): RefreshUpdate | null {\n       'Unexpected call to React Refresh in a production environment.',\n     );\n   }\n-  if (pendingUpdates.length === 0) {\n-    return null;\n-  }\n-  if (isPerformingRefresh) {\n+  if (pendingUpdates.length === 0 || isPerformingRefresh) {\n     return null;\n   }\n \n"
    }
    ```
    *(This uses the diff from the React PR example above)*

*   **Expected Response**:
    ```json
    {
      "success": true,
      "message": "OK",
      "data": {
        "saved": {
          "repoOwner": "syedomer17",
          "aggregated": [
            {
              "file": "src/app.ts",
              "logic": [...],
              "security": [...],
              "performance": [...]
            }
          ],
          ...
        }
      }
    }
    ```

---

### 3. List Reviews
Retrieves a history of past reviews stored in the database.

*   **Method**: `GET`
*   **URL**: `http://localhost:{{PORT}}/api/review/list`
*   **Body**: None

*   **Expected Response**:
    ```json
    {
      "success": true,
      "message": "OK",
      "data": {
        "items": [
          {
            "_id": "...",
            "repoOwner": "facebook",
            "repoName": "react",
            "prNumber": 28756,
            "summary": "Auto-generated review",
            "createdAt": "2025-11-20T..."
          }
          // ... more items
        ]
      }
    }
    ```

---

### 4. Test with Public Repository (No Token Required)
If you are having trouble with your private repository, try this public example to verify the API works.

*   **Method**: `POST`
*   **URL**: `http://localhost:{{PORT}}/api/github/pr-diff`
*   **Body**:
    ```json
    {
      "owner": "facebook",
      "repo": "react",
      "prNumber": 28756
    }
    ```
