import { InputType, Field } from "@nestjs/graphql";
import { IsNotEmpty, IsUUID, IsInt, IsPositive } from "class-validator";

@InputType()
export class CreateTransactionDto {
  @Field()
  @IsUUID()
  @IsNotEmpty()
  accountExternalIdDebit: string;

  @Field()
  @IsUUID()
  @IsNotEmpty()
  accountExternalIdCredit: string;

  @Field()
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  transferTypeId: number;

  @Field()
  @IsPositive()
  @IsNotEmpty()
  value: number;
}
