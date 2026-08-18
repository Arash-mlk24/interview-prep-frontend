import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const supportedLocales = ["en", "fa"];
const defaultLocale = "fa";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if pathname starts with a supported locale
  const pathnameHasLocale = supportedLocales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return;
  }

  // Determine locale: check cookie first, fallback to defaultLocale ('fa')
  const savedLocale = request.cookies.get("devprep_lang")?.value;
  const locale =
    savedLocale && supportedLocales.includes(savedLocale)
      ? savedLocale
      : defaultLocale;

  // Preserve path and search params
  const search = request.nextUrl.search;
  const newPath = `/${locale}${pathname === "/" ? "" : pathname}${search}`;
  return NextResponse.redirect(new URL(newPath, request.url));
}

// Backwards compatibility alias
export { proxy as middleware };

export const config = {
  matcher: [
    // Skip static files, Next.js internals, images, favicon
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
