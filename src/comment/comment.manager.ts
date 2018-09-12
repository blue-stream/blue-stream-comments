import { IComment } from './comment.interface';

import { CommentRepository } from './comment.repository';

export class CommentManager implements CommentRepository {
    static create(comment: IComment) {
        return CommentRepository.create(comment);
    }

    static createMany(comments: IComment[]) {
        return CommentRepository.createMany(comments);
    }

    static updateById(id: string, comment: Partial<IComment>) {
        return CommentRepository.updateById(id, comment);
    }

    static updateMany(commentFilter: Partial<IComment>, comment: Partial<IComment>) {
        return CommentRepository.updateMany(commentFilter, comment);
    }

    static deleteById(id: string) {
        return CommentRepository.deleteById(id);
    }

    static getById(id: string) {
        return CommentRepository.getById(id);
    }

    static getOne(commentFilter: Partial<IComment>) {
        return CommentRepository.getOne(commentFilter);
    }

    static getMany(commentFilter: Partial<IComment>) {
        return CommentRepository.getMany(commentFilter);
    }

    static getAmount(commentFilter: Partial<IComment>) {
        return CommentRepository.getAmount(commentFilter);
    }
}
