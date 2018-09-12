import { Request, Response, NextFunction } from 'express';
import { CommentValidatons } from './comment.validations';
import { PropertyInvalidError, IdInvalidError } from '../../utils/errors/userErrors';
import { IComment } from '../comment.interface';

export class CommentValidator {

    static canCreate(req: Request, res: Response, next: NextFunction) {
        next(CommentValidator.validateProperty(req.body.comment.property));
    }

    static canCreateMany(req: Request, res: Response, next: NextFunction) {
        const propertiesValidations: (Error | undefined)[] = req.body.comments.map((comment: IComment) => {
            return CommentValidator.validateProperty(comment.property);
        });

        next(CommentValidator.getNextValueFromArray(propertiesValidations));
    }

    static canUpdateById(req: Request, res: Response, next: NextFunction) {
        next(
            CommentValidator.validateId(req.params.id) ||
            CommentValidator.validateProperty(req.body.comment.property));
    }

    static canUpdateMany(req: Request, res: Response, next: NextFunction) {
        next(CommentValidator.validateProperty(req.body.comment.property));
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

    private static validateProperty(property: string) {
        if (!CommentValidatons.isPropertyValid(property)) {
            return new PropertyInvalidError();
        }

        return undefined;
    }

    private static validateId(id: string) {
        if (!CommentValidatons.isIdValid(id)) {
            return new IdInvalidError();
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
