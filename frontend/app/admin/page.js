"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import RoleGuard from "../../components/RoleGuard";
import { getBookingList, getKamarList } from "../../lib/api";
import { getAuth } from "../../lib/auth";

export default function AdminDashboardPage() {
  const [auth, setAuth] = useState(null);
  const [stats, setStats] = useState({
    totalKamar: 0,
    totalBooking: 0,
    bookingPending: 0,
    bookingConfirmed: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    setAuth(getAuth());
  }, []);

  useEffect(() => {
    async function loadStats() {
      try {
        const kamar = await getKamarList();
        const bookings = await getBookingList();

        const normalizedBookings = Array.isArray(bookings) ? bookings : [];

        setStats({
          totalKamar: Array.isArray(kamar) ? kamar.length : 0,
          totalBooking: normalizedBookings.length,
          bookingPending: normalizedBookings.filter(
            (item) => String(item.status || "").toLowerCase() === "pending",
          ).length,
          bookingConfirmed: normalizedBookings.filter(
            (item) => String(item.status || "").toLowerCase() === "confirmed",
          ).length,
        });
      } catch (error) {
        console.error("Gagal memuat statistik admin:", error);
      } finally {
        setLoadingStats(false);
      }
    }

    loadStats();
  }, []);

  return (
    <RoleGuard allow={["admin"]}>
      <section>
        <div className="mb-4">
          <h1 className="h3 fw-bold">Dashboard Admin</h1>
          <p className="text-muted mb-0">
            Panel utama untuk mengelola kamar dan melihat booking.
          </p>
        </div>

        <div className="row g-4 mb-4">
          {[
            {
              label: "Total Kamar",
              value: stats.totalKamar,
              icon: "🛏️",
              color: "primary",
            },
            {
              label: "Total Booking",
              value: stats.totalBooking,
              icon: "📋",
              color: "info",
            },
            {
              label: "Booking Pending",
              value: stats.bookingPending,
              icon: "⏳",
              color: "warning",
            },
            {
              label: "Booking Confirmed",
              value: stats.bookingConfirmed,
              icon: "✅",
              color: "success",
            },
          ].map((item) => (
            <div className="col-sm-6 col-xl-3" key={item.label}>
              <div className="card shadow-sm border-0 rounded-4 h-100">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <span
                      className={`badge bg-${item.color} bg-opacity-10 text-${item.color} fs-5`}
                    >
                      {item.icon}
                    </span>
                    <span className="text-muted small">Live</span>
                  </div>
                  <h2 className="h4 fw-bold mb-1">{item.value}</h2>
                  <p className="text-muted mb-0 small">{item.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {loadingStats && (
          <div className="alert alert-info">Memuat statistik dashboard...</div>
        )}

        <div className="row g-4">
          <div className="col-md-6 col-xl-4">
            <div className="card shadow-sm h-100 border-0 rounded-4">
              <div className="card-body p-4">
                <h2 className="h5 fw-semibold mb-2">Kelola Kamar</h2>
                <p className="text-muted small mb-3">
                  Tambah, edit, dan hapus data kamar dari satu tempat.
                </p>
                <Link href="/kamar" className="btn btn-primary w-100">
                  Lihat Daftar Kamar
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-xl-4">
            <div className="card shadow-sm h-100 border-0 rounded-4">
              <div className="card-body p-4">
                <h2 className="h5 fw-semibold mb-2">Booking</h2>
                <p className="text-muted small mb-3">
                  Pantau seluruh booking yang masuk dari tamu.
                </p>
                <Link
                  href="/booking/daftar"
                  className="btn btn-outline-primary w-100"
                >
                  Lihat Semua Booking
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-xl-4">
            <div className="card shadow-sm h-100 border-0 rounded-4">
              <div className="card-body p-4">
                <h2 className="h5 fw-semibold mb-2">Status Akun</h2>
                <p className="text-muted small mb-3">
                  Anda login sebagai role {auth?.role || "admin"}.
                </p>
                <span className="badge bg-success">Akses admin aktif</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </RoleGuard>
  );
}
