import {Component, OnInit, OnDestroy} from "@angular/core";
import {GenericService} from "../../remote/generic.service";
import {ClientSocketService} from "../services/client-socket.service";
import {AuthHttp} from "angular2-jwt";
import {AuthenticationService} from "../services/authentication.service";
import {MdDialog} from "@angular/material";
import {Router} from "@angular/router";
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog.component";
import {GenericRestService} from "../../remote/generic-rest.service";
import {IGroup} from "../../../../../server/entities/group.interface";
import {ISubgroup} from "../../../../../server/entities/subgroup.interface";
import {Observable} from "rxjs";
import {List, Iterable} from "immutable";

@Component({
  selector: 'app-group-admin',
  templateUrl: './group-admin.component.html',
  styleUrls: ['./group-admin.component.scss']
})
export class GroupAdminComponent implements OnInit, OnDestroy {
  private subgroupDataService: GenericService<ISubgroup>;
  private groupDataService: GenericService<IGroup>;
  private subgroupRestService: GenericRestService<ISubgroup>;
  private groupRestService: GenericRestService<IGroup>;
  private groupEditOpen: boolean;
  private detailHeader: string;
  private groupname: string;
  private groupId: string;


  private subgroupEditOpen: boolean;

  private selectedGroup: IGroup;
  private filteredSubgroups: Observable<List<ISubgroup>>;

  private subgroupId: string;
  private subgroupname: string;
  private subgroupGroupId: string;

  constructor(private http: AuthHttp,
              private socketService: ClientSocketService,
              private authenticationService: AuthenticationService,
              public dialog: MdDialog,
              private router: Router) {
  }

  openGroupDialog(id: string, groupName: string) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent);
    dialogRef.componentInstance.message = `Ortsgruppe ${groupName} löschen?`;
    dialogRef.afterClosed().subscribe(result => {
      if (result === "Ja") {
        this.groupRestService.del(id).subscribe().unsubscribe();
        if (this.selectedGroup.id === id) {
          this.selectedGroup = null;
        }
      }
    });
  }

  openSubgroupDialog(id: string, subgroupName: string) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent);
    dialogRef.componentInstance.message = `Gruppe ${subgroupName} löschen?`;
    dialogRef.afterClosed().subscribe(result => {
      if (result === "Ja") {
        this.subgroupRestService.del(id).subscribe().unsubscribe();
      }
    });
  }

  ngOnInit() {
    this.groupDataService = new GenericService<IGroup>(this.http, this.socketService, "/api/groups", "/api/groups");
    this.groupDataService.getAll();
    this.subgroupDataService = new GenericService<ISubgroup>(this.http, this.socketService, "/api/subgroups", "/api/subgroups");
    this.subgroupDataService.getAll();
    this.groupRestService = new GenericRestService<IGroup>(this.http, "/api/groups");
    this.subgroupRestService = new GenericRestService<IGroup>(this.http, "/api/subgroups");
  }

  ngOnDestroy() {
    this.groupDataService.disconnect();
    this.subgroupDataService.disconnect();
  }

  private editGroup(group: IGroup) {
    this.groupId = group.id;
    this.groupname = group.name;
    this.detailHeader = "Ortgruppe ändern";
    this.groupEditOpen = true;
  }

  private createGroup() {
    this.groupId = null;
    this.groupname = "";
    this.detailHeader = "Ortsgruppe erstellen";
    this.groupEditOpen = true;
  }

  private saveGroup(group: IGroup) {
    if (this.groupId) {
      group.id = this.groupId;
      this.updateGroup(group);
    } else {
      this.addGroup(group);
    }
  }

  private updateGroup(group: IGroup) {
    this.groupRestService.update(group).subscribe();
    this.groupname = null;
    this.groupId = null;
    this.groupEditOpen = false;
  }

  private addGroup(group: IGroup) {
    this.groupRestService.add(group).subscribe();
    this.groupEditOpen = false;
    this.groupId = null;
    this.groupname = null;
  }

  private cancel() {
    this.groupEditOpen = false;
    this.subgroupEditOpen = false;
  }

  private showGroupDetails(group: IGroup) {
    this.selectedGroup = group;
    this.filteredSubgroups = this.subgroupDataService.items.map(subgroups => List<ISubgroup>(subgroups.filter(subgroup => subgroup.groupId === group.id)));
  }

  private createSubroup() {
    this.subgroupId = null;
    this.subgroupGroupId = this.selectedGroup.id;
    this.subgroupname = "";
    this.detailHeader = `Gruppe in ${this.selectedGroup.name} erstellen`;
    this.subgroupEditOpen = true;
  }

  private editSubgroup(subgroup: ISubgroup) {
    this.subgroupId = subgroup.id;
    this.subgroupGroupId = this.selectedGroup.id;
    this.subgroupname = subgroup.name;
    this.detailHeader = `Gruppe in ${this.selectedGroup.name} ändern`;
    this.subgroupEditOpen = true;
  }

  private saveSubgroup(subgroup: ISubgroup) {
    subgroup.groupId = this.subgroupGroupId;
    if (this.subgroupId) {
      subgroup.id = this.subgroupId;
      this.updateSubgroup(subgroup);
    } else {
      this.addSubgroup(subgroup);
    }
  }

  private updateSubgroup(subgroup: ISubgroup) {
    this.subgroupRestService.update(subgroup).subscribe();
    this.subgroupname = null;
    this.subgroupId = null;
    this.subgroupEditOpen = false;
  }

  private addSubgroup(subgroup: ISubgroup) {
    this.subgroupRestService.add(subgroup).subscribe();
    this.subgroupEditOpen = false;
    this.subgroupId = null;
    this.subgroupname = null;
  }

}


