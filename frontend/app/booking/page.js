"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBooking, getKamarList } from "../../lib/api";

export default function BookingPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({
    nama: "",
    email: "",
    nomorHp: "",
    kamarId: "",
    tanggalCheckIn: "",
    tanggalCheckOut: "",
  });
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadRooms() {
      try {
        const data = await getKamarList();
        setRooms(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingRooms(false);
      }
    }
    loadRooms();
  }, []);

  const selectedRoom = rooms.find(
    (room) => String(Number(room.id_kamar ?? room.id)) === String(form.kamarId),
  );

  const nights = (() => {
    if (!form.tanggalCheckIn || !form.tanggalCheckOut) return 0;
    const start = new Date(form.tanggalCheckIn);
    const end = new Date(form.tanggalCheckOut);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  })();

  const totalHarga = nights * Number(selectedRoom?.harga || 0);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!selectedRoom) {
      setError("Pilih kamar terlebih dahulu.");
      return;
    }

    const idKamar = Number(
      selectedRoom?.id_kamar ?? selectedRoom?.id ?? form.kamarId,
    );
    if (!Number.isFinite(idKamar) || idKamar <= 0) {
      setError("ID kamar tidak valid.");
      return;
    }

    if (nights <= 0) {
      setError("Tanggal check-out harus lebih dari tanggal check-in.");
      return;
    }

    setSaving(true);

    try {
      await createBooking({
        id_user: 1,
        id_kamar: idKamar,
        nama_tamu: form.nama,
        email: form.email,
        no_hp: form.nomorHp,
        checkin: form.tanggalCheckIn,
        checkout: form.tanggalCheckOut,
      });
      router.push("/booking/daftar");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section>
      <div className="mb-4">
        <h1 className="h3">Booking Hotel</h1>
        <p className="text-muted">
          Isi formulir booking untuk memesan kamar hotel.
        </p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        <div className="col-lg-7">
          <div className="card shadow-sm">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Nama Tamu</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.nama}
                    onChange={(e) => setForm({ ...form, nama: e.target.value })}
                    placeholder="Contoh: Budi Santoso"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    placeholder="contoh@email.com"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Nomor HP</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={form.nomorHp}
                    onChange={(e) =>
                      setForm({ ...form, nomorHp: e.target.value })
                    }
                    placeholder="08xxxxxxxxxx"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Pilih Kamar</label>
                  <select
                    className="form-select"
                    value={form.kamarId}
                    onChange={(e) =>
                      setForm({ ...form, kamarId: e.target.value })
                    }
                    required
                  >
                    <option value="">Pilih kamar</option>
                    {rooms.map((room) => {
                      const roomId = Number(room.id_kamar ?? room.id);
                      return (
                        <option key={roomId} value={String(roomId)}>
                          {room.nama || `Kamar ${room.nomor_kamar}`} - Rp{" "}
                          {Number(room.harga || 0).toLocaleString("id-ID")}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Check-in</label>
                    <input
                      type="date"
                      className="form-control"
                      value={form.tanggalCheckIn}
                      onChange={(e) =>
                        setForm({ ...form, tanggalCheckIn: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Check-out</label>
                    <input
                      type="date"
                      className="form-control"
                      value={form.tanggalCheckOut}
                      onChange={(e) =>
                        setForm({ ...form, tanggalCheckOut: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving || loadingRooms}
                >
                  {saving ? "Membuat booking..." : "Buat Booking"}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card shadow-sm border-0 bg-light h-100">
            <div className="card-body">
              <h5 className="card-title">Ringkasan Booking</h5>
              <p className="text-muted small mb-3">
                Total dihitung otomatis dari lama menginap dan tarif kamar yang
                dipilih.
              </p>

              <ul className="list-group list-group-flush mb-3">
                <li className="list-group-item px-0 d-flex justify-content-between">
                  <span>Tamu</span>
                  <strong>{form.nama || "—"}</strong>
                </li>
                <li className="list-group-item px-0 d-flex justify-content-between">
                  <span>Kontak</span>
                  <strong>{form.email || "—"}</strong>
                </li>
                <li className="list-group-item px-0 d-flex justify-content-between">
                  <span>Nomor HP</span>
                  <strong>{form.nomorHp || "—"}</strong>
                </li>
                <li className="list-group-item px-0 d-flex justify-content-between">
                  <span>Kamar</span>
                  <strong>
                    {selectedRoom
                      ? selectedRoom.nama || `Kamar ${selectedRoom.nomor_kamar}`
                      : "Belum dipilih"}
                  </strong>
                </li>
                <li className="list-group-item px-0 d-flex justify-content-between">
                  <span>Durasi</span>
                  <strong>{nights || 0} malam</strong>
                </li>
                <li className="list-group-item px-0 d-flex justify-content-between">
                  <span>Tarif / malam</span>
                  <strong>
                    Rp{" "}
                    {Number(selectedRoom?.harga || 0).toLocaleString("id-ID")}
                  </strong>
                </li>
              </ul>

              <div className="border rounded-3 p-3 bg-white">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-muted">Total Harga</span>
                  <span className="h5 mb-0">
                    Rp {totalHarga.toLocaleString("id-ID")}
                  </span>
                </div>
                <small className="text-muted">
                  {nights > 0
                    ? `Perhitungan: ${nights} malam × Rp ${Number(selectedRoom?.harga || 0).toLocaleString("id-ID")}`
                    : "Pilih kamar dan tanggal menginap untuk melihat total otomatis."}
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
