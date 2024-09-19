import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { AntiFraudService } from "./anti-fraud.service";
import { AntiFraudController } from "./anti-fraud.controller";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "KAFKA_ANTI_FRAUD_SERVICE",
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: process.env.KAFKA_BROKERS?.split(","),
          },
        },
      },
    ]),
  ],
  controllers: [AntiFraudController],
  providers: [AntiFraudService],
})
export class AntiFraudModule {}
