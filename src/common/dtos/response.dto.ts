import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ResponseDto {
  @Field(() => String, { nullable: true })
  errorMessage?: string;

  @Field(() => Boolean)
  status: boolean;
}
