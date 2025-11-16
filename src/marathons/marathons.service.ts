import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Marathon } from './marathon.entity';
import { MarathonUser } from './marathon-user.entity';
import { MarathonReview } from './marathon-review.entity';
import { MarathonAttachment } from './marathon-attachment.entity';
import { UsersService } from '../users/users.service';
import { CreateMarathonDto } from './dto/create-marathon.dto';
import { UpdateMarathonDto } from './dto/update-marathon.dto';

type CurrentUser = { sub: string; role: string };

@Injectable()
export class MarathonsService {
  constructor(
    @InjectRepository(Marathon) private readonly repo: Repository<Marathon>,
    @InjectRepository(MarathonUser)
    private readonly marathonUserRepo: Repository<MarathonUser>,
    @InjectRepository(MarathonReview)
    private readonly reviewRepo: Repository<MarathonReview>,
    @InjectRepository(MarathonAttachment)
    private readonly attachmentRepo: Repository<MarathonAttachment>,
    private readonly users: UsersService,
  ) {}

  // ───────────── helpers ─────────────

  private stripLinks(html: string): string {
    // прибираємо чисті http/https посилання
    const withoutUrls = html.replace(/https?:\/\/[^\s<"]+/gi, '');
    // прибираємо <a href="...">...</a>, залишаючи текст всередині
    return withoutUrls.replace(/<a[^>]*>(.*?)<\/a>/gi, '$1');
  }

  private ensureOwnerOrAdmin(marathon: Marathon, user: CurrentUser): void {
    const isOwner = marathon.owner.id === user.sub;
    const isAdmin = user.role === 'admin';
    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('Not allowed');
    }
  }

  // ───────────── CRUD марафонів ─────────────

  async create(ownerId: string, dto: CreateMarathonDto) {
    const owner = await this.users.findById(ownerId);
    if (!owner) throw new NotFoundException('Owner not found');

    const marathon = this.repo.create({
      owner,
      title: dto.title,
      content: this.stripLinks(dto.content),
      timeStart: new Date(dto.timeStart),
      timeEnd: new Date(dto.timeEnd),
      status: dto.status,
    });

    return this.repo.save(marathon);
  }

  findAll() {
    return this.repo.find({
      order: { timeStart: 'ASC' },
    });
  }

  async findOne(id: string) {
    const marathon = await this.repo.findOne({
      where: { id },
    });
    if (!marathon) throw new NotFoundException('Marathon not found');
    return marathon;
  }

  async update(id: string, user: CurrentUser, dto: UpdateMarathonDto) {
    const marathon = await this.findOne(id);
    this.ensureOwnerOrAdmin(marathon, user);

    if (dto.content) {
      dto.content = this.stripLinks(dto.content);
    }

    Object.assign(marathon, {
      ...dto,
      ...(dto.timeStart ? { timeStart: new Date(dto.timeStart) } : {}),
      ...(dto.timeEnd ? { timeEnd: new Date(dto.timeEnd) } : {}),
    });

    return this.repo.save(marathon);
  }

  async remove(id: string, user: CurrentUser) {
    const marathon = await this.findOne(id);
    this.ensureOwnerOrAdmin(marathon, user);

    await this.repo.remove(marathon);
    return { ok: true };
  }

  // ───────────── Reviews (rating + відгуки) ─────────────

  async addReview(
    marathonId: string,
    userId: string,
    rating: number,
    comment: string,
  ) {
    const [marathon, author, existing] = await Promise.all([
      this.findOne(marathonId),
      this.users.findById(userId),
      this.reviewRepo.findOne({
        where: {
          marathon: { id: marathonId },
          author: { id: userId },
        },
        relations: { marathon: true, author: true },
      }),
    ]);

    if (!author) throw new NotFoundException('User not found');
    if (existing) {
      throw new ForbiddenException('You have already reviewed this marathon');
    }

    const review = this.reviewRepo.create({
      marathon,
      author,
      rating,
      comment,
    });

    return this.reviewRepo.save(review);
  }

  getReviews(marathonId: string) {
    return this.reviewRepo.find({
      where: { marathon: { id: marathonId } },
      order: { createdAt: 'DESC' },
    });
  }

  async getAverageRating(marathonId: string) {
    const res = await this.reviewRepo
      .createQueryBuilder('r')
      .select('AVG(r.rating)', 'avg')
      .where('r.marathonId = :marathonId', { marathonId })
      .getRawOne<{ avg: string | null }>();

    const avg = res?.avg ?? null;

    return { marathonId, averageRating: avg ? Number(avg) : null };
  }
}
