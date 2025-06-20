import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';

export const EMBEDDING_MODEL = 'EMBEDDING_MODEL';

@Module({
  providers: [
    {
      provide: EMBEDDING_MODEL,
      useFactory: (configService: ConfigService) => {
        // Model embedding dari LangChain lebih cocok untuk tugas ini
        return new GoogleGenerativeAIEmbeddings({
          apiKey: configService.get<string>('GOOGLE_GENAI_API_KEY'),
          modelName: 'text-embedding-004',
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [EMBEDDING_MODEL],
})
export class EmbeddingModule {}
