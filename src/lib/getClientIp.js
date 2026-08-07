/**
 * Resolve the real client IP from incoming request headers (CDN / reverse proxy).
 */

function readHeader(headers, name) {
  if (!headers) return null;

  if (typeof headers.get === "function") {
    return headers.get(name) || headers.get(name.toLowerCase());
  }

  const key = Object.keys(headers).find(
    (k) => k.toLowerCase() === name.toLowerCase()
  );
  return key ? headers[key] : null;
}

/**
 * @param {Headers | Record<string, string>} headers
 * @returns {string | null}
 */
export function getClientIpFromHeaders(headers) {
  const forwardedFor = readHeader(headers, "x-forwarded-for");
  if (forwardedFor) {
    const ip = forwardedFor.split(",")[0]?.trim();
    if (ip) return ip;
  }

  const realIp = readHeader(headers, "x-real-ip");
  if (realIp?.trim()) return realIp.trim();

  const cfConnectingIp = readHeader(headers, "cf-connecting-ip");
  if (cfConnectingIp?.trim()) return cfConnectingIp.trim();

  return null;
}

/**
 * @param {import("next/server").NextRequest} request
 * @returns {string | null}
 */
export function getClientIpFromRequest(request) {
  return getClientIpFromHeaders(request.headers);
}

/**
 * Read client IP in Server Components / Route Handlers via next/headers.
 * @returns {Promise<string | null>}
 */
export async function getClientIp() {
  const { headers } = await import("next/headers");
  const headersList = await headers();
  return getClientIpFromHeaders(headersList);
}

/**
 * Headers to forward the client IP to the backend API.
 * @returns {Promise<Record<string, string>>}
 */
export async function getForwardedForHeaders() {
  const ip = await getClientIp();
  if (!ip) return {};
  return { "X-Forwarded-For": ip };
}
