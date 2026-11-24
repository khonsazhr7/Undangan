(function () {
  "use strict";
  var C = window.INVITATION;
  var $ = function (id) { return document.getElementById(id); };

  /* ---------- helpers ---------- */
  function setText(id, t) { var el = $(id); if (el) el.textContent = t || ""; }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function setPhoto(box, src, onFail) {
    if (!box || !src) { if (onFail) onFail(); return; }
    var img = new Image();
    img.alt = "";
    img.decoding = "async";
    img.onload = function () { box.classList.add("has-img"); box.appendChild(img); };
    img.onerror = function () { if (onFail) onFail(); };
    img.src = src; // jika file belum ada, placeholder tetap tampil (galeri: kotak disembunyikan)
  }
  function offsetMinutes(iso) {
    var m = /([+-])(\d{2}):(\d{2})$/.exec(iso);
    return m ? (m[1] === "-" ? -1 : 1) * (parseInt(m[2], 10) * 60 + parseInt(m[3], 10)) : 0;
  }
  // Format tanggal sesuai zona waktu yang tertulis di config (bukan zona HP tamu)
  function fmtDate(iso) {
    var shifted = new Date(new Date(iso).getTime() + offsetMinutes(iso) * 60000);
    return new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(shifted);
  }
  function calStamp(iso) { return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, ""); }

  /* ---------- nama tamu: ?to=Budi+Santoso atau #Budi-Santoso ---------- */
  (function guest() {
    var name = "";
    try {
      name = new URLSearchParams(location.search).get("to") || "";
      if (!name && location.hash.length > 1) name = decodeURIComponent(location.hash.slice(1)).replace(/[-_+]+/g, " ");
    } catch (e) {}
    name = name.trim().slice(0, 60);
    if (name) { setText("guestName", name); var f = $("fName"); if (f) f.value = name; }
  })();

  /* ---------- isi konten dari config ---------- */
  var G = C.groom, B = C.bride;
  document.title = "Undangan " + B.nickname + " & " + G.nickname;
  (function () {
    var h = $("coverNames");
    h.appendChild(el("span", null, B.nickname + " &"));
    h.appendChild(el("span", null, G.nickname));
  })();
  setPhoto($("cvPhoto"), C.coverPhoto);
  // foto latar bagian acara (default: foto mempelai wanita)
  (function () {
    var src = C.eventPhoto || B.photo, probe = new Image();
    probe.onload = function () {
      $("acara").style.backgroundImage = "linear-gradient(180deg, rgba(74,18,32,.88), rgba(36,10,16,.94)), url('" + src + "')";
    };
    probe.src = src;
  })();

  setText("verseText", C.verse.text);
  setText("verseSrc", C.verse.source);
  setText("openingText", C.openingText);

  function person(id, p) {
    var box = $(id);
    var ph = el("div", "photo");
    ph.setAttribute("role", "img");
    ph.setAttribute("aria-label", "Foto " + p.nickname);
    box.appendChild(ph);
    setPhoto(ph, p.photo);
    box.appendChild(el("h2", "caps", p.fullName));
    var child = el("p", "child");
    child.appendChild(document.createTextNode(p.order));
    child.appendChild(document.createElement("br"));
    child.appendChild(document.createTextNode("(Bapak " + p.father + " & Ibu " + p.mother + ")"));
    box.appendChild(child);
    if (p.instagram) {
      var a = el("a", "chip", "@" + p.instagram);
      a.href = "https://instagram.com/" + encodeURIComponent(p.instagram);
      a.target = "_blank"; a.rel = "noopener";
      box.appendChild(a);
    }
  }
  person("bride", B);
  person("groom", G);

  /* ---------- acara, maps, calendar ---------- */
  var main = C.events.filter(function (e) { return e.countdown; })[0] || C.events[0];
  var list = $("eventList");
  C.events.forEach(function (ev, idx) {
    var s = el("div", "slot" + (ev.highlight ? " featured" : ""));
    if (ev.highlight) s.appendChild(el("span", "badge", ev.badge || "Kami Menantikan Kehadiran Anda"));
    s.appendChild(el("h3", "caps", ev.title));
    var w = el("p", "when");
    w.appendChild(document.createTextNode(fmtDate(ev.start)));
    w.appendChild(document.createElement("br"));
    w.appendChild(document.createTextNode(ev.timeLabel));
    s.appendChild(w);
    if (ev.note) s.appendChild(el("p", "slot-note", ev.note));
    list.appendChild(s);
    // hitung mundur ditempatkan di tengah, setelah acara pertama (Akad) dan sebelum acara berikutnya
    if (idx === 0 && C.events.length > 1) list.appendChild($("countdown"));
  });
  if (C.events.length < 2) list.appendChild($("countdown"));

  var q = encodeURIComponent(C.venue.name + ", " + C.venue.address);
  var mapsUrl = C.venue.mapsUrl || ("https://www.google.com/maps/search/?api=1&query=" + q);
  var vl = $("venueLink");
  vl.href = mapsUrl;
  setText("venueName", C.venue.name);
  setText("venueAddress", C.venue.address);
  var iframe = document.createElement("iframe");
  iframe.title = "Peta lokasi acara";
  iframe.loading = "lazy";
  iframe.referrerPolicy = "no-referrer-when-downgrade";
  iframe.src = C.venue.coords
    ? "https://www.google.com/maps?q=" + encodeURIComponent(C.venue.coords) + "&z=17&output=embed"
    : "https://www.google.com/maps?q=" + q + "&output=embed";
  $("mapFrame").appendChild(iframe);

  var cal = "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    "&text=" + encodeURIComponent(C.eventTitle) +
    "&dates=" + calStamp(main.start) + "/" + calStamp(main.end) +
    "&details=" + encodeURIComponent(C.eventDescription + "\n\n" + C.events.map(function (e) { return e.title + ": " + e.timeLabel; }).join("\n")) +
    "&location=" + encodeURIComponent(C.venue.name + ", " + C.venue.address);
  $("saveDate").href = cal;

  /* ---------- hitung mundur ---------- */
  var target = new Date(main.start).getTime();
  var ids = ["cdD", "cdH", "cdM", "cdS"].map($);
  function p2(n) { return String(n).padStart(2, "0"); }
  function tick() {
    var d = Math.max(0, target - Date.now());
    var v = [Math.floor(d / 864e5), Math.floor(d % 864e5 / 36e5), Math.floor(d % 36e5 / 6e4), Math.floor(d % 6e4 / 1e3)];
    ids.forEach(function (n, i) { n.textContent = p2(v[i]); });
  }
  tick(); setInterval(tick, 1000);

  /* ---------- galeri ---------- */
  var grid = $("galleryGrid"), galleryLeft = C.gallery.length;
  function galleryCheck() {
    if (galleryLeft <= 0 && !C.video) $("galeri").hidden = true;
  }
  C.gallery.forEach(function (src, i) {
    var ph = el("div", "photo");
    ph.setAttribute("role", "img");
    ph.setAttribute("aria-label", "Foto galeri " + (i + 1));
    grid.appendChild(ph);
    setPhoto(ph, src, function () { ph.remove(); galleryLeft--; galleryCheck(); });
  });
  if (C.video) {
    var v = $("galleryVideo");
    v.src = C.video; v.hidden = false;
  }

  /* ---------- hadiah ---------- */
  var Gf = C.gift;
  setText("giftTitle", Gf.title);
  setText("giftIntro", Gf.intro);
  function copy(btn, text) {
    btn.addEventListener("click", function () {
      var old = btn.textContent;
      function done() { btn.textContent = "Tersalin"; setTimeout(function () { btn.textContent = old; }, 1600); }
      function fallback() {
        var t = document.createElement("textarea"); t.value = text; t.style.position = "fixed"; t.style.opacity = "0";
        document.body.appendChild(t); t.select();
        try { document.execCommand("copy"); done(); } catch (e) {}
        document.body.removeChild(t);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback);
      else fallback();
    });
  }
  (Gf.accounts || []).forEach(function (a) {
    var card = el("div", "gift-card");
    card.appendChild(el("p", "eyebrow", a.label));
    card.appendChild(el("p", "acc", a.number));
    card.appendChild(el("p", "acc-name", "a.n. " + a.name));
    var b = el("button", "btn small", "Salin nomor");
    b.type = "button";
    card.appendChild(b);
    copy(b, a.number);
    $("giftAccounts").appendChild(card);
  });
  if (Gf.deliveryAddress) {
    $("giftDelivery").hidden = false;
    setText("giftTo", Gf.deliveryName);
    setText("giftAddr", Gf.deliveryAddress);
    copy($("copyAddr"), Gf.deliveryAddress);
    var gm = Gf.deliveryMapsUrl || C.venue.mapsUrl || ("https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(Gf.deliveryAddress));
    var gl = $("giftMap"); gl.href = gm; gl.hidden = false;
  }

  setText("closingText", C.closingText);
  setText("closingNames", B.nickname + " & " + G.nickname);

  /* ---------- buka undangan + musik ---------- */
  var audio = $("bgm"), mbtn = $("musicBtn"), micon = $("musicIcon");
  var PLAY = "M8 5v14l11-7z", PAUSE = "M6 5h4v14H6zM14 5h4v14h-4z";
  function syncMusic() {
    var on = !audio.paused;
    mbtn.classList.toggle("on", on);
    micon.setAttribute("d", on ? PAUSE : PLAY);
  }
  if (C.music) {
    audio.src = C.music;
    mbtn.hidden = false;
    audio.addEventListener("play", syncMusic);
    audio.addEventListener("pause", syncMusic);
    audio.addEventListener("error", function () { mbtn.hidden = true; });
    mbtn.addEventListener("click", function () {
      if (audio.paused) audio.play().catch(function () {}); else audio.pause();
    });
  }
  document.body.classList.add("locked");
  $("openBtn").addEventListener("click", function () {
    document.body.classList.remove("locked");
    if (C.music) audio.play().catch(function () {});
    $("ayat").scrollIntoView({ behavior: "smooth" });
  });

  /* ---------- fade-in saat di-scroll ---------- */
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll(".verse > *, .couple > *, .cd-block > *, .event > *, .gallery > *, .rsvp > *, .wishes > *, .gift > *")
      .forEach(function (n) { n.classList.add("fade"); io.observe(n); });
  }

  /* ---------- RSVP ---------- */
  var sel = $("fCount");
  for (var i = 1; i <= (C.maxGuests || 5); i++) { var o = document.createElement("option"); o.value = o.textContent = String(i); sel.appendChild(o); }
  var form = $("rsvpForm"), note = $("rsvpNote"), sbtn = $("submitBtn");
  form.addEventListener("change", function () {
    var attending = form.elements.attend.value === "Hadir";
    $("countWrap").style.display = attending ? "" : "none";
  });

  function say(t, err) { note.textContent = t; note.classList.toggle("err", !!err); }

  /* ---------- ucapan ---------- */
  var wishList = $("wishList");
  var localWishes = [];
  function timeAgo(ts) {
    var s = Math.max(0, (Date.now() - new Date(ts).getTime()) / 1000);
    if (isNaN(s)) return "";
    if (s < 60) return "baru saja";
    if (s < 3600) return Math.floor(s / 60) + " menit lalu";
    if (s < 86400) return Math.floor(s / 3600) + " jam lalu";
    return Math.floor(s / 86400) + " hari lalu";
  }
  function renderWishes(items) {
    wishList.textContent = "";
    if (!items.length) {
      wishList.appendChild(el("p", "wish-empty", "Belum ada ucapan. Jadilah yang pertama."));
      setText("wishesCount", "");
      return;
    }
    setText("wishesCount", items.length + " ucapan");
    items.forEach(function (w) {
      var card = el("div", "wish");
      var head = el("b", null, w.name);
      head.appendChild(el("span", null, timeAgo(w.time)));
      card.appendChild(head);
      card.appendChild(el("p", null, "“" + w.message + "”"));
      wishList.appendChild(card);
    });
  }
  var remote = [];
  function merged() {
    // ucapan lokal (baru dikirim) ditampilkan dulu sampai muncul dari server
    var seen = {};
    remote.forEach(function (w) { seen[w.name + "|" + w.message] = 1; });
    var extra = localWishes.filter(function (w) { return !seen[w.name + "|" + w.message]; });
    return extra.concat(remote);
  }
  function loadWishes() {
    if (!C.appsScriptUrl) { renderWishes(merged()); return Promise.resolve(); }
    return fetch(C.appsScriptUrl + "?action=wishes&_=" + Date.now())
      .then(function (r) { return r.json(); })
      .then(function (d) { remote = (d && d.wishes) || []; renderWishes(merged()); })
      .catch(function () { renderWishes(merged()); });
  }
  loadWishes();
  if (C.appsScriptUrl) setInterval(function () { if (!document.hidden) loadWishes(); }, (C.wishesRefreshSeconds || 20) * 1000);

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = $("fName").value.trim();
    var attend = form.elements.attend.value;
    var guests = attend === "Hadir" ? parseInt(sel.value, 10) : 0;
    var message = $("fMsg").value.trim();
    if (!name) { say("Isi nama dulu ya.", true); $("fName").focus(); return; }

    var payload = { name: name, attendance: attend, guests: guests, message: message };
    sbtn.disabled = true; say("Mengirim...");

    function ok() {
      say(attend === "Hadir" ? "Terima kasih, konfirmasi kehadiranmu sudah kami terima." : "Terima kasih sudah memberi kabar.");
      if (message) {
        localWishes.unshift({ name: name, message: message, time: new Date().toISOString() });
        renderWishes(merged());
      }
      $("fMsg").value = "";
      sbtn.disabled = false;
      setTimeout(loadWishes, 2500);
    }

    if (!C.appsScriptUrl) { setTimeout(ok, 400); return; } // mode demo

    // text/plain + no-cors: tidak memicu preflight CORS di Apps Script
    fetch(C.appsScriptUrl, {
      method: "POST", mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    }).then(ok, function () { say("Gagal mengirim. Periksa koneksi lalu coba lagi.", true); sbtn.disabled = false; });
  });
})();
