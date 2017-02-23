import {Component, OnInit} from '@angular/core';
import {Person} from "../model/person";
import {Group} from "../model/group";
import {Subgroup} from "../model/subgroup";
import {Validators, FormControl, FormGroup, FormBuilder} from "@angular/forms";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  private form: FormGroup;
  private groups: Group[];

  constructor(fb: FormBuilder) {
    let swissDatePattern = /^\d{1,2}\.\d{1,2}\.\d{4}$/;
    let zipcodePattern = /^((DE-\d{5})|((CH-)?\d{4})){1}$/;
    let emailPattern = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    this.form = fb.group({
      "group": new FormControl('', [Validators.required]),
      "subgroup": new FormControl('', [Validators.required]),
      "leader": new FormControl('', []),
      "firstname": new FormControl('', [Validators.required]),
      "lastname": new FormControl('', [Validators.required]),
      "street": new FormControl('', [Validators.required]),
      "streetNumber": new FormControl('', []),
      "plz": new FormControl('', [Validators.required, Validators.pattern(zipcodePattern)]),
      "city": new FormControl('', [Validators.required]),
      "email": new FormControl('', [Validators.pattern(emailPattern)]),
      "phoneNumber": new FormControl('', [Validators.required]),
      "dateOfBirth": new FormControl('', [Validators.required, Validators.pattern(swissDatePattern)]),
    });
  }

  ngOnInit() {
    let ameisliRothenfluh = {id: 11, name: "Ameisli", minimumAge: 6, maximumAge: 10, responsible: "Kurt"};
    let jungschiRothenfluh = {id: 12, name: "Jungschi", minimumAge: 9, maximumAge: 14, responsible: "Andrea"};
    let groupRothenfluh = {id: 1, name: "Rothenfluh", groups: [ameisliRothenfluh, jungschiRothenfluh]};

    let unknownSubgroup = {id: 31, name: "keine", minimumAge: 5, maximumAge: 14, responsible: "Sandra" };
    let groupUnknown = {id: 3, name: "Ich gehöre zu keiner Gruppe", groups: [unknownSubgroup]};

    let jungschiLausen = {id: 13, name: "Jungschi", minimumAge: 9, maximumAge: 14, responsible: "Laura"};
    let groupLausen = {id: 2, name: "Lausen", groups: [jungschiLausen]};

    this.groups = [groupRothenfluh, groupLausen, groupUnknown]
  }

  private resetSubgroup(event: any) {
    if (event) {
      this.form.get("subgroup").reset();
    }
  }

  private save(person: Person, valid: boolean) {
    console.log(person);
    // write to DB
    return valid;
  }

  private reset() {
    this.form.reset();
  }

}
