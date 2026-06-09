const ALLOWED_LINK_COLORS = new Set(["green", "white", "blue", "gold", "dark"]);
const DEFAULT_LINK_COLOR = (typeof CONFIG !== 'undefined' && CONFIG.defaults && CONFIG.defaults.linkColor) || "white";
function resolveLinkColor(c) {
  if (!c) return DEFAULT_LINK_COLOR;
  return ALLOWED_LINK_COLORS.has(c) ? c : DEFAULT_LINK_COLOR;
}

document.addEventListener("DOMContentLoaded", () => {
  const byId = (id) => document.getElementById(id);
  const uiSfx = createUISoundSystem();
  window.__uiSfx = uiSfx;

  if (window.marked && typeof window.marked.setOptions === "function") {
    window.marked.setOptions({ gfm: true, breaks: true });
  }

  // Basic rendering
  const logoText = byId("logo-text");
  if (logoText) logoText.textContent = CONFIG.brandText || CONFIG.name;

  const heroTitle = byId("hero-title");
  if (heroTitle) heroTitle.textContent = CONFIG.name;


  const heroSub = byId("hero-sub");
  if (heroSub) heroSub.textContent = CONFIG.subtitle;

  const footerCopy = byId("footer-copy");
  if (footerCopy)
    footerCopy.textContent =
      `© ${new Date().getFullYear()} ${CONFIG.name} — ${CONFIG.FOOTER.tagLine}`;

  const footerGh = byId("footer-gh");
  if (footerGh && CONFIG.github) footerGh.href = CONFIG.github;

  // Stats
  const sr = byId("stats-row");
  if (sr) {
    CONFIG.stats.forEach((s) =>
      sr.insertAdjacentHTML(
        "beforeend",
        `<div class="stat-item"><span class="stat-num">${s.num}</span><span class="stat-label">${s.label}</span></div>`,
      ),
    );
  }

  // Skills
  const skillsWrap = byId("skills-wrap");
  if (skillsWrap) {
    CONFIG.skills.forEach((sk) =>
      skillsWrap.insertAdjacentHTML("beforeend", `<span class="skill-chip">${sk}</span>`),
    );
  }

  // Services
  const servicesGrid = byId("services-grid");
  if (servicesGrid) {
    CONFIG.services.forEach((s) =>
      servicesGrid.insertAdjacentHTML(
        "beforeend",
        `<div class="service-block"><span class="service-icon">${s.icon}</span><div class="service-name">${s.name}</div><p class="service-desc">${s.desc}</p></div>`,
      ),
    );
  }

  // Contact
  const cl = byId("contact-links");
  if (cl && CONFIG.email)
    cl.insertAdjacentHTML(
      "beforeend",
      `<a href="mailto:${CONFIG.email}" class="bb-btn green"><span>Email Us</span></a>`,
    );
  if (cl && CONFIG.github)
    cl.insertAdjacentHTML(
      "beforeend",
      `<a href="${CONFIG.github}" target="_blank" class="bb-btn white"><span>GitHub</span></a>`,
    );
  const discordTag = byId("discord-tag");
  if (discordTag) discordTag.textContent = CONFIG.discord;

  const discordBox = byId("discord-box");
  if (discordBox) discordBox.addEventListener("click", async () => {
    const copyLabel = discordBox.querySelector(".discord-copy");
    if (!copyLabel) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(CONFIG.discord);
      }
      copyLabel.textContent = "Copied";
      setTimeout(() => {
        copyLabel.textContent = "Click to copy";
      }, 1200);
    } catch (e) {
      copyLabel.textContent = "Copy failed";
      setTimeout(() => {
        copyLabel.textContent = "Click to copy";
      }, 1200);
    }
  });

  // Projects
  renderCards(CONFIG.projects, "projects");

  // Selling
  const showStoreSection = CONFIG.featureFlags?.showStoreSection !== false;
  if (showStoreSection) {
    renderCards(CONFIG.currentlySelling, "selling");
  } else {
    hideStoreSection();
  }

  // Wire nav toggle
  const navToggle = byId("nav-toggle");
  const navEl = byId("nav");
  if (navToggle && navEl) {
    navToggle.addEventListener("click", () => navEl.classList.toggle("open"));
  }

  document.querySelectorAll("#nav a").forEach((a) => {
    a.addEventListener("click", () => {
      if (navEl) navEl.classList.remove("open");
    });
  });

  uiSfx.bind(".bb-btn, .card-btn, .discord-box, .gm-close, .gm-nav, #nav-toggle, #nav a, .yt-shell");

  initYoutubeEmbeds();
  initButtonPressStates();

  // Init modals
  initProjectModal();
  initSellingModal();
  initProfileMenu();
  initDetailRouting();
  initHeroCanvas();

  // Reveal hidden elements (they start with class 'reveal')
  setTimeout(() => revealAll(), 80);
});

const DETAIL_ROUTE_STATE = {
  basePath: "/",
  syncing: false,
  projectSlugs: [],
  sellingSlugs: [],
};

function toSlug(input) {
  const slug = String(input || "")
    .trim()
    .replace(/[^A-Za-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "item";
}

function getUniqueSlug(seed, used) {
  const base = toSlug(seed);
  let out = base;
  let n = 2;
  while (used.has(out.toLowerCase())) {
    out = `${base}-${n}`;
    n += 1;
  }
  used.add(out.toLowerCase());
  return out;
}

function rebuildDetailSlugs() {
  const used = new Set();
  DETAIL_ROUTE_STATE.projectSlugs = (CONFIG.projects || []).map((p) =>
    getUniqueSlug(p.slug || p.title, used),
  );
  DETAIL_ROUTE_STATE.sellingSlugs = (CONFIG.currentlySelling || []).map((p) =>
    getUniqueSlug(p.slug || p.id || p.title, used),
  );
}

function buildDetailPath(slug) {
  const encoded = encodeURIComponent(slug);
  return `#/${encoded}`;
}

function setDetailPath(path, replace = false) {
  const targetHash = path.startsWith("#") ? path : `#${path}`;
  if (window.location.hash === targetHash) return;
  if (replace) {
    window.history.replaceState({}, "", `${window.location.pathname}${window.location.search}${targetHash}`);
    return;
  }
  window.location.hash = targetHash;
}

function clearDetailPath(replace = false) {
  if (!window.location.hash) return;
  if (replace) {
    window.history.replaceState({}, "", `${window.location.pathname}${window.location.search}`);
    return;
  }
  window.history.pushState({}, "", `${window.location.pathname}${window.location.search}`);
}

function closeAnyOpenDetailModal() {
  const galleryModal = document.getElementById("gallery-modal");
  const sellingModal = document.getElementById("selling-modal");

  if (galleryModal && galleryModal.classList.contains("open")) {
    const btn = document.getElementById("gm-close");
    if (btn) btn.click();
  }

  if (sellingModal && sellingModal.classList.contains("open")) {
    const btn = document.getElementById("sm-close");
    if (btn) btn.click();
  }
}

function openDetailFromPath() {
  const params = new URLSearchParams(window.location.search || "");
  const queryDetail = (params.get("detail") || "").trim();

  const rawHash = (window.location.hash || "").replace(/^#/, "").trim();
  const hashDetail = rawHash.startsWith("/") ? rawHash.slice(1) : "";

  const path = window.location.pathname || "/";
  const cleaned = path.replace(/\/+$/, "");
  const segment = cleaned.split("/").pop() || "";
  const fromPath = segment && !/^index\.html$/i.test(segment) ? decodeURIComponent(segment) : "";
  const requestedSlug = decodeURIComponent(queryDetail || hashDetail || fromPath).toLowerCase();

  if (!requestedSlug) {
    closeAnyOpenDetailModal();
    return;
  }

  const projectIdx = DETAIL_ROUTE_STATE.projectSlugs.findIndex((s) => s.toLowerCase() === requestedSlug);
  if (projectIdx >= 0 && typeof window.openGallery === "function") {
    closeAnyOpenDetailModal();
    window.openGallery(projectIdx, { skipRouteUpdate: true });
    if (queryDetail || fromPath) {
      setDetailPath(buildDetailPath(DETAIL_ROUTE_STATE.projectSlugs[projectIdx]), true);
    }
    return;
  }

  const showStoreSection = CONFIG.featureFlags?.showStoreSection !== false;
  const sellingIdx = DETAIL_ROUTE_STATE.sellingSlugs.findIndex((s) => s.toLowerCase() === requestedSlug);
  if (showStoreSection && sellingIdx >= 0 && typeof window.openSelling === "function") {
    closeAnyOpenDetailModal();
    window.openSelling(sellingIdx, { skipRouteUpdate: true });
    if (queryDetail || fromPath) {
      setDetailPath(buildDetailPath(DETAIL_ROUTE_STATE.sellingSlugs[sellingIdx]), true);
    }
    return;
  }

  closeAnyOpenDetailModal();
  clearDetailPath(true);
}

function initDetailRouting() {
  rebuildDetailSlugs();

  window.addEventListener("hashchange", () => {
    DETAIL_ROUTE_STATE.syncing = true;
    try {
      openDetailFromPath();
    } finally {
      DETAIL_ROUTE_STATE.syncing = false;
    }
  });

  DETAIL_ROUTE_STATE.syncing = true;
  try {
    openDetailFromPath();
  } finally {
    DETAIL_ROUTE_STATE.syncing = false;
  }
}

function revealAll() {
  const rev = Array.from(document.querySelectorAll(".reveal"));
  rev.forEach((el, i) => setTimeout(() => el.classList.add("in"), i * 40));
}

function createUISoundSystem() {
  const clickAudio = new Audio("sounds/minecraft_click.mp3");
  clickAudio.volume = 0.25;

  function playAudio(a) {
    try {
      a.currentTime = 0;
      a.play();
    } catch (e) {
      // ignore autoplay guard
    }
  }

  function play(kind) {
    return playAudio(clickAudio);
  }

  function bind(selector) {
    document.querySelectorAll(selector).forEach((el) => {
      el.addEventListener("click", () => play("click"));
    });
  }

  return { play, bind };
}

function initButtonPressStates() {
  document.querySelectorAll(".bb-btn").forEach((el) => {
    el.addEventListener("pointerdown", () => el.classList.add("pressed"));
    const clear = () => el.classList.remove("pressed");
    el.addEventListener("pointerup", clear);
    el.addEventListener("pointerleave", clear);
    el.addEventListener("blur", clear);
  });
}

function initYoutubeEmbeds() {
  document.querySelectorAll(".yt-shell").forEach((shell) => {
    const id = shell.getAttribute("data-youtube-id");
    const title = shell.getAttribute("data-youtube-title") || "YouTube video";
    if (!id) return;
    shell.addEventListener("click", () => {
      shell.innerHTML = `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${id}?autoplay=1" title="${title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen loading="lazy"></iframe>`;
    }, { once: true });
  });
}

function normalizeIndent(md) {
  if (!md) return md;
  const lines = md.split("\n");
  // remove leading/trailing blank lines
  while (lines.length && lines[0].trim() === "") lines.shift();
  while (lines.length && lines[lines.length - 1].trim() === "") lines.pop();
  // compute leading whitespace length for all non-empty lines (include zeros)
  const indents = lines.map((l) => {
    if (l.trim() === "") return 0;
    const m = l.match(/^\s*/);
    return m ? m[0].length : 0;
  });
  const minIndent = Math.min(...indents);
  // if there's no common indentation, return as-is (this preserves nested list indents)
  if (!minIndent) return lines.join("\n");
  // remove exactly minIndent characters from the start of each line
  const out = lines.map((l) => (l.length >= minIndent ? l.slice(minIndent) : "")).join("\n");
  return out;
}

// Load markdown content which may be an inline string or a path to a .md file (relative or remote)
async function fetchMarkdown(mdField) {
  if (!mdField) return { text: "", tried: [] };
  if (typeof mdField !== "string") return { text: String(mdField), tried: [] };
  const trimmed = mdField.trim();
  const looksLikePath =
    /\.md(\?.*)?$/i.test(trimmed) && !trimmed.includes("\n");
  if (!looksLikePath || trimmed.includes("\n"))
    return { text: mdField, tried: [] };

  const fetchViaXhr = (url) =>
    new Promise((resolve, reject) => {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onreadystatechange = () => {
          if (xhr.readyState !== 4) return;
          if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 0) {
            resolve(xhr.responseText || "");
          } else {
            reject(new Error(`XHR ${xhr.status}`));
          }
        };
        xhr.onerror = () => reject(new Error("XHR network error"));
        xhr.send();
      } catch (err) {
        reject(err);
      }
    });

  const tried = [];
  const href =
    typeof window !== "undefined" && window.location && window.location.href
      ? window.location.href
      : "";

  const candidates = [];

  // Absolute URL handling first.
  if (/^(https?:|file:)/i.test(trimmed)) {
    candidates.push(trimmed);
  }

  // Resolve relative path against current page URL.
  if (href) {
    try {
      candidates.push(new URL(trimmed, href).toString());
    } catch (e) {
      /* ignore */
    }
  }

  // Extra common local variants.
  candidates.push(trimmed);
  if (!trimmed.startsWith("./") && !trimmed.startsWith("/")) {
    candidates.push("./" + trimmed);
    candidates.push("/" + trimmed);
  }

  for (const c of candidates) {
    try {
      tried.push(c);
      const res = await fetch(c, { cache: "no-store" });
      if (res && res.ok) {
        const txt = await res.text();
        return { text: txt, tried };
      }
    } catch (inner) {
      // Fallback for local/dev environments where fetch can fail for file/relative paths.
      try {
        const txt = await fetchViaXhr(c);
        if (txt) return { text: txt, tried };
      } catch (xhrErr) {
        /* keep trying candidates */
      }
    }
  }
  return { text: "", tried };
}

function resolveImagePath(u) {
  if (!u) return "";
  if (/^(https?:|data:|\/\/)/i.test(u)) return u;
  return u;
}

function hideStoreSection() {
  replaceHeroStoreButtonWithDiscord();

  const sellingSection = document.getElementById("selling");
  if (sellingSection) {
    const prev = sellingSection.previousElementSibling;
    if (prev && prev.classList.contains("creative-separator")) prev.style.display = "none";
    sellingSection.style.display = "none";
  }

  document.querySelectorAll('a[href="#selling"]').forEach((link) => {
    link.style.display = "none";
  });
}

function replaceHeroStoreButtonWithDiscord() {
  const heroStoreCta = document.getElementById("hero-store-cta");
  if (!heroStoreCta) return;

  const ctaCfg = CONFIG.storeHiddenCta || {};
  const action = ctaCfg.action === "url" ? "url" : "copy";
  const buttonLabel =
    typeof ctaCfg.label === "string" && ctaCfg.label.trim()
      ? ctaCfg.label.trim()
      : action === "url"
        ? "Open Link"
        : "Copy Discord";
  const copyText =
    typeof ctaCfg.copyText === "string" && ctaCfg.copyText.trim()
      ? ctaCfg.copyText
      : CONFIG.discord;
  const url =
    typeof ctaCfg.url === "string" && ctaCfg.url.trim()
      ? ctaCfg.url.trim()
      : "#contact";

  heroStoreCta.classList.remove("white", "green", "gold", "blue");
  heroStoreCta.classList.add("dark");

  const label = heroStoreCta.querySelector("span");
  if (label) label.textContent = buttonLabel;

  if (action === "url") {
    heroStoreCta.href = url;
    heroStoreCta.target = "_blank";
    heroStoreCta.rel = "noopener noreferrer";
    return;
  }

  heroStoreCta.href = "#contact";
  heroStoreCta.removeAttribute("target");
  heroStoreCta.removeAttribute("rel");

  if (heroStoreCta.dataset.copyBound === "true") return;
  heroStoreCta.dataset.copyBound = "true";
  heroStoreCta.addEventListener("click", async (event) => {
    event.preventDefault();
    if (!label) return;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(copyText);
      }
      label.textContent = "Copied";
    } catch (e) {
      label.textContent = "Copy failed";
    }

    setTimeout(() => {
      label.textContent = buttonLabel;
    }, 1200);
  });
}

function renderCards(items, type) {
  const container =
    type === "projects"
      ? document.getElementById("cards-grid")
      : document.getElementById("selling-grid");
  if (!items || !container) return;

  items.forEach((p, i) => {
    const sellingLabel =
      CONFIG.labels && CONFIG.labels.sellingCardLabel
        ? CONFIG.labels.sellingCardLabel
        : "STORE ITEM";
    const projectLabel =
      CONFIG.labels && CONFIG.labels.projectCardLabel
        ? CONFIG.labels.projectCardLabel
        : "PROJECT";
    const cardLabel = type === "selling" ? sellingLabel : projectLabel;
    const tags = (p.tags || [])
      .map((t) => `<span class="tag">${t}</span>`)
      .join("");
    const links = (p.links || [])
      .map((l) => {
        const color = resolveLinkColor(l.color);
        const colorClass = ` ${color}`;
        return `<a class="card-btn${colorClass}" href="${l.url}" target="_blank" onclick="event.stopPropagation()">${l.label}</a>`;
      })
      .join("");
    const imgCount = (p.gallery || p.images || []).length;
    const hintText =
      imgCount > 0
        ? `${imgCount} IMAGE${imgCount !== 1 ? "S" : ""}`
        : type === "projects"
          ? "CLICK TO VIEW"
          : "NO IMAGES";

    const coverSrc = resolveImagePath(
      p.cover ||
        (p.images && p.images[0] && p.images[0].url) ||
        (p.gallery && p.gallery[0] && p.gallery[0].url) ||
        "",
    );
    const hasCover = !!coverSrc;
    const coverHtml = hasCover
      ? `<div class="card-cover" style="background-image:url('${coverSrc}')"></div>`
      : `<div class="card-cover is-placeholder"></div>`;

    const el = document.createElement("div");
    el.className = "card reveal";
    el.style.transitionDelay = `${i * 0.06}s`;
    el.innerHTML = `
      <div class="card-accent" style="background:${p.color || "#666"}"></div>
      <div class="card-inner">
        ${coverHtml}
        <div class="card-chip-row">
          <span class="card-chip">${cardLabel}</span>
        </div>
        <div class="card-title-row">
          <div class="card-title">${p.title}</div>
          ${p.status ? `<span class="status-pill ${p.status === "wip" ? "pill-wip" : p.status === "active" ? "pill-active" : "pill-archived"}">${p.status}</span>` : ""}
        </div>
        <p class="card-desc">${type === "selling" ? (p.price ? `<strong>${p.price}</strong><span class="card-sep"> — </span>` : "") + (p.short || "") : p.desc || ""}</p>
        <div class="card-links${links ? "" : " is-empty"}">${links}</div>
        <div class="card-tags">${tags}</div>
        <div class="card-gallery-hint"><div class="gallery-hint-dot"></div>${hintText}</div>
      </div>`;

    el.addEventListener("click", () => {
      if (window.__uiSfx) window.__uiSfx.play("click");
      if (type === "projects") openGallery(i);
      else openSelling(i);
    });

    container.appendChild(el);
  });
}

/* --------------------- Projects modal --------------------- */
function initProjectModal() {
  const modal = document.getElementById("gallery-modal");
  const mainImg = document.getElementById("gm-main-img");
  // fallback to local placeholder if image fails to load
  mainImg.addEventListener("error", () => {
    mainImg.src = "images/placeholder.svg";
  });
  const placeholder = document.getElementById("gm-placeholder");
  const captionEl = document.getElementById("gm-caption");
  const captionBar = document.getElementById("gm-caption-bar");
  const counterEl = document.getElementById("gm-counter");
  const thumbsEl = document.getElementById("gm-thumbs");
  const prevBtn = document.getElementById("gm-prev");
  const nextBtn = document.getElementById("gm-next");
  let currentProject = null,
    currentIndex = 0;

  window.openGallery = function (projectIdx, options = {}) {
    if (projectIdx < 0 || projectIdx >= (CONFIG.projects || []).length) return;
    currentProject = CONFIG.projects[projectIdx];
    currentIndex = 0;
    document.getElementById("gm-project-name").textContent = currentProject.title || "Project";
    document.getElementById("gm-accent-dot").style.background =
      currentProject.color || "#666";
    document.getElementById("gm-info-desc").textContent =
      currentProject.desc || "";

    const linksEl = document.getElementById("gm-info-links");
    linksEl.innerHTML = "";
    (currentProject.links || []).forEach((l) => {
      const a = document.createElement("a");
      a.href = l.url;
      a.target = "_blank";
      const color = resolveLinkColor(l.color);
      a.className = `card-btn modal-btn ${color}`;
      a.textContent = l.label;
      linksEl.appendChild(a);
    });
    document.getElementById("gm-tags").innerHTML = (currentProject.tags || [])
      .map((t) => `<span class="tag">${t}</span>`)
      .join("");
    const gmPhIconEl = document.getElementById("gm-ph-icon");
    if (gmPhIconEl) gmPhIconEl.textContent = "";

    const gallery = currentProject.gallery || [];
    if (gallery.length > 0) {
      placeholder.style.display = "none";
      mainImg.style.display = "block";
      captionBar.style.display = "flex";
      prevBtn.style.display = "flex";
      nextBtn.style.display = "flex";
      thumbsEl.style.display = "flex";
      buildThumbs(gallery, thumbsEl, mainImg, counterEl);
      showImage(0);
    } else {
      placeholder.style.display = "flex";
      mainImg.style.display = "none";
      captionBar.style.display = "none";
      thumbsEl.style.display = "none";
      prevBtn.style.display = "none";
      nextBtn.style.display = "none";
    }

    modal.classList.add("open");
    document.body.style.overflow = "hidden";

    if (!options.skipRouteUpdate) {
      const slug = DETAIL_ROUTE_STATE.projectSlugs[projectIdx] || toSlug(currentProject.title);
      setDetailPath(buildDetailPath(slug));
    }

    function resolveImagePath(u) {
      if (!u) return "";
      // treat as absolute if it contains a scheme (http:, data:, //)
      if (/^(https?:|data:|\/\/)/i.test(u)) return u;
      // relative paths (images/foo.png or ./images/foo.png) work as-is
      return u;
    }

    function buildThumbs(gallery, thumbsElLocal) {
      thumbsElLocal.innerHTML = "";
      gallery.forEach((img, i) => {
        const d = document.createElement("div");
        d.className = "gm-thumb" + (i === 0 ? " active" : "");
        d.dataset.idx = i;
        const src = resolveImagePath(img.url);
        d.innerHTML = `<img src="${src}" alt="${img.caption || ""}" loading="lazy">`;
        const imageEl = d.querySelector("img");
        imageEl.addEventListener("error", () => {
          d.innerHTML = '<div class="gm-thumb-placeholder">📷</div>';
        });
        d.addEventListener("click", () => showImage(i));
        thumbsElLocal.appendChild(d);
      });
    }

    function showImage(idx) {
      const gallery = currentProject.gallery || [];
      if (!gallery.length) return;
      idx = Math.max(0, Math.min(idx, gallery.length - 1));
      currentIndex = idx;
      mainImg.classList.add("switching");
      setTimeout(() => {
        mainImg.src = resolveImagePath(gallery[idx].url);
        mainImg.alt = gallery[idx].caption || "";
        mainImg.classList.remove("switching");
      }, 180);
      captionEl.textContent = gallery[idx].caption || "";
      counterEl.textContent = `${idx + 1} / ${gallery.length}`;
      document
        .querySelectorAll(".gm-thumb")
        .forEach((t) =>
          t.classList.toggle("active", parseInt(t.dataset.idx) === idx),
        );
      prevBtn.disabled = idx === 0;
      nextBtn.disabled = idx === gallery.length - 1;
      const active = thumbsEl.querySelector(".gm-thumb.active");
      if (active && thumbsEl) {
        const left = active.offsetLeft - thumbsEl.clientWidth / 2 + active.clientWidth / 2;
        thumbsEl.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
      }
    }

    prevBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      showImage(currentIndex - 1);
    };
    nextBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      showImage(currentIndex + 1);
    };
    prevBtn.onpointerdown = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };
    nextBtn.onpointerdown = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    document.getElementById("gm-close").onclick = closeGallery;
    document.getElementById("gm-backdrop").onclick = closeGallery;

    document.addEventListener("keydown", projectKeydown);

    function projectKeydown(e) {
      if (!modal.classList.contains("open")) return;
      if (e.key === "Escape") closeGallery();
      if (e.key === "ArrowLeft") showImage(currentIndex - 1);
      if (e.key === "ArrowRight") showImage(currentIndex + 1);
    }

    function closeGallery() {
      modal.classList.remove("open");
      document.body.style.overflow = "";
      document.removeEventListener("keydown", projectKeydown);
      if (!DETAIL_ROUTE_STATE.syncing) clearDetailPath();
    }
  };
}

/* --------------------- Selling modal (markdown) --------------------- */
function initSellingModal() {
  const modal = document.getElementById("selling-modal");
  const mainImg = document.getElementById("sm-main-img");
  // fallback to local placeholder if image fails to load
  mainImg.addEventListener("error", () => {
    mainImg.src = "images/placeholder.svg";
  });
  const placeholder = document.getElementById("sm-placeholder");
  const captionEl = document.getElementById("sm-caption");
  const captionBar = document.getElementById("sm-caption-bar");
  const counterEl = document.getElementById("sm-counter");
  const thumbsEl = document.getElementById("sm-thumbs");
  const prevBtn = document.getElementById("sm-prev");
  const nextBtn = document.getElementById("sm-next");
  const descEl = document.getElementById("sm-desc");
  const linksEl = document.getElementById("sm-links");
  const fontDefaultBtn = document.getElementById("sm-font-default");
  const fontMinecraftBtn = document.getElementById("sm-font-minecraft");
  let currentItem = null,
    currentIndex = 0;
  // no custom scrollbar — use native modal scrollbar

  const FONT_STORAGE_KEY = "sellingModalFont";
  const validFontModes = new Set(["default", "minecraft"]);

  function getStoredFontMode() {
    try {
      const stored = localStorage.getItem(FONT_STORAGE_KEY);
      return validFontModes.has(stored) ? stored : "default";
    } catch (e) {
      return "default";
    }
  }

  function setStoredFontMode(mode) {
    try {
      localStorage.setItem(FONT_STORAGE_KEY, mode);
    } catch (e) {
      // ignore storage failures (private mode, blocked, etc.)
    }
  }

  function applyFontMode(mode) {
    const resolvedMode = validFontModes.has(mode) ? mode : "default";
    modal.classList.toggle("sm-font-minecraft", resolvedMode === "minecraft");
    if (fontDefaultBtn) {
      const isDefault = resolvedMode === "default";
      fontDefaultBtn.setAttribute("aria-pressed", String(isDefault));
      fontDefaultBtn.classList.toggle("active", isDefault);
    }
    if (fontMinecraftBtn) {
      const isMinecraft = resolvedMode === "minecraft";
      fontMinecraftBtn.setAttribute("aria-pressed", String(isMinecraft));
      fontMinecraftBtn.classList.toggle("active", isMinecraft);
    }
  }

  if (fontDefaultBtn) {
    fontDefaultBtn.addEventListener("click", () => {
      applyFontMode("default");
      setStoredFontMode("default");
    });
  }

  if (fontMinecraftBtn) {
    fontMinecraftBtn.addEventListener("click", () => {
      applyFontMode("minecraft");
      setStoredFontMode("minecraft");
    });
  }

  window.openSelling = function (idx, options = {}) {
    if (idx < 0 || idx >= (CONFIG.currentlySelling || []).length) return;
    currentItem = CONFIG.currentlySelling[idx];
    currentIndex = 0;
    document.getElementById("sm-title").textContent = currentItem.title;
    document.getElementById("sm-accent-dot").style.background =
      currentItem.color || "#666";

    linksEl.innerHTML = "";
    (currentItem.links || []).forEach((l) => {
      const a = document.createElement("a");
      a.href = l.url;
      a.target = "_blank";
      const color = resolveLinkColor(l.color);
      a.className = `card-btn modal-btn ${color}`;
      a.textContent = l.label;
      linksEl.appendChild(a);
    });

    const smPhIconEl = document.getElementById("sm-ph-icon");
    if (smPhIconEl) smPhIconEl.textContent = "";

    const gallery = currentItem.images || [];
    if (gallery.length > 0) {
      placeholder.style.display = "none";
      mainImg.style.display = "block";
      captionBar.style.display = "flex";
      prevBtn.style.display = "flex";
      nextBtn.style.display = "flex";
      thumbsEl.style.display = "flex";
      function resolveImagePath(u) {
        if (!u) return "";
        if (/^(https?:|data:|\/\/)/i.test(u)) return u;
        return u;
      }

      function buildThumbs(gallery, thumbsElLocal) {
        thumbsElLocal.innerHTML = "";
        gallery.forEach((img, i) => {
          const d = document.createElement("div");
          d.className = "gm-thumb" + (i === 0 ? " active" : "");
          d.dataset.idx = i;
          const src = resolveImagePath(img.url);
          d.innerHTML = `<img src="${src}" alt="${img.caption || ""}" loading="lazy">`;
          const imageEl = d.querySelector("img");
          imageEl.addEventListener("error", () => {
            d.innerHTML = '<div class="gm-thumb-placeholder">📷</div>';
          });
          d.addEventListener("click", () => showImage(i));
          thumbsElLocal.appendChild(d);
        });
      }

      buildThumbs(gallery, thumbsEl);
      showImage(0);
    } else {
      placeholder.style.display = "flex";
      mainImg.style.display = "none";
      captionBar.style.display = "none";
      thumbsEl.style.display = "none";
      prevBtn.style.display = "none";
      nextBtn.style.display = "none";
    }

    applyFontMode(getStoredFontMode());

    // Render markdown (truncated). Support `md` as inline content or a path to a .md file.
    let loadedMd = "";
    const rawMdField = (currentItem.md || "").toString();
    descEl.style.cursor = "pointer";
    // If md is a path we previously attempted fetch; but user requested no fetch requirement.
    // Support both inline md and path: if the field looks like a path but was inlined, use it directly.
    (async () => {
      let mdText = "";
      try {
        const res = await fetchMarkdown(rawMdField);
        mdText = res && res.text ? res.text : "";
      } catch (e) {
        mdText = "";
      }
      // if fetchMarkdown returned empty but rawMdField is not a path (contains newlines), use the raw field
      if (!mdText && rawMdField.includes("\n")) mdText = rawMdField;
      // normalize indentation to avoid code-block rendering
      mdText = normalizeIndent(mdText || rawMdField || "");
      loadedMd = mdText || "";
      // if still empty and the field looked like a path, show helpful message
      if (!loadedMd && /\.md$/i.test(rawMdField)) {
        const esc = (s) =>
          String(s)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
        descEl.innerHTML = `<div class="gm-placeholder-sub">Description unavailable — failed to load <strong>${esc(rawMdField)}</strong>.</div>`;
      } else {
        renderMarkdownFull(loadedMd);
      }
    })();

    modal.classList.add("open");
    document.body.style.overflow = "hidden";

    if (!options.skipRouteUpdate) {
      const slug = DETAIL_ROUTE_STATE.sellingSlugs[idx] || toSlug(currentItem.id || currentItem.title);
      setDetailPath(buildDetailPath(slug));
    }

    prevBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      showImage(currentIndex - 1);
    };
    nextBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      showImage(currentIndex + 1);
    };
    prevBtn.onpointerdown = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };
    nextBtn.onpointerdown = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };
    document.getElementById("sm-close").onclick = closeSelling;
    document.getElementById("sm-backdrop").onclick = closeSelling;
    document.addEventListener("keydown", sellingKeydown);

    function buildThumbs(gallery, thumbsElLocal) {
      thumbsElLocal.innerHTML = "";
      gallery.forEach((img, i) => {
        const d = document.createElement("div");
        d.className = "gm-thumb" + (i === 0 ? " active" : "");
        d.dataset.idx = i;
        d.innerHTML = `<img src="${resolveImagePath(img.url)}" alt="${img.caption || ""}" loading="lazy">`;
        d.addEventListener("click", () => showImage(i));
        thumbsElLocal.appendChild(d);
      });
    }

    function showImage(idx) {
      const gallery = currentItem.images || [];
      if (!gallery.length) return;
      idx = Math.max(0, Math.min(idx, gallery.length - 1));
      currentIndex = idx;
      mainImg.classList.add("switching");
      setTimeout(() => {
        mainImg.src = resolveImagePath(gallery[idx].url);
        mainImg.alt = gallery[idx].caption || "";
        mainImg.classList.remove("switching");
      }, 180);
      captionEl.textContent = gallery[idx].caption || "";
      counterEl.textContent = `${idx + 1} / ${gallery.length}`;
      document
        .querySelectorAll("#sm-thumbs .gm-thumb")
        .forEach((t) =>
          t.classList.toggle("active", parseInt(t.dataset.idx) === idx),
        );
      prevBtn.disabled = idx === 0;
      nextBtn.disabled = idx === gallery.length - 1;
      const active = thumbsEl.querySelector(".gm-thumb.active");
      if (active && thumbsEl) {
        const left = active.offsetLeft - thumbsEl.clientWidth / 2 + active.clientWidth / 2;
        thumbsEl.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
      }
    }

    function sellingKeydown(e) {
      if (!modal.classList.contains("open")) return;
      if (e.key === "Escape") closeSelling();
      if (e.key === "ArrowLeft") showImage(currentIndex - 1);
      if (e.key === "ArrowRight") showImage(currentIndex + 1);
    }

    function closeSelling() {
      modal.classList.remove("open");
      document.body.style.overflow = "";
      document.removeEventListener("keydown", sellingKeydown);
      if (!DETAIL_ROUTE_STATE.syncing) clearDetailPath();
    }

    // Keep click inside description from closing modal.
    descEl.onclick = (e) => {
      e.stopPropagation();
    };

    // handle wheel events so the description scrolls when possible and outer modal doesn't steal the scroll
    descEl.addEventListener(
      "wheel",
      (ev) => {
        const delta = ev.deltaY;
        const canScrollDown =
          descEl.scrollTop + descEl.clientHeight < descEl.scrollHeight - 1;
        const canScrollUp = descEl.scrollTop > 0;
        const willScrollInside =
          (delta > 0 && canScrollDown) || (delta < 0 && canScrollUp);
        if (willScrollInside) {
          // allow default so the element scrolls, but stop propagation so the page/modal doesn't also scroll
          ev.stopPropagation();
        } else {
          // prevent default to avoid outer scrolling and stop propagation
          ev.preventDefault();
          ev.stopPropagation();
        }
      },
      { passive: false },
    );

    function renderMarkdownFull(md) {
      if (!md) {
        descEl.textContent = "No description provided.";
        return;
      }
      descEl.innerHTML = marked.parse(md || "*No description provided.*");
      descEl.classList.add("expanded");
      descEl.scrollTop = 0;
    }
  };
}

/* --------------------- Profile menu (markdown) --------------------- */
function initProfileMenu() {
  const cfg = CONFIG.profileMenu || {};
  const navLink = document.getElementById("nav-profile");
  const modal = document.getElementById("profile-modal");
  const titleEl = document.getElementById("pm-title");
  const accentEl = document.getElementById("pm-accent-dot");
  const descEl = document.getElementById("pm-desc");
  const linksEl = document.getElementById("pm-links");
  const closeBtn = document.getElementById("pm-close");
  const backdrop = document.getElementById("pm-backdrop");
  const fontDefaultBtn = document.getElementById("pm-font-default");
  const fontMinecraftBtn = document.getElementById("pm-font-minecraft");

  if (!modal || !navLink || !descEl || !linksEl) return;

  if (cfg.enabled === false) {
    navLink.style.display = "none";
    return;
  }

  if (cfg.navLabel) navLink.textContent = cfg.navLabel;
  if (titleEl && cfg.title) titleEl.textContent = cfg.title;
  if (accentEl) accentEl.style.background = cfg.accentColor || "#6fe784";

  const FONT_STORAGE_KEY = "profileModalFont";
  const validFontModes = new Set(["default", "minecraft"]);

  function getStoredFontMode() {
    try {
      const stored = localStorage.getItem(FONT_STORAGE_KEY);
      return validFontModes.has(stored) ? stored : "default";
    } catch (e) {
      return "default";
    }
  }

  function setStoredFontMode(mode) {
    try {
      localStorage.setItem(FONT_STORAGE_KEY, mode);
    } catch (e) {
      // ignore storage failures
    }
  }

  function applyFontMode(mode) {
    const resolvedMode = validFontModes.has(mode) ? mode : "default";
    modal.classList.toggle("pm-font-minecraft", resolvedMode === "minecraft");
    if (fontDefaultBtn) {
      const isDefault = resolvedMode === "default";
      fontDefaultBtn.setAttribute("aria-pressed", String(isDefault));
      fontDefaultBtn.classList.toggle("active", isDefault);
    }
    if (fontMinecraftBtn) {
      const isMinecraft = resolvedMode === "minecraft";
      fontMinecraftBtn.setAttribute("aria-pressed", String(isMinecraft));
      fontMinecraftBtn.classList.toggle("active", isMinecraft);
    }
  }

  if (fontDefaultBtn) {
    fontDefaultBtn.addEventListener("click", () => {
      applyFontMode("default");
      setStoredFontMode("default");
    });
  }

  if (fontMinecraftBtn) {
    fontMinecraftBtn.addEventListener("click", () => {
      applyFontMode("minecraft");
      setStoredFontMode("minecraft");
    });
  }

  function normalizeGithubUrl(url) {
    if (!url) return "";
    const blobMatch = url.match(
      /^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/(.+)$/i,
    );
    if (!blobMatch) return url;
    const [, owner, repo, path] = blobMatch;
    return `https://raw.githubusercontent.com/${owner}/${repo}/${path}`;
  }

  async function loadMarkdown() {
    const mdSource = normalizeGithubUrl(cfg.markdownUrl || "");
    descEl.innerHTML = "<div class=\"gm-placeholder-sub\">Loading...</div>";
    try {
      const res = await fetchMarkdown(mdSource);
      const md = normalizeIndent(res && res.text ? res.text : "");
      if (!md) {
        descEl.innerHTML = "<div class=\"gm-placeholder-sub\">No content available.</div>";
        return;
      }
      descEl.innerHTML = marked.parse(md);
    } catch (e) {
      descEl.innerHTML = "<div class=\"gm-placeholder-sub\">Failed to load content.</div>";
    }
  }

  function renderButtons() {
    linksEl.innerHTML = "";
    (cfg.buttons || []).forEach((btn) => {
      if (!btn || !btn.label || !btn.url) return;
      const a = document.createElement("a");
      a.href = btn.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      const color = resolveLinkColor(btn.color);
      a.className = `card-btn modal-btn ${color}`;
      a.textContent = btn.label;
      linksEl.appendChild(a);
    });
  }

  function openProfileMenu() {
    renderButtons();
    loadMarkdown();
    applyFontMode(getStoredFontMode());
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeProfileMenu() {
    modal.classList.remove("open");
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onKeydown);
  }

  function onKeydown(e) {
    if (!modal.classList.contains("open")) return;
    if (e.key === "Escape") closeProfileMenu();
  }

  navLink.addEventListener("click", (e) => {
    e.preventDefault();
    const nav = document.getElementById("nav");
    if (nav) nav.classList.remove("open");
    openProfileMenu();
    document.addEventListener("keydown", onKeydown);
  });

  if (closeBtn) closeBtn.addEventListener("click", closeProfileMenu);
  if (backdrop) backdrop.addEventListener("click", closeProfileMenu);
  window.openProfileMenu = openProfileMenu;
}

/* --------------------- Tiny hero canvas (keeps original behavior) --------------------- */
function initHeroCanvas() {
  try {
    const canvas = document.getElementById("hero-canvas");
    const ctx = canvas.getContext("2d");
    let W,
      H,
      raf,
      t = 0;
    function mlb32(a) {
      return function () {
        a |= 0;
        a = (a + 0x6d2b79f5) | 0;
        let x = Math.imul(a ^ (a >>> 15), 1 | a);
        x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
        return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
      };
    }
    const rng = mlb32(42),
      COLS = 30,
      hs = [];
    let h = 0.45;
    for (let i = 0; i < COLS; i++) {
      h += (rng() - 0.5) * 0.11;
      h = Math.max(0.28, Math.min(0.62, h));
      hs.push(h);
    }
    const trng = mlb32(77),
      trees = new Set();
    for (let i = 1; i < COLS - 1; i++) if (trng() > 0.72) trees.add(i);
    const crng = mlb32(13),
      clouds = [];
    for (let i = 0; i < 6; i++)
      clouds.push({
        x: crng() * 1.3 - 0.15,
        y: crng() * 0.22 + 0.04,
        w: crng() * 0.14 + 0.07,
        spd: crng() * 0.000035 + 0.000018,
      });
    const c = (r, g, b) => `rgb(${r},${g},${b})`;
    const SKY0 = [18, 26, 55],
      SKY1 = [70, 148, 210];
    const GR = [77, 155, 58],
      GRD = [47, 95, 35];
    const DT = [130, 92, 62],
      STO = [95, 95, 105];
    const WD = [105, 78, 46],
      LA = [48, 108, 33],
      LB = [34, 85, 22];
    const CLO = [215, 215, 225];

    function draw() {
      t++;
      W = canvas.width;
      H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      const grd = ctx.createLinearGradient(0, 0, 0, H * 0.8);
      grd.addColorStop(0, c(...SKY0));
      grd.addColorStop(1, c(...SKY1));
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, W, H);
      const sr2 = mlb32(5);
      for (let i = 0; i < 50; i++) {
        const sx = sr2() * W,
          sy = sr2() * H * 0.32;
        ctx.globalAlpha = (Math.sin(t * 0.025 + i) * 0.5 + 0.5) * 0.55;
        ctx.fillStyle = "#fff";
        ctx.fillRect(sx | 0, sy | 0, 2, 2);
      }
      ctx.globalAlpha = 1;
      clouds.forEach((cl) => {
        cl.x = (cl.x + cl.spd) % 1.35;
        const cx = cl.x * W,
          cy = cl.y * H,
          cw = cl.w * W,
          ch = Math.max(14, W * 0.016);
        ctx.fillStyle = c(...CLO);
        ctx.fillRect((cx - ch * 0.5) | 0, cy | 0, (cw + ch) | 0, ch | 0);
        ctx.fillRect(cx | 0, (cy - ch) | 0, cw | 0, ch | 0);
        ctx.fillRect(
          (cx + ch) | 0,
          (cy - ch * 0.55) | 0,
          (cw * 0.45) | 0,
          (ch * 0.8) | 0,
        );
      });
      const BLK = Math.max(14, (W / COLS) | 0);
      for (let col = 0; col < COLS; col++) {
        const x = col * BLK,
          top = (hs[col] * H) | 0;
        ctx.fillStyle = c(...(col % 2 ? GR : GRD));
        ctx.fillRect(x, top, BLK, BLK);
        for (let r = 1; r <= 4; r++) {
          ctx.fillStyle = c(
            ...(r % 2 ? DT : [DT[0] - 10, DT[1] - 7, DT[2] - 4]),
          );
          ctx.fillRect(x, top + r * BLK, BLK, BLK);
        }
        for (let r = 5; r <= 14; r++) {
          ctx.fillStyle = c(
            ...(r % 2 ? STO : [STO[0] - 14, STO[1] - 14, STO[2] - 12]),
          );
          ctx.fillRect(x, top + r * BLK, BLK, BLK);
        }
        ctx.fillStyle = "#0d0d0f";
        ctx.fillRect(x, top + 15 * BLK, BLK, H);
        if (trees.has(col)) {
          const tw = BLK * 0.8,
            tx = x + BLK * 0.1,
            ty = top - BLK * 5;
          ctx.fillStyle = c(...WD);
          ctx.fillRect(
            (tx + tw * 0.3) | 0,
            (top - BLK * 3.8) | 0,
            (tw * 0.4) | 0,
            (BLK * 3.8) | 0,
          );
          ctx.fillStyle = c(...LA);
          ctx.fillRect(tx | 0, (ty + BLK) | 0, tw | 0, (BLK * 4) | 0);
          ctx.fillStyle = c(...LB);
          ctx.fillRect(
            (tx + tw * 0.12) | 0,
            ty | 0,
            (tw * 0.76) | 0,
            (BLK * 2.2) | 0,
          );
          ctx.fillRect(
            (tx + tw * 0.04) | 0,
            (ty + BLK) | 0,
            (tw * 0.92) | 0,
            (BLK * 3) | 0,
          );
        }
      }
      raf = requestAnimationFrame(draw);
    }

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    draw();
    window.addEventListener("resize", () => {
      cancelAnimationFrame(raf);
      resize();
      draw();
    });
  } catch (e) {
    /* ignore */
  }
}
