import { Request, Response, NextFunction } from 'express';
import { CommentValidations } from './comment.validations';
import {
    TextTooShortError,
    CommentIdNotValidError,
    TextTooLongError,
    UserIdNotValidError,
    ResourceIdNotValidError,
} from '../../utils/errors/userErrors';

export class CommentValidator {

    static canCreate(req: Request, res: Response, next: NextFunction) {
        next(
            CommentValidator.validateResource(req.body.resource) ||
            CommentValidator.validateParent(req.body.parent) ||
            CommentValidator.validateText(req.body.text) ||
            CommentValidator.validateUser(req.user.id),
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
        if (CommentValidations.isTextLengthTooShort(text)) {
            return new TextTooShortError();
        }

        if (CommentValidations.isTextLengthTooLong(text)) {
            return new TextTooLongError();
        }

        return undefined;
    }

    private static validateId(id: string) {
        if (!CommentValidations.isIdValid(id)) {
            return new CommentIdNotValidError();
        }

        return undefined;
    }

    private static validateUser(user: string) {
        if (!CommentValidations.isUserValid(user)) {
            return new UserIdNotValidError();
        }

        return undefined;
    }

    private static validateResource(resource: string) {
        if (!CommentValidations.isResourceValid(resource)) {
            return new ResourceIdNotValidError();
        }

        return undefined;
    }

    private static validateParent(parent: string | null) {
        if (!CommentValidations.isParentValid(parent)) {
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
