import { User } from '@prisma/client';
import UserResponse from '@/modules/users/dto/userResponse.dto';
import LoginResponse from '@/modules/users/dto/loginResponse.dto';
import * as Mappers from '@modules/users/mappers/userResponseMapper';

describe('mapUserToUserResponse', () => {
  test('it should map a user to a user response', () => {
    const expectedResult = {
      id: '12345',
      firstName: 'John',
      lastName: 'Doe',
      address: '123 Main Street',
      phoneNumber: '+1 (555) 555-5555',
      email: 'johndoe@example.com',
      isActive: true,
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const payload: User = {
      ...expectedResult,
      password: '1234'
    };
    const res: UserResponse = Mappers.mapUserToUserResponse(payload);
    expect(expectedResult).toStrictEqual(res);
  });
});

describe('userLoginResponse', () => {
  test('it should return a LoginResponse object with the correct properties', () => {
    const accessToken = 'AccessToken';
    const refreshToken = 'RefreshToken';
    const expectedResult = {
      id: '12345',
      name: 'John Doe',
      accessToken: accessToken,
      refreshToken: refreshToken
    };
    const user: User = {
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
    const res: LoginResponse = Mappers.userLoginResponse(
      user,
      accessToken,
      refreshToken
    );
    expect(expectedResult).toStrictEqual(res);
  });
});
