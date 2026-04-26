# FASHION STORE 

Đồ án Website E-commerce Bán hàng Thời trang (MERN Stack) được thiết kế hiện đại, tinh tế chuẩn Enterprise, bao gồm tính năng Gợi ý Sản phẩm thông minh bằng AI (Rule-Based Recommendation).

## 🚀 Tính năng nổi bật
* **Frontend:** Giao diện Dark mode sang trọng (ReactJS + Vite + Vanilla CSS).
* **Backend:** Node.js, Express, MongoDB (Mongoose), tuân thủ chặt chẽ kiến trúc Controller-Service-Routing (MVC), code gọn và dễ hiểu.
* **Tồn kho:** Trừ/thêm tồn kho bằng `Atomic $inc` chống quá tải/overselling. Mọi đơn hàng snapshot (chụp) lịch sử giá/địa chỉ tại lúc mua.
* **AI Recommendation:**
  * Chủ động theo dõi hành vi User (`view`, `add_to_cart`, `purchase`).
  * Gợi ý sản phẩm thông qua điểm số và luồng trọng số behavior (30 ngày).
  * Fall-back AI (gợi ý hàng bán chạy nhất) nếu Data chưa đủ.

---

## 🛠 Hướng dẫn Cài đặt & Chạy (Local)

### 1. Chuẩn bị Môi trường
* Hãy đảm bảo bạn đã cài đặt sẵn **Node.js** (v18 trở lên).
* Một chuỗi kết nối (Connection String) của **MongoDB** (Hoặc xài bản Local mặc định). Trong repository này, mọi thứ đã nối sẵn với URL MongoDB mẫu trên Cloud (có thể sử dụng trực tiếp).
* Dự án đã có sẵn file env mẫu để deploy nhanh:
  * `backend/.env.example`
  * `frontend/.env.example`

Tạo file env thực tế từ file mẫu:

```bash
cd backend
copy .env.example .env

cd ..\frontend
copy .env.example .env
```

### 1.1 Đổi Link MongoDB
Trong file [backend/.env](backend/.env), sửa biến `MONGODB_URI` sang database mới của bạn:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<db_name>
PORT=5000
JWT_SECRET=your_secret
NODE_ENV=development
AUTO_SEED_ON_EMPTY=true
```

Ghi chú:
* `AUTO_SEED_ON_EMPTY=true`: Khi khởi động backend, nếu DB trống thì tự nạp dữ liệu mẫu.
* Đặt `AUTO_SEED_ON_EMPTY=false` nếu bạn không muốn tự động seed.

Trong file [frontend/.env](frontend/.env), cấu hình API backend:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 1.2 Chuyển Dữ Liệu Từ MongoDB Cũ Sang MongoDB Mới
Nếu muốn mang nguyên dữ liệu cũ sang link mới (không dùng dữ liệu mẫu), dùng MongoDB Database Tools:

```bash
mongodump --uri="<MONGODB_OLD_URI>" --archive=backup.archive --gzip
mongorestore --uri="<MONGODB_NEW_URI>" --archive=backup.archive --gzip --drop
```

Sau khi restore xong, chạy backend bình thường. Vì DB đã có dữ liệu nên cơ chế auto-seed sẽ tự bỏ qua.

### 2. Cài đặt các Package
Cần mở 2 cửa sổ Terminal để chạy song song:

**Terminal 1 (Backend):**
```bash
cd backend
npm install
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm install
```

### 3. Đổ Dữ Liệu Mẫu (Database Seeding) - CỰC KỲ QUAN TRỌNG
Dự án đã có kịch bản dọn dẹp Database và nạp dữ liệu mẫu (Sản phẩm, Đơn hàng, Hành vi AI, Tài khoản). Mở **Terminal 1 (Backend)**:
```bash
npm run seed
```
*(Nếu console báo `Data Seeding Successful!` là đã thành công)*

Ngoài ra có thêm lệnh an toàn chỉ seed khi DB trống (không xóa dữ liệu hiện có):

```bash
npm run seed:if-empty
```

### 4. Khởi động Máy chủ (Start Servers)

**Terminal 1 (Backend):**
```bash
npm run dev
# Server khởi chạy tại: http://localhost:5000
# Nếu DB trống và AUTO_SEED_ON_EMPTY=true, hệ thống sẽ tự import dữ liệu mẫu.
```

**Terminal 2 (Frontend):**
```bash
npm run dev
# Website giao diện tại: http://localhost:5173
```

---

## 🔐 Danh sách Tài khoản & Dữ liệu Mẫu (Dùng sau khi Seed)

Tất cả các tài khoản mặc định đều có mật khẩu là: `password123`

### 🛡 1. Tài khoản Quản trị viên (Admin)
* **Email:** `admin@fashion.com`
* **Password:** `password123`
* *Quyền hạn:* Truy cập phần `/admin` gồm Dashboard (thống kê doanh thu), Quản lý Sản Phẩm, Quản lý Đơn, Kho báu người dùng,...

### 🛍 2. Tài khoản Khách hàng (Đã có hành vi AI)
* **Email:** `john@example.com`
* **Password:** `password123`
* *Trạng thái:* Kịch bản AI đã thiết lập John có hành vi vừa *xem* và *mua* "Áo Sơ mi" & "Áo Oversize". Khi bạn Login tài khoản này, mục "Gợi ý cho bạn" ở trang chủ sẽ lập tức khuyến nghị các sản phẩm Nam đúng Gu!

### 👤 3. Tài khoản Khách hàng (Mới tinh)
* **Email:** `jane@example.com`
* **Password:** `password123`
* *Trạng thái:* Chưa có lịch sử mua hành (New User) -> AI Recommendation sẽ trả về danh mục Fall-back là các sản phẩm **Bán chạy nhất (Best-Selling)**.

---

## 💻 Cấu trúc Thư mục Hệ thống
```text
📦 FashionStore
 ┣ 📂 backend
 ┃ ┣ 📂 src
 ┃ ┃ ┣ 📂 controllers  (Xử lý Logic Response)
 ┃ ┃ ┣ 📂 middlewares  (Phân quyền, Error Handler)
 ┃ ┃ ┣ 📂 models       (Mongoose Schemas)
 ┃ ┃ ┣ 📂 routes       (Định tuyến API)
 ┃ ┃ ┣ 📂 services     (Lõi nghiệp vụ / AI Logic)
 ┃ ┃ ┣ 📜 app.js       (Setup API)
 ┃ ┃ ┣ 📜 seed.js      (Dữ liệu mẫu)
 ┃ ┃ ┗ 📜 server.js    (Entrypoint Cổng Backend)
 ┃ ┗ 📜 package.json
 ┃
 ┗ 📂 frontend
   ┣ 📂 src
   ┃ ┣ 📂 components   (UI Items dùng chung)
   ┃ ┃ ┣ 📂 layout     (Header, Footer, Sidebar Admin..)
   ┃ ┃ ┣ 📂 product    (Card Sản phẩn)
   ┃ ┃ ┗ 📂 ui         (Button, Modal, Input, Badge...)
   ┃ ┣ 📂 context      (Auth & Cart Context)
   ┃ ┣ 📂 hooks
   ┃ ┣ 📂 pages        (Các Trình duyệt hiển thị chính)
   ┃ ┣ 📂 services     (Logic kết nối Axios/Fetch)
   ┃ ┣ 📜 App.jsx      (Khai báo Route)
   ┃ ┗ 📜 index.css    (Core Variable Color cho Dark Theme)
   ┗ 📜 package.json
```
