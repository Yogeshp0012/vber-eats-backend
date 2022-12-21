import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { UserEntity, UserRole } from '../entities/users.entity';

@InputType()
export class createAccountRequestDto extends PickType(UserEntity, [
  'email',
  'password',
  'role',
]) {
  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;

  @Field(() => UserRole)
  role: UserRole;
}

@ObjectType()
export class createAccountResponseDto {
  @Field(() => String, { nullable: true })
  errorMessage?: string;

  @Field(() => Boolean)
  status: boolean;
}
