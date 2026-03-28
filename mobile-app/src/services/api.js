const API_URL = "https://mma301.vercel.app/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...(options.headers || {})
    }
  });

  const raw = await response.text();
  let result = null;

  try {
    result = raw ? JSON.parse(raw) : null;
  } catch (_error) {
    result = null;
  }

  if (!response.ok) {
    if (result?.message) {
      throw new Error(result.message);
    }

    if (raw?.trim().startsWith("<")) {
      throw new Error(
        `API ${response.status}: Endpoint khong ton tai hoac backend chua deploy ban moi`
      );
    }

    throw new Error(`Request failed (${response.status})`);
  }

  if (!result) {
    throw new Error("API tra ve du lieu khong hop le");
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
  payBookingSandbox: (token, bookingId, payload) =>
    request(`/bookings/${bookingId}/pay-sandbox`, {
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
  getConversations: (token) =>
    request("/chat/conversations", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }),
  getConversationMessages: (token, conversationId) =>
    request(`/chat/conversations/${conversationId}/messages`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }),
  sendMessage: (token, conversationId, text) =>
    request(`/chat/conversations/${conversationId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ text })
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
