import {handleError} from "./error-utils";
import {Observable} from "rxjs";
import {IId} from "../../../../server/entities/id.interface";
import {MyHttpInterface} from "./my-http.interface";

export class GenericRestService<T extends IId> {

  constructor(private myHttp: MyHttpInterface, private restUrl: string) {
  }

  add(item: T): Observable<T> {
    return this.myHttp
      .post(this.restUrl, JSON.stringify(item))
      .map(response => response.json() as T)
      .catch(handleError);
  }

  update(item: T): Observable<T> {
    const url = `${this.restUrl}/${item.id}`;
    return this.myHttp
      .put(url, JSON.stringify(item))
      .map(response => response.json() as T)
      .catch(handleError);
  }

  del(id: string): Observable<string> {
    const url = `${this.restUrl}/${id}`;
    return this.myHttp
      .delete(url)
      .map(response => response.json() as String)
      .catch(handleError);
  }

  getAll(): Observable<T[]> {
    return this.myHttp.get(this.restUrl)
      .map(response =>
        response.json() as T[]
      )
      .catch(handleError)
  }

  get(id: string): Observable<T> {
    const url = `${this.restUrl}/${id}`;
    return this.myHttp.get(url)
      .map(response => response.json() as T)
      .catch(handleError);
  }
}
