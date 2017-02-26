import {Component, OnInit} from "@angular/core";
import {Validators, FormControl, FormGroup, FormBuilder} from "@angular/forms";
import {ClientSocketService} from "../+admin/services/client-socket.service";
import {Router} from "@angular/router";
import {IPerson} from "../../../../server/entities/person.interface";
import {IGroup} from "../../../../server/entities/group.interface";
import {Http} from "@angular/http";
import {GenericRestService} from "../remote/generic-rest.service";
import {Subscription, Observable} from "rxjs";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  private form: FormGroup;
  private groups: IGroup[];
  private restService: GenericRestService<IPerson>;
  private busy: Subscription;
  private plzControl: FormControl;
  private cityControl: FormControl;

  constructor(private fb: FormBuilder, private router: Router, private socketService: ClientSocketService,
              private http: Http) {
    let swissDatePattern = /^\d{1,2}\.\d{1,2}\.\d{4}$/;
    let zipcodePattern = /^((DE-\d{5})|((CH-)?\d{4})){1}$/;
    let emailPattern = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    this.plzControl = new FormControl('', [Validators.required, Validators.pattern(zipcodePattern)]);
    this.cityControl = new FormControl('', [Validators.required]);
    this.form = fb.group({
      "group": new FormControl('', [Validators.required]),
      "subgroup": new FormControl('', [Validators.required]),
      "firstname": new FormControl('', [Validators.required]),
      "lastname": new FormControl('', [Validators.required]),
      "street": new FormControl('', [Validators.required]),
      "streetNumber": new FormControl('', []),
      "plz": this.plzControl,
      "city": this.cityControl,
      "email": new FormControl('', [Validators.pattern(emailPattern)]),
      "phoneNumber": new FormControl('', [Validators.required]),
      "dateOfBirth": new FormControl('', [Validators.required, Validators.pattern(swissDatePattern)]),
      "allergies": new FormControl('', []),
      "comments": new FormControl('', []),
      "notification": new FormControl('', [Validators.required]),
      "leader": new FormControl('', []),
    });

    this.plzControl.valueChanges
      .let(this.getPlzObservable)
      .let((o) => this.getCityObservable(o, http))
      .subscribe(city => this.cityControl.setValue(city));
  }

  private getPlzObservable(input: Observable<string>): Observable<string> {
    return input
      .filter(text => text && text.length > 3)
      .filter(text => !text.startsWith("DE-"))
      .map(text => (text.startsWith("CH-")) ? text.substr(4) : text)
      .filter(text => text.length == 4);
  }

  private getCityObservable(input: Observable<string>, http: Http): Observable<string> {
    return input
      .map(text => `https://api3.geo.admin.ch/rest/services/api/SearchServer?type=locations&origins=zipcode&limit=2&searchText=${text}`)
      .switchMap(url => http.get(url), (req, res) => res.json())
      .filter(results => results.results.length > 0)
      .map(results => results.results[0])
      .filter(result => result.attrs)
      .map(result => result.attrs)
      .filter(attrs => attrs)
      .map(attrs => attrs.label)
      .map(RegistrationComponent.extractCity)
      .filter(city => city.length > 0);
  }

  private static extractCity(label: any): string {
    let results = /^<b>[0-9]{4} - (.*) \([A-Z,]*\)<\/b>$/g.exec(label);
    return (results && results.length > 0) ? results[1] : "";
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

    this.restService = new GenericRestService<IPerson>(this.http, "/api/persons");
  }

  private resetSubgroup(event: any) {
    if (event) {
      this.form.get("subgroup").reset();
    }
  }

  private save(data: any, valid: boolean) {
    let person: IPerson = {
      id: data.id,
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
      leader: !!data.leader,
    };
    console.log(person);
    person.createDate = new Date();
    // write to DB
    this.busy = this.restService.add(person).subscribe((person: IPerson) => {
      this.router.navigate(["confirmation", person.id]);
    }, (err: any) => {
      this.router.navigate(["error"]);
    });
  }

  openDialog() {
  }
}
