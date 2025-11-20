import { Request, Response, NextFunction } from 'express';
import { fetchPRDiff } from './github.service';
import { success, fail } from '../../utils/apiResponse';


export async function getPrDiff(req: Request, res: Response, next: NextFunction) {
try {
const { owner, repo, prNumber } = req.body;
const token = process.env.GITHUB_TOKEN;
if (!owner || !repo || !prNumber) return res.status(400).json(fail('Missing params'));
const diff = await fetchPRDiff(owner, repo, prNumber, token);
res.json(success({ diff }));
} catch (err) {
next(err);
}
}