let t = {};
sub = (e, c) => ((t[e] ??= new Set()).add(c), (_) => t[e].delete(c));
pub = (e, d) => t[e]?.forEach((f) => f(d));
