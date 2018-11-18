
import * as mongoose from 'mongoose';
import { IComment } from './comment.interface';
import { commentValidatorConfig } from './validator/comment.validator.config';
import { CommentValidatons } from './validator/comment.validations';

const commentSchema: mongoose.Schema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true,
            validate: {
                validator: (text: string) => {
                    return (!CommentValidatons.isTextLengthTooShort(text) &&
                        (!CommentValidatons.isTextLengthTooLong(text)));
                },
            },
        },
        video: {
            type: String,
            required: true,
            validate: {
                validator: (text: string) => {
                    return CommentValidatons.isVideoValid(text);
                },
            },
        },
        parent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comments',
            validate: {
                validator: (text: string) => {
                    return CommentValidatons.isParentValid(text);
                },
            },
        },
        user: {
            type: String,
            required: true,
            validate: {
                validator: (text: string) => {
                    return CommentValidatons.isUserValid(text);
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
                ret.parent = (ret.parent as mongoose.Types.ObjectId).toHexString();
            },
        },
        toJSON: {
            transform: (doc, ret) => {
                ret.parent = (ret.parent as mongoose.Types.ObjectId).toHexString();
            },
        },
    });

export const CommentModel = mongoose.model<IComment & mongoose.Document>('Comment', commentSchema);
