import { Body, Controller, Get, Logger, Param, Post } from "@nestjs/common";
import { TransactionService } from "./transaction.service";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { KafkaTopics } from "./enum/kafka.enum";
import { MessagePattern, Payload } from "@nestjs/microservices";

@Controller("transactions")
export class TransactionController {
  private readonly logger = new Logger(TransactionController.name);

  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  createTransaction(@Body() input: CreateTransactionDto) {
    return this.transactionService.createTransaction(input);
  }

  @Get(":id")
  getTransaction(@Param("id") id: string) {
    return this.transactionService.getTransactionById(id);
  }

  @MessagePattern(KafkaTopics.TRANSACTION_APPROVED)
  transactionAproved(@Payload() message: { transaction: any }) {
    this.logger.log("Message received from Kafka", { message });
    try {
      this.transactionService.processApprovedTransaction(
        message.transaction.id
      );
    } catch (error) {
      this.logger.error("Error processing approved transaction", error);
    }
  }

  @MessagePattern(KafkaTopics.TRANSACTION_REJECTED)
  transactionRejected(@Payload() message: { transaction: any }) {
    this.logger.log("Message received from Kafka", { message });
    try {
      this.transactionService.processRejectedTransaction(
        message.transaction.id
      );
    } catch (error) {
      this.logger.error("Error processing rejected transaction", error);
    }
  }
}
