import { ReviewModel } from './review.model';


export async function saveReview(payload: any) {
const r = new ReviewModel(payload);
return r.save();
}


export async function getReviews(limit = 20) {
return ReviewModel.find().sort({ createdAt: -1 }).limit(limit).lean();
}