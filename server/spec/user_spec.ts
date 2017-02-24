import {Logger, getLogger} from '../utils/logger';
import {RequestResponse} from 'request';
import {BASE_URL} from './constants';
import {IUser} from '../entities/user.interface';
import {UserType} from '../entities/user-type';
import {loginOptions, authBearerOptions} from './httpOptions';

const LOGGER: Logger = getLogger('user_spec');

describe('REST API Roundtrip Test of User', function () {
  const LOGIN_URL = BASE_URL + 'api/authenticate';
  const TEST_URL = BASE_URL + 'api/users';
  const TEST_EMAIL = 'testuser@test.ch';

  let request = require('request');
  let adminToken: string;
  let testUserId: any;

  describe('Test authentication, login and get all', function () {
    it('returns status code 500 - not yet authenticated', function (done) {
      request.get(TEST_URL,
        authBearerOptions(''),
        function (error: any, response: RequestResponse, body: any) {
          expect(response.statusCode).toBe(500);
          expect(body).toContain('No authorization token was found');
          done();
        });
    });
    it('returns status code 200 - successfull authentication', function (done) {
      request.post(LOGIN_URL,
        loginOptions('admin', '123456'),
        function (error: any, response: RequestResponse, body: any) {
          expect(response.statusCode).toBe(200);
          let authData = JSON.parse(body);
          adminToken = authData.token;
          LOGGER.debug(`admin-token: ${adminToken}`);
          done();
        });
    });
    it('returns status code 200 - found some users', function (done) {
      request.get(TEST_URL,
        authBearerOptions(adminToken),
        function (error: any, response: RequestResponse, body: any) {
          expect(response.statusCode).toBe(200);
          let users: IUser[] = JSON.parse(body);
          LOGGER.debug(`Users: ${JSON.stringify(users)}`);
          expect(users.length).toBeGreaterThan(0);
          done();
        });
    });
  });

  describe('Test user creation and duplicate rejection', function () {
    let testUser: IUser = {
      firstname: 'Hugo',
      lastname: 'Boss',
      type: UserType.STANDARD,
      email: TEST_EMAIL,
      password: '1234'
    };
    it('returns status code 201 - user created', function (done) {
      request.post(TEST_URL,
        authBearerOptions(adminToken, JSON.stringify(testUser)),
        function (error: any, response: RequestResponse, body: any) {
          LOGGER.debug(`User created (body): ${JSON.stringify(body)}`);
          expect(response.statusCode).toBe(201);
          let user: IUser = JSON.parse(body);
          LOGGER.debug(`User created: ${JSON.stringify(user)}`);
          testUserId = user.id;
          LOGGER.debug(`testUserId: ${testUserId}`);
          done();
        });
    });
    it('returns status code 500 - user already exists', function (done) {
      request.post(TEST_URL,
        authBearerOptions(adminToken, JSON.stringify(testUser)),
        function (error: any, response: RequestResponse, body: any) {
          expect(response.statusCode).toBe(500);
          done();
        });
    });
  });

  describe('Test get dedicated user', function () {
    it('returns status code 200 - found user', function (done) {
      request.get(TEST_URL + '/' + testUserId,
        authBearerOptions(adminToken),
        function (error: any, response: RequestResponse, body: any) {
          expect(response.statusCode).toBe(200);
          let user: IUser = JSON.parse(body);
          LOGGER.debug(`User retrieved: ${JSON.stringify(user)}`);
          expect(user.email).toBe(TEST_EMAIL);
          done();
        });
    });
  });

  describe('Test update of a user', function () {
    const LASTNAME = 'The Boss';
    let testUser: IUser = {
      id: testUserId,
      firstname: 'Hugo',
      lastname: LASTNAME,
      type: UserType.STANDARD,
      email: TEST_EMAIL,
      password: '1234'
    };
    it('returns status code 200 - user updated', function (done) {
      request.put(TEST_URL + '/' + testUserId,
        authBearerOptions(adminToken, JSON.stringify(testUser)),
        function (error: any, response: RequestResponse, body: any) {
          expect(response.statusCode).toBe(200);
          let user: IUser = JSON.parse(body);
          LOGGER.debug(`User updated: ${JSON.stringify(user)}`);
          expect(user.lastname).toBe(LASTNAME);
          done();
        });
    });
  });

  describe('Test deletion of a user', function () {
    it('returns status code 200 - user deleted', function (done) {
      request.delete(TEST_URL + '/' + testUserId,
        authBearerOptions(adminToken),
        function (error: any, response: RequestResponse, body: any) {
          expect(response.statusCode).toBe(200);
          testUserId = null;
          done();
        });
    });
  });

  afterAll(function () {
    if (testUserId) {
      LOGGER.error(`AfterAll: test user with id ${testUserId} has not been deleted. Please clean it from the database manually.`);
    }
  });

});
