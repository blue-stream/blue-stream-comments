import { Router } from 'express';
import { CommentValidator } from './validator/comment.validator';
import { CommentController } from './comment.contoller';
import { Wrapper } from '../utils/wrapper';

const CommentRouter: Router = Router();

CommentRouter.post('/', CommentValidator.canCreate, Wrapper.wrapAsync(CommentController.create));
CommentRouter.put('/:id', CommentValidator.canUpdateTextById, Wrapper.wrapAsync(CommentController.updateTextById));
CommentRouter.delete('/:id', CommentValidator.canDeleteById, Wrapper.wrapAsync(CommentController.deleteById));
CommentRouter.get('/one', CommentValidator.canGetOne, Wrapper.wrapAsync(CommentController.getOne));
CommentRouter.get('/many', CommentValidator.canGetMany, Wrapper.wrapAsync(CommentController.getMany));
CommentRouter.get('/root', Wrapper.wrapAsync(CommentController.getRootComments));
CommentRouter.get('/replies', Wrapper.wrapAsync(CommentController.getReplies));

CommentRouter.get('/amount', CommentValidator.canGetAmount, Wrapper.wrapAsync(CommentController.getAmount));
CommentRouter.get('/:id', CommentValidator.canGetById, Wrapper.wrapAsync(CommentController.getById));

export { CommentRouter };
