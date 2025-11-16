import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';

// 👇 імпорти марафонів
import { Marathon } from './marathons/marathon.entity';
import { MarathonUser } from './marathons/marathon-user.entity';
import { MarathonReview } from './marathons/marathon-review.entity';
import { MarathonAttachment } from './marathons/marathon-attachment.entity';
import { MarathonsModule } from './marathons/marathons.module';

@Module({
  imports: [
    // 👇 підтягуємо .env і робимо ConfigModule глобальним
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      // 👇 просто додали нові сутності до списку
      entities: [
        User,
        Marathon,
        MarathonUser,
        MarathonReview,
        MarathonAttachment,
      ],
      synchronize: true,
    }),

    UsersModule,
    AuthModule,
    MarathonsModule, // 👈 новий модуль марафонів
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
