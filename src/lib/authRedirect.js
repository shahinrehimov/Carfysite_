const LOCALE_PREFIX = /^\/(az|en|ru)(?=\/|$)/;

/**
 * Normalize middleware/login redirect query to an i18n router path.
 */
export function getPostLoginRedirect(searchParams) {
  const redirect = searchParams?.get("redirect");
  if (!redirect) return "/";

  if (!redirect.startsWith("/")) return "/";

  const withoutLocale = redirect.replace(LOCALE_PREFIX, "") || "/";
  return withoutLocale;
}
