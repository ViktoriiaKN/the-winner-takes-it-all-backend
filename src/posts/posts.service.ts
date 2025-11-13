import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private repo: Repository<Post>,
    private users: UsersService,
  ) {}

  async create(authorId: string, dto: { title: string; body: string }) {
    const author = await this.users.findById(authorId);
    if (!author) throw new NotFoundException('Author not found');
    const post = this.repo.create({ ...dto, author });
    return this.repo.save(post);
  }

  findAll() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string) {
    const post = await this.repo.findOne({ where: { id } });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async update(
    id: string,
    user: { sub: string; role: string },
    dto: Partial<Post>,
  ) {
    const post = await this.findOne(id);
    const isOwner = post.author.id === user.sub;
    const isAdmin = user.role === 'admin';
    if (!isOwner && !isAdmin) throw new ForbiddenException('Not allowed');

    Object.assign(post, dto);
    return this.repo.save(post);
  }

  async remove(id: string, user: { sub: string; role: string }) {
    const post = await this.findOne(id);
    const isOwner = post.author.id === user.sub;
    const isAdmin = user.role === 'admin';
    if (!isOwner && !isAdmin) throw new ForbiddenException('Not allowed');

    await this.repo.remove(post);
    return { ok: true };
  }
}
