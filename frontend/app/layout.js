import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "Hotel Perhotelan",
  description: "Website hotel modern dengan Next.js dan Bootstrap",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <Navbar />
        <main className="container py-5">{children}</main>

        <footer className="mt-5 py-4 text-white home-footer">
          <div className="container">
            <div className="row g-4 align-items-start">
              <div className="col-md-6">
                <h5 className="fw-semibold mb-2">Grand Horizon Hotel</h5>
                <p className="text-white-50 mb-0 small">
                  Pengalaman menginap modern dengan pelayanan profesional.
                </p>
              </div>
              <div className="col-md-6">
                <ul className="list-unstyled small mb-0 text-white-50">
                  <li className="mb-1">Copyright 2026</li>
                  <li className="mb-1">heppyberiman@gmail.com</li>
                  <li className="mb-1">082288110375</li>
                  <li>jln.budi mulia no 11 jakarta utara</li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
