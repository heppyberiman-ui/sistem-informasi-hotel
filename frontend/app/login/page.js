"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser, getAuth } from "../../lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (typeof window !== "undefined") {
    const currentAuth = getAuth();

    if (currentAuth) {
      router.replace(currentAuth.isAdmin ? "/admin" : "/");
      return null;
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      const authData = await loginUser(email, password);
      router.replace(authData?.isAdmin ? "/admin" : "/");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-lg-6">
        <div className="card shadow-sm">
          <div className="card-body p-5">
            <h2 className="mb-4">Login User / Admin</h2>
            <p className="text-muted">
              Masukkan email dan password dari tabel users di database backend.
            </p>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contoh@email.com"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary w-100">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
