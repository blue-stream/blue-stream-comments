import { Router } from 'express';
import { CommentRouter } from './comment/comment.router';

const AppRouter: Router = Router();

AppRouter.use('/api/comment', CommentRouter);

export { AppRouter };
