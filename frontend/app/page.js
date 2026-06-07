"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const stats = [
  { label: "Kamar Premium", value: "24" },
  { label: "Tingkat Kepuasan", value: "98%" },
  { label: "Review Positif", value: "320+" },
  { label: "Layanan 24/7", value: "Ya" },
];

const highlights = [
  "Wi-Fi gratis berkecepatan tinggi",
  "Breakfast & lounge premium",
  "Lokasi strategis dekat pusat kota",
];

const featuredRooms = [
  {
    title: "Deluxe Suite",
    text: "Kamar luas dengan view kota, tempat tidur premium, dan kamar mandi modern.",
    price: "Rp 650.000 / malam",
  },
  {
    title: "Superior Twin",
    text: "Ideal untuk keluarga atau perjalanan bisnis, dilengkapi fasilitas lengkap.",
    price: "Rp 420.000 / malam",
  },
  {
    title: "Executive Room",
    text: "Ruang istirahat eksklusif dengan lounge dan layanan prioritas.",
    price: "Rp 780.000 / malam",
  },
];

const facilities = [
  {
    icon: "bi-wifi",
    title: "WiFi Gratis",
    text: "Akses internet cepat di seluruh area hotel.",
  },
  {
    icon: "bi-snow",
    title: "AC",
    text: "Kenyamanan udara sejuk di setiap kamar premium.",
  },
  {
    icon: "bi-tv",
    title: "TV Smart",
    text: "Streaming hiburan dan saluran favorit di kamar.",
  },
  {
    icon: "bi-cup-hot",
    title: "Restoran",
    text: "Menu lokal dan internasional setiap hari.",
  },
  {
    icon: "bi-water",
    title: "Kolam Renang",
    text: "Area kolam renang untuk bersantai dan refreshing.",
  },
  {
    icon: "bi-car-front-fill",
    title: "Parkir Luas",
    text: "Parkir aman dengan akses langsung ke lobby.",
  },
  {
    icon: "bi-person-badge",
    title: "Resepsionis 24 Jam",
    text: "Layanan check-in, bantuan, dan kebutuhan tamu nonstop.",
  },
];

const testimonials = [
  {
    name: "Ayu P.",
    quote:
      "Hotel sangat nyaman, bersih, dan pelayanan ramah. Saya betah menginap di sini.",
  },
  {
    name: "Rizky H.",
    quote:
      "Fasilitas lengkap, lokasi strategis, dan proses booking sangat mudah.",
  },
];

export default function HomePage() {
  const galleryImages = [
    { src: "/images/hotel/hotel1.jpeg", alt: "Lobby hotel" },
    { src: "/images/hotel/room1.jpeg", alt: "Kamar deluxe" },
    { src: "/images/hotel/room2.jpeg", alt: "Kamar superior" },
    { src: "/images/hotel/room3.jpeg", alt: "Kamar executive" },
    { src: "/images/hotel/room4.jpeg", alt: "Area kamar premium" },
    { src: "/images/hotel/room5.jpeg", alt: "Area hotel premium" },
  ];
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <section className="pb-5">
      <div className="hero-panel rounded-4 shadow-lg p-4 p-lg-5 mb-5 text-white">
        <div className="row align-items-center g-4">
          <div className="col-lg-7">
            <p className="text-uppercase small fw-semibold mb-3 text-warning">
              Hotel Perhotelan
            </p>
            <h1 className="display-5 fw-bold mb-3 text-shadow">
              Pengalaman menginap modern untuk tamu yang mengutamakan
              kenyamanan.
            </h1>
            <p className="lead mb-4 text-white-50">
              Jelajahi kamar premium, fasilitas lengkap, dan proses booking yang
              cepat melalui antarmuka hotel profesional yang responsif.
            </p>
            <div className="d-flex flex-wrap gap-2 mb-4">
              <Link href="/kamar" className="btn btn-light btn-lg">
                Lihat Kamar
              </Link>
              <Link href="/booking" className="btn btn-outline-light btn-lg">
                Book Now
              </Link>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="glass-card rounded-4 p-4">
              <h3 className="h5 fw-semibold mb-3">Statistik Hotel</h3>
              <div className="row g-3">
                {stats.map((item) => (
                  <div className="col-6" key={item.label}>
                    <div className="stat-box rounded-3 p-3 text-center">
                      <div className="display-6 fw-bold">{item.value}</div>
                      <small className="text-white-50">{item.label}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <div className="card home-card h-100 border-0 rounded-4">
            <div className="card-body p-4">
              <h2 className="h4 fw-semibold mb-3">Kenapa tamu memilih kami</h2>
              <p className="text-muted mb-4">
                Desain yang lebih modern, navigasi yang jelas, dan pengalaman
                booking yang terasa seperti website hotel profesional.
              </p>
              <div className="d-grid gap-3">
                {highlights.map((item) => (
                  <div
                    className="d-flex align-items-start gap-3 feature-pill rounded-3 p-3"
                    key={item}
                  >
                    <span className="badge bg-success-subtle text-success">
                      ✓
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card home-card h-100 border-0 rounded-4">
            <div className="card-body p-4">
              <h3 className="h5 fw-semibold mb-3">Akses cepat</h3>
              <p className="text-muted mb-3">
                Lihat daftar kamar, cek fasilitas, atau lanjutkan ke halaman
                booking.
              </p>
              <Link href="/kamar" className="btn btn-primary w-100 mb-2">
                Lihat Kamar
              </Link>
              <Link href="/booking" className="btn btn-outline-primary w-100">
                Booking Sekarang
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-12">
          <div className="card home-card border-0 rounded-4 p-4">
            <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-end gap-2 mb-3">
              <div>
                <p className="text-uppercase small fw-semibold mb-2 text-primary">
                  Featured Rooms
                </p>
                <h2 className="h3 fw-bold mb-1">Pilihan kamar terbaik kami</h2>
                <p className="text-muted mb-0">
                  Kenikmatan menginap dengan nuansa modern dan pelayanan
                  premium.
                </p>
              </div>
              <Link href="/kamar" className="btn btn-outline-primary">
                Lihat Semua Kamar
              </Link>
            </div>
            <div className="row g-4">
              {featuredRooms.map((room) => (
                <div className="col-md-6 col-xl-4" key={room.title}>
                  <div className="card h-100 border-0 shadow-sm rounded-4">
                    <div className="card-body p-4">
                      <span className="badge bg-primary-subtle text-primary mb-2">
                        Popular
                      </span>
                      <h3 className="h5 fw-semibold mb-2">{room.title}</h3>
                      <p className="text-muted small mb-3">{room.text}</p>
                      <div className="fw-bold text-primary">{room.price}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-12">
          <div className="card home-card border-0 rounded-4 p-4">
            <p className="text-uppercase small fw-semibold mb-2 text-primary">
              Galeri Grand Horizon Hotel
            </p>
            <h2 className="h3 fw-bold mb-1">
              Lihat suasana hotel dan kamar kami yang nyaman.
            </h2>
            <p className="text-muted mb-4">
              Jelajahi visual interior, kamar premium, dan atmosfer hotel yang
              modern.
            </p>
            <div className="row g-4">
              {galleryImages.map((item) => (
                <div className="col-sm-6 col-lg-4" key={item.src}>
                  <button
                    type="button"
                    className="btn p-0 border-0 text-start w-100 gallery-card"
                    onClick={() => setSelectedImage(item)}
                    aria-label={`Lihat gambar ${item.alt}`}
                  >
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100">
                      <div className="overflow-hidden">
                        <Image
                          src={item.src}
                          alt={item.alt}
                          width={600}
                          height={400}
                          className="gallery-image w-100"
                          style={{ height: 220, objectFit: "cover" }}
                          unoptimized
                        />
                      </div>
                      <div className="card-body p-3">
                        <h3 className="h6 fw-semibold mb-1 text-dark">
                          {item.alt}
                        </h3>
                        <p className="text-muted small mb-0">
                          Klik untuk melihat ukuran penuh
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-12">
          <div className="card home-card border-0 rounded-4 p-4">
            <p className="text-uppercase small fw-semibold mb-2 text-primary">
              Fasilitas Hotel
            </p>
            <h2 className="h3 fw-bold mb-3">
              Semua yang Anda butuhkan untuk staycation nyaman
            </h2>
            <div className="row g-4">
              {facilities.map((item) => (
                <div className="col-sm-6 col-xl-4" key={item.title}>
                  <div className="card h-100 border-0 rounded-4 shadow-sm p-3 facility-card">
                    <div className="feature-icon mb-3">
                      <i className={`bi ${item.icon} fs-4`}></i>
                    </div>
                    <h3 className="h6 fw-semibold mb-2 text-dark">
                      {item.title}
                    </h3>
                    <p className="text-muted small mb-0">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-12">
          <div className="card home-card border-0 rounded-4 p-4">
            <p className="text-uppercase small fw-semibold mb-2 text-primary">
              Testimoni Tamu
            </p>
            <h2 className="h3 fw-bold mb-3">Apa kata tamu tentang kami</h2>
            <div className="row g-4">
              {testimonials.map((item) => (
                <div className="col-md-6" key={item.name}>
                  <div className="card border-0 rounded-4 shadow-sm p-4 h-100">
                    <div className="text-warning mb-2">★★★★★</div>
                    <p className="text-muted mb-3">“{item.quote}”</p>
                    <strong className="text-dark">{item.name}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedImage && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ background: "rgba(0,0,0,0.45)" }}
        >
          <div
            className="modal-dialog modal-dialog-centered modal-lg"
            role="document"
          >
            <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
              <div className="modal-header border-0 pb-0">
                <div>
                  <h5 className="modal-title fw-semibold">
                    {selectedImage.alt}
                  </h5>
                  <p className="text-muted small mb-0">
                    Preview ukuran penuh galeri hotel
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedImage(null)}
                ></button>
              </div>
              <div className="modal-body p-0">
                <Image
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  width={1200}
                  height={800}
                  className="w-100"
                  style={{ objectFit: "cover", maxHeight: 500 }}
                  unoptimized
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="home-footer rounded-4 p-4 mt-4">
        <div className="row g-4 align-items-start">
          <div className="col-md-4">
            <h3 className="h5 fw-semibold mb-2">Hotel Perhotelan</h3>
            <p className="text-white-50 small mb-0">
              Penginapan modern dengan fasilitas premium untuk perjalanan bisnis
              maupun liburan.
            </p>
          </div>
          <div className="col-md-4">
            <h4 className="h6 fw-semibold mb-2">Kontak</h4>
            <ul className="list-unstyled small text-white-50 mb-0">
              <li>Alamat: Jl. Merdeka No. 12, Jakarta</li>
              <li>Email: info@hotelperhotelan.com</li>
              <li>Telepon: +62 21 555 1234</li>
            </ul>
          </div>
          <div className="col-md-4 text-md-end">
            <h4 className="h6 fw-semibold mb-2">Jam Operasional</h4>
            <p className="text-white-50 small mb-0">
              Check-in 14.00 WIB
              <br />
              Check-out 12.00 WIB
            </p>
          </div>
        </div>
      </footer>
    </section>
  );
}
