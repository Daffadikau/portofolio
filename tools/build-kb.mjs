// Menyusun ulang basis pengetahuan Smoky dari js/data.js lalu menuliskannya
// ke worker/smoky-worker.js di antara penanda KB.
//
//   node tools/build-kb.mjs
//
// Jalankan tiap kali js/data.js berubah, lalu deploy ulang worker-nya.
// Basis pengetahuannya sengaja ada di worker (bukan dikirim dari browser)
// supaya endpoint-nya tidak bisa dipakai orang lain sebagai LLM umum.
import { readFileSync, writeFileSync } from 'node:fs';
const src = readFileSync(new URL('../js/data.js', import.meta.url), 'utf8');
const sandbox = { window: {} };
new Function('window', src)(sandbox.window);
const D = sandbox.window.PORTFOLIO_DATA;
const L = [];
L.push(`NAMA: ${D.fullName} (dipanggil ${D.name})`);
L.push(`PERAN: ${D.role}`);
L.push(`LOKASI: ${D.location}`);
L.push(`STATUS: ${D.status} — ${D.availability || ''}`.trim());
L.push(`RINGKASAN: ${D.bio}`);
L.push(`PENDIDIKAN: ${D.education.program}, ${D.education.school}. ${D.education.detail}`);
L.push('');
L.push('PENGALAMAN:');
D.experience.forEach((x) => {
  L.push(`- ${x.role} di ${x.org} (${x.period})`);
  x.points.forEach((p) => L.push(`  · ${p}`));
});
L.push('');
L.push('PROYEK:');
D.projects.forEach((p) => {
  L.push(`- ${p.title}: ${p.desc}`);
  if (p.tech?.length) L.push(`  teknologi: ${p.tech.map((t) => t.label).join(', ')}`);
  p.links?.forEach((l) => L.push(`  ${l.label}: ${l.url}`));
});
L.push('');
L.push('KEAHLIAN:');
D.skills.forEach((g) => L.push(`- ${g.group}: ${g.items.map((s) => s.label).join(', ')}`));
L.push('');
L.push('PENGHARGAAN:');
D.awards.forEach((a) => L.push(`- ${a.title} — ${a.org}, ${a.when}`));
L.push('');
L.push(`KONTAK: email ${D.socials.email}; GitHub ${D.socials.github}; LinkedIn ${D.socials.linkedin}`);
L.push(`CV: tombol unduh PDF ada di bagian paling bawah tab About.`);
L.push(`MUSIK: playlist ${D.musicPlaylist}, pemutar Spotify ada di dock.`);
L.push('');
L.push('TENTANG SMOKY (dirimu) — ini latar belakangmu, boleh dipakai bebas:');
const c = D.character?.partner || {};
L.push(`- ${c.species || 'kucing hitam'}, nama Smoky, ${c.japanese || 'kuroneko-san'}`);
L.push(`- sifat: ${c.personality || 'hot and cold'}; ${c.memento || ''}`.trim());
L.push('- rumahmu denah apartemen empat ruang di tab About; kamu pindah zona sendiri');
L.push('  tiap beberapa detik: dapur (mangkuk makan), ruang kerja (mengawasi commit),');
L.push('  sudut main (kotak mainan dan bola), kamar tidur (kardus)');
L.push('- kardus di kamar tidur milikmu; begitu juga tempat hangat di sebelah laptop');
L.push('- di tab About kamu bisa dicolek, dan di footer kamu duduk di depan kardus');
L.push('- topi dan bajumu bisa diganti pengunjung lewat Settings > Smoky');
L.push('- ada satu topi pesta rahasia yang terbuka lewat urutan tombol lama yang');
L.push('  terkenal; kamu boleh menggoda soal itu tapi jangan sebut urutannya');
L.push('- kamu punya tiga hal yang bisa dilakukan pengunjung padamu: FEED, BRUSH, PLAY');
L.push('- kamu menyaksikan seluruh proses kerja Daffa: begadang, sensor yang berbunyi,');
L.push('  malam sebelum lomba, deploy yang gagal');
L.push('');
L.push('NAVIGASI SITUS (berguna kalau pengunjung bingung):');
L.push('- Tab: About, Projects, Skills, Contact');
L.push('- Dock: Terminal, Spotify, obrolan ini, GitHub, LinkedIn');
L.push('- Terminal punya perintah: help, projects, skills, neofetch, ascii, smoky, sudo hire-me');
L.push('- Tombol perisai di kanan atas memblokir jendela yang muncul otomatis');
L.push('- Wallpaper berubah gelap antara pukul 20.00 dan 05.00');
const kb = L.join('\n');
const wp = new URL('../worker/smoky-worker.js', import.meta.url);
const w = readFileSync(wp, 'utf8');
const A = '/* KB:START */';
const B = '/* KB:END */';
const i = w.indexOf(A);
const j = w.indexOf(B);
if (i === -1 || j === -1) throw new Error('penanda KB tidak ditemukan di worker');
const next = `${w.slice(0, i + A.length)}\nconst KB = ${JSON.stringify(kb)};\n${w.slice(j)}`;
writeFileSync(wp, next);
console.log(`KB diperbarui: ${kb.length} karakter, ${kb.split('\n').length} baris`);
