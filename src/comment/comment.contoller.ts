import { Request, Response } from 'express';
import { CommentManager } from './comment.manager';

import { CommentNotFoundError } from '../utils/errors/userErrors';
import { UpdateWriteOpResult } from 'mongodb';
import { IComment } from './comment.interface';

export class CommentController {
    static async create(req: Request, res: Response) {
        res.json(await CommentManager.create(req.body));
    }

    static async updateTextById(req: Request, res: Response) {
        const updated = await CommentManager.updateTextById(req.params.id, req.body.text);
        if (!updated) {
            throw new CommentNotFoundError();
        }

        res.json(updated);
    }

    static async deleteById(req: Request, res: Response) {
        const deleted = await CommentManager.deleteById(req.params.id);
        if (!deleted) {
            throw new CommentNotFoundError();
        }

        res.json(deleted);
    }

    static async getById(req: Request, res: Response) {
        const comment = await CommentManager.getById(req.params.id);
        if (!comment) {
            throw new CommentNotFoundError();
        }

        res.json(comment);
    }

    static async getOne(req: Request, res: Response) {
        const comment = await CommentManager.getOne(req.query);
        if (!comment) {
            throw new CommentNotFoundError();
        }

        res.json(comment);
    }

    static async getRootComments(req: Request, res: Response) {
        res.json(await CommentManager.getRootComments(req.query.resource, req.query.startIndex, req.query.endIndex));
    }

    static async getReplies(req: Request, res: Response) {
        res.json(await CommentManager.getReplies(req.params.parent, req.query.startIndex, req.query.endIndex));
    }

    static async getMany(req: Request, res: Response) {
        const commentFilter: Partial<IComment> = {
            parent: req.query.parent,
            text: req.query.text,
            user: req.query.user,
            resource: req.query.resource,
        };

        Object.keys(commentFilter).forEach((key: string) => {
            return commentFilter[key as keyof IComment] ===
                undefined && delete commentFilter[key as keyof IComment];
        });

        res.json(await CommentManager.getMany(commentFilter, req.query.startIndex, req.query.endIndex));
    }

    static async getAmount(req: Request, res: Response) {
        res.json(await CommentManager.getAmount(req.query));
    }
}
