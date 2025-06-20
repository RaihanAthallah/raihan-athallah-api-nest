import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PGVectorStore } from '@langchain/community/vectorstores/pgvector';
import { Pool } from 'pg';
import { EmbeddingModule, EMBEDDING_MODEL } from './embedding.config'; // Impor modul dan token
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';

export const VECTOR_STORE = 'VECTOR_STORE';

@Module({
  imports: [
    EmbeddingModule, // Impor modul dependensi
  ],
  providers: [
    {
      provide: VECTOR_STORE,
      // Factory ini sekarang butuh ConfigService dan EMBEDDING_MODEL
      useFactory: (configService: ConfigService, embeddingModel: GoogleGenerativeAIEmbeddings) => {
        const pool = new Pool({
          host: configService.get<string>('DATABASE_HOST'),
          port: configService.get<number>('DATABASE_PORT'),
          user: configService.get<string>('DATABASE_USER'),
          password: configService.get<string>('DATABASE_PASSWORD'),
          database: configService.get<string>('DATABASE_NAME'),
        });

        // Buat instance PGVectorStore dengan embeddingModel yang sudah di-inject
        return new PGVectorStore(embeddingModel, {
          pool,
          tableName: 'context',
          columns: {
            idColumnName: 'id',
            vectorColumnName: 'embedding',
            contentColumnName: 'content',
            metadataColumnName: 'metadata',
          },
        });
      },
      inject: [ConfigService, EMBEDDING_MODEL], // Inject kedua dependensi
    },
  ],
  exports: [VECTOR_STORE],
})
export class VectorStoreModule {}
