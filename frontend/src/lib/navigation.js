/**
 * Desktop mega/dropdown menu data for Tüketiciler Birliği.
 * Real routes use existing paths; placeholders use "#" (non-navigating).
 */
export const navigationMenu = [
  {
    item: "Anasayfa",
    href: "/"
  },
  {
    item: "Kurumsal",
    links: [
      { label: "Hakkımızda", href: "/kurumsal" },
      { label: "Misyon ve Vizyon", href: "#" },
      { label: "Yönetim Kurulu", href: "#" },
      { label: "Organizasyon Şeması", href: "#" },
      {
        label: "Mevzuat",
        href: "#",
        submenu: [
          { label: "Kanunlar", href: "#" },
          { label: "Yönetmelikler", href: "#" },
          { label: "Esas ve Usuller", href: "#" },
          { label: "Yönergeler", href: "#" }
        ]
      },
      {
        label: "Stratejik Yönetim",
        href: "#",
        submenu: [
          { label: "Stratejik Plan", href: "#" },
          { label: "Performans Programı", href: "#" },
          { label: "Faaliyet Raporları", href: "#" }
        ]
      },
      { label: "Kariyer", href: "#" }
    ]
  },
  {
    item: "Hak Rehberleri",
    href: "/hak-rehberleri",
    links: [
      { label: "Tüm Rehberler", href: "/hak-rehberleri" },
      { label: "Ayıplı Mal ve Hizmet", href: "#" },
      { label: "Cayma Hakkı", href: "#" },
      { label: "Mesafeli Satış", href: "#" },
      { label: "Garanti, İade ve Değişim", href: "#" },
      { label: "Tüketici Kredileri", href: "#" }
    ]
  },
  {
    item: "Başvurular",
    links: [
      { label: "Başvuru Rehberi", href: "/basvuru-rehberi" },
      { label: "Başvuru Yap", href: "/basvuru-yap" },
      { label: "Tüketici Haritası", href: "/tuketici-haritasi" },
      { label: "Başvuru Süreci", href: "#" },
      { label: "Gerekli Belgeler", href: "#" },
      { label: "Sıkça Sorulan Sorular", href: "/sss" }
    ]
  },
  {
    item: "Yayınlar",
    links: [
      { label: "Haberler", href: "/haberler" },
      { label: "Duyurular", href: "/duyurular" },
      { label: "Raporlar", href: "#" },
      { label: "Broşür ve Yayınlar", href: "#" },
      { label: "İstatistikler", href: "#" }
    ]
  },
  {
    item: "Basın Odası",
    links: [
      { label: "Basın Bültenleri", href: "#" },
      { label: "Medya Kiti", href: "#" },
      { label: "Görsel Arşiv", href: "#" },
      { label: "Basın İletişim", href: "/iletisim" }
    ]
  },
  {
    item: "İletişim",
    href: "/iletisim"
  }
];

/** Flat links used by search, footer and mobile fallbacks (real routes only). */
export const publicNavigation = [
  { key: "home", href: "/", title: "Anasayfa" },
  { key: "corporate", href: "/kurumsal", title: "Kurumsal" },
  { key: "guides", href: "/hak-rehberleri", title: "Hak Rehberleri" },
  { key: "news", href: "/haberler", title: "Haberler" },
  { key: "announcements", href: "/duyurular", title: "Duyurular" },
  { key: "applicationGuide", href: "/basvuru-rehberi", title: "Başvuru Rehberi" },
  { key: "applyNow", href: "/basvuru-yap", title: "Başvuru Yap" },
  { key: "provinceMap", href: "/tuketici-haritasi", title: "Tüketici Haritası" },
  { key: "faq", href: "/sss", title: "Sıkça Sorulan Sorular" },
  { key: "contact", href: "/iletisim", title: "İletişim" }
];

/** Legal / utility links for the fat footer. */
export const footerLegalLinks = [
  { label: "Gizlilik", href: "/gizlilik" },
  { label: "Aydınlatma Metni", href: "/aydinlatma-metni" },
  { label: "KVKK", href: "/kvkk" },
  { label: "Sıkça Sorulan Sorular", href: "/sss" }
];

function flattenFooterLinks(links = []) {
  const result = [];

  for (const link of links) {
    result.push({ label: link.label, href: link.href });
    if (!Array.isArray(link.submenu)) continue;
    for (const sub of link.submenu) {
      result.push({ label: sub.label, href: sub.href });
    }
  }

  return result;
}

/**
 * Multi-column footer sitemap derived from the desktop mega menu.
 * Columns with only a top-level href become a single-link list.
 */
export function getFooterColumns(menu = navigationMenu) {
  const columns = [];

  for (const entry of menu) {
    if (entry.item === "Anasayfa" || entry.item === "İletişim") continue;

    if (Array.isArray(entry.links) && entry.links.length > 0) {
      columns.push({
        title: entry.item,
        href: entry.href || null,
        links: flattenFooterLinks(entry.links)
      });
      continue;
    }

    if (entry.href && entry.href !== "#") {
      columns.push({
        title: entry.item,
        href: entry.href,
        links: [{ label: entry.item, href: entry.href }]
      });
    }
  }

  return columns;
}

export const adminNavigation = [
  { title: "Özet", href: "/admin" },
  { title: "Hero", href: "/admin/hero" },
  { title: "Harita", href: "/admin/harita" },
  { title: "SSS", href: "/admin/sss" },
  { title: "İçerikler", href: "/admin/icerikler" },
  { title: "Formlar", href: "/admin/formlar" },
  { title: "Medya", href: "/admin/medya" },
  { title: "Ayarlar", href: "/admin/ayarlar" },
  { title: "Kullanıcılar", href: "/admin/kullanicilar" }
];

function isPlaceholderHref(href) {
  return !href || href === "#";
}

function normalizePath(path) {
  if (!path) return "/";
  const cleaned = path.split("?")[0].split("#")[0].replace(/\/+$/, "");
  return cleaned || "/";
}

/** True when pathname is href or a nested route under href. Home only exact. */
export function pathMatchesHref(pathname, href) {
  if (isPlaceholderHref(href)) return false;
  const path = normalizePath(pathname);
  const target = normalizePath(href);
  if (target === "/") return path === "/";
  return path === target || path.startsWith(`${target}/`);
}

/**
 * Longest-match active trail through the desktop menu tree.
 * Example on /haberler/foo → { topItem: "Yayınlar", linkLabel: "Haberler", subLabel: null }
 */
export function findActiveNavTrail(menu = navigationMenu, pathname = "/") {
  let best = null;
  const path = normalizePath(pathname);

  function consider(candidate) {
    if (!best) {
      best = candidate;
      return;
    }
    if (candidate.score > best.score) {
      best = candidate;
      return;
    }
    // Same path strength → prefer deeper trail so parents + leaf both light up.
    if (candidate.score === best.score && candidate.depth > best.depth) {
      best = candidate;
    }
  }

  function matchScore(href) {
    if (!pathMatchesHref(pathname, href)) return null;
    const target = normalizePath(href);
    return target.length + (path === target ? 1000 : 0);
  }

  for (const entry of menu) {
    const topScore = matchScore(entry.href);
    if (topScore != null) {
      consider({
        score: topScore,
        depth: 0,
        topItem: entry.item,
        linkLabel: null,
        subLabel: null
      });
    }

    for (const link of entry.links || []) {
      if (Array.isArray(link.submenu)) {
        for (const sub of link.submenu) {
          const subScore = matchScore(sub.href);
          if (subScore == null) continue;
          consider({
            score: subScore,
            depth: 2,
            topItem: entry.item,
            linkLabel: link.label,
            subLabel: sub.label
          });
        }
      }

      const linkScore = matchScore(link.href);
      if (linkScore != null) {
        consider({
          score: linkScore,
          depth: 1,
          topItem: entry.item,
          linkLabel: link.label,
          subLabel: null
        });
      }
    }
  }

  return best;
}
