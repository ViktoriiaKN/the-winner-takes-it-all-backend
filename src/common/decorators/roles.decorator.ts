import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

export type Role =
  | 'admin'
  | 'user'
  | 'editor'
  | 'moderator'
  | 'mentor'
  | 'blocked';

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
