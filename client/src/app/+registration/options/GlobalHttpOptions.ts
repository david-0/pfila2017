import {Headers, RequestOptions} from "@angular/http";
export class GlobalHttpOptions extends RequestOptions {
  constructor() {
    super({
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });
  }
}
