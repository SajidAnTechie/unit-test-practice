import {
  fetchUser,
  createUser,
  getExistingUser
} from '@modules/users/repository/user.repository';
import * as UserService from '@modules/users/services/user.service';
import { User } from '@prisma/client';
import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import {
  mapUserToUserResponse,
  userLoginResponse
} from '@/modules/users/mappers/userResponseMapper';
import { AppError } from '@/common/exceptions/appError';

jest.mock('@modules/users/repository/user.repository', () => {
  return {
    fetchUser: jest.fn(),
    createUser: jest.fn(),
    getExistingUser: jest.fn()
  };
});

jest.mock('bcrypt', () => {
  return {
    hash: jest.fn(),
    compare: jest.fn()
  };
});

jest.mock('jsonwebtoken', () => {
  return {
    sign: jest.fn()
  };
});

describe('Get users', () => {
  const payload: User[] = [
    {
      id: '12345',
      firstName: 'John',
      lastName: 'Doe',
      password: '1234',
      address: '123 Main Street',
      phoneNumber: '+1 (555) 555-5555',
      email: 'johndoe@example.com',
      isActive: true,
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '98765',
      firstName: 'Jane',
      lastName: 'Smith',
      password: 'abcd',
      address: '456 Elm Street',
      phoneNumber: '+1 (555) 123-4567',
      email: 'jane.smith@example.com',
      isActive: true,
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return users json body', async () => {
    (fetchUser as jest.MockedFunction<typeof fetchUser>).mockResolvedValue(
      Promise.resolve(payload)
    );

    const payloadToCompare = payload.map((user) => mapUserToUserResponse(user));
    const users = await UserService.getUsers();
    expect(fetchUser).toHaveBeenCalled();
    expect(users).toStrictEqual(payloadToCompare);
  });

  it('should return bad request when users is null', async () => {
    (fetchUser as jest.MockedFunction<typeof fetchUser>).mockResolvedValue(
      null as any
    );

    await expect(() => UserService.getUsers()).rejects.toThrow();
    await expect(() => UserService.getUsers()).rejects.toThrow(
      AppError.badRequest(`Error while retrieving users.`)
    );
  });
});

describe('User signup', () => {
  const userCreateDto = {
    firstName: 'John',
    lastName: 'Doe',
    password: '1234',
    address: '123 Main Street',
    phoneNumber: '+1 (555) 555-5555',
    email: 'johndoe@example.com'
  };
  const userData: User = {
    id: '12345',
    firstName: 'John',
    lastName: 'Doe',
    password: '1234',
    address: '123 Main Street',
    phoneNumber: '+1 (555) 555-5555',
    email: 'johndoe@example.com',
    isActive: true,
    isVerified: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  const bcryptSalt = 10;

  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should be able to sigh up', async () => {
    (
      getExistingUser as jest.MockedFunction<typeof getExistingUser>
    ).mockResolvedValue(null as any);

    (createUser as jest.MockedFunction<typeof createUser>).mockResolvedValue(
      Promise.resolve(userData)
    );

    (hash as jest.MockedFunction<typeof hash>).mockImplementation(() =>
      Promise.resolve(userCreateDto.password)
    );

    const user = await UserService.userSignup(userCreateDto);
    const payloadToCompare = mapUserToUserResponse(userData);

    expect(getExistingUser).toHaveBeenCalled();
    expect(hash).toHaveBeenCalledWith(userCreateDto.password, bcryptSalt);
    expect(createUser).toHaveBeenCalledWith(userCreateDto);
    expect(user).toStrictEqual(payloadToCompare);
  });

  it('should return bad request when existing user is found', async () => {
    (
      getExistingUser as jest.MockedFunction<typeof getExistingUser>
    ).mockResolvedValue(userData);

    await expect(() => UserService.userSignup(userCreateDto)).rejects.toThrow();
    await expect(() => UserService.userSignup(userCreateDto)).rejects.toThrow(
      AppError.badRequest(
        `User already exists with email ${userCreateDto.email}`
      )
    );
  });
});

describe('User signin', () => {
  const userSignInDto = {
    firstName: 'John',
    lastName: 'Doe',
    password: '1234',
    address: '123 Main Street',
    phoneNumber: '+1 (555) 555-5555',
    email: 'johndoe@example.com'
  };
  const userData: User = {
    id: '12345',
    firstName: 'John',
    lastName: 'Doe',
    password: '1234',
    address: '123 Main Street',
    phoneNumber: '+1 (555) 555-5555',
    email: 'johndoe@example.com',
    isActive: true,
    isVerified: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const accessToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
  const refreshToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlRoaXMgaXMgcmVmcmVzaCB0b2tlbiIsImlhdCI6MTUxNjIzOTAyMn0.tPMjMMScVLLdksdC4qDZ7uzuapfuxaj2WZnhHTgPyYs';
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be able to sigh in', async () => {
    (
      getExistingUser as jest.MockedFunction<typeof getExistingUser>
    ).mockResolvedValue(userData);

    (compare as jest.MockedFunction<typeof compare>).mockImplementation(() =>
      Promise.resolve(true)
    );

    (sign as jest.MockedFunction<typeof sign>)
      .mockImplementationOnce(() => accessToken)
      .mockImplementationOnce(() => refreshToken);

    const user = await UserService.userSignin(userSignInDto);
    const payloadToCompare = userLoginResponse(
      userData,
      accessToken,
      refreshToken
    );
    expect(getExistingUser).toHaveBeenCalled();
    expect(compare).toHaveBeenCalledWith(
      userData.password,
      userSignInDto.password
    );
    expect(sign).toHaveBeenCalledTimes(2);
    expect(user).toStrictEqual(payloadToCompare);
  });

  it('should return bad request when existing user not found', async () => {
    (
      getExistingUser as jest.MockedFunction<typeof getExistingUser>
    ).mockResolvedValue(null as any);

    await expect(() => UserService.userSignin(userSignInDto)).rejects.toThrow();
    await expect(() => UserService.userSignin(userSignInDto)).rejects.toThrow(
      AppError.badRequest(
        `User with email: ${userSignInDto.email} is not registered in our system. Please use registered email to login into the system.`
      )
    );
  });

  it('should return bad request when password does not match', async () => {
    (
      getExistingUser as jest.MockedFunction<typeof getExistingUser>
    ).mockResolvedValue(userData);

    (compare as jest.MockedFunction<typeof compare>).mockImplementation(() =>
      Promise.resolve(false)
    );

    await expect(() => UserService.userSignin(userSignInDto)).rejects.toThrow();
    await expect(() => UserService.userSignin(userSignInDto)).rejects.toThrow(
      AppError.badRequest(
        `Email or password did not match. Please check your credentials`
      )
    );
  });
});
