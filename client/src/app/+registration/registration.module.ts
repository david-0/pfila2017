import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RegistrationRouterModule} from "./router/registration-router.module";
import {RegistrationComponent} from "./registration/registration.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MaterialModule} from "@angular/material";
import {MySpinnerModule} from "../my-spinner/my-spinner.module";
import {HttpModule, RequestOptions} from "@angular/http";
import {GlobalHttpOptions} from "./options/GlobalHttpOptions";
import {ConfirmationComponent} from "./confirmation/confirmation.component";


@NgModule({
  imports: [
    CommonModule,
    RegistrationRouterModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    MySpinnerModule,
    HttpModule,
  ],
  declarations: [
    RegistrationComponent,
    ConfirmationComponent,
  ],
  providers: [
    {
      provide: RequestOptions,
      useClass: GlobalHttpOptions,
    },
  ],
})
export class RegistrationModule {
}
