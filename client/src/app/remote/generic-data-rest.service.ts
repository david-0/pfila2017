import {handleError} from './error-utils';
import {AuthHttp} from 'angular2-jwt';
import {Observable} from "rxjs";
import {IId} from "../../../../server/entities/id.interface";

export class GenericDataRestService<T extends IId> {

  constructor(private authHttp: AuthHttp, private restUrl: string) {
  }

  getAll(id: string): Observable<T[]> {
    const url = `${this.restUrl}/${id}/all`;
    return this.authHttp.get(url)
      .map(response =>
        response.json() as T[]
      )
      .catch(handleError)
  }

  getLatest(id: string): Observable<T> {
    const url = `${this.restUrl}/${id}/latest`;
    return this.authHttp.get(url)
      .map(response => response.json() as T)
      .catch(handleError);
  }
}
