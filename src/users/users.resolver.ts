import {
  createAccountRequestDto,
  createAccountResponseDto,
} from './dtos/createAccount.dto';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserEntity } from './entities/users.entity';
import { UsersService } from './users.service';
import {
  loginAccountRequestDto,
  loginAccountResponseDto,
} from './dtos/loginAccount.dto';

@Resolver(() => UserEntity)
export class UserResolver {
  constructor(private readonly userService: UsersService) {}

  @Query(() => Boolean)
  hi() {
    return true;
  }

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
  currentUser(@Context() context) {
    if (!context.user) {
      return;
    } else {
      return context.user;
    }
  }
}
