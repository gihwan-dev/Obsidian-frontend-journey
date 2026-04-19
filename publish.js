/*
 * gihwan-dev / Obsidian Publish custom script
 * - 홈 페이지(index.md) 히어로 상단에 시간대별 인사말을 주입
 * - 사이트 하단에 커스텀 푸터(브랜딩 + 소셜 링크) 주입
 * Publish는 SPA-like navigation이라 MutationObserver로 라우팅 변화에 대응.
 */

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 5)  return "늦은 밤, 오늘도 수고 많으셨어요.";
  if (h < 12) return "좋은 아침입니다.";
  if (h < 18) return "오후도 차분히 이어가세요.";
  if (h < 22) return "저녁, 오늘 하루 고생하셨습니다.";
  return "늦은 밤, 오늘도 수고 많으셨어요.";
};

const isHomePage = () => {
  const path = location.pathname.replace(/\/+$/, "");
  return (
    path === "" ||
    path === "/" ||
    path.endsWith("/index") ||
    path.endsWith("/gihwan-dev")
  );
};

const injectGreeting = () => {
  if (!isHomePage()) return;

  const hero = document.querySelector(".markdown-preview-view .hero");
  if (!hero) return;
  if (hero.querySelector(".greeting")) return;

  const greeting = document.createElement("div");
  greeting.className = "greeting";
  greeting.textContent = getGreeting();
  hero.insertBefore(greeting, hero.firstChild);
};

const injectCustomFooter = () => {
  const footer = document.querySelector("div.site-footer");
  if (!footer || footer.querySelector(".custom-footer")) return;

  const custom = document.createElement("div");
  custom.className = "custom-footer";

  const copy = document.createElement("span");
  copy.className = "custom-footer-copy";
  copy.textContent = "© 2026 gihwan-dev · Frontend Journey";

  const links = document.createElement("span");
  links.className = "custom-footer-links";

  const link = (href, label) => {
    const a = document.createElement("a");
    a.href = href;
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = label;
    return a;
  };

  links.appendChild(link("https://github.com/Gihwan-dev", "GitHub"));
  links.appendChild(link("https://velog.io/@koreanthuglife", "Velog"));

  custom.appendChild(copy);
  custom.appendChild(links);
  footer.insertBefore(custom, footer.firstChild);
};

const run = () => {
  injectGreeting();
  injectCustomFooter();
};

run();

const observer = new MutationObserver(run);
const observerTarget = document.querySelector(".published-container") ?? document.body;
observer.observe(observerTarget, { childList: true, subtree: true });

/*
 * "연결된 노트" 카드 — canvas 그래프를 대체
 * window.publish.graph 내부 API에서 현재 파일의 forward/reverse 링크를 읽어
 * 우측 패널에 카드 리스트로 렌더링. SPA 전환은 publish.on('navigated') 공식 훅 사용.
 */
(function initRelatedNotes() {
  const el = (tag, className, textContent) => {
    const n = document.createElement(tag);
    if (className) n.className = className;
    if (textContent !== undefined) n.textContent = textContent;
    return n;
  };

  const makeCard = ({ title, url }) => {
    const a = el("a", "gh-card");
    a.href = url;
    a.appendChild(el("span", null, title));
    a.appendChild(el("span", "gh-card-arrow", "→"));
    return a;
  };

  const makeSection = (label, items) => {
    const frag = document.createDocumentFragment();
    frag.appendChild(el("div", "gh-section-label", `${label} (${items.length})`));
    items.forEach((item) => frag.appendChild(makeCard(item)));
    return frag;
  };

  let tries = 0;
  const MAX_TRIES = 40;

  const render = () => {
    document.querySelector(".gh-related")?.remove();

    const g = window.publish?.graph;
    if (!g?.renderer?.nodes?.length) {
      if (tries++ < MAX_TRIES) setTimeout(render, 150);
      return;
    }

    const current = g.currentFilepath;
    const me = g.renderer.nodes.find((n) => n.id === current);
    if (!me) {
      if (tries++ < MAX_TRIES) setTimeout(render, 150);
      return;
    }

    tries = 0;

    const siteSlug = window.publish?.site?.slug || "";
    const toTitle = (id) => id.replace(/\.md$/, "").split("/").pop();
    const toUrl = (id) => {
      const noExt = id.replace(/\.md$/, "");
      return "/" + siteSlug + "/" + noExt.split("/").map(encodeURIComponent).join("/");
    };

    const forward = Object.keys(me.forward || {}).map((id) => ({
      title: toTitle(id),
      url: toUrl(id),
    }));
    const reverse = Object.keys(me.reverse || {}).map((id) => ({
      title: toTitle(id),
      url: toUrl(id),
    }));

    const wrap = el("div", "gh-related");
    wrap.appendChild(el("h3", "gh-related-title", "연결된 노트"));

    if (forward.length) wrap.appendChild(makeSection("이 글이 참조", forward));
    if (reverse.length) wrap.appendChild(makeSection("이 글을 참조", reverse));
    if (!forward.length && !reverse.length) {
      wrap.appendChild(el("div", "gh-empty", "연결된 노트가 없습니다."));
    }

    const inner = document.querySelector(".site-body-right-column-inner");
    if (inner) inner.insertBefore(wrap, inner.firstChild);
  };

  const install = () => {
    if (!window.publish?.on) {
      setTimeout(install, 100);
      return;
    }
    window.publish.on("navigated", () => {
      tries = 0;
      setTimeout(render, 50);
    });
    render();
  };

  install();
})();

/*
 * Excalidraw SVG 테마 스왑
 * 플러그인이 생성하는 파일 명명 패턴:
 * - autoExportLightAndDark=true  → *.excalidraw.light.svg + *.excalidraw.dark.svg
 * - autoExportLightAndDark=false → *.excalidraw.svg (단일)
 * body.theme-dark 여부에 맞춰 <img src>를 toggle하고, 404 시 기본 .svg 로 폴백.
 */
(function initExcalidrawThemeSwap() {
  // 파일명이 *.excalidraw.md 면 export가 *.excalidraw.(light|dark).svg,
  // 파일명이 일반 *.md 면 export가 *.(light|dark).svg — 두 패턴 모두 대응.
  const EXCALIDRAW_PATTERN = /\.excalidraw(\.light|\.dark)?\.svg(\?|$)/;
  const GENERIC_PATTERN = /\.(light|dark)\.svg(\?|$)/;

  const isExcalidrawImg = (img) => {
    const src = img.getAttribute("src") || "";
    return EXCALIDRAW_PATTERN.test(src) || GENERIC_PATTERN.test(src);
  };

  const toVariant = (src, variant) => {
    if (EXCALIDRAW_PATTERN.test(src)) {
      return src.replace(
        /\.excalidraw(\.light|\.dark)?\.svg(\?|$)/,
        variant ? `.excalidraw.${variant}.svg$2` : ".excalidraw.svg$2"
      );
    }
    return src.replace(
      /(\.light|\.dark)?\.svg(\?|$)/,
      variant ? `.${variant}.svg$2` : ".svg$2"
    );
  };

  const swap = () => {
    const dark = document.body.classList.contains("theme-dark");
    document.querySelectorAll("img").forEach((img) => {
      if (!isExcalidrawImg(img)) return;
      img.classList.add("excalidraw-svg");

      const cur = img.getAttribute("src");
      const target = toVariant(cur, dark ? "dark" : "light");
      if (cur === target) return;

      img.setAttribute("src", target);
      img.onerror = () => {
        const plain = toVariant(cur, "");
        if (img.getAttribute("src") !== plain) {
          img.onerror = null;
          img.setAttribute("src", plain);
        }
      };
    });
  };

  swap();
  window.publish?.on?.("navigated", () => setTimeout(swap, 50));

  const themeObserver = new MutationObserver(swap);
  themeObserver.observe(document.body, {
    attributes: true,
    attributeFilter: ["class"],
  });
})();

/*
 * Excalidraw 다이어그램 라이트박스
 * img.excalidraw-svg 를 클릭하면 전체화면 오버레이로 확대.
 * 휠 → 포인터 중심 줌, 드래그 → 팬, 더블클릭 → 리셋, ESC/배경 클릭 → 닫기.
 * 다이어그램 전용이라 블로그 내 일반 이미지는 건드리지 않음.
 */
(function initExcalidrawLightbox() {
  const MIN = 0.5;
  const MAX = 8;

  let current = null;

  const close = () => {
    if (!current) return;
    current.overlay.remove();
    document.removeEventListener("keydown", current.onKey);
    current = null;
  };

  const open = (src) => {
    close();

    const overlay = document.createElement("div");
    overlay.className = "gh-lightbox";

    const img = document.createElement("img");
    img.className = "gh-lightbox-img";
    img.src = src;
    img.draggable = false;

    const hint = document.createElement("div");
    hint.className = "gh-lightbox-hint";
    hint.textContent = "휠 줌 · 드래그 이동 · 더블클릭 리셋 · ESC/배경 클릭 닫기";

    overlay.append(img, hint);
    document.body.append(overlay);

    let scale = 1;
    let tx = 0;
    let ty = 0;
    let dragging = false;
    let startX = 0;
    let startY = 0;

    const apply = () => {
      img.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
    };

    overlay.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        const rect = img.getBoundingClientRect();
        const cx = e.clientX - (rect.left + rect.width / 2);
        const cy = e.clientY - (rect.top + rect.height / 2);
        const delta = e.deltaY > 0 ? 1 / 1.12 : 1.12;
        const next = Math.min(MAX, Math.max(MIN, scale * delta));
        const ratio = next / scale;
        tx = cx - (cx - tx) * ratio;
        ty = cy - (cy - ty) * ratio;
        scale = next;
        apply();
      },
      { passive: false }
    );

    img.addEventListener("pointerdown", (e) => {
      dragging = true;
      startX = e.clientX - tx;
      startY = e.clientY - ty;
      img.setPointerCapture(e.pointerId);
    });
    img.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      tx = e.clientX - startX;
      ty = e.clientY - startY;
      apply();
    });
    const endDrag = (e) => {
      dragging = false;
      if (e.pointerId != null && img.hasPointerCapture(e.pointerId)) {
        img.releasePointerCapture(e.pointerId);
      }
    };
    img.addEventListener("pointerup", endDrag);
    img.addEventListener("pointercancel", endDrag);

    img.addEventListener("dblclick", (e) => {
      e.stopPropagation();
      scale = 1;
      tx = 0;
      ty = 0;
      apply();
    });

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });

    const onKey = (e) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);

    current = { overlay, onKey };
  };

  document.addEventListener("click", (e) => {
    const img = e.target.closest && e.target.closest("img.excalidraw-svg");
    if (!img) return;
    e.preventDefault();
    open(img.getAttribute("src"));
  });

  window.publish?.on?.("navigated", close);
})();
