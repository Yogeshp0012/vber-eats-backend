import { UserEntity } from 'src/users/entities/users.entity';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
@ArgsType()
export class UserProfileRequestDto {
  @Field(() => Number)
  userId: number;
}

@ObjectType()
export class UserProfileResponseDto extends ResponseDto {
  @Field(() => UserEntity, { nullable: true })
  userProfile?: UserEntity;
}
