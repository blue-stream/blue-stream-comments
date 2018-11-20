import * as request from 'supertest';
import { expect } from 'chai';
import * as mongoose from 'mongoose';

import { IComment } from './comment.interface';
import { Server } from '../server';
import {
    CommentIdNotValidError,
    CommentNotValidError,
    CommentTextNotValidError,
    IdNotFoundError,
    TextTooLongError,
    TextTooShortError,
    UserIdNotValidError,
    VideoIdNotValidError,
} from '../utils/errors/userErrors';
import { config } from '../config';
import { CommentManager } from './comment.manager';
import { sign } from 'jsonwebtoken';
import { commentValidatorConfig } from './validator/comment.validator.config';

describe('Comment Module', function () {
    let server: Server;

    const invalidId: string = 'a';
    const invalidUser: string = 'a';
    const invalidComment: Partial<IComment> = {
        video: invalidId,
        parent: invalidId,
        text: '1'.repeat(commentValidatorConfig.text.maxLength + 1),
        user: invalidUser,
    };

    const commentDataToUpdate: Partial<IComment> = { text: 'updated text' };
    const unexistingComment: Partial<IComment> = { user: 'c@c' };
    const unknownProperty: Object = { unknownProperty: true };
    const comment: IComment = {
        video: (new mongoose.Types.ObjectId()).toHexString(),
        parent: (new mongoose.Types.ObjectId()).toHexString(),
        text: 'comment text',
        user: 'a@a',
    };

    const comment2: IComment = {
        video: (new mongoose.Types.ObjectId()).toHexString(),
        parent: (new mongoose.Types.ObjectId()).toHexString(),
        text: 'comment text 2',
        user: 'a@b',
    };

    const comment3: IComment = {
        video: (new mongoose.Types.ObjectId()).toHexString(),
        parent: (new mongoose.Types.ObjectId()).toHexString(),
        text: 'comment text 3',
        user: 'b@b',
    };

    const commentArr = [comment, comment2, comment3];

    const authorizationHeader = `Bearer ${sign('mock-user', config.authentication.secret)}`;

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
                        expect(res.body).to.have.property('video', comment.video);
                        expect(res.body).to.have.property('text', comment.text);
                        expect(res.body).to.have.property('user', comment.user);
                        expect(res.body).to.have.property('parent', comment.parent);

                        expect(res.body).to.have.property('_id');

                        done();
                    });
            });
        });

        context('When request is invalid', function () {

            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
            });
            it('Should return error status when video is invalid', function (done: MochaDone) {
                request(server.app)
                    .post('/api/comment/')
                    .send({ comment: invalidComment })

                    .set({ authorization: authorizationHeader })
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res.status).to.equal(400);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', VideoIdNotValidError.name);
                        expect(res.body).to.have.property('message', new VideoIdNotValidError().message);

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
                        expect(res.body).to.have.property('video', comment.video);
                        expect(res.body).to.have.property('text', comment.text);
                        expect(res.body).to.have.property('user', comment.user);
                        expect(res.body).to.have.property('parent', comment.parent);

                        expect(res.body).to.have.property('_id');

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
                        expect(res.body).to.have.property('type', IdNotFoundError.name);
                        expect(res.body).to.have.property('message', new IdNotFoundError().message);

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
                    .send(invalidComment)

                    .set({ authorization: authorizationHeader })
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res.status).to.equal(400);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', VideoIdNotValidError.name);
                        expect(res.body).to.have.property('message', new VideoIdNotValidError().message);

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

                        expect(res.body).to.have.property('video', comment.video);
                        expect(res.body).to.have.property('text', comment.text);
                        expect(res.body).to.have.property('user', comment.user);
                        expect(res.body).to.have.property('parent', comment.parent);

                        expect(res.body).to.have.property('_id');

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
                        expect(res.body).to.have.property('type', IdNotFoundError.name);
                        expect(res.body).to.have.property('message', new IdNotFoundError().message);

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
                    .get(`/api/comment/one?video=${comment3.video}`)

                    .set({ authorization: authorizationHeader })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res).to.exist;
                        expect(res.status).to.equal(200);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('video', commentArr[2].video);

                        done();
                    });
            });

            it('Should return error when comment not found', function (done: MochaDone) {
                request(server.app)
                    .get(`/api/comment/one?video=${unexistingComment.video}`)

                    .set({ authorization: authorizationHeader })
                    .expect(404)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(res).to.exist;
                        expect(res.status).to.equal(404);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', IdNotFoundError.name);
                        expect(res.body).to.have.property('message', new IdNotFoundError().message);

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
                    .get(`/api/comment/many?video=${comment3.video}`)
                    .set({ authorization: authorizationHeader })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res).to.exist;
                        expect(res.status).to.equal(200);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('array');
                        expect(res.body[0]).to.have.property('video', commentArr[2].video);

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
                    .get(`/api/comment/amount?video=${comment3.video}`)

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
                        expect(res.body).to.have.property('video', comment.video);

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
                        expect(res.body).to.have.property('type', IdNotFoundError.name);
                        expect(res.body).to.have.property('message', new IdNotFoundError().message);

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
