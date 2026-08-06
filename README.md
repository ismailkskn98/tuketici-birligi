# Tüketici Birliği Kurumsal Web

Next.js frontend ve Express/MySQL backend içeren kurumsal web başlangıç projesi.

## Klasörler

- `frontend/`: Next.js App Router, Tailwind CSS, shadcn tarzı temel UI bileşenleri.
- `backend/`: Express.js API, MySQL migration/seed, auth, public formlar ve admin içerik uçları.

## Hızlı Başlangıç

```bash
npm install
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
npm run migrate
npm run seed
npm run dev:backend
npm run dev:frontend
```

Varsayılan portlar:

- Frontend: `http://localhost:3601`
- Backend: `http://localhost:3402`

Gerçek kurum metinleri, logo, adres ve görseller admin panelinden veya seed verileri güncellenerek eklenmelidir. Mevcut seed içerikleri yalnızca yer tutucu ve içerik ekibi yönlendirme notlarıdır.
