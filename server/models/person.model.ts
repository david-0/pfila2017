import {Document, Schema, Model, model} from "mongoose";
import {IPerson} from "../entities/person.interface";

export interface IPersonDocument extends IPerson, Document {
}

let PersonSchema = new Schema({
  id: String,
  createDate: {type: Date, required: true},
  firstname: {type: String, required: true},
  lastname: {type: String, required: true},
  street: {type: String, required: true},
  streetNumber: {type: String, required: false},
  plz: {type: String, required: true},
  city: {type: String, required: true},
  email: {type: String, required: false},
  phoneNumber: {type: String, required: true},
  dateOfBirth: {type: String, required: true},
  allergies: {type: String, required: false},
  comments: {type: String, required: false},
  notification: {type: String, required: true},
  subgroupId: {type: String, required: true, index: true},
  leader: {type: Boolean, required: true},
}, {
  versionKey: false, // avoids __v, i.e. the version key
});

export const PersonModel: Model<IPersonDocument> = model<IPersonDocument>('Person', PersonSchema);
