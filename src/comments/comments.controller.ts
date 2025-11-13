import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/decorators/user.decorator';

@Controller('posts/:postId/comments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CommentsController {
  constructor(private readonly comments: CommentsService) {}

  @Get()
  list(@Param('postId') postId: string) {
    return this.comments.findForPost(postId);
  }

  @Post()
  create(
    @Param('postId') postId: string,
    @CurrentUser() user: { sub: string },
    @Body() dto: CreateCommentDto,
  ) {
    return this.comments.create(postId, user.sub, dto.text);
  }

  // окремий роут для видалення за id комента
  @Delete('/:id')
  remove(
    @Param('id') id: string,
    @CurrentUser() user: { sub: string; role: string },
  ) {
    return this.comments.remove(id, user);
  }
}
