import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(email: string, password: string, role: UserRole = 'user') {
    const exists = await this.repo.findOne({ where: { email } });
    if (exists) throw new ConflictException('Email already in use');

    const passwordHash = await bcrypt.hash(password, 10);
    const user = this.repo.create({ email, passwordHash, role });
    return this.repo.save(user);
  }

  /**
   * Список користувачів для адмінки / ментора
   * (без passwordHash).
   */
  findAll() {
    return this.repo.find({
      select: ['id', 'email', 'role', 'createdAt', 'updatedAt'],
      order: { createdAt: 'ASC' },
    });
  }

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async validatePassword(user: User, plain: string) {
    return bcrypt.compare(plain, user.passwordHash);
  }

  /**
   * Оновити роль користувача (admin → editor / mentor / blocked тощо).
   */
  async updateRole(id: string, role: UserRole) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    user.role = role;
    return this.repo.save(user);
  }
}
