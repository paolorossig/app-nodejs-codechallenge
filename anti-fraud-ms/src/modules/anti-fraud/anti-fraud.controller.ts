import { Controller, Logger } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { AntiFraudService } from "./anti-fraud.service";
import { KafkaTopics } from "./enum/kafka.enum";
import { TransactionDto } from "./dto/transaction.dto";

@Controller()
export class AntiFraudController {
  private readonly logger = new Logger(AntiFraudController.name);

  constructor(private readonly antiFraudService: AntiFraudService) {}

  @MessagePattern(KafkaTopics.TRANSACTION_CREATED)
  async handleMessage(@Payload() message: { transaction: TransactionDto }) {
    this.logger.log("Message received from Kafka", { message });

    this.antiFraudService.validateTransaction(message.transaction);
  }
}
