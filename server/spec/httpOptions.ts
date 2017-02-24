import {CoreOptions} from '@types/request';

export function loginOptions(username: string, password: string): CoreOptions {
  let options: CoreOptions = {
    headers: {
      'Content-Type': 'application/json'
    },
    form: {username: username, password: password}
  };
  return options;
}

export function authBearerOptions(token: string, body?: any): CoreOptions {
  let options: CoreOptions = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
  if (body) {
    options.body = body;
  }
  return options;
}
