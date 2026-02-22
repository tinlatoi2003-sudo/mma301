const API_URL = "http://10.0.2.2:5000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...(options.headers || {})
    }
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Request failed");
  }

  return result;
}

export const api = {
  register: (payload) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  login: (payload) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  getRooms: () => request("/rooms"),
  getRoomDetail: (id) => request(`/rooms/${id}`),
  getProfile: (token) =>
    request("/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }),
  createBooking: (token, payload) =>
    request("/bookings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    }),
  getMyBookings: (token) =>
    request("/bookings/mine", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }),
  getAllBookings: (token) =>
    request("/bookings", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }),
  getBookingsByStatus: (token, status) =>
    request(`/bookings?status=${encodeURIComponent(status)}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }),
  updateBookingStatus: (token, bookingId, status) =>
    request(`/bookings/${bookingId}/status`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    }),
  getDashboard: (token) =>
    request("/dashboard/summary", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }),
  createRoom: (token, payload) =>
    request("/rooms", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    }),
  updateRoom: (token, roomId, payload) =>
    request(`/rooms/${roomId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    }),
  deleteRoom: (token, roomId) =>
    request(`/rooms/${roomId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    }),
  getUsers: (token) =>
    request("/users", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }),
  createUserByAdmin: (token, payload) =>
    request("/users", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    }),
  updateUserByAdmin: (token, userId, payload) =>
    request(`/users/${userId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    }),
  deleteUserByAdmin: (token, userId) =>
    request(`/users/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    }),
  updateProfile: (token, payload) =>
    request("/auth/me", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })
};
