import express = require('express');
import {IUserDocument, UserModel} from "../models/user.model";
import {IUser} from "../entities/user.interface";
import {SocketService} from "../socket/socket-service";
import {GenericController} from "./generic.controller";
import {GenericSubject} from "./generic-subject";
import {IPerson} from "../entities/person.interface";
import {IPersonDocument, PersonModel} from "../models/person.model";

export class PersonController extends GenericController<IPerson, IPersonDocument> {
  constructor(socketService: SocketService) {
    super(socketService,
      "/api/persons",
      PersonModel,
      c => new PersonModel(c),
      (d, i) => PersonController.updateDocument(d, i),
    );
  }

  private static updateDocument(documentFromDb: IPersonDocument, inputDocument: IPersonDocument) {
    documentFromDb.id = inputDocument.id;
    documentFromDb.lastname = inputDocument.lastname;
    documentFromDb.firstname = inputDocument.firstname;
    documentFromDb.street = inputDocument.street;
    documentFromDb.streetNumber = inputDocument.streetNumber;
    documentFromDb.plz = inputDocument.plz;
    documentFromDb.city = inputDocument.city;
    documentFromDb.email = inputDocument.email;
    documentFromDb.phoneNumber = inputDocument.phoneNumber;
    documentFromDb.dateOfBirth = inputDocument.dateOfBirth;
    documentFromDb.allergies = inputDocument.allergies;
    documentFromDb.comments = inputDocument.comments;
    documentFromDb.notification = inputDocument.notification;
    documentFromDb.subgroupId = inputDocument.subgroupId;
    documentFromDb.leader = inputDocument.leader;
  }
}

