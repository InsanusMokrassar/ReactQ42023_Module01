export function buildUrl(
  query: string,
  page: number,
  count: number,
  username?: string,
  repo?: string
): string {
  const prefix = username ? (repo ? `/${username}/${repo}` : '/') : '/';
  return `${prefix}?query=${encodeURIComponent(
    query
  )}&page=${encodeURIComponent(page)}&count=${encodeURIComponent(count)}`;
}
