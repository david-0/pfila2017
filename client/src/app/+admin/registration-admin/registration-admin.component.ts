import {Component, OnInit} from "@angular/core";
import {GenericService} from "../../remote/generic.service";
import {IPerson} from "../../../../../server/entities/person.interface";
import {ClientSocketService} from "../services/client-socket.service";
import {AuthHttp} from "../../../../../../pfila2017/client/node_modules/angular2-jwt/angular2-jwt";
import {OnDestroy} from "../../../../../../pfila2017/client/node_modules/@angular/core/src/metadata/lifecycle_hooks";

@Component({
  selector: 'app-registration-admin',
  templateUrl: './registration-admin.component.html',
  styleUrls: ['./registration-admin.component.scss']
})
export class RegistrationAdminComponent implements OnInit, OnDestroy {

  private dataService: GenericService<IPerson>;

  constructor(private http: AuthHttp, private socketService: ClientSocketService) {
  }

  ngOnInit() {
    this.dataService = new GenericService<IPerson>(this.http, this.socketService, "/api/persons", "/api/persons");
    this.dataService.getAll();
  }

  ngOnDestroy() {
    this.dataService.disconnect();
  }

}
