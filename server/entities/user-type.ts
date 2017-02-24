export const enum UserType {
  GUEST,
  STANDARD,
  ADMIN
}

export const UserTypeValue: UserType[] = [UserType.GUEST, UserType.STANDARD, UserType.ADMIN];

export const UserTypeString: string[] = ['Guest', 'Standard', 'Admin'];

export function userTypeAsString(type: UserType) {
  return UserTypeString[type];
}
