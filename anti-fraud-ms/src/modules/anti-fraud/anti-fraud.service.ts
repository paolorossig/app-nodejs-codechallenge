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
    const { transactionExternalId, value } = transaction;
    try {
      if (value > MAX_TRANSACTION_VALUE) {
        this.kafkaPort.emit(KafkaTopics.TRANSACTION_REJECTED, {
          transactionId: transactionExternalId,
        });
        this.logger.log(`Transaction ${transactionExternalId} rejected`);
      } else {
        this.kafkaPort.emit(KafkaTopics.TRANSACTION_APPROVED, {
          transactionId: transactionExternalId,
        });
        this.logger.log(`Transaction ${transactionExternalId} approved`);
      }
    } catch (error) {
      this.logger.error(
        `Error validating the transaction ${transactionExternalId}`,
        error
      );
      throw error;
    }
  }
}
