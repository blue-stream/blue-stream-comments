import { Types } from 'mongoose';
import { config } from '../../config';

export class CommentValidations {
    static isTextLengthTooShort(text: string): boolean {
        return (text.length < config.validator.comment.text.minLength);
    }

    static isTextLengthTooLong(text: string): boolean {
        return (text.length > config.validator.comment.text.maxLength);
    }

    static isUserValid(user: string): boolean {
        const userRegex: RegExp = /\w+@\w+/i;

        return userRegex.test(user);
    }

    static isResourceValid(resource: string): boolean {
        return (!!resource && Types.ObjectId.isValid(resource));
    }

    static isIdValid(id: string): boolean {
        return (!!id && Types.ObjectId.isValid(id));
    }

    static isParentValid(parent: string | null): boolean {
        return (!parent || Types.ObjectId.isValid(parent));
    }
}
