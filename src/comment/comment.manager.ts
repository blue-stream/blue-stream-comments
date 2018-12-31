import { IComment } from './comment.interface';

import { CommentRepository } from './comment.repository';
import { CommentPublishBroker } from './comment.broker.publish';

export class CommentManager {
    static create(comment: IComment) {
        return CommentRepository.create(comment);
    }

    static updateById(id: string, comment: Partial<IComment>) {
        return CommentRepository.updateById(id, comment);
    }

    static updateTextById(id: string, text: string): Promise<IComment | null> {
        return CommentRepository.updateById(id, { text } as IComment);
    }

    static async deleteById(id: string) {
        const replies: IComment[] = await CommentManager.getReplies(id, 0, 0);
        const RepliesPromise: Promise<IComment | null>[] = [];

        if (replies.length !== 0) {
            const removedCommentsIds: string[] = [];
            removedCommentsIds.push(id);

            replies.forEach((reply: any) => {
                RepliesPromise.push(CommentManager.deleteById(reply._id));
                removedCommentsIds.push(reply._id);
            });

            CommentPublishBroker.publish('commentService.comment.remove.succeeded', { ids: removedCommentsIds });
            await Promise.all(RepliesPromise);

        } else {
            CommentPublishBroker.publish('commentService.comment.remove.succeeded', { id });
        }

        return CommentRepository.deleteById(id);
    }

    static deleteMany(resource: string) {
        return CommentRepository.deleteMany(resource);
    }

    static getById(id: string) {
        return CommentRepository.getById(id);
    }

    static getOne(commentFilter: Partial<IComment>) {
        return CommentRepository.getOne(commentFilter);
    }

    static getMany(commentFilter: Partial<IComment>, startIndex?: number, endIndex?: number, sortOrder?: '-' | '', sortBy?: string) {
        return CommentRepository.getMany(commentFilter, startIndex, endIndex, sortOrder, sortBy);
    }

    static async getRootComments(resourceId: string, startIndex: number, endIndex: number) {
        return CommentRepository.getRootComments(resourceId, startIndex, endIndex);
    }

    static getReplies(parent: string, startIndex: number, endIndex: number) {
        return CommentRepository.getMany({ parent }, startIndex, endIndex);
    }

    static getRepliesAmount(parent: string | undefined) {
        if (!parent) {
            return Promise.resolve(0);
        }

        return CommentRepository.getAmount({ parent });
    }

    static getAmount(commentFilter: Partial<IComment>) {
        return CommentRepository.getAmount(commentFilter);
    }
}
