Situs ini statis di GitHub Pages. Kunci API **tidak boleh** ditaruh di kode
browser — siapa pun bisa membacanya lewat devtools dan memakai kuotanya.
Worker kecil ini yang memegang kuncinya; browser cuma bicara ke worker.
Tanpa worker, situs tetap jalan: Smoky memakai jawaban kata kunci di
`js/data.js`. Worker cuma membuat jawabannya jadi nyambung.
Folder ini sudah siap deploy — tidak perlu `wrangler init`.
---
Buat kunci di <https://aistudio.google.com/apikey>. Kunci AI Studio yang benar
diawali `AIza...`. Kalau punyamu diawali `AQ.`, itu jenis kunci lain dan akan
ditolak endpoint Gemini — buat yang baru.
Kunci yang pernah kamu tempel di chat, catatan, atau riwayat terminal harus
dianggap bocor. Hapus, lalu buat yang baru.
```
npm install -g wrangler     # lewati kalau sudah ada
wrangler login
```
```
cd worker
wrangler secret put GEMINI_API_KEY
```
Perintah ini akan meminta kuncinya lewat prompt. **Jangan** menulis kunci ke
berkas mana pun di repo ini.
Kalau mau pakai Anthropic, ganti dengan `wrangler secret put ANTHROPIC_API_KEY`.
Kalau dua-duanya terpasang, Gemini yang dipakai.
```
wrangler deploy
```
Catat URL yang muncul, bentuknya `https://smoky-chat.<akunmu>.workers.dev`.
Buka URL worker itu di peramban. Harusnya keluar:
```json
{"ok":true,"provider":"gemini","model":"gemini-2.0-flash","kb":5547,"origins":3}
```
- `provider` masih `none` → secret belum terpasang, ulangi langkah 3
- `kb` bernilai 0 → jalankan `node tools/build-kb.mjs` lalu deploy lagi
Di `js/data.js`, isi URL-nya:
```js
api: { url: 'https://smoky-chat.<akunmu>.workers.dev' },
```
Commit dan push. Setelah GitHub Pages menyegarkan, buka ikon obrolan di dock —
catatan di kaki jendela berubah dari "No AI, no network" menjadi keterangan
bahwa Smoky memakai AI.
---
Basis pengetahuan Smoky ditanam di dalam worker, bukan dikirim dari browser —
supaya endpoint-nya tidak bisa disuruh membahas hal lain. Jadi setiap kali
proyek, pengalaman, atau penghargaan berubah:
```
node tools/build-kb.mjs
cd worker && wrangler deploy
```
| Gejala | Sebab yang paling mungkin |
|---|---|
| Jawaban terasa kaku seperti sebelumnya | `api.url` masih kosong, atau worker balas error sehingga jatuh ke cadangan |
| Muncul "connection to the cat failed" | worker error — cek `wrangler tail` |
| Error 403 di konsol peramban | asal situsmu belum ada di `ALLOWED_ORIGINS` di `wrangler.toml` |
| Error 404 dari Gemini | nama model berubah; ganti `GEMINI_MODEL` di `wrangler.toml` |
| Error 429 | kuota harian habis, tunggu reset |
Lihat log langsung:
```
cd worker && wrangler tail
```
- **Asal permintaan** dibatasi `ALLOWED_ORIGINS`.
- **Panjang pesan** dipotong 400 karakter, riwayat dibatasi 8 pesan terakhir.
- **Jawaban** dibatasi 200 token keluaran.
- **Peran Smoky** ditulis di server, jadi pengunjung tidak bisa menggantinya
  lewat pesan.
- **Kegagalan apa pun** membuat browser jatuh ke jawaban kata kunci — jendela
  obrolannya tidak pernah kosong.
Gemini Flash punya kuota gratis harian yang lebih dari cukup untuk portofolio.
Cloudflare Workers gratis sampai 100.000 permintaan/hari. Tetap pasang batas
pemakaian di dasbor penyedianya kalau khawatir.
