import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post as HttpPost,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/decorators/user.decorator';

@Controller('posts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PostsController {
  constructor(private readonly posts: PostsService) {}

  @Get()
  findAll() {
    return this.posts.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.posts.findOne(id);
  }

  @HttpPost()
  create(@CurrentUser() user: { sub: string }, @Body() dto: CreatePostDto) {
    return this.posts.create(user.sub, dto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: { sub: string; role: string },
    @Body() dto: UpdatePostDto,
  ) {
    return this.posts.update(id, user, dto);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @CurrentUser() user: { sub: string; role: string },
  ) {
    return this.posts.remove(id, user);
  }
}
