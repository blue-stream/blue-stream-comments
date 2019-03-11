import { IComment } from './comment.interface';

import { CommentRepository } from './comment.repository';
import { CommentPublishBroker } from './comment.broker.publish';
import { UnknownParentError, UserIsNotCommentOwnerError, CommentNotFoundError } from '../utils/errors/userErrors';

export class CommentManager {
    static async create(comment: IComment) {
        if (comment.parent) {
            const parent = await CommentManager.getById(comment.parent);

            if (!parent) throw new UnknownParentError();
        }

        return CommentRepository.create(comment);
    }

    static async updateById(id: string, comment: Partial<IComment>, requestingUser: string, isSysAdmin: boolean) {
        const returnedComment = await CommentManager.getById(id);

        if (!returnedComment) throw new CommentNotFoundError();
        if (returnedComment.user !== requestingUser || !isSysAdmin) throw new UserIsNotCommentOwnerError();

        return CommentRepository.updateById(id, comment);
    }

    static async updateTextById(id: string, text: string, requestingUser: string, isSysAdmin: boolean): Promise<IComment | null> {
        const returnedComment = await CommentManager.getById(id);

        if (!returnedComment) throw new CommentNotFoundError();
        if (returnedComment.user !== requestingUser || !isSysAdmin) throw new UserIsNotCommentOwnerError();

        return CommentRepository.updateById(id, { text } as IComment);
    }

    static async deleteById(id: string, requestingUser: string, isSysAdmin: boolean) {
        const comment: IComment | null = await CommentManager.getById(id);

        if (!comment) throw new CommentNotFoundError();
        if (comment.user !== requestingUser || !isSysAdmin) throw new UserIsNotCommentOwnerError();

        const replies: IComment[] = await CommentManager.getReplies(id, 0, 0);
        const RepliesPromise: Promise<IComment | null>[] = [];

        if (replies.length !== 0) {
            const removedCommentsIds: string[] = [];
            removedCommentsIds.push(id);

            replies.forEach((reply: any) => {
                RepliesPromise.push(CommentManager.deleteById(reply._id, requestingUser, true));
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
