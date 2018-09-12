
import { IComment } from './comment.interface';
import { CommentModel } from './comment.model';
import { ServerError } from '../utils/errors/applicationError';

export class CommentRepository {
    static create(comment: IComment)
        : Promise<IComment> {
        return CommentModel.create(comment);
    }

    static createMany(comments: IComment[])
        : Promise<IComment[]> {
        return CommentModel.insertMany(comments);
    }

    static updateById(id: string, comment: Partial<IComment>)
        : Promise<IComment | null> {
        return CommentModel.findByIdAndUpdate(
            id,
            { $set: comment },
            { new: true, runValidators: true },
        ).exec();
    }

    static updateMany(commentFilter: Partial<IComment>, comment: Partial<IComment>)
        : Promise<any> {

        if (Object.keys(comment).length === 0) {
            throw new ServerError('Update data is required.');
        }

        return CommentModel.updateMany(
            commentFilter,
            { $set: comment },
        ).exec();
    }

    static deleteById(id: string)
        : Promise<IComment | null> {
        return CommentModel.findByIdAndRemove(
            id,
        ).exec();
    }

    static getById(id: string)
        : Promise<IComment | null> {
        return CommentModel.findById(
            id,
        ).exec();
    }

    static getOne(commentFilter: Partial<IComment>)
        : Promise<IComment | null> {
        if (Object.keys(commentFilter).length === 0) {
            throw new ServerError('Filter is required.');
        }
        return CommentModel.findOne(
            commentFilter,
        ).exec();
    }

    static getMany(commentFilter: Partial<IComment>)
        : Promise<IComment[]> {
        return CommentModel.find(
            commentFilter,
        ).exec();
    }

    static getAmount(commentFilter: Partial<IComment>)
        : Promise<number> {
        return CommentModel
            .countDocuments(commentFilter)
            .exec();
    }
}
