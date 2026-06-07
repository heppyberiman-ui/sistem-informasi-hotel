const db = require("./database");

// Users
function getAllUsers() {
  return db.query("SELECT * FROM users");
}

function getUserById(id) {
  return db.query("SELECT * FROM users WHERE id = ?", [id]);
}

function createUser(user) {
  return db.query(
    "INSERT INTO users (nama, email, phone, role) VALUES (?, ?, ?, ?)",
    [
      user.nama || user.name,
      user.email,
      user.phone || null,
      user.role || "tamu",
    ],
  );
}

function getUserByEmail(email) {
  return db.query("SELECT * FROM users WHERE email = ?", [email]);
}

function registerUser(userData) {
  return db.query(
    "INSERT INTO users (nama, email, password, phone, role) VALUES (?, ?, ?, ?, ?)",
    [
      userData.nama,
      userData.email,
      userData.password,
      userData.phone || null,
      userData.role || "tamu",
    ],
  );
}

// Kamar
function getAllKamar() {
  return db.query("SELECT * FROM kamar");
}

function getKamarById(id) {
  return db.query("SELECT * FROM kamar WHERE id_kamar = ?", [id]);
}

function createKamar(kamar) {
  return db.query(
    "INSERT INTO kamar (nomor_kamar, tipe, harga, status, deskripsi, fasilitas) VALUES (?, ?, ?, ?, ?, ?)",
    [
      kamar.nomor_kamar,
      kamar.tipe,
      kamar.harga,
      kamar.status || "tersedia",
      kamar.deskripsi || "",
      kamar.fasilitas || "",
    ],
  );
}

function updateKamar(id, kamar) {
  return db.query(
    "UPDATE kamar SET nomor_kamar = ?, tipe = ?, harga = ?, status = ?, deskripsi = ?, fasilitas = ? WHERE id_kamar = ?",
    [
      kamar.nomor_kamar,
      kamar.tipe,
      kamar.harga,
      kamar.status || "tersedia",
      kamar.deskripsi || "",
      kamar.fasilitas || "",
      id,
    ],
  );
}

function deleteKamar(id) {
  return db.query("DELETE FROM kamar WHERE id_kamar = ?", [id]);
}

// Booking
function getAllBooking() {
  return db.query(
    `SELECT
       b.id_booking,
       b.id_user,
       b.nama_tamu,
       b.email,
       b.no_hp,
       b.id_kamar,
       k.nomor_kamar,
       k.tipe,
       b.checkin,
       b.checkout,
       b.status
     FROM booking b
     LEFT JOIN kamar k ON b.id_kamar = k.id_kamar`,
  );
}

function getBookingById(id) {
  return db.query("SELECT * FROM booking WHERE id_booking = ?", [id]);
}

function createBooking(booking) {
  return db.query(
    "INSERT INTO booking (id_user, id_kamar, nama_tamu, email, no_hp, checkin, checkout, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [
      booking.id_user,
      booking.id_kamar,
      booking.nama_tamu || null,
      booking.email || null,
      booking.no_hp || null,
      booking.checkin,
      booking.checkout,
      booking.status || "pending",
    ],
  );
}

function updateBooking(id, booking) {
  return db.query(
    "UPDATE booking SET nama_tamu = ?, email = ?, no_hp = ?, checkin = ?, checkout = ?, status = ? WHERE id_booking = ?",
    [
      booking.nama_tamu || null,
      booking.email || null,
      booking.no_hp || null,
      booking.checkin,
      booking.checkout,
      booking.status,
      id,
    ],
  );
}

function updateBookingStatus(id, status) {
  return db.query("UPDATE booking SET status = ? WHERE id_booking = ?", [
    status,
    id,
  ]);
}

function deleteBooking(id) {
  return db.query("DELETE FROM booking WHERE id_booking = ?", [id]);
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  getUserByEmail,
  registerUser,
  getAllKamar,
  getKamarById,
  createKamar,
  updateKamar,
  deleteKamar,
  getAllBooking,
  getBookingById,
  createBooking,
  updateBooking,
  updateBookingStatus,
  deleteBooking,
};
