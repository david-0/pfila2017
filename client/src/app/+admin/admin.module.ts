import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {AdminRouterModule} from "./router/admin-router.module";
import {LoginComponent} from "./login/login.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {ClientSocketService} from "./client-socket.service";
import {AuthenticationService} from "./authentication.service";
import {AuthHttp, AuthConfig} from "angular2-jwt";
import {RequestOptions, Http} from "@angular/http";
import {AuthGuard} from "./auth-guard.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MaterialModule} from "@angular/material";
import {MySpinnerModule} from "../my-spinner/my-spinner.module";
import { LogoutComponent } from './logout/logout.component';

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
  ],
  providers: [
    AuthGuard,
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
