import {IId} from "./id.interface";

export interface IPerson extends IId {
  id: any;
  createDate?: Date;
  firstname: string;
  lastname: string;
  street: string;
  streetNumber?: string;
  plz: string;
  city: string;
  email?: string;
  phoneNumber: string;
  dateOfBirth: string;
  allergies?: string;
  comments?: string;
  subgroupId: string;
  leader: boolean;
}
