import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// Fabrique un matcher pour les routes (support regexp simple)
function routeMatchList(list: string[]) {
  return (req: NextRequest) =>
    list.some((pattern) => {
      if (pattern.endsWith("(.*)")) {
        return req.nextUrl.pathname.startsWith(pattern.slice(0, -4));
      }
      return req.nextUrl.pathname === pattern;
    });
}

// — Règles personnalisées pour LMS
const publicRoutes = [
  "/",
  "/auth/sign-in",
  "/auth/sign-up",
  "/auth/forgot-password",
  "/auth/verify-email",
];
const adminRoutes = ["/dashboard", "/dashboard/(.*)"];

const isPublic = routeMatchList(publicRoutes);
const isAdmin = routeMatchList(adminRoutes);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Routes publiques : laisser passer
  if (isPublic(req)) {
    return NextResponse.next();
  }

  // 2. Vérification d’authentification avec Better Auth
  const session = await auth.api.getSession({ headers: req.headers });
  const user = session?.user;

  // 3. Pas connecté → redirection vers /auth/sign-in
  if (!user) {
    const to = encodeURIComponent(pathname + req.nextUrl.search);
    return NextResponse.redirect(`/auth/sign-in?to=${to}`);
  }

  // 5. Routes admin restreintes
  if (isAdmin(req) && user.role !== "admin") {
    return NextResponse.redirect("/dashboard");
  }

  // Tout est OK
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|.*\\..{2,4}$).*)" // ignore static, api/trpc routes
  ]
};
