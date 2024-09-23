import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { TransactionController } from "./transaction.controller";
import { TransactionResolver } from "./transaction.resolver";
import { TransactionService } from "./transaction.service";
import { PrismaService } from "../../prisma.service";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "KAFKA_TRANSACTION_SERVICE",
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: "transactions",
            brokers: process.env.KAFKA_BROKERS?.split(","),
          },
        },
      },
    ]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService, PrismaService, TransactionResolver],
})
export class TransactionModule {}
