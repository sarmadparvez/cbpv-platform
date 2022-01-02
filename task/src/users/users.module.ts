import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [UsersService],
  imports: [ConfigModule, HttpModule],
  exports: [UsersService],
})
export class UsersModule {}
