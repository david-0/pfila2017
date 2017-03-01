import express = require('express');
import {SocketService} from "../socket/socket-service";
import {GenericController} from "./generic.controller";
import {ISubgroupDocument, SubgroupModel} from "../models/subgroup.model";
import {ISubgroup} from "../entities/subgroup.interface";

export class SubgroupController extends GenericController<ISubgroup, ISubgroupDocument> {
  constructor(socketService: SocketService) {
    super(socketService,
      "/api/subgroups",
      SubgroupModel,
      c => new SubgroupModel(c),
      (d, i) => SubgroupController.updateDocument(d, i),
    );
  }

  private static updateDocument(documentFromDb: ISubgroupDocument, inputDocument: ISubgroupDocument) {
    documentFromDb.id = inputDocument.id;
    documentFromDb.name = inputDocument.name;
    documentFromDb.minimumAge = inputDocument.minimumAge;
    documentFromDb.maximumAge = inputDocument.maximumAge;
    documentFromDb.responsible = inputDocument.responsible;
    documentFromDb.groupId = inputDocument.groupId;
  }
}

