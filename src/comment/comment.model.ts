
import * as mongoose from 'mongoose';
import { IComment } from './comment.interface';

const commentSchema: mongoose.Schema = new mongoose.Schema(
    {
        property: { type: String, required: true },
    },
    {
        autoIndex: false,
        timestamps: true,
        id: true,
    });

export const CommentModel = mongoose.model<IComment & mongoose.Document>('Comment', commentSchema);
