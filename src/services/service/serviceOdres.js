const useFirebase = import.meta.env.VITE_USE_FIREBASE === "true";

import {
  fetchOdersFromFirebase,
  cancelTicketFromFirebase,
  lockTicketFromFirebase,
} from "../firebase/firebaseOders.js";

import api from "../sql/api.js";

// API LẤY DANH SÁCH ORDERS (TẤT CẢ HOẶC THEO EMAIL)
export const fetchOders = async (email, filters = {}, page = 1, limit = 15) => {
  return useFirebase
    ? await fetchOdersFromFirebase(email, filters, page, limit)
    : await fetchOdersFromSQL(email, filters, page, limit);
};

// API HUỶ VÉ
export const cancelTicket = async (ticketId) => {
  return useFirebase
    ? await cancelTicketFromFirebase(ticketId)
    : await cancelTicketFromSQL(ticketId);
};

// API KHOÁ VÉ
export const lockTicket = async (ticketId) => {
  return useFirebase ? await lockTicketFromFirebase(ticketId) : await lockTicketFromSQL(ticketId);
};

// ============= SQL IMPLEMENTATION =============

// API LẤY DANH SÁCH ORDERS TỪ SQL
export const fetchOdersFromSQL = async (email, filters = {}, page = 1, limit = 15) => {
  try {
    const params = {
      page,
      limit,
      ...(email && { email }),
      ...filters
    };
    
    const response = await api.get("/orders", { params });
    return {
      data: response.data.orders || [],
      total: response.data.total || 0
    };
  } catch (error) {
    console.error("Error fetching orders from SQL:", error);
    throw new Error("Failed to fetch orders from SQL");
  }
};

// API HUỶ VÉ TỪ SQL
export const cancelTicketFromSQL = async (ticketId) => {
  try {
    const response = await api.put(`/orders/${ticketId}/status`, {
      status: "cancel" // Use shorter status to avoid truncation error
    });
    return response.status === 200;
  } catch (error) {
    console.error("Error canceling ticket in SQL:", error);
    if (error.response && error.response.data && error.response.data.message) {
      // Handle specific "Data truncated" error
      if (error.response.data.message.includes("Data truncated for column 'status'")) {
        throw new Error("Status value is too long for database column. Please contact administrator.");
      }
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to cancel ticket in SQL");
  }
};

// API KHOÁ VÉ TỪ SQL
export const lockTicketFromSQL = async (ticketId) => {
  try {
    const response = await api.put(`/orders/${ticketId}/status`, {
      status: "lock" // Use shorter status to avoid truncation error
    });
    return response.status === 200;
  } catch (error) {
    console.error("Error locking ticket in SQL:", error);
    if (error.response && error.response.data && error.response.data.message) {
      // Handle specific "Data truncated" error
      if (error.response.data.message.includes("Data truncated for column 'status'")) {
        throw new Error("Status value is too long for database column. Please contact administrator.");
      }
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to lock ticket in SQL");
  }
};
