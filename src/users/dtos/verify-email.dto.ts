import { Field, ObjectType, InputType, PickType } from '@nestjs/graphql';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { VerificationEntity } from '../entities/verification.entity';

@InputType()
export class VerifyEmailRequestDto extends PickType(VerificationEntity, [
  'verificationCode',
]) {
  @Field(() => String)
  verificationCode: string;
}

@ObjectType()
export class VerifyEmailResponseDto extends ResponseDto {}
