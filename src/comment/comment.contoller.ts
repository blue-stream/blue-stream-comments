import { Request, Response } from 'express';
import { CommentManager } from './comment.manager';

import { IdNotFoundError } from '../utils/errors/userErrors';
import { UpdateWriteOpResult } from 'mongodb';
import { IComment } from './comment.interface';

type UpdateResponse = UpdateWriteOpResult['result'];
export class CommentController {
    static async create(req: Request, res: Response) {
        res.json(await CommentManager.create(req.body));
    }

    static async updateById(req: Request, res: Response) {
        const comment: IComment = {
            parent: req.body.parent,
            text: req.body.text,
            user: req.body.user,
            video: req.body.video,
        };

        const updated = await CommentManager.updateById(req.params.id, comment);
        if (!updated) {
            throw new IdNotFoundError();
        }

        res.json(updated);
    }

    static async deleteById(req: Request, res: Response) {
        const deleted = await CommentManager.deleteById(req.params.id);
        if (!deleted) {
            throw new IdNotFoundError();
        }

        res.json(deleted);
    }

    static async getById(req: Request, res: Response) {
        const comment = await CommentManager.getById(req.params.id);
        if (!comment) {
            throw new IdNotFoundError();
        }

        res.json(comment);
    }

    static async getOne(req: Request, res: Response) {
        const comment = await CommentManager.getOne(req.query);
        if (!comment) {
            throw new IdNotFoundError();
        }

        res.json(comment);
    }

    static async getRootComments(req: Request, res: Response) {
        res.json(await CommentManager.getRootComments(req.query.video, req.query.startIndex, req.query.endIndex));
    }

    static async getReplies(req: Request, res: Response) {
        res.json(await CommentManager.getReplies(req.query.parent, req.query.startIndex, req.query.endIndex));
    }

    static async getMany(req: Request, res: Response) {
        const commentFilter: Partial<IComment> = {
            parent: req.query.parent,
            text: req.query.text,
            user: req.query.user,
            video: req.query.video,
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
