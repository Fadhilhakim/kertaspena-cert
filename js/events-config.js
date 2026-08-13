window.EVENTS = {
  'membaca-nyaring': {
    label: 'Pelatihan Membaca Nyaring',
    date: '22 Agustus 2026',
    code: 'MN',
    monthRoman: 'VIII',
    data: '../data/membaca-nyaring.json',
    background: '../assets/background/bg-membaca.png',
    descriptionPrefix: 'Telah mengikuti',
    location: 'Sekretariat TBM Kertas Pena Campagaya',
  },
  'resensi-buku': {
    label: 'Resensi Buku',
    date: '16 Agustus 2026',
    code: 'RB',
    monthRoman: 'VIII',
    data: '../data/resensi-buku.json',
    background: '../assets/background/bg-resensi.png',
    location: 'Kompleks Ballak Barakkaka RI Galesong - Takalar',
    descriptionPrefix: 'Telah mengikuti',
  },
  'poster-media-sosial': {
    label: 'Pelatihan Pembuatan Poster dan Pengelolaan Media Sosial Komunitas',
    date: '23 Agustus 2026',
    code: 'PMS',
    monthRoman: 'VIII',
    data: '../data/poster-media-sosial.json',
    background: '../assets/background/bg-poster.png',
    descriptionPrefix: 'Telah mengikuti',
    location: 'Sekretariat TBM Kertas Pena Campagaya',
  },
  'konten-budaya': {
    label: 'Workshop Menulis Konten Budaya Lokal',
    date: '15 Agustus 2026',
    code: 'KBL',
    monthRoman: 'VIII',
    data: '../data/konten-budaya.json',
    background: '../assets/background/bg-konten.png',
    descriptionPrefix: 'Telah mengikuti',
    location: 'Kompleks Ballak Barakkaka RI Galesong - Takalar',
  },
};

window.getEventBySlug = function getEventBySlug(slug) {
  return window.EVENTS[slug] || null;
};

window.MONTH_ROMAN = {
  1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V', 6: 'VI',
  7: 'VII', 8: 'VIII', 9: 'IX', 10: 'X', 11: 'XI', 12: 'XII',
};
