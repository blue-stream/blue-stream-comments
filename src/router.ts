import { Router } from 'express';
import { CommentRouter } from './comment/comment.router';
import { HealthRouter } from './utils/health/health.router';

const AppRouter: Router = Router();

AppRouter.use('/api/comment', CommentRouter);
AppRouter.use('/health', HealthRouter);

export { AppRouter };
