import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, FormBuilder, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthGuard} from "../services/auth-guard.service";
import {AuthenticationService} from "../services/authentication.service";
import {GenericRestService} from "../../remote/generic-rest.service";
import {IUser} from "../../../../../server/entities/user.interface";
import {AuthHttp} from "angular2-jwt";

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.scss']
})
export class PasswordChangeComponent implements OnInit {

  private form: FormGroup;
  private currentPasswordControl: FormControl;
  private passwordControl: FormControl;
  private passwordRetypeControl: FormControl;
  private message: string;
  private restService: GenericRestService<IUser>;

  constructor(private fb: FormBuilder,
              private authenticationService: AuthenticationService,
              private authGuard: AuthGuard,
              private router: Router,
              private http: AuthHttp) {
    this.currentPasswordControl = new FormControl('', [Validators.required]);
    this.passwordControl = new FormControl('', [Validators.required, Validators.minLength(7)]);
    this.passwordRetypeControl = new FormControl('', [Validators.minLength(7)]); // equals
    this.form = fb.group({
      "currentPassword": this.currentPasswordControl,
      "password": this.passwordControl,
      "passwordRetype": this.passwordRetypeControl,
    });
  }

  private changePassword(data: any, valid: boolean): void {
    this.authenticationService.loginCheckonly(this.authenticationService.getLoggedInEmail(), data.currentPassword)
      .subscribe(result => {
          if (result === true) {
            this.restService.get(this.authenticationService.getLoggedInUserId()).subscribe(
              user => {
                user.password = data.password;
                this.restService.update(user).subscribe(
                  user => {
                    this.message = 'Passwort geändert';
                    this.form.reset();
                    setTimeout(() => this.router.navigate(['/admin/dashboard']), 2000);
                  }
                  , error => {
                    this.message = `Fehler beim Passwot ändern (${error})`;
                  }
                );
              },
              error => {
                this.message = `Fehler beim Passwort ändern (${error})`
              });
          } else {
            this.message = 'Ungültige Anwort vom Server. Server-Fehler.';
          }
        }, error => {
          this.message = `Aktuelles Passwort nicht korrekt (${error})`;
        }
      );
  }

  ngOnInit() {
    this.restService = new GenericRestService<IUser>(this.http, "/api/users");
  }

}
