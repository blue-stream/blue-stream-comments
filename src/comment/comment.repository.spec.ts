import { expect } from 'chai';
import * as mongoose from 'mongoose';
import { config } from '../config';
import { ServerError } from '../utils/errors/applicationError';
import { IComment } from './comment.interface';
import { CommentRepository } from './comment.repository';

const validId: string = new mongoose.Types.ObjectId().toHexString();
const invalidId: string = ' ';
const invalidUser: string = 'a';
const invalidComment: Partial<IComment> = {
    resource: invalidId,
    parent: invalidId,
    text: '1'.repeat(config.validator.comment.text.maxLength + 1),
    user: invalidUser,
};

const commentDataToUpdate: Partial<IComment> = { text: 'updated text' };
const unexistingComment: Partial<IComment> = { user: 'c@c' };
const unknownProperty: Object = { unknownProperty: true };
const comment: IComment = {
    resource: (new mongoose.Types.ObjectId()).toHexString(),
    parent: (new mongoose.Types.ObjectId()).toHexString(),
    text: 'comment text',
    user: 'a@a',
};

const comment2: IComment = {
    resource: (new mongoose.Types.ObjectId()).toHexString(),
    parent: (new mongoose.Types.ObjectId()).toHexString(),
    text: 'comment text 2',
    user: 'a@b',
};

const comment3: IComment = {
    resource: (new mongoose.Types.ObjectId()).toHexString(),
    parent: (new mongoose.Types.ObjectId()).toHexString(),
    text: 'comment text 3',
    user: 'b@b',
};

const commentArr = [comment, comment2, comment3];

Object.freeze(comment);
Object.freeze(comment2);
Object.freeze(comment3);
Object.freeze(commentArr);

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
                expect(createdComment).to.have.property('createdAt');
                expect(createdComment).to.have.property('updatedAt');

                for (const prop in comment) {
                    if (prop.toString() !== 'parent') {
                        expectToHaveEqualProperty(createdComment, prop, comment[prop as keyof IComment]);
                    }
                }

                expect(createdComment).to.have.property('parent').which.satisfies((id: any) => {
                    return mongoose.Types.ObjectId.isValid(id);
                });

                expect(createdComment).to.have.property('id').which.satisfies((id: any) => {
                    return mongoose.Types.ObjectId.isValid(id);
                });
            });
        });

        context('When comment is invalid', function () {
            for (const prop in invalidComment) {
                it(`Should throw validation error when incorrect ${prop} entered`, async function () {
                    let hasThrown = false;

                    const vid = {
                        ...comment,
                        [prop]: invalidComment[prop as keyof IComment],
                    };

                    try {
                        await CommentRepository.create(vid);
                    } catch (err) {
                        hasThrown = true;
                        expect(err).to.exist;
                        expect(err).to.have.property('name', 'ValidationError');
                        expect(err).to.have.property('errors');
                    } finally {
                        expect(hasThrown).to.be.true;
                    }
                });
            }

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
                    if (prop.toString() !== 'parent') {
                        expect(updatedDoc).to.have.property(prop, createdComment[prop as keyof IComment]);
                    }
                }
            });

            it('Should return null when updated doc does not exists', async function () {
                const updatedDoc = await CommentRepository.updateById(new mongoose.Types.ObjectId().toHexString(), {});
                expect(updatedDoc).to.not.exist;
            });
        });

        context('When data is not valid', function () {
            for (const prop in invalidComment) {
                it(`Should throw error when ${prop} is invalid`, async function () {
                    let hasThrown = false;

                    try {
                        await CommentRepository.updateById(createdComment.id as string, { [prop]: invalidComment[prop as keyof IComment] } as any);
                    } catch (err) {
                        hasThrown = true;
                        expect(err).to.exist;

                        if (prop.toString() === 'parent') {
                            expect(err).to.have.property('name', 'CastError');
                        } else {
                            expect(err).to.have.property('name', 'ValidationError');
                            expect(err).to.have.property('errors');
                            expect(err.errors).to.have.property(prop);
                        }

                    } finally {
                        expect(hasThrown).to.be.true;
                    }
                });
            }
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
                const doc: any = await CommentRepository.getById(document.id!);
                expect(doc).to.exist;
                expect(doc).to.have.property('id', document.id);
                expect(doc.parent.toString()).to.be.equal(document.parent!.toString());
                for (const prop in comment) {
                    if (prop.toString() !== 'parent') {
                        expect(doc).to.have.property(prop, comment[prop as keyof IComment]);
                    }
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
                const doc: any = await CommentRepository.getOne({ _id: document.id } as Partial<IComment>);
                expect(doc).to.exist;
                expect(doc.parent.toString()).to.be.equal(document.parent!.toString());

                for (const prop in comment) {
                    if (prop.toString() !== 'parent') {
                        expect(doc).to.have.property(prop, comment[prop as keyof IComment]);
                    }
                }
            });

            for (const prop in comment) {
                it(`Should return document by ${prop}`, async function () {
                    const doc: any = await CommentRepository.getOne({ [prop]: comment[prop as keyof IComment] });
                    expect(doc).to.exist;
                    expect(doc).to.have.property('id', document.id);
                    expect(doc.parent.toString()).to.be.equal(document.parent!.toString());

                    for (const prop in comment) {
                        if (prop.toString() !== 'parent') {
                            expect(doc).to.have.property(prop, comment[prop as keyof IComment]);
                        }
                    }
                });
            }

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

            beforeEach(function () {
                return Promise.all(commentArr.map(comment => CommentRepository.create(comment)));
            });

            it('Should return all documents when filter is empty', async function () {
                const documents = await CommentRepository.getMany({}, 0, 10);
                expect(documents).to.exist;
                expect(documents).to.be.an('array');
                expect(documents).to.have.lengthOf(commentArr.length);
            });

            for (const prop in comment) {
                it(`Should return only matching documents by ${prop}`, async function () {
                    const documents = await CommentRepository.getMany({ [prop]: comment[prop as keyof IComment] }, 0, 10);
                    expect(documents).to.exist;
                    expect(documents).to.be.an('array');

                    const amountOfRequiredDocuments = commentArr.filter((item: IComment) => {
                        return item[prop as keyof IComment] === comment[prop as keyof IComment];
                    }).length;

                    expect(documents).to.have.lengthOf(amountOfRequiredDocuments);
                });
            }

            it('Should return empty array when critiria not matching any document', async function () {
                const documents = await CommentRepository.getMany(unexistingComment, 0, 10);
                expect(documents).to.exist;
                expect(documents).to.be.an('array');
                expect(documents).to.have.lengthOf(0);
            });
        });

        context('When data is invalid', function () {
            it('Should throw error when filter is not an object', async function () {
                let hasThrown = false;

                try {
                    await CommentRepository.getMany(0 as any, 0, 10);
                } catch (err) {
                    hasThrown = true;
                    expect(err).to.exist;
                    expect(err).to.have.property('name', 'ObjectParameterError');
                } finally {
                    expect(hasThrown).to.be.true;
                }
            });

            it('Should return null when filter is not in correct format', async function () {
                const documents = await CommentRepository.getMany(unknownProperty, 0, 10);
                expect(documents).to.exist;
                expect(documents).to.be.an('array');
                expect(documents).to.have.lengthOf(0);
            });
        });
    });

    describe('#getAmount()', function () {

        context('When data is valid', function () {

            beforeEach(async function () {
                await Promise.all(commentArr.map(comment => CommentRepository.create(comment)));
            });

            it('Should return amount of all documents when no filter provided', async function () {
                const amount = await CommentRepository.getAmount({});
                expect(amount).to.exist;
                expect(amount).to.be.a('number');
                expect(amount).to.equal(commentArr.length);
            });

            for (const prop in comment) {
                it(`Should return amount of filtered documents by ${prop}`, async function () {
                    const amount = await CommentRepository.getAmount({ [prop]: comment[prop as keyof IComment] });
                    expect(amount).to.exist;
                    expect(amount).to.be.a('number');

                    const amountOfRequiredDocuments = commentArr.filter((item: IComment) => {
                        return item[prop as keyof IComment] === comment[prop as keyof IComment];
                    }).length;

                    expect(amount).to.equal(amountOfRequiredDocuments);
                });
            }

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

function expectToHaveEqualProperty(source: Object, prop: string, value: any) {
    if (typeof value === 'object') {
        expect(source).to.have.property(prop).deep.equal(value);
    } else {
        expect(source).to.have.property(prop, value);
    }
}
