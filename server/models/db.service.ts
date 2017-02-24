import {Logger, getLogger} from "../utils/logger";
import {initAdmin} from "./user.model";
import mongoose = require('mongoose');

const DB_PORT: number = 27017;
const RETRY_SECONDS: number = 5;
const LOGGER: Logger = getLogger('DBService');

/**
 * This singleton class manages the connection to the database and keeps it up and running.
 */
export class DBService {

  private static instance: DBService = new DBService();
  private static hostname: string;

  private db: mongoose.Connection = mongoose.connection;
  private dbLocation: any;

  private constructor() {
  }

  public static init(hostname: string): DBService {
    DBService.hostname = hostname;

    DBService.instance.dbLocation = `${DBService.hostname}:${DB_PORT}/pfila2017`;

    DBService.instance.db
      .once('open', () => LOGGER.info('DB ready'))
      .on('connecting', () => LOGGER.info('DB connecting...'))
      .on('connected', () => LOGGER.info('DB connected'))
      .on('reconnected', () => LOGGER.info('DB reconnected'))
      .on('disconnected', () => LOGGER.info('DB disconnected'))
      .on('error', (error: any) => {
        LOGGER.error('DB connection error', error);
        mongoose.disconnect((err) => {
          if (err) {
            LOGGER.error('mongoose disconnect failed', err);
          }
          DBService.instance.connect(RETRY_SECONDS);
        });
      });

    DBService.instance.connect(0);

    // create admin user if not yet existing
    initAdmin();

    return DBService.instance;
  }

  private connect(delay: number): void {
    LOGGER.info(`Trying to connect the DB ${DBService.instance.dbLocation} in ${delay} seconds ...`);
    setTimeout(() => mongoose.connect(DBService.instance.dbLocation, {server: {auto_reconnect: true}}), delay * 1000);
  }

}
