# Mevcut veritabanına SQL kurulumu

Navicat veya phpMyAdmin içinde önce kullanacağınız mevcut veritabanını seçin. Ardından
dosyaları aşağıdaki sırayla çalıştırın:

1. `2026-08-28_001_schema.sql`
2. `2026-08-28_002_seed.sql`

Dosyalar `CREATE DATABASE`, `DROP DATABASE` veya `USE` çalıştırmaz. Şema dosyası seçili
veritabanında eksik tabloları oluşturur; önceki sürümden kalan tablolara yeni kolon ve
indeksleri tekrar çalıştırılabilir kontrollerle ekler.

Seed dosyası tekrar çalıştırılabilir. Aynı kayıtları çoğaltmaz; doğal anahtarları eşleşen
başlangıç kayıtlarını güncel SQL içeriğiyle günceller, bulunmayanları ekler. Admin panelinden
oluşturulmuş ve seed listesinde bulunmayan kayıtlar etkilenmez.

Varsayılan geliştirme hesapları:

- `admin@tuketiciler.local` / `Admin123!`
- `editor@tuketiciler.local` / `Editor123!`

Bu hesapları yalnızca yerel geliştirmede kullanın. Production ortamında
`npm run seed:production` komutunu tercih edin; bilgiler `backend/.env.production`
dosyasındaki `SEED_*` değerlerinden alınır.

Backend'in aynı veritabanına bağlanması için ilgili env dosyasındaki `DB_NAME` değerinin,
SQL dosyalarını çalıştırırken seçtiğiniz veritabanıyla aynı olduğundan emin olun.
