"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clearAuth, getAuth } from "../lib/auth";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    setAuth(getAuth());
  }, [pathname]);

  function handleLogout() {
    clearAuth();
    setAuth(null);
    router.push("/login");
  }

  return (
    <header className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        <Link
          href="/"
          className="navbar-brand d-flex align-items-center gap-2 me-3"
        >
          <Image
            src="/images/logo.jpg"
            alt="Grand Horizon Hotel"
            width={40}
            height={40}
            className="rounded-circle border border-light border-opacity-25 shadow-sm"
            style={{ width: 40, height: 40, objectFit: "cover" }}
            unoptimized
          />
          <span className="fw-semibold">Hotel Perhotelan</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link
                href="/"
                className={`nav-link ${pathname === "/" ? "active" : ""}`}
              >
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link
                href="/kamar"
                className={`nav-link ${pathname.startsWith("/kamar") ? "active" : ""}`}
              >
                Kamar
              </Link>
            </li>
            <li className="nav-item">
              <Link
                href="/booking"
                className={`nav-link ${pathname === "/booking" ? "active" : ""}`}
              >
                Booking
              </Link>
            </li>
            <li className="nav-item">
              <Link
                href="/booking/daftar"
                className={`nav-link ${pathname === "/booking/daftar" ? "active" : ""}`}
              >
                Daftar Booking
              </Link>
            </li>
          </ul>
          <div className="d-flex align-items-center gap-3">
            {auth ? (
              <>
                <span className="text-white small">
                  {auth.name} ({auth.role})
                </span>
                <button
                  type="button"
                  className="btn btn-outline-light btn-sm"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="btn btn-outline-light btn-sm">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
