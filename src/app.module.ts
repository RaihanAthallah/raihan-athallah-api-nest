import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { ChatController } from './modules/chat/chat.controller';
import { ChatService } from './modules/chat/chat.service';
import { ConfigModule } from '@nestjs/config';
import { GeminiModule } from './common/config/genai.config';
import { VectorStoreModule } from './common/config/vector.config'; // Assuming you have a VectorStoreModule for PGVectorStore

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the configuration available globally
    }),
    GeminiModule,
    VectorStoreModule, // Assuming you have a VectorStoreModule for PGVectorStore
    // Import other modules here if needed, e.g., TypeOrmModule, MongooseModule, etc.
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*'); // Assuming you have KeyMiddleware for API key validation
  }
}
