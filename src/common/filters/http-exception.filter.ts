// src/common/filters/http-exception.filter.ts

import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch() // <- Menangkap SEMUA jenis error
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Tentukan status HTTP
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    // Format pesan error untuk log dan response
    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : {
            statusCode: status,
            message: 'Internal Server Error',
            error: (exception as Error).message,
          };

    // Log error secara detail
    this.logger.error(`HTTP Status: ${status} | Error Message: ${JSON.stringify(message)} | Method: ${request.method} | Path: ${request.url}`, (exception as Error).stack);

    // Kirim response error yang terstruktur ke klien
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      // Jika bukan error yang kita kenali (bukan HttpException),
      // tampilkan pesan generik di produksi
      ...(typeof message === 'object' ? message : { message }),
    });
  }
}
