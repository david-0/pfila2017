import * as express from "express";
import * as compression from "compression";
import * as bodyParser from "body-parser";
import * as createError from "http-errors";
import * as log4js from "log4js";
import {Logger, getLogger} from "./utils/logger";
import {DBService} from "./models/db.service";
import * as http from "http";
import * as path from "path";
import * as socketIo from "socket.io";
import {GenericRouter} from "./routes/generic.router";
import {SocketService} from "./socket/socket-service";
import {PersonController} from "./controllers/person.controller";
import {authenticationRoute} from './routes/authentication';
import {requiresStandardOrAdmin} from "./routes/authorization";
import {UserController} from "./controllers/user.controller";
import {GroupController} from "./controllers/group.controller";
import {SubgroupController} from "./controllers/subgroup.controller";

const LOGGER: Logger = getLogger('Server');

var socketioJwt = require("socketio-jwt");

declare var process: any, __dirname: any;

class Server {
  public app: express.Express;
  private server: any;
  private io: SocketIO.Server;
  private root: string;
  private port: number;
  private host: string;
  private socketService: SocketService;

  // Bootstrap the application.
  public static bootstrap(): Server {
    return new Server();
  }

  constructor() {
    // Create expressjs application
    this.app = express();
    this.app.use(compression());

    // Configure application
    this.config();

    // create ClientSocketService
    this.socketService = new SocketService();

    // Create database connections
    this.databases();

    // Setup routes
    this.routes();

    // Create server
    this.server = http.createServer(this.app);

    // Handle websockets
    this.sockets();

    // Start listening
    this.listen();
  }

  private config(): void {
    this.port = process.env.PORT || 3001;
    this.root = path.join(__dirname);
    this.host = 'localhost';
  }

  private routes(): void {
    this.app.use(log4js.connectLogger(LOGGER, {
      level: 'trace',
      format: 'express --> :method :url :status :req[Accept] :res[Content-Type]'
    }));
    this.app.use(express.static(__dirname + '/public'));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({extended: false}));
    this.app.use(this.inputLogger);

    this.app.use('/', function (req: express.Request, res: express.Response, next: express.NextFunction) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE');
      next();
    });

    let personController = new PersonController(this.socketService);
    let groupController = new GroupController(this.socketService);
    let subgroupController = new SubgroupController(this.socketService);
    let userController = new UserController(this.socketService);
    this.app.use('/api/persons', GenericRouter.get(personController));
    this.app.use('/api/groups', GenericRouter.get(groupController));
    this.app.use('/api/subgroups', GenericRouter.get(subgroupController));
    this.app.use('/api/persons', GenericRouter.post(personController));
    this.app.use(authenticationRoute);
    this.app.use('/api/groups', GenericRouter.post(groupController));
    this.app.use('/api/subgroups', GenericRouter.post(subgroupController));
    this.app.use('/api/persons', GenericRouter.put(personController));
    this.app.use('/api/groups', GenericRouter.put(groupController));
    this.app.use('/api/subgroups', GenericRouter.put(subgroupController));
    this.app.use('/api/persons', GenericRouter.del(personController));
    this.app.use('/api/groups', GenericRouter.del(groupController));
    this.app.use('/api/subgroups', GenericRouter.del(subgroupController));
    this.app.use('/api/users', requiresStandardOrAdmin, GenericRouter.all(userController));
    personController.init();
    groupController.init();
    subgroupController.init();
    userController.init();

    this.app.use('/api', function (req: express.Request, res: express.Response, next: express.NextFunction) {
      next(createError(404, `No route found for ${req.method} ${req.url}`));
    });

    this.app.use(function (req: express.Request, res: express.Response, next: express.NextFunction) {
      res.sendFile(__dirname + '/public/index.html');
    });

    this.app.use(this.outputLogger);
    this.app.use(this.errorHandler);
  }

  // Configure databases
  private databases(): void {
    DBService.init('localhost');
  }

  // Configure sockets
  private sockets(): void {
    // Get socket.io handle
    this.io = socketIo(this.server);
    this.io.use(socketioJwt.authorize({
      secret: 'secret',
      handshake: true
    }));

    this.socketService.init(this.io);
  }

  // Start HTTP server listening
  private listen(): void {
    this.server.listen(this.port);

    //add error handler
    this.server.on("error", function (error: Error) {
      LOGGER.error(`ERROR: ${error.stack}`);
    });

    //start listening on port
    this.server.on("listening", () => {
      LOGGER.info(`Homeautomation server running at http://${this.host}:${this.port}/`);
    });

  }

  private errorHandler(err: Error, req: express.Request, res: express.Response, next: express.NextFunction) {
    LOGGER.error(`ErrorHandler: ${err.stack}`);
    res.status(500).send(err.message);
  }

  private inputLogger(req: express.Request, res: express.Response, next: express.NextFunction) {
    LOGGER.debug(`Request: ${req.method} ${req.url}`);
    next();
  }

  private outputLogger(req: express.Request, res: express.Response, next: express.NextFunction) {
    LOGGER.debug(`Response with status code: ${res.statusCode}`);
    next();
  }
}

// Bootstrap the server
export = Server.bootstrap().app;
