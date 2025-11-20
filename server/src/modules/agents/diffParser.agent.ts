export interface FileChange {
  path: string;
  oldPath?: string | null;
  newPath?: string | null;
  hunks: Array<{ header: string; lines: string[] }>;
}

export function parseUnifiedDiff(diff: string): FileChange[] {
  const files: FileChange[] = [];
  let currentFile: FileChange | null = null;
  let currentHunk: { header: string; lines: string[] } | null = null;

  const lines = diff.split('\n');

  for (const line of lines) {
    if (line.startsWith('diff --git')) {
      if (currentFile) {
        if (currentHunk) currentFile.hunks.push(currentHunk);
        files.push(currentFile);
      }
      currentFile = { path: '', hunks: [] };
      currentHunk = null;
      // Extract path roughly
      const parts = line.split(' ');
      if (parts.length >= 4) {
        currentFile.path = parts[parts.length - 1].substring(2); // remove b/
      }
    } else if (line.startsWith('--- a/')) {
      if (currentFile) currentFile.oldPath = line.substring(6);
    } else if (line.startsWith('+++ b/')) {
      if (currentFile) currentFile.newPath = line.substring(6);
      if (currentFile && !currentFile.path) currentFile.path = line.substring(6);
    } else if (line.startsWith('@@')) {
      if (currentFile && currentHunk) {
        currentFile.hunks.push(currentHunk);
      }
      currentHunk = { header: line, lines: [] };
    } else {
      if (currentHunk) {
        currentHunk.lines.push(line);
      }
    }
  }

  if (currentFile) {
    if (currentHunk) currentFile.hunks.push(currentHunk);
    files.push(currentFile);
  }

  return files;
}
