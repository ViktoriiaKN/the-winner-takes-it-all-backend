import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post as HttpPost,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MarathonsService } from './marathons.service';
import { CreateMarathonDto } from './dto/create-marathon.dto';
import { UpdateMarathonDto } from './dto/update-marathon.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/decorators/user.decorator';

type UploadedFile = {
  originalname: string;
  filename: string;
  mimetype: string;
};

type FileFilterCallback = (error: Error | null, acceptFile: boolean) => void;

// можна налаштовувати через .env
const UPLOAD_DIR = process.env.UPLOAD_DIR ?? 'uploads';
const MAX_FILE_SIZE = Number(process.env.UPLOAD_MAX_SIZE) || 10 * 1024 * 1024; // 10 MB за замовчуванням

const ALLOWED_MIME_TYPES = (
  process.env.UPLOAD_ALLOWED_MIME ??
  'image/png,image/jpeg,image/jpg,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
)
  .split(',')
  .map((s) => s.trim());

@Controller('marathons')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MarathonsController {
  constructor(private readonly marathons: MarathonsService) {}

  @Get()
  findAll() {
    return this.marathons.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.marathons.findOne(id);
  }

  @HttpPost()
  create(@CurrentUser() user: { sub: string }, @Body() dto: CreateMarathonDto) {
    return this.marathons.create(user.sub, dto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: { sub: string; role: string },
    @Body() dto: UpdateMarathonDto,
  ) {
    return this.marathons.update(id, user, dto);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @CurrentUser() user: { sub: string; role: string },
  ) {
    return this.marathons.remove(id, user);
  }

  // ───── Учасники марафону ─────

  @HttpPost(':id/join')
  join(@Param('id') marathonId: string, @CurrentUser() user: { sub: string }) {
    return this.marathons.addParticipant(marathonId, user.sub);
  }

  @HttpPost(':id/leave')
  leave(@Param('id') marathonId: string, @CurrentUser() user: { sub: string }) {
    return this.marathons.removeParticipant(marathonId, user.sub);
  }

  @Get(':id/participants')
  getParticipants(@Param('id') marathonId: string) {
    return this.marathons.getParticipants(marathonId);
  }

  // ───── Attachments ─────

  @HttpPost(':id/attachments')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: UPLOAD_DIR,
      limits: { fileSize: MAX_FILE_SIZE },
      fileFilter: (
        _req: unknown,
        file: UploadedFile,
        cb: FileFilterCallback,
      ) => {
        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
          cb(new Error('Invalid file type'), false);
        } else {
          cb(null, true);
        }
      },
    }),
  )
  uploadAttachment(
    @Param('id') marathonId: string,
    @CurrentUser() user: { sub: string; role: string },
    @UploadedFile() file: UploadedFile,
  ) {
    return this.marathons.addAttachment(marathonId, user, file);
  }

  @Get(':id/attachments')
  getAttachments(@Param('id') marathonId: string) {
    return this.marathons.getAttachments(marathonId);
  }

  // ───── Reviews ─────

  @HttpPost(':id/reviews')
  addReview(
    @Param('id') marathonId: string,
    @CurrentUser() user: { sub: string },
    @Body() body: { rating: number; comment: string },
  ) {
    return this.marathons.addReview(
      marathonId,
      user.sub,
      body.rating,
      body.comment,
    );
  }

  @Get(':id/reviews')
  getReviews(@Param('id') marathonId: string) {
    return this.marathons.getReviews(marathonId);
  }

  @Get(':id/rating')
  getAverageRating(@Param('id') marathonId: string) {
    return this.marathons.getAverageRating(marathonId);
  }
}
