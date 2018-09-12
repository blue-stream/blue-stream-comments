import { Types } from 'mongoose';
import { createRequest, createResponse } from 'node-mocks-http';
import { sign } from 'jsonwebtoken';
import { config } from '../../config';

export const responseMock = createResponse();

export class ValidRequestMocks {
    readonly validProperty: string = '12345';
    readonly validProperty2: string = '23456';
    readonly validProperty3: string = '34567';

    readonly comment = {
        property: this.validProperty,
    };

    readonly comment2 = {
        property: this.validProperty2,
    };

    readonly comment3 = {
        property: this.validProperty3,
    };

    readonly commentFilter = this.comment;

    authorizationHeader = `Bearer ${sign('mock-user', config.authentication.secret)}`;

    create = createRequest({
        method: 'POST',
        url: '/api/comment/',
        headers: {
            authorization: this.authorizationHeader,
        },
        body: {
            comment: this.comment,
        },
    });

    createMany = createRequest({
        method: 'POST',
        url: '/api/comment/many/',
        headers: {
            authorization: this.authorizationHeader,
        },
        body: {
            comments: [
                this.comment,
                this.comment2,
                this.comment3,
            ],
        },
    });

    updateMany = createRequest({
        method: 'PUT',
        url: '/api/comment/many',
        headers: {
            authorization: this.authorizationHeader,
        },
        body: {
            commentFilter: this.commentFilter,
            comment: this.comment,
        },
    });

    updateById = createRequest({
        method: 'PUT',
        url: '/api/comment/:id',
        headers: {
            authorization: this.authorizationHeader,
        },
        params: {
            id: new Types.ObjectId(),
        },
        body: {
            comment: this.comment,
        },
    });

    deleteById = createRequest({
        method: 'DELETE',
        url: '/api/comment/:id',
        headers: {
            authorization: this.authorizationHeader,
        },
        params: {
            id: new Types.ObjectId(),
        },
    });

    getOne = createRequest({
        method: 'GET',
        url: `/api/comment/one?commentFilter={'property':${this.validProperty}}`,
        headers: {
            authorization: this.authorizationHeader,
        },
        query: this.comment,
    });

    getMany = createRequest({
        method: 'GET',
        url: `/api/comment/many?commentFilter={'property':${this.validProperty}}`,
        headers: {
            authorization: this.authorizationHeader,
        },
        query: this.comment,
    });

    getAmount = createRequest({
        method: 'GET',
        url: `/api/comment/amount?commentFilter={'property':${this.validProperty}}`,
        headers: {
            authorization: this.authorizationHeader,
        },
        query: this.comment,
    });

    getById = createRequest({
        method: 'GET',
        url: '/api/comment/:id',
        headers: {
            authorization: this.authorizationHeader,
        },
        params: {
            id: new Types.ObjectId(),
        },
    });
}
