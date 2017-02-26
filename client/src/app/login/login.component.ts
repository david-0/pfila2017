import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";

import {AuthenticationService} from "../remote/authentication.service";
import {AuthGuard} from "../auth/auth-guard.service";
import {AppComponent} from '../app.component';
import {User} from '../user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;
  message: string;
  loggedOut: boolean = true;

  // TODO: change variable names?
//  loaded = false;
//  model: any = {};
//  error : string = "";

  constructor(private authenticationService: AuthenticationService,
              private authGuard: AuthGuard,
              private router: Router) {
  }

  ngOnInit() {
    this.authenticationService.logout();
    this.loggedOut = !this.authenticationService.loggedIn();
  }

  doLogin(): void {
    this.authenticationService.login(this.username, this.password)
      .subscribe(result => {
        if (result === true) {
          let url = this.authGuard.redirectUrl ? this.authGuard.redirectUrl : '/dashboard';
          this.router.navigate([url]);
        } else {
          this.message = 'Username or password is incorrect';
          this.loggedOut = true;
        }
      }, error => {
        this.message = <any>error;
      });
  }

  doLogout(): void {
    this.authenticationService.logout();
    this.loggedOut = true;
  }

  clearMessage(): void {
    this.message = null;
  }
}
