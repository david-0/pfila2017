import {Component, OnInit} from "@angular/core";
import {Validators, FormControl, FormGroup, FormBuilder} from "@angular/forms";
import {ClientSocketService} from "../+admin/services/client-socket.service";
import {Router} from "@angular/router";
import {IPerson} from "../../../../server/entities/person.interface";
import {IGroup} from "../../../../server/entities/group.interface";
import {Http} from "@angular/http";
import {GenericRestService} from "../remote/generic-rest.service";
import {Subscription, Observable} from "rxjs";
import {GenericService} from "../remote/generic.service";
import {ISubgroup} from "../../../../server/entities/subgroup.interface";
import {List} from "immutable";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  private restService: GenericRestService<IPerson>;
  private busy: Subscription;

  private filteredSubgroups: Observable<List<ISubgroup>>;
  private groups1: Observable<List<IGroup>>;
  private subgroups1: Observable<List<ISubgroup>>;
  private plzControl: FormControl = new FormControl();
  private cityControl: FormControl = new FormControl();
  private subgroupControl: FormControl = new FormControl();

  constructor(private router: Router,
              private http: Http) {
    this.plzControl.valueChanges
      .let(this.getPlzObservable)
      .let((o) => this.getCityObservable(o, http))
      .subscribe(city => this.cityControl.setValue(city));
  }

  ngOnInit() {
    this.restService = new GenericRestService<IPerson>(this.http, "/api/persons");

    this.groups1 = new GenericRestService<IGroup>(this.http, "/api/groups").getAll().map(groups => List<IGroup>(groups));
    this.subgroups1 = new GenericRestService<ISubgroup>(this.http, "/api/subgroups").getAll().map(subgroups => List<ISubgroup>(subgroups));
  }

  private getPlzObservable(input: Observable<string>): Observable<string> {
    return input
      .filter(text => text && text.length > 3)
      .filter(text => !text.startsWith("DE-"))
      .map(text => (text.startsWith("CH-")) ? text.substr(3) : text)
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

  private updateSubgroup(group: IGroup) {
    if (event) {
      this.subgroupControl.reset();
      this.filteredSubgroups = this.subgroups1.map(subgroups => List<ISubgroup>(subgroups.filter(subgroup => subgroup.groupId === group.id)));
    }
  }

  private save(data: any, valid: boolean) {
    let person: IPerson = {
      id: data.id,
      firstname: data.firstname,
      lastname: data.lastname,
      street: data.street,
      streetNumber: data.streetNumber,
      plz: this.plzControl.value,
      city: this.cityControl.value,
      email: data.email,
      phoneNumber: data.phoneNumber,
      dateOfBirth: data.dateOfBirth,
      allergies: data.allergies,
      comments: data.comments,
      notification: data.notification,
      subgroupId: this.subgroupControl.value.id,
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
}
