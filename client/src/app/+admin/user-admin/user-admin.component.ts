import {Component, OnInit, OnDestroy} from "@angular/core";
import {GenericService} from "../../remote/generic.service";
import {ClientSocketService} from "../services/client-socket.service";
import {AuthHttp} from "angular2-jwt";
import {AuthenticationService} from "../services/authentication.service";
import {MdDialog} from "@angular/material";
import {Router} from "@angular/router";
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog.component";
import {GenericRestService} from "../../remote/generic-rest.service";
import {IUser} from "../../../../../server/entities/user.interface";
import {UserType, userTypeAsString} from "../../../../../server/entities/user-type";

@Component({
  selector: 'app-user-admin',
  templateUrl: './user-admin.component.html',
  styleUrls: ['./user-admin.component.scss']
})
export class UserAdminComponent implements OnInit, OnDestroy {
  private dataService: GenericService<IUser>;
  private restService: GenericRestService<IUser>;
  private userDialog: boolean;
  private user: IUser;
  private detailHeader: string;
  private userTypes: any[];

  constructor(private http: AuthHttp,
              private socketService: ClientSocketService,
              private authenticationService: AuthenticationService,
              public dialog: MdDialog,
              private router: Router) {
    this.createUserTypes();
  }

  private createUserTypes() {
    this.userTypes = [{key: UserType.GUEST, value: userTypeAsString(UserType.GUEST)},
      {key: UserType.STANDARD, value: userTypeAsString(UserType.STANDARD)},
      {key: UserType.ADMIN, value: userTypeAsString(UserType.ADMIN)},
    ];
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

  private userTypeAsString(userType: UserType) {
    return userTypeAsString(userType);
  }

  ngOnInit() {
    this.dataService = new GenericService<IUser>(this.http, this.socketService, "/api/users", "/api/users");
    this.dataService.getAll();
    this.restService = new GenericRestService<IUser>(this.http, "/api/users");
  }

  ngOnDestroy() {
    this.dataService.disconnect();
  }

  private editUser(user: IUser) {
    this.user = user;
    this.detailHeader = "Benutzer ändern";
    this.userDialog = true;
  }

  private createUser() {
    this.user = {firstname: "", lastname: "", type: UserType.GUEST, email: "", password: ""};
    this.detailHeader = "Benutzer erstellen";
    this.userDialog = true;
  }

  private saveUser(user: IUser) {
    if (this.user.id) {
      user.id = this.user.id;
      this.updateUser(user);
    } else {
      this.addUser(user);
    }
  }

  private updateUser(user: IUser) {
    this.restService.update(user).subscribe();
    this.user = null;
    this.userDialog = false;
  }

  private addUser(user: IUser) {
    this.restService.add(user).subscribe();
    this.userDialog = false;
  }

  private cancel() {
    this.userDialog = false;
  }
}


