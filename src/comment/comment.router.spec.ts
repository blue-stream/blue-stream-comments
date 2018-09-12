import * as request from 'supertest';
import { expect } from 'chai';
import * as mongoose from 'mongoose';

import { IComment } from './comment.interface';
import { Server } from '../server';
import { PropertyInvalidError, IdInvalidError, CommentNotFoundError } from '../utils/errors/userErrors';
import { config } from '../config';
import { CommentManager } from './comment.manager';
import { sign } from 'jsonwebtoken';

describe('Comment Module', function () {
    let server: Server;
    const validProppertyString: string = '12345';
    const comment: IComment = {
        property: validProppertyString,
    };
    const authorizationHeader = `Bearer ${sign('mock-user', config.authentication.secret)}`;
    const invalidId: string = '1';
    const invalidProppertyString: string = '123456789123456789';
    const invalidComment: IComment = {
        property: invalidProppertyString,
    };
    

    const comment2: IComment = {
        property: '45678',
    };
    const comment3: IComment = {
        property: '6789',
    };

    const unexistingComment: IComment = {
        property: 'a',
    };

    const comments: IComment[] =
        [comment, comment2, comment3, comment3];

    const invalidComments: IComment[] =
        [comment, invalidComment, comment3];

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
                    .send({ comment })
                    
                    .set({ authorization: authorizationHeader })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res).to.exist;
                        expect(res.status).to.equal(200);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('property', validProppertyString);

                        done();
                    });
            });
        });

        context('When request is invalid', function () {
            
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
            });
            it('Should return error status when property is invalid', function (done: MochaDone) {
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
                        expect(res.body).to.have.property('type', PropertyInvalidError.name);
                        expect(res.body).to.have.property('message', new PropertyInvalidError().message);

                        done();
                    });
            });
        });
    });
    
    describe('#POST /api/comment/many/', function () {
        context('When request is valid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
            });

            it('Should return created comment', function (done: MochaDone) {
                request(server.app)
                    .post('/api/comment/many/')
                    .send({ comments })
                    
                    .set({ authorization: authorizationHeader })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res).to.exist;
                        expect(res.status).to.equal(200);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('array');
                        expect(res.body[1]).to.have.property('property', comments[1].property);

                        done();
                    });
            });
        });

        context('When request is invalid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
            });

            it('Should return error status when property is invalid', function (done: MochaDone) {
                request(server.app)
                    .post('/api/comment/many/')
                    .send({ comments: invalidComments })
                    
                    .set({ authorization: authorizationHeader })
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res.status).to.equal(400);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', PropertyInvalidError.name);
                        expect(res.body).to.have.property('message', new PropertyInvalidError().message);

                        done();
                    });
            });
        });
    });

    describe('#PUT /api/comment/many', function () {
        let returnedComments: any;

        context('When request is valid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
                returnedComments = await CommentManager.createMany(comments);
            });

            it('Should return updated comment', function (done: MochaDone) {
                request(server.app)
                    .put(`/api/comment/many`)
                    .send({ comment: comment2, commentFilter: comment })
                    
                    .set({ authorization: authorizationHeader })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res).to.exist;
                        expect(res.status).to.equal(200);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('ok', 1);
                        expect(res.body).to.have.property('nModified', 1);

                        done();
                    });
            });

            it('Should return 404 error status code', function (done: MochaDone) {
                request(server.app)
                    .put(`/api/comment/many`)
                    .send({ comment, commentFilter: unexistingComment })
                    
                    .set({ authorization: authorizationHeader })
                    .expect(404)
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
                returnedComments = await CommentManager.createMany(comments);
            });

            it('Should return error status when property is invalid', function (done: MochaDone) {
                request(server.app)
                    .put(`/api/comment/many`)
                    .send({ comment: invalidComment, commentFilter: comment2 })
                    
                    .set({ authorization: authorizationHeader })
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res.status).to.equal(400);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', PropertyInvalidError.name);
                        expect(res.body).to.have.property('message', new PropertyInvalidError().message);

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
                    .send({ comment })
                    
                    .set({ authorization: authorizationHeader })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res).to.exist;
                        expect(res.status).to.equal(200);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('property', comment.property);

                        done();
                    });
            });

            it('Should return error status when id is not found', function (done: MochaDone) {
                request(server.app)
                    .put(`/api/comment/${new mongoose.Types.ObjectId()}`)
                    .send({ comment })
                    
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
                    .put(`/api/comment/2`)
                    .send({ comment })
                    
                    .set({ authorization: authorizationHeader })
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res.status).to.equal(400);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', IdInvalidError.name);
                        expect(res.body).to.have.property('message', new IdInvalidError().message);

                        done();
                    });
            });

            it('Should return error status when property is invalid', function (done: MochaDone) {
                request(server.app)
                    .put(`/api/comment/${returnedComment.id}`)
                    .send({ comment: invalidComment })
                    
                    .set({ authorization: authorizationHeader })
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res.status).to.equal(400);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', PropertyInvalidError.name);
                        expect(res.body).to.have.property('message', new PropertyInvalidError().message);

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
                        expect(res.body).to.have.property('property', comment.property);

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
                        expect(res.body).to.have.property('type', IdInvalidError.name);
                        expect(res.body).to.have.property('message', new IdInvalidError().message);

                        done();
                    });
            });
        });
    });

    describe('#GET /api/comment/one', function () {
        let returnedComments: any;

        context('When request is valid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
                returnedComments = await CommentManager.createMany(comments);
            });

            it('Should return comment', function (done: MochaDone) {
                request(server.app)
                    .get(`/api/comment/one?property=${comment3.property}`)
                    
                    .set({ authorization: authorizationHeader })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res).to.exist;
                        expect(res.status).to.equal(200);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('property', comments[2].property);

                        done();
                    });
            });

            it('Should return error when comment not found', function (done: MochaDone) {
                request(server.app)
                    .get(`/api/comment/one?property=${unexistingComment.property}`)
                    
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
        let returnedComments: any;

        context('When request is valid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
                returnedComments = await CommentManager.createMany(comments);
            });

            it('Should return comment', function (done: MochaDone) {
                request(server.app)
                    .get(`/api/comment/many?property=${comment3.property}`)
                    
                    .set({ authorization: authorizationHeader })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res).to.exist;
                        expect(res.status).to.equal(200);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('array');
                        expect(res.body[1]).to.have.property('property', comments[2].property);

                        done();
                    });
            });
        });
    });

    describe('#GET /api/comment/amount', function () {
        let returnedComments: any;

        context('When request is valid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
                returnedComments = await CommentManager.createMany(comments);
            });

            it('Should return comment', function (done: MochaDone) {
                request(server.app)
                    .get(`/api/comment/amount?property=${comment3.property}`)
                    
                    .set({ authorization: authorizationHeader })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res).to.exist;
                        expect(res.status).to.equal(200);
                        expect(res).to.have.property('body');
                        expect(res.body).be.equal(2);

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
                        expect(res.body).to.have.property('property', comment.property);

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
                        expect(res.body).to.have.property('type', IdInvalidError.name);
                        expect(res.body).to.have.property('message', new IdInvalidError().message);

                        done();
                    });
            });
        });
    });
    });
