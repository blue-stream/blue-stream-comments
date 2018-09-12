import { Router } from 'express';
import { CommentValidator } from './validator/comment.validator';
import { CommentController } from './comment.contoller';
import { Wrapper } from '../utils/wrapper';

const CommentRouter: Router = Router();

CommentRouter.post('/', CommentValidator.canCreate, Wrapper.wrapAsync(CommentController.create));


CommentRouter.post('/many', CommentValidator.canCreateMany, Wrapper.wrapAsync(CommentController.createMany));
CommentRouter.put('/many', CommentValidator.canUpdateMany, Wrapper.wrapAsync(CommentController.updateMany));
CommentRouter.put('/:id', CommentValidator.canUpdateById, Wrapper.wrapAsync(CommentController.updateById));
CommentRouter.delete('/:id', CommentValidator.canDeleteById, Wrapper.wrapAsync(CommentController.deleteById));
CommentRouter.get('/one', CommentValidator.canGetOne, Wrapper.wrapAsync(CommentController.getOne));
CommentRouter.get('/many', CommentValidator.canGetMany, Wrapper.wrapAsync(CommentController.getMany));
CommentRouter.get('/amount', CommentValidator.canGetAmount, Wrapper.wrapAsync(CommentController.getAmount));
CommentRouter.get('/:id', CommentValidator.canGetById, Wrapper.wrapAsync(CommentController.getById));

export { CommentRouter };