let t = new EventTarget();

window.sub = (e, c) => (
  t.addEventListener(e, c), () => t.removeEventListener(e, c)
);
window.pub = (n, d) => t.dispatchEvent(new CustomEvent(n, { detail: d }));
