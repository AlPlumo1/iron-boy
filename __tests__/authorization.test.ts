import { describe, expect, it } from "vitest";

import { isProtectedRoute } from "@/lib/auth/authorization";

describe("isProtectedRoute", () => {
  it("protects the dashboard root", () => {
    expect(isProtectedRoute("/dashboard")).toBe(true);
  });

  it("protects dashboard subroutes", () => {
    expect(isProtectedRoute("/dashboard/activities")).toBe(true);
  });

  it("does not protect unrelated routes", () => {
    expect(isProtectedRoute("/")).toBe(false);
    expect(isProtectedRoute("/auth/login")).toBe(false);
    expect(isProtectedRoute("/auth/signup")).toBe(false);
  });

  it("does not treat similarly named routes as protected", () => {
    expect(isProtectedRoute("/dashboard-test")).toBe(false);
  });
});
