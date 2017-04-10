import {Component} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationService} from "../services/authentication.service";
import {AuthHttp} from "angular2-jwt";
import {PasswordChangeRestService} from "../../remote/password-change-rest.service";

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.scss'],
})
export class PasswordChangeComponent {
  private message: string;

  constructor(private authenticationService: AuthenticationService,
              private router: Router,
              private route: ActivatedRoute,
              private passwordChangeRestService: PasswordChangeRestService) {
  }

    changePassword(data: any): void {
    this.authenticationService.loginCheckonly(this.authenticationService.getLoggedInEmail(), data.currentPassword)
      .subscribe(result => {
        if (result === true) {
          this.updatePassword(data.password);
        } else {
          console.log('Ungültige Anwort vom Server. Interner Server-Fehler.');
        }
      }, error => {
        console.log(`Aktuelles Passwort nicht korrekt (${error})`);
      });
  }

  private updatePassword(password: string) {
    this.passwordChangeRestService.update(password).subscribe(done => {
      this.router.navigate(['../password-confirmation'], {relativeTo: this.route});
    }, error => {
      console.log(`Fehler beim Passwot ändern`);
    });
  }
}
