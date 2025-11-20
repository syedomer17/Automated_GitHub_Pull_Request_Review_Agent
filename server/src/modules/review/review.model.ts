import mongoose from 'mongoose';


const CommentSchema = new mongoose.Schema({
path: String,
line: Number,
message: String,
category: String
}, { _id: false });


const ReviewSchema = new mongoose.Schema({
repoOwner: String,
repoName: String,
prNumber: Number,
summary: String,
aggregated: mongoose.Schema.Types.Mixed,
comments: [CommentSchema],
createdAt: { type: Date, default: Date.now }
});


export const ReviewModel = mongoose.model('Review', ReviewSchema);