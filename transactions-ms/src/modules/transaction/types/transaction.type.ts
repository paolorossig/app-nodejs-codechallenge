import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType()
export class TransactionType {
  @Field()
  name: string;
}

@ObjectType()
export class TransactionStatus {
  @Field()
  name: string;
}

@ObjectType()
export class Transaction {
  @Field()
  transactionExternalId: string;

  @Field(() => TransactionType)
  transactionType: TransactionType;

  @Field(() => TransactionStatus)
  transactionStatus: TransactionStatus;

  @Field()
  value: number;

  @Field()
  createdAt: Date;
}
