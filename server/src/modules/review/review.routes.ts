import { Router } from 'express';
import { runReview, listReviews } from './review.controller';


const router = Router();
router.post('/run', runReview);
router.get('/list', listReviews);


export default router;