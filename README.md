# Sertifikat Otomatis — KERTAS PENA

Aplikasi web self-service untuk pembagian sertifikat peserta kegiatan secara otomatis. Peserta memilih kegiatan, mencari nama mereka, lalu sistem menghasilkan sertifikat siap unduh dalam format PDF — tanpa perlu login, tanpa perlu menghubungi panitia.

> Dibuat untuk: **Komunitas Rumah Literasi dan Penulis Indonesia (KERTAS PENA)**

---

## Daftar isi

1. [Ringkasan](#ringkasan)
2. [Tujuan](#tujuan)
3. [Teknologi](#teknologi)
4. [Struktur proyek](#struktur-proyek)
5. [Struktur data](#struktur-data)
6. [Alur & spesifikasi halaman](#alur--spesifikasi-halaman)
7. [Spesifikasi sertifikat](#spesifikasi-sertifikat)
8. [Ekspor PDF](#ekspor-pdf)
9. [Validasi & pesan error](#validasi--pesan-error)
10. [Target performa (UX)](#target-performa-ux)
---

## Ringkasan

Aplikasi ini adalah generator sertifikat mandiri. Peserta:

1. Membuka tautan aplikasi.
2. Memilih kegiatan yang diikuti dari dropdown.
3. Mencari nama mereka (pencarian real-time, sebagian nama, tidak case-sensitive).
4. Memilih nama dari hasil pencarian.
5. Menekan **Buat Sertifikat** → diarahkan ke halaman preview.
6. Menekan **Download Sertifikat** → mengunduh PDF A4 landscape siap cetak.

Tidak ada database, tidak ada login. Semua data peserta disimpan sebagai file JSON statis per kegiatan, dan semua logika berjalan di sisi klien (client-side).

---

## Tujuan

- Mempermudah proses distribusi sertifikat kepada peserta.
- Mengurangi beban kerja panitia.
- Memastikan setiap peserta mendapat sertifikat dengan data yang sesuai.
- Tampilan sertifikat konsisten di semua perangkat (ukuran tetap, tidak responsif).
- Peserta dapat mengunduh sertifikat langsung sebagai PDF berkualitas cetak.

---

## Teknologi

| Lapisan | Pilihan |
|---|---|
| Struktur & style | HTML5, CSS3 |
| Logika | JavaScript (vanilla, tanpa framework) |
| Data | File JSON statis, satu file per kegiatan |
| Render sertifikat → gambar | [html2canvas](https://github.com/niklasvh/html2canvas) |
| Gambar → PDF | [jsPDF](https://github.com/parallax/jsPDF) |
| Database | **Tidak ada** |
| Autentikasi | **Tidak ada** |
| Hosting | Static hosting: GitHub Pages, Vercel, Netlify, atau shared hosting biasa |

Boleh menggunakan framework ringan (mis. Vite untuk bundling) asalkan hasil akhirnya tetap bisa di-deploy sebagai situs statis tanpa server backend.

---

## Struktur proyek

```
/
├── index.html                  # Landing page (pilih kegiatan)
├── search/
│   └── search.html             # Halaman pencarian peserta
├── sertifikat/
│   └── sertifikat.html         # Halaman preview & download sertifikat
├── data/
│   ├── membaca-nyaring.json
│   ├── resensi-buku.json
│   ├── poster-media-sosial.json
│   └── konten-budaya.json
├── assets/
│   ├── background/
│   │   ├── bg-membaca.png
│   │   ├── bg-resensi.png
│   │   ├── bg-poster.png
│   │   └── bg-konten.png
│   ├── ttd/
│   │   └── ttd.png             # Tanda tangan, PNG transparan
│   └── logo/
│       └── logo.png
├── css/
│   └── style.css
└── js/
    ├── landing.js
    ├── search.js
    └── sertifikat.js
```

---

## Struktur data

Setiap kegiatan punya file JSON sendiri berisi array peserta.

**Skema per peserta:**

```json
{
  "nomor": "001",
  "nama": "Rahmawati",
  "utusan": "SMPN 1 Mangarabombang"
}
```

**Contoh file `data/membaca-nyaring.json`:**

```json
[
  { "nomor": "001", "nama": "Rahmawati", "utusan": "SMPN 1 Mangarabombang" },
  { "nomor": "002", "nama": "Abdul Rahman", "utusan": "Komunitas Literasi Takalar" },
  { "nomor": "003", "nama": "Rahmat Hidayat", "utusan": "SMAN 2 Takalar" }
]
```

**Daftar kegiatan** (dipetakan ke file JSON dan background masing-masing):

| Kegiatan | Tanggal | File data | Background |
|---|---|---|---|
| Pelatihan Membaca Nyaring | 22 Agustus 2026 | `membaca-nyaring.json` | `bg-membaca.png` |
| Resensi Buku | 16 Agustus 2026 | `resensi-buku.json` | `bg-resensi.png` |
| Pelatihan Pembuatan Poster dan Pengelolaan Media Sosial Komunitas | 23 Agustus 2026 | `poster-media-sosial.json` | `bg-poster.png` |
| Workshop Menulis Konten Budaya Lokal | 15 Agustus 2026 | `konten-budaya.json` | `bg-konten.png` |

Idealnya mapping ini disimpan sebagai satu objek konfigurasi terpusat (mis. `js/events-config.js`) supaya mudah menambah kegiatan baru tanpa mengubah banyak file.

---

## Alur & spesifikasi halaman

### 1. Landing page (`index.html`)

Komponen:
- Logo penyelenggara
- Judul aplikasi
- Deskripsi singkat
- Dropdown pilihan kegiatan (wajib dipilih)
- Tombol **Lanjut** (nonaktif sampai kegiatan dipilih)

Gaya visual: bersih, modern, dominan putih, aksen warna identitas KERTAS PENA.

Saat **Lanjut** ditekan → arahkan ke `search.html` dengan parameter kegiatan, mis. `?event=membaca-nyaring`.

### 2. Halaman pencarian peserta (`search/search.html`)

Komponen:
- Nama kegiatan yang dipilih (ditampilkan sebagai konteks)
- Input pencarian (placeholder: "Nama Peserta")
- Daftar hasil pencarian (list yang bisa diklik)

Mekanisme pencarian:
- Real-time terhadap file JSON kegiatan yang dipilih (filter saat mengetik, tanpa perlu tombol submit)
- Tidak case-sensitive
- Mendukung pencocokan sebagian nama (substring match), bukan hanya prefix
- Tetap cepat walau data berisi ratusan peserta (gunakan filter array sederhana di memori — JSON di-load sekali di awal, tidak fetch ulang tiap ketikan)

Setelah nama diklik:
- Tampilkan konfirmasi data (Nama, Utusan)
- Tampilkan tombol **Buat Sertifikat**

Saat **Buat Sertifikat** ditekan → arahkan ke `sertifikat.html` dengan parameter, mis.:
`/sertifikat/sertifikat.html?event=membaca-nyaring&id=001`

### 3. Halaman preview sertifikat (`sertifikat/sertifikat.html`)

Membaca parameter URL (`event`, `id`), mengambil data peserta dari JSON kegiatan terkait, lalu merender sertifikat secara otomatis.

Tata letak halaman:
- Sertifikat berada di tengah halaman
- Background halaman: abu-abu muda
- Sertifikat memiliki bayangan (box-shadow) tipis agar terlihat seperti kertas
- Tampilan menyerupai hasil cetak

Di bawah preview: tombol **Download Sertifikat**.

---

## Spesifikasi sertifikat

### Ukuran

- A4 landscape: 297 mm × 210 mm
- Ukuran render tetap (fixed), **tidak responsif**, rasio selalu A4 landscape di semua perangkat.
- Ukuran dasar dalam CSS:

```css
.sertifikat {
  width: 1123px;
  height: 794px;
  position: relative;
}
```

### Background

Satu gambar background berbeda per kegiatan, memenuhi seluruh area sertifikat (`background-size: cover` atau elemen `<img>` full-size sebagai layer paling belakang).

### Elemen (semua menggunakan `position: absolute` pada koordinat tetap terhadap `.sertifikat`)

| Elemen | Posisi | Detail |
|---|---|---|
| Nomor sertifikat | Bagian atas | Format: `Nomor: 001/KP/VIII/2026` — dibentuk dari `nomor` peserta + kode kegiatan + bulan romawi + tahun |
| Judul | Atas, di bawah nomor | Contoh: **SERTIFIKAT** |
| Nama peserta | Tengah, elemen paling dominan | Font besar, bold, center-aligned. Contoh: **RAHMAWATI** |
| Utusan | Di bawah nama | Label "Utusan" + nilai dari data JSON. Contoh: SMPN 1 Mangarabombang |
| Deskripsi kegiatan | Di bawah utusan | Teks berbeda per kegiatan, contoh: "Telah mengikuti **Pelatihan Membaca Nyaring** yang diselenggarakan oleh Komunitas Rumah Literasi dan Penulis Indonesia (KERTAS PENA) pada tanggal **22 Agustus 2026**" |
| Tanda tangan | Bagian bawah | PNG transparan (`ttd.png`) + nama penanggung jawab + jabatan (mis. "Ketua Penyelenggara") |

Karena semua koordinat tetap (absolute + px), tidak ada perubahan layout berdasarkan ukuran layar — sertifikat selalu terlihat identik, layar HP maupun desktop hanya mengubah skala tampilan (mis. lewat `transform: scale()` pada container pembungkus), bukan struktur elemen di dalamnya.

---

## Ekspor PDF

Alur teknis: **HTML sertifikat → render ke canvas (html2canvas) → export ke PDF (jsPDF)**.

Ketentuan hasil PDF:
- Ukuran halaman A4 landscape
- Resolusi tinggi — gunakan `scale` html2canvas (mis. 2–3x) sebelum dimasukkan ke jsPDF agar tidak pecah saat dicetak
- Background ikut tercetak
- PNG tanda tangan tetap transparan (bukan berlatar putih)
- Nama file unduhan disarankan: `sertifikat-{nama-peserta}-{kegiatan}.pdf`

Contoh kerangka kode:

```js
const canvas = await html2canvas(document.querySelector('.sertifikat'), {
  scale: 3,
  useCORS: true
});
const imgData = canvas.toDataURL('image/png');
const pdf = new jspdf.jsPDF({
  orientation: 'landscape',
  unit: 'mm',
  format: 'a4'
});
pdf.addImage(imgData, 'PNG', 0, 0, 297, 210);
pdf.save(`sertifikat-${nama}-${event}.pdf`);
```

---

## Validasi & pesan error

Sistem harus memastikan sebelum melanjutkan ke halaman berikutnya:
- Kegiatan sudah dipilih (di landing page)
- Nama peserta sudah dipilih (di search page)
- Data peserta ditemukan (di halaman sertifikat, saat membaca parameter `event` & `id`)

Jika nama/ID tidak ditemukan pada kegiatan yang dipilih, tampilkan pesan:

> **"Nama peserta tidak ditemukan pada kegiatan yang dipilih."**

Tampilkan pesan ini di halaman terkait (bukan alert browser), dengan opsi untuk kembali ke pencarian.

---

## Target performa (UX)

| Tahap | Target waktu |
|---|---|
| Memilih kegiatan | < 5 detik |
| Mencari nama | < 10 detik |
| Generate sertifikat (render preview) | < 3 detik |
| Download PDF | < 5 detik |
| **Total (buka link → unduh PDF)** | **< 30 detik** |

---
