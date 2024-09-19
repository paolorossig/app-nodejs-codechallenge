import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import { Transport } from "@nestjs/microservices";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      subscribe: {
        fromBeginning: true,
      },
      consumer: {
        groupId: process.env.KAFKA_GROUP_ID,
      },
      client: {
        brokers: process.env.KAFKA_BROKERS?.split(","),
      },
    },
  });

  await app.startAllMicroservices();

  await app.listen(process.env.TRANSACTIONS_MS_PORT ?? 3000);
}
bootstrap();
