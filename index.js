let t = new EventTarget();

export default {
  s: (e, c) => (t.addEventListener(e, c), () => t.removeEventListener(e, c)),
  p: (n, d) => t.dispatchEvent(new CustomEvent(n, { detail: d })),
};
