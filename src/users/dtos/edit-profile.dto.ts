import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { UserEntity } from '../entities/users.entity';
import { ResponseDto } from './../../common/dtos/response.dto';

@ObjectType()
export class EditProfileDtoResponse extends ResponseDto {}

@InputType()
export class EditProfileDtoRequest extends PartialType(
  PickType(UserEntity, ['email', 'password']),
) {
  @Field(() => String, { nullable: true })
  email: string;

  @Field(() => String, { nullable: true })
  password: string;
}
