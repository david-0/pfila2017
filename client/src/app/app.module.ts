import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule, RequestOptions} from "@angular/http";
import {MaterialModule} from "@angular/material";
import {AppComponent} from "./app.component";
import {AppRouteModule} from "./app-route-module";
import {RegistrationComponent} from "./registration/registration.component";
import {InfoComponent} from "./info/info.component";
import {TeamComponent} from "./team/team.component";
import {HomeComponent} from "./home/home.component";
import {DebugPipe} from "./registration/debug.pipe";
import "hammerjs";
import {GlobalHttpOptions} from "./remote/GlobalHttpOptions";
import {ConfirmationComponent} from "./confirmation/confirmation.component";
import {MySpinnerModule} from "./my-spinner/my-spinner.module";

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
    MySpinnerModule,
  ],
  providers: [
    {
      provide: RequestOptions,
      useClass: GlobalHttpOptions,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
