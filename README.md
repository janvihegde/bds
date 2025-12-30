# 🦷 Collateral Management System

A full-stack platform connecting **Dentists** and **Designers**. Dentists can request marketing materials (collateral) for their products, and Designers can upload finished assets for approval.

## 🚀 Features

### ✅ Backend (Completed)
* **Authentication:** Secure Login/Register with JWT & Role-Based Access Control (Dentist vs. Designer).
* **Product Management:** Create, Read, Update, and Delete products.
* **File Handling:** Cloudinary integration for uploading Images, PDFs, Videos, and Word Docs.
* **Workflow Engine:** State management (`New` → `Pending Approval` → `Approved` / `Rejected`).
* **Search & Filter:** Find products by Brand, Name, or Status.
* **Rejection System:** Dentists can reject designs with specific feedback comments.
* **Pagination:** Efficiently handles large lists of products.

### 🚧 Frontend (Next Steps)
* **Dentist Dashboard:** Create requests, review designs, approve/reject work.
* **Designer Dashboard:** Find new jobs, download briefs, upload final designs.

---

## 🛠️ Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB (Mongoose)
* **Storage:** Cloudinary
* **Auth:** JSON Web Tokens (JWT) & bcryptjs

---

## ⚙️ Setup & Installation

1.  **Clone the repo:**
    ```bash
    git clone [https://github.com/YourUsername/collateral-management.git](https://github.com/YourUsername/collateral-management.git)
    cd collateral-management
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Create a `.env` file in the root directory and add:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_key
    CLOUDINARY_API_SECRET=your_secret
    ```

4.  **Run Server:**
    ```bash
    npm run dev
    ```

---

## 📡 API Endpoints

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/create-user` | Register a new user | Public |
| **POST** | `/api/auth/login` | Login & Get Token | Public |
| **GET** | `/api/products` | Get all products (Filter/Search) | Private |
| **GET** | `/api/products/:id` | Get single product details | Private |
| **POST** | `/api/products` | Create Request (Upload Briefs) | **Dentist** |
| **POST** | `/api/products/:id/designs` | Upload Final Design | **Designer** |
| **PUT** | `/api/products/:id/status` | Approve or Reject Design | **Dentist** |
