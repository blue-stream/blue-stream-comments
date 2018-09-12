import { expect } from 'chai';
import { Types } from 'mongoose';
import { CommentValidator } from './comment.validator';
import { ValidRequestMocks, responseMock } from './comment.mocks';
import { PropertyInvalidError, IdInvalidError } from '../../utils/errors/userErrors';

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
            it('Should throw an PropertyInvalidError When property is undefined', function () {
                const invalidRequestMock = new ValidRequestMocks().create;
                invalidRequestMock.body.comment.property = undefined;

                CommentValidator.canCreate(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(PropertyInvalidError);
                });
            });

            it('Should throw an PropertyInvalidError When property is null', function () {
                const invalidRequestMock = new ValidRequestMocks().create;
                invalidRequestMock.body.comment.property = null;

                CommentValidator.canCreate(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(PropertyInvalidError);
                });
            });

            it('Should throw an PropertyInvalidError When property is too long', function () {
                const invalidRequestMock = new ValidRequestMocks().create;
                invalidRequestMock.body.comment.property = '122223344214142';

                CommentValidator.canCreate(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(PropertyInvalidError);
                });
            });
        });
    });

    describe('CreateMany Validator', function () {
        context('When valid arguments are passed', function () {
            it('Should not throw an error', function () {
                CommentValidator.canCreateMany(new ValidRequestMocks().createMany, responseMock, (error: Error) => {
                    expect(error).to.not.exist;
                });
            });
        });

        context('When invalid arguments are passed', function () {
            it('Should throw an PropertyInvalidError When property is undefined', function () {
                const invalidRequestMock = new ValidRequestMocks().createMany;
                invalidRequestMock.body.comments[1].property = undefined;

                CommentValidator.canCreateMany(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(PropertyInvalidError);
                });
            });

            it('Should throw an PropertyInvalidError When property is null', function () {
                const invalidRequestMock = new ValidRequestMocks().createMany;
                invalidRequestMock.body.comments[1].property = null;

                CommentValidator.canCreateMany(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(PropertyInvalidError);
                });
            });

            it('Should throw an PropertyInvalidError When property is too long', function () {
                const invalidRequestMock = new ValidRequestMocks().createMany;
                invalidRequestMock.body.comments[1].property = '21412412421412414214';

                CommentValidator.canCreateMany(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(PropertyInvalidError);
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
            it('Should throw an PropertyInvalidError When property is undefined', function () {
                const invalidRequestMock = new ValidRequestMocks().updateById;
                invalidRequestMock.body.comment.property = undefined;

                CommentValidator.canUpdateById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(PropertyInvalidError);
                });
            });

            it('Should throw an PropertyInvalidError When property is null', function () {
                const invalidRequestMock = new ValidRequestMocks().updateById;
                invalidRequestMock.body.comment.property = null;

                CommentValidator.canUpdateById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(PropertyInvalidError);
                });
            });

            it('Should throw an PropertyInvalidError When property is too long', function () {
                const invalidRequestMock = new ValidRequestMocks().updateById;
                invalidRequestMock.body.comment.property = '2142142142141241';

                CommentValidator.canUpdateById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(PropertyInvalidError);
                });
            });

            it('Should throw an IdInvalidError When id is undefined', function () {
                const invalidRequestMock = new ValidRequestMocks().updateById;
                invalidRequestMock.params.id = undefined;

                CommentValidator.canUpdateById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(IdInvalidError);
                });
            });

            it('Should throw an IdInvalidError When id is null', function () {
                const invalidRequestMock = new ValidRequestMocks().updateById;
                invalidRequestMock.params.id = null;

                CommentValidator.canUpdateById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(IdInvalidError);
                });
            });

            it('Should throw an IdInvalidError When id is not a valid ObjectID', function () {
                const invalidRequestMock = new ValidRequestMocks().updateById;
                invalidRequestMock.params.id = '1244';

                CommentValidator.canUpdateById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(IdInvalidError);
                });
            });
        });

        describe('canUpdateMany Validator', function () {
            context('When valid arguments are passed', function () {
                it('Should not throw an error', function () {
                    CommentValidator.canUpdateMany(new ValidRequestMocks().updateMany, responseMock, (error: Error) => {
                        expect(error).to.not.exist;
                    });
                });
            });

            context('When invalid arguments are passed', function () {
                it('Should throw an PropertyInvalidError When property is undefined', function () {
                    const invalidRequestMock = new ValidRequestMocks().updateMany;
                    invalidRequestMock.body.comment.property = undefined;

                    CommentValidator.canUpdateMany(invalidRequestMock, responseMock, (error: Error) => {
                        expect(error).to.exist;
                        expect(error).to.be.an.instanceof(PropertyInvalidError);
                    });
                });

                it('Should throw an PropertyInvalidError When property is null', function () {
                    const invalidRequestMock = new ValidRequestMocks().updateMany;
                    invalidRequestMock.body.comment.property = null;

                    CommentValidator.canUpdateMany(invalidRequestMock, responseMock, (error: Error) => {
                        expect(error).to.exist;
                        expect(error).to.be.an.instanceof(PropertyInvalidError);
                    });
                });

                it('Should throw an PropertyInvalidError When property is too long', function () {
                    const invalidRequestMock = new ValidRequestMocks().updateMany;
                    invalidRequestMock.body.comment.property = '21414141412414124';

                    CommentValidator.canUpdateMany(invalidRequestMock, responseMock, (error: Error) => {
                        expect(error).to.exist;
                        expect(error).to.be.an.instanceof(PropertyInvalidError);
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
                it('Should throw an IdInvalidError When id is undefined', function () {
                    const invalidRequestMock = new ValidRequestMocks().deleteById;
                    invalidRequestMock.params.id = undefined;

                    CommentValidator.canDeleteById(invalidRequestMock, responseMock, (error: Error) => {
                        expect(error).to.exist;
                        expect(error).to.be.an.instanceof(IdInvalidError);
                    });
                });

                it('Should throw an IdInvalidError When id is null', function () {
                    const invalidRequestMock = new ValidRequestMocks().deleteById;
                    invalidRequestMock.params.id = undefined;

                    CommentValidator.canDeleteById(invalidRequestMock, responseMock, (error: Error) => {
                        expect(error).to.exist;
                        expect(error).to.be.an.instanceof(IdInvalidError);
                    });
                });

                it('Should throw an IdInvalidError When id is not a valid ObjectID', function () {
                    const invalidRequestMock = new ValidRequestMocks().deleteById;
                    invalidRequestMock.params.id = '1243';

                    CommentValidator.canDeleteById(invalidRequestMock, responseMock, (error: Error) => {
                        expect(error).to.exist;
                        expect(error).to.be.an.instanceof(IdInvalidError);
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
                it('Should throw an IdInvalidError When id is undefined', function () {
                    const invalidRequestMock = new ValidRequestMocks().getById;
                    invalidRequestMock.params.id = undefined;

                    CommentValidator.canGetById(invalidRequestMock, responseMock, (error: Error) => {
                        expect(error).to.exist;
                        expect(error).to.be.an.instanceof(IdInvalidError);
                    });
                });

                it('Should throw an IdInvalidError When id is null', function () {
                    const invalidRequestMock = new ValidRequestMocks().getById;
                    invalidRequestMock.params.id = null;

                    CommentValidator.canGetById(invalidRequestMock, responseMock, (error: Error) => {
                        expect(error).to.exist;
                        expect(error).to.be.an.instanceof(IdInvalidError);
                    });
                });

                it('Should throw an IdInvalidError When id is not a valid ObjectID', function () {
                    const invalidRequestMock = new ValidRequestMocks().getById;
                    invalidRequestMock.params.id = '1234';

                    CommentValidator.canGetById(invalidRequestMock, responseMock, (error: Error) => {
                        expect(error).to.exist;
                        expect(error).to.be.an.instanceof(IdInvalidError);
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
});
