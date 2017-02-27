import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {AdminRouterModule} from "./router/admin-router.module";
import {LoginComponent} from "./login/login.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {ClientSocketService} from "./services/client-socket.service";
import {AuthenticationService} from "./services/authentication.service";
import {AuthHttp, AuthConfig} from "angular2-jwt";
import {RequestOptions, Http} from "@angular/http";
import {AuthGuard} from "./services/auth-guard.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MaterialModule} from "@angular/material";
import {MySpinnerModule} from "../my-spinner/my-spinner.module";
import {LogoutComponent} from "./logout/logout.component";
import {AdminOrStandardGuard} from "./services/admin-or-standard-guard.service";
import {UserAdminComponent} from "./user-admin/user-admin.component";
import {GroupAdminComponent} from "./group-admin/group-admin.component";
import {RegistrationAdminComponent} from "./registration-admin/registration-admin.component";
import { PasswordChangeComponent } from './password-change/password-change.component';
import { PasswordChangeConfirmationComponent } from './password-change-confirmation/password-change-confirmation.component';

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig({
    globalHeaders: [{'Content-Type': 'application/json'}]
  }), http, options);
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    AdminRouterModule,
    MySpinnerModule,
  ],
  declarations: [
    LoginComponent,
    DashboardComponent,
    LogoutComponent,
    UserAdminComponent,
    GroupAdminComponent,
    RegistrationAdminComponent,
    PasswordChangeComponent,
    PasswordChangeConfirmationComponent,
  ],
  providers: [
    AuthGuard,
    AdminOrStandardGuard,
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    },
    ClientSocketService,
    AuthenticationService,
  ]
})
export class AdminModule {
}
