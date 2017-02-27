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

  private changePassword(data: any): void {
    this.authenticationService.loginCheckonly(this.authenticationService.getLoggedInEmail(), data.currentPassword)
      .subscribe(result => {
        if (result === true) {
          this.updatePassword(data.password);
        } else {
          this.message = 'Ungültige Anwort vom Server. Interner Server-Fehler.';
        }
      }, error => {
        this.message = `Aktuelles Passwort nicht korrekt (${error})`;
      });
  }

  private updatePassword(password: string) {
    this.restService.get(this.authenticationService.getLoggedInUserId()).subscribe(
      user => {
        user.password = password;
        this.restService.update(user).subscribe(user => {
          this.router.navigate(['/admin/dashboard', {outlets: {admin: ['password-confirmation']}}]);
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
