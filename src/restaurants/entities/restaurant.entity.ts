import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, PrimaryColumn } from "typeorm";

@ObjectType()
@Entity()
export class Restaurant {
    @Field(() => String)
    @PrimaryColumn()
    id: String;

    @Field(() => String)
    @Column()
    name: String;

    @Field(() => Boolean, {nullable: true})
    @Column()
    isGood: Boolean;
}
