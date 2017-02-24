import {ReplaySubject, Subscription} from "rxjs";
import {ClientSocketService} from "./client-socket.service";
import {IId} from "../../../../server/entities/id.interface";
import {AuthHttp} from "angular2-jwt";
import {ISocketItem} from "../../../../server/entities/socket-item.model";
import {GenericDataRestService} from "./generic-data-rest.service";

export class GenericDataService<T extends IId> {
  items: ReplaySubject<Array<T>> = new ReplaySubject<Array<T>>(1);
  lastItem: ReplaySubject<T> = new ReplaySubject<T>();
  private currentItemIndex: Set<string> = new Set<string>();
  private currentItems: Array<T> = new Array<T>();
  private dataSubscription: Subscription;
  private restService: GenericDataRestService<T>;

  constructor(private authHttp: AuthHttp, private socketService: ClientSocketService,
              private restUrl: string, private socketNamespace: string, private deviceId: string) {
    this.restService = new GenericDataRestService<T>(authHttp, restUrl);
    let observable = socketService.get(`${socketNamespace}/${deviceId}`);
    this.dataSubscription = observable.subscribe((item: ISocketItem) => this.processItem(item));
  }

  public disconnect() {
    this.dataSubscription.unsubscribe();
  }

  private processItem(packet: ISocketItem) {
    if (packet.action === "create") {
      this.addItem(packet.item);
    }
  }

  public getAll() {
    this.restService.getAll(this.deviceId).subscribe((items: T[]) => {
      this.addAll(items);
    });
  }

  public getLatest() {
    this.restService.getLatest(this.deviceId).subscribe((item: T) => {
      this.addItem(item);
    });
  }

  private addAll(items: T[]) {
    this.currentItems = new Array<T>();
    this.currentItemIndex = new Set<string>();
    for (let item of items) {
      this.currentItems.push(item);
      this.currentItemIndex.add(item.id);
    }
    this.items.next(this.currentItems);
    this.lastItem.next(this.currentItems[this.currentItems.length-1]);
  }

  private addItem(item: T) {
    if (!this.currentItemIndex.has(item.id)) {
      this.currentItemIndex.add(item.id);
      this.currentItems.push(item);
      this.items.next(this.currentItems);
      this.lastItem.next(item);
    }
  }
}
