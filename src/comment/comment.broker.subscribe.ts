import * as rabbit from '../utils/rabbit';
import { CommentManager } from './comment.manager';
import { IComment } from './comment.interface';
import { CommentPublishBroker } from './comment.broker.publish';

export class CommentSubscribeBroker {
    public static async subscribe() {
        rabbit.subscribe(
            'application',
            'topic',
            'comment-action-queue',
            'videoService.video.remove.succeeded',
            CommentSubscribeBroker.deleteMany,
        );
    }

    private static async deleteMany(data: { id: string }) {
        if (data && data.id) {
            const commentsToRemove: IComment[] = await CommentManager.getMany({ resource: data.id }, 0, 0);

            if (commentsToRemove) {
                const deleteSucceeded: boolean = await CommentManager.deleteMany(data.id);

                if (deleteSucceeded) {
                    const commentsIDs: (string | undefined)[] = commentsToRemove.map(comment => comment.id);
                    CommentPublishBroker.publish('commentService.comment.remove.succeeded', { ids: commentsIDs });
                }
            }

        }
    }

}
