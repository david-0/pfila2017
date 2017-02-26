import {Injectable, Inject} from "@angular/core";
import {Observable} from "rxjs";
import * as io from "socket.io-client";
import {AuthenticationService} from './authentication.service';
import {ISocketItem} from "../../../../server/entities/socket-item.model";

/**
 * This class handles authentication, error's, connect's and disconnect's from socket.io.
 * The created observable follows the "update" signals from socket stream.
 */
@Injectable()
export class ClientSocketService {
  private name: string;
  private host: string = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port;
  socket: SocketIOClient.Socket;

  constructor(private authService: AuthenticationService) {
  }

  /**
   * @param name The name of the requested namespace
   * @returns {any} Observable which follows the "update" signals from socket stream
   */
  get(name: string): Observable<ISocketItem> {
    this.name = name;
    let socketUrl = this.host + this.name;
    this.socket = io.connect(socketUrl, {
      'query': 'token=' + this.authService.getToken()
    });
    this.socket.on("connect", () => this.connect());
    this.socket.on("disconnect", () => this.disconnect());
    this.socket.on("error", (error: string) => {
      console.log(`ERROR: "${error}" (${socketUrl})`);
    });
    this.socket.on("unauthorized", (error: string) => {
      console.log(`unauthorized: "${error}" (${socketUrl})`);
    });

    // Return observable which follows the "update" signals from socket stream
    return Observable.create((observer: any) => {
      this.socket.on("update", (item: any) => observer.next({action: "update", item: item}));
      this.socket.on("create", (item: any) => observer.next({action: "create", item: item}));
      this.socket.on("delete", (item: any) => observer.next({action: "delete", item: item}));
      return () => this.socket.close();
    });
  }

  private connect() {
    console.log(`Connected to "${this.name}"`);
  }

  private disconnect() {
    console.log(`Disconnected from "${this.name}"`);
  }
}
