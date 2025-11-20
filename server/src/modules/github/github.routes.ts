import { Router } from 'express';
import { getPrDiff } from './github.controller';


const router = Router();
router.post('/pr-diff', getPrDiff);


export default router;


// -----------------------------
// src/modules/agents/diffParser.agent.ts
// -----------------------------
export interface FileChange {
path: string;
oldPath?: string | null;
newPath?: string | null;
hunks: Array<{ header: string; lines: string[] }>;
}


// Lightweight unified diff parser. Good enough for PR diffs from GitHub.
export function parseUnifiedDiff(diff: string): FileChange[] {
if (!diff) return [];
const lines = diff.split('\n');
const files: FileChange[] = [];
let current: FileChange | null = null;
let hunkLines: string[] = [];
let hunkHeader = '';


for (let i = 0; i < lines.length; i++) {
const line = lines[i];
if (line.startsWith('diff --git')) {
if (current) {
if (hunkLines.length) current.hunks.push({ header: hunkHeader, lines: hunkLines });
files.push(current);
}
// Try to read path from the next tokens
const parts = line.split(' ');
const rawPath = parts[2] || '';
const path = rawPath.replace('a/', '').trim();
current = { path: path || `unknown_${files.length}`, hunks: [] } as FileChange;
hunkLines = [];
hunkHeader = '';
continue;
}
if (!current) continue;
if (line.startsWith('@@')) {
if (hunkLines.length) current.hunks.push({ header: hunkHeader, lines: hunkLines });
hunkHeader = line;
hunkLines = [];
continue;
}
// collect relevant lines
hunkLines.push(line);
}


if (current) {
if (hunkLines.length) current.hunks.push({ header: hunkHeader, lines: hunkLines });
files.push(current);
}
return files;
}