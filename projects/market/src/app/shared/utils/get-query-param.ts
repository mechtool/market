export function getQueryParam(name, path = window.location.search): string {
  const match = RegExp(`[?&]${name}=([^&]*)`).exec(path);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}
