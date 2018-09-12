import { Types } from 'mongoose';

export class CommentValidatons {
    static isPropertyValid(property: string): boolean {
        return (!!property && property.length < 10);
    }

    static isIdValid(id: string): boolean {
        return (!!id && Types.ObjectId.isValid(id));
    }
}
