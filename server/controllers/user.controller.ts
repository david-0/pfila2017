import express = require('express');
import {IUserDocument, UserModel} from "../models/user.model";
import {IUser} from "../entities/user.interface";
import {SocketService} from "../socket/socket-service";
import {GenericController} from "./generic.controller";
import {GenericSubject} from "./generic-subject";

export class UserController extends GenericController<IUser, IUserDocument> {
  constructor(socketService: SocketService) {
    super(socketService,
      "/api/users",
      UserModel,
      c => new UserModel(c),
      (d, i) => UserController.updateDocument(d, i),
    );
  }

  private static updateDocument(documentFromDb: IUserDocument, inputDocument: IUserDocument) {
    documentFromDb.id = inputDocument.id;
    documentFromDb.lastname = inputDocument.lastname;
    documentFromDb.firstname = inputDocument.firstname;
    documentFromDb.type = inputDocument.type;
    documentFromDb.email = inputDocument.email;
    documentFromDb.password = inputDocument.password;
  }
}

