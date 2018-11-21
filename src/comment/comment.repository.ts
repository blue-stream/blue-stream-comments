
import { IComment } from './comment.interface';
import { CommentModel } from './comment.model';
import { ServerError } from '../utils/errors/applicationError';

export class CommentRepository {
    static create(comment: IComment)
        : Promise<IComment> {
        if (!comment.parent) {
            comment.parent = null;
        }
        return CommentModel.create(comment);
    }

    // Should add checks for unallowed properties to be changed
    static async updateById(id: string, comment: Partial<IComment>): Promise<IComment | null> {
        const commentDocument = await CommentModel.findById(id);

        if (commentDocument) {
            for (const prop in comment) {
                commentDocument[prop as keyof IComment] = comment[prop as keyof IComment];
            }

            return await commentDocument.save({ validateBeforeSave: true });
        }

        return null;
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

    static getMany(commentFilter: Partial<IComment>, startIndex: number, endIndex: number, sortOrder: string = '-', sortBy: string = 'createdAt')
        : Promise<IComment[]> {
        return CommentModel
            .find(commentFilter)
            .sort(sortOrder + sortBy)
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
