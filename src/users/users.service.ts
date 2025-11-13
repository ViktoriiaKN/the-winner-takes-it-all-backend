import { ConflictException, Injectable } from '@nestjs/common';
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

  findAll() {
    return this.repo.find({ select: ['id', 'email', 'role', 'createdAt'] });
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
}
