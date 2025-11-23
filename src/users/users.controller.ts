import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import type { UserRole } from './user.entity';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly users: UsersService) {}

  /**
   * Список усіх користувачів.
   * Доступний:
   *  - admin
   *  - mentor (щоб "бачити всіх користувачів")
   */
  @Get()
  @Roles('admin', 'mentor')
  findAll() {
    return this.users.findAll();
  }

  /**
   * Зміна ролі користувача:
   *  - admin може призначити editor / moderator / mentor / blocked / user
   */
  @Patch(':id/role')
  @Roles('admin')
  updateRole(@Param('id') id: string, @Body() body: { role: UserRole }) {
    return this.users.updateRole(id, body.role);
  }

  /**
   * Окремі ручки під кнопки "заблокувати/розблокувати"
   * Якщо тобі зручно на фронті — можна користуватись
   * і PATCH /users/:id/role замість цих двох.
   */

  @Patch(':id/block')
  @Roles('admin')
  blockUser(@Param('id') id: string) {
    return this.users.updateRole(id, 'blocked');
  }

  @Patch(':id/unblock')
  @Roles('admin')
  unblockUser(@Param('id') id: string) {
    // за замовчуванням після розблокування робимо звичайного user
    // (якщо потрібно зберігати "попередню" роль — це можна доробити пізніше)
    return this.users.updateRole(id, 'user');
  }
}
