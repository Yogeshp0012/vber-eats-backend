import { VerificationEntity } from './entities/verification.entity';
import { UserResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UserEntity } from './entities/users.entity';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, VerificationEntity])],
  providers: [UserResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
