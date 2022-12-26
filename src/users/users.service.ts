import { ConfigService } from '@nestjs/config';
import { createAccountRequestDto } from './dtos/createAccount.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Equal, Repository } from 'typeorm';
import { UserEntity } from './entities/users.entity';
import { loginAccountRequestDto } from './dtos/loginAccount.dto';
import { JwtService } from 'src/jwt/jwt.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async createAccount({
    email,
    password,
    role,
  }: createAccountRequestDto): Promise<[boolean, string?]> {
    try {
      const exists = await this.userRepo.findOne({
        where: {
          email: Equal(email),
        },
      });
      if (exists) {
        return [false, 'User already exists!'];
      }
      await this.userRepo.save(this.userRepo.create({ email, password, role }));
      return [true];
    } catch (e) {
      return [false, 'The requested user account was not created.'];
    }
  }

  async login({ email, password }: loginAccountRequestDto): Promise<{
    status: boolean;
    errorMessage?: string;
    token?: string;
  }> {
    try {
      const user = await this.userRepo.findOne({
        where: {
          email: Equal(email),
        },
      });
      if (!user) {
        return {
          status: false,
          errorMessage: 'The requested user is not found.',
        };
      }
      const correctPassword = await user.checkPassword(password);
      if (!correctPassword) {
        return {
          status: false,
          errorMessage: 'Incorrect Password.',
        };
      }
      const token = this.jwtService.sign({ id: user.id });
      return {
        status: true,
        token,
      };
    } catch (errorMessage) {
      return {
        status: false,
        errorMessage,
      };
    }
  }

  async findUserById(id: number): Promise<UserEntity> {
    return await this.userRepo.findOne({
      where: {
        id: Equal(id),
      },
    });
  }
}
