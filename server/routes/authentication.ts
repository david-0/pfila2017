import {getLogger, Logger} from "../utils/logger";
import {IUserDocument, UserModel} from "../models/user.model";
import {IUser} from "../entities/user.interface";
import {JwtConfiguration} from "../utils/jwt-configuration";
import express = require('express');
import eJwt = require('express-jwt');
import jwt = require('jsonwebtoken');
import bcrypt = require('bcrypt');

export let authenticationRoute = express.Router();

const LOGGER: Logger = getLogger('authentication');
export function getAuthenticationRoute(jwtConfig: JwtConfiguration) {

  authenticationRoute.post('/api/authenticate', function (req: express.Request, res: express.Response, next: express.NextFunction) {
    let email: String = req.body.email;
    let password: String = req.body.password;
    LOGGER.info(`authenticate: ${email}`);
    let selector = {'email': email}
    UserModel.find(selector, (err: any, users: IUserDocument[]) => {
      if (err) {
        res.status(401).json({error: `email ${email} unknown. ${err}`});
      } else {
        // verify the password
        if (users.length) {
          bcrypt.compare(password, users[0].password, (err, result) => {
            if (err || !result) {
              res.status(401).json({error: `Incorrect username or password.`});
            } else {
              let user: IUserDocument = users[0];
              user.id = user._id;
              let authToken = jwt.sign({
                id: user.id,
                email: user.email,
                type: user.type
              }, jwtConfig.getSignSecret(), jwtConfig.getSignOptions());
              LOGGER.info(`user ${user.email} authenticated successfully`);
              res.json({
                token: authToken
              })
            }
          });
        } else {
          res.status(401).json({error: `Incorrect username or password.`});
        }
      }
    });
  });

  authenticationRoute.use('/api', eJwt({secret: jwtConfig.getVerifySecret()}), function (req: express.Request, res: express.Response, next: express.NextFunction) {
    if (req.user) {
      LOGGER.debug(`userid: ${req.user.id}, username: ${req.user.email}, type: ${req.user.type}, req.body.email: ${req.body.email}`);
      next();
    } else {
      res.status(401).json({error: 'not yet authenticated'});
    }
  });

  authenticationRoute.put('/api/password-change', function (req: express.Request, res: express.Response, next: express.NextFunction) {
    let id = req.user.id;
    UserModel.findById(id, (err: any, user: IUserDocument) => {
      if (err) {
        res.status(401).json({error: 'Passwort konnte nicht geändert werden.'});
      } else {
        user.password = req.body.password;
        user.save((err: any, user: IUserDocument) => {
          if (err) {
            res.status(401).json({error: 'Passwort konnte nicht geändert werden.'});
          } else {
            LOGGER.debug(`password change for user ${req.user.email} successfully`);
            res.json(true);
          }
        });
      }
    });
  });

// Used for REST test
  authenticationRoute.get('/api/authenticated', function (req: express.Request, res: express.Response, next: express.NextFunction) {
    res.json('authentication is valid');
  });
  return authenticationRoute;
}
// Augmenting the express Request interface with user: IUser to have user access where ever express.Request is used.
declare module '@types/express' {
  export interface Request {
    user?: IUser;
  }
}

