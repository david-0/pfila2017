'use strict';

import {RequestResponse} from 'request';
import {BASE_URL} from './constants';

let request = require('request');

describe('REST API Roundtrip Test of the "about" page', function () {
  const TEST_URL = BASE_URL + 'about';
  describe('GET ' + TEST_URL, function () {
    it('returns status code 200', function (done) {
      request.get(TEST_URL, function (error: any, response: RequestResponse, body: any) {
        expect(response.statusCode).toBe(200);
        expect(body).toContain('Homeautomation');
        done();
      });
    });
  });
});
