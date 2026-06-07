"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { deleteKamar, getKamarList } from "../../lib/api";
import { getAuth } from "../../lib/auth";

const roomProfiles = {
  101: {
    nama: "Kamar 101",
    tipe: "Deluxe Garden View",
    harga: 850000,
    fasilitas: ["Wi-Fi", "AC", "Breakfast", "TV LED"],
    status: "available",
    image: "/images/hotel/room1.jpeg",
  },
  102: {
    nama: "Kamar 102",
    tipe: "Executive City View",
    harga: 980000,
    fasilitas: ["Wi-Fi", "AC", "Mini Bar", "Shower"],
    status: "booked",
    image: "/images/hotel/room2.jpeg",
  },
  103: {
    nama: "Kamar 103",
    tipe: "Family Suite",
    harga: 1200000,
    fasilitas: ["2 Queen Bed", "Balcony", "Breakfast", "Living Area"],
    status: "available",
    image: "/images/hotel/room3.jpeg",
  },
  104: {
    nama: "Kamar 104",
    tipe: "Premier Loft",
    harga: 1450000,
    fasilitas: ["Jacuzzi", "Workspace", "Dining Set", "City View"],
    status: "maintenance",
    image: "/images/hotel/room4.jpeg",
  },
  105: {
    nama: "Kamar 105",
    tipe: "Royal Suite",
    harga: 1800000,
    fasilitas: ["King Bed", "Bathtub", "Butler", "Premium Lounge"],
    status: "available",
    image: "/images/hotel/room5.jpeg",
  },
  106: {
    nama: "Kamar 106",
    tipe: "Deluxe Pool View",
    harga: 1100000,
    fasilitas: ["Pool Access", "AC", "Breakfast", "Balcony"],
    status: "booked",
    image: "/images/hotel/hotel1.jpeg",
  },
};

const getStatusBadge = (status) => {
  const normalized = (status || "available").toLowerCase();

  switch (normalized) {
    case "available":
    case "tersedia":
      return { variant: "success", label: "Available" };
    case "booked":
    case "terisi":
      return { variant: "danger", label: "Booked" };
    case "maintenance":
      return { variant: "warning", label: "Maintenance" };
    default:
      return { variant: "secondary", label: status || "Unknown" };
  }
};

const formatPrice = (value) =>
  `Rp ${Number(value || 0).toLocaleString()} / malam`;

const normalizeRoomNumber = (room) =>
  Number(room?.nomor_kamar ?? room?.nomor ?? room?.id_kamar ?? 0);

const normalizeFacilities = (value) => {
  if (Array.isArray(value)) {
    return value.filter(Boolean).map((item) => String(item).trim());
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const getRoomProfile = (room) => {
  const roomNumber = normalizeRoomNumber(room);
  const preset = roomProfiles[roomNumber] || null;

  return {
    ...room,
    nama: room.nama || preset?.nama || `Kamar ${roomNumber || "Baru"}`,
    nomor_kamar: (room.nomor_kamar ?? room.nomor ?? roomNumber) || "",
    tipe: room.tipe || preset?.tipe || "Standar",
    harga: Number(room.harga ?? preset?.harga ?? 0),
    fasilitas: normalizeFacilities(room.fasilitas || preset?.fasilitas || []),
    status: room.status || preset?.status || "available",
    gambar:
      room.gambar ||
      room.image ||
      room.foto ||
      preset?.image ||
      "/images/hotel/hotel1.jpeg",
  };
};

export default function KamarPage() {
  const [kamar, setKamar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getKamarList();
        setKamar((data || []).map((room) => getRoomProfile(room)));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    setAuth(getAuth());
  }, []);

  useEffect(() => {
    const queuedMessage = sessionStorage.getItem("kamarSuccessMessage");
    if (queuedMessage) {
      setSuccessMessage(queuedMessage);
      sessionStorage.removeItem("kamarSuccessMessage");
    }
  }, []);

  async function handleDelete(id) {
    const confirmed = window.confirm("Yakin ingin menghapus kamar ini?");
    if (!confirmed) return;

    try {
      await deleteKamar(id);
      setKamar(kamar.filter((item) => item.id_kamar !== id));
      setSuccessMessage("Kamar berhasil dihapus.");
    } catch (err) {
      setError(err.message);
    }
  }

  const canManageRooms = Boolean(
    auth?.isAdmin ||
    auth?.permissions?.some((permission) =>
      ["admintambah kamar", "edit kamar", "hapus kamar"].includes(permission),
    ),
  );

  const filteredKamar = kamar.filter((room) => {
    const search = searchTerm.toLowerCase().trim();
    const badge = getStatusBadge(room.status);
    const matchesSearch =
      !search ||
      [room.tipe, room.nama, room.nomor_kamar, String(room.harga), badge.label]
        .join(" ")
        .toLowerCase()
        .includes(search);
    const matchesAvailable = !availableOnly || badge.label === "Available";

    return matchesSearch && matchesAvailable;
  });

  return (
    <section>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-4">
        <div>
          <h1 className="h3 fw-bold">Daftar Kamar</h1>
          <p className="text-muted mb-0">
            Pilih kamar premium dengan status real-time, harga transparan, dan
            tombol booking cepat.
          </p>
        </div>
        {canManageRooms && (
          <Link href="/kamar/tambah" className="btn btn-primary mt-3 mt-md-0">
            Tambah Kamar Baru
          </Link>
        )}
      </div>

      {loading && <div className="alert alert-info">Memuat kamar...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {successMessage && (
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
      )}

      {!loading && (
        <div className="card shadow-sm border-0 rounded-4 mb-4">
          <div className="card-body p-3 p-md-4">
            <div className="row g-3 align-items-end">
              <div className="col-md-8">
                <label
                  htmlFor="roomSearch"
                  className="form-label small text-muted mb-1"
                >
                  Cari kamar berdasarkan tipe, harga, atau status
                </label>
                <input
                  id="roomSearch"
                  type="text"
                  className="form-control"
                  placeholder="Contoh: Deluxe, 500000, Available"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="col-md-4 d-flex align-items-center justify-content-md-end">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="availableOnly"
                    checked={availableOnly}
                    onChange={(e) => setAvailableOnly(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="availableOnly">
                    Tampilkan kamar tersedia saja
                  </label>
                </div>
              </div>
            </div>
            <div className="mt-3 text-muted small">
              Menampilkan {filteredKamar.length} dari {kamar.length} kamar
            </div>
          </div>
        </div>
      )}

      {!loading && filteredKamar.length === 0 && (
        <div className="alert alert-warning">
          Tidak ada kamar yang cocok dengan pencarian atau filter Anda.
        </div>
      )}

      <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
        {filteredKamar.map((room) => {
          const badge = getStatusBadge(room.status);
          const facilities = normalizeFacilities(room.fasilitas);
          return (
            <div className="col" key={room.id_kamar}>
              <article className="card card-room shadow-lg h-100 border-0 rounded-4 overflow-hidden bg-white">
                <div className="position-relative overflow-hidden">
                  <Image
                    src={room.gambar}
                    alt={room.nama || `Kamar ${room.nomor_kamar}`}
                    width={600}
                    height={400}
                    className="card-img-top room-card-image"
                    style={{ width: "100%", height: 210, objectFit: "cover" }}
                    unoptimized
                  />
                  <span
                    className={`badge position-absolute top-0 end-0 m-3 rounded-pill px-3 py-2 shadow-sm ${
                      badge.variant === "success"
                        ? "bg-success"
                        : badge.variant === "danger"
                          ? "bg-danger"
                          : badge.variant === "warning"
                            ? "bg-warning text-dark"
                            : "bg-secondary"
                    }`}
                  >
                    {badge.label}
                  </span>
                </div>
                <div className="card-body d-flex flex-column p-4">
                  <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                    <div>
                      <p className="text-uppercase small text-primary fw-semibold mb-1">
                        {room.tipe}
                      </p>
                      <h5 className="card-title mb-1 fw-semibold text-dark">
                        {room.nama}
                      </h5>
                      <p className="text-muted small mb-0">
                        Nomor kamar: {room.nomor_kamar || "-"}
                      </p>
                    </div>
                  </div>
                  <p className="text-muted small mb-3">
                    {room.deskripsi ||
                      "Kamar nyaman dengan fasilitas lengkap untuk pengalaman menginap yang maksimal."}
                  </p>
                  <div className="mb-3">
                    <div className="small text-uppercase text-muted mb-2">
                      Fasilitas
                    </div>
                    <div className="d-flex flex-wrap gap-2">
                      {facilities.map((item) => (
                        <span
                          key={`${room.id_kamar}-${item}`}
                          className="badge rounded-pill bg-light text-dark border"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-3 px-3 py-2 mb-3 border border-light-subtle bg-light">
                    <div className="small text-uppercase text-muted">
                      Harga per malam
                    </div>
                    <strong className="text-primary fs-5">
                      {formatPrice(room.harga)}
                    </strong>
                    <div className="small text-muted mt-1">
                      Status: {badge.label}
                    </div>
                  </div>
                  <div className="d-flex gap-2 flex-wrap mt-auto">
                    <Link
                      href={`/kamar/${room.id_kamar}`}
                      className="btn btn-outline-primary btn-sm flex-fill rounded-pill"
                    >
                      Detail
                    </Link>
                    <Link
                      href="/booking"
                      className="btn btn-primary btn-sm flex-fill rounded-pill shadow-sm"
                    >
                      Booking
                    </Link>
                  </div>
                  {canManageRooms && (
                    <div className="d-flex gap-2 flex-wrap mt-2">
                      <Link
                        href={`/kamar/${room.id_kamar}/edit`}
                        className="btn btn-secondary btn-sm"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(room.id_kamar)}
                      >
                        Hapus
                      </button>
                    </div>
                  )}
                </div>
              </article>
            </div>
          );
        })}
      </div>
    </section>
  );
}
