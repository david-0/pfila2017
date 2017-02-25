import {Component, OnInit} from "@angular/core";
import {IPerson} from "../../../../server/entities/person.interface";
import {GenericRestService} from "../remote/generic-rest.service";
import {Http} from "@angular/http";
import {Observable, Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {
  private person: IPerson;
  private sub: Subscription;
  private personSubscription: Subscription;

  constructor(private http: Http, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.personSubscription = new GenericRestService<IPerson>(this.http, "/api/persons").get(params['id']).subscribe(person => {
        this.person = person;
      });
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.personSubscription.unsubscribe();
  }
}
