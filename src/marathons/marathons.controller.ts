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
import { MarathonsService } from './marathons.service';
import { CreateMarathonDto } from './dto/create-marathon.dto';
import { UpdateMarathonDto } from './dto/update-marathon.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/decorators/user.decorator';

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
