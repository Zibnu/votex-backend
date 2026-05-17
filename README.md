# ⚙️ Votex — Backend Documentation

Dokumentasi ini menjelaskan cara **clone**, **menjalankan secara lokal**, hingga **deploy ke Railway** untuk project backend Votex yang dibangun dengan **Express.js**, **Sequelize ORM**, dan **PostgreSQL**.

---

## 📋 Daftar Isi

- [Kebutuhan Awal (Prerequisites)](#-kebutuhan-awal-prerequisites)
- [Clone Project ke Komputer Lokal](#-1-clone-project-ke-komputer-lokal)
- [Install Dependencies](#-2-install-dependencies)
- [Konfigurasi Environment Variable](#-3-konfigurasi-environment-variable)
- [Setup Database PostgreSQL Lokal](#-4-setup-database-postgresql-lokal)
- [Menjalankan Migration (Buat Tabel Otomatis)](#-5-menjalankan-migration-buat-tabel-otomatis)
- [Menjalankan Server Secara Lokal](#-6-menjalankan-server-secara-lokal)
- [Test API](#-7-test-api)
- [Push ke GitHub](#-8-push-ke-github)
- [Deploy Database PostgreSQL ke Railway](#-9-deploy-database-postgresql-ke-railway)
- [Deploy Backend ke Railway](#-10-deploy-backend-ke-railway)

---

## 🛠️ Kebutuhan Awal (Prerequisites)

Pastikan software berikut sudah terinstall sebelum memulai:

| Software | Kegunaan | Link Download |
|---|---|---|
| **Git Bash** | Clone repository dan menjalankan perintah git | [git-scm.com](https://git-scm.com/downloads) |
| **Node.js & npm** | Menjalankan server dan menginstall library | [nodejs.org](https://nodejs.org/) |
| **PostgreSQL** | Database yang digunakan oleh project ini | [postgresql.org](https://www.postgresql.org/download/) |
| **DBeaver** | Software GUI untuk mengelola database PostgreSQL lokal | [dbeaver.io](https://dbeaver.io/download/) |
| **Postman** *(opsional)* | Tool untuk testing API | [postman.com](https://www.postman.com/downloads/) |
| **Thunder Client** *(opsional)* | Extension VS Code untuk testing API (alternatif Postman) | Cari di VS Code Extensions |

> Untuk testing API, pilih salah satu antara **Postman** atau **Thunder Client** — tidak perlu keduanya.

---

## 📥 1. Clone Project ke Komputer Lokal


1. Buka halaman repository backend Votex di GitHub akun kamu.
2. Klik tombol **Code** (hijau) dan salin URL HTTPS-nya.
3. Buka **Git Bash** di folder tujuan, lalu jalankan:

```bash
git clone https://github.com/<username-kamu>/votex-backend.git
```

4. Masuk ke folder project:

```bash
cd votex-backend
```

5. Buka terminal Git Bash di dalam folder tersebut untuk langkah selanjutnya.

---

## 📦 2. Install Dependencies

Install semua library yang dibutuhkan project (Express.js, Sequelize, dll.) dengan perintah:

```bash
npm install
```

Tunggu hingga proses selesai sebelum melanjutkan ke langkah berikutnya.

---

## ⚙️ 3. Konfigurasi Environment Variable

> **⚠️ Penting!** File `.env` **tidak ikut tersimpan di GitHub**. Kamu harus membuatnya secara manual di dalam folder root project.

Buat file baru bernama **`.env`** di root project, lalu isi dengan variabel-variabel berikut beserta penjelasannya:

```env
PORT=5400
DB_HOST=localhost
DB_PORT=5432
DB_NAME=votex_db
DB_USER=postgres
DB_PASS=password_kamu
SECRET_KEYS=bebas_isi_terserah
DB_DIALECT=postgres
DB_LOGGING=false
DB_URL=postgresql://user:password@host:port/dbname
NODE_ENV=production
```

### Penjelasan Setiap Variable

| Variable | Penjelasan |
|---|---|
| `PORT` | Port yang digunakan server saat berjalan. Dipakai di `index.js` sebagai listener, dan menentukan format URL API (contoh: `http://localhost:5400`) |
| `DB_HOST` | Host database untuk koneksi lokal. Isi dengan `localhost` jika database berjalan di komputer sendiri |
| `DB_PORT` | Port default PostgreSQL, biasanya `5432` |
| `DB_NAME` | Nama database yang kamu buat di PostgreSQL. Sesuaikan dengan nama yang dibuat, contoh: `votex_db` |
| `DB_USER` | Username PostgreSQL. Default saat instalasi PostgreSQL adalah `postgres` |
| `DB_PASS` | Password PostgreSQL yang kamu buat saat instalasi dan setup database |
| `SECRET_KEYS` | Kunci rahasia untuk pembuatan token JWT. Isi bebas, contoh: `votex_secret_2024`. **Variabel ini wajib ditambahkan saat deploy ke Railway** |
| `DB_DIALECT` | Memberitahu Sequelize bahwa database yang digunakan adalah PostgreSQL. Wajib diisi `postgres`. **Variabel ini wajib ditambahkan saat deploy ke Railway** |
| `DB_LOGGING` | Jika diisi `false`, Sequelize tidak akan menampilkan log query SQL di terminal sehingga output terminal lebih bersih |
| `DB_URL` | Connection string database PostgreSQL yang sudah dideploy (didapat dari Railway setelah deploy database). Lihat [langkah 9](#-9-deploy-database-postgresql-ke-railway) |
| `NODE_ENV` | Mode environment aplikasi. Wajib diisi `production` agar server dapat berjalan secara optimal baik di lokal maupun di Railway |

---

## 🗃️ 4. Setup Database PostgreSQL Lokal

Sebelum menjalankan migration, buat terlebih dahulu database di PostgreSQL lokal menggunakan **DBeaver**:

1. Buka **DBeaver**, lalu buat koneksi baru ke PostgreSQL dengan konfigurasi:
   - **Host:** `localhost`
   - **Port:** `5432`
   - **User:** `postgres`
   - **Password:** password yang kamu buat saat instalasi PostgreSQL
2. Setelah terhubung, buat database baru dengan nama yang sama seperti nilai `DB_NAME` di file `.env` kamu (contoh: `votex_db`).
3. Pastikan nama database, user, dan password di DBeaver sudah sesuai dengan yang ada di file `.env`.

---

## 🔄 5. Menjalankan Migration (Buat Tabel Otomatis)

Project ini sudah menyediakan script migration untuk membuat semua tabel database secara otomatis dari folder `migrations`. Jalankan perintah berikut:

```bash
npm run mg_run
```

Perintah ini akan membaca file migration yang sudah disiapkan dan membuat struktur tabel di database sesuai dengan skema yang telah didefinisikan. Kamu tidak perlu membuat tabel secara manual.

---

## ▶️ 6. Menjalankan Server Secara Lokal

Setelah database siap dan migration berhasil dijalankan, jalankan server dengan:

```bash
npm run dev
```

Server akan berjalan di:

```
http://localhost:5400
```

> Angka `5400` sesuai dengan nilai `PORT` yang kamu set di file `.env`. Jika kamu mengubah nilainya, sesuaikan juga URL-nya.

---

## 🧪 7. Test API

Setelah server berjalan, kamu bisa mulai mencoba endpoint API menggunakan salah satu tool berikut:

**Menggunakan Postman:**
1. Buka Postman, buat request baru.
2. Masukkan URL endpoint, contoh: `http://localhost:5400/api/...`
3. Pilih method (GET, POST, dll.) lalu klik **Send**.

**Menggunakan Thunder Client (VS Code):**
1. Install extension **Thunder Client** di VS Code.
2. Klik ikon Thunder Client di sidebar kiri.
3. Buat request baru, masukkan URL dan method, lalu klik **Send**.

---

## 📤 8. Push ke GitHub

Setelah melakukan perubahan, simpan kode ke repository GitHub kamu:

```bash
# Tambahkan semua perubahan
git add .

# Buat commit
git commit -m "deskripsi perubahan yang kamu buat"

# Push ke branch utama
git push origin main
```

> **Ingat:** File `.env` tidak akan ikut ter-push karena sudah didaftarkan di `.gitignore`. Ini adalah hal yang benar — jangan pernah push file `.env` ke GitHub.

---

## 🐘 9. Deploy Database PostgreSQL ke Railway

Sebelum deploy backend, deploy dulu database PostgreSQL ke Railway agar mendapatkan `DB_URL`.

**Langkah-langkah:**

1. Buka [railway.app](https://railway.app) dan login (bisa dengan akun GitHub).
2. Klik **"New Project"** → pilih **"Deploy PostgreSQL"** (dari template database yang tersedia).
3. Tunggu hingga database selesai dibuat.
4. Klik pada service PostgreSQL yang baru dibuat, lalu buka tab **"Variables"** atau **"Connect"**.
5. Salin nilai **`DATABASE_URL`** yang tersedia — inilah nilai yang digunakan sebagai `DB_URL` di file `.env` dan di konfigurasi Railway nanti. Formatnya seperti:

```
postgresql://postgres:password@host.railway.app:port/railway
```

6. Setelah `DB_URL` didapat, perbarui file `.env` lokal kamu dengan nilai tersebut.
7. Jalankan ulang migration agar tabel terbentuk di database Railway:

```bash
npm run mg_run
```

> Pastikan `DB_URL` di `.env` sudah diupdate ke URL Railway sebelum menjalankan perintah ini jika ingin migration berjalan di database cloud, atau biarkan `DB_HOST=localhost` jika masih ingin migration di lokal.

---

## 🚀 10. Deploy Backend ke Railway

Setelah database siap dan kode sudah di-push ke GitHub, deploy backend ke Railway:

### Langkah 1 — Buat Project Baru

1. Di dashboard Railway, klik **"New Project"** → pilih **"Deploy from GitHub repo"**.
2. Hubungkan akun GitHub jika belum, lalu pilih repository **votex-backend**.

### Langkah 2 — Set Environment Variables

Ini langkah yang **paling penting**. Buka tab **"Variables"** pada service backend kamu di Railway, lalu tambahkan semua variabel berikut:

| Variable | Nilai |
|---|---|
| `DB_URL` | *(URL PostgreSQL dari langkah 9)* |
| `SECRET_KEYS` | *(isi bebas, sama seperti di .env lokal)* |
| `DB_DIALECT` | `postgres` |
| `DB_LOGGING` | `false` |
| `NODE_ENV` | `production` |

> Untuk koneksi database di Railway, cukup gunakan `DB_URL` saja. Variabel `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, dan `DB_PASS` tidak perlu ditambahkan karena sudah tercakup dalam `DB_URL`.

### Langkah 3 — Deploy & Generate Domain

1. Railway akan otomatis melakukan deploy setelah variabel disimpan.
2. Tunggu proses build selesai.
3. Setelah berhasil, buka tab **"Settings"** → bagian **"Networking"** → klik **"Generate Domain"**.
4. Railway akan memberikan URL publik untuk backend kamu, contoh:

```
https://votex-backend-production.up.railway.app
```

### Langkah 4 — Hubungkan ke Frontend

URL domain yang baru saja di-generate inilah yang digunakan sebagai nilai `VITE_BASE_URL` di project **frontend** Votex, baik di file `.env` lokal frontend maupun di environment variable Vercel.

```env
VITE_BASE_URL=https://votex-backend-production.up.railway.app
```

🎉 **Backend Votex kamu kini sudah live dan siap digunakan!**

---

## 🔄 Update Deployment Otomatis

Setiap kali kamu melakukan **`git push`** ke branch `main`, Railway akan otomatis melakukan **re-deploy** dengan kode terbaru secara otomatis.

---

## ❓ Troubleshooting

| Masalah | Solusi |
|---|---|
| `npm install` gagal | Pastikan Node.js sudah terinstall. Cek dengan `node -v` |
| Koneksi database gagal saat lokal | Periksa `DB_HOST`, `DB_USER`, `DB_PASS`, dan `DB_NAME` di `.env` sudah sesuai dengan setup PostgreSQL lokal |
| `npm run mg_run` error | Pastikan database dengan nama sesuai `DB_NAME` sudah dibuat di PostgreSQL terlebih dahulu |
| Server jalan tapi API error | Periksa apakah nilai `DB_URL` di `.env` sudah benar dan database Railway aktif |
| Deploy Railway gagal | Pastikan semua environment variable sudah diisi di Railway, terutama `DB_URL`, `SECRET_KEYS`, `DB_DIALECT`, dan `NODE_ENV` |
| Frontend tidak bisa konek ke backend | Pastikan `VITE_BASE_URL` di frontend sudah diupdate dengan URL domain Railway yang benar |

---

> Dibuat dengan ❤️ untuk project **Votex**