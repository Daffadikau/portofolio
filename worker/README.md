Situs ini statis di GitHub Pages. Kunci API **tidak boleh** ditaruh di kode
browser — siapa pun bisa membacanya lewat devtools dan memakai kuotanya.
Worker kecil ini yang memegang kuncinya; browser cuma bicara ke worker.
Tanpa worker, situs tetap jalan: Smoky memakai jawaban kata kunci di
`js/data.js`. Worker cuma membuat jawabannya jadi nyambung.
```
npm install -g wrangler
wrangler login
```
```
cd worker
wrangler init smoky-chat --no-git --yes
```
Timpa `src/index.js` hasil init dengan isi `smoky-worker.js` di folder ini.
Pakai **salah satu** penyedia. Kalau dua-duanya diisi, Gemini yang dipakai.
```
wrangler secret put GEMINI_API_KEY       # dari aistudio.google.com/apikey
wrangler secret put ANTHROPIC_API_KEY    # dari console.anthropic.com
```
Lalu di `wrangler.toml`:
```toml
[vars]
ALLOWED_ORIGINS = "https://daffadikau.github.io,http://127.0.0.1:8899"
```
`ALLOWED_ORIGINS` itu pagar utamanya: tanpa itu endpointmu bisa dipakai orang
lain sebagai LLM gratis atas tagihanmu.
```
wrangler deploy
```
Salin URL-nya, lalu isikan ke `js/data.js`:
```js
api: { url: 'https://smoky-chat.<akunmu>.workers.dev' },
```
Basis pengetahuan Smoky ditanam di dalam worker, bukan dikirim dari browser —
supaya endpoint-nya tidak bisa disuruh membahas hal lain. Jadi setiap kali
proyek/pengalaman/penghargaan di `js/data.js` berubah:
```
node tools/build-kb.mjs
cd worker && wrangler deploy
```
- **Asal permintaan** dibatasi `ALLOWED_ORIGINS`.
- **Panjang pesan** dipotong 400 karakter, riwayat dibatasi 8 pesan terakhir.
- **Jawaban** dibatasi 200 token keluaran.
- **Peran Smoky** ditulis di server, jadi pengunjung tidak bisa menggantinya
  lewat pesan.
- **Kegagalan apa pun** (kuota habis, jaringan, penyedia mati) membuat browser
  jatuh ke jawaban kata kunci — jendela obrolannya tidak pernah kosong.
Gemini Flash punya kuota gratis harian yang lebih dari cukup untuk portofolio.
Cloudflare Workers gratis sampai 100.000 permintaan/hari. Tetap pasang batas
pemakaian di dasbor penyedianya kalau khawatir.
