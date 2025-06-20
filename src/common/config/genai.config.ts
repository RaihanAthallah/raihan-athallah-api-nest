import { Module, InternalServerErrorException } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { ConfigService } from '@nestjs/config';

// Definisikan token provider agar mudah digunakan untuk injeksi
export const GEMINI_AI = 'GEMINI_AI';

@Module({
  providers: [
    {
      // Nama token yang akan kita gunakan untuk injeksi
      provide: GEMINI_AI,

      // 'useFactory' adalah fungsi yang akan dijalankan NestJS untuk membuat instance.
      // NestJS akan otomatis meng-inject 'ConfigService' karena kita menentukannya di 'inject'.
      useFactory: (configService: ConfigService) => {
        const apiKey = configService.get<string>('GOOGLE_GENAI_API_KEY'); // Ganti dengan nama variabel .env Anda

        if (!apiKey) {
          throw new InternalServerErrorException('Google GenAI API Key is not configured in .env file');
        }

        // Buat dan kembalikan instance GoogleGenerativeAI
        return new GoogleGenAI({ apiKey: apiKey });
      },

      // Tentukan dependency yang dibutuhkan oleh 'useFactory'
      inject: [ConfigService],
    },
  ],
  // Ekspor provider agar bisa digunakan oleh modul lain yang mengimpor GeminiModule
  exports: [GEMINI_AI],
})
export class GeminiModule {}
