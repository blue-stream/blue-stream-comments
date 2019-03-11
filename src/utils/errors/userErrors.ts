import { UserError } from './applicationError';

export class CommentNotFoundError extends UserError {
    constructor(message?: string) {
        super(message || 'Comment ID was not found', 404);
    }
}

export class ResourceIdNotValidError extends UserError {
    constructor(message?: string) {
        super(message || 'resource\'s ID is not valid', 400);
    }
}

export class CommentNotValidError extends UserError {
    constructor(message?: string) {
        super(message || 'Comment is not valid', 400);
    }
}

export class CommentTextNotValidError extends CommentNotValidError {
    constructor(message?: string) {
        super(message || 'Comment\'s text is not valid');
    }
}

export class TextTooShortError extends CommentNotValidError {
    constructor(message?: string) {
        super(message || 'Comment\'s text is too short');
    }
}

export class TextTooLongError extends CommentNotValidError {
    constructor(message?: string) {
        super(message || 'Comment\'s text is too long');
    }
}

export class CommentIdNotValidError extends CommentNotValidError {
    constructor(message?: string) {
        super(message || 'Comment\'s ID is not valid');
    }
}

export class UnknownParentError extends UserError {
    constructor(message?: string) {
        super(message || 'Specified parent was not found', 404);
    }
}

export class UserIdNotValidError extends CommentNotValidError {
    constructor(message?: string) {
        super(message || 'User\'s ID is not valid');
    }
}

export class UserIsNotCommentOwnerError extends UserError {
    constructor(message?: string) {
        super(message || 'User is not comment\'s owner', 403);
    }
}