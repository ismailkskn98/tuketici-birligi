SET NAMES utf8mb4;
USE `tuketiciler_birligi`;

START TRANSACTION;

-- Varsayılan geliştirme hesapları: admin@tuketiciler.local / Admin123!
-- ve editor@tuketiciler.local / Editor123!
INSERT INTO `admin_users` (`name`, `email`, `password_hash`, `role`, `is_active`)
VALUES
  ('Sistem Yöneticisi', 'admin@tuketiciler.local', '$2a$12$pLBBhKVqJCWyR15OtIn/zO6AYgq90ny3S8/Aa2nwpta5adpmSJ0WW', 'super_admin', 1),
  ('İçerik Editörü', 'editor@tuketiciler.local', '$2a$12$yywZcSjStUZExhv7SWx7G.xOtQZ1Crxs/hHsiXOJrFoFgK99yj4I6', 'editor', 1)
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `role` = VALUES(`role`),
  `is_active` = 1;

SET @seed_admin_id = (
  SELECT `id`
  FROM `admin_users`
  WHERE `email` = 'admin@tuketiciler.local'
  LIMIT 1
);

INSERT INTO `site_settings` (`locale`, `key_name`, `value`, `value_type`)
VALUES
  ('tr', 'organizationName', 'Tüketici Birliği', 'string'),
  ('tr', 'shortName', 'Tüketici Birliği', 'string'),
  ('tr', 'description', 'Kurum tanıtımı, ekip ve çalışma alanları için özgün metinler içerik ekibi tarafından hazırlanacaktır.', 'string'),
  ('tr', 'phone', 'Telefon bilgisi eklenecek', 'string'),
  ('tr', 'email', 'iletisim@ornek-domain.org', 'string'),
  ('tr', 'kep', 'KEP adresi eklenecek', 'string'),
  ('tr', 'address', 'Açık adres bilgisi eklenecek', 'string'),
  ('tr', 'workingHours', 'Hafta içi çalışma saatleri eklenecek', 'string'),
  ('tr', 'mapQuery', 'Ankara', 'string'),
  ('tr', 'socialLinks', '{"x":"","facebook":"","instagram":"","youtube":""}', 'json')
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`),
  `value_type` = VALUES(`value_type`);

INSERT INTO `content_items`
  (`type`, `locale`, `title`, `slug`, `summary`, `body`, `status`, `is_featured`,
   `published_at`, `meta_title`, `meta_description`)
VALUES
  (
    'guide', 'tr', 'Ayıplı Mal ve Hizmet Başvuruları',
    'ayipli-mal-ve-hizmet-basvurulari',
    'Bu rehberin nihai metni hukuk ve içerik ekibi tarafından özgün olarak hazırlanacaktır.',
    'İçerik ekibi notu: Başvuru şartları, gerekli belgeler, süreler ve tüketicinin izleyeceği adımlar sade bir dille anlatılmalıdır.',
    'published', 1, NOW(), 'Ayıplı Mal ve Hizmet Başvuruları',
    'Bu rehberin nihai metni hukuk ve içerik ekibi tarafından özgün olarak hazırlanacaktır.'
  ),
  (
    'guide', 'tr', 'Mesafeli Satışlarda Cayma Hakkı',
    'mesafeli-satislarda-cayma-hakki',
    'E-ticaret alışverişlerinde cayma hakkına dair özgün kurum içeriği için yer tutucu.',
    'İçerik ekibi notu: Cayma hakkı süresi, istisnalar, iade süreci ve başvuru kanalları netleştirilmelidir.',
    'published', 1, NOW(), 'Mesafeli Satışlarda Cayma Hakkı',
    'E-ticaret alışverişlerinde cayma hakkına dair özgün kurum içeriği için yer tutucu.'
  ),
  (
    'news', 'tr', 'Tüketici Hakları Bilgilendirme İçerikleri Hazırlanıyor',
    'tuketici-haklari-bilgilendirme-icerikleri-hazirlaniyor',
    'Haber alanı için örnek kayıt. Yayına alınmadan önce kurumun gerçek haberiyle değiştirilmelidir.',
    'Bu alan, kurumun güncel haber ve faaliyet metinleri için ayrılmıştır. Görseller ve metinler ekip tarafından sağlanacaktır.',
    'published', 1, NOW(), 'Tüketici Hakları Bilgilendirme İçerikleri Hazırlanıyor',
    'Haber alanı için örnek kayıt. Yayına alınmadan önce kurumun gerçek haberiyle değiştirilmelidir.'
  ),
  (
    'announcement', 'tr', 'İletişim Kanalları Güncellenecek',
    'iletisim-kanallari-guncellenecek',
    'Telefon, e-posta, KEP, adres ve sosyal medya bilgileri admin panelinden tamamlanmalıdır.',
    'İletişim bilgilerinin açık, doğrulanmış ve her sayfadan erişilebilir olması ilk sürümün ana kabul kriteridir.',
    'published', 1, NOW(), 'İletişim Kanalları Güncellenecek',
    'Telefon, e-posta, KEP, adres ve sosyal medya bilgileri admin panelinden tamamlanmalıdır.'
  ),
  (
    'faq', 'tr', 'Tüketici başvurusu yapmak için üye olmak gerekir mi?',
    'tuketici-basvurusu-yapmak-icin-uye-olmak-gerekir-mi', 'Başvuru',
    'Ön başvuru formunu doldurmak için üye olmanız gerekmez. Başvurunuz incelendikten sonra ekibimiz gerekli görülürse ek bilgi, belge veya üyelik süreci hakkında sizinle iletişime geçer.',
    'published', 0, NOW(), 'Tüketici başvurusu yapmak için üye olmak gerekir mi?', 'Başvuru'
  ),
  (
    'faq', 'tr', 'Başvuru için ücret ödenir mi?',
    'basvuru-icin-ucret-odenir-mi', 'Başvuru',
    'Ön başvuru göndermek için herhangi bir ödeme alınmaz. Olası resmi başvuru, harç veya ek işlem gereklilikleri konuya göre ayrıca değerlendirilir ve size açık şekilde bildirilir.',
    'published', 0, NOW(), 'Başvuru için ücret ödenir mi?', 'Başvuru'
  ),
  (
    'faq', 'tr', 'Başvuruda hangi belgeleri paylaşmalıyım?',
    'basvuruda-hangi-belgeleri-paylasmaliyim', 'Belgeler',
    'Fatura, fiş, sözleşme, garanti belgesi, servis formu, kargo kaydı ve satıcıyla yapılan yazışmalar başvurunun daha hızlı değerlendirilmesine yardımcı olur. Elinizdeki belgeleri okunaklı şekilde yüklemeniz yeterlidir.',
    'published', 0, NOW(), 'Başvuruda hangi belgeleri paylaşmalıyım?', 'Belgeler'
  ),
  (
    'faq', 'tr', 'Başvuruma ne kadar sürede dönüş yapılır?',
    'basvuruma-ne-kadar-surede-donus-yapilir', 'Süreç',
    'Başvurular geliş sırasına ve konunun kapsamına göre incelenir. Eksik bilgi yoksa ekip en kısa sürede sizinle iletişime geçer; ek belge gerekiyorsa süreç hakkında ayrıca bilgilendirme yapılır.',
    'published', 0, NOW(), 'Başvuruma ne kadar sürede dönüş yapılır?', 'Süreç'
  ),
  (
    'faq', 'tr', 'Ayıplı mal veya hizmette ilk olarak ne yapmalıyım?',
    'ayipli-mal-veya-hizmette-ilk-olarak-ne-yapmaliyim', 'Haklar',
    'Öncelikle satın alma belgenizi ve yaşadığınız sorunu gösteren kayıtları saklayın. Satıcı veya sağlayıcıya yazılı başvuru yapmanız, sonraki değerlendirme ve resmi süreçlerde delil niteliği taşıyabilir.',
    'published', 0, NOW(), 'Ayıplı mal veya hizmette ilk olarak ne yapmalıyım?', 'Haklar'
  ),
  (
    'faq', 'tr', 'E-ticaret alışverişlerinde cayma hakkımı nasıl kullanırım?',
    'e-ticaret-alisverislerinde-cayma-hakkimi-nasil-kullanirim', 'Haklar',
    'Mesafeli satışlarda cayma hakkı, ürün ve hizmet türüne göre değişebilen istisnalara tabidir. Satıcıya süresi içinde yazılı bildirim yapmanız ve iade koşullarını belgeleyerek ilerlemeniz önerilir.',
    'published', 0, NOW(), 'E-ticaret alışverişlerinde cayma hakkımı nasıl kullanırım?', 'Haklar'
  ),
  (
    'faq', 'tr', 'Başvuru yaptıktan sonra bilgilerimi güncelleyebilir miyim?',
    'basvuru-yaptiktan-sonra-bilgilerimi-guncelleyebilir-miyim', 'Süreç',
    'Başvurunuzla ilgili ek belge veya açıklama paylaşmanız gerekiyorsa iletişim kanallarımızdan bize ulaşabilirsiniz. Ekibimiz başvuru kaydınızı güncellemeniz için sizi doğru kanala yönlendirir.',
    'published', 0, NOW(), 'Başvuru yaptıktan sonra bilgilerimi güncelleyebilir miyim?', 'Süreç'
  ),
  (
    'faq', 'tr', 'Kişisel verilerim nasıl korunur?',
    'kisisel-verilerim-nasil-korunur', 'Gizlilik',
    'Başvuru ve iletişim süreçlerinde paylaştığınız kişisel veriler yalnızca ilgili talebin değerlendirilmesi, sizinle iletişim kurulması ve yasal yükümlülüklerin yerine getirilmesi amacıyla işlenir.',
    'published', 0, NOW(), 'Kişisel verilerim nasıl korunur?', 'Gizlilik'
  ),
  (
    'faq', 'en', 'Do I need to be a member to submit a consumer application?',
    'do-i-need-to-be-a-member-to-submit-a-consumer-application', 'Application',
    'You do not need to be a member to submit the preliminary application form. After review, our team may contact you for additional information, documents, or membership-related guidance if needed.',
    'published', 0, NOW(), 'Do I need to be a member to submit a consumer application?', 'Application'
  ),
  (
    'faq', 'en', 'Is there a fee for submitting an application?',
    'is-there-a-fee-for-submitting-an-application', 'Application',
    'No payment is required to send a preliminary application. Any official application, fee, or additional procedural requirement is assessed according to the case and explained to you clearly.',
    'published', 0, NOW(), 'Is there a fee for submitting an application?', 'Application'
  ),
  (
    'faq', 'en', 'Which documents should I share with my application?',
    'which-documents-should-i-share-with-my-application', 'Documents',
    'Invoices, receipts, contracts, warranty documents, service forms, shipping records, and correspondence with the seller help us review the issue faster. Uploading readable copies of the documents you have is enough.',
    'published', 0, NOW(), 'Which documents should I share with my application?', 'Documents'
  ),
  (
    'faq', 'en', 'How soon will I receive a response?',
    'how-soon-will-i-receive-a-response', 'Process',
    'Applications are reviewed in order and according to the scope of the issue. If no information is missing, our team will contact you as soon as possible; if more documents are needed, you will be informed.',
    'published', 0, NOW(), 'How soon will I receive a response?', 'Process'
  ),
  (
    'faq', 'en', 'What should I do first for defective goods or services?',
    'what-should-i-do-first-for-defective-goods-or-services', 'Rights',
    'Keep your purchase documents and records that show the issue. A written request to the seller or provider can be useful evidence for later review and official procedures.',
    'published', 0, NOW(), 'What should I do first for defective goods or services?', 'Rights'
  ),
  (
    'faq', 'en', 'How can I use my withdrawal right for online purchases?',
    'how-can-i-use-my-withdrawal-right-for-online-purchases', 'Rights',
    'Withdrawal rights in distance sales may vary depending on the product or service and related exceptions. We recommend notifying the seller in writing within the legal period and documenting the return process.',
    'published', 0, NOW(), 'How can I use my withdrawal right for online purchases?', 'Rights'
  ),
  (
    'faq', 'en', 'Can I update my information after submitting an application?',
    'can-i-update-my-information-after-submitting-an-application', 'Process',
    'If you need to provide additional documents or explanations, you can contact us through our communication channels. Our team will guide you to the correct channel for updating your application record.',
    'published', 0, NOW(), 'Can I update my information after submitting an application?', 'Process'
  ),
  (
    'faq', 'en', 'How is my personal data protected?',
    'how-is-my-personal-data-protected', 'Privacy',
    'Personal data shared during application and communication processes is processed only to evaluate the relevant request, contact you, and fulfil legal obligations.',
    'published', 0, NOW(), 'How is my personal data protected?', 'Privacy'
  )
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `summary` = VALUES(`summary`),
  `body` = VALUES(`body`),
  `status` = VALUES(`status`),
  `is_featured` = VALUES(`is_featured`),
  `meta_title` = VALUES(`meta_title`),
  `meta_description` = VALUES(`meta_description`);

INSERT INTO `media_assets`
  (`file_name`, `original_name`, `mime_type`, `size_bytes`, `storage_driver`, `path`,
   `public_url`, `alt_text`, `created_by`)
SELECT 'ornek-hero.webp', 'ornek-hero.webp', 'image/webp', 479398, 'public',
       'ornek-hero.webp', '/ornek-hero.webp', 'Hero masaüstü görseli', @seed_admin_id
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM `media_assets` WHERE `public_url` = '/ornek-hero.webp'
);

INSERT INTO `media_assets`
  (`file_name`, `original_name`, `mime_type`, `size_bytes`, `storage_driver`, `path`,
   `public_url`, `alt_text`, `created_by`)
SELECT 'ornek-hero-16-15.webp', 'ornek-hero-16-15.webp', 'image/webp', 429760, 'public',
       'ornek-hero-16-15.webp', '/ornek-hero-16-15.webp', 'Hero mobil görseli', @seed_admin_id
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM `media_assets` WHERE `public_url` = '/ornek-hero-16-15.webp'
);

INSERT INTO `media_assets`
  (`file_name`, `original_name`, `mime_type`, `size_bytes`, `storage_driver`, `path`,
   `public_url`, `alt_text`, `created_by`)
SELECT 'ornek-hero-2.webp', 'ornek-hero-2.webp', 'image/webp', 154756, 'public',
       'ornek-hero-2.webp', '/ornek-hero-2.webp', 'Hero tablet görseli', @seed_admin_id
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM `media_assets` WHERE `public_url` = '/ornek-hero-2.webp'
);

SET @hero_desktop_id = (SELECT `id` FROM `media_assets` WHERE `public_url` = '/ornek-hero.webp' ORDER BY `id` LIMIT 1);
SET @hero_mobile_id = (SELECT `id` FROM `media_assets` WHERE `public_url` = '/ornek-hero-16-15.webp' ORDER BY `id` LIMIT 1);
SET @hero_tablet_id = (SELECT `id` FROM `media_assets` WHERE `public_url` = '/ornek-hero-2.webp' ORDER BY `id` LIMIT 1);

INSERT INTO `hero_slides`
  (`title_tr`, `title_en`, `summary_tr`, `summary_en`, `cta_label_tr`, `cta_label_en`,
   `cta_href`, `media_id`, `media_mobile_id`, `media_tablet_id`, `is_active`, `sort_order`,
   `created_by`, `updated_by`)
SELECT
  'Tüketici Hakları Bilgilendirme İçerikleri Hazırlanıyor',
  'Consumer Rights Information Content Is Being Prepared',
  'Hero alanı için örnek Türkçe kayıt. Yönetim panelinden gerçek metin ve görselle güncellenmelidir.',
  'Sample English record for the hero area. It should be replaced with the real copy and image from the admin panel.',
  'Devamını Oku', 'Read More',
  '/haberler/tuketici-haklari-bilgilendirme-icerikleri-hazirlaniyor',
  @hero_desktop_id, @hero_mobile_id, @hero_tablet_id, 1, 0, @seed_admin_id, @seed_admin_id
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM `hero_slides`
  WHERE `title_tr` = 'Tüketici Hakları Bilgilendirme İçerikleri Hazırlanıyor'
);

INSERT INTO `hero_slides`
  (`title_tr`, `title_en`, `summary_tr`, `summary_en`, `cta_label_tr`, `cta_label_en`,
   `cta_href`, `media_id`, `media_mobile_id`, `media_tablet_id`, `is_active`, `sort_order`,
   `created_by`, `updated_by`)
SELECT
  'Başvuru Rehberi İçeriği Editoryal Olarak Yönetilecek',
  'Application Guide Content Will Be Managed Editorially',
  'Hero slaytları artık içerik tiplerinden türetilmek yerine ayrı bir yönetim ekranı üzerinden düzenlenebilir olacak.',
  'Hero slides will no longer be inferred from content types and will instead be manageable from a dedicated admin screen.',
  'Başvuru Rehberi', 'Application Guide', '/basvuru-rehberi',
  @hero_tablet_id, @hero_mobile_id, @hero_desktop_id, 1, 1, @seed_admin_id, @seed_admin_id
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM `hero_slides`
  WHERE `title_tr` = 'Başvuru Rehberi İçeriği Editoryal Olarak Yönetilecek'
);

INSERT INTO `province_map_entries`
  (`locale`, `province_code`, `province_name`, `title`, `summary`, `category`,
   `content_item_id`, `link_label`, `event_date`, `status`, `sort_order`, `created_by`, `updated_by`)
SELECT
  'tr', 6, 'Ankara', 'Ankara''da tüketici hakları bilgilendirme çalışması',
  'Başkentte tüketici başvuru yolları ve temel haklara yönelik bilgilendirme içeriği.',
  'news', (SELECT `id` FROM `content_items` WHERE `locale` = 'tr' AND `slug` = 'tuketici-haklari-bilgilendirme-icerikleri-hazirlaniyor' LIMIT 1),
  'Habere git', '2026-07-10', 'published', 0, @seed_admin_id, @seed_admin_id
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM `province_map_entries`
  WHERE `locale` = 'tr' AND `province_code` = 6 AND `title` = 'Ankara''da tüketici hakları bilgilendirme çalışması'
);

INSERT INTO `province_map_entries`
  (`locale`, `province_code`, `province_name`, `title`, `summary`, `category`,
   `content_item_id`, `link_label`, `event_date`, `status`, `sort_order`, `created_by`, `updated_by`)
SELECT
  'tr', 34, 'İstanbul', 'İstanbul için ayıplı mal başvuru rehberi',
  'Ayıplı mal ve hizmet süreçlerinde izlenecek adımlar için il bazlı rehber bağlantısı.',
  'guide', (SELECT `id` FROM `content_items` WHERE `locale` = 'tr' AND `slug` = 'ayipli-mal-ve-hizmet-basvurulari' LIMIT 1),
  'Rehbere git', '2026-07-01', 'published', 1, @seed_admin_id, @seed_admin_id
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM `province_map_entries`
  WHERE `locale` = 'tr' AND `province_code` = 34 AND `title` = 'İstanbul için ayıplı mal başvuru rehberi'
);

INSERT INTO `province_map_entries`
  (`locale`, `province_code`, `province_name`, `title`, `summary`, `category`,
   `content_item_id`, `link_label`, `event_date`, `status`, `sort_order`, `created_by`, `updated_by`)
SELECT
  'tr', 35, 'İzmir', 'İzmir''de mesafeli satışlarda cayma hakkı bilgilendirmesi',
  'E-ticaret alışverişlerinde cayma hakkı ve iade sürecine dair özet içerik.',
  'guide', (SELECT `id` FROM `content_items` WHERE `locale` = 'tr' AND `slug` = 'mesafeli-satislarda-cayma-hakki' LIMIT 1),
  'Rehbere git', '2026-07-02', 'published', 2, @seed_admin_id, @seed_admin_id
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM `province_map_entries`
  WHERE `locale` = 'tr' AND `province_code` = 35 AND `title` = 'İzmir''de mesafeli satışlarda cayma hakkı bilgilendirmesi'
);

INSERT INTO `province_map_entries`
  (`locale`, `province_code`, `province_name`, `title`, `summary`, `category`,
   `content_item_id`, `link_label`, `event_date`, `status`, `sort_order`, `created_by`, `updated_by`)
SELECT
  'tr', 42, 'Konya', 'Konya tüketici bilgilendirme buluşması',
  'Tüketicilerin sık yaşadığı başvuru sorunlarına yönelik yerel bilgilendirme kaydı.',
  'activity', (SELECT `id` FROM `content_items` WHERE `locale` = 'tr' AND `slug` = 'tuketici-haklari-bilgilendirme-icerikleri-hazirlaniyor' LIMIT 1),
  'Habere git', '2026-07-12', 'published', 3, @seed_admin_id, @seed_admin_id
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM `province_map_entries`
  WHERE `locale` = 'tr' AND `province_code` = 42 AND `title` = 'Konya tüketici bilgilendirme buluşması'
);

INSERT INTO `province_map_entries`
  (`locale`, `province_code`, `province_name`, `title`, `summary`, `category`,
   `content_item_id`, `link_label`, `event_date`, `status`, `sort_order`, `created_by`, `updated_by`)
SELECT
  'tr', 16, 'Bursa', 'Bursa iletişim kanalları duyurusu',
  'Başvuru ve iletişim kanallarının güncellenmesine dair duyuru bağlantısı.',
  'announcement', (SELECT `id` FROM `content_items` WHERE `locale` = 'tr' AND `slug` = 'iletisim-kanallari-guncellenecek' LIMIT 1),
  'Duyuruya git', '2026-07-12', 'published', 4, @seed_admin_id, @seed_admin_id
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM `province_map_entries`
  WHERE `locale` = 'tr' AND `province_code` = 16 AND `title` = 'Bursa iletişim kanalları duyurusu'
);

INSERT INTO `media_assets`
  (`file_name`, `original_name`, `mime_type`, `size_bytes`, `storage_driver`, `path`,
   `public_url`, `alt_text`, `created_by`)
SELECT 'alpay-korkmaz.webp', 'alpay-korkmaz.webp', 'image/webp', 68834, 'public',
       'yonetim-kurulu/alpay-korkmaz.webp', '/yonetim-kurulu/alpay-korkmaz.webp', 'Alpay Korkmaz portresi', @seed_admin_id
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `media_assets` WHERE `public_url` = '/yonetim-kurulu/alpay-korkmaz.webp');

INSERT INTO `media_assets`
  (`file_name`, `original_name`, `mime_type`, `size_bytes`, `storage_driver`, `path`,
   `public_url`, `alt_text`, `created_by`)
SELECT 'hakan-akcam.webp', 'hakan-akcam.webp', 'image/webp', 51838, 'public',
       'yonetim-kurulu/hakan-akcam.webp', '/yonetim-kurulu/hakan-akcam.webp', 'Hakan Akçam portresi', @seed_admin_id
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `media_assets` WHERE `public_url` = '/yonetim-kurulu/hakan-akcam.webp');

INSERT INTO `media_assets`
  (`file_name`, `original_name`, `mime_type`, `size_bytes`, `storage_driver`, `path`,
   `public_url`, `alt_text`, `created_by`)
SELECT 'ismail-caglar.webp', 'ismail-caglar.webp', 'image/webp', 30028, 'public',
       'yonetim-kurulu/ismail-caglar.webp', '/yonetim-kurulu/ismail-caglar.webp', 'İsmail Çağlar portresi', @seed_admin_id
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `media_assets` WHERE `public_url` = '/yonetim-kurulu/ismail-caglar.webp');

INSERT INTO `media_assets`
  (`file_name`, `original_name`, `mime_type`, `size_bytes`, `storage_driver`, `path`,
   `public_url`, `alt_text`, `created_by`)
SELECT 'muhammed-emin-yesil.webp', 'muhammed-emin-yesil.webp', 'image/webp', 103898, 'public',
       'yonetim-kurulu/muhammed-emin-yesil.webp', '/yonetim-kurulu/muhammed-emin-yesil.webp', 'Muhammed Emin Yeşil portresi', @seed_admin_id
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `media_assets` WHERE `public_url` = '/yonetim-kurulu/muhammed-emin-yesil.webp');

INSERT INTO `media_assets`
  (`file_name`, `original_name`, `mime_type`, `size_bytes`, `storage_driver`, `path`,
   `public_url`, `alt_text`, `created_by`)
SELECT 'murat-kahya.webp', 'murat-kahya.webp', 'image/webp', 35088, 'public',
       'yonetim-kurulu/murat-kahya.webp', '/yonetim-kurulu/murat-kahya.webp', 'Murat Kahya portresi', @seed_admin_id
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `media_assets` WHERE `public_url` = '/yonetim-kurulu/murat-kahya.webp');

INSERT INTO `media_assets`
  (`file_name`, `original_name`, `mime_type`, `size_bytes`, `storage_driver`, `path`,
   `public_url`, `alt_text`, `created_by`)
SELECT 'mustafa-baser.webp', 'mustafa-baser.webp', 'image/webp', 56862, 'public',
       'yonetim-kurulu/mustafa-baser.webp', '/yonetim-kurulu/mustafa-baser.webp', 'Mustafa Başer portresi', @seed_admin_id
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `media_assets` WHERE `public_url` = '/yonetim-kurulu/mustafa-baser.webp');

INSERT INTO `media_assets`
  (`file_name`, `original_name`, `mime_type`, `size_bytes`, `storage_driver`, `path`,
   `public_url`, `alt_text`, `created_by`)
SELECT 'uguralp-coskun.webp', 'uguralp-coskun.webp', 'image/webp', 25622, 'public',
       'yonetim-kurulu/uguralp-coskun.webp', '/yonetim-kurulu/uguralp-coskun.webp', 'Uğuralp Coşkun portresi', @seed_admin_id
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `media_assets` WHERE `public_url` = '/yonetim-kurulu/uguralp-coskun.webp');

INSERT INTO `board_members`
  (`full_name`, `title_tr`, `title_en`, `summary_tr`, `summary_en`, `media_id`,
   `category_id`, `is_active`, `sort_order`, `created_by`, `updated_by`)
SELECT
  'Alpay Korkmaz', 'Avukat', 'Attorney',
  'Ankara Sosyal Bilimler Üniversitesi Hukuk Fakültesi mezunu olan Alpay Korkmaz, Ankara 2 No’lu Barosu’na kayıtlı serbest avukat ve Tüketiciler Birliği Kurucu Genel Başkan Yardımcısıdır.',
  'Alpay Korkmaz graduated from Ankara Social Sciences University Faculty of Law and is an independent attorney registered with Ankara Bar Association No. 2, as well as the Founding Vice President of the Consumers Association.',
  (SELECT `id` FROM `media_assets` WHERE `public_url` = '/yonetim-kurulu/alpay-korkmaz.webp' ORDER BY `id` LIMIT 1),
  NULL, 1, 10, @seed_admin_id, @seed_admin_id
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `board_members` WHERE `full_name` = 'Alpay Korkmaz');

INSERT INTO `board_members`
  (`full_name`, `title_tr`, `title_en`, `summary_tr`, `summary_en`, `media_id`,
   `category_id`, `is_active`, `sort_order`, `created_by`, `updated_by`)
SELECT
  'Hakan Akçam', 'Yönetici ve Girişimci', 'Executive and Entrepreneur',
  'Gayrimenkul, mesleki örgütlenme ve sivil toplum alanlarında yönetim sorumlulukları üstlenen Hakan Akçam, Tüketiciler Birliği Genel Başkan Vekili olarak görev yapmaktadır.',
  'Hakan Akçam has held leadership responsibilities in real estate, professional organisations and civil society, and serves as Deputy President of the Consumers Association.',
  (SELECT `id` FROM `media_assets` WHERE `public_url` = '/yonetim-kurulu/hakan-akcam.webp' ORDER BY `id` LIMIT 1),
  NULL, 1, 20, @seed_admin_id, @seed_admin_id
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `board_members` WHERE `full_name` = 'Hakan Akçam');

INSERT INTO `board_members`
  (`full_name`, `title_tr`, `title_en`, `summary_tr`, `summary_en`, `media_id`,
   `category_id`, `is_active`, `sort_order`, `created_by`, `updated_by`)
SELECT
  'İsmail Çağlar', 'Gayrimenkul Danışmanı', 'Real Estate Consultant',
  '2011’den bu yana gayrimenkul sektöründe çalışan İsmail Çağlar, Ankara ve özellikle Keçiören’de konut, arsa ve ticari gayrimenkul danışmanlığı yürütmektedir.',
  'İsmail Çağlar has worked in real estate since 2011, providing residential, land and commercial property consultancy in Ankara, particularly in Keçiören.',
  (SELECT `id` FROM `media_assets` WHERE `public_url` = '/yonetim-kurulu/ismail-caglar.webp' ORDER BY `id` LIMIT 1),
  NULL, 1, 30, @seed_admin_id, @seed_admin_id
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `board_members` WHERE `full_name` = 'İsmail Çağlar');

INSERT INTO `board_members`
  (`full_name`, `title_tr`, `title_en`, `summary_tr`, `summary_en`, `media_id`,
   `category_id`, `is_active`, `sort_order`, `created_by`, `updated_by`)
SELECT
  'Muhammed Emin Yeşil', 'Avukat', 'Attorney',
  'Marmara Üniversitesi Hukuk Fakültesi mezunu olan Muhammed Emin Yeşil; ticaret, şirketler, iş, gayrimenkul, yabancılar ve tüketici hukuku alanlarında çalışmaktadır.',
  'Muhammed Emin Yeşil graduated from Marmara University Faculty of Law and works across commercial, corporate, labour, real estate, immigration and consumer law.',
  (SELECT `id` FROM `media_assets` WHERE `public_url` = '/yonetim-kurulu/muhammed-emin-yesil.webp' ORDER BY `id` LIMIT 1),
  NULL, 1, 40, @seed_admin_id, @seed_admin_id
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `board_members` WHERE `full_name` = 'Muhammed Emin Yeşil');

INSERT INTO `board_members`
  (`full_name`, `title_tr`, `title_en`, `summary_tr`, `summary_en`, `media_id`,
   `category_id`, `is_active`, `sort_order`, `created_by`, `updated_by`)
SELECT
  'Murat Kahya', 'Gayrimenkul Danışmanı', 'Real Estate Consultant',
  'Müteahhitlik deneyiminin ardından 2013’ten bu yana gayrimenkul danışmanlığı yapan Murat Kahya, mesleki ve sivil toplum kuruluşlarında çeşitli görevler üstlenmiştir.',
  'Following his experience as a contractor, Murat Kahya has worked in real estate consultancy since 2013 and has held roles in professional and civil society organisations.',
  (SELECT `id` FROM `media_assets` WHERE `public_url` = '/yonetim-kurulu/murat-kahya.webp' ORDER BY `id` LIMIT 1),
  NULL, 1, 50, @seed_admin_id, @seed_admin_id
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `board_members` WHERE `full_name` = 'Murat Kahya');

INSERT INTO `board_members`
  (`full_name`, `title_tr`, `title_en`, `summary_tr`, `summary_en`, `media_id`,
   `category_id`, `is_active`, `sort_order`, `created_by`, `updated_by`)
SELECT
  'Mustafa Başer', 'Yönetici', 'Executive',
  'Adalet ile Çalışma Ekonomisi ve Endüstri İlişkileri eğitimi alan Mustafa Başer, yerel yönetimler, spor ve sivil toplum alanlarında çeşitli yönetim görevleri üstlenmiştir.',
  'Mustafa Başer studied Justice as well as Labour Economics and Industrial Relations, and has held various leadership roles in local government, sports and civil society.',
  (SELECT `id` FROM `media_assets` WHERE `public_url` = '/yonetim-kurulu/mustafa-baser.webp' ORDER BY `id` LIMIT 1),
  NULL, 1, 60, @seed_admin_id, @seed_admin_id
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `board_members` WHERE `full_name` = 'Mustafa Başer');

INSERT INTO `board_members`
  (`full_name`, `title_tr`, `title_en`, `summary_tr`, `summary_en`, `media_id`,
   `category_id`, `is_active`, `sort_order`, `created_by`, `updated_by`)
SELECT
  'Uğuralp Coşkun', 'İnşaat Mühendisi', 'Civil Engineer',
  'İnşaat mühendisliği eğitimini London South Bank University’de tamamlayan Uğuralp Coşkun, inşaat ve gayrimenkul alanlarında çalışmakta; mesleki standartların geliştirilmesine katkı sunmaktadır.',
  'Uğuralp Coşkun completed his civil engineering education at London South Bank University and works in construction and real estate, contributing to the development of professional standards.',
  (SELECT `id` FROM `media_assets` WHERE `public_url` = '/yonetim-kurulu/uguralp-coskun.webp' ORDER BY `id` LIMIT 1),
  NULL, 1, 70, @seed_admin_id, @seed_admin_id
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `board_members` WHERE `full_name` = 'Uğuralp Coşkun');

COMMIT;
