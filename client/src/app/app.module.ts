import {NgModule} from "@angular/core";
import {RequestOptions} from "@angular/http";
import {AppComponent} from "./app.component";
import {AppRouteModule} from "./app-route-module";
import {InfoComponent} from "./info/info.component";
import {TeamComponent} from "./team/team.component";
import {HomeComponent} from "./home/home.component";
import {DebugPipe} from "./+registration/registration/debug.pipe";
import "hammerjs";
import {GlobalHttpOptions} from "./+registration/options/GlobalHttpOptions";
import {ConfirmationComponent} from "./+registration/confirmation/confirmation.component";
import {BrowserModule} from "@angular/platform-browser";
import {MaterialModule} from "@angular/material";

@NgModule({
  declarations: [
    AppComponent,
    InfoComponent,
    TeamComponent,
    HomeComponent,
    DebugPipe,
  ],
  imports: [
    AppRouteModule,
    BrowserModule,
    MaterialModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
