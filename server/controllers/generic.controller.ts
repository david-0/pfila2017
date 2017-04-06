import {Logger, getLogger} from "../utils/logger";
import {IIdDocument} from "../models/model-helper";
import {Model} from "mongoose";
import {IController} from "./controller.interface";
import {GenericSocket} from "../socket/generic-socket";
import {SocketService} from "../socket/socket-service";
import {GenericSubject} from "./generic-subject";
import express = require('express');
const LOGGER: Logger = getLogger('GenericController');

export interface IAction {
  action: string;
  id: string;
}

export class GenericController<T, R extends IIdDocument> implements IController {
  private loggingPrefix: string;
  private genericSocket: GenericSocket;
  private genericSubject: GenericSubject<string, R>;

  constructor(protected socketService: SocketService,
              protected namespaceName: string,
              private model: Model<R>,
              private createDocument: (content: T) => R,
              private udpateDocument: (documentFromDb: R, inputDocument: R) => void) {
    this.loggingPrefix = this.namespaceName;
    this.genericSubject = new GenericSubject();
  }

  public registerOnCreate(callbackfn: (value: R) => void) {
    this.genericSubject.registerOnCreate(callbackfn);
  }

  public registerOnUpdate(callbackfn: (value: R) => void) {
    this.genericSubject.registerOnUpdate(callbackfn);
  }

  public registerOnDelete(callbackfn: (value: string) => void) {
    this.genericSubject.registerOnDelete(callbackfn);
  }

  public init() {
    this.genericSocket = this.socketService.registerSocket(this.namespaceName);
    this.getAllEntities((err: any, devices: R[]) => {
      if (err) {
        LOGGER.error(`error retrieving ${this.namespaceName}. ${err}`);
      } else {
        devices.forEach((device) => {
          // set the id to the _id provided by the db
          device.id = device._id;
          // create add events for all existing devices
          this.genericSubject.create(device);
        });
      }
    })
  }

  public add(req: express.Request, res: express.Response) {
    let item: T = req.body;
    LOGGER.debug(`create ${this.loggingPrefix}: ${JSON.stringify(item)}`);
    let device: R = this.createDocument(item);
    device.save((err: any, addedDevice: R) => {
      if (err) {
        res.status(500).json({error: `error creating ${this.loggingPrefix} ${device.id}. ${err}`});
      } else {
        // set the id to the _id provided by the db
        device.id = addedDevice._id;
        this.genericSubject.create(device);
        this.genericSocket.create(device);
        LOGGER.debug(`created ${this.loggingPrefix} successfully, id: ${addedDevice.id}`);
        res.status(201).json(device);
      }
    });
  }

  public getAll(req: express.Request, res: express.Response) {
    this.getAllEntities((err: any, devices: R[]) => {
      if (err) {
        res.status(404).json({error: `error retrieving ${this.loggingPrefix}. ${err}`});
      } else {
        // set the id to the _id provided by the db
        devices.forEach((device) => device.id = device._id);
        LOGGER.debug(`found ${devices.length} ${this.loggingPrefix}`);
        res.json(devices);
      }
    });
  }

  private getAllEntities(callback?: (err: any, res: R[]) => void) {
    this.model.find(callback);
  }

  public get(req: express.Request, res: express.Response) {
    LOGGER.debug(`get ${this.loggingPrefix} ${req.params.id}`);
    let ref = {_id: req.params.id};
    this.model.findById(ref, (err: any, device: R) => {
      if (err) {
        res.status(404).json({error: `error retrieving ${this.loggingPrefix} ${ref._id}. ${err}`});
      } else {
        // set the id to the _id provided by the db
        device.id = device._id;
        LOGGER.debug(`found ${this.loggingPrefix} ${req.params.id}: ${JSON.stringify(device)}`);
        res.json(device);
      }
    });
  }

  public del(req: express.Request, res: express.Response) {
    LOGGER.debug(`delete ${this.loggingPrefix} ${req.params.id}`);
    let ref = {_id: req.params.id};
    this.model.remove(ref, (err: any) => {
      if (err) {
        res.status(404).json({error: `error deleting ${this.loggingPrefix} ${ref._id}. ${err}`});
      } else {
        this.genericSocket.del(ref._id);
        this.genericSubject.del(ref._id);
        LOGGER.debug(`deleted ${this.loggingPrefix} ${req.params.id} successfully`);
      }
      res.json(ref._id);
    });
  }

  public update(req: express.Request, res: express.Response) {
    let id = req.params.id;
    LOGGER.debug(`update ${this.loggingPrefix} [${id}]: ${JSON.stringify(req.body)}`);
    this.model.findById(id, (err: any, deviceFromDb: R) => {
      if (err) {
        res.status(404).json({error: `${this.loggingPrefix} ${id} not found. ${err}`});
      } else {
        let item: T = req.body;
        let device: R = this.createDocument(item);
        // copy the properties
        this.udpateDocument(deviceFromDb, device);
        // save the updated user
        deviceFromDb.save((err: any, updatedDevice: R) => {
          if (err) {
            res.status(500).json({error: `error updating ${this.loggingPrefix} ${id}. ${err}`});
          } else {
            // set the id to the _id provided by the db
            updatedDevice.id = updatedDevice._id;
            LOGGER.debug(`updated ${this.loggingPrefix} successfully`);
            this.genericSocket.update(updatedDevice);
            this.genericSubject.update(updatedDevice);
            res.json(updatedDevice);
          }
        });
      }
    });
  }
}

