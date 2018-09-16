import { Request, Response } from 'express';
import { CommentManager } from './comment.manager';

import { IdNotFoundError } from '../utils/errors/userErrors';
import { UpdateWriteOpResult } from 'mongodb';

type UpdateResponse = UpdateWriteOpResult['result'];
export class CommentController {
    static async create(req: Request, res: Response) {
        res.json(await CommentManager.create(req.body.comment));
    }

    static async updateById(req: Request, res: Response) {
        const updated = await CommentManager.updateById(req.params.id, req.body.comment);
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

    static async getMany(req: Request, res: Response) {
        res.json(await CommentManager.getMany(req.query, req.query.startIndex, req.query.endIndex));
    }

    static async getAmount(req: Request, res: Response) {
        res.json(await CommentManager.getAmount(req.query));
    }
}
