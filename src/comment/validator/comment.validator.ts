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
            CommentValidator.validateVideo(req.body.comment.video) ||
            CommentValidator.validateParent(req.body.comment.parent) ||
            CommentValidator.validateText(req.body.comment.text) ||
            CommentValidator.validateUser(req.body.comment.user),
        );
    }

    static canUpdateById(req: Request, res: Response, next: NextFunction) {
        next(
            CommentValidator.validateId(req.params.id) ||
            CommentValidator.validateVideo(req.body.comment.video) ||
            CommentValidator.validateParent(req.body.comment.parent) ||
            CommentValidator.validateText(req.body.comment.text) ||
            CommentValidator.validateUser(req.body.comment.user),
        );
    }

    static canDeleteById(req: Request, res: Response, next: NextFunction) {
        next(CommentValidator.validateId(req.params.id));
    }

    static canGetById(req: Request, res: Response, next: NextFunction) {
        next(CommentValidator.validateId(req.params.id));
    }

    static canGetOne(req: Request, res: Response, next: NextFunction) {
        next(
            CommentValidator.validateVideo(req.query.video) ||
            CommentValidator.validateParent(req.query.parent) ||
            CommentValidator.validateText(req.query.text) ||
            CommentValidator.validateUser(req.query.user),
        );
    }

    static canGetMany(req: Request, res: Response, next: NextFunction) {
        next(
            CommentValidator.validateVideo(req.query.video) ||
            CommentValidator.validateParent(req.query.parent) ||
            CommentValidator.validateText(req.query.text) ||
            CommentValidator.validateUser(req.query.user),
        );
    }

    static canGetAmount(req: Request, res: Response, next: NextFunction) {
        next(
            CommentValidator.validateVideo(req.query.video) ||
            CommentValidator.validateParent(req.query.parent) ||
            CommentValidator.validateText(req.query.text) ||
            CommentValidator.validateUser(req.query.user),
        );
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

    private static validateParent(parent: string) {
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
