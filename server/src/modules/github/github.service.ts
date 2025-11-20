import axios from 'axios';
import logger from '../../utils/logger';


const GITHUB_BASE = 'https://api.github.com';


export async function fetchPRDiff(owner: string, repo: string, prNumber: number, token?: string) {
const url = `${GITHUB_BASE}/repos/${owner}/${repo}/pulls/${prNumber}`;
const headers: any = { Accept: 'application/vnd.github.v3.diff' };
if (token) headers.Authorization = `token ${token}`;


try {
    logger.info(`Fetching PR diff from: ${url}`);
    const res = await axios.get(url, { headers });
    return res.data as string; // raw unified diff
  } catch (err: any) {
    const msg = err.response?.status ? `${err.response.status} ${err.response.statusText}` : err.message;
    logger.error('Failed to fetch PR diff', msg);
    throw new Error(`Unable to fetch PR diff from GitHub: ${msg}`);
  }
}