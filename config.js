/* ==========================================================
   CONFIG.JS  -  SEMUA DATA UNDANGAN DIGANTI DI SINI
   Cukup edit nilai di antara tanda kutip. Tidak perlu
   menyentuh index.html / script.js.
   ========================================================== */
window.INVITATION = {

  /* ---------- MEMPELAI ---------- */
  groom: {
    fullName: "Moch. Reza",
    nickname: "Reza",
    father:   "H. Samsul Arifin",
    mother:   "Hj. Ida Sita Ilusi",
    order:    "Putra pertama dari",
    instagram: "",                     // kosong = tidak ditampilkan
    photo: "assets/photos/groom.jpg"
  },
  bride: {
    fullName: "Khonsa Azzahrah Tsalatsa Firdauzi",
    nickname: "Khonsa",
    father:   "Ir. Mulawi",
    mother:   "Siti Sinarwati",
    order:    "Putri ketiga dari",
    instagram: "",
    photo: "assets/photos/bride.jpg"
  },

  /* ---------- ACARA ---------- */
  // Format tanggal: "YYYY-MM-DDTHH:MM:SS+07:00"  (+07:00 = WIB, +08:00 = WITA, +09:00 = WIT)
  // highlight: true  -> acara ini ditampilkan lebih menonjol.
  // Hitung mundur dan tombol "Save the Date" memakai acara dengan countdown: true.
  events: [
    {
      title: "Akad Nikah",
      start: "2026-12-03T13:00:00+07:00",
      end:   "2026-12-03T15:00:00+07:00",
      timeLabel: "Pukul 13.00 WIB",
      note: ""
    },
    {
      title: "Resepsi",
      start: "2026-12-03T18:00:00+07:00",
      end:   "2026-12-03T21:00:00+07:00",
      timeLabel: "Pukul 18.00 - 21.00 WIB",
      highlight: true,
      countdown: true,
      badge: "Kami Menantikan Kehadiran Anda",
      note: ""
    }
  ],

  venue: {
    name: "Rumah Mempelai Wanita",
    address: "Jl. Slamet Riyadi Gang 5 No. 3, Patrang, Jember",
    // Opsional: tempel link Google Maps dari tombol Share (lebih akurat). Kosongkan "" untuk otomatis dari alamat.
    mapsUrl: "https://maps.app.goo.gl/k14j9Jbv5XS844Hw6",
    // Titik peta kecil (latitude,longitude) dari link Maps di atas. Kosongkan "" untuk mencari dari alamat.
    coords: "-8.1500723,113.7218373"
  },

  /* ---------- TEKS ---------- */
  eventTitle: "Resepsi Pernikahan Khonsa & Reza",       // judul di Google Calendar
  eventDescription: "Kami mengundang Anda untuk hadir dan memberikan doa restu pada hari bahagia kami.",
  verse: {
    text: "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.",
    source: "(Q.S. Ar-Rum : 21)"
  },
  openingText: "Tanpa Mengurangi Rasa Hormat. Kami Bermaksud Mengundang Bapak/Ibu/Saudara/i, Pada Acara Pernikahan Kami",
  closingText: "Merupakan kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.",

  /* ---------- HADIAH ---------- */
  gift: {
    title: "Wanna give us some gifts?",
    intro: "Kehadiran dan doa Anda sudah menjadi hadiah terindah bagi kami. Namun jika ingin memberikan tanda kasih, dapat melalui rekening berikut atau dikirim ke alamat rumah mempelai wanita:",
    accounts: [
      { label: "Bank BCA",  number: "0241563404",   name: "Khonsa Azzahrah" },
      { label: "ShopeePay", number: "085235597337", name: "Khonsa Azzahrah" }
    ],
    // Kosongkan deliveryAddress ("") jika tidak menerima kado fisik; kartunya otomatis disembunyikan.
    deliveryName: "Rumah Mempelai Wanita",
    deliveryAddress: "Jl. Slamet Riyadi Gang 5 No. 3, Patrang, Jember",
    deliveryMapsUrl: "https://maps.app.goo.gl/k14j9Jbv5XS844Hw6"
  },

  /* ---------- MEDIA ---------- */
  // Foto mempelai (groom.photo & bride.photo di atas) dipakai untuk cover dan bagian mempelai.
  coverPhoto: "assets/photos/gallery-5.jpg",   // foto cover (satu foto penuh)
  eventPhoto: "assets/photos/gallery-6.jpg",   // foto latar bagian acara. Kosong = pakai foto mempelai wanita
  gallery: [               // foto yang filenya belum ada otomatis disembunyikan
    "assets/photos/gallery-1.jpg",
    "assets/photos/gallery-2.jpg",
    "assets/photos/gallery-3.jpg",
    "assets/photos/gallery-4.jpg",
    "assets/photos/gallery-5.jpg",
    "assets/photos/gallery-6.jpg"
  ],
  video: "",                                       // contoh: "assets/video/prewed.mp4" (kosongkan jika tidak ada)
  music: "assets/music/song.mp3",                  // kosongkan "" jika tidak ada musik

  /* ---------- RSVP (Google Apps Script) ---------- */
  // Tempel URL Web App dari Apps Script di sini (lihat README.md langkah 2).
  // Selama masih kosong, form berjalan dalam mode DEMO (data tidak tersimpan).
  appsScriptUrl: "",

  maxGuests: 5,                 // maksimal jumlah tamu per RSVP
  wishesRefreshSeconds: 20      // jeda otomatis muat ulang ucapan (detik)
};
