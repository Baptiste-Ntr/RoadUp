import { createClient } from "@/utils/supabase/middleware";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request);

  // Rafraîchir la session si nécessaire
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Routes publiques qui ne nécessitent pas d'authentification
  const publicRoutes = ["/auth", "/api"];
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Si l'utilisateur n'est pas connecté et essaie d'accéder à une route protégée
  if (!user && !isPublicRoute) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  // Si l'utilisateur est connecté et essaie d'accéder à la page d'auth, rediriger vers la home
  if (user && pathname === "/auth") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
