import {handleError} from './error-utils';
import {AuthHttp} from 'angular2-jwt';
import {Observable} from "rxjs";
import {IId} from "../../../../server/entities/id.interface";

export class GenericRestService<T extends IId> {

  constructor(private authHttp: AuthHttp, private restUrl: string) {
  }

  add(item: T): Observable<T> {
    return this.authHttp
      .post(this.restUrl, JSON.stringify(item))
      .map(response => response.json() as T)
      .catch(handleError);
  }

  update(item: T): Observable<T> {
    const url = `${this.restUrl}/${item.id}`;
    return this.authHttp
      .put(url, JSON.stringify(item))
      .map(response => response.json() as T)
      .catch(handleError);
  }

  del(id: string): Observable<string> {
    const url = `${this.restUrl}/${id}`;
    return this.authHttp
      .delete(url)
      .map(response => response.json() as String)
      .catch(handleError);
  }

  getAll(): Observable<T[]> {
    return this.authHttp.get(this.restUrl)
      .map(response =>
        response.json() as T[]
      )
      .catch(handleError)
  }

  get(id: string): Observable<T> {
    const url = `${this.restUrl}/${id}`;
    return this.authHttp.get(url)
      .map(response => response.json() as T)
      .catch(handleError);
  }
}
