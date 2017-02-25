import {Logger, getLogger} from '../utils/logger';
import {Document, Schema, Model, model} from 'mongoose';
import {IUser} from '../entities/user.interface';
import {UserType} from '../entities/user-type';

const LOGGER: Logger = getLogger('UserModel');

export interface IUserDocument extends IUser, Document {
}

let UserSchema = new Schema({
  id: String,
  firstname: {type: String, required: true},
  lastname: {type: String, required: true},
  email: {type: String, required: true, unique: true, minlength: 4},
  type: {type: Number, required: true, min: UserType.GUEST, max: UserType.ADMIN},
  password: {type: String, required: true, minlength: 8}
}, {
  versionKey: false, // avoids __v, i.e. the version key
});

export const UserModel: Model<IUserDocument> = model<IUserDocument>('User', UserSchema);

export function initAdmin() {
  let email: String = 'david.leuenberger@gmx.ch';
  let selector = {'email': email};
  UserModel.find(selector, (err, users) => {
    if (users.length) {
      LOGGER.info(`admin user is ok. id = ${users[0]._id}`);
      return;
    }

    let user: IUserDocument = new UserModel();
    user.firstname = 'admin';
    user.lastname = 'admin';
    user.email = 'david.leuenberger@gmx.ch'
    user.type = UserType.ADMIN;
    user.password = '12345678';
    LOGGER.info(`creating admin user: ${JSON.stringify(user)}`);
    user.save((err: any, adminUser: IUserDocument) => {
      if (err) {
        throw new Error(err);
      } else {
        LOGGER.info(`Admin user created successfully: ${adminUser}`)
      }
    });
  });
}
