import express = require('express');
import {SocketService} from "../socket/socket-service";
import {GenericController} from "./generic.controller";
import {IGroupDocument, GroupModel} from "../models/group.model";
import {IGroup} from "../entities/group.interface";

export class GroupController extends GenericController<IGroup, IGroupDocument> {
  constructor(socketService: SocketService) {
    super(socketService,
      "/api/groups",
      GroupModel,
      c => new GroupModel(c),
      (d, i) => GroupController.updateDocument(d, i),
    );
  }

  private static updateDocument(documentFromDb: IGroupDocument, inputDocument: IGroupDocument) {
    documentFromDb.id = inputDocument.id;
    documentFromDb.name = inputDocument.name;
  }
}

