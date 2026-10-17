(() => {
  const projects = window.PORTFOLIO_PROJECTS || [];
  const config = window.PORTFOLIO_CONFIG || {};
  const grid = document.querySelector("#project-grid");
  const filters = document.querySelector("#filters");
  const modal = document.querySelector("#project-modal");
  const modalVideoWrap = document.querySelector("#modal-video-wrap");
  let lastFocused = null;
  let activeFilter = "All";
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = () => window.matchMedia("(hover: none), (max-width: 700px)").matches;

  document.title = `${config.name || "Portfolio"}® — Video Editor & Motion Designer`;
  const emailLink = document.querySelector("#email-link");
  if (emailLink && config.email) emailLink.href = `mailto:${config.email}`;

  const esc = (s = "") => String(s).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));

  function youtubeId(urlOrId) {
    if (!urlOrId) return "";
    const raw = String(urlOrId).trim();
    if (/^[\w-]{11}$/.test(raw)) return raw;
    try {
      const url = new URL(raw);
      if (url.hostname.includes("youtu.be")) return url.pathname.slice(1).split("/")[0];
      if (url.hostname.includes("youtube.com") || url.hostname.includes("youtube-nocookie.com")) {
        if (url.searchParams.get("v")) return url.searchParams.get("v");
        const parts = url.pathname.split("/").filter(Boolean);
        const key = parts.findIndex(p => ["embed", "shorts", "live"].includes(p));
        if (key >= 0) return parts[key + 1] || "";
      }
    } catch (_) {}
    return "";
  }

  function getThumbnail(project) {
    const id = youtubeId(project.videoId);
    if (id) return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
    return project.thumbnail || "";
  }

  function cardMarkup(p) {
    const thumb = getThumbnail(p);
    return `
      <article class="project-card" tabindex="0" role="button" aria-label="Open ${esc(p.title)} project details" data-project-id="${esc(p.id)}">
        <div class="project-thumb">
          <img loading="lazy" decoding="async" src="${esc(thumb)}" alt="${esc(p.title)} project thumbnail">
          <div class="card-topline"><span class="card-category">${esc(p.category)}</span><span class="card-index">${esc(p.id)} / ${String(projects.length).padStart(2,"0")}</span></div>
          <span class="preview-indicator" aria-hidden="true">▶</span>
        </div>
        <div class="project-info"><div><h3>${esc(p.title)}</h3><p>${esc(p.type || p.category)} · ${esc(p.year || "")}</p></div><span class="project-arrow">↗</span></div>
      </article>`;
  }

  function renderProjects() {
    const shown = activeFilter === "All" ? projects : projects.filter(p => p.category === activeFilter);
    grid.innerHTML = shown.map(cardMarkup).join("");
    setupCardPreviews();
  }

  function setupCardPreviews() {
    const cards = [...grid.querySelectorAll(".project-card")];
    const observers = [];
    cards.forEach(card => {
      const p = projects.find(item => item.id === card.dataset.projectId);
      if (!p) return;
      const thumb = card.querySelector(".project-thumb");
      let video = null;
      let started = false;

      function stopPreview() {
        if (video) {
          video.pause();
          video.removeAttribute("src");
          video.load();
          video.remove();
          video = null;
        }
        started = false;
      }
      function startPreview() {
        if (prefersReducedMotion || isMobile() || started || !p.previewMp4) return;
        const img = thumb.querySelector("img");
        video = document.createElement("video");
        video.src = p.previewMp4;
        video.muted = true;
        video.defaultMuted = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = "none";
        video.setAttribute("aria-hidden", "true");
        video.style.position = "absolute";
        video.style.inset = "0";
        video.style.zIndex = "1";
        video.style.width = "100%";
        video.style.height = "100%";
        video.style.objectFit = "cover";
        thumb.appendChild(video);
        if (img) img.style.opacity = ".18";
        started = true;
        const playPromise = video.play();
        if (playPromise && playPromise.catch) playPromise.catch(() => stopPreview());
      }
      card.addEventListener("mouseenter", startPreview);
      card.addEventListener("mouseleave", () => {
        stopPreview();
        const img = thumb.querySelector("img");
        if (img) img.style.opacity = "";
      });
      card.addEventListener("focus", startPreview);
      card.addEventListener("blur", () => {
        stopPreview();
        const img = thumb.querySelector("img");
        if (img) img.style.opacity = "";
      });
      card.addEventListener("click", () => openProject(p));
      card.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openProject(p);
        }
      });

      // On-scroll autoplay previews only work with an MP4 preview URL.
      // Keep previews short and only play for cards near the viewport.
      if (p.previewMp4 && !prefersReducedMotion && "IntersectionObserver" in window) {
        const observer = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio >= .65 && !isMobile()) startPreview();
            else {
              stopPreview();
              const img = thumb.querySelector("img");
              if (img) img.style.opacity = "";
            }
          });
        }, { threshold: [.0, .65, 1] });
        observer.observe(card);
        observers.push(observer);
      }
    });
  }

  function openProject(p) {
    lastFocused = document.activeElement;
    document.querySelector("#modal-category").textContent = `${p.category || "PROJECT"} / ${p.id}`;
    document.querySelector("#modal-title").textContent = p.title;
    document.querySelector("#modal-description").textContent = p.description || "";
    document.querySelector("#modal-role").textContent = p.role || "";
    document.querySelector("#modal-tools").textContent = p.tools || "";
    const id = youtubeId(p.videoId);
    modalVideoWrap.innerHTML = "";
    if (id) {
      const iframe = document.createElement("iframe");
      iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0&modestbranding=1`;
      iframe.title = `${p.title} video`;
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = "strict-origin-when-cross-origin";
      modalVideoWrap.appendChild(iframe);
    } else {
      const placeholder = document.createElement("div");
      placeholder.className = "modal-video-placeholder";
      placeholder.innerHTML = `<div><p style="font-size:32px;margin:0 0 12px;color:var(--lime)">▶</p><strong>ADD YOUR YOUTUBE LINK</strong><p style="max-width:430px;line-height:1.7;margin:12px auto 0">Edit this project in <code>projects.js</code> and add its YouTube URL to the <code>videoId</code> field. The project details and thumbnail are ready to customize.</p></div>`;
      modalVideoWrap.appendChild(placeholder);
    }
    const ytLink = document.querySelector("#modal-youtube-link");
    if (id) {
      ytLink.href = `https://www.youtube.com/watch?v=${encodeURIComponent(id)}`;
      ytLink.style.display = "inline-block";
    } else {
      ytLink.style.display = "none";
      ytLink.removeAttribute("href");
    }
    modal.hidden = false;
    document.body.classList.add("modal-open");
    document.querySelector(".modal-close").focus();
  }

  function closeModal() {
    if (modal.hidden) return;
    modal.hidden = true;
    modalVideoWrap.innerHTML = ""; // stop playback
    document.body.classList.remove("modal-open");
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  filters.addEventListener("click", e => {
    const button = e.target.closest("[data-filter]");
    if (!button) return;
    activeFilter = button.dataset.filter;
    filters.querySelectorAll(".filter-chip").forEach(b => {
      b.classList.toggle("active", b === button);
      b.setAttribute("aria-pressed", b === button ? "true" : "false");
    });
    renderProjects();
  });
  modal.addEventListener("click", e => {
    if (e.target.closest("[data-close-modal]")) closeModal();
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeModal();
  });

  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-header nav");
  menuToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  });
  nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }));

  // Keep the featured hero image decorative until the user connects a featured video.
  const featured = projects.find(p => youtubeId(p.videoId));
  const heroImage = document.querySelector("#hero-image");
  if (featured && heroImage) {
    heroImage.style.backgroundImage = `url("${getThumbnail(featured)}")`;
    heroImage.style.cursor = "pointer";
    heroImage.addEventListener("click", () => openProject(featured));
  }

  renderProjects();
})();
