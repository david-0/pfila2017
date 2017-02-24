'use strict';

import {Logger, getLogger} from '../utils/logger';
import express = require('express');
import controller = require('../controllers/user.controller');
import {UserType} from '../entities/user-type';

const LOGGER: Logger = getLogger('authorization');
const METHODS_FOR_ADMIN: string = 'PUT POST DELETE';

export function requiresAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  let valid: boolean = req.user && (req.user.type == UserType.ADMIN);
  if (valid) {
    LOGGER.info(`${req.user.email} is authorized to use ${req.baseUrl}`);
    next();
  } else {
    logError(req);
    res.status(403).json({error: `not authorized to use ${req.baseUrl}`});
  }
}

export function requiresAdminExceptForGet(req: express.Request, res: express.Response, next: express.NextFunction) {
  let method: string = req.method.toUpperCase();
  if (METHODS_FOR_ADMIN.indexOf(method) > -1) {
    requiresAdmin(req, res, next);
  } else {
    requiresAuthenticatedUser(req, res, next);
  }
}

export function requiresStandardOrAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  let valid: boolean = req.user && (req.user.type == UserType.STANDARD || req.user.type == UserType.ADMIN);
  if (valid) {
    LOGGER.info(`${req.user.email} is authorized to use ${req.baseUrl}`);
    next();
  } else {
    logError(req);
    res.status(403).json({error: `not authorized to use ${req.baseUrl}`});
  }
}

export function requiresAuthenticatedUser(req: express.Request, res: express.Response, next: express.NextFunction) {
  let valid: boolean = req.user && true;
  if (valid) {
    LOGGER.info(`${req.user.email} is authorized to use ${req.baseUrl}`);
    next();
  } else {
    logError(req);
    res.status(403).json({error: `not authorized to use ${req.baseUrl}`});
  }
}

function logError(req: express.Request): void {
  if (req.user) {
    LOGGER.error(`user ${req.user.email} is not authorized to use ${req.method} on ${req.baseUrl}`);
  } else {
    LOGGER.error(`user not provided, thus not authorized to use ${req.method} on ${req.baseUrl}`);
  }
}
