import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { UserEntity } from './users.entity';
import { v4 as uuidv4 } from 'uuid';

@Entity()
@ObjectType()
@InputType({ isAbstract: true })
export class VerificationEntity extends CoreEntity {
  @Column()
  @Field(() => String)
  verificationCode: string;

  @OneToOne(() => UserEntity)
  @JoinColumn()
  userToBeVerified: UserEntity;

  @BeforeInsert()
  createVerificationCode(): void {
    this.verificationCode = uuidv4();
  }
}
