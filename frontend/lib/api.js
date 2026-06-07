const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

async function apiFetch(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  console.log(`[API] Request -> ${options.method || "GET"} ${url}`);

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    });

    const responseText = await response.text();
    console.log(`[API] Response <- ${response.status} ${url}`, responseText);

    if (!response.ok) {
      throw new Error(responseText || "Request failed");
    }

    return responseText ? JSON.parse(responseText) : null;
  } catch (error) {
    console.error(`[API] Error on ${options.method || "GET"} ${url}`, error);
    throw error;
  }
}

function normalizeListResponse(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.kamar)) return payload.kamar;
  if (Array.isArray(payload?.booking)) return payload.booking;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
}

export async function loginUserApi(email, password) {
  return apiFetch("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function getKamarList() {
  const data = await apiFetch("/kamar");
  return normalizeListResponse(data);
}

export async function getKamarById(id) {
  return apiFetch(`/kamar/${id}`);
}

export async function createKamar(data) {
  return apiFetch("/kamar", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateKamar(id, data) {
  return apiFetch(`/kamar/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteKamar(id) {
  return apiFetch(`/kamar/${id}`, {
    method: "DELETE",
  });
}

export async function getBookingList() {
  const data = await apiFetch("/booking");
  const normalized = normalizeListResponse(data);
  console.log("Booking API response:", normalized);
  return normalized;
}

export async function createBooking(data) {
  return apiFetch("/booking", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateBookingStatus(id, status) {
  return apiFetch(`/booking/${id}`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}
