import { VerificationEntity } from './entities/verification.entity';
import { createAccountRequestDto } from './dtos/createAccount.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Equal, Repository } from 'typeorm';
import { UserEntity } from './entities/users.entity';
import { loginAccountRequestDto } from './dtos/loginAccount.dto';
import { JwtService } from 'src/jwt/jwt.service';
import { EditProfileDtoRequest } from './dtos/edit-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(VerificationEntity)
    private readonly verificationRepo: Repository<VerificationEntity>,
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
      const currentUser = await this.userRepo.save(
        this.userRepo.create({ email, password, role }),
      );
      await this.verificationRepo.save(
        this.verificationRepo.create({ userToBeVerified: currentUser }),
      );
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
        select: ['password', 'id'],
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

  async editProfile(id: number, { email, password }: EditProfileDtoRequest) {
    const currentUser: UserEntity = await this.findUserById(id);
    if (email) {
      currentUser.email = email;
    }
    if (password) {
      currentUser.password = password;
    }
    currentUser.isVerified = false;
    await this.verificationRepo.save(
      this.verificationRepo.create({ userToBeVerified: currentUser }),
    );
    return await this.userRepo.save(currentUser);
  }

  async verifyEmail(verificationCode: string): Promise<boolean> {
    try {
      const verification = await this.verificationRepo.findOne({
        where: {
          verificationCode: Equal(verificationCode as string),
        },
        relations: ['userToBeVerified'],
      });
      if (verification) {
        verification.userToBeVerified.isVerified = true;
        this.userRepo.save(verification.userToBeVerified);
      }
      throw new Error();
    } catch (error) {
      console.log('ERROR');
      return false;
    }
  }
}
