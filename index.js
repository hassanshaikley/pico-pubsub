let t = new EventTarget();

sub = (e, c) => (
  t.addEventListener(e, c), () => t.removeEventListener(e, c)
);
pub = (n, d) => t.dispatchEvent(new CustomEvent(n, { detail: d }));
