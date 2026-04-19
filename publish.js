/*
 * gihwan-dev / Obsidian Publish custom script
 * 홈 페이지(index.md) 히어로 상단에 시간대별 인사말을 주입한다.
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

injectGreeting();

const heroObserver = new MutationObserver(() => injectGreeting());
heroObserver.observe(document.body, { childList: true, subtree: true });
