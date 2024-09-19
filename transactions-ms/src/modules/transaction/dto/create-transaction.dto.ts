import { IsInt, IsNotEmpty, IsNumber, IsUUID } from "class-validator";

export class CreateTransactionDto {
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
}
