import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {MaterialModule, MdIconRegistry} from "@angular/material";
import {AppComponent} from "./app.component";
import {AppRouteModule} from "./app-route.module";
import {RegistrationComponent} from './registration/registration.component';
import {InfoComponent} from './info/info.component';
import {TeamComponent} from './team/team.component';
import {HomeComponent} from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
    InfoComponent,
    TeamComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule,
    AppRouteModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
