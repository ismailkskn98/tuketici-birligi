# Tüketici Birliği Kurumsal Web

Next.js frontend ve Express/MySQL backend içeren kurumsal web başlangıç projesi.

## Klasörler

- `frontend/`: Next.js App Router, Tailwind CSS, shadcn tarzı temel UI bileşenleri.
- `backend/`: Express.js API, MySQL migration/seed, auth, public formlar ve admin içerik uçları.

## Hızlı Başlangıç

```bash
npm install
npm run migrate
npm run seed
npm run dev:backend
npm run dev:frontend
```

Varsayılan portlar:

- Frontend: `http://localhost:3601`
- Backend: `http://localhost:3402`

## Ortam Dosyaları

- Frontend `npm run dev` sırasında `frontend/.env.development`, `npm run build` ve
  `npm run start` sırasında `frontend/.env.production` kullanır.
- Backend `npm run dev` sırasında `backend/.env.development`, `npm run start`
  sırasında `backend/.env.production` kullanır.
- Production veritabanı, JWT, e-posta ve depolama bilgilerini yayına almadan önce
  `backend/.env.production` içinde gerçek değerlerle değiştirin.

Production komutları:

```bash
npm run migrate:production
npm run seed:production
npm run build
npm run start:backend
npm run start:frontend
```

Frontend production sunucusundan önce `npm run build` çalıştırılmalıdır.

## Navicat ile Veritabanı Kurulumu

Node migration/seed komutları yerine SQL çalıştırmak isterseniz önce Navicat'te mevcut
veritabanını seçin, ardından `backend/sql/` klasöründeki dosyaları ad sırasıyla çalıştırın:

1. `2026-08-28_001_schema.sql`
2. `2026-08-28_002_seed.sql`

Ayrıntılı notlar `backend/sql/README.md` dosyasındadır.

Gerçek kurum metinleri, logo, adres ve görseller admin panelinden veya seed verileri güncellenerek eklenmelidir. Mevcut seed içerikleri yalnızca yer tutucu ve içerik ekibi yönlendirme notlarıdır.
