// src/scripts/ingest.ts

import { PGVectorStore } from '@langchain/community/vectorstores/pgvector';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Pool } from 'pg';

// Fungsi utama untuk menjalankan ingesti
const ingestData = async () => {
  console.log('Memulai proses ingesti...');

  // 1. Konfigurasi koneksi ke PostgreSQL
  const config = {
    postgresConnectionOptions: {
      host: '157.230.42.138',
      port: 5433,
      user: 'rag_user',
      password: 'mysecretpassword',
      database: 'rag_db',
    },
    tableName: 'context', // Nama tabel yang sudah Anda buat
    columns: {
      // Nama kolom yang sudah Anda buat
      idColumnName: 'id',
      vectorColumnName: 'embedding',
      contentColumnName: 'content',
      metadataColumnName: 'metadata',
    },
  };

  // 2. Baca Dokumen dari File
  // Pastikan Anda punya file 'knowledge-base.txt' di root proyek
  const loader = new TextLoader('knowledge-base.txt');
  const docs = await loader.load();
  console.log(`Dokumen berhasil dimuat. Jumlah karakter: ${docs[0].pageContent.length}`);

  // 3. Pecah Dokumen menjadi Potongan (Chunks)
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const splitDocs = await splitter.splitDocuments(docs);
  console.log(`Dokumen dipecah menjadi ${splitDocs.length} potongan.`);

  // 4. Inisialisasi Model Embedding
  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: 'AIzaSyAjqS1YnzFAW0kDauMus65t9UgMp273RMM',
    modelName: 'text-embedding-004', // Dimensi 768
  });

  // 5. Simpan Dokumen dan Embeddings ke PGVectorStore
  // LangChain akan otomatis membuat embedding untuk setiap potongan dan menyimpannya.
  console.log('Menyimpan embeddings ke database. Proses ini mungkin memakan waktu...');

  const pgvectorStore = await PGVectorStore.fromDocuments(splitDocs, embeddings, config);

  console.log('Proses ingesti selesai!');

  // Tutup koneksi pool setelah selesai
  await pgvectorStore.pool.end();
};

// Jalankan fungsi
ingestData();
