const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const {
  getAllKamar,
  getKamarById,
  createKamar,
  updateKamar,
  deleteKamar,
  getAllBooking,
  createBooking,
  updateBooking,
  updateBookingStatus,
  deleteBooking,
  getUserByEmail,
  registerUser,
} = require("./models");

dotenv.config();

const allowedKamarStatus = ["tersedia", "terisi", "maintenance"];

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Hotel Running");
});

app.post("/register", async (req, res) => {
  try {
    const { nama, email, password, role, phone } = req.body;
    const normalizedEmail = String(email || "")
      .trim()
      .toLowerCase();

    if (!nama || !normalizedEmail || !password) {
      return res.status(400).json({
        error: "nama, email, dan password wajib diisi",
      });
    }

    const [existing] = await getUserByEmail(normalizedEmail);
    if (existing.length > 0) {
      return res.status(409).json({ error: "Email sudah terdaftar" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await registerUser({
      nama,
      email: normalizedEmail,
      password: hashedPassword,
      phone,
      role: role || "tamu",
    });

    res.status(201).json({
      message: "Registrasi berhasil",
      user: {
        id: result.insertId,
        nama,
        email: normalizedEmail,
        role: role || "tamu",
        isAdmin: (role || "tamu") === "admin",
      },
    });
  } catch (error) {
    console.error("POST /register error:", error);
    res.status(500).json({ error: "Gagal melakukan registrasi" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = String(email || "")
      .trim()
      .toLowerCase();

    if (!normalizedEmail || !password) {
      return res.status(400).json({
        error: "email dan password wajib diisi",
      });
    }

    const [users] = await getUserByEmail(normalizedEmail);
    if (users.length === 0) {
      return res.status(401).json({ error: "Email atau password salah" });
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Email atau password salah" });
    }

    res.json({
      message: "Login berhasil",
      user: {
        id: user.id,
        nama: user.nama,
        email: user.email,
        role: user.role,
        isAdmin: user.role === "admin",
      },
    });
  } catch (error) {
    console.error("POST /login error:", error);
    res.status(500).json({ error: "Gagal melakukan login" });
  }
});

app.get("/kamar", async (req, res) => {
  try {
    const [rows] = await getAllKamar();
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal mengambil data kamar" });
  }
});

app.get("/kamar/:id_kamar", async (req, res) => {
  try {
    const kamarId = req.params.id_kamar;
    const [rows] = await getKamarById(kamarId);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "Kamar tidak ditemukan" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("GET /kamar/:id_kamar error:", error);
    res.status(500).json({ error: "Gagal mengambil data kamar" });
  }
});

app.post("/kamar", async (req, res) => {
  try {
    const { nomor_kamar, tipe, harga, status, deskripsi, fasilitas } = req.body;

    if (!nomor_kamar || !tipe || typeof harga === "undefined") {
      return res
        .status(400)
        .json({ error: "nomor_kamar, tipe, dan harga wajib diisi" });
    }

    if (status && !allowedKamarStatus.includes(status)) {
      return res.status(400).json({
        error: `Status kamar tidak valid. Pilih salah satu: ${allowedKamarStatus.join(", ")}`,
      });
    }

    const [result] = await createKamar({
      nomor_kamar,
      tipe,
      harga,
      status,
      deskripsi,
      fasilitas,
    });
    res.status(201).json({
      id_kamar: result.insertId,
      nomor_kamar,
      tipe,
      harga,
      status,
      deskripsi,
      fasilitas,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal menambahkan kamar" });
  }
});

app.put("/kamar/:id_kamar", async (req, res) => {
  try {
    const kamarId = req.params.id_kamar;
    const { nomor_kamar, tipe, harga, status, deskripsi, fasilitas } = req.body;

    console.log("PUT /kamar/:id_kamar req.body:", req.body);

    if (!nomor_kamar || !tipe || typeof harga === "undefined" || !status) {
      return res
        .status(400)
        .json({ error: "nomor_kamar, tipe, harga, dan status wajib diisi" });
    }

    if (!allowedKamarStatus.includes(status)) {
      return res.status(400).json({
        error: `Status kamar tidak valid. Pilih salah satu: ${allowedKamarStatus.join(", ")}`,
      });
    }

    const [result] = await updateKamar(kamarId, {
      nomor_kamar,
      tipe,
      harga,
      status,
      deskripsi,
      fasilitas,
    });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Kamar tidak ditemukan" });
    }

    const [updatedRows] = await getKamarById(kamarId);
    res.json(updatedRows[0]);
  } catch (error) {
    console.error("PUT /kamar/:id_kamar error:", error);
    res.status(500).json({ error: "Gagal mengupdate kamar" });
  }
});

app.delete("/kamar/:id_kamar", async (req, res) => {
  try {
    const kamarId = req.params.id_kamar;
    const [result] = await deleteKamar(kamarId);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Kamar tidak ditemukan" });
    }

    res.json({ message: "Kamar berhasil dihapus" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal menghapus kamar" });
  }
});

app.get("/booking", async (req, res) => {
  try {
    const [rows] = await getAllBooking();
    res.json(rows);
  } catch (error) {
    console.error("GET /booking error:", error);
    res.status(500).json({ error: "Gagal mengambil data booking" });
  }
});

app.post("/booking", async (req, res) => {
  try {
    const bookingData = req.body;

    if (
      !bookingData.id_user ||
      !bookingData.id_kamar ||
      !bookingData.checkin ||
      !bookingData.checkout
    ) {
      return res.status(400).json({
        error: "id_user, id_kamar, checkin, dan checkout wajib diisi",
      });
    }

    const [result] = await createBooking(bookingData);
    res.status(201).json({ id_booking: result.insertId, ...bookingData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal menambahkan booking" });
  }
});

app.put("/booking/:id", async (req, res) => {
  try {
    const bookingData = req.body;
    const bookingId = req.params.id;

    const isStatusOnlyUpdate =
      Object.keys(bookingData).length === 1 &&
      typeof bookingData.status !== "undefined";

    if (isStatusOnlyUpdate) {
      const [result] = await updateBookingStatus(bookingId, bookingData.status);

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Booking tidak ditemukan" });
      }

      return res.json({
        message: "Status booking berhasil diupdate",
        booking: {
          id_booking: Number(bookingId),
          status: bookingData.status,
        },
      });
    }

    if (!bookingData.checkin || !bookingData.checkout || !bookingData.status) {
      return res.status(400).json({
        error: "checkin, checkout, dan status wajib diisi",
      });
    }

    const [result] = await updateBooking(bookingId, bookingData);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Booking tidak ditemukan" });
    }

    res.json({
      message: "Booking berhasil diupdate",
      booking: {
        id_booking: Number(bookingId),
        checkin: bookingData.checkin,
        checkout: bookingData.checkout,
        status: bookingData.status,
      },
    });
  } catch (error) {
    console.error("PUT /booking/:id error:", error);
    res.status(500).json({ error: "Gagal mengupdate booking" });
  }
});

app.delete("/booking/:id", async (req, res) => {
  try {
    const bookingId = req.params.id;
    const [result] = await deleteBooking(bookingId);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Booking tidak ditemukan" });
    }

    res.json({
      message: "Booking berhasil dihapus",
      id_booking: Number(bookingId),
    });
  } catch (error) {
    console.error("DELETE /booking/:id error:", error);
    res.status(500).json({ error: "Gagal menghapus booking" });
  }
});

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
