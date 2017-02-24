import {Component, OnInit} from "@angular/core";
import {Validators, FormControl, FormGroup, FormBuilder} from "@angular/forms";
import {ClientSocketService} from "../remote/client-socket.service";
import {Router} from "@angular/router";
import {GenericService} from "../remote/generic.service";
import {AuthHttp} from "angular2-jwt";
import {IPerson} from "../../../../server/entities/person.interface";
import {IGroup} from "../../../../server/entities/group.interface";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  private form: FormGroup;
  private groups: IGroup[];
  private genericService: GenericService<IPerson>;

  constructor(fb: FormBuilder, private router: Router, private socketService: ClientSocketService, private authHttp: AuthHttp) {
    let swissDatePattern = /^\d{1,2}\.\d{1,2}\.\d{4}$/;
    let zipcodePattern = /^((DE-\d{5})|((CH-)?\d{4})){1}$/;
    let emailPattern = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    this.form = fb.group({
      "group": new FormControl('', [Validators.required]),
      "subgroup": new FormControl('', [Validators.required]),
      "firstname": new FormControl('', [Validators.required]),
      "lastname": new FormControl('', [Validators.required]),
      "street": new FormControl('', [Validators.required]),
      "streetNumber": new FormControl('', []),
      "plz": new FormControl('', [Validators.required, Validators.pattern(zipcodePattern)]),
      "city": new FormControl('', [Validators.required]),
      "email": new FormControl('', [Validators.pattern(emailPattern)]),
      "phoneNumber": new FormControl('', [Validators.required]),
      "dateOfBirth": new FormControl('', [Validators.required, Validators.pattern(swissDatePattern)]),
      "allergies": new FormControl('', []),
      "comments": new FormControl('', []),
      "notification": new FormControl('', [Validators.required]),
      "leader": new FormControl('', []),
    });
  }

  ngOnInit() {
    let ameisliRothenfluh = {id: 11, name: "Ameisli", minimumAge: 6, maximumAge: 10, responsible: "Kurt"};
    let jungschiRothenfluh = {id: 12, name: "Jungschi", minimumAge: 9, maximumAge: 14, responsible: "Andrea"};
    let groupRothenfluh = {id: 1, name: "Rothenfluh", groups: [ameisliRothenfluh, jungschiRothenfluh]};

    let unknownSubgroup = {id: 31, name: "keine", minimumAge: 5, maximumAge: 14, responsible: "Sandra"};
    let groupUnknown = {id: 3, name: "Ich gehöre zu keiner Gruppe", groups: [unknownSubgroup]};

    let jungschiLausen = {id: 13, name: "Jungschi", minimumAge: 9, maximumAge: 14, responsible: "Laura"};
    let groupLausen = {id: 2, name: "Lausen", groups: [jungschiLausen]};

    this.groups = [groupRothenfluh, groupLausen, groupUnknown];

    this.genericService = new GenericService<IPerson>(this.authHttp,
      this.socketService, "/api/persons", "/persons");
  }

  private resetSubgroup(event: any) {
    if (event) {
      this.form.get("subgroup").reset();
    }
  }

  private save(data: any, valid: boolean) {
    let person: IPerson = {id: data.id,
      firstname: data.firstname,
      lastname: data.lastname,
      street: data.street,
      streetNumber: data.streetNumber,
      plz: data.plz,
      city: data.city,
      email: data.email,
      phoneNumber: data.phoneNumber,
      dateOfBirth: data.dateOfBirth,
      allergies: data.allergies,
      comments: data.comments,
      subgroupId: data.subgroup.id,
      leader: data.leader,
    }
    console.log(person);
    person.createDate = new Date();
    // write to DB
    this.genericService.create(person);
    alert("Danke für die Anmeldung");
    this.form.reset();
  }

  private reset() {
    this.form.reset();
  }

}
