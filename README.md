# Project MMA301 - Room Management App

Day la bo project cuoi mon React Native theo de tai **ung dung quan ly phong tro**.

## Cong nghe

- Mobile: React Native voi Expo
- Backend: Node.js + Express
- Database: MongoDB
- API: RESTful JSON

## Cau truc thu muc

- `mobile-app`: ung dung React Native
- `backend`: server Express, MongoDB models, API routes
- `docs`: tai lieu mo ta de tai va schema database

## Chuc nang da xay dung

- Dang ky, dang nhap bang JWT
- Hien thi danh sach phong tu API
- Xem chi tiet phong
- Dat lich xem phong
- Xem lich hen cua nguoi dung
- Dashboard thong ke co ban

## API chinh

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/rooms`
- `GET /api/rooms/:id`
- `POST /api/bookings`
- `GET /api/bookings/mine`
- `GET /api/dashboard/summary`

## Cach chay backend

1. Vao thu muc `backend`
2. Tao file `.env` tu `.env.example`
3. Cai package bang `npm install`
4. Chay `npm run seed` de tao du lieu mau
5. Chay `npm run dev`

## Cach chay mobile

1. Vao thu muc `mobile-app`
2. Cai package bang `npm install`
3. Sua `API_URL` trong `mobile-app/src/services/api.js` thanh IP may backend
4. Chay `npm start`
5. Mo Expo Go tren Android de test

## Tai khoan demo

- Admin: dang ky bang email `admin@gmail.com` se duoc gan role `admin`
- User thuong: dang ky bang email bat ky khac

## Ghi chu nop bai

- Ban co san 5+ man hinh va co ket noi backend/database
- Neu muon dat muc diem cao hon, co the them web admin CRUD rieng
- Nen quay video demo cac luong: dang ky, dang nhap, xem phong, dat lich, xem dashboard
