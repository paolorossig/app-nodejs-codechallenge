import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import { Transport } from "@nestjs/microservices";

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.KAFKA,
    options: {
      subscribe: {
        fromBeginning: true,
      },
      client: {
        brokers: process.env.KAFKA_BROKERS?.split(","),
      },
      consumer: {
        groupId: process.env.KAFKA_GROUP_ID,
      },
    },
  });

  app.useGlobalPipes(new ValidationPipe());
  await app.listen();
}
bootstrap();
