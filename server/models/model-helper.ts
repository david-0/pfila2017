import {Document} from "mongoose";
import {IId} from "../entities/id.interface";

export interface IIdDocument extends IId, Document {
}
