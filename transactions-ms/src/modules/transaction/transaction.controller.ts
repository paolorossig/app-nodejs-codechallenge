import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { KafkaTopics } from "./enum/kafka.enum";
import { TransactionService } from "./transaction.service";

@Controller()
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @MessagePattern(KafkaTopics.TRANSACTION_APPROVED)
  transactionAproved(@Payload() message: { transactionId: string }) {
    this.transactionService.processApprovedTransaction(message.transactionId);
  }

  @MessagePattern(KafkaTopics.TRANSACTION_REJECTED)
  transactionRejected(@Payload() message: { transactionId: string }) {
    this.transactionService.processRejectedTransaction(message.transactionId);
  }
}
