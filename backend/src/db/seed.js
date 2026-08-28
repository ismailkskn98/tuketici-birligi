const bcrypt = require("bcryptjs");
const fs = require("fs/promises");
const path = require("path");
const env = require("../config/env");
const pool = require("./pool");
const { slugify } = require("../utils/clean");
const { getProvinceName } = require("../constants/provinces");

const settings = [
  ["tr", "organizationName", "Tüketici Birliği", "string"],
  ["tr", "shortName", "Tüketici Birliği", "string"],
  ["tr", "description", "Kurum tanıtımı, ekip ve çalışma alanları için özgün metinler içerik ekibi tarafından hazırlanacaktır.", "string"],
  ["tr", "phone", "Telefon bilgisi eklenecek", "string"],
  ["tr", "email", "iletisim@ornek-domain.org", "string"],
  ["tr", "kep", "KEP adresi eklenecek", "string"],
  ["tr", "address", "Açık adres bilgisi eklenecek", "string"],
  ["tr", "workingHours", "Hafta içi çalışma saatleri eklenecek", "string"],
  ["tr", "mapQuery", "Ankara", "string"],
  ["tr", "socialLinks", JSON.stringify({ x: "", facebook: "", instagram: "", youtube: "" }), "json"],
];

const contents = [
  {
    type: "guide",
    title: "Ayıplı Mal ve Hizmet Başvuruları",
    summary: "Bu rehberin nihai metni hukuk ve içerik ekibi tarafından özgün olarak hazırlanacaktır.",
    body: "İçerik ekibi notu: Başvuru şartları, gerekli belgeler, süreler ve tüketicinin izleyeceği adımlar sade bir dille anlatılmalıdır.",
    isFeatured: true,
  },
  {
    type: "guide",
    title: "Mesafeli Satışlarda Cayma Hakkı",
    summary: "E-ticaret alışverişlerinde cayma hakkına dair özgün kurum içeriği için yer tutucu.",
    body: "İçerik ekibi notu: Cayma hakkı süresi, istisnalar, iade süreci ve başvuru kanalları netleştirilmelidir.",
    isFeatured: true,
  },
  {
    type: "news",
    title: "Tüketici Hakları Bilgilendirme İçerikleri Hazırlanıyor",
    summary: "Haber alanı için örnek kayıt. Yayına alınmadan önce kurumun gerçek haberiyle değiştirilmelidir.",
    body: "Bu alan, kurumun güncel haber ve faaliyet metinleri için ayrılmıştır. Görseller ve metinler ekip tarafından sağlanacaktır.",
    isFeatured: true,
  },
  {
    type: "announcement",
    title: "İletişim Kanalları Güncellenecek",
    summary: "Telefon, e-posta, KEP, adres ve sosyal medya bilgileri admin panelinden tamamlanmalıdır.",
    body: "İletişim bilgilerinin açık, doğrulanmış ve her sayfadan erişilebilir olması ilk sürümün ana kabul kriteridir.",
    isFeatured: true,
  },
  {
    type: "faq",
    locale: "tr",
    title: "Tüketici başvurusu yapmak için üye olmak gerekir mi?",
    summary: "Başvuru",
    body: "Ön başvuru formunu doldurmak için üye olmanız gerekmez. Başvurunuz incelendikten sonra ekibimiz gerekli görülürse ek bilgi, belge veya üyelik süreci hakkında sizinle iletişime geçer.",
    isFeatured: false,
  },
  {
    type: "faq",
    locale: "tr",
    title: "Başvuru için ücret ödenir mi?",
    summary: "Başvuru",
    body: "Ön başvuru göndermek için herhangi bir ödeme alınmaz. Olası resmi başvuru, harç veya ek işlem gereklilikleri konuya göre ayrıca değerlendirilir ve size açık şekilde bildirilir.",
    isFeatured: false,
  },
  {
    type: "faq",
    locale: "tr",
    title: "Başvuruda hangi belgeleri paylaşmalıyım?",
    summary: "Belgeler",
    body: "Fatura, fiş, sözleşme, garanti belgesi, servis formu, kargo kaydı ve satıcıyla yapılan yazışmalar başvurunun daha hızlı değerlendirilmesine yardımcı olur. Elinizdeki belgeleri okunaklı şekilde yüklemeniz yeterlidir.",
    isFeatured: false,
  },
  {
    type: "faq",
    locale: "tr",
    title: "Başvuruma ne kadar sürede dönüş yapılır?",
    summary: "Süreç",
    body: "Başvurular geliş sırasına ve konunun kapsamına göre incelenir. Eksik bilgi yoksa ekip en kısa sürede sizinle iletişime geçer; ek belge gerekiyorsa süreç hakkında ayrıca bilgilendirme yapılır.",
    isFeatured: false,
  },
  {
    type: "faq",
    locale: "tr",
    title: "Ayıplı mal veya hizmette ilk olarak ne yapmalıyım?",
    summary: "Haklar",
    body: "Öncelikle satın alma belgenizi ve yaşadığınız sorunu gösteren kayıtları saklayın. Satıcı veya sağlayıcıya yazılı başvuru yapmanız, sonraki değerlendirme ve resmi süreçlerde delil niteliği taşıyabilir.",
    isFeatured: false,
  },
  {
    type: "faq",
    locale: "tr",
    title: "E-ticaret alışverişlerinde cayma hakkımı nasıl kullanırım?",
    summary: "Haklar",
    body: "Mesafeli satışlarda cayma hakkı, ürün ve hizmet türüne göre değişebilen istisnalara tabidir. Satıcıya süresi içinde yazılı bildirim yapmanız ve iade koşullarını belgeleyerek ilerlemeniz önerilir.",
    isFeatured: false,
  },
  {
    type: "faq",
    locale: "tr",
    title: "Başvuru yaptıktan sonra bilgilerimi güncelleyebilir miyim?",
    summary: "Süreç",
    body: "Başvurunuzla ilgili ek belge veya açıklama paylaşmanız gerekiyorsa iletişim kanallarımızdan bize ulaşabilirsiniz. Ekibimiz başvuru kaydınızı güncellemeniz için sizi doğru kanala yönlendirir.",
    isFeatured: false,
  },
  {
    type: "faq",
    locale: "tr",
    title: "Kişisel verilerim nasıl korunur?",
    summary: "Gizlilik",
    body: "Başvuru ve iletişim süreçlerinde paylaştığınız kişisel veriler yalnızca ilgili talebin değerlendirilmesi, sizinle iletişim kurulması ve yasal yükümlülüklerin yerine getirilmesi amacıyla işlenir.",
    isFeatured: false,
  },
  {
    type: "faq",
    locale: "en",
    title: "Do I need to be a member to submit a consumer application?",
    summary: "Application",
    body: "You do not need to be a member to submit the preliminary application form. After review, our team may contact you for additional information, documents, or membership-related guidance if needed.",
    isFeatured: false,
  },
  {
    type: "faq",
    locale: "en",
    title: "Is there a fee for submitting an application?",
    summary: "Application",
    body: "No payment is required to send a preliminary application. Any official application, fee, or additional procedural requirement is assessed according to the case and explained to you clearly.",
    isFeatured: false,
  },
  {
    type: "faq",
    locale: "en",
    title: "Which documents should I share with my application?",
    summary: "Documents",
    body: "Invoices, receipts, contracts, warranty documents, service forms, shipping records, and correspondence with the seller help us review the issue faster. Uploading readable copies of the documents you have is enough.",
    isFeatured: false,
  },
  {
    type: "faq",
    locale: "en",
    title: "How soon will I receive a response?",
    summary: "Process",
    body: "Applications are reviewed in order and according to the scope of the issue. If no information is missing, our team will contact you as soon as possible; if more documents are needed, you will be informed.",
    isFeatured: false,
  },
  {
    type: "faq",
    locale: "en",
    title: "What should I do first for defective goods or services?",
    summary: "Rights",
    body: "Keep your purchase documents and records that show the issue. A written request to the seller or provider can be useful evidence for later review and official procedures.",
    isFeatured: false,
  },
  {
    type: "faq",
    locale: "en",
    title: "How can I use my withdrawal right for online purchases?",
    summary: "Rights",
    body: "Withdrawal rights in distance sales may vary depending on the product or service and related exceptions. We recommend notifying the seller in writing within the legal period and documenting the return process.",
    isFeatured: false,
  },
  {
    type: "faq",
    locale: "en",
    title: "Can I update my information after submitting an application?",
    summary: "Process",
    body: "If you need to provide additional documents or explanations, you can contact us through our communication channels. Our team will guide you to the correct channel for updating your application record.",
    isFeatured: false,
  },
  {
    type: "faq",
    locale: "en",
    title: "How is my personal data protected?",
    summary: "Privacy",
    body: "Personal data shared during application and communication processes is processed only to evaluate the relevant request, contact you, and fulfil legal obligations.",
    isFeatured: false,
  },
];

const heroSlides = [
  {
    titleTr: "Tüketici Hakları Bilgilendirme İçerikleri Hazırlanıyor",
    titleEn: "Consumer Rights Information Content Is Being Prepared",
    summaryTr: "Hero alanı için örnek Türkçe kayıt. Yönetim panelinden gerçek metin ve görselle güncellenmelidir.",
    summaryEn: "Sample English record for the hero area. It should be replaced with the real copy and image from the admin panel.",
    ctaLabelTr: "Devamını Oku",
    ctaLabelEn: "Read More",
    ctaHref: "/haberler/tuketici-haklari-bilgilendirme-icerikleri-hazirlaniyor",
    imageFileName: "ornek-hero.webp",
    imageMobileFileName: "ornek-hero-16-15.webp",
    imageTabletFileName: "ornek-hero-2.webp",
    sortOrder: 0,
  },
  {
    titleTr: "Başvuru Rehberi İçeriği Editoryal Olarak Yönetilecek",
    titleEn: "Application Guide Content Will Be Managed Editorially",
    summaryTr: "Hero slaytları artık içerik tiplerinden türetilmek yerine ayrı bir yönetim ekranı üzerinden düzenlenebilir olacak.",
    summaryEn: "Hero slides will no longer be inferred from content types and will instead be manageable from a dedicated admin screen.",
    ctaLabelTr: "Başvuru Rehberi",
    ctaLabelEn: "Application Guide",
    ctaHref: "/basvuru-rehberi",
    imageFileName: "ornek-hero-2.webp",
    imageMobileFileName: "ornek-hero-16-15.webp",
    imageTabletFileName: "ornek-hero.webp",
    sortOrder: 1,
  },
];

const provinceMapEntries = [
  {
    provinceCode: 6,
    category: "news",
    title: "Ankara'da tüketici hakları bilgilendirme çalışması",
    summary: "Başkentte tüketici başvuru yolları ve temel haklara yönelik bilgilendirme içeriği.",
    contentSlug: "tuketici-haklari-bilgilendirme-icerikleri-hazirlaniyor",
    linkLabel: "Habere git",
    eventDate: "2026-07-10",
    sortOrder: 0,
  },
  {
    provinceCode: 34,
    category: "guide",
    title: "İstanbul için ayıplı mal başvuru rehberi",
    summary: "Ayıplı mal ve hizmet süreçlerinde izlenecek adımlar için il bazlı rehber bağlantısı.",
    contentSlug: "ayipli-mal-ve-hizmet-basvurulari",
    linkLabel: "Rehbere git",
    eventDate: "2026-07-01",
    sortOrder: 1,
  },
  {
    provinceCode: 35,
    category: "guide",
    title: "İzmir'de mesafeli satışlarda cayma hakkı bilgilendirmesi",
    summary: "E-ticaret alışverişlerinde cayma hakkı ve iade sürecine dair özet içerik.",
    contentSlug: "mesafeli-satislarda-cayma-hakki",
    linkLabel: "Rehbere git",
    eventDate: "2026-07-02",
    sortOrder: 2,
  },
  {
    provinceCode: 42,
    category: "activity",
    title: "Konya tüketici bilgilendirme buluşması",
    summary: "Tüketicilerin sık yaşadığı başvuru sorunlarına yönelik yerel bilgilendirme kaydı.",
    contentSlug: "tuketici-haklari-bilgilendirme-icerikleri-hazirlaniyor",
    linkLabel: "Habere git",
    eventDate: "2026-07-12",
    sortOrder: 3,
  },
  {
    provinceCode: 16,
    category: "announcement",
    title: "Bursa iletişim kanalları duyurusu",
    summary: "Başvuru ve iletişim kanallarının güncellenmesine dair duyuru bağlantısı.",
    contentSlug: "iletisim-kanallari-guncellenecek",
    linkLabel: "Duyuruya git",
    eventDate: "2026-07-12",
    sortOrder: 4,
  },
];

const legacyBoardMembers = [
  {
    fullName: "Alpay Korkmaz",
    titleTr: "Avukat",
    titleEn: "Attorney",
    summaryTr: "Ankara Sosyal Bilimler Üniversitesi Hukuk Fakültesi mezunu olan Alpay Korkmaz, Ankara 2 No’lu Barosu’na kayıtlı serbest avukat ve Tüketiciler Birliği Kurucu Genel Başkan Yardımcısıdır.",
    summaryEn: "Alpay Korkmaz graduated from Ankara Social Sciences University Faculty of Law and is an independent attorney registered with Ankara Bar Association No. 2, as well as the Founding Vice President of the Consumers Association.",
    imageFileName: "alpay-korkmaz.webp",
    sortOrder: 10,
  },
  {
    fullName: "Hakan Akçam",
    titleTr: "Yönetici ve Girişimci",
    titleEn: "Executive and Entrepreneur",
    summaryTr: "Gayrimenkul, mesleki örgütlenme ve sivil toplum alanlarında yönetim sorumlulukları üstlenen Hakan Akçam, Tüketiciler Birliği Genel Başkan Vekili olarak görev yapmaktadır.",
    summaryEn: "Hakan Akçam has held leadership responsibilities in real estate, professional organisations and civil society, and serves as Deputy President of the Consumers Association.",
    imageFileName: "hakan-akcam.webp",
    sortOrder: 20,
  },
  {
    fullName: "İsmail Çağlar",
    titleTr: "Gayrimenkul Danışmanı",
    titleEn: "Real Estate Consultant",
    summaryTr: "2011’den bu yana gayrimenkul sektöründe çalışan İsmail Çağlar, Ankara ve özellikle Keçiören’de konut, arsa ve ticari gayrimenkul danışmanlığı yürütmektedir.",
    summaryEn: "İsmail Çağlar has worked in real estate since 2011, providing residential, land and commercial property consultancy in Ankara, particularly in Keçiören.",
    imageFileName: "ismail-caglar.webp",
    sortOrder: 30,
  },
  {
    fullName: "Muhammed Emin Yeşil",
    titleTr: "Avukat",
    titleEn: "Attorney",
    summaryTr: "Marmara Üniversitesi Hukuk Fakültesi mezunu olan Muhammed Emin Yeşil; ticaret, şirketler, iş, gayrimenkul, yabancılar ve tüketici hukuku alanlarında çalışmaktadır.",
    summaryEn: "Muhammed Emin Yeşil graduated from Marmara University Faculty of Law and works across commercial, corporate, labour, real estate, immigration and consumer law.",
    imageFileName: "muhammed-emin-yesil.webp",
    sortOrder: 40,
  },
  {
    fullName: "Murat Kahya",
    titleTr: "Gayrimenkul Danışmanı",
    titleEn: "Real Estate Consultant",
    summaryTr: "Müteahhitlik deneyiminin ardından 2013’ten bu yana gayrimenkul danışmanlığı yapan Murat Kahya, mesleki ve sivil toplum kuruluşlarında çeşitli görevler üstlenmiştir.",
    summaryEn: "Following his experience as a contractor, Murat Kahya has worked in real estate consultancy since 2013 and has held roles in professional and civil society organisations.",
    imageFileName: "murat-kahya.webp",
    sortOrder: 50,
  },
  {
    fullName: "Mustafa Başer",
    titleTr: "Yönetici",
    titleEn: "Executive",
    summaryTr: "Adalet ile Çalışma Ekonomisi ve Endüstri İlişkileri eğitimi alan Mustafa Başer, yerel yönetimler, spor ve sivil toplum alanlarında çeşitli yönetim görevleri üstlenmiştir.",
    summaryEn: "Mustafa Başer studied Justice as well as Labour Economics and Industrial Relations, and has held various leadership roles in local government, sports and civil society.",
    imageFileName: "mustafa-baser.webp",
    sortOrder: 60,
  },
  {
    fullName: "Uğuralp Coşkun",
    titleTr: "İnşaat Mühendisi",
    titleEn: "Civil Engineer",
    summaryTr: "İnşaat mühendisliği eğitimini London South Bank University’de tamamlayan Uğuralp Coşkun, inşaat ve gayrimenkul alanlarında çalışmakta; mesleki standartların geliştirilmesine katkı sunmaktadır.",
    summaryEn: "Uğuralp Coşkun completed his civil engineering education at London South Bank University and works in construction and real estate, contributing to the development of professional standards.",
    imageFileName: "uguralp-coskun.webp",
    sortOrder: 70,
  },
];

const boardMemberCategories = [
  {
    key: "board",
    titleTr: "Yönetim Kurulu",
    titleEn: "Board of Directors",
    slug: "yonetim-kurulu",
    legacySlug: "gecici-yonetim-kurulu",
    sortOrder: 10,
    isActive: true,
  },
  {
    key: "founding-members",
    titleTr: "Kurucu Üyeler",
    titleEn: "Founding Members",
    slug: "kurucu-uyeler",
    sortOrder: 20,
    isActive: true,
  },
];

const boardMemberSeedVersion = "board-members-2026-08-28-company-sources-v1";
const boardMemberCategoryCorrectionVersion = "board-members-2026-08-28-founding-category-v1";
const boardMemberCompletedProfilesVersion = "board-members-2026-08-28-complete-board-v1";

const generalMemberOrder = new Map([
  ["Alpay Korkmaz", 10],
  ["Hakan Akçam", 20],
  ["İsmail Çağlar", 40],
  ["Muhammed Emin Yeşil", 50],
  ["Murat Kahya", 60],
]);

const boardMembers = [
  {
    fullName: "Hasan Oğuz Altınkaynak",
    roleTr: "Yönetim Kurulu Başkanı",
    roleEn: "Chair of the Board",
    titleTr: "Avukat",
    titleEn: "Attorney",
    summaryTr: "Çankaya Üniversitesi Hukuk Fakültesi mezunu olan ve Exeter Üniversitesi’nde uluslararası hukuk yüksek lisansını tamamlayan Hasan Oğuz Altınkaynak, Ankara 2 No’lu Barosu’na kayıtlı avukat olarak çalışmaktadır.",
    summaryEn: "Hasan Oğuz Altınkaynak graduated from Çankaya University Faculty of Law and completed a master’s degree in international law at the University of Exeter. He practises as an attorney registered with Ankara Bar Association No. 2.",
    imageFileName: "hasan-oguz-altinkaynak.webp",
    categoryKey: "board",
    isActive: true,
    sortOrder: 10,
  },
  {
    fullName: "Ali Selek",
    roleTr: "Başkan Yardımcısı",
    roleEn: "Vice Chair",
    titleTr: "Avukat ve Arabulucu",
    titleEn: "Attorney and Mediator",
    summaryTr: "Ankara Üniversitesi Hukuk Fakültesi mezunu olan Ali Selek; hâkimlik deneyiminin ardından avukatlık, uzman arabuluculuk ve bilirkişilik alanlarında çalışmakta, tahkim ve arabuluculuk eğitimleri vermektedir.",
    summaryEn: "Ali Selek graduated from Ankara University Faculty of Law. Following his judicial career, he works in legal practice, specialist mediation and expert witness services, and provides arbitration and mediation training.",
    imageFileName: "ali-selek.webp",
    categoryKey: "board",
    isActive: true,
    sortOrder: 20,
  },
  {
    fullName: "Hüseyin Taşer",
    roleTr: "Sekreter",
    roleEn: "Secretary",
    titleTr: "Harita ve Kadastro Teknikeri",
    titleEn: "Surveying and Cadastre Technician",
    summaryTr: "Selçuk Üniversitesi Harita ve Kadastro programı ile Anadolu Üniversitesi İktisat Bölümü mezunu olan Hüseyin Taşer, şehir planlama, kentsel dönüşüm ve arazi geliştirme projelerinde koordinasyon ve haritalandırma sorumlulukları üstlenmiştir.",
    summaryEn: "Hüseyin Taşer graduated from Selçuk University’s Surveying and Cadastre programme and Anadolu University’s Economics Department. He has undertaken coordination and mapping responsibilities in urban planning, urban transformation and land development projects.",
    imageFileName: "huseyin-taser.webp",
    categoryKey: "board",
    isActive: true,
    sortOrder: 30,
  },
  ...legacyBoardMembers.map((member) => {
    if (member.fullName === "Mustafa Başer") {
      return {
        ...member,
        roleTr: "Sayman",
        roleEn: "Treasurer",
        categoryKey: "board",
        isActive: true,
        sortOrder: 40,
      };
    }

    if (member.fullName === "Uğuralp Coşkun") {
      return {
        ...member,
        roleTr: "Kurucu Üye",
        roleEn: "Founding Member",
        categoryKey: "founding-members",
        isActive: true,
        sortOrder: 50,
      };
    }

    if (member.fullName === "Hakan Akçam") {
      return {
        ...member,
        summaryTr: "Gayrimenkul, mesleki örgütlenme ve sivil toplum alanlarında yönetim sorumlulukları üstlenen Hakan Akçam, bu alanlarda çalışmalarını sürdürmektedir.",
        summaryEn: "Hakan Akçam has held leadership responsibilities in real estate, professional organisations and civil society, and continues his work across these fields.",
        categoryKey: null,
        isActive: true,
        sortOrder: generalMemberOrder.get(member.fullName),
      };
    }

    return {
      ...member,
      categoryKey: null,
      isActive: true,
      sortOrder: generalMemberOrder.get(member.fullName),
    };
  }),
  {
    fullName: "İrem Eskici",
    roleTr: null,
    roleEn: null,
    titleTr: "Avukat",
    titleEn: "Attorney",
    summaryTr: "Antalya Bilim Üniversitesi Hukuk Fakültesi mezunu olan İrem Eskici, Ankara’da avukatlık yapmakta; kamu hukuku alanında yüksek lisans ve moleküler biyoloji ve genetik alanında lisans eğitimine devam etmektedir.",
    summaryEn: "İrem Eskici graduated from Antalya Bilim University Faculty of Law and practices law in Ankara. She continues her graduate studies in public law and undergraduate studies in molecular biology and genetics.",
    imageFileName: "irem-eskici.webp",
    categoryKey: null,
    isActive: true,
    sortOrder: 30,
  },
];

async function upsertUser({ name, email, password, role }) {
  const passwordHash = await bcrypt.hash(password, 12);

  await pool.execute(
    `INSERT INTO admin_users (name, email, password_hash, role)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE name = VALUES(name), role = VALUES(role), is_active = 1`,
    [name, email, passwordHash, role],
  );
}

async function seedSettings() {
  for (const [locale, keyName, value, valueType] of settings) {
    await pool.execute(
      `INSERT INTO site_settings (locale, key_name, value, value_type)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE value = VALUES(value), value_type = VALUES(value_type)`,
      [locale, keyName, value, valueType],
    );
  }
}

async function seedContent() {
  for (const item of contents) {
    const slug = slugify(item.title);
    const locale = item.locale || "tr";

    await pool.execute(
      `INSERT INTO content_items
        (type, locale, title, slug, summary, body, status, is_featured, published_at, meta_title, meta_description)
       VALUES (?, ?, ?, ?, ?, ?, 'published', ?, NOW(), ?, ?)
       ON DUPLICATE KEY UPDATE
        summary = VALUES(summary),
        body = VALUES(body),
        status = VALUES(status),
        is_featured = VALUES(is_featured),
        meta_title = VALUES(meta_title),
        meta_description = VALUES(meta_description)`,
      [item.type, locale, item.title, slug, item.summary, item.body, item.isFeatured ? 1 : 0, item.title, item.summary],
    );
  }
}

async function ensurePublicMedia({ fileName, relativePath, altText, createdBy }) {
  const publicUrl = `/${relativePath}`;
  const [existingRows] = await pool.execute(
    `SELECT id
     FROM media_assets
     WHERE public_url = ?
     ORDER BY id ASC
     LIMIT 1`,
    [publicUrl],
  );

  if (existingRows[0]) {
    return existingRows[0].id;
  }

  const publicFilePath = path.resolve(
    __dirname,
    "../../../frontend/public",
    relativePath,
  );
  const fileStats = await fs.stat(publicFilePath);
  const [result] = await pool.execute(
    `INSERT INTO media_assets
      (file_name, original_name, mime_type, size_bytes, storage_driver, path,
       public_url, alt_text, created_by)
     VALUES (?, ?, 'image/webp', ?, 'public', ?, ?, ?, ?)`,
    [
      fileName,
      fileName,
      fileStats.size,
      relativePath,
      publicUrl,
      altText,
      createdBy,
    ],
  );

  return result.insertId;
}

async function seedHeroSlides() {
  const [heroRows] = await pool.execute(
    `SELECT id FROM hero_slides
     ORDER BY id ASC
     LIMIT 1`,
  );

  if (heroRows[0]) {
    return;
  }

  const [adminRows] = await pool.execute(
    `SELECT id
     FROM admin_users
     WHERE email = ?
     LIMIT 1`,
    [env.seed.adminEmail],
  );
  const createdBy = adminRows[0]?.id || null;

  for (const item of heroSlides) {
    const mediaId = await ensurePublicMedia({
      fileName: item.imageFileName,
      relativePath: item.imageFileName,
      altText: item.titleTr,
      createdBy,
    });
    const mediaMobileId = await ensurePublicMedia({
      fileName: item.imageMobileFileName,
      relativePath: item.imageMobileFileName,
      altText: item.titleTr,
      createdBy,
    });
    const mediaTabletId = await ensurePublicMedia({
      fileName: item.imageTabletFileName,
      relativePath: item.imageTabletFileName,
      altText: item.titleTr,
      createdBy,
    });

    await pool.execute(
      `INSERT INTO hero_slides
        (title_tr, title_en, summary_tr, summary_en, cta_label_tr, cta_label_en, cta_href,
         media_id, media_mobile_id, media_tablet_id, is_active, sort_order, created_by, updated_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?)`,
      [item.titleTr, item.titleEn, item.summaryTr, item.summaryEn, item.ctaLabelTr, item.ctaLabelEn, item.ctaHref, mediaId, mediaMobileId, mediaTabletId, item.sortOrder, createdBy, createdBy],
    );
  }
}

async function seedProvinceMapEntries() {
  const [existingRows] = await pool.execute(
    `SELECT id FROM province_map_entries
     ORDER BY id ASC
     LIMIT 1`,
  );

  if (existingRows[0]) {
    return;
  }

  for (const item of provinceMapEntries) {
    const [contentRows] = await pool.execute(
      `SELECT id
       FROM content_items
       WHERE locale = 'tr' AND slug = ?
       LIMIT 1`,
      [item.contentSlug],
    );

    await pool.execute(
      `INSERT INTO province_map_entries
        (locale, province_code, province_name, title, summary, category, content_item_id,
         link_label, event_date, status, sort_order)
       VALUES ('tr', ?, ?, ?, ?, ?, ?, ?, ?, 'published', ?)`,
      [item.provinceCode, getProvinceName(item.provinceCode), item.title, item.summary, item.category, contentRows[0]?.id || null, item.linkLabel, item.eventDate, item.sortOrder],
    );
  }
}

async function ensureBoardMemberMedia(item, createdBy) {
  if (!item.imageFileName) return null;

  const relativePath = `yonetim-kurulu/${item.imageFileName}`;

  return ensurePublicMedia({
    fileName: item.imageFileName,
    relativePath,
    altText: `${item.fullName} portresi`,
    createdBy,
  });
}

async function seedBoardMemberCategories() {
  const categoryIds = new Map();
  let createdAny = false;

  for (const category of boardMemberCategories) {
    const [existingRows] = await pool.execute(
      `SELECT id
       FROM board_member_categories
       WHERE slug = ?
       LIMIT 1`,
      [category.slug],
    );

    if (existingRows[0]) {
      categoryIds.set(category.key, existingRows[0].id);
      continue;
    }

    if (category.legacySlug) {
      const [legacyRows] = await pool.execute(
        `SELECT id
         FROM board_member_categories
         WHERE slug = ?
         LIMIT 1`,
        [category.legacySlug],
      );

      if (legacyRows[0]) {
        await pool.execute(
          `UPDATE board_member_categories
           SET title_tr = ?, title_en = ?, slug = ?, sort_order = ?, is_active = ?
           WHERE id = ?`,
          [
            category.titleTr,
            category.titleEn,
            category.slug,
            category.sortOrder,
            category.isActive ? 1 : 0,
            legacyRows[0].id,
          ],
        );
        categoryIds.set(category.key, legacyRows[0].id);
        continue;
      }
    }

    const [result] = await pool.execute(
      `INSERT INTO board_member_categories
        (title_tr, title_en, slug, sort_order, is_active)
       VALUES (?, ?, ?, ?, ?)`,
      [
        category.titleTr,
        category.titleEn,
        category.slug,
        category.sortOrder,
        category.isActive ? 1 : 0,
      ],
    );

    categoryIds.set(category.key, result.insertId);
    createdAny = true;
  }

  return { categoryIds, createdAny };
}

async function insertBoardMember(item, { categoryIds, createdBy }) {
  const mediaId = await ensureBoardMemberMedia(item, createdBy);
  const categoryId = item.categoryKey
    ? categoryIds.get(item.categoryKey) || null
    : null;

  await pool.execute(
    `INSERT INTO board_members
      (full_name, role_tr, role_en, title_tr, title_en, summary_tr, summary_en,
       media_id, category_id, is_active, sort_order, created_by, updated_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      item.fullName,
      item.roleTr || null,
      item.roleEn || null,
      item.titleTr || null,
      item.titleEn || null,
      item.summaryTr || null,
      item.summaryEn || null,
      mediaId,
      categoryId,
      item.isActive ? 1 : 0,
      item.sortOrder,
      createdBy,
      createdBy,
    ],
  );
}

async function seedNewBoardMemberSources({ categoryIds, createdBy }) {
  const newMemberNames = new Set([
    "Hasan Oğuz Altınkaynak",
    "Ali Selek",
    "Hüseyin Taşer",
    "İrem Eskici",
  ]);

  for (const item of boardMembers.filter((member) => newMemberNames.has(member.fullName))) {
    const [existingRows] = await pool.execute(
      `SELECT id
       FROM board_members
       WHERE full_name = ?
       LIMIT 1`,
      [item.fullName],
    );

    if (!existingRows[0]) {
      await insertBoardMember(item, { categoryIds, createdBy });
    }
  }

  for (const fullName of ["Mustafa Başer", "Uğuralp Coşkun"]) {
    const item = boardMembers.find((member) => member.fullName === fullName);
    await pool.execute(
      `UPDATE board_members
       SET role_tr = COALESCE(role_tr, ?),
           role_en = COALESCE(role_en, ?),
           category_id = COALESCE(category_id, ?)
       WHERE full_name = ?`,
      [
        item.roleTr,
        item.roleEn,
        categoryIds.get(item.categoryKey) || null,
        item.fullName,
      ],
    );
  }

  await pool.execute(
    `UPDATE board_members
     SET summary_tr = ?, summary_en = ?
     WHERE full_name = 'Hakan Akçam'
       AND summary_tr = ?`,
    [
      "Gayrimenkul, mesleki örgütlenme ve sivil toplum alanlarında yönetim sorumlulukları üstlenen Hakan Akçam, bu alanlarda çalışmalarını sürdürmektedir.",
      "Hakan Akçam has held leadership responsibilities in real estate, professional organisations and civil society, and continues his work across these fields.",
      "Gayrimenkul, mesleki örgütlenme ve sivil toplum alanlarında yönetim sorumlulukları üstlenen Hakan Akçam, Tüketiciler Birliği Genel Başkan Vekili olarak görev yapmaktadır.",
    ],
  );
}

async function correctFoundingMemberCategory(categoryIds) {
  const boardCategoryId = categoryIds.get("board");
  const foundingCategoryId = categoryIds.get("founding-members");

  if (!boardCategoryId || !foundingCategoryId) return;

  await pool.execute(
    `UPDATE board_members
     SET category_id = ?
     WHERE full_name = 'Uğuralp Coşkun'
       AND role_tr = 'Kurucu Üye'
       AND category_id = ?`,
    [foundingCategoryId, boardCategoryId],
  );
}

async function syncCompletedBoardMemberProfiles({ categoryIds, createdBy }) {
  const boardCategoryId = categoryIds.get("board");
  const foundingCategoryId = categoryIds.get("founding-members");

  if (!boardCategoryId) return;

  await pool.execute(
    `UPDATE board_member_categories
     SET title_tr = 'Yönetim Kurulu',
         title_en = 'Board of Directors',
         slug = 'yonetim-kurulu',
         sort_order = 10,
         is_active = 1
     WHERE id = ?`,
    [boardCategoryId],
  );

  const [legacyCategoryRows] = await pool.execute(
    `SELECT id
     FROM board_member_categories
     WHERE slug = 'gecici-yonetim-kurulu'
     LIMIT 1`,
  );
  const legacyCategoryId = legacyCategoryRows[0]?.id;

  if (legacyCategoryId && legacyCategoryId !== boardCategoryId) {
    await pool.execute(
      `UPDATE board_members
       SET category_id = ?
       WHERE category_id = ?`,
      [boardCategoryId, legacyCategoryId],
    );

    await pool.execute(
      `DELETE FROM board_member_categories
       WHERE id = ?`,
      [legacyCategoryId],
    );
  }

  if (foundingCategoryId) {
    await pool.execute(
      `UPDATE board_members
       SET category_id = ?
       WHERE full_name = 'Uğuralp Coşkun'
         AND role_tr = 'Kurucu Üye'`,
      [foundingCategoryId],
    );
  }

  const managedMembers = boardMembers.filter((member) => member.categoryKey === "board");

  for (const item of managedMembers) {
    const mediaId = await ensureBoardMemberMedia(item, createdBy);
    const [existingRows] = await pool.execute(
      `SELECT id
       FROM board_members
       WHERE full_name = ?
       LIMIT 1`,
      [item.fullName],
    );

    if (!existingRows[0]) {
      await insertBoardMember(item, { categoryIds, createdBy });
      continue;
    }

    await pool.execute(
      `UPDATE board_members
       SET role_tr = ?, role_en = ?, title_tr = ?, title_en = ?,
           summary_tr = ?, summary_en = ?, media_id = ?, category_id = ?,
           is_active = 1, sort_order = ?, updated_by = ?
       WHERE id = ?`,
      [
        item.roleTr,
        item.roleEn,
        item.titleTr,
        item.titleEn,
        item.summaryTr,
        item.summaryEn,
        mediaId,
        boardCategoryId,
        item.sortOrder,
        createdBy,
        existingRows[0].id,
      ],
    );
  }
}

async function hasSeedVersion(versionKey) {
  const [rows] = await pool.execute(
    `SELECT version_key
     FROM seed_versions
     WHERE version_key = ?
     LIMIT 1`,
    [versionKey],
  );

  return Boolean(rows[0]);
}

async function markSeedVersion(versionKey) {
  await pool.execute(
    `INSERT INTO seed_versions (version_key)
     VALUES (?)
     ON DUPLICATE KEY UPDATE version_key = VALUES(version_key)`,
    [versionKey],
  );
}

async function seedBoardMembers() {
  const [existingRows] = await pool.execute(
    `SELECT id
     FROM board_members
     ORDER BY id ASC
     LIMIT 1`,
  );

  const categoryResult = await seedBoardMemberCategories();
  const isCompanySourceSeeded = await hasSeedVersion(boardMemberSeedVersion);
  const isCategoryCorrectionSeeded = await hasSeedVersion(boardMemberCategoryCorrectionVersion);
  const areCompletedProfilesSeeded = await hasSeedVersion(boardMemberCompletedProfilesVersion);

  const [adminRows] = await pool.execute(
    `SELECT id
     FROM admin_users
     WHERE email = ?
     LIMIT 1`,
    [env.seed.adminEmail],
  );
  const createdBy = adminRows[0]?.id || null;

  if (existingRows[0]) {
    if (!isCompanySourceSeeded) {
      await seedNewBoardMemberSources({
        categoryIds: categoryResult.categoryIds,
        createdBy,
      });
      await markSeedVersion(boardMemberSeedVersion);
    }
    if (!isCategoryCorrectionSeeded) {
      await correctFoundingMemberCategory(categoryResult.categoryIds);
      await markSeedVersion(boardMemberCategoryCorrectionVersion);
    }
    if (!areCompletedProfilesSeeded) {
      await syncCompletedBoardMemberProfiles({
        categoryIds: categoryResult.categoryIds,
        createdBy,
      });
      await markSeedVersion(boardMemberCompletedProfilesVersion);
    }
    return;
  }

  for (const item of boardMembers) {
    await insertBoardMember(item, {
      categoryIds: categoryResult.categoryIds,
      createdBy,
    });
  }

  await markSeedVersion(boardMemberSeedVersion);
  await markSeedVersion(boardMemberCategoryCorrectionVersion);
  await markSeedVersion(boardMemberCompletedProfilesVersion);
}

async function seed() {
  await upsertUser({
    name: "Sistem Yöneticisi",
    email: env.seed.adminEmail,
    password: env.seed.adminPassword,
    role: "super_admin",
  });

  await upsertUser({
    name: "İçerik Editörü",
    email: env.seed.editorEmail,
    password: env.seed.editorPassword,
    role: "editor",
  });

  await seedSettings();
  await seedContent();
  await seedHeroSlides();
  await seedProvinceMapEntries();
  await seedBoardMembers();
}

if (require.main === module) {
  seed()
    .then(async () => {
      console.log("Seed tamamlandı.");
      await pool.end();
    })
    .catch(async (error) => {
      console.error(error);
      await pool.end();
      process.exit(1);
    });
}

module.exports = seed;
module.exports.boardMemberCategories = boardMemberCategories;
module.exports.boardMembers = boardMembers;
module.exports.seedBoardMemberCategories = seedBoardMemberCategories;
module.exports.seedBoardMembers = seedBoardMembers;
module.exports.seedHeroSlides = seedHeroSlides;
