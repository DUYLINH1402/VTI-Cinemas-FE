// Utility to format status values for display
// Handles both Firebase status values (long) and SQL status values (short)

export const formatStatus = (status) => {
  if (!status) return "";
  
  const statusMap = {
    // Firebase statuses (long form)
    "canceled": "Đã hủy",
    "locked": "Đã khóa", 
    "pending": "Chờ xử lý",
    "completed": "Hoàn thành",
    "confirmed": "Đã xác nhận",
    
    // SQL statuses (short form - to avoid database truncation)
    "cancel": "Đã hủy",
    "lock": "Đã khóa",
    "pend": "Chờ xử lý", 
    "done": "Hoàn thành",
    "confirm": "Đã xác nhận"
  };
  
  return statusMap[status.toLowerCase()] || 
         status.charAt(0).toUpperCase() + status.slice(1);
};

export const getStatusClass = (status) => {
  if (!status) return "";
  
  const statusClassMap = {
    // Firebase statuses
    "canceled": "status-canceled",
    "locked": "status-locked",
    "pending": "status-pending",
    "completed": "status-completed", 
    "confirmed": "status-confirmed",
    
    // SQL statuses  
    "cancel": "status-canceled",
    "lock": "status-locked",
    "pend": "status-pending",
    "done": "status-completed",
    "confirm": "status-confirmed"
  };
  
  return statusClassMap[status.toLowerCase()] || `status-${status}`;
};

// For checking if ticket can be canceled (works with both status formats)
export const canCancelTicket = (status) => {
  const cancelableStatuses = ["pending", "pend", "confirmed", "confirm"];
  return cancelableStatuses.includes(status?.toLowerCase());
};

// For checking if ticket can be locked (works with both status formats) 
export const canLockTicket = (status) => {
  const lockableStatuses = ["pending", "pend", "confirmed", "confirm"];
  return lockableStatuses.includes(status?.toLowerCase());
};