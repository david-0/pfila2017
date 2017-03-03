import express = require('express');
import {Router} from "express-serve-static-core";
import {IController} from "../controllers/controller.interface";

export class GenericRouter {
  public static all(controller: IController) {
    let router = express.Router();
    router.route('/')
      .post((req, res) => controller.add(req, res))
      .get((req, res) => controller.getAll(req, res));

    router.route('/:id')
      .get((req, res) => controller.get(req, res))
      .put((req, res) => controller.update(req, res))
      .delete((req, res) => controller.del(req, res));
    return router;
  }

  public static get(controller: IController): Router {
    let router = express.Router();
    router.route('/').get((req, res) => controller.getAll(req, res));
    router.route('/:id').get((req, res) => controller.get(req, res));
    return router;
  }

  public static post(controller: IController): Router {
    let router = express.Router();
    router.route('/').post((req, res) => controller.add(req, res));
    return router;
  }

  public static put(controller: IController): Router {
    let router = express.Router();
    router.route('/:id').put((req, res) => controller.update(req, res));
    return router;
  }

  public static del(controller: IController): Router {
    let router = express.Router();
    router.route('/:id').delete((req, res) => controller.del(req, res));
    return router;
  }
}
