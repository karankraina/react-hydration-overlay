export function isClient() {
  if (typeof window !== 'undefined') {
    return globalThis === window;
  }

  return false;
}
