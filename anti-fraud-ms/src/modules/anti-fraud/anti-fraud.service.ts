import { Inject, Injectable, Logger } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { TransactionDto } from "./dto/transaction.dto";
import { KafkaTopics } from "./enum/kafka.enum";

const MAX_TRANSACTION_VALUE = 1000;

@Injectable()
export class AntiFraudService {
  private readonly logger = new Logger(AntiFraudService.name);

  constructor(
    @Inject("KAFKA_ANTI_FRAUD_SERVICE") private readonly kafkaPort: ClientKafka
  ) {}

  validateTransaction(transaction: TransactionDto) {
    try {
      if (transaction.value > MAX_TRANSACTION_VALUE) {
        this.kafkaPort.emit(KafkaTopics.TRANSACTION_REJECTED, { transaction });
        this.logger.log(`Transaction ${transaction.id} rejected`);
      } else {
        this.kafkaPort.emit(KafkaTopics.TRANSACTION_APPROVED, { transaction });
        this.logger.log(`Transaction ${transaction.id} approved`);
      }
    } catch (error) {
      this.logger.error(
        `Error validating the transaction ${transaction.id}`,
        error
      );
    }
  }
}
