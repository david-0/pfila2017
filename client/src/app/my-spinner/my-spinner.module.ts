import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {MySpinnerComponent} from "./my-spinner.component";
import {MaterialModule} from "@angular/material";

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
  ],
  declarations: [
    MySpinnerComponent,
  ],
  exports: [
    MySpinnerComponent,
  ]
})
export class MySpinnerModule { }
