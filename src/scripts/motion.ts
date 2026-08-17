/**
 * Shared motion primitives.
 *
 * Everything here is opt-in through a `data-*` attribute, so a section gets an
 * effect by adding the attribute rather than by shipping its own script. All of
 * it no-ops under `prefers-reduced-motion`, and all of it degrades to static
 * content if the script never runs.
 */

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;

/** Runs `fn` once the element first scrolls into view. */
function onEnter(el: Element, fn: () => void, threshold = 0.3) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        io.unobserve(entry.target);
        fn();
      }
    },
    { threshold }
  );
  io.observe(el);
}

/* ------------------------------------------------------------------ *
 * [data-split] — headings rise word by word when they scroll in.
 * ------------------------------------------------------------------ */

function splitWords(root: HTMLElement) {
  // Walk text nodes only, so nested markup (the gradient <span>) survives.
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  let node: Node | null;
  while ((node = walker.nextNode())) nodes.push(node as Text);

  let index = 0;
  for (const text of nodes) {
    const words = text.textContent?.split(/(\s+)/) ?? [];
    if (!words.length) continue;

    const frag = document.createDocumentFragment();
    for (const word of words) {
      if (!word.trim()) {
        frag.appendChild(document.createTextNode(word));
        continue;
      }
      const span = document.createElement("span");
      span.className = "word";
      span.style.setProperty("--w", String(index++));
      span.textContent = word;
      frag.appendChild(span);
    }
    text.replaceWith(frag);
  }
}

function initSplit() {
  document.querySelectorAll<HTMLElement>("[data-split]").forEach((el) => {
    splitWords(el);
    el.dataset.splitReady = "";
    onEnter(el, () => el.setAttribute("data-split-in", ""), 0.2);
  });
}

/* ------------------------------------------------------------------ *
 * [data-count] — a number that ticks up to its final value in view.
 * ------------------------------------------------------------------ */

function initCounters() {
  document.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
    const target = Number(el.dataset.count);
    if (!Number.isFinite(target)) return;

    const final = el.textContent ?? String(target);
    el.textContent = "0";

    onEnter(el, () => {
      const DURATION = 1400;
      const start = performance.now();

      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / DURATION);
        // easeOutExpo: fast off the line, long settle — reads as a readout
        // landing on a value rather than a linear odometer.
        const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        el.textContent = String(Math.round(target * eased));
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = final;
      };

      requestAnimationFrame(tick);
    });
  });
}

/* ------------------------------------------------------------------ *
 * [data-magnetic] — the element leans toward the cursor and springs back.
 * ------------------------------------------------------------------ */

function initMagnetic() {
  document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
    const strength = Number(el.dataset.magnetic) || 0.35;

    el.addEventListener("pointermove", (event) => {
      const rect = el.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      el.style.setProperty("--mag-x", `${x * strength}px`);
      el.style.setProperty("--mag-y", `${y * strength}px`);
    });

    el.addEventListener("pointerleave", () => {
      el.style.setProperty("--mag-x", "0px");
      el.style.setProperty("--mag-y", "0px");
    });
  });
}

/* ------------------------------------------------------------------ *
 * [data-tilt] — a card that tips in 3D toward the pointer.
 * ------------------------------------------------------------------ */

function initTilt() {
  document.querySelectorAll<HTMLElement>("[data-tilt]").forEach((el) => {
    const max = Number(el.dataset.tilt) || 6;

    el.addEventListener("pointermove", (event) => {
      const rect = el.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      el.style.setProperty("--tilt-x", `${-py * max}deg`);
      el.style.setProperty("--tilt-y", `${px * max}deg`);
      // Feeds the CSS spotlight that already exists in global.css.
      el.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      el.style.setProperty("--my", `${event.clientY - rect.top}px`);
    });

    el.addEventListener("pointerleave", () => {
      el.style.setProperty("--tilt-x", "0deg");
      el.style.setProperty("--tilt-y", "0deg");
    });
  });
}

/* ------------------------------------------------------------------ *
 * Scroll velocity — published as --scroll-v (-1..1) and --scroll-dir.
 * Marquees read it to speed up, slow down and reverse with the scroll.
 * ------------------------------------------------------------------ */

function initScrollVelocity() {
  const root = document.documentElement;
  let last = window.scrollY;
  let velocity = 0;
  let raf = 0;

  const loop = () => {
    // Ease back to rest so the marquee glides down instead of snapping.
    velocity *= 0.9;
    root.style.setProperty("--scroll-v", velocity.toFixed(3));
    if (Math.abs(velocity) > 0.001) raf = requestAnimationFrame(loop);
    else {
      root.style.setProperty("--scroll-v", "0");
      raf = 0;
    }
  };

  window.addEventListener(
    "scroll",
    () => {
      const delta = window.scrollY - last;
      last = window.scrollY;
      velocity = Math.max(-1, Math.min(1, delta / 28));
      if (velocity !== 0) root.style.setProperty("--scroll-dir", velocity > 0 ? "1" : "-1");
      if (!raf) raf = requestAnimationFrame(loop);
    },
    { passive: true }
  );
}

/* ------------------------------------------------------------------ *
 * Scroll progress — the hairline under the nav.
 * ------------------------------------------------------------------ */

function initProgress() {
  const bar = document.querySelector<HTMLElement>("[data-progress]");
  if (!bar) return;

  let ticking = false;
  const update = () => {
    ticking = false;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
}

/* ------------------------------------------------------------------ *
 * Cursor — a small ring that trails the pointer and swells over links.
 * Desktop only; it is decoration, never the actual cursor.
 * ------------------------------------------------------------------ */

function initCursor() {
  if (!finePointer) return;

  const ring = document.createElement("div");
  ring.className = "cursor-ring";
  ring.setAttribute("aria-hidden", "true");
  document.body.appendChild(ring);

  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;
  let rx = x;
  let ry = y;
  let running = false;

  const loop = () => {
    // Lerp toward the pointer: the lag is the whole effect.
    rx += (x - rx) * 0.16;
    ry += (y - ry) * 0.16;
    ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;

    if (Math.abs(x - rx) > 0.1 || Math.abs(y - ry) > 0.1) requestAnimationFrame(loop);
    else running = false;
  };

  window.addEventListener(
    "pointermove",
    (event) => {
      x = event.clientX;
      y = event.clientY;
      ring.dataset.on = "";
      if (!running) {
        running = true;
        requestAnimationFrame(loop);
      }
    },
    { passive: true }
  );

  document.addEventListener("pointerover", (event) => {
    const target = event.target as Element | null;
    ring.toggleAttribute("data-hot", !!target?.closest("a, button, [data-magnetic], [data-tilt]"));
  });

  document.addEventListener("pointerdown", () => ring.setAttribute("data-down", ""));
  document.addEventListener("pointerup", () => ring.removeAttribute("data-down"));
}

/* ------------------------------------------------------------------ */

export function initMotion() {
  // Reveal-on-scroll is the one effect that also runs reduced (it just has no
  // transition), so it stays in Layout.astro. Everything below is motion.
  if (reduced) return;

  initSplit();
  initCounters();
  initMagnetic();
  initTilt();
  initScrollVelocity();
  initProgress();
  initCursor();
}
