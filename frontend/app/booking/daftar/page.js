"use client";

import { useEffect, useState } from "react";
import RoleGuard from "../../../components/RoleGuard";
import { getBookingList, updateBookingStatus } from "../../../lib/api";

function normalizeBooking(booking) {
  return {
    ...booking,
    nama:
      booking.user_name ||
      booking.nama ||
      booking.tamu ||
      booking.user?.nama ||
      "-",
    email: booking.email || booking.user?.email || "-",
    nomorHp:
      booking.nomor_hp ||
      booking.nomorHp ||
      booking.telepon ||
      booking.no_hp ||
      booking.user?.nomorHp ||
      "-",
    checkin:
      booking.checkin || booking.tanggalCheckIn || booking.check_in || "-",
    checkout:
      booking.checkout || booking.tanggalCheckOut || booking.check_out || "-",
    kamarLabel:
      booking.nomor_kamar ||
      booking.kamar?.nomor_kamar ||
      booking.kamar?.nama ||
      booking.kamarNama ||
      booking.kamarName ||
      booking.id_kamar ||
      "-",
    status: booking.status || "Terkonfirmasi",
  };
}

const STATUS_OPTIONS = ["pending", "confirmed", "cancelled", "completed"];

export default function BookingDaftarPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);

  async function loadBookings() {
    try {
      const data = await getBookingList();
      const normalized = (Array.isArray(data) ? data : []).map(
        normalizeBooking,
      );
      const sorted = normalized.sort((a, b) => {
        const dateA = new Date(a.created_at || a.checkin || 0).getTime();
        const dateB = new Date(b.created_at || b.checkin || 0).getTime();
        return dateB - dateA;
      });
      setBookings(sorted);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBookings();
  }, []);

  async function handleStatusChange(bookingId, nextStatus) {
    setError("");
    setUpdatingId(bookingId);

    try {
      await updateBookingStatus(bookingId, nextStatus);
      await loadBookings();
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  }

  const filteredBookings = bookings.filter((booking) => {
    const search = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !search ||
      [booking.nama, booking.email, booking.kamarLabel]
        .join(" ")
        .toLowerCase()
        .includes(search);
    const matchesStatus =
      statusFilter === "all" ||
      String(booking.status || "").toLowerCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: bookings.length,
    pending: bookings.filter(
      (item) => String(item.status || "").toLowerCase() === "pending",
    ).length,
    confirmed: bookings.filter(
      (item) => String(item.status || "").toLowerCase() === "confirmed",
    ).length,
    cancelled: bookings.filter(
      (item) => String(item.status || "").toLowerCase() === "cancelled",
    ).length,
    today: bookings.filter((item) => {
      const today = new Date().toISOString().slice(0, 10);
      return String(item.checkin || "").startsWith(today);
    }).length,
  };

  return (
    <RoleGuard allow={["admin"]}>
      <section>
        <div className="mb-4">
          <h1 className="h3 fw-bold">Daftar Booking</h1>
          <p className="text-muted mb-0">
            Dashboard admin hotel profesional untuk memantau status booking.
          </p>
        </div>

        <div className="row g-4 mb-4">
          {[
            {
              label: "Total Booking",
              value: stats.total,
              icon: "📊",
              color: "primary",
            },
            {
              label: "Pending",
              value: stats.pending,
              icon: "⏳",
              color: "warning",
            },
            {
              label: "Confirmed",
              value: stats.confirmed,
              icon: "✅",
              color: "success",
            },
            {
              label: "Cancelled",
              value: stats.cancelled,
              icon: "❌",
              color: "danger",
            },
            {
              label: "Booking Hari Ini",
              value: stats.today,
              icon: "📅",
              color: "info",
            },
          ].map((item) => (
            <div className="col-sm-6 col-xl-2" key={item.label}>
              <div className="card shadow-sm border-0 rounded-4 h-100">
                <div className="card-body p-3">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span
                      className={`badge bg-${item.color} bg-opacity-10 text-${item.color} fs-5`}
                    >
                      {item.icon}
                    </span>
                    <small className="text-muted">Live</small>
                  </div>
                  <h3 className="h4 fw-bold mb-1">{item.value}</h3>
                  <p className="text-muted small mb-0">{item.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card shadow-sm border-0 rounded-4 mb-4">
          <div className="card-body p-3 p-md-4">
            <div className="row g-3 align-items-end">
              <div className="col-md-6">
                <label className="form-label small text-muted mb-1">
                  Cari nama atau email
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Contoh: Budi atau budi@mail.com"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label small text-muted mb-1">
                  Filter status
                </label>
                <select
                  className="form-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Semua status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {loading && (
          <div className="alert alert-info">Memuat daftar booking...</div>
        )}
        {error && <div className="alert alert-danger">{error}</div>}

        {!loading && filteredBookings.length === 0 && (
          <div className="alert alert-warning">
            Tidak ada booking yang cocok dengan pencarian atau filter Anda.
          </div>
        )}

        {!loading && filteredBookings.length > 0 && (
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Nama</th>
                      <th>Email</th>
                      <th>Kamar</th>
                      <th>Check-in</th>
                      <th>Check-out</th>
                      <th>Status</th>
                      <th className="text-end">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking) => (
                      <tr
                        key={
                          booking.id || `${booking.email}-${booking.id_kamar}`
                        }
                      >
                        <td>
                          <strong>{booking.nama}</strong>
                          <div className="small text-muted">
                            {booking.nomorHp}
                          </div>
                        </td>
                        <td>{booking.email}</td>
                        <td>{booking.kamarLabel}</td>
                        <td>{booking.checkin}</td>
                        <td>{booking.checkout}</td>
                        <td>
                          <span
                            className={`badge rounded-pill px-3 py-2 ${
                              String(booking.status || "").toLowerCase() ===
                              "pending"
                                ? "bg-warning text-dark"
                                : String(booking.status || "").toLowerCase() ===
                                    "confirmed"
                                  ? "bg-success"
                                  : String(
                                        booking.status || "",
                                      ).toLowerCase() === "cancelled"
                                    ? "bg-danger"
                                    : "bg-secondary"
                            }`}
                          >
                            {booking.status || "Pending"}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex gap-2 justify-content-end">
                            <button
                              type="button"
                              className="btn btn-outline-primary btn-sm rounded-pill"
                              onClick={() => setSelectedBooking(booking)}
                            >
                              Detail
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm rounded-pill"
                              onClick={() =>
                                handleStatusChange(
                                  booking.id_booking || booking.id,
                                  "cancelled",
                                )
                              }
                            >
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {selectedBooking && (
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            role="dialog"
            style={{ background: "rgba(0,0,0,0.35)" }}
          >
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content rounded-4 shadow-lg border-0">
                <div className="modal-header border-0 pb-0">
                  <div>
                    <h5 className="modal-title fw-semibold">Detail Booking</h5>
                    <p className="text-muted small mb-0">
                      Informasi lengkap tamu dan kamar
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setSelectedBooking(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item px-0">
                      <strong>Nama:</strong> {selectedBooking.nama}
                    </li>
                    <li className="list-group-item px-0">
                      <strong>Email:</strong> {selectedBooking.email}
                    </li>
                    <li className="list-group-item px-0">
                      <strong>Nomor HP:</strong> {selectedBooking.nomorHp}
                    </li>
                    <li className="list-group-item px-0">
                      <strong>Kamar:</strong> {selectedBooking.kamarLabel}
                    </li>
                    <li className="list-group-item px-0">
                      <strong>Check-in:</strong> {selectedBooking.checkin}
                    </li>
                    <li className="list-group-item px-0">
                      <strong>Check-out:</strong> {selectedBooking.checkout}
                    </li>
                    <li className="list-group-item px-0">
                      <strong>Status:</strong> {selectedBooking.status}
                    </li>
                  </ul>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setSelectedBooking(null)}
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </RoleGuard>
  );
}
