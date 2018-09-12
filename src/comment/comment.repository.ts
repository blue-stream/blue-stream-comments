
import { IComment } from './comment.interface';
import { CommentModel } from './comment.model';
import { ServerError } from '../utils/errors/applicationError';

export class CommentRepository {
    static create(comment: IComment)
        : Promise<IComment> {
        return CommentModel.create(comment);
    }

    static updateById(id: string, comment: Partial<IComment>)
        : Promise<IComment | null> {
        return CommentModel.findByIdAndUpdate(
            id,
            { $set: comment },
            { new: true, runValidators: true },
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

    static getMany(commentFilter: Partial<IComment>, startIndex: number, endIndex: number)
        : Promise<IComment[]> {
        return CommentModel
        .find(commentFilter)
        .skip(+startIndex)
        .limit(+endIndex - +startIndex)
        .exec();
    }

    static getAmount(commentFilter: Partial<IComment>)
        : Promise<number> {
        return CommentModel
            .countDocuments(commentFilter)
            .exec();
    }
}
