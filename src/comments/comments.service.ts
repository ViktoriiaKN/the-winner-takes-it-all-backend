import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { UsersService } from '../users/users.service';
import { PostsService } from '../posts/posts.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment) private repo: Repository<Comment>,
    private users: UsersService,
    private posts: PostsService,
  ) {}

  async create(postId: string, authorId: string, text: string) {
    const [post, author] = await Promise.all([
      this.posts.findOne(postId),
      this.users.findById(authorId),
    ]);
    if (!author) throw new NotFoundException('Author not found');

    const c = this.repo.create({ text, post, author });
    return this.repo.save(c);
  }

  findForPost(postId: string) {
    return this.repo.find({
      where: { post: { id: postId } },
      order: { createdAt: 'ASC' },
    });
  }

  async remove(id: string, user: { sub: string; role: string }) {
    const c = await this.repo.findOne({
      where: { id },
      relations: { author: true },
    });
    if (!c) throw new NotFoundException('Comment not found');

    const isOwner = c.author.id === user.sub;
    const isAdmin = user.role === 'admin';
    if (!isOwner && !isAdmin) throw new ForbiddenException('Not allowed');

    await this.repo.remove(c);
    return { ok: true };
  }
}
