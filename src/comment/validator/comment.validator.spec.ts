import { expect } from 'chai';
import { Types } from 'mongoose';
import { CommentValidator } from './comment.validator';
import { ValidRequestMocks, responseMock } from './comment.mocks';
import { commentValidatorConfig } from './comment.validator.config';
import {
    CommentIdNotValidError,
    TextTooLongError,
    TextTooShortError,
    VideoIdNotValidError,
    UserIdNotValidError,
} from '../../utils/errors/userErrors';

describe('Comment Validator Middleware', function () {
    describe('Create Validator', function () {
        context('When valid arguments are passed', function () {
            it('Should not throw an error', function () {
                CommentValidator.canCreate(new ValidRequestMocks().create, responseMock, (error: Error) => {
                    expect(error).to.not.exist;
                });
            });
        });

        context('When invalid arguments are passed', function () {
            it('Should throw an VideoIdNotValidError When video is undefined', function () {
                const invalidRequestMock = new ValidRequestMocks().create;
                invalidRequestMock.body.comment.video = undefined;

                CommentValidator.canCreate(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(VideoIdNotValidError);
                });
            });

            it('Should throw an VideoIdNotValidError When video is null', function () {
                const invalidRequestMock = new ValidRequestMocks().create;
                invalidRequestMock.body.comment.video = null;

                CommentValidator.canCreate(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(VideoIdNotValidError);
                });
            });

            it('Should throw an UserIdNotValidError When user is undefined', function () {
                const invalidRequestMock = new ValidRequestMocks().create;
                invalidRequestMock.body.comment.user = undefined;

                CommentValidator.canCreate(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(UserIdNotValidError);
                });
            });

            it('Should throw an UserIdNotValidError When user is null', function () {
                const invalidRequestMock = new ValidRequestMocks().create;
                invalidRequestMock.body.comment.user = null;

                CommentValidator.canCreate(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(UserIdNotValidError);
                });
            });

            it('Should throw an UserIdNotValidError When user is invalid', function () {
                const invalidRequestMock = new ValidRequestMocks().create;
                invalidRequestMock.body.comment.user = 'a';

                CommentValidator.canCreate(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(UserIdNotValidError);
                });
            });

            it('Should throw an TextTooLongError When text is too long', function () {
                const invalidRequestMock = new ValidRequestMocks().create;
                invalidRequestMock.body.comment.text = '1'.repeat(commentValidatorConfig.text.maxLength + 1);

                CommentValidator.canCreate(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(TextTooLongError);
                });
            });

            it('Should throw an TextTooShortError When text is too short', function () {
                const invalidRequestMock = new ValidRequestMocks().create;
                invalidRequestMock.body.comment.text = '';

                CommentValidator.canCreate(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(TextTooShortError);
                });
            });
        });
    });

    describe('UpdateById Validator', function () {
        context('When valid arguments are passed', function () {
            it('Should not throw an error', function () {
                CommentValidator.canUpdateById(new ValidRequestMocks().updateById, responseMock, (error: Error) => {
                    expect(error).to.not.exist;
                });
            });
        });

        context('When invalid arguments are passed', function () {
            it('Should throw an VideoIdNotValidError When video is invalid', function () {
                const invalidRequestMock = new ValidRequestMocks().updateById;
                invalidRequestMock.body.comment.video = '1242';

                CommentValidator.canUpdateById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(VideoIdNotValidError);
                });
            });

            it('Should throw an UserIdNotValidError When user is invalid', function () {
                const invalidRequestMock = new ValidRequestMocks().updateById;
                invalidRequestMock.body.comment.user = 'a';

                CommentValidator.canUpdateById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(UserIdNotValidError);
                });
            });

            it('Should throw an TextTooLongError When text is too long', function () {
                const invalidRequestMock = new ValidRequestMocks().updateById;
                invalidRequestMock.body.comment.text = '1'.repeat(commentValidatorConfig.text.maxLength + 1);

                CommentValidator.canUpdateById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(TextTooLongError);
                });
            });

            it('Should throw an TextTooShortError When text is too short', function () {
                const invalidRequestMock = new ValidRequestMocks().updateById;
                invalidRequestMock.body.comment.text = '';

                CommentValidator.canUpdateById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(TextTooShortError);
                });
            });

            it('Should throw an CommentIdNotValidError When id is undefined', function () {
                const invalidRequestMock = new ValidRequestMocks().updateById;
                invalidRequestMock.params.id = undefined;

                CommentValidator.canUpdateById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(CommentIdNotValidError);
                });
            });

            it('Should throw an CommentIdNotValidError When id is null', function () {
                const invalidRequestMock = new ValidRequestMocks().updateById;
                invalidRequestMock.params.id = null;

                CommentValidator.canUpdateById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(CommentIdNotValidError);
                });
            });

            it('Should throw an CommentIdNotValidError When id is not a valid ObjectID', function () {
                const invalidRequestMock = new ValidRequestMocks().updateById;
                invalidRequestMock.params.id = '1244';

                CommentValidator.canUpdateById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(CommentIdNotValidError);
                });
            });
        });
    });

    describe('canDeleteById Validator', function () {
        context('When valid arguments are passed', function () {
            it('Should not throw an error', function () {
                CommentValidator.canDeleteById(new ValidRequestMocks().deleteById, responseMock, (error: Error) => {
                    expect(error).to.not.exist;
                });
            });
        });

        context('When invalid arguments are passed', function () {
            it('Should throw an CommentIdNotValidError When id is undefined', function () {
                const invalidRequestMock = new ValidRequestMocks().deleteById;
                invalidRequestMock.params.id = undefined;

                CommentValidator.canDeleteById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(CommentIdNotValidError);
                });
            });

            it('Should throw an CommentIdNotValidError When id is null', function () {
                const invalidRequestMock = new ValidRequestMocks().deleteById;
                invalidRequestMock.params.id = undefined;

                CommentValidator.canDeleteById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(CommentIdNotValidError);
                });
            });

            it('Should throw an CommentIdNotValidError When id is not a valid ObjectID', function () {
                const invalidRequestMock = new ValidRequestMocks().deleteById;
                invalidRequestMock.params.id = '1243';

                CommentValidator.canDeleteById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(CommentIdNotValidError);
                });
            });
        });
    });

    describe('canGetById Validator', function () {
        context('When valid arguments are passed', function () {
            it('Should not throw an error', function () {
                CommentValidator.canGetById(new ValidRequestMocks().getById, responseMock, (error: Error) => {
                    expect(error).to.not.exist;
                });
            });
        });

        context('When invalid arguments are passed', function () {
            it('Should throw an CommentIdNotValidError When id is undefined', function () {
                const invalidRequestMock = new ValidRequestMocks().getById;
                invalidRequestMock.params.id = undefined;

                CommentValidator.canGetById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(CommentIdNotValidError);
                });
            });

            it('Should throw an CommentIdNotValidError When id is null', function () {
                const invalidRequestMock = new ValidRequestMocks().getById;
                invalidRequestMock.params.id = null;

                CommentValidator.canGetById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(CommentIdNotValidError);
                });
            });

            it('Should throw an CommentIdNotValidError When id is not a valid ObjectID', function () {
                const invalidRequestMock = new ValidRequestMocks().getById;
                invalidRequestMock.params.id = '1234';

                CommentValidator.canGetById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(CommentIdNotValidError);
                });
            });
        });
    });

    describe('canGetOne Validator', function () {
        context('When valid arguments are passed', function () {
            it('Should not throw an error', function () {
                CommentValidator.canGetOne(new ValidRequestMocks().getOne, responseMock, (error: Error) => {
                    expect(error).to.not.exist;
                });
            });
        });
    });

    describe('canGetMany Validator', function () {
        context('When valid arguments are passed', function () {
            it('Should not throw an error', function () {
                CommentValidator.canGetMany(new ValidRequestMocks().getMany, responseMock, (error: Error) => {
                    expect(error).to.not.exist;
                });
            });
        });
    });

    describe('canGetAmount Validator', function () {
        context('When valid arguments are passed', function () {
            it('Should not throw an error', function () {
                CommentValidator.canGetAmount(new ValidRequestMocks().getAmount, responseMock, (error: Error) => {
                    expect(error).to.not.exist;
                });
            });
        });
    });

});
