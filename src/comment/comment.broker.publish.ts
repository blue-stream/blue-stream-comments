import * as rabbit from '../utils/rabbit';

export class CommentPublishBroker {

    public static async publish(routingKey: string, message: any) {
        rabbit.publish('application', routingKey, message);
    }
}
