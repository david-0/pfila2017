import {IUser} from '../../../server/entities/user.interface';
import {UserType, UserTypeValue, UserTypeString} from '../../../server/entities/user-type';

export {UserType} from '../../../server/entities/user-type';

export class User implements IUser {

  constructor(public id?: any,
              public firstname?: string,
              public lastname?: string,
              public type?: UserType,
              public username?: string,
              public password?: string) {
  }

  static getUserTypeValue(): UserType[] {
    return UserTypeValue;
  }

  static getUserTypeText(): string[] {
    return UserTypeString;
  }

  isUserType(type: UserType): boolean {
    return this.type === type;
  }

  isStandardUser(): boolean {
    return this.type === UserType.STANDARD;
  }

  isAdminUser(): boolean {
    return this.type === UserType.ADMIN;
  }

  isGuestUser(): boolean {
    return this.type === UserType.GUEST;
  }

}
