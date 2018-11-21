import { Request, Response, NextFunction } from 'express';
import { CommentValidatons } from './comment.validations';
import {
    TextTooShortError,
    CommentIdNotValidError,
    TextTooLongError,
    UserIdNotValidError,
    VideoIdNotValidError,
} from '../../utils/errors/userErrors';
import { IComment } from '../comment.interface';

export class CommentValidator {

    static canCreate(req: Request, res: Response, next: NextFunction) {
        next(
            CommentValidator.validateVideo(req.body.video) ||
            CommentValidator.validateParent(req.body.parent) ||
            CommentValidator.validateText(req.body.text) ||
            CommentValidator.validateUser(req.body.user),
        );
    }

    static canUpdateTextById(req: Request, res: Response, next: NextFunction) {
        next(
            CommentValidator.validateId(req.params.id) ||
            CommentValidator.validateText(req.body.text),
        );
    }

    static canDeleteById(req: Request, res: Response, next: NextFunction) {
        next(CommentValidator.validateId(req.params.id));
    }

    static canGetById(req: Request, res: Response, next: NextFunction) {
        next(CommentValidator.validateId(req.params.id));
    }

    static canGetOne(req: Request, res: Response, next: NextFunction) {
        next();
    }

    static canGetMany(req: Request, res: Response, next: NextFunction) {
        next();
    }

    static canGetAmount(req: Request, res: Response, next: NextFunction) {
        next();
    }

    private static validateText(text: string) {
        if (CommentValidatons.isTextLengthTooShort(text)) {
            return new TextTooShortError();
        }

        if (CommentValidatons.isTextLengthTooLong(text)) {
            return new TextTooLongError();
        }

        return undefined;
    }

    private static validateId(id: string) {
        if (!CommentValidatons.isIdValid(id)) {
            return new CommentIdNotValidError();
        }

        return undefined;
    }

    private static validateUser(user: string) {
        if (!CommentValidatons.isUserValid(user)) {
            return new UserIdNotValidError();
        }

        return undefined;
    }

    private static validateVideo(video: string) {
        if (!CommentValidatons.isVideoValid(video)) {
            return new VideoIdNotValidError();
        }

        return undefined;
    }

    private static validateParent(parent: string | null) {
        if (!CommentValidatons.isParentValid(parent)) {
            return new CommentIdNotValidError();
        }

        return undefined;
    }

    private static getNextValueFromArray(validationsArray: (Error | undefined)[]) {
        let nextValue: Error | undefined;

        for (let index = 0; index < validationsArray.length; index++) {
            if (validationsArray[index] !== undefined) {
                nextValue = validationsArray[index];
            }
        }

        return nextValue;
    }
}
