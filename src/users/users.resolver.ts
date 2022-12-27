import {
  createAccountRequestDto,
  createAccountResponseDto,
} from './dtos/createAccount.dto';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserEntity } from './entities/users.entity';
import { UsersService } from './users.service';
import {
  loginAccountRequestDto,
  loginAccountResponseDto,
} from './dtos/loginAccount.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthUser } from 'src/auth/auth-user.decorator';
import {
  UserProfileRequestDto,
  UserProfileResponseDto,
} from './dtos/user-profile.dto';

@Resolver(() => UserEntity)
export class UserResolver {
  constructor(private readonly userService: UsersService) {}

  @Mutation(() => createAccountResponseDto)
  async createAccount(
    @Args('request') createAccountRequest: createAccountRequestDto,
  ): Promise<createAccountResponseDto> {
    try {
      const [status, errorMessage] = await this.userService.createAccount(
        createAccountRequest,
      );
      if (errorMessage) {
        return {
          status,
          errorMessage,
        };
      }
      return {
        status: true,
      };
    } catch (e) {
      return {
        status: false,
        errorMessage: e,
      };
    }
  }

  @Mutation(() => loginAccountResponseDto)
  async login(
    @Args('request') loginInput: loginAccountRequestDto,
  ): Promise<{ status: boolean; errorMessage?: string; token?: string }> {
    try {
      return await this.userService.login(loginInput);
    } catch (errorMessage) {
      return {
        status: false,
        errorMessage,
      };
    }
  }

  @Query(() => UserEntity)
  @UseGuards(AuthGuard)
  currentUser(@AuthUser() authUser) {
    return authUser;
  }

  @Query(() => UserProfileResponseDto)
  @UseGuards(AuthGuard)
  async getUserProfileDetails(
    @Args() userProfileRequest: UserProfileRequestDto,
  ): Promise<UserProfileResponseDto> {
    try {
      const userProfile = await this.userService.findUserById(
        userProfileRequest.userId,
      );
      if (!userProfile) {
        throw Error();
      }
      return {
        status: true,
        userProfile,
      };
    } catch (error) {
      return {
        errorMessage: 'The requested user profile is not found',
        status: false,
      };
    }
  }
}
