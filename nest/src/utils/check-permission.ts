import { Role } from '../auth/role/role.enum';

export enum Modules {
  changeRole = 'changeRole',
  editComment = 'editComment',
}

export const checkPermission = (module: Modules, role: Role) => {
  switch (module) {
    case Modules.changeRole:
      return [Role.Admin].includes(role);
    case Modules.editComment:
      return [Role.Admin, Role.User].includes(role);
  }
};
