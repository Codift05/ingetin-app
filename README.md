<div align="center">

<img src="https://raw.githubusercontent.com/Codift05/ingetin-app/master/public/vite.svg" width="60" alt="Inget.in Logo" />

# Inget.in

**Smart Academic Reminder — Terintegrasi dengan Telegram Bot**

Sebuah web application yang membantu mahasiswa mencatat tugas, memantau deadline, dan menerima pengingat otomatis secara langsung melalui Telegram.

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)](https://reactrouter.com)
[![Telegram](https://img.shields.io/badge/Telegram_Bot-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white)](https://core.telegram.org/bots)

</div>

---

## Tentang Proyek

**Inget.in** adalah aplikasi web monitoring tugas dan deadline akademik yang dirancang khusus untuk mahasiswa. Dengan mengintegrasikan Telegram Bot sebagai antarmuka input, pengguna tidak perlu membuka aplikasi secara manual — cukup mengirim satu perintah ke bot, data akan langsung tersimpan dan ditampilkan di dashboard.

Sistem ini menyelesaikan permasalahan nyata yang dihadapi mahasiswa: lupa deadline, tidak terpantaunya tugas yang menumpuk, dan minimnya sistem pengingat yang konsisten.

### Fitur Utama

- **Input via Telegram** — Tambah tugas baru hanya dengan mengirim perintah ke bot, tanpa perlu membuka dashboard
- **Dashboard Real-time** — Tampilkan seluruh tugas, status, dan countdown menuju deadline dalam satu halaman
- **Reminder Otomatis** — Notifikasi dikirim ke Telegram pada H-3, H-1, dan H-0 sebelum deadline
- **Statistik Produktivitas** — Visualisasi data penyelesaian tugas dalam bentuk chart interaktif
- **Filter & Manajemen** — Saring tugas berdasarkan status, mata kuliah, atau pencarian teks bebas
- **Persistensi Data** — Data tersimpan di localStorage untuk penggunaan offline tanpa perlu backend

---

## Tech Stack

### Frontend

| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| [![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black&style=flat-square)](https://react.dev) **React** | 19.x | Library UI utama berbasis komponen |
| [![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white&style=flat-square)](https://vitejs.dev) **Vite** | 7.x | Build tool dan dev server ultra-cepat |
| [![React Router](https://img.shields.io/badge/React_Router-CA4245?logo=react-router&logoColor=white&style=flat-square)](https://reactrouter.com) **React Router DOM** | 7.x | Client-side routing antar halaman |
| [![JavaScript](https://img.shields.io/badge/JavaScript_ES2023-F7DF1E?logo=javascript&logoColor=black&style=flat-square)](https://tc39.es) **JavaScript ES2023** | — | Bahasa pemrograman utama |
| [![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white&style=flat-square)](https://developer.mozilla.org/en-US/docs/Web/CSS) **Vanilla CSS** | — | Styling dengan custom design system |
| [![Google Fonts](https://img.shields.io/badge/Inter_Font-4285F4?logo=google-fonts&logoColor=white&style=flat-square)](https://fonts.google.com/specimen/Inter) **Inter** | — | Tipografi modern dan bersih |

### Integrasi & Bot

| Teknologi | Fungsi |
|-----------|--------|
| [![Telegram](https://img.shields.io/badge/Telegram_Bot_API-2CA5E0?logo=telegram&logoColor=white&style=flat-square)](https://core.telegram.org/bots/api) **Telegram Bot API** | Input tugas via chat dan pengiriman reminder otomatis |
| **node-telegram-bot-api** | Library Node.js untuk mengelola logika bot Telegram |

### Backend (Roadmap)

| Teknologi | Fungsi |
|-----------|--------|
| [![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white&style=flat-square)](https://nodejs.org) **Node.js** | Runtime backend untuk API server |
| [![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white&style=flat-square)](https://expressjs.com) **Express.js** | REST API endpoint untuk CRUD tugas |
| [![Firebase](https://img.shields.io/badge/Firebase-FFCA28?logo=firebase&logoColor=black&style=flat-square)](https://firebase.google.com) **Firebase / Supabase** | Database cloud gratis untuk penyimpanan data |

---

## Struktur Proyek

```
ingetin-app/
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx                      # Router utama aplikasi
│   ├── main.jsx                     # Entry point React
│   ├── index.css                    # Design system & global styles
│   ├── context/
│   │   └── TaskContext.jsx          # State management global (localStorage)
│   ├── data/
│   │   └── mockData.js              # Data contoh tugas akademik
│   ├── components/
│   │   ├── Icons.jsx                # Kumpulan SVG icon custom
│   │   ├── Layout.jsx / .css        # Wrapper halaman dengan Header
│   │   ├── Sidebar.jsx / .css       # Navigasi samping
│   │   └── AddTaskModal.jsx / .css  # Modal form tambah tugas
│   └── pages/
│       ├── Landing.jsx / .css       # Halaman publik / beranda
│       ├── Dashboard.jsx / .css     # Dashboard utama & statistik
│       ├── Tasks.jsx / .css         # Daftar & manajemen tugas
│       ├── Reminders.jsx / .css     # Timeline reminder Telegram
│       └── Settings.jsx / .css     # Konfigurasi bot & akun
├── index.html
├── vite.config.js
└── package.json
```

---

## Cara Menjalankan Aplikasi

### Prasyarat

Pastikan sudah terinstall:
- [Node.js](https://nodejs.org) versi 18 atau lebih baru
- npm (sudah termasuk dalam Node.js)
- Git

### Instalasi

```bash
# 1. Clone repository
git clone https://github.com/Codift05/ingetin-app.git

# 2. Masuk ke direktori proyek
cd ingetin-app

# 3. Install semua dependensi
npm install

# 4. Jalankan development server
npm run dev
```

Aplikasi akan tersedia di `http://localhost:5173/`

### Build untuk Produksi

```bash
npm run build
```

Output akan tersedia di folder `dist/` dan siap untuk di-deploy ke Vercel, Netlify, atau GitHub Pages.

---

## Alur Sistem

```
Pengguna
   │
   ├── via Telegram Bot ──────────▶ API Backend ──────▶ Database Cloud
   │   /tugas IMK deadline 25 Mar                          │
   │                                                       │
   └── via Dashboard Web ◀─────────────────────────────────┘
       (real-time sync)
                │
                └── Reminder Bot ──▶ Telegram Pengguna
                    (H-3, H-1, H-0)
```

### Perintah Telegram Bot

| Perintah | Format | Keterangan |
|----------|--------|------------|
| `/start` | `/start` | Mulai bot dan dapatkan Chat ID |
| `/tugas` | `/tugas [MK] deadline [tanggal] [jam]` | Tambah tugas baru |
| `/daftar` | `/daftar` | Lihat semua tugas yang aktif |
| `/selesai` | `/selesai [ID]` | Tandai tugas sebagai selesai |
| `/hapus` | `/hapus [ID]` | Hapus tugas dari daftar |

**Contoh penggunaan:**

```
/tugas IMK deadline 25 Maret 23:59
/tugas Basis Data deadline 30 Maret 17:00
```

---

## Skema Reminder Otomatis

| Waktu | Status | Pesan |
|-------|--------|-------|
| H-3 | Pengingat awal | "Deadline [tugas] dalam 3 hari lagi." |
| H-1 | Pengingat mendesak | "Deadline [tugas] besok! Segera selesaikan." |
| H-0 | Peringatan terakhir | "Ini hari terakhir untuk [tugas]. Jangan sampai terlambat!" |

---

## Roadmap Pengembangan

### Tahap 1 — Fondasi (Selesai)
- [x] Setup Vite + React dengan routing
- [x] Design system global (clean, monochrome)
- [x] Dashboard dengan statistik dan countdown
- [x] Halaman manajemen tugas dengan filter
- [x] Timeline reminder visual
- [x] Settings integrasi Telegram

### Tahap 2 — Backend & Bot
- [ ] REST API dengan Express.js
- [ ] Integrasi Telegram Bot aktif
- [ ] Database cloud (Firebase / Supabase)
- [ ] Sistem cron job reminder H-3, H-1, H-0

### Tahap 3 — Fitur Lanjutan
- [ ] Autentikasi pengguna
- [ ] Multi-user support
- [ ] Push notification browser
- [ ] Export data tugas ke PDF / CSV

---

## Analisis Kelayakan

| Aspek | Detail |
|-------|--------|
| **Target Pengguna** | Mahasiswa aktif Indonesia |
| **Biaya Operasional** | Rp0 (menggunakan free tier semua layanan) |
| **Stack Hosting** | Vercel / Netlify (gratis) |
| **Database** | Firebase Spark Plan (gratis) |
| **Bot** | Telegram Bot API (gratis selamanya) |
| **Kapasitas** | Cukup untuk ribuan pengguna awal |

---

## Lisensi

Proyek ini bersifat open source di bawah lisensi [MIT](LICENSE).

---

<div align="center">

Dibuat untuk mahasiswa Indonesia oleh **Codift05**

</div>
