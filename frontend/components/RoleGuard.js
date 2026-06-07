"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getAuth } from "../lib/auth";

export default function RoleGuard({
  children,
  allow = ["admin"],
  fallbackPath = "/login",
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const auth = getAuth();

    if (!auth) {
      router.replace(fallbackPath);
      return;
    }

    const isAllowed = allow.includes(auth.role) || allow.includes("all");

    if (!isAllowed) {
      router.replace(auth.isAdmin ? "/admin" : "/");
      return;
    }

    setReady(true);
  }, [allow, fallbackPath, pathname, router]);

  if (!ready) {
    return null;
  }

  return children;
}
