import {Document, Schema, Model, model} from "mongoose";
import {IPerson} from "../entities/person.interface";
import {IGroup} from "../entities/group.interface";

export interface IGroupDocument extends IGroup, Document {
}

let GroupSchema = new Schema({
  id: String,
  name: {type: String, required: true},
}, {
  versionKey: false, // avoids __v, i.e. the version key
});

export const GroupModel: Model<IGroupDocument> = model<IGroupDocument>('Group', GroupSchema);
