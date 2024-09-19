import {
  Body,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { Prisma, Status } from "@prisma/client";
import { ClientKafka } from "@nestjs/microservices";
import { KafkaTopics } from "./enum/kafka.enum";

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject("KAFKA_TRANSACTION_SERVICE") private readonly kafkaPort: ClientKafka
  ) {}

  async createTransaction(
    @Body() createTransactionInput: Prisma.TransactionCreateInput
  ) {
    try {
      const createdTransaction = await this.prisma.transaction.create({
        data: createTransactionInput,
      });

      const transaction = {
        id: createdTransaction.id,
        accountExternalIdDebit: createdTransaction.accountExternalIdDebit,
        accountExternalIdCredit: createdTransaction.accountExternalIdCredit,
        transferTypeId: createdTransaction.transferTypeId,
        value: createdTransaction.value,
        createdAt: createdTransaction.createdAt,
      };

      this.kafkaPort.emit(KafkaTopics.TRANSACTION_CREATED, { transaction });

      this.logger.log("Message sent to kafka successfully");

      return createdTransaction;
    } catch (error) {
      throw new ConflictException(`Error creating the transaction - ${error}`);
    }
  }

  async getTransactionById(id: string) {
    const transaction = await this.prisma.transaction.findFirst({
      where: { id },
    });

    if (!transaction) throw new NotFoundException("Transaction not found");

    return transaction;
  }

  async processApprovedTransaction(id: string) {
    await this.prisma.transaction.update({
      where: { id },
      data: { status: Status.approved },
    });

    this.logger.log(`Trasaction with ID ${id} was approved`);
  }

  async processRejectedTransaction(id: string) {
    await this.prisma.transaction.update({
      where: { id },
      data: { status: Status.rejected },
    });

    this.logger.log(`Trasaction with ID ${id} was rejected`);
  }
}
