# API Documentation

This document outlines the available API endpoints for the admin panel system.

## Authentication

Most endpoints require JWT authentication. Include the following headers:

```
Authorization: Bearer ${JWT_Token}
Content-Type: application/json
```

---

## Admin Management

### 1. Admin Login
**Endpoint:** `/api/admin_login`  
**Method:** `POST`

Authenticate an admin user and obtain a JWT token.

**Request Body:**
```json
{
  "email": "string",
  "chat_id": "integer",
  "username": "string",
  "password": "string",
  "twofa": "string"
}
```

### 2. Get Admins
**Endpoint:** `/api/get_admins`  
**Method:** `POST`  
**Authentication:** Required

Retrieve a list of all administrators.

**Request Body:**
```json
{
  "chat_id": "integer"
}
```

### 3. Add Admin
**Endpoint:** `/api/add_admin`  
**Method:** `POST`  
**Authentication:** Required

Add a new administrator to the system.

**Request Body:**
```json
{
  "new_admin_chat_id": "string",
  "admin_chat_id": "integer",
  "role": "string",
  "password": "string",
  "email": "string",
  "username": "string"
}
```

**Notes:**
- `new_admin_chat_id`: Chat ID of the new admin being added
- `admin_chat_id`: Chat ID of the admin performing the action
- `role`: Available roles can be found in `/api/get_admins` response

---

## User Verification

### 4. Admin Action Verification
**Endpoint:** `/api/admin_action_verification`  
**Method:** `POST`  
**Authentication:** Required

Process admin decisions on user verification requests.

**Request Body:**
```json
{
  "chat_id": "string",
  "admin_chat_id": "integer",
  "status": "string",
  "identification_number": "string"
}
```

**Notes:**
- `status`: Admin's decision (available statuses can be found on the admin page)
- `identification_number`: Available in `/api/get_user_verification_details` response

### 5. Get User Verification Details
**Endpoint:** `/api/get_user_verification_details`  
**Method:** `POST`  
**Authentication:** Required

Retrieve detailed verification information for a specific user.

**Request Body:**
```json
{
  "chat_id": "string",
  "admin_chat_id": "integer"
}
```

---

## Item Management

### 6. Admin Unlist Item
**Endpoint:** `/api/admin_unlist_item`  
**Method:** `POST`  
**Authentication:** Required

Remove an item from the marketplace listings.

**Request Body:**
```json
{
  "itemId": "string",
  "chat_id": "integer",
  "seller_chat_id": "integer",
  "reports": "string (optional)"
}
```

**Notes:**
- `reports`: Optional field containing comma-separated report IDs (available in `/api/get_report_messages` response)

### 7. Get Seller Items (Admin)
**Endpoint:** `/api/get_seller_items_admin`  
**Method:** `GET`  
**Authentication:** Required

Retrieve paginated list of items for a specific seller.

**URL Parameters:**
- `chat_id` (required): Seller's chat ID
- `start` (optional, default: 0): Start index for pagination
- `limit` (optional, default: 20): Number of items to return

**Example:**
```
GET /api/get_seller_items_admin?chat_id=12345&start=0&limit=20
```

**Notes:**
- Increment `start` by 20 for each page load
- Recommended to keep `limit` ≤ 20 to avoid database bottlenecks

### 8. Get Item Details
**Endpoint:** `/api/get_item_details`  
**Method:** `GET`  
**Authentication:** Required

Retrieve detailed information about a specific item.

**URL Parameters:**
- `item_id` (required): Item ID of the requested item

**Example:**
```
GET /api/get_item_details?item_id=12345
```

---

## Communication

### 9. WebApp Data
**Endpoint:** `/api/webapp_data`  
**Method:** `POST`  
**Authentication:** Required

Send messages from admin to users through the web application.

**Request Body:**
```json
{
  "message": "string (optional)",
  "user_chatId": "integer",
  "admin_chatId": "integer",
  "sender_type": "admin"
}
```

**Notes:**
- `message`: Optional message text data
- `sender_type`: Must be set to "admin"

---

## User Management

### 10. Get Igebeya Users
**Endpoint:** `/api/get_igebeya_users`  
**Method:** `GET`  
**Authentication:** Required

Retrieve paginated list of all platform users.

**URL Parameters:**
- `start` (optional, default: 0): Start index for pagination
- `limit` (optional, default: 20): Number of users to return

**Example:**
```
GET /api/get_igebeya_users?start=0&limit=20
```

**Notes:**
- Increment `start` by 20 for each page load
- Recommended to keep `limit` ≤ 20 to avoid database bottlenecks

---

## Task Management

### 11. Claim Tasks
**Endpoint:** `/api/claim_tasks`  
**Method:** `POST`  
**Authentication:** Required

Airdrop boost tokens to users through admin actions.

**Request Body:**
```json
{
  "chat_id": "integer",
  "type": "adminairdrop",
  "admin_chat_id": "integer"
}
```

**Notes:**
- `chat_id`: Chat ID of the user receiving the airdrop
- `type`: Must be set to "adminairdrop"
- `admin_chat_id`: Chat ID of the admin performing the action

---

## Reporting

### 12. Get Report Messages
**Endpoint:** `/api/get_report_messages`  
**Method:** `GET`  
**Authentication:** Required

Retrieve report messages for a specific item.

**URL Parameters:**
- `item_id` (required): Item ID of the reported item
- `chat_id` (required): Chat ID of the item owner

**Example:**
```
GET /api/get_report_messages?item_id=12345&chat_id=67890
```

---

## General Notes

- All endpoints (except `/api/admin_login`) require JWT authentication
- Use pagination parameters (`start` and `limit`) for endpoints returning large datasets
- Keep pagination limits reasonable (≤ 20) to maintain optimal database performance
- Error responses will include appropriate HTTP status codes and error messages