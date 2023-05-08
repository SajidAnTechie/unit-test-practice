import jwt from 'jsonwebtoken';
import { Result } from '@/common/core/Result';
import { auth } from '@/common/middlewares/auth';
import { HttpCode } from '@/common/exceptions/appError';
import { NextFunction, Request, Response } from 'express';

jest.mock('jsonwebtoken');

describe('Auth Middleware Test', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {
      headers: {}
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  test('it should throw 401 error with no auth headers', () => {
    auth(mockRequest as any, mockResponse as any, nextFunction);
    expect(mockResponse.status).toBeCalledWith(HttpCode.UNAUTHORIZED);
    expect(mockResponse.json).toBeCalledWith(Result.fail('Unauthorized User'));
  });

  test('it should call next function with valid auth token', () => {
    mockRequest.headers.authorization = 'Bearer accessToken';
    (
      jwt.verify as jest.MockedFunction<typeof jwt.verify>
    ).mockImplementationOnce((token, secret, options, callback) => {
      return callback(null, { firstName: 'Sajid' });
    });

    auth(mockRequest as any, mockResponse as any, nextFunction);
    expect(nextFunction).toBeCalled();
  });

  test('it should throw Jwt Expired error with expired token', () => {
    mockRequest.headers.authorization = 'Bearer accessToken';
    (
      jwt.verify as jest.MockedFunction<typeof jwt.verify>
    ).mockImplementationOnce((token, secret, options, callback) => {
      return callback(new Error('jwt expired') as jwt.TokenExpiredError, null);
    });
    auth(mockRequest as any, mockResponse as any, nextFunction);
    expect(mockResponse.json).toBeCalledWith(
      Result.fail('Access Token expired.')
    );
  });

  test('it should throw error with invalid auth token', () => {
    mockRequest.headers.authorization = 'Bearer accessToken';
    (
      jwt.verify as jest.MockedFunction<typeof jwt.verify>
    ).mockImplementationOnce((token, secret, options, callback) => {
      return callback(
        new Error('Invalid Auth Token') as jwt.JsonWebTokenError,
        null
      );
    });
    auth(mockRequest as any, mockResponse as any, nextFunction);
    expect(mockResponse.json).toBeCalledWith(Result.fail('Invalid Auth Token'));
  });
});
