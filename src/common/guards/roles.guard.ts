import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, Role } from '../decorators/roles.decorator';
import { Request } from 'express';
import type { JwtPayload } from '../../auth/auth.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);

    if (!required?.length) return true;

    const req = ctx
      .switchToHttp()
      .getRequest<Request & { user?: JwtPayload }>();

    const role = req.user?.role as Role | undefined;
    return role ? required.includes(role) : false;
  }
}
