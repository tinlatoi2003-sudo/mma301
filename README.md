# MMA301 - Room Management App

Ung dung quan ly phong tro duoc xay dung cho project cuoi mon React Native.

## Cau truc thu muc

- `backend`: Express API + MongoDB
- `mobile-app`: ung dung React Native Expo
- `docs`: tai lieu project
- `mobile-web`: de trong cho mo rong
- `web-admin`: de trong cho mo rong

## Cong nghe su dung

- Mobile: React Native + Expo
- Backend: Node.js + Express
- Database: MongoDB Atlas
- Auth: JWT

## Dieu kien can truoc khi chay

- Node.js 18 hoac moi hon
- npm
- Android Studio
- Android SDK + emulator
- MongoDB Atlas cluster

## Setup nhanh

Tu thu muc goc project:

```powershell
npm run setup
```

Script nay se:

- cai dependencies cho `backend`
- cai dependencies cho `mobile-app`
- tao file `backend/.env` neu chua co

## Cau hinh backend

Mo file [backend/.env](C:\Users\Admin\OneDrive\Desktop\MMA301\projectMma301\backend\.env) va cap nhat:

```env
PORT=5000
MONGO_URI=mongodb+srv://your_atlas_username:your_atlas_password@your-cluster.mongodb.net/room-management?retryWrites=true&w=majority&appName=your-cluster
JWT_SECRET=replace_with_a_secure_secret_key
```

Neu dung MongoDB Atlas:

1. Tao database user trong `Database Access`
2. Cap quyen `readWrite` cho database `room-management` hoac `readWriteAnyDatabase`
3. Trong `Network Access`, them IP hien tai hoac `0.0.0.0/0` de test

## Nap du lieu mau

Chay trong [backend](C:\Users\Admin\OneDrive\Desktop\MMA301\projectMma301\backend):

```powershell
npm run seed
```

Tai khoan admin mau:

- Email: `admin@gmail.com`
- Mat khau: `123456`

## Chay backend

Trong [backend](C:\Users\Admin\OneDrive\Desktop\MMA301\projectMma301\backend):

```powershell
npm run dev
```

Neu chay thanh cong, terminal se hien:

```text
Connected to MongoDB
Server is running on port 5000
```

## Chay mobile tren Android Studio

1. Mo Android Studio
2. Vao `Device Manager`
3. Bat emulator Android
4. Trong [mobile-app](C:\Users\Admin\OneDrive\Desktop\MMA301\projectMma301\mobile-app), chay:

```powershell
npm run android
```

App dang su dung API URL:

```js
http://10.0.2.2:5000/api
```

Dia chi nay dung cho Android emulator truy cap backend chay tren may tinh.

## Cac script quan trong

Tu thu muc goc:

```powershell
npm run setup
npm run dev:backend
npm run dev:mobile
npm run android:mobile
```

Hoac chay rieng tung phan:

Trong [backend](C:\Users\Admin\OneDrive\Desktop\MMA301\projectMma301\backend):

```powershell
npm install
npm run seed
npm run dev
```

Trong [mobile-app](C:\Users\Admin\OneDrive\Desktop\MMA301\projectMma301\mobile-app):

```powershell
npm install
npm run android
```

## Chuc nang hien co

- Dang ky, dang nhap
- Xem danh sach phong
- Xem chi tiet phong
- Dat lich xem phong
- Theo doi lich hen
- Admin quan ly phong
- Admin quan ly user
- Admin duyet lich hen
- Dashboard thong ke

## Luu y khi demo

- Chay backend truoc khi mo mobile
- Neu Atlas khong ket noi duoc, kiem tra `Database Access`, `Network Access`, DNS va firewall
- Neu emulator khong mo app, dam bao `adb` nhan thiet bi va Android Studio da bat emulator
