# Navicat SQL kurulumu

Navicat'te MySQL bağlantısını açıp dosyaları aşağıdaki sırayla çalıştırın:

1. `2026-08-28_001_schema.sql`
2. `2026-08-28_002_seed.sql`

Şema dosyası `tuketiciler_birligi` veritabanını ve API'nin kullandığı tabloları oluşturur.
Seed dosyası tekrar çalıştırılabilir; geliştirme admin hesaplarını, başlangıç ayarlarını,
içerikleri, hero kayıtlarını, il haritasını ve yönetim kurulu kayıtlarını ekler.

Varsayılan geliştirme hesapları:

- `admin@tuketiciler.local` / `Admin123!`
- `editor@tuketiciler.local` / `Editor123!`

Bu hesapları yalnızca yerel geliştirmede kullanın. Production ortamında
`npm run seed:production` komutunu tercih edin; bilgiler `backend/.env.production`
dosyasındaki `SEED_*` değerlerinden alınır.

Veritabanı adını değiştirecekseniz iki SQL dosyasındaki `CREATE DATABASE` / `USE`
satırlarını ve ilgili backend env dosyasındaki `DB_NAME` değerini birlikte güncelleyin.
