import {Injectable} from "@angular/core";
import {Http, Headers, Response} from "@angular/http";
import {Observable} from "rxjs";
import "rxjs/add/operator/map";
import {tokenNotExpired, JwtHelper} from "angular2-jwt";
import {UserType} from "../../user";
import {handleError} from "../../remote/error-utils";

@Injectable()
export class AuthenticationService {
  private static readonly tokenKey: string = 'id_token';
  private jwtHelper: JwtHelper = new JwtHelper();
  private headers = new Headers({'Content-Type': 'application/json'});
  private email: string;
  private userId: any;
  private userType: UserType;

  constructor(private http: Http) {
    let token = localStorage.getItem(AuthenticationService.tokenKey);
    if (token) {
      this.decodeToken(token);
      console.log('token restored');
    }
  }


  public login(email: string, password: string): Observable<boolean> {
    return this.loginInternal(email, password, (token: string) => {
      // store jwt token in local storage to keep user logged in between page refreshes
      localStorage.setItem(AuthenticationService.tokenKey, token);
      this.decodeToken(token);
      console.log(`login succeeded. email: ${this.email}`);
    });
}

  public loginCheckonly(email: string, password: string): Observable<boolean> {
    return this.loginInternal(email, password, () => {});
  }

  private loginInternal(email: string, password: string, processCallback: (token: string) => void): Observable<boolean> {
    return this.http.post('/api/authenticate', JSON.stringify({
      email: email,
      password: password
    }), {headers: this.headers})
      .map((response: Response) => {
        // login successful if there's a jwt token in the response
        let token: string = response.json() && response.json().token as string;
        if (token) {
          processCallback(token);
          return true;
        } else {
          return false;
        }
      })
      .catch(handleError);
  }

  private decodeToken(token: string) {
    let decodedToken = this.jwtHelper.decodeToken(this.getToken());
    this.email = decodedToken.email;
    this.userId = decodedToken.id;
    this.userType = decodedToken.type;
  }

  logout(): void {
    localStorage.removeItem(AuthenticationService.tokenKey);
  }

  loggedIn(): boolean {
    let isLoggedIn = tokenNotExpired();
    return isLoggedIn;
  }

  getToken(): string {
    return localStorage.getItem('id_token');
  }

  getLoggedInEmail(): string {
    return this.loggedIn() ? this.email : null;
  }

  getLoggedInUserId(): any {
    return this.loggedIn() ? this.userId : null;
  }

  getLoggedInUserType(): UserType {
    return this.loggedIn() ? this.userType : null;
  }

  public isAdmin() : boolean {
    return this.loggedIn() && this.userType === UserType.ADMIN;
  }
}
