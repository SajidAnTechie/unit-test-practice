import { Result } from '@common/core/Result';
import {
  signup,
  signin,
  get
} from '@modules/users/controllers/user.controller';
import { HttpCode } from '@common/exceptions/appError';
import { Request, Response } from 'express';
import {
  userSignup,
  userSignin,
  getUsers
} from '@modules/users/services/user.service';
import LoginResponse from '@/modules/users/dto/loginResponse.dto';

jest.mock('@modules/users/services/user.service');

describe('signup controller', () => {
  const mockReq: Request = {
    body: {
      email: 'test@example.com',
      password: 'password123'
    }
  } as unknown as Request;

  const mockRes: Response = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  } as unknown as Response;

  const mockUserData = {
    id: '123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phoneNumber: '123-456-7890',
    address: '123 Main St, Anytown USA',
    isActive: true,
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should call userSignup with the correct arguments', async () => {
    userSignup as jest.MockedFunction<typeof userSignup>;
    await signup(mockReq, mockRes);
    expect(userSignup).toBeCalledWith(mockReq.body);
  });

  test('should return the correct response with status 201', async () => {
    (userSignup as jest.MockedFunction<typeof userSignup>).mockResolvedValue(
      mockUserData
    );
    const payload = Result.ok(mockUserData);
    await signup(mockReq, mockRes);
    expect(mockRes.status).toBeCalledWith(HttpCode.CREATED);
    expect(mockRes.json).toBeCalledWith(payload);
  });
});

describe('signin controller', () => {
  const mockReq: Request = {
    body: {
      email: 'test@example.com',
      password: 'password123'
    }
  } as unknown as Request;

  const mockRes: Response = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  } as unknown as Response;

  const mockUserData = {
    id: '123',
    name: 'John Doe',
    accessToken: 'john.doe@example.com',
    refreshToken: 'john.doe@example.com'
  } as LoginResponse;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should call userSignin with the correct arguments', async () => {
    userSignin as jest.MockedFunction<typeof userSignin>;
    await signin(mockReq, mockRes);
    expect(userSignin).toBeCalledWith(mockReq.body);
  });

  test('should return the correct response with status 200', async () => {
    (userSignin as jest.MockedFunction<typeof userSignin>).mockResolvedValue(
      mockUserData
    );
    const payload = Result.ok(mockUserData);
    await signin(mockReq, mockRes);
    expect(mockRes.status).toBeCalledWith(HttpCode.OK);
    expect(mockRes.json).toBeCalledWith(payload);
  });
});

describe('getUsers controller', () => {
  const mockReq: Request = {} as unknown as Request;
  const mockRes: Response = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  } as unknown as Response;

  const mockUserData = [
    {
      id: '123',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phoneNumber: '123-456-7890',
      address: '123 Main St, Anytown USA',
      isActive: true,
      isVerified: true,
      createdAt: '2023-04-06T12:00:18.279Z',
      updatedAt: '2023-04-06T12:00:18.279Z'
    },
    {
      id: '345',
      firstName: 'Xavier',
      lastName: 'Cal',
      email: 'xavier.cal@example.com',
      phoneNumber: '123-456-7890',
      address: '123 Main St, Anytown USA',
      isActive: true,
      isVerified: true,
      createdAt: '2023-04-06T12:00:18.279Z',
      updatedAt: '2023-04-06T12:00:18.279Z'
    }
  ];
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should call getUsers with the correct arguments', async () => {
    getUsers as jest.MockedFunction<typeof getUsers>;
    await get(mockReq, mockRes);
    expect(getUsers).toBeCalledWith();
  });

  test('should return the correct response with status 200', async () => {
    (getUsers as jest.MockedFunction<typeof getUsers>).mockResolvedValue(
      mockUserData
    );
    const payload = Result.ok(mockUserData);
    await get(mockReq, mockRes);
    expect(mockRes.status).toBeCalledWith(HttpCode.OK);
    expect(mockRes.json).toBeCalledWith(payload);
  });
});
