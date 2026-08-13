// Prefixes an absolute path with the configured base path (needed when the
// site is deployed under a subpath, e.g. GitHub Pages project sites).
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return path === "/" ? `${base}/` : `${base}${path}`;
}
