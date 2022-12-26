import { UsersService } from './../users/users.service';
import { CONFIG_OPTIONS } from './jwt.constants';
import { JwtModuleOptions } from './interfaces/jwt-module-options.interface';
import { DynamicModule, Global, Module } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { UserEntity } from 'src/users/entities/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({})
@Global()
export class JwtModule {
  static forRoot(options: JwtModuleOptions): DynamicModule {
    return {
      imports: [TypeOrmModule.forFeature([UserEntity])],
      module: JwtModule,
      exports: [JwtService],
      providers: [
        { provide: CONFIG_OPTIONS, useValue: options },
        JwtService,
        UsersService,
      ],
    };
  }
}
