import { IComment } from './comment.interface';

import { CommentRepository } from './comment.repository';

export class CommentManager implements CommentRepository {
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
            replies.forEach((reply: any) => {
                RepliesPromise.push(CommentManager.deleteById(reply._id));
            });

            await Promise.all(RepliesPromise);
        }

        return CommentRepository.deleteById(id);
    }

    static getById(id: string) {
        return CommentRepository.getById(id);
    }

    static getOne(commentFilter: Partial<IComment>) {
        return CommentRepository.getOne(commentFilter);
    }

    static getMany(commentFilter: Partial<IComment>, startIndex: number, endIndex: number) {
        return CommentRepository.getMany(commentFilter, startIndex, endIndex);
    }

    static async getRootComments(resourceId: string, startIndex: number, endIndex: number) {
        const comments: IComment[] = await CommentRepository.getMany({ resource: resourceId, parent: null }, startIndex, endIndex);
        const RepliesAmountPromise: Promise<number>[] = [];

        comments.forEach((comment: IComment) => {
            RepliesAmountPromise.push(CommentManager.getRepliesAmount(comment.id));
        });

        const RepliesAmount: number[] = await Promise.all(RepliesAmountPromise);

        return comments.map((comment: IComment, index: number) => {
            return { ...(comment as any)._doc, repliesAmount: RepliesAmount[index] };
        });
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
