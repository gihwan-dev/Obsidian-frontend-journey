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
