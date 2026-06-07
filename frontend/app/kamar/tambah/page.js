"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import RoleGuard from "../../../components/RoleGuard";
import { createKamar } from "../../../lib/api";

export default function TambahKamarPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    nomor_kamar: "",
    tipe: "",
    harga: "",
    deskripsi: "",
    fasilitas: "",
    status: "tersedia",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {}, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      await createKamar({
        nomor_kamar: form.nomor_kamar,
        tipe: form.tipe,
        status: form.status,
        harga: Number(form.harga),
        deskripsi: form.deskripsi,
        fasilitas: form.fasilitas,
      });
      sessionStorage.setItem(
        "kamarSuccessMessage",
        "Kamar berhasil ditambahkan.",
      );
      router.push("/kamar");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <RoleGuard allow={["admin"]}>
      <section>
        <div className="mb-4 d-flex flex-column flex-md-row justify-content-between align-items-start gap-3">
          <div>
            <h1 className="h3">Tambah Kamar Baru</h1>
            <p className="text-muted mb-0">
              Tambahkan kamar ke dalam daftar hotel.
            </p>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="card shadow-sm">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Nomor Kamar</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.nomor_kamar}
                  onChange={(e) =>
                    setForm({ ...form, nomor_kamar: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Tipe Kamar</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.tipe}
                  onChange={(e) => setForm({ ...form, tipe: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Status Kamar</label>
                <select
                  className="form-select"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="tersedia">Tersedia</option>
                  <option value="terisi">Terisi</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Harga per Malam</label>
                <input
                  type="number"
                  className="form-control"
                  value={form.harga}
                  onChange={(e) => setForm({ ...form, harga: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Deskripsi</label>
                <textarea
                  className="form-control"
                  rows="4"
                  value={form.deskripsi}
                  onChange={(e) =>
                    setForm({ ...form, deskripsi: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <label className="form-label">Fasilitas</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.fasilitas}
                  onChange={(e) =>
                    setForm({ ...form, fasilitas: e.target.value })
                  }
                  placeholder="Misalnya: AC, Wi-Fi, Breakfast"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? "Menyimpan..." : "Simpan Kamar"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </RoleGuard>
  );
}
