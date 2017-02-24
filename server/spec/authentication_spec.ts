'use strict';

import {Logger, getLogger} from '../utils/logger';
import {RequestResponse} from 'request';
import {BASE_URL} from './constants';
import {loginOptions, authBearerOptions} from './httpOptions';

const LOGGER: Logger = getLogger('authentication_spec');

let request = require('request');
let adminToken: string;

describe('Initial Authentication Test', function () {
  const TEST_URL = BASE_URL + 'api/authenticate';
  describe('POST ' + TEST_URL, function () {
    it('returns status code 401 -  wrong username or password', function (done) {
      let username: string = 'admin';
      request.post(TEST_URL,
        loginOptions(username, 'xxxxxx'),
        function (error: any, response: RequestResponse, body: any) {
          expect(response.statusCode).toBe(401);
          expect(body).toContain(`Incorrect username or password.`);
          done();
        });
    });
  });
  it('returns status code 200 - successfull authentication', function (done) {
    request.post(TEST_URL,
      loginOptions('admin', '123456'),
      function (error: any, response: RequestResponse, body: any) {
        expect(response.statusCode).toBe(200);
        let authData = JSON.parse(body);
        adminToken = authData.token;
        LOGGER.debug(`admin-token: ${adminToken}`);
        done();
      });
  });
});

describe('Token-based Authentication Test', function () {
  const TEST_URL = BASE_URL + 'api/authenticated';
  describe('GET ' + TEST_URL, function () {
    it('returns status code 200 - valid token provided', function (done) {
      request.get(TEST_URL,
        authBearerOptions(adminToken),
        function (error: any, response: RequestResponse, body: any) {
          expect(response.statusCode).toBe(200);
          expect(body).toContain(`authentication is valid`);
          done();
        });
    });
    it('returns status code 500 - authBearerHeader', function (done) {
      request.get(TEST_URL,
        authBearerOptions('any-bla-bla'),
        function (error: any, response: RequestResponse, body: any) {
          expect(response.statusCode).toBe(500);
          expect(body).toContain('jwt malformed');
          done();
        });
    });
  });
});
