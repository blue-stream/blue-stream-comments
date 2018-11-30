
import * as mongoose from 'mongoose';
import { IComment } from './comment.interface';
import { CommentValidations } from './validator/comment.validations';

const commentSchema: mongoose.Schema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true,
            validate: {
                validator: (text: string) => {
                    return (!CommentValidations.isTextLengthTooShort(text) &&
                        (!CommentValidations.isTextLengthTooLong(text)));
                },
            },
        },
        video: {
            type: String,
            required: true,
            validate: {
                validator: (text: string) => {
                    return CommentValidations.isVideoValid(text);
                },
            },
        },
        parent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
            default: null,
            validate: {
                validator: (text: string | null) => {
                    return CommentValidations.isParentValid(text);
                },
            },
        },
        user: {
            type: String,
            required: true,
            validate: {
                validator: (text: string) => {
                    return CommentValidations.isUserValid(text);
                },
            },
        },
    },
    {
        autoIndex: false,
        timestamps: true,
        id: true,
        toObject: {
            transform: (doc, ret) => {
                if (ret.parent) {
                    ret.parent = (ret.parent as mongoose.Types.ObjectId).toHexString();
                }
            },
        },
        toJSON: {
            transform: (doc, ret) => {
                if (ret.parent) {
                    ret.parent = (ret.parent as mongoose.Types.ObjectId).toHexString();
                }
            },
        },
    });

export const CommentModel = mongoose.model<IComment & mongoose.Document>('Comment', commentSchema);
