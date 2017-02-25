import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule, RequestOptions, Http} from "@angular/http";
import {MaterialModule} from "@angular/material";
import {AppComponent} from "./app.component";
import {AppRouteModule} from "./app-route-module";
import {RegistrationComponent} from "./registration/registration.component";
import {InfoComponent} from "./info/info.component";
import {TeamComponent} from "./team/team.component";
import {HomeComponent} from "./home/home.component";
import {DebugPipe} from "./registration/debug.pipe";
import "hammerjs";
import {AuthHttp, AuthConfig} from "angular2-jwt";
import {ClientSocketService} from "./remote/client-socket.service";
import {AuthenticationService} from "./remote/authentication.service";
import {BusyModule} from "angular2-busy";
import {GlobalHttpOptions} from "./remote/GlobalHttpOptions";
import {ConfirmationComponent} from "./confirmation/confirmation.component";

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig({
    globalHeaders: [{'Content-Type': 'application/json'}]
  }), http, options);
}

@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
    InfoComponent,
    TeamComponent,
    HomeComponent,
    DebugPipe,
    ConfirmationComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    MaterialModule,
    AppRouteModule,
    BusyModule,
  ],
  providers: [
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    },
    {
      provide: RequestOptions,
      useClass: GlobalHttpOptions,
    },
    AuthHttp,
    ClientSocketService,
    AuthenticationService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
