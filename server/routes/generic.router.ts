import express = require('express');
import {Router} from "express-serve-static-core";
import {IController} from "../controllers/controller.interface";

export class GenericRouter {
  constructor(private controller: IController, private router: Router) {
    router.route('/')
      .post((req, res) => controller.add(req, res))
      .get((req, res) => controller.getAll(req, res));

    router.route('/:id')
      .get((req, res) => controller.get(req, res))
      .put((req, res) => controller.update(req, res))
      .delete((req, res) => controller.del(req, res));
  }

  public getRouter(): Router {
    return this.router;
  }

  public static create(controller: IController): Router {
    let router: Router = new GenericRouter(controller, express.Router()).getRouter();
    controller.init();
    return router;
  }
}
