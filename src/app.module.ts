import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Post } from './posts/post.entity';
import { Comment } from './comments/comment.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (cfg: ConfigService) => ({
        type: 'sqlite',
        database: cfg.get<string>('SQLITE_DB') ?? './data/app.sqlite',
        entities: [User, Post, Comment],
        synchronize: true, // тільки для dev
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    PostsModule,
    CommentsModule,
  ],
})
export class AppModule {}
