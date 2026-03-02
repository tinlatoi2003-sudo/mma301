# Deploy APK Len APKPure

Tai lieu nay dung de build file APK tu Expo va upload len APKPure.

## 1. Dieu kien can

- Da chay duoc app trong `mobile-app`
- Backend da ket noi MongoDB Atlas
- Co tai khoan Expo
- Co tai khoan APKPure Developer

## 2. Build file APK bang EAS

Trong [mobile-app](C:\Users\Admin\OneDrive\Desktop\MMA301\projectMma301\mobile-app):

```powershell
npm install -g eas-cli
eas login
eas build:configure
npm run build:apk
```

Neu build thanh cong, Expo se tra ve mot link de tai file `.apk`.

## 3. Kiem tra APK truoc khi nop

- Cai thu file APK len may Android that
- Kiem tra dang nhap
- Kiem tra xem danh sach phong
- Kiem tra dat lich
- Kiem tra luong admin

## 4. Thong tin upload len APKPure

Ten ung dung:

```text
Room Manager - Quan ly phong tro
```

Ten package:

```text
com.mma301.roommanager
```

Danh muc goi y:

```text
House & Home
```

Mo ta ngan:

```text
Ung dung quan ly phong tro giup nguoi dung xem phong, dat lich xem phong va giup admin quan ly phong, tai khoan va lich hen.
```

Mo ta day du:

```text
Room Manager la ung dung di dong duoc xay dung bang React Native cho bai project MMA301.

Chuc nang chinh:
- Dang ky, dang nhap tai khoan
- Xem danh sach phong tro
- Xem chi tiet phong
- Dat lich xem phong
- Theo doi trang thai lich hen
- Admin quan ly phong cho thue
- Admin quan ly tai khoan nguoi dung
- Admin xac nhan lich hen dang cho duyet
- Dashboard thong ke co ban

Cong nghe su dung:
- React Native Expo
- Node.js Express
- MongoDB Atlas
- RESTful API
```

Tu khoa goi y:

```text
room management, rental, booking, react native, mobile app
```

## 5. Upload len APKPure

Trang upload:

- [APKPure Developer](https://developer.apkpure.com/)
- [Submit APK](https://apkpure.com/developer.html)

Thuc hien:

1. Dang nhap tai khoan developer
2. Chon submit app hoac submit APK
3. Dien thong tin ung dung
4. Upload file `.apk`
5. Upload icon va anh chup man hinh
6. Gui duyet

## 6. Tep nen chuan bi

- 1 file APK ban moi nhat
- 1 icon app PNG
- 3 den 5 anh chup man hinh
- Mo ta ngan
- Mo ta dai
- Thong tin version

## 7. Luu y

- APKPure phu hop voi file `.apk`
- Neu sau nay dua len Google Play thi nen build `.aab`
- Neu backend cua ban online, hay dam bao server van chay khi demo
