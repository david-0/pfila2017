import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule, Http, RequestOptions} from "@angular/http";
import {MaterialModule} from "@angular/material";
import {AppComponent} from "./app.component";
import {AppRouteModule} from "./app-route.module";
import {RegistrationComponent} from "./registration/registration.component";
import {InfoComponent} from "./info/info.component";
import {TeamComponent} from "./team/team.component";
import {HomeComponent} from "./home/home.component";
import {DebugPipe} from "./registration/debug.pipe";
import 'hammerjs';
import {AuthHttp, AuthConfig} from "angular2-jwt";
import {ClientSocketService} from "./remote/client-socket.service";
import {AuthenticationService} from "./remote/authentication.service";

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig({
    globalHeaders: [{'Content-Type': 'application/json'}],
    noClientCheck: true,
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
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    MaterialModule,
    AppRouteModule,
  ],
  providers: [
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    },
    ClientSocketService,
    AuthenticationService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
