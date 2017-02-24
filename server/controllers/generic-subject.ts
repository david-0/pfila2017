import {Subject} from "rxjs";
import {IId} from "../entities/id.interface";

interface IAction {
  action: string;
  value: any;
}

export class GenericSubject<T, S extends IId> {
  private actions: Subject<IAction> = new Subject<IAction>();

  private listeners: Map<string, Set<any>> = new Map<string, Set<any>>();

  constructor() {
    this.actions.subscribe((action: IAction) => {
      if (this.listeners.has(action.action)) {
        this.listeners.get(action.action).forEach((listener: any) => {
          listener(action.value);
        });
      }
    });
  }

  private emit<R>(action: string, value: R) {
    this.actions.next({action: action, value: value});
  }

  private registerListener<R>(action: string, callbackfn: (value: R) => void) {
    if (!this.listeners.has(action)) {
      this.listeners.set(action, new Set<R>());
    }
    this.listeners.get(action).add(callbackfn);
  }

  public create(value: S) {
    this.emit<S>("create", value);
  }

  public registerOnCreate(callbackfn: (value: S) => void) {
    this.registerListener<S>("create", callbackfn);
  }

  public update(value: S) {
    this.emit<S>("update", value);
  }

  public registerOnUpdate(callbackfn: (value: S) => void) {
    this.registerListener<S>("update", callbackfn);
  }

  public del(value: T) {
    this.emit<T>("delete", value);
  }

  public registerOnDelete(callbackfn: (value: string) => void) {
    this.registerListener<string>("delete", callbackfn);
  }
}
