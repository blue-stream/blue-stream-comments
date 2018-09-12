
import { expect } from 'chai';
import * as mongoose from 'mongoose';
import { config } from '../config';
import { ServerError } from '../utils/errors/applicationError';
import { IComment } from './comment.interface';
import { CommentRepository } from './comment.repository';

const validId: string = new mongoose.Types.ObjectId().toHexString();
const invalidId: string = 'invalid id';
const comment: IComment = {
    property: 'prop',
};
const commentArr: IComment[] = ['prop', 'prop', 'prop', 'b', 'c', 'd'].map(item => ({ property: item }));
const invalidComment: any = {
    property: { invalid: true },
};
const commentFilter: Partial<IComment> = { property: 'prop' };
const commentDataToUpdate: Partial<IComment> = { property: 'updated' };
const unexistingComment: Partial<IComment> = { property: 'unexisting' };
const unknownProperty: Object = { unknownProperty: true };

describe('Comment Repository', function () {
    before(async function () {
        await mongoose.connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.name}`, { useNewUrlParser: true });
    });

    afterEach(async function () {
        await mongoose.connection.dropDatabase();
    });

    after(async function () {
        await mongoose.connection.close();
    });

    describe('#create()', function () {
        context('When comment is valid', function () {
            it('Should create comment', async function () {
                const createdComment = await CommentRepository.create(comment);
                expect(createdComment).to.exist;
                expect(createdComment).to.have.property('property', 'prop');
                expect(createdComment).to.have.property('createdAt');
                expect(createdComment).to.have.property('updatedAt');
                expect(createdComment).to.have.property('_id').which.satisfies((id: any) => {
                    return mongoose.Types.ObjectId.isValid(id);
                });
            });
        });

        context('When comment is invalid', function () {
            it('Should throw validation error when incorrect property type', async function () {
                let hasThrown = false;

                try {
                    await CommentRepository.create(invalidComment);
                } catch (err) {
                    hasThrown = true;
                    expect(err).to.exist;
                    expect(err).to.have.property('name', 'ValidationError');
                    expect(err).to.have.property('message').that.matches(/cast.+failed/i);
                    expect(err).to.have.property('errors');
                    expect(err.errors).to.have.property('property');
                    expect(err.errors.property).to.have.property('name', 'CastError');
                } finally {
                    expect(hasThrown).to.be.true;
                }
            });

            it('Should throw validation error when empty comment passed', async function () {
                let hasThrown = false;

                try {
                    await CommentRepository.create({} as IComment);
                } catch (err) {
                    hasThrown = true;
                    expect(err).to.have.property('name', 'ValidationError');
                    expect(err).to.have.property('message').that.matches(/path.+required/i);
                } finally {
                    expect(hasThrown);
                }
            });
        });
    });

    describe('#createMany()', function () {
        context('When data is valid', function () {
            it('Should create many documents', async function () {
                const createdDocuments = await CommentRepository.createMany(commentArr);

                expect(createdDocuments).to.exist;
                expect(createdDocuments).to.be.an('array');
                expect(createdDocuments).to.have.lengthOf(6);
            });

            it('Should not create documents when empty array passed', async function () {
                const docs = await CommentRepository.createMany([]);

                expect(docs).to.exist;
                expect(docs).to.be.an('array');
                expect(docs).to.be.empty;
            });
        });

        context('When data is invalid', function () {
            it('Should throw error when 1 of the docs invalid', async function () {
                let hasThrown = false;
                const docs: IComment[] = [
                    ...commentArr,
                    {} as IComment,
                ];

                try {
                    await CommentRepository.createMany(docs);
                } catch (err) {
                    hasThrown = true;
                    expect(err).to.have.property('name', 'ValidationError');
                    expect(err).to.have.property('message').that.matches(/path.+required/i);
                } finally {
                    expect(hasThrown).to.be.true;
                }
            });
        });
    });

    describe('#updateById()', function () {

        let createdComment: IComment;

        beforeEach(async function () {
            createdComment = await CommentRepository.create(comment);
            expect(createdComment).have.property('id');
        });

        context('When data is valid', function () {

            it('Should update an existsing comment', async function () {
                const updatedDoc = await CommentRepository.updateById(createdComment.id!, commentDataToUpdate);
                expect(updatedDoc).to.exist;
                expect(updatedDoc).to.have.property('id', createdComment.id);
                for (const prop in commentDataToUpdate) {
                    expect(updatedDoc).to.have.property(prop, commentDataToUpdate[prop as keyof IComment]);
                }
            });

            it('Should not update an existing comment when empty data provided', async function () {
                const updatedDoc = await CommentRepository.updateById(createdComment.id!, {});
                expect(updatedDoc).to.exist;
                expect(updatedDoc).to.have.property('id', createdComment.id);

                for (const prop in comment) {
                    expect(updatedDoc).to.have.property(prop, createdComment[prop as keyof IComment]);
                }
            });

            it('Should return null when updated doc does not exists', async function () {
                const updatedDoc = await CommentRepository.updateById(new mongoose.Types.ObjectId().toHexString(), {});
                expect(updatedDoc).to.not.exist;
            });
        });

        context('When data is not valid', function () {
            it('Should throw error when updated doc is not valid', async function () {
                let hasThrown = false;

                try {
                    await CommentRepository.updateById(createdComment.id as string, { property: null } as any);
                } catch (err) {
                    hasThrown = true;
                    expect(err).to.exist;
                    expect(err).to.have.property('name', 'ValidationError');
                    expect(err).to.have.property('message').that.matches(/path.+required/i);
                } finally {
                    expect(hasThrown).to.be.true;
                }
            });
        });
    });

    describe('#updateMany()', function () {

        beforeEach(async function () {
            await CommentRepository.createMany(commentArr);
        });

        context('When data is valid', function () {

            it('Should update many documents', async function () {
                const updated = await CommentRepository.updateMany(commentFilter, commentDataToUpdate);

                const amountOfRequiredUpdates = commentArr.filter((item: IComment) => {
                    let match = true;
                    for (const prop in commentFilter) {
                        match = match && item[prop as keyof IComment] === commentFilter[prop as keyof IComment];
                    }

                    return match;
                }).length;

                expect(updated).to.exist;
                expect(updated).to.have.property('nModified', amountOfRequiredUpdates);

                const documents = await CommentRepository.getMany(commentDataToUpdate);
                expect(documents).to.exist;
                expect(documents).to.be.an('array');
                expect(documents).to.have.lengthOf(amountOfRequiredUpdates);
            });

            it('Should update all documents when no filter passed', async function () {
                const updated = await CommentRepository.updateMany({}, commentDataToUpdate);
                expect(updated).to.exist;
                expect(updated).to.have.property('nModified', commentArr.length);

                const documents = await CommentRepository.getMany(commentDataToUpdate);
                expect(documents).to.exist;
                expect(documents).to.be.an('array');
                expect(documents).to.have.lengthOf(commentArr.length);
            });

            it('Should do nothing when criteria does not match any document', async function () {
                const updated = await CommentRepository.updateMany(unexistingComment, commentDataToUpdate);
                expect(updated).to.exist;
                expect(updated).to.have.property('nModified', 0);

                const documents = await CommentRepository.getMany(commentDataToUpdate);
                expect(documents).to.exist;
                expect(documents).to.be.an('array');
                expect(documents).to.have.lengthOf(0);
            });

        });

        context('When data is invalid', function () {

            it('Should throw error when empty data provided', async function () {
                let hasThrown = false;

                try {
                    await CommentRepository.updateMany(commentFilter, {});
                } catch (err) {
                    hasThrown = true;
                    expect(err).to.exist;
                    expect(err instanceof ServerError).to.be.true;
                } finally {
                    expect(hasThrown).to.be.true;
                }
            });

            it('Should not update documents when invalid data passed', async function () {
                await CommentRepository.updateMany({}, unknownProperty);

                const documents = await CommentRepository.getMany({});
                expect(documents).to.exist;
                expect(documents).to.be.an('array');
                expect(documents).to.satisfy((documents: IComment[]) => {
                    documents.forEach((doc: IComment) => {
                        for (const prop in unknownProperty) {
                            expect(doc).to.not.have.property(prop);
                        }
                    });

                    return true;
                });
            });
        });
    });

    describe('#deleteById()', function () {

        let document: IComment;

        beforeEach(async function () {
            document = await CommentRepository.create(comment);
        });

        context('When data is valid', function () {

            it('Should delete document by id', async function () {
                const deleted = await CommentRepository.deleteById(document.id!);
                expect(deleted).to.exist;
                expect(deleted).to.have.property('id', document.id);

                const doc = await CommentRepository.getById(document.id!);
                expect(doc).to.not.exist;
            });

            it('Should return null when document not exists', async function () {
                const deleted = await CommentRepository.deleteById(new mongoose.Types.ObjectId().toHexString());
                expect(deleted).to.not.exist;
            });
        });

        context('When data is invalid', function () {
            it('Should throw error when id is not in the correct format', async function () {
                let hasThrown = false;

                try {
                    await CommentRepository.deleteById('invalid id');
                } catch (err) {
                    hasThrown = true;
                    expect(err).to.exist;
                    expect(err).to.have.property('name', 'CastError');
                    expect(err).to.have.property('kind', 'ObjectId');
                    expect(err).to.have.property('path', '_id');
                } finally {
                    expect(hasThrown).to.be.true;
                }
            });
        });
    });

    describe('#getById()', function () {

        context('When data is valid', function () {

            let document: IComment;
            beforeEach(async function () {
                document = await CommentRepository.create(comment);
            });

            it('Should return document by id', async function () {
                const doc = await CommentRepository.getById(document.id!);
                expect(doc).to.exist;
                expect(doc).to.have.property('id', document.id);
                for (const prop in comment) {
                    expect(doc).to.have.property(prop, comment[prop as keyof IComment]);
                }
            });

            it('Should return null when document not exists', async function () {
                const doc = await CommentRepository.getById(validId);
                expect(doc).to.not.exist;
            });
        });

        context('When data is invalid', function () {
            it('Should throw error when id is not in correct format', async function () {
                let hasThrown = false;

                try {
                    await CommentRepository.getById(invalidId);
                } catch (err) {
                    hasThrown = true;

                    expect(err).to.exist;
                } finally {
                    expect(hasThrown).to.be.true;
                }
            });
        });
    });

    describe('#getOne()', function () {

        context('When data is valid', function () {
            let document: IComment;

            beforeEach(async function () {
                document = await CommentRepository.create(comment);
            });

            it('Should return document by id', async function () {
                const doc = await CommentRepository.getOne({ _id: document.id } as Partial<IComment>);
                expect(doc).to.exist;
                for (const prop in comment) {
                    expect(doc).to.have.property(prop, comment[prop as keyof IComment]);
                }
            });

            it('Should return document by property', async function () {
                const doc = await CommentRepository.getOne(commentFilter);
                expect(doc).to.exist;
                expect(doc).to.have.property('id', document.id);
                for (const prop in comment) {
                    expect(doc).to.have.property(prop, comment[prop as keyof IComment]);
                }
            });

            it('Should return null when document not exists', async function () {
                const doc = await CommentRepository.getOne(unexistingComment);
                expect(doc).to.not.exist;
            });
        });

        context('When data is invalid', function () {
            it('Should throw error when filter not exists', async function () {
                let hasThrown = false;

                try {
                    await CommentRepository.getOne({});
                } catch (err) {
                    hasThrown = true;
                    expect(err).to.exist;
                    expect(err instanceof ServerError).to.be.true;
                } finally {
                    expect(hasThrown).to.be.true;
                }
            });

            it('Should return null when filter is not in the correct format', async function () {
                const doc = await CommentRepository.getOne(unknownProperty);
                expect(doc).to.not.exist;
            });
        });
    });

    describe('#getMany()', function () {

        context('When data is valid', function () {

            beforeEach(async function () {
                await CommentRepository.createMany(commentArr);
            });

            it('Should return all documents when filter is empty', async function () {
                const documents = await CommentRepository.getMany({});
                expect(documents).to.exist;
                expect(documents).to.be.an('array');
                expect(documents).to.have.lengthOf(commentArr.length);
            });

            it('Should return only matching documents', async function () {
                const documents = await CommentRepository.getMany(commentFilter);
                expect(documents).to.exist;
                expect(documents).to.be.an('array');

                const amountOfRequiredDocuments = commentArr.filter((item: IComment) => {
                    let match = true;
                    for (const prop in commentFilter) {
                        match = match && item[prop as keyof IComment] === commentFilter[prop as keyof IComment];
                    }

                    return match;
                }).length;

                expect(documents).to.have.lengthOf(amountOfRequiredDocuments);
            });

            it('Should return empty array when critiria not matching any document', async function () {
                const documents = await CommentRepository.getMany(unexistingComment);
                expect(documents).to.exist;
                expect(documents).to.be.an('array');
                expect(documents).to.have.lengthOf(0);
            });
        });

        context('When data is invalid', function () {
            it('Should throw error when filter is not an object', async function () {
                let hasThrown = false;

                try {
                    await CommentRepository.getMany(0 as any);
                } catch (err) {
                    hasThrown = true;
                    expect(err).to.exist;
                    expect(err).to.have.property('name', 'ObjectParameterError');
                } finally {
                    expect(hasThrown).to.be.true;
                }
            });

            it('Should return null when filter is not in correct format', async function () {
                const documents = await CommentRepository.getMany(unknownProperty);
                expect(documents).to.exist;
                expect(documents).to.be.an('array');
                expect(documents).to.have.lengthOf(0);
            });
        });
    });

    describe('#getAmount()', function () {

        context('When data is valid', function () {

            beforeEach(async function () {
                await CommentRepository.createMany(commentArr);
            });

            it('Should return amount of all documents when no filter provided', async function () {
                const amount = await CommentRepository.getAmount({});
                expect(amount).to.exist;
                expect(amount).to.be.a('number');
                expect(amount).to.equal(commentArr.length);
            });

            it('Should return amount of filtered documents', async function () {
                const amount = await CommentRepository.getAmount(commentFilter);
                expect(amount).to.exist;
                expect(amount).to.be.a('number');

                const amountOfRequiredDocuments = commentArr.filter((item: IComment) => {
                    let match = true;
                    for (const prop in commentFilter) {
                        match = match && item[prop as keyof IComment] === commentFilter[prop as keyof IComment];
                    }

                    return match;
                }).length;

                expect(amount).to.equal(amountOfRequiredDocuments);
            });

            it('Should return 0 when no documents matching filter', async function () {
                const amount = await CommentRepository.getAmount(unexistingComment);
                expect(amount).to.exist;
                expect(amount).to.be.a('number');
                expect(amount).to.equal(0);
            });
        });

        context('When data is invalid', function () {
            it('Should return 0 when filter is not in the correct format', async function () {
                const amount = await CommentRepository.getAmount(unknownProperty);
                expect(amount).to.exist;
                expect(amount).to.be.a('number');
                expect(amount).to.equal(0);
            });
        });
    });

});
