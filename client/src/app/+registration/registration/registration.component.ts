import {Component, OnInit, OnDestroy} from "@angular/core";
import {FormControl} from "@angular/forms";
import {Router, ActivatedRoute} from "@angular/router";
import {IPerson} from "../../../../../server/entities/person.interface";
import {IGroup} from "../../../../../server/entities/group.interface";
import {Http} from "@angular/http";
import {GenericRestService} from "../../remote/generic-rest.service";
import {Subscription, Observable} from "rxjs";
import {ISubgroup} from "../../../../../server/entities/subgroup.interface";
import {List} from "immutable";

@Component({
  selector: 'app-registration',
  templateUrl: 'registration.component.html',
  styleUrls: ['registration.component.scss']
})
export class RegistrationComponent implements OnInit, OnDestroy {

  private restService: GenericRestService<IPerson>;
  private busy: Subscription;

  private filteredSubgroups: List<ISubgroup>;
  private groups1: List<IGroup>;
  private subgroups1: List<ISubgroup>;
  private plzControl: FormControl = new FormControl();
  private cityControl: FormControl = new FormControl();
  private subgroupControl: FormControl = new FormControl();
  private sub: Subscription;

  private edit: boolean;
  private person: IPerson;
  private group: IGroup;
  private subgroup: ISubgroup;

  constructor(private router: Router,
              private http: Http,
              private route: ActivatedRoute) {
    this.plzControl.valueChanges
      .let(this.getPlzObservable)
      .let((o) => this.getCityObservable(o, http))
      .subscribe(city => this.cityControl.setValue(city));
  }

  ngOnInit() {
    this.restService = new GenericRestService<IPerson>(this.http, "/api/persons");

    new GenericRestService<IGroup>(this.http, "/api/groups").getAll().map(groups => List<IGroup>(groups)).subscribe(groups => this.groups1 = groups);
    new GenericRestService<ISubgroup>(this.http, "/api/subgroups").getAll().map(subgroups => List<ISubgroup>(subgroups)).subscribe(subgroups => this.subgroups1 = subgroups);
    this.sub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.restService.get(params['id']).subscribe(person => {
          this.edit = true;
          this.person = person;
          this.subgroupControl.setValue(person.subgroupId);
          this.plzControl.setValue(person.plz);
          this.cityControl.setValue(person.city);
          new GenericRestService<ISubgroup>(this.http, "/api/subgroups").get(person.subgroupId).subscribe(subgroup => {
            new GenericRestService<IGroup>(this.http, "/api/groups").get(subgroup.groupId).subscribe(group => {
              this.group = group;
              this.subgroup = subgroup;
              this.subgroupControl.setValue(subgroup);
              this.filteredSubgroups = this.subgroups1.filter(subgroup => subgroup.groupId === group.id).toList();
            })
          });
        });
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
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
    if (group) {
      this.subgroupControl.reset();
      this.filteredSubgroups = this.subgroups1.filter(subgroup => subgroup.groupId === group.id).toList();
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
    // write to DB
    if (!this.edit) {
      person.createDate = new Date();
      this.busy = this.restService.add(person).subscribe((person: IPerson) => {
        this.router.navigate(["registration/confirmation"]);
      }, (err: any) => {
        this.router.navigate(["error"]);
      });
    } else {
      person.createDate = this.person.createDate;
      person.id = this.person.id;
      this.busy = this.restService.update(person).subscribe((person: IPerson) => {
        this.router.navigate(["/admin/dashboard/registrations"]);
      }, (err: any) => {
        this.router.navigate(["error"]);
      });
    }
  }
}
