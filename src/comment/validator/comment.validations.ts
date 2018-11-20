import { Types } from 'mongoose';
import { commentValidatorConfig } from './comment.validator.config';

export class CommentValidatons {
    static isTextLengthTooShort(text: string): boolean {
        return (text.length < commentValidatorConfig.text.minLength);
    }

    static isTextLengthTooLong(text: string): boolean {
        return (text.length > commentValidatorConfig.text.maxLength);
    }

    static isUserValid(user: string): boolean {
        const userRegex: RegExp = /\w+@\w+/i;

        return userRegex.test(user);
    }

    static isVideoValid(video: string): boolean {
        return (!!video && Types.ObjectId.isValid(video));
    }

    static isIdValid(id: string): boolean {
        return (!!id && Types.ObjectId.isValid(id));
    }

    static isParentValid(parent: string | null): boolean {
        return (!parent || Types.ObjectId.isValid(parent));
    }
}
