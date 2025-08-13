# Order Status Update Fix Documentation

## Problem Description
The application was experiencing a "Data truncated for column 'status' at row 1" error when staff tried to update order status. This occurred because the SQL functions for order management were referenced but not implemented.

## Root Cause
1. The application supports both Firebase and SQL backends
2. While Firebase functions were properly implemented, SQL functions were missing:
   - `fetchOdersFromSQL()` 
   - `cancelTicketFromSQL()`
   - `lockTicketFromSQL()`
3. When `VITE_USE_FIREBASE=false`, the system would try to call undefined SQL functions
4. The error "Data truncated for column 'status'" suggested the database column had length constraints

## Solution Implemented

### 1. Added Missing SQL Functions
**File: `src/services/service/serviceOdres.js`**
- Implemented `fetchOdersFromSQL()` - fetches orders from SQL backend with pagination and filtering
- Implemented `cancelTicketFromSQL()` - cancels tickets using shorter status value ("cancel" instead of "canceled")
- Implemented `lockTicketFromSQL()` - locks tickets using shorter status value ("lock" instead of "locked")
- Added proper error handling for the specific "Data truncated" error

### 2. Created Status Formatter Utility
**File: `src/utils/statusFormatter.js`**
- `formatStatus()` - translates both short and long status values to user-friendly Vietnamese text
- `getStatusClass()` - provides consistent CSS classes for status styling
- `canCancelTicket()` and `canLockTicket()` - check if actions are allowed based on status

### 3. Updated UI Components
**File: `src/admin/pages/TicketManagement/TicketList/TicketList.jsx`**
- Uses status formatter for consistent display
- Proper button state management for cancel/lock actions
- Handles both Firebase and SQL status formats

**File: `src/admin/pages/TicketManagement/TicketManagementHandle.js`** 
- Export reports now use formatted status values

**File: `src/admin/pages/TicketManagement/TicketList/TicketList.scss`**
- Added CSS styles for all status types including new SQL statuses

## Status Value Mapping

| Database Backend | Cancel Status | Lock Status | Display Text |
|-----------------|---------------|-------------|--------------|
| Firebase        | "canceled"    | "locked"    | "Đã hủy" / "Đã khóa" |
| SQL             | "cancel"      | "lock"      | "Đã hủy" / "Đã khóa" |

The shorter SQL status values prevent database truncation errors while maintaining functionality.

## API Endpoints Used
- `GET /orders` - fetch orders with pagination and filters
- `PUT /orders/{ticketId}/status` - update order status

## Configuration
The system behavior is controlled by the environment variable:
- `VITE_USE_FIREBASE=true` - Uses Firebase functions
- `VITE_USE_FIREBASE=false` - Uses SQL functions

## Testing Recommendations
1. Test with `VITE_USE_FIREBASE=false` to verify SQL functions work
2. Verify status updates don't cause database truncation errors
3. Check that status display is consistent across both backends
4. Test export functionality with both status formats

## Error Handling
The SQL functions now specifically catch and handle "Data truncated for column 'status'" errors with user-friendly messages directing users to contact the administrator if column size issues persist.