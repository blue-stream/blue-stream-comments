import { Types } from 'mongoose';
import { createRequest, createResponse } from 'node-mocks-http';
import { sign } from 'jsonwebtoken';
import { config } from '../../config';
import { IComment } from '../comment.interface';

export const responseMock = createResponse();

export class ValidRequestMocks {

    readonly comment: IComment = {
        resource: (new Types.ObjectId()).toHexString(),
        parent: (new Types.ObjectId()).toHexString(),
        text: 'comment text',
        user: 'a@a',
    };

    readonly comment2: IComment = {
        resource: (new Types.ObjectId()).toHexString(),
        parent: (new Types.ObjectId()).toHexString(),
        text: 'comment text 2',
        user: 'a@b',
    };

    readonly comment3: IComment = {
        resource: (new Types.ObjectId()).toHexString(),
        parent: (new Types.ObjectId()).toHexString(),
        text: 'comment text 3',
        user: 'b@b',
    };

    readonly commentFilter = this.comment;

    authorizationHeader = `Bearer ${sign({ id: 'a@a' }, config.authentication.secret)}`;

    create = createRequest({
        method: 'POST',
        url: '/api/comment/',
        headers: {
            authorization: this.authorizationHeader,
        },
        body: this.comment,
        user: { id: 'a@a' },
    });

    updateTextById = createRequest({
        method: 'PUT',
        url: '/api/comment/',
        headers: {
            authorization: this.authorizationHeader,
        },
        params: {
            id: new Types.ObjectId(),
        },
        body: { text: this.comment.text },
    });

    deleteById = createRequest({
        method: 'DELETE',
        url: '/api/comment/',
        headers: {
            authorization: this.authorizationHeader,
        },
        params: {
            id: new Types.ObjectId(),
        },
    });

    getOne = createRequest({
        method: 'GET',
        url: '/api/comment/one',
        headers: {
            authorization: this.authorizationHeader,
        },
        query: this.comment,
    });

    getMany = createRequest({
        method: 'GET',
        url: '/api/comment/many',
        headers: {
            authorization: this.authorizationHeader,
        },
        query: this.comment,
    });

    getAmount = createRequest({
        method: 'GET',
        url: '/api/comment/amount',
        headers: {
            authorization: this.authorizationHeader,
        },
        query: this.comment,
    });

    getById = createRequest({
        method: 'GET',
        url: '/api/comment/',
        headers: {
            authorization: this.authorizationHeader,
        },
        params: {
            id: new Types.ObjectId(),
        },
    });
}
