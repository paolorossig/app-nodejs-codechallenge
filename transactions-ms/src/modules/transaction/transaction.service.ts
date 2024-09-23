import {
  Body,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { Prisma, Status } from "@prisma/client";
import { ClientKafka } from "@nestjs/microservices";
import { KafkaTopics } from "./enum/kafka.enum";
import { mapTransaction } from "./mapper/transaction.mapper";

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject("KAFKA_TRANSACTION_SERVICE") private readonly kafkaPort: ClientKafka
  ) {}

  private async retry<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        // Rethrow if last attempt
        if (attempt === retries - 1) {
          this.logger.error("Max retries reached");
          throw error;
        }

        // Handle specific errors to avoid retrying
        if (error instanceof NotFoundException) {
          throw error;
        }

        // Exponential wait time
        const waitTime = 100 * Math.pow(2, attempt);
        this.logger.warn(
          `Attempt ${attempt + 1} failed, retrying in ...${waitTime}ms`
        );
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }
  }

  async createTransaction(
    @Body() createTransactionInput: Prisma.TransactionCreateInput
  ) {
    this.logger.debug("Creating transaction...");
    return this.retry(async () => {
      const createdTransaction = await this.prisma.transaction.create({
        data: createTransactionInput,
      });

      const transaction = mapTransaction(createdTransaction);

      this.kafkaPort.emit(KafkaTopics.TRANSACTION_CREATED, { transaction });
      this.logger.debug("Message sent to kafka successfully");

      return transaction;
    });
  }

  async getTransactionById(transactionId: string) {
    this.logger.debug(`Getting transaction with id ${transactionId}`);
    return this.retry(async () => {
      const transaction = await this.prisma.transaction.findFirst({
        where: { id: transactionId },
      });
      if (!transaction) {
        this.logger.debug(`Transaction ${transactionId} not found`);
        throw new NotFoundException("Transaction not found");
      }
      this.logger.debug(`Transaction ${transactionId} found`);

      return mapTransaction(transaction);
    });
  }

  async processApprovedTransaction(transactionId: string) {
    this.logger.debug(`Processing transaction ${transactionId}`);
    return this.retry(async () => {
      await this.prisma.transaction.update({
        where: { id: transactionId },
        data: { status: Status.approved },
      });
      this.logger.debug(`Transaction ${transactionId} approved`);
    });
  }

  async processRejectedTransaction(transactionId: string) {
    this.logger.debug(`Processing transaction ${transactionId}`);
    return this.retry(async () => {
      await this.prisma.transaction.update({
        where: { id: transactionId },
        data: { status: Status.rejected },
      });
      this.logger.debug(`Transaction ${transactionId} rejected`);
    });
  }
}
