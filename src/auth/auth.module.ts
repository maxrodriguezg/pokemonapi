import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
    TypeOrmModule.forFeature([])
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
