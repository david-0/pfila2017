import {Component, OnInit, OnDestroy} from "@angular/core";
import {GenericService} from "../../remote/generic.service";
import {IPerson} from "../../../../../server/entities/person.interface";
import {ClientSocketService} from "../services/client-socket.service";
import {AuthHttp} from "angular2-jwt";
import {AuthenticationService} from "../services/authentication.service";
import {MdDialog} from "@angular/material";
import {Router} from "@angular/router";
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog.component";
import {GenericRestService} from "../../remote/generic-rest.service";

@Component({
  selector: 'app-registration-admin',
  templateUrl: './registration-admin.component.html',
  styleUrls: ['./registration-admin.component.scss']
})
export class RegistrationAdminComponent implements OnInit, OnDestroy {
  private dataService: GenericService<IPerson>;
  private restService: GenericRestService<IPerson>;
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
        this.restService.del(id).subscribe().unsubscribe();
      }
    });
  }

  ngOnInit() {
    this.dataService = new GenericService<IPerson>(this.http, this.socketService, "/api/persons", "/api/persons");
    this.dataService.getAll();
    this.restService = new GenericRestService<IPerson>(this.http, "/api/persons");
  }

  ngOnDestroy() {
    this.dataService.disconnect();
  }

  private showDetails(person: IPerson) {
    this.selectedPerson = person;
  }

  private hideDetails() {
    this.selectedPerson = null;
  }
}


