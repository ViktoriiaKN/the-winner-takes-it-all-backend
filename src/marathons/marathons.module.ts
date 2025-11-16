import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Marathon } from './marathon.entity';
import { MarathonUser } from './marathon-user.entity';
import { MarathonReview } from './marathon-review.entity';
import { MarathonAttachment } from './marathon-attachment.entity';
import { MarathonsService } from './marathons.service';
import { MarathonsController } from './marathons.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Marathon,
      MarathonUser,
      MarathonReview,
      MarathonAttachment,
    ]),
    UsersModule,
  ],
  providers: [MarathonsService],
  controllers: [MarathonsController],
  exports: [MarathonsService],
})
export class MarathonsModule {}
