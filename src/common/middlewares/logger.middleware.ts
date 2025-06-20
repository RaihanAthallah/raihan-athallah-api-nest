// src/common/middleware/logger.middleware.ts

import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  // Gunakan Logger bawaan NestJS untuk konsistensi
  private readonly logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction) {
    // Dapatkan detail request
    const { ip, method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';
    const startTime = Date.now();

    // Event listener saat response selesai
    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');
      const endTime = Date.now();
      const duration = endTime - startTime;

      const message = `${method} ${originalUrl} ${statusCode} ${contentLength} - ${duration}ms - ${userAgent} ${ip}`;

      // Tentukan level log berdasarkan status code
      if (statusCode >= 500) {
        this.logger.error(message);
      } else if (statusCode >= 400) {
        this.logger.warn(message);
      } else {
        this.logger.log(message);
      }
    });

    // Lanjutkan ke handler berikutnya
    next();
  }
}
