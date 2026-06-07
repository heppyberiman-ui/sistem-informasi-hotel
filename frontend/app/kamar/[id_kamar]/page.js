"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { deleteKamar, getKamarById } from "../../../lib/api";
import { getAuth } from "../../../lib/auth";

export default function KamarDetailPage() {
  const { id_kamar } = useParams();
  const router = useRouter();
  const [kamar, setKamar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    setAuth(getAuth());
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const data = await getKamarById(id_kamar);
        setKamar(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id_kamar]);

  async function handleDelete() {
    const confirmed = window.confirm("Yakin ingin menghapus kamar ini?");
    if (!confirmed) return;

    try {
      await deleteKamar(id_kamar);
      sessionStorage.setItem("kamarSuccessMessage", "Kamar berhasil dihapus.");
      router.push("/kamar");
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) {
    return <div className="alert alert-info">Memuat detail kamar...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!kamar) {
    return <div className="alert alert-warning">Kamar tidak ditemukan.</div>;
  }

  const room = kamar || {};
  const canManageRooms = Boolean(
    auth?.isAdmin ||
    auth?.permissions?.some((permission) =>
      ["admintambah kamar", "edit kamar", "hapus kamar"].includes(permission),
    ),
  );
  const nomorKamarText = room.nomor_kamar || room.nomor || "Belum ditentukan";
  const tipeText = room.tipe || "Tipe kamar belum diisi";
  const hargaText = `Rp ${Number(room.harga || 0).toLocaleString("id-ID")}/malam`;
  const deskripsiText =
    String(room.deskripsi || room.keterangan || "").trim() ||
    "Tidak ada deskripsi tersedia.";

  const fasilitasText = Array.isArray(room.fasilitas)
    ? room.fasilitas.filter(Boolean).join(", ") ||
      "Tidak ada fasilitas yang dilaporkan."
    : String(room.fasilitas || "").trim() ||
      "Tidak ada fasilitas yang dilaporkan.";

  return (
    <section>
      <div className="mb-4 d-flex flex-column flex-md-row justify-content-between align-items-start gap-3">
        <div>
          <h1 className="h3">Detail Kamar</h1>
          <p className="text-muted mb-0">Informasi lengkap kamar hotel.</p>
        </div>
        <Link href="/kamar" className="btn btn-outline-secondary">
          Kembali ke Daftar Kamar
        </Link>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="h4 mb-3">{room.nama || `Kamar ${nomorKamarText}`}</h2>
          <div className="row g-3 mb-4">
            <div className="col-sm-6">
              <p className="mb-2">
                <strong>Nomor Kamar:</strong> {nomorKamarText}
              </p>
              <p className="mb-2">
                <strong>Tipe Kamar:</strong> {tipeText}
              </p>
              <p className="mb-2">
                <strong>Harga per Malam:</strong> {hargaText}
              </p>
            </div>
            <div className="col-sm-6">
              <p className="mb-2">
                <strong>Status:</strong>{" "}
                <span
                  className={`badge bg-${
                    String(room.status || "available").toLowerCase() ===
                      "terisi" ||
                    String(room.status || "available").toLowerCase() ===
                      "booked"
                      ? "danger"
                      : String(room.status || "available").toLowerCase() ===
                          "maintenance"
                        ? "warning"
                        : "success"
                  }`}
                >
                  {String(room.status || "available").trim()
                    ? String(room.status || "available")
                        .toLowerCase()
                        .replace(/\b\w/g, (c) => c.toUpperCase())
                    : "Available"}
                </span>
              </p>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="h6">Deskripsi</h3>
            <p className="mb-3 text-muted">{deskripsiText}</p>

            <h3 className="h6">Fasilitas</h3>
            <p className="mb-0 text-muted">{fasilitasText}</p>
          </div>

          {canManageRooms && (
            <div className="mt-4 d-flex gap-2 flex-wrap">
              <Link
                href={`/kamar/${id_kamar}/edit`}
                className="btn btn-secondary"
              >
                Edit Kamar
              </Link>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDelete}
              >
                Hapus Kamar
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
