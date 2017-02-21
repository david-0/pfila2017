import {Component, OnInit} from '@angular/core';
import {Person} from "../model/person";
import {Group} from "../model/group";
import {Subgroup} from "../model/subgroup";
import {FormGroup, FormControl, Validators, FormBuilder} from "@angular/forms";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  private form: FormGroup;
  // Validators.minLength(2), Validators.maxLength(0)
  private email = new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(4)]);
  private phoneNumber = new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(20)]);
  private dateOfBirth = new FormControl('', [Validators.required, Validators.minLength(10)]);

  private person: Person;
  private selectedGroup: Group;
  private selectedSubgroup: Subgroup;
  private groups: Group[];

  constructor(fb: FormBuilder) {
    this.form = fb.group({
      "email": this.email,
      "phoneNumber": this.phoneNumber,
      "dateOfBirth": this.dateOfBirth,
    })

    this.form.valueChanges
      .subscribe((formValue) => {
        console.log(formValue);
      });
  }

  ngOnInit() {
    this.person = new Person();
    let ameisliRothenfluh = {id: 11, name: "Ameisli", minimumAge: 6, maximumAge: 10, responsible: "Kurt"};
    let jungschiRothenfluh = {id: 12, name: "Jungschi", minimumAge: 9, maximumAge: 14, responsible: "Andrea"};
    let groupRothenfluh = {id: 1, name: "Rothenfluh", groups: [ameisliRothenfluh, jungschiRothenfluh]};

    let jungschiLausen = {id: 13, name: "Jungschi", minimumAge: 9, maximumAge: 14, responsible: "Laura"};
    let groupLausen = {id: 1, name: "Lausen", groups: [jungschiLausen]};

    this.groups = [groupRothenfluh, groupLausen]
  }

  onSubmit() {
    console.log(this.form.value);   // {name: {first: 'Nancy', last: 'Drew'}, email: ''}
    console.log(this.form.status);  // VALID
  }
}
