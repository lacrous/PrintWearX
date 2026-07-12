"use client";

/**
 * Admin auth — client-side check for the static-export build.
 *
 * In a Node-runtime build, replace this with server-side cookie check via
 * `getSession()` + a server component. For static export we read a
 * localStorage flag set by the login flow.
 *
 * The gate's job: tell callers whether the current browser is signed in as
 * an admin. That's it. The route protection itself happens inside the
 * admin layout by inlining the login form when the gate returns false.
 */

const ADMIN_FLAG = "printwearx_admin";

export function isAdmin(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(ADMIN_FLAG) === "1";
  } catch {
    return false;
  }
}

export function setAdmin(value: boolean) {
  if (typeof window === "undefined") return;
  try {
    if (value) window.localStorage.setItem(ADMIN_FLAG, "1");
    else window.localStorage.removeItem(ADMIN_FLAG);
  } catch {}
}