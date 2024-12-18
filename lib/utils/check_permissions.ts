<<<<<<< HEAD
import { User, UserRole } from "../types"

const CheckPermissions = (auth: User, permissions: Array<UserRole>): boolean => {
  if(!auth) return false
  if(permissions.includes(auth.role)) return true
  return false
}

const CheckFinished= (auth: User, permissions: Array<UserRole>, state: string, spected: string) => CheckPermissions(auth, permissions) && state === spected

export { CheckPermissions , CheckFinished }
=======
import { User, UserRole } from "../types";

const CheckPermissions = (
  auth: User,
  permissions: Array<UserRole>
): boolean => {
  if (!auth) return false;
  if (permissions.includes(auth.role)) return true;
  return false;
};

const CheckFinished = (
  auth: User,
  permissions: Array<UserRole>,
  state: string,
  spected: string
) => CheckPermissions(auth, permissions) && state === spected;

const CheckFinishedToMore = (
  auth: User,
  permissions: Array<UserRole>,
  states: { [key: number]: string }, // Asociar permisos con estados
  expected: string
): boolean => {
  return permissions.some(permission =>
    CheckPermissions(auth, [permission]) && states[permission] === expected
  );
};

export { CheckPermissions, CheckFinished, CheckFinishedToMore };
>>>>>>> 49fc803892827a301c7d26a029c89d770fccf31e
