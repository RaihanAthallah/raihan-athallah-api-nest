import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { ChatRequestDto, ChatResponseDto } from './chat.dto';
import { GEMINI_AI } from '../../common/config/genai.config';
import { VECTOR_STORE } from '../../common/config/vector.config';
import { PGVectorStore } from '@langchain/community/vectorstores/pgvector';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  // 1. Inject KEDUA dependency: Vector Store dan Model Generatif
  constructor(
    @Inject(VECTOR_STORE) private readonly vectorStore: PGVectorStore,
    @Inject(GEMINI_AI) private readonly generativeAI: GoogleGenAI,
  ) {}

  /**
   * Menjalankan alur kerja RAG secara lengkap.
   * @param askQuestionDto DTO yang berisi pertanyaan dari user.
   * @returns Jawaban yang dihasilkan oleh AI berdasarkan konteks dari database.
   */
  async ask(ChatRequestDto: ChatRequestDto): Promise<ChatResponseDto | undefined> {
    const { message } = ChatRequestDto;
    this.logger.log(`Menerima pertanyaan baru: "${message}"`);

    try {
      // --- TAHAP 1: RETRIEVAL (Pengambilan Konteks) ---
      // Menggunakan Vector Store untuk mencari dokumen yang relevan dengan pertanyaan.
      this.logger.log('Mengambil konteks dari database vektor...');
      const retrievedDocs = await this.vectorStore.similaritySearch(message, 4);

      if (retrievedDocs.length === 0) {
        this.logger.warn('Tidak ada konteks yang ditemukan untuk pertanyaan tersebut.');
        return new ChatResponseDto('Maaf, saya tidak dapat menemukan informasi yang relevan di dalam dokumen saya untuk menjawab pertanyaan ini.');
      }

      // --- TAHAP 2: AUGMENTATION (Penyusunan Prompt) ---
      // Menggabungkan konteks yang ditemukan dengan pertanyaan asli menjadi sebuah prompt yang kaya.
      this.logger.log(`Ditemukan ${retrievedDocs.length} potongan konteks yang relevan.`);
      const context = retrievedDocs.map((doc) => doc.pageContent).join('\n---\n');

      const prompt = `
        Anda adalah asisten AI yang ahli dalam menganalisis CV. Jawab pertanyaan berikut HANYA berdasarkan konteks yang diberikan.
        Jangan gunakan pengetahuan di luar konteks ini. Jika jawaban tidak ada dalam konteks, katakan dengan jujur bahwa informasi tersebut tidak tersedia.

        KONTEKS YANG DIBERIKAN:
        ${context}

        PERTANYAAN PENGGUNA:
        "${message}"

        JAWABAN ANDA:
      `;

      // --- TAHAP 3: GENERATION (Pembuatan Jawaban) ---
      // Mengirim prompt yang sudah diperkaya ke model Gemini.
      this.logger.log('Mengirim prompt yang sudah diperkaya ke model generatif...');
      // const model = this.generativeAI.models.generateContent({ model: 'gemini-1.5-flash-latest' });
      // const result = await model.generateContent(prompt);
      const result = await this.generativeAI.models.generateContent({
        model: 'gemini-1.5-flash-latest',
        contents: prompt,
      });

      const responseText = result.text;

      this.logger.log('Jawaban berhasil dibuat.');
      return new ChatResponseDto(responseText);
    } catch (error) {
      this.logger.error('Terjadi error selama proses RAG', error.stack);
      throw new InternalServerErrorException('Gagal memproses permintaan Anda karena ada masalah internal.');
    }
  }
}
