import { Module } from "@nestjs/common";
import { TransactionService } from "./transaction.service";
import { TransactionController } from "./transaction.controller";
import { PrismaService } from "src/prisma.service";
import { ClientsModule, Transport } from "@nestjs/microservices";

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
  providers: [TransactionService, PrismaService],
})
export class TransactionModule {}
