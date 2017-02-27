import {Component, OnInit} from "@angular/core";
import {FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
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
  private message: string;
  private restService: GenericRestService<IUser>;

  constructor(private authenticationService: AuthenticationService,
              private router: Router,
              private http: AuthHttp) {
  }

  private changePassword(data: any, form: FormGroup,): void {
    this.authenticationService.loginCheckonly(this.authenticationService.getLoggedInEmail(), data.currentPassword)
      .subscribe(result => {
        if (result === true) {
          this.updatePassword(data.password, form);
        } else {
          this.message = 'Ungültige Anwort vom Server. Interner Server-Fehler.';
        }
      }, error => {
        this.message = `Aktuelles Passwort nicht korrekt (${error})`;
      });
  }

  private updatePassword(password: string, form: FormGroup) {
    this.restService.get(this.authenticationService.getLoggedInUserId()).subscribe(
      user => {
        user.password = password;
        this.restService.update(user).subscribe(user => {
          this.message = 'Passwort geändert';
          form.reset();
          setTimeout(() => this.router.navigate(['/admin/dashboard']), 2000);
        }, error => {
          this.message = `Fehler beim Passwot ändern (${error})`;
        });
      },
      error => {
        this.message = `Fehler beim Passwort ändern (${error})`
      });
  }

  ngOnInit() {
    this.restService = new GenericRestService<IUser>(this.http, "/api/users");
  }

}
