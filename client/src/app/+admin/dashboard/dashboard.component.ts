import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../services/authentication.service";
import {ROUTER_CONFIGURATION} from "@angular/router";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }
}
