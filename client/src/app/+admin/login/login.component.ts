import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {AuthenticationService} from "../authentication.service";
import {FormControl, FormGroup, FormBuilder, Validators} from "@angular/forms";
import {AuthGuard} from "../auth-guard.service";

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss']
})
export class LoginComponent implements OnInit {

  private form: FormGroup;
  private emailControl: FormControl;
  private passwordControl: FormControl;

  private message: string;

  constructor(private fb: FormBuilder,
              private authenticationService: AuthenticationService,
              private authGuard: AuthGuard,
              private router: Router) {
    this.emailControl = new FormControl('', [Validators.required]);
    this.passwordControl = new FormControl('', [Validators.required]);
    this.form = fb.group({
      "email": this.emailControl,
      "password": this.passwordControl,
    });
  }

  ngOnInit() {
    this.authenticationService.logout();
  }

  private doLogin(data: any, valid: boolean): void {
    this.authenticationService.login(data.email, data.password)
      .subscribe(result => {
        if (result === true) {
          let url = this.authGuard.redirectUrl ? this.authGuard.redirectUrl : '/admin/dashboard';
          this.router.navigate([url]);
        } else {
          this.message = 'email or password is incorrect';
        }
      }, error => {
        this.message = <any>error;
      });
  }

  clearMessage(): void {
    this.message = null;
  }
}
