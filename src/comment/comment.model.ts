
import * as mongoose from 'mongoose';
import { IComment } from './comment.interface';
import { commentValidatorConfig } from './validator/comment.validator.config';

const commentSchema: mongoose.Schema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true,
            validate: {
                validator: (text: string) => {
                    return ((text.length >= commentValidatorConfig.text.minLength) &&
                        (text.length <= commentValidatorConfig.text.maxLength));
                },
            },
        },
        video: {
            type: String,
            required: true,
        },
        parent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comments',
        },
        user: {
            type: String,
            required: true,
        },
    },
    {
        autoIndex: false,
        timestamps: true,
        id: true,
    });

export const CommentModel = mongoose.model<IComment & mongoose.Document>('Comment', commentSchema);
