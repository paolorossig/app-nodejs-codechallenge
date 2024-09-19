import { IsUUID, IsInt, IsDate, IsNotEmpty, IsNumber } from "class-validator";
import { Type } from "class-transformer";

export class TransactionDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsUUID()
  @IsNotEmpty()
  accountExternalIdDebit: string;

  @IsUUID()
  @IsNotEmpty()
  accountExternalIdCredit: string;

  @IsInt()
  @IsNotEmpty()
  transferTypeId: number;

  @IsNumber()
  @IsNotEmpty()
  value: number;

  @IsDate()
  @Type(() => Date)
  createdAt: Date;
}
