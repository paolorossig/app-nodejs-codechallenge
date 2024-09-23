import {
  IsUUID,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsPositive,
} from "class-validator";
import { Type } from "class-transformer";

export class TransactionDto {
  @IsUUID()
  @IsNotEmpty()
  transactionExternalId: string;

  @IsNotEmpty()
  @Type(() => TransactionType)
  transactionType: TransactionType;

  @IsNotEmpty()
  @Type(() => TransactionStatus)
  transactionStatus: TransactionStatus;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  value: number;

  @IsDate()
  @Type(() => Date)
  createdAt: Date;
}

export class TransactionType {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class TransactionStatus {
  @IsString()
  @IsNotEmpty()
  name: string;
}
