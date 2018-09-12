type CommentValidatorConfig = {
    text: {
        maxLength: number;
        minLength: number;
    },
};

export const commentValidatorConfig: CommentValidatorConfig = {
    text: {
        maxLength: 1000,
        minLength: 1,
    },
};
