import {Component} from "@angular/core";
import {MdDialogRef} from "@angular/material";

@Component({
  selector: 'confirmation-dialog',
  templateUrl: 'confirmation-dialog.html',
})
export class ConfirmationDialogComponent {
  message: string;
  button1: string;
  button2: string;

  constructor(public dialogRef: MdDialogRef<ConfirmationDialogComponent>) {
    this.button1 = "Nein";
    this.button2 = "Ja";
  }
}
