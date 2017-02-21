import {Directive, ContentChild, AfterViewInit} from "@angular/core";
import {NgControl, FormControl} from "@angular/forms";
import {MdInputDirective, MdInputContainer} from "@angular/material";

@Directive({
  selector: 'md-input-container'
})
export class ValidationDirective implements AfterViewInit {

  @ContentChild(MdInputDirective) mdInput;

  constructor(private container: MdInputContainer) {
  }

  ngAfterViewInit() {
    let ctrl = this.mdInput._ngControl as NgControl;
    if (ctrl === null) {
      // handles when field is not attached to form
      return;
    }
    let ogHint = this.container.hintLabel;
    let formCtrl = ctrl.control;
    // Not an easy way to see what validators are actually on a control, and so we assume if an
    //   empty input produced an error, the field is required
    if (formCtrl && formCtrl.validator) {
      let res = formCtrl.validator(new FormControl());
      if (Object.keys(res).length > 0) {
        this.mdInput.required = true;
      }
    }
    ctrl.statusChanges.subscribe(() => {
        let messages = [ogHint];
        if (ctrl.errors) {
          messages.push(...Object.keys(ctrl.errors)
            .map(x => {
              let error = ctrl.errors[x];
              if (x === "required") {
                return 'This field is required';
              } else if (x === "minlength") {
                return `Too short ${error.actualLength}, min ${error.requiredLength}`;
              } else if (x === "maxlength") {
                return `Too long ${error.actualLength}, max ${error.requiredLength}`;
              }
            }));
        }
        let message = messages.filter(x => !!x).join(', ');
        this.container.hintLabel = message;
      }
    );
  }
}
