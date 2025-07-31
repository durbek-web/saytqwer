# 📚 Reading Test Application

O'zbek tilida yaratilgan interaktiv test tizimi. O'quvchilar ro'yxatdan o'tib, test ishlaydi va natijalari saqlanadi.

## 🌟 Xususiyatlar

- **O'quvchi paneli**: Ro'yxatdan o'tish va test ishlash
- **Admin paneli**: O'quvchilarni boshqarish va savollar qo'shish
- **Responsive dizayn**: Barcha qurilmalarda ishlaydi
- **LocalStorage**: Ma'lumotlar brauzerda saqlanadi
- **Telegram integratsiyasi**: Natijalar avtomatik yuboriladi

## 🚀 Netlify-ga joylash

### 1. GitHub-ga yuklash
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/reading-test-app.git
git push -u origin main
```

### 2. Netlify-ga joylash
1. [Netlify.com](https://netlify.com) ga kiring
2. "New site from Git" tugmasini bosing
3. GitHub repository-ni tanlang
4. Build settings:
   - **Build command**: bo'sh qoldiring
   - **Publish directory**: `.` (nuqta)
5. "Deploy site" tugmasini bosing

## 📁 Fayl tuzilishi

```
├── oquvchi.html      # O'quvchi paneli
├── oquvchi.js        # O'quvchi funksiyalari
├── admin.html        # Admin paneli
├── admin.js          # Admin funksiyalari
└── README.md         # Bu fayl
```

## 🔧 Sozlash

### Admin paroli
`admin.js` faylida `ADMIN_PASSWORD` o'zgaruvchisini o'zgartiring:
```javascript
const ADMIN_PASSWORD = "your_password_here";
```

### Telegram bot
`oquvchi.js` va `admin.js` fayllarida Telegram bot token va chat ID-ni o'zgartiring:
```javascript
const BOT_TOKEN = "your_bot_token";
const CHAT_ID = "your_chat_id";
```

## 📱 Responsive dizayn

- **Desktop**: Barcha ustunlar ko'rinadi
- **Tablet**: Ba'zi ustunlar yashirilgan
- **Mobile**: Faqat asosiy ustunlar ko'rinadi

## 🎯 Standart test savollari

Sayt ochilganda 5 ta standart savol mavjud:
1. O'zbekiston Respublikasi Oliy Majlisi
2. Davlat tili
3. Poytaxt
4. Mustaqillik sanasi
5. Davlat bayrog'i

## 🔒 Xavfsizlik

- Admin paneli parol bilan himoyalangan
- LocalStorage faqat brauzerda saqlanadi
- XSS va CSRF himoyasi

## 📞 Yordam

Muammolar bo'lsa, GitHub Issues bo'limida yozing.

---

**Yaratuvchi**: AI Assistant  
**Til**: O'zbek tili  
**Texnologiyalar**: HTML, CSS, JavaScript, Tailwind CSS 