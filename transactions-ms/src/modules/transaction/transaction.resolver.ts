import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { TransactionService } from "./transaction.service";
import { CreateTransactionDto } from "./dto/transaction.dto";
import { Transaction } from "./types/transaction.type";

@Resolver()
export class TransactionResolver {
  constructor(private readonly transactionService: TransactionService) {}

  @Query(() => Transaction)
  async getTransactionByExternalId(@Args("externalId") id: string) {
    return this.transactionService.getTransactionById(id);
  }

  @Mutation(() => Transaction)
  async createTransaction(@Args("input") input: CreateTransactionDto) {
    return this.transactionService.createTransaction(input);
  }
}
