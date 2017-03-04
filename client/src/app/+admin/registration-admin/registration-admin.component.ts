import {Component, OnInit, OnDestroy} from "@angular/core";
import {GenericService} from "../../remote/generic.service";
import {IPerson} from "../../../../../server/entities/person.interface";
import {ClientSocketService} from "../services/client-socket.service";
import {AuthHttp} from "angular2-jwt";
import {AuthenticationService} from "../services/authentication.service";
import {MdDialog} from "@angular/material";
import {Router} from "@angular/router";
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog.component";
import {IGroup} from "../../../../../server/entities/group.interface";
import {ISubgroup} from "../../../../../server/entities/subgroup.interface";
import {Observable} from "rxjs";
import {List} from "immutable";
import {saveAs} from "file-saver";
import {CsvExporter} from "./csv-exporter";

@Component({
  selector: 'app-registration-admin',
  templateUrl: './registration-admin.component.html',
  styleUrls: ['./registration-admin.component.scss']
})
export class RegistrationAdminComponent implements OnInit, OnDestroy {
  private personDataService: GenericService<IPerson>;
  private sortedPersons: Observable<List<IPerson>>;
  private groupDataService: GenericService<IGroup>;
  private subgroupDataService: GenericService<ISubgroup>;
  private selectedPerson: IPerson;

  constructor(private http: AuthHttp,
              private socketService: ClientSocketService,
              private authenticationService: AuthenticationService,
              public dialog: MdDialog,
              private router: Router) {
  }

  openDialog(id: string, firstname: string, lastname: string) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent);
    dialogRef.componentInstance.message = `${firstname} ${lastname} löschen? `;
    dialogRef.afterClosed().subscribe(result => {
      if (result === "Ja") {
        this.personDataService.getRestService().del(id).subscribe().unsubscribe();
      }
    });
  }

  ngOnInit() {
    this.groupDataService = new GenericService<IGroup>(this.http, this.socketService, "/api/groups", "/api/groups");
    let groupObservable = this.groupDataService.getAll();
    this.subgroupDataService = new GenericService<ISubgroup>(this.http, this.socketService, "/api/subgroups", "/api/subgroups");
    let subgroupObservable = this.subgroupDataService.getAll();
    this.personDataService = new GenericService<IPerson>(this.http, this.socketService, "/api/persons", "/api/persons");
    let sub = Observable.forkJoin(groupObservable, subgroupObservable).subscribe((res) => {
      this.sortedPersons = this.personDataService.items.map(persons => List<IPerson>(persons.sort((a, b) => this.compare(a, b))));
      this.personDataService.getAll();
      sub.unsubscribe();
    });
  }

  private saveFile() {
    let sub = this.sortedPersons.subscribe(persons => {
      let csvExporter = new CsvExporter(this.groupDataService, this.subgroupDataService);
      let data = csvExporter.export(persons.toArray());
      let blob = new Blob([data], {type: "text/csv;charset=utf-8"});
      saveAs(blob, "report.csv");
    });
  }

  private compare(a: IPerson, b: IPerson): number {
    let subgroupA = this.subgroupDataService.getCache(a.subgroupId);
    let subgroupB = this.subgroupDataService.getCache(b.subgroupId);
    let groupNameA = this.groupDataService.getCache(subgroupA.groupId).name;
    let groupNameB = this.groupDataService.getCache(subgroupB.groupId).name;
    let result = groupNameA.localeCompare(groupNameB);
    if (result !== 0) {
      return result;
    }
    let subgroupNameA = subgroupA.name;
    let subgroupNameB = subgroupB.name;
    result = subgroupNameA.localeCompare(subgroupNameB);
    if (result !== 0) {
      return result;
    }
    result = a.lastname.localeCompare(b.lastname);
    if (result !== 0) {
      return result;
    }
    result = a.firstname.localeCompare(b.firstname);
    if (result !== 0) {
      return result;
    }
  }

  ngOnDestroy() {
    this.personDataService.disconnect();
    this.groupDataService.disconnect();
    this.subgroupDataService.disconnect();
  }

  private showDetails(person: IPerson) {
    this.selectedPerson = person;
  }

  private hideDetails() {
    this.selectedPerson = null;
  }
}


