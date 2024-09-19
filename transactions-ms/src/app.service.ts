import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  checkHealth(): {status: string} {
    return { status: 'ok' };
  }
}
