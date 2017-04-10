import {handleError} from './error-utils';
import {AuthHttp} from 'angular2-jwt';
import {Observable} from 'rxjs/Observable';
import {Injectable} from '@angular/core';

@Injectable()
export class PasswordChangeRestService {

  constructor(private authHttp: AuthHttp) {
  }

  update(password: string): Observable<boolean> {
    const url = `/api/password-change`;
    return this.authHttp
      .put(url, {password})
      .map(response => response.json() as boolean)
      .catch(handleError);
  }
}
