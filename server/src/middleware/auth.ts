import { Request, Response, NextFunction } from 'express';


export function authMiddleware(req: Request, res: Response, next: NextFunction) {
// Minimal placeholder. If you want JWT/avatar-based auth, implement here.
next();
}