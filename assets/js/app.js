/* =====================================================================
   Shaaré Tsion — logique du site
   - Récupère les horaires du Chabbat et les zmanim depuis Hebcal
   - Affiche les offices et événements depuis config.js
   - Formulaire d'événement → ouverture d'un e-mail pré-rempli (mailto)
   Aucune modification requise ici pour l'entretien courant : voir config.js
   ===================================================================== */

(function () {
  "use strict";

  const CFG = window.SHUL_CONFIG || {};
  const HEBCAL = CFG.hebcal || { geonameId: 293397, candleMinutes: 18 };

  /* ---------- Utilitaires ------------------------------------------- */

  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // Formate une chaîne ISO en heure locale « HH:MM » (fuseau de la date incluse).
  function formatTime(iso) {
    if (!iso) return "—";
    // Les ISO Hebcal contiennent déjà le décalage (+03:00). On extrait HH:MM.
    const m = String(iso).match(/T(\d{2}):(\d{2})/);
    return m ? `${m[1]}:${m[2]}` : "—";
  }

  // Formate une date ISO (AAAA-MM-JJ ou complète) en français : « samedi 8 août ».
  function formatFrenchDate(iso) {
    if (!iso) return "";
    const datePart = String(iso).slice(0, 10);
    const [y, mo, d] = datePart.split("-").map(Number);
    if (!y) return "";
    const dt = new Date(Date.UTC(y, mo - 1, d, 12, 0, 0));
    return dt.toLocaleDateString("fr-FR", {
      weekday: "long", day: "numeric", month: "long", timeZone: "UTC",
    });
  }

  function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

  /* ---------- Remplissage des textes de configuration --------------- */

  function applyConfigText() {
    $$("[data-config]").forEach((el) => {
      const key = el.getAttribute("data-config");
      if (CFG[key] != null && CFG[key] !== "") el.textContent = CFG[key];
    });
    const yr = $("#year");
    if (yr) yr.textContent = String(new Date().getFullYear());

    // Le Rav
    const rav = CFG.rav || {};
    const setText = (sel, val) => { const el = $(sel); if (el && val) el.textContent = val; };
    setText("#rav-name", rav.nom);
    setText("#rav-title", rav.titre);
    setText("#rav-role", rav.fonction);
    const word = $("#rav-word");
    if (word && rav.mot) { word.textContent = "« " + rav.mot + " »"; word.hidden = false; }

    // Photo du Rav (repli sur l'emblème si absente / introuvable)
    const ravPhoto = $("#rav-photo");
    const ravEmblem = $("#rav-emblem");
    if (ravPhoto) {
      if (rav.photo) {
        if (ravEmblem) ravEmblem.hidden = true;
        ravPhoto.addEventListener("error", () => {
          ravPhoto.hidden = true;
          if (ravEmblem) ravEmblem.hidden = false;
        });
        ravPhoto.src = rav.photo;
      } else {
        ravPhoto.hidden = true;   // pas de photo → on garde l'emblème
      }
    }

    // Instagram (accepte un pseudo « shaare.tsion » ou un lien complet)
    if (CFG.instagram) {
      const raw = String(CFG.instagram).trim();
      const url = /^https?:\/\//i.test(raw)
        ? raw
        : "https://www.instagram.com/" + raw.replace(/^@/, "");
      const link = $("#instagram-link");
      if (link) { link.href = url; link.hidden = false; }
    }

    // Groupe WhatsApp
    if (CFG.whatsapp) {
      const wl = $("#whatsapp-link");
      if (wl) { wl.href = String(CFG.whatsapp).trim(); wl.hidden = false; }
    }

    // Faire un don
    if (CFG.donationUrl) {
      const btn = $("#donate-btn");
      if (btn) btn.href = CFG.donationUrl;
      const sec = $("#don"); if (sec) sec.hidden = false;
      $$('[data-nav="don"]').forEach((a) => (a.hidden = false));
    }

    // Coordonnées de contact
    const emailLink = $("#contact-email-link");
    if (emailLink && CFG.contactEmail) {
      emailLink.href = "mailto:" + CFG.contactEmail;
      emailLink.textContent = CFG.contactEmail;
    }
    if (CFG.phone) {
      const line = $("#contact-phone-line");
      const link = $("#contact-phone-link");
      if (line && link) {
        line.hidden = false;
        link.href = "tel:" + CFG.phone.replace(/\s+/g, "");
        link.textContent = CFG.phone;
      }
    }
    const q = encodeURIComponent(CFG.mapQuery || CFG.address || "");
    const wazeUrl = q ? "https://waze.com/ul?q=" + q + "&navigate=yes" : "";
    const gmap = $("#map-google");
    const waze = $("#map-waze");
    if (gmap && q) gmap.href = "https://www.google.com/maps/search/?api=1&query=" + q;
    if (waze && wazeUrl) waze.href = wazeUrl;

    // Pied de page : adresse complète + itinéraire Waze
    const faddr = $("#footer-address");
    if (faddr && (CFG.addressFull || CFG.address)) faddr.textContent = CFG.addressFull || CFG.address;
    const fwaze = $("#footer-waze");
    if (fwaze && wazeUrl) fwaze.href = wazeUrl;

    // Don via BIT (application israélienne) — affiche le numéro à copier
    if (CFG.bitPhone) {
      const bp = $("#bit-phone"); if (bp) bp.textContent = CFG.bitPhone;
      const bb = $("#bit-block"); if (bb) bb.hidden = false;
    }
  }

  /* ---------- CHABBAT ----------------------------------------------- */

  async function loadShabbat() {
    const url = `https://www.hebcal.com/shabbat?cfg=json&geonameid=${HEBCAL.geonameId}` +
                `&M=on&b=${HEBCAL.candleMinutes}&lg=fr`;
    const container = $("#shabbat-times");
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      const items = data.items || [];

      const candle   = items.find((i) => i.category === "candles");
      const havdalah = items.find((i) => i.category === "havdalah");
      const parasha  = items.find((i) => i.category === "parashat");

      const pName = $("#parasha-name");
      if (pName) pName.textContent = parasha ? parasha.title.replace(/^(Parashat|Parachah|Paracha)\s+/i, "") : "Chabbat";

      container.innerHTML = "";
      container.appendChild(stimeBlock(
        "Allumage des bougies", "הדלקת נרות",
        candle ? formatTime(candle.date) : "—",
        candle ? capitalize(formatFrenchDate(candle.date)) : ""
      ));
      container.appendChild(stimeBlock(
        "Sortie du Chabbat", "הבדלה",
        havdalah ? formatTime(havdalah.date) : "—",
        havdalah ? capitalize(formatFrenchDate(havdalah.date)) : ""
      ));
    } catch (err) {
      container.innerHTML =
        `<div class="error-box">Impossible de charger les horaires du Chabbat pour le moment.
         Veuillez réessayer plus tard.</div>`;
      console.error("Shabbat load error:", err);
    }
  }

  function stimeBlock(label, hebrew, value, day) {
    const div = document.createElement("div");
    div.className = "stime";
    div.innerHTML =
      `<span class="stime-label">${label}</span>` +
      `<span class="stime-hebrew">${hebrew}</span>` +
      `<span class="stime-value">${value}</span>` +
      (day ? `<span class="stime-day">${day}</span>` : "");
    return div;
  }

  /* ---------- ZMANIM (temps de prière du jour) ---------------------- */

  // Sélection des zmanim les plus utiles, avec libellés FR + hébreu.
  const ZMANIM_VIEW = [
    { key: "alotHaShachar", label: "Aube",                hebrew: "עלות השחר" },
    { key: "misheyakir",    label: "Talith & Téfilines",  hebrew: "משיכיר" },
    { key: "sunrise",       label: "Lever du soleil",     hebrew: "נץ החמה" },
    { key: "sofZmanShma",   label: "Fin du Chéma",        hebrew: "סוף זמן ק״ש" },
    { key: "sofZmanTfilla", label: "Fin de la Amida",     hebrew: "סוף זמן תפילה" },
    { key: "chatzot",       label: "Milieu du jour",      hebrew: "חצות" },
    { key: "minchaGedola",  label: "Min'ha Guedola",      hebrew: "מנחה גדולה" },
    { key: "minchaKetana",  label: "Min'ha Ketana",       hebrew: "מנחה קטנה" },
    { key: "plagHaMincha",  label: "Plag Ha-Min'ha",      hebrew: "פלג המנחה" },
    { key: "sunset",        label: "Coucher du soleil",   hebrew: "שקיעה" },
    { key: "tzeit7083deg",  label: "Sortie des étoiles",  hebrew: "צאת הכוכבים" },
  ];

  async function loadZmanim() {
    const url = `https://www.hebcal.com/zmanim?cfg=json&geonameid=${HEBCAL.geonameId}`;
    const grid = $("#zmanim-grid");
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      const times = data.times || {};

      const dateLabel = $("#zmanim-date");
      if (dateLabel && data.date) {
        dateLabel.textContent = capitalize(formatFrenchDate(data.date));
      }

      grid.innerHTML = "";
      let shown = 0;
      ZMANIM_VIEW.forEach((z) => {
        if (!times[z.key]) return;
        const card = document.createElement("div");
        card.className = "zcard";
        card.innerHTML =
          `<span class="z-label">${z.label}</span>` +
          `<span class="z-hebrew">${z.hebrew}</span>` +
          `<span class="z-time">${formatTime(times[z.key])}</span>`;
        grid.appendChild(card);
        shown++;
      });
      if (!shown) throw new Error("Aucun zman disponible");
    } catch (err) {
      grid.innerHTML =
        `<div class="error-box">Impossible de charger les temps de prière du jour.
         Veuillez réessayer plus tard.</div>`;
      console.error("Zmanim load error:", err);
    }
  }

  /* ---------- OFFICES (minyanim fixes) ------------------------------ */

  function renderMinyanim() {
    const grid = $("#minyan-grid");
    const groups = CFG.minyanim || {};
    grid.innerHTML = "";
    Object.keys(groups).forEach((k) => {
      const g = groups[k];
      if (!g || !g.offices) return;
      const card = document.createElement("div");
      card.className = "minyan-card";
      const rows = g.offices
        .filter((o) => o.heure !== "")
        .map((o) => {
          const isNote = !/^\d{1,2}:\d{2}/.test(o.heure);
          return `<li><span class="m-nom">${o.nom}</span>` +
                 `<span class="m-heure ${isNote ? "m-note" : ""}">${o.heure}</span></li>`;
        })
        .join("");
      card.innerHTML = `<h3>${g.label}</h3><ul class="minyan-list">${rows}</ul>`;
      grid.appendChild(card);
    });
  }

  /* ---------- ÉVÉNEMENTS -------------------------------------------- */

  function renderEvents() {
    const section = $("#evenements");
    const grid = $("#events-grid");
    const list = CFG.evenements || [];
    if (!list.length) { section.hidden = true; return; }
    section.hidden = false;
    grid.innerHTML = list.map((e) => {
      const meta = [e.date, e.heure].filter(Boolean).map((x) => `<span>${x}</span>`).join("");
      return `<article class="event-card">
        <h3>${e.titre || ""}</h3>
        <div class="ev-meta">${meta}</div>
        <p>${e.description || ""}</p>
      </article>`;
    }).join("");
  }

  /* ---------- FORMULAIRE D'ÉVÉNEMENT (mailto) ----------------------- */

  function setupForm() {
    const form = $("#event-form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // Validation simple
      const required = ["name", "email", "message"];
      let ok = true;
      required.forEach((n) => {
        const input = form.elements[n];
        const field = input.closest(".field");
        const valid = input.value.trim() !== "" && input.checkValidity();
        field.classList.toggle("invalid", !valid);
        if (!valid && ok) { input.focus(); ok = false; }
      });
      if (!ok) return;

      const name    = form.elements["name"].value.trim();
      const email   = form.elements["email"].value.trim();
      const phone   = form.elements["phone"] ? form.elements["phone"].value.trim() : "";
      const type    = form.elements["type"].value;
      const date    = form.elements["date"].value;
      const message = form.elements["message"].value.trim();

      const dest    = CFG.contactEmail || "";
      const subject = `Demande d'événement — ${type} (${name})`;
      const bodyLines = [
        `Nom : ${name}`,
        `E-mail : ${email}`,
        phone ? `Téléphone : ${phone}` : null,
        `Type d'événement : ${type}`,
        date ? `Date souhaitée : ${date}` : null,
        "",
        "Message :",
        message,
        "",
        "— Envoyé depuis le site de " + (CFG.name || "la synagogue"),
      ].filter((l) => l !== null);

      const mailto = `mailto:${encodeURIComponent(dest)}` +
        `?subject=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(bodyLines.join("\r\n"))}`;

      window.location.href = mailto;
    });

    // Retire l'état d'erreur dès que l'utilisateur corrige
    $$(".field input, .field textarea", form).forEach((input) => {
      input.addEventListener("input", () => input.closest(".field").classList.remove("invalid"));
    });
  }

  /* ---------- PHOTOS : synagogue & jardin --------------------------- */

  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function renderFeaturePhotos() {
    const wrap = $("#feature-photos");
    const section = $("#synagogue");
    if (!wrap) return;
    const p = CFG.photos || {};
    const items = ["shul", "garden"].map((k) => p[k]).filter((x) => x && x.src);
    if (!items.length) { if (section) section.hidden = true; return; }
    wrap.innerHTML = "";
    items.forEach((photo) => {
      const fig = document.createElement("figure");
      fig.className = "feature-photo";
      fig.innerHTML =
        `<div class="fp-frame"><img alt="${escapeHtml(photo.caption)}" loading="lazy"></div>` +
        (photo.caption ? `<figcaption>${escapeHtml(photo.caption)}</figcaption>` : "");
      const img = fig.querySelector("img");
      img.addEventListener("error", () => fig.classList.add("missing"));
      img.addEventListener("load", () => {
        fig.classList.add("ready");
        img.style.cursor = "zoom-in";
        img.addEventListener("click", () => openLightbox(photo.src, photo.caption));
      });
      img.src = photo.src;
      wrap.appendChild(fig);
    });
  }

  /* ---------- GALERIE ----------------------------------------------- */

  function renderGallery() {
    const grid = $("#gallery-grid");
    const section = $("#galerie");
    if (!grid || !section) return;
    const list = (CFG.gallery || []).filter((g) => g && g.src);
    if (!list.length) { section.hidden = true; return; }
    section.hidden = false;
    $$('[data-nav="galerie"]').forEach((a) => (a.hidden = false));
    grid.innerHTML = "";
    list.forEach((g) => {
      const tile = document.createElement("button");
      tile.type = "button";
      tile.className = "gallery-tile";
      tile.innerHTML = `<img alt="${escapeHtml(g.caption)}" loading="lazy">`;
      const img = tile.querySelector("img");
      img.addEventListener("error", () => tile.remove()); // retire les vignettes cassées
      tile.addEventListener("click", () => openLightbox(g.src, g.caption));
      img.src = g.src;
      grid.appendChild(tile);
    });
  }

  /* ---------- Visionneuse (lightbox) -------------------------------- */

  let lb = null;
  function ensureLightbox() {
    if (lb) return lb;
    lb = document.createElement("div");
    lb.className = "lightbox"; lb.hidden = true;
    lb.innerHTML =
      `<button class="lb-close" aria-label="Fermer">×</button>` +
      `<figure class="lb-figure"><img class="lb-img" alt=""><figcaption class="lb-cap"></figcaption></figure>`;
    lb.addEventListener("click", (e) => {
      if (e.target === lb || e.target.classList.contains("lb-close")) closeLightbox();
    });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });
    document.body.appendChild(lb);
    return lb;
  }
  function openLightbox(src, caption) {
    const el = ensureLightbox();
    el.querySelector(".lb-img").src = src;
    const cap = el.querySelector(".lb-cap");
    cap.textContent = caption || ""; cap.hidden = !caption;
    el.hidden = false; document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    if (!lb) return;
    lb.hidden = true; document.body.style.overflow = "";
  }

  /* ---------- ACTUALITÉS -------------------------------------------- */

  async function renderNews() {
    const section = $("#actualites");
    const grid = $("#news-grid");
    if (!section || !grid) return;
    // Source prioritaire : le fichier géré par le panneau d'admin (Décap).
    // Repli : le tableau « news » de config.js (ouverture locale hors-ligne).
    let list = null;
    try {
      const res = await fetch("assets/data/news.json", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.news)) list = data.news;
      }
    } catch (e) { /* pas de serveur : on garde config.js */ }
    if (!list) list = CFG.news || [];
    list = list.filter((n) => n && (n.titre || n.texte));
    if (!list.length) { section.hidden = true; return; }
    section.hidden = false;
    $$('[data-nav="actualites"]').forEach((a) => (a.hidden = false));
    grid.innerHTML = list.map((n) => {
      const link = n.lien
        ? `<a class="news-link" href="${escapeHtml(n.lien)}" target="_blank" rel="noopener">En savoir plus →</a>`
        : "";
      return `<article class="news-card">
        ${n.date ? `<div class="news-date">${escapeHtml(n.date)}</div>` : ""}
        <h3>${escapeHtml(n.titre || "")}</h3>
        <p>${escapeHtml(n.texte || "")}</p>
        ${link}
      </article>`;
    }).join("");
  }

  /* ---------- Don BIT : copier le numéro ---------------------------- */

  function setupBit() {
    const btn = $("#bit-copy");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const num = String(CFG.bitPhone || "").replace(/[^\d+]/g, "");
      // Copie (avec repli si le presse-papiers est bloqué)
      const fallback = () => {
        const t = document.createElement("textarea");
        t.value = num; document.body.appendChild(t); t.select();
        try { document.execCommand("copy"); } catch (_) {}
        t.remove();
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(num).catch(fallback);
      } else {
        fallback();
      }
      const done = $("#bit-copied");
      if (done) {
        done.hidden = false;
        setTimeout(() => { done.hidden = true; }, 2200);
      }
    });
  }

  /* ---------- Menu mobile ------------------------------------------- */

  function setupNav() {
    const toggle = $(".nav-toggle");
    const links = $("#nav-links");
    if (!toggle || !links) return;
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    $$("a", links).forEach((a) =>
      a.addEventListener("click", () => {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  /* ---------- Initialisation ---------------------------------------- */

  document.addEventListener("DOMContentLoaded", () => {
    applyConfigText();
    renderFeaturePhotos();
    renderNews();
    renderMinyanim();
    renderGallery();
    renderEvents();
    setupBit();
    setupForm();
    setupNav();
    loadShabbat();
    loadZmanim();
  });
})();
