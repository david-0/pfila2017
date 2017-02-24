import {Document, Schema, Model, model} from "mongoose";
import {ISubgroup} from "../entities/subgroup.interface";

export interface ISubgroupDocument extends ISubgroup, Document {
}

let SubgroupSchema = new Schema({
  id: String,
  name: {type: String, required: true},
  minimumAge: {type: Number, required: false},
  maximumAge: {type: Number, required: false},
  responsible: {type: String, required: false},
  groupId: {type: String, required: true},
}, {
  versionKey: false, // avoids __v, i.e. the version key
});

export const SubgroupModel: Model<ISubgroupDocument> = model<ISubgroupDocument>('Subgroup', SubgroupSchema);
