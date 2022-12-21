import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { UserEntity } from '../entities/users.entity';

@InputType()
export class loginAccountRequestDto extends PickType(UserEntity, [
  'email',
  'password',
]) {
  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;
}

@ObjectType()
export class loginAccountResponseDto extends ResponseDto {
  @Field(() => String, { nullable: true })
  token?: string;
}
