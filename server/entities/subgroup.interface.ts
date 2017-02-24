import {IId} from "./id.interface";

export interface ISubgroup extends IId {
  id: any;
  name: string;
  minimumAge: number;
  maximumAge: number;
  responsible: string;
  groupId: string;
}
