import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import type { JwtPayload } from '../../auth/auth.service';

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const req = ctx
      .switchToHttp()
      .getRequest<Request & { user?: JwtPayload }>();
    return req.user;
  },
);
