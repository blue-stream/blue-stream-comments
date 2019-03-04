import * as request from 'supertest';
import { expect } from 'chai';
import * as mongoose from 'mongoose';

import { IComment } from './comment.interface';
import { Server } from '../server';
import {
    CommentIdNotValidError,
    CommentNotValidError,
    CommentTextNotValidError,
    CommentNotFoundError,
    TextTooLongError,
    TextTooShortError,
    UserIdNotValidError,
    ResourceIdNotValidError,
    UnknownParentError,
} from '../utils/errors/userErrors';
import { config } from '../config';
import { CommentManager } from './comment.manager';
import { sign } from 'jsonwebtoken';

describe('Comment Module', function () {
    let server: Server;

    const invalidId: string = 'a';
    const invalidUser: string = 'a';
    const invalidComment: Partial<IComment> = {
        resource: invalidId,
        text: '1'.repeat(config.validator.comment.text.maxLength + 1),
        user: invalidUser,
    };

    const commentDataToUpdate: Partial<IComment> = { text: 'updated text' };
    const unexistingComment: Partial<IComment> = { user: 'c@c' };
    const unknownProperty: Object = { unknownProperty: true };

    const parent: IComment = {
        resource: (new mongoose.Types.ObjectId()).toHexString(),
        text: 'parent text',
        user: 'a@d',
    };

    const fakeParentComment: IComment = {
        parent: (new mongoose.Types.ObjectId()).toHexString(),
        resource: (new mongoose.Types.ObjectId()).toHexString(),
        text: 'parent text',
        user: 'a@d',
    };

    const comment: IComment = {
        resource: (new mongoose.Types.ObjectId()).toHexString(),
        text: 'comment text',
        user: 'a@a',
    };

    const comment2: IComment = {
        resource: (new mongoose.Types.ObjectId()).toHexString(),
        text: 'comment text 2',
        user: 'a@b',
    };

    const comment3: IComment = {
        resource: (new mongoose.Types.ObjectId()).toHexString(),
        text: 'comment text 3',
        user: 'b@b',
    };

    const validResource = (new mongoose.Types.ObjectId()).toHexString();
    const parentLessComment: IComment = {
        resource: validResource,
        text: 'comment text 1',
        user: 'a@b',
    };

    const parentLessComment2: IComment = {
        resource: validResource,
        text: 'comment text 1',
        user: 'a@b',
    };

    const commentArr: IComment[] = [comment, comment2, comment3];

    const authorizationHeader = `Bearer ${sign({ id: 'a@a' }, config.authentication.secret)}`;

    Object.freeze(comment);
    Object.freeze(comment2);
    Object.freeze(comment3);
    Object.freeze(commentArr);

    before(async function () {

        await mongoose.connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.name}`, { useNewUrlParser: true });
        server = Server.bootstrap();
    });

    after(async function () {
        await mongoose.connection.db.dropDatabase();
    });
    describe('#POST /api/comment/', function () {
        context('When request is valid', function () {

            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
            });
            it('Should return created comment', function (done: MochaDone) {
                request(server.app)
                    .post('/api/comment/')
                    .send(comment)
                    .set({ authorization: authorizationHeader })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res).to.exist;
                        expect(res.status).to.equal(200);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('resource', comment.resource);
                        expect(res.body).to.have.property('text', comment.text);
                        expect(res.body).to.have.property('user', comment.user);

                        expect(res.body).to.have.property('id');

                        done();
                    });
            });
        });

        context('When request is invalid', function () {

            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
            });
            it('Should return TextTooLongError when text is too long', function (done: MochaDone) {
                request(server.app)
                    .post('/api/comment/')
                    .send(invalidComment)
                    .set({ authorization: authorizationHeader })
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res.status).to.equal(400);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', TextTooLongError.name);
                        expect(res.body).to.have.property('message', new TextTooLongError().message);

                        done();
                    });
            });
            it('Should return UnknownParentError when comment\'s parent does not exists', function (done: MochaDone) {
                request(server.app)
                    .post('/api/comment/')
                    .send(fakeParentComment)
                    .set({ authorization: authorizationHeader })
                    .expect(404)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res.status).to.equal(404);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', UnknownParentError.name);
                        expect(res.body).to.have.property('message', new UnknownParentError().message);

                        done();
                    });
            });
        });
    });

    describe('#PUT /api/comment/:id', function () {
        let returnedComment: any;

        context('When request is valid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
                returnedComment = await CommentManager.create(comment);
            });

            it('Should return updated comment', function (done: MochaDone) {
                request(server.app)
                    .put(`/api/comment/${returnedComment.id}`)
                    .send({ text: comment.text })
                    .set({ authorization: authorizationHeader })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res).to.exist;
                        expect(res.status).to.equal(200);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('resource');
                        expect(res.body).to.have.property('text', comment.text);
                        expect(res.body).to.have.property('user');

                        expect(res.body).to.have.property('id');

                        done();
                    });
            });

            it('Should return error status when id is not found', function (done: MochaDone) {
                request(server.app)
                    .put(`/api/comment/${new mongoose.Types.ObjectId()}`)
                    .send(comment)

                    .set({ authorization: authorizationHeader })
                    .expect(404)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res.status).to.equal(404);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', CommentNotFoundError.name);
                        expect(res.body).to.have.property('message', new CommentNotFoundError().message);

                        done();
                    });
            });
        });

        context('When request is invalid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
                returnedComment = await CommentManager.create(comment);
            });

            it('Should return error status when id is invalid', function (done: MochaDone) {
                request(server.app)
                    .put('/api/comment/2')
                    .send(comment)
                    .set({ authorization: authorizationHeader })
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res.status).to.equal(400);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', CommentIdNotValidError.name);
                        expect(res.body).to.have.property('message', new CommentIdNotValidError().message);

                        done();
                    });
            });

            it('Should return error status when property is invalid', function (done: MochaDone) {
                request(server.app)
                    .put(`/api/comment/${returnedComment.id}`)
                    .send({ text: invalidComment.text })

                    .set({ authorization: authorizationHeader })
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res.status).to.equal(400);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', TextTooLongError.name);
                        expect(res.body).to.have.property('message', new TextTooLongError().message);

                        done();
                    });
            });
        });
    });

    describe('#DELETE /api/comment/:id', function () {
        let returnedComment: any;

        context('When request is valid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
                returnedComment = await CommentManager.create(comment);
            });

            it('Should return updated comment', function (done: MochaDone) {
                request(server.app)
                    .delete(`/api/comment/${returnedComment.id}`)

                    .set({ authorization: authorizationHeader })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res).to.exist;
                        expect(res.status).to.equal(200);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');

                        expect(res.body).to.have.property('resource', comment.resource);
                        expect(res.body).to.have.property('text', comment.text);
                        expect(res.body).to.have.property('user', comment.user);

                        expect(res.body).to.have.property('id');

                        done();
                    });
            });

            it('Should return error status when id not found', function (done: MochaDone) {
                request(server.app)
                    .delete(`/api/comment/${new mongoose.Types.ObjectId()}`)

                    .set({ authorization: authorizationHeader })
                    .expect(404)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res.status).to.equal(404);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', CommentNotFoundError.name);
                        expect(res.body).to.have.property('message', new CommentNotFoundError().message);

                        done();
                    });
            });
        });

        context('When request is invalid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
                returnedComment = await CommentManager.create(comment);
            });

            it('Should return error status when id is invalid', function (done: MochaDone) {
                request(server.app)
                    .delete(`/api/comment/${invalidId}`)

                    .set({ authorization: authorizationHeader })
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res.status).to.equal(400);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', CommentIdNotValidError.name);
                        expect(res.body).to.have.property('message', new CommentIdNotValidError().message);

                        done();
                    });
            });
        });
    });

    describe('#GET /api/comment/one', function () {
        const returnedComments: any = [];

        context('When request is valid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
                returnedComments.push(await CommentManager.create(commentArr[0]));
                returnedComments.push(await CommentManager.create(commentArr[1]));
                returnedComments.push(await CommentManager.create(commentArr[2]));

            });

            it('Should return comment', function (done: MochaDone) {
                request(server.app)
                    .get(`/api/comment/one?resource=${comment3.resource}`)

                    .set({ authorization: authorizationHeader })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res).to.exist;
                        expect(res.status).to.equal(200);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('resource', commentArr[2].resource);

                        done();
                    });
            });

            it('Should return error when comment not found', function (done: MochaDone) {
                request(server.app)
                    .get(`/api/comment/one?resource=${unexistingComment.resource}`)

                    .set({ authorization: authorizationHeader })
                    .expect(404)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(res).to.exist;
                        expect(res.status).to.equal(404);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', CommentNotFoundError.name);
                        expect(res.body).to.have.property('message', new CommentNotFoundError().message);

                        done();
                    });
            });
        });
    });

    describe('#GET /api/comment/many', function () {
        const returnedComments: any = [];

        context('When request is valid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
                returnedComments.push(await CommentManager.create(commentArr[0]));
                returnedComments.push(await CommentManager.create(commentArr[1]));
                returnedComments.push(await CommentManager.create(commentArr[2]));
            });

            it('Should return comment', function (done: MochaDone) {
                request(server.app)
                    .get(`/api/comment/many?resource=${comment3.resource}`)
                    .set({ authorization: authorizationHeader })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res).to.exist;
                        expect(res.status).to.equal(200);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('array');
                        expect(res.body[0]).to.have.property('resource', commentArr[2].resource);

                        done();
                    });
            });
        });
    });

    describe('#GET /api/comment/root', function () {
        const returnedComments: any = [];

        context('When request is valid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();

                returnedComments.push(await CommentManager.create(parentLessComment));
                returnedComments.push(await CommentManager.create(parentLessComment2));
                await CommentManager.create({
                    parent: returnedComments[0].id,
                    text: 'tt',
                    user: 'a@v',
                    resource: returnedComments[0].resource,
                } as IComment);
            });

            it('Should return comments', function (done: MochaDone) {
                request(server.app)
                    .get('/api/comment/root')
                    .set({ authorization: authorizationHeader })
                    .query({ resource: parentLessComment.resource })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res).to.exist;
                        expect(res.status).to.equal(200);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('array');
                        expect(res.body).to.be.of.length(2);
                        expect(res.body[0]).to.have.property('resource', parentLessComment.resource);
                        expect(res.body[1]).to.have.property('resource', parentLessComment2.resource);
                        expect(res.body[1]).to.have.property('repliesAmount', 1);
                        expect(res.body[0]).to.have.property('repliesAmount', 0);


                        done();
                    });
            });
        });
    });

    describe('#GET /api/comment/:id/replies', function () {
        const returnedComments: any = [];

        context('When request is valid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
                const parentComment = await CommentManager.create(parent);
                returnedComments.push(await CommentManager.create({ ...commentArr[0], parent: parentComment.id }));
                returnedComments.push(await CommentManager.create({ ...commentArr[0], parent: parentComment.id }));
                returnedComments.push(await CommentManager.create({ ...commentArr[0], parent: parentComment.id}));
            });

            it('Should return replies', function (done: MochaDone) {
                request(server.app)
                    .get(`/api/comment/${returnedComments[0].parent}/replies`)
                    .set({ authorization: authorizationHeader })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res).to.exist;
                        expect(res.status).to.equal(200);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('array');
                        expect(res.body).to.be.of.length(3);
                        expect(res.body[0]).to.have.property('resource', commentArr[0].resource);
                        expect(res.body[1]).to.have.property('resource', commentArr[0].resource);
                        expect(res.body[2]).to.have.property('resource', commentArr[0].resource);

                        done();
                    });
            });
        });
    });

    describe('#GET /api/comment/amount', function () {
        const returnedComments: any = [];

        context('When request is valid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
                returnedComments.push(await CommentManager.create(commentArr[0]));
                returnedComments.push(await CommentManager.create(commentArr[1]));
                returnedComments.push(await CommentManager.create(commentArr[2]));
            });

            it('Should return comment', function (done: MochaDone) {
                request(server.app)
                    .get(`/api/comment/amount?resource=${comment3.resource}`)

                    .set({ authorization: authorizationHeader })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res).to.exist;
                        expect(res.status).to.equal(200);
                        expect(res).to.have.property('body');
                        expect(res.body).be.equal(1);

                        done();
                    });
            });
        });
    });

    describe('#GET /api/comment/:id', function () {
        let returnedComment: any;

        context('When request is valid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
                returnedComment = await CommentManager.create(comment);
            });

            it('Should return comment', function (done: MochaDone) {
                request(server.app)
                    .get(`/api/comment/${returnedComment.id}`)

                    .set({ authorization: authorizationHeader })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res).to.exist;
                        expect(res.status).to.equal(200);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('resource', comment.resource);

                        done();
                    });
            });

            it('Should return error when comment not found', function (done: MochaDone) {
                request(server.app)
                    .get(`/api/comment/${new mongoose.Types.ObjectId()}`)

                    .set({ authorization: authorizationHeader })
                    .expect(404)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(res).to.exist;
                        expect(res.status).to.equal(404);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', CommentNotFoundError.name);
                        expect(res.body).to.have.property('message', new CommentNotFoundError().message);

                        done();
                    });
            });
        });

        context('When request is invalid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
                returnedComment = await CommentManager.create(comment);
            });

            it('Should return error status when id is invalid', function (done: MochaDone) {
                request(server.app)
                    .get(`/api/comment/${invalidId}`)

                    .set({ authorization: authorizationHeader })
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res.status).to.equal(400);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', CommentIdNotValidError.name);
                        expect(res.body).to.have.property('message', new CommentIdNotValidError().message);

                        done();
                    });
            });
        });
    });
});
