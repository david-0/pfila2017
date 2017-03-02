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

@Component({
  selector: 'app-registration-admin',
  templateUrl: './registration-admin.component.html',
  styleUrls: ['./registration-admin.component.scss']
})
export class RegistrationAdminComponent implements OnInit, OnDestroy {
  private personDataService: GenericService<IPerson>;
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
    this.personDataService = new GenericService<IPerson>(this.http, this.socketService, "/api/persons", "/api/persons");
    this.personDataService.getAll();
    this.groupDataService = new GenericService<IGroup>(this.http, this.socketService, "/api/groups", "/api/groups");
    this.groupDataService.getAll();
    this.subgroupDataService = new GenericService<ISubgroup>(this.http, this.socketService, "/api/subgroups", "/api/subgroups");
    this.subgroupDataService.getAll();
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


