export function isProtectedRoute(pathname: string): boolean {
  return pathname === "/dashboard" || pathname.startsWith("/dashboard/");
}
