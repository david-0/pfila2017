import {Component, OnInit} from '@angular/core';
import {Person} from "../model/person";
import {Group} from "../model/group";
import {Subgroup} from "../model/subgroup";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  private person: Person;
  private selectedGroup: Group;
  private selectedSubgroup: Subgroup;
  private groups: Group[];

  constructor() {
  }

  ngOnInit() {
    this.person = new Person();
    let ameisliRothenfluh = {id: 11, name: "Ameisli", minimumAge: 6, maximumAge: 10, responsible: "Kurt"};
    let jungschiRothenfluh = {id: 12, name: "Jungschi", minimumAge: 9, maximumAge: 14, responsible: "Andrea"};
    let groupRothenfluh = {id: 1, name: "Rothenfluh", groups: [ameisliRothenfluh, jungschiRothenfluh]};

    let jungschiLausen = {id: 13, name: "Jungschi", minimumAge: 9, maximumAge: 14, responsible: "Laura"};
    let groupLausen = {id: 1, name: "Lausen", groups: [jungschiLausen]};

    this.groups = [groupRothenfluh, groupLausen]
  }
}
