// <RabbitMQ>
import * as rabbit from '../utils/rabbit';
import { CommentManager } from './comment.manager';
import { IComment } from './comment.interface';

export class CommentBroker {

    public static async publish(routingKey: string, message: any) {
        rabbit.publish('application', routingKey, message);
    }

    public static async subscribe() {
        rabbit.subscribe(
            'application',
            'topic',
            'comment-action-queue',
            'videoService.video.remove.succeeded',
            CommentBroker.deleteMany,
        );
    }

    private static async deleteMany(data: { id: string }) {
        if (data && data.id) {
            const commentsToRemove: IComment[] = await CommentManager.getMany({ resource: data.id }, 0, 0);
            const deleteSucceeded: boolean = await CommentManager.deleteMany(data.id);

            if (deleteSucceeded) {
                const commentsIDs: (string | undefined)[] = commentsToRemove.map(comment => comment.id);

                commentsIDs.forEach((id) => {
                    CommentBroker.publish('commentService.comment.remove.succeeded', { id });
                });
            }

        }
    }

}
