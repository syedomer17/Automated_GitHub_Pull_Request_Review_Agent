import { Request, Response, NextFunction } from 'express';
import { OrchestratorAgent } from '../agents/orchestrator.agent';
import { success, fail } from '../../utils/apiResponse';
import { saveReview, getReviews } from './review.service';


const orch = new OrchestratorAgent();


export async function runReview(req: Request, res: Response, next: NextFunction) {
try {
const { diff, owner, repo, prNumber } = req.body;
if (!diff) return res.status(400).json(fail('diff is required'));


const aggregated = await orch.reviewDiff(diff);


const payload = {
repoOwner: owner || 'unknown',
repoName: repo || 'unknown',
prNumber: prNumber || 0,
summary: 'Auto-generated review',
aggregated,
comments: [],
};


const saved = await saveReview(payload);
res.json(success({ saved }));
} catch (err) {
next(err);
}
}


export async function listReviews(req: Request, res: Response, next: NextFunction) {
try {
const items = await getReviews();
res.json(success({ items }));
} catch (err) {
next(err);
}
}