# 📦 Next.js App Setup Guide

Panduan ini akan membantu Anda menginstal dan menjalankan aplikasi Next.js secara lokal.

## ✅ Prasyarat

- Node.js dan npm sudah terinstal
- PostgreSQL sudah tersedia dan aktif

## 🛠️ Langkah Instalasi

1. **Konfigurasi Environment**

   Ubah nama file `.env.example` menjadi `.env`, lalu isi variabel environment sebagai berikut:

   ```env
   DATABASE_URL=postgresql://username:password@host:port/database
   AUTH_SECRET=isi_dengan_secret_unik_anda
   ```
2. **Install Dependencies**

   Jalankan perintah berikut untuk menginstal semua dependency yang dibutuhkan:

   ```bash
   npm install
   ```
3. **Generate Prisma Client**

   Gunakan perintah ini untuk menghasilkan client Prisma:

   ```bash
   npx prisma generate
   ```
4. **Jalankan Aplikasi**

   Mulai server pengembangan dengan perintah:

   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan di http://localhost:3000.




