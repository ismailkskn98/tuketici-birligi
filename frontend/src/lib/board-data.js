const boardCategories = {
  interim: {
    id: 9001,
    title: {
      tr: "Geçici Yönetim Kurulu",
      en: "Interim Board of Directors",
    },
    slug: "gecici-yonetim-kurulu",
    sortOrder: 10,
  },
  founders: {
    id: 9002,
    title: {
      tr: "Kurucu Üyeler",
      en: "Founding Members",
    },
    slug: "kurucu-uyeler",
    sortOrder: 20,
  },
};

const boardMembers = [
  {
    id: 90001,
    fullName: "Ali Selek",
    boardRole: {
      tr: "Geçici Başkan Yardımcısı",
      en: "Interim Vice Chair",
    },
    professionalTitle: {
      tr: "Avukat ve Arabulucu",
      en: "Attorney and Mediator",
    },
    summary: {
      tr: "Ankara Üniversitesi Hukuk Fakültesi mezunu olan Ali Selek; hâkimlik deneyiminin ardından avukatlık, uzman arabuluculuk ve bilirkişilik alanlarında çalışmakta, tahkim ve arabuluculuk eğitimleri vermektedir.",
      en: "Ali Selek graduated from Ankara University Faculty of Law. Following his judicial career, he works in legal practice, specialist mediation and expert witness services, and provides arbitration and mediation training.",
    },
    imageUrl: "/yonetim-kurulu/ali-selek.webp",
    categoryKey: "interim",
    sortOrder: 20,
  },
  {
    id: 90002,
    fullName: "Mustafa Başer",
    boardRole: {
      tr: "Geçici Sayman",
      en: "Interim Treasurer",
    },
    professionalTitle: {
      tr: "Yönetici",
      en: "Executive",
    },
    summary: {
      tr: "Adalet ile Çalışma Ekonomisi ve Endüstri İlişkileri eğitimi alan Mustafa Başer, yerel yönetimler, spor ve sivil toplum alanlarında çeşitli yönetim görevleri üstlenmiştir.",
      en: "Mustafa Başer studied Justice as well as Labour Economics and Industrial Relations, and has held various leadership roles in local government, sports and civil society.",
    },
    imageUrl: "/yonetim-kurulu/mustafa-baser.webp",
    categoryKey: "interim",
    sortOrder: 40,
  },
  {
    id: 90003,
    fullName: "Uğuralp Coşkun",
    boardRole: {
      tr: "Kurucu Üye",
      en: "Founding Member",
    },
    professionalTitle: {
      tr: "İnşaat Mühendisi",
      en: "Civil Engineer",
    },
    summary: {
      tr: "İnşaat mühendisliği eğitimini London South Bank University’de tamamlayan Uğuralp Coşkun, inşaat ve gayrimenkul alanlarında çalışmakta; mesleki standartların geliştirilmesine katkı sunmaktadır.",
      en: "Uğuralp Coşkun completed his civil engineering education at London South Bank University and works in construction and real estate, contributing to the development of professional standards.",
    },
    imageUrl: "/yonetim-kurulu/uguralp-coskun.webp",
    categoryKey: "founders",
    sortOrder: 50,
  },
  {
    id: 90004,
    fullName: "Alpay Korkmaz",
    boardRole: null,
    professionalTitle: {
      tr: "Avukat",
      en: "Attorney",
    },
    summary: {
      tr: "Ankara Sosyal Bilimler Üniversitesi Hukuk Fakültesi mezunu olan Alpay Korkmaz, Ankara 2 No’lu Barosu’na kayıtlı serbest avukat ve Tüketiciler Birliği Kurucu Genel Başkan Yardımcısıdır.",
      en: "Alpay Korkmaz graduated from Ankara Social Sciences University Faculty of Law and is an independent attorney registered with Ankara Bar Association No. 2, as well as the Founding Vice President of the Consumers Association.",
    },
    imageUrl: "/yonetim-kurulu/alpay-korkmaz.webp",
    categoryKey: null,
    sortOrder: 10,
  },
  {
    id: 90005,
    fullName: "Hakan Akçam",
    boardRole: null,
    professionalTitle: {
      tr: "Yönetici ve Girişimci",
      en: "Executive and Entrepreneur",
    },
    summary: {
      tr: "Gayrimenkul, mesleki örgütlenme ve sivil toplum alanlarında yönetim sorumlulukları üstlenen Hakan Akçam, bu alanlarda çalışmalarını sürdürmektedir.",
      en: "Hakan Akçam has held leadership responsibilities in real estate, professional organisations and civil society, and continues his work across these fields.",
    },
    imageUrl: "/yonetim-kurulu/hakan-akcam.webp",
    categoryKey: null,
    sortOrder: 20,
  },
  {
    id: 90006,
    fullName: "İrem Eskici",
    boardRole: null,
    professionalTitle: {
      tr: "Avukat",
      en: "Attorney",
    },
    summary: {
      tr: "Antalya Bilim Üniversitesi Hukuk Fakültesi mezunu olan İrem Eskici, Ankara’da avukatlık yapmakta; kamu hukuku alanında yüksek lisans ve moleküler biyoloji ve genetik alanında lisans eğitimine devam etmektedir.",
      en: "İrem Eskici graduated from Antalya Bilim University Faculty of Law and practices law in Ankara. She continues her graduate studies in public law and undergraduate studies in molecular biology and genetics.",
    },
    imageUrl: "/yonetim-kurulu/irem-eskici.webp",
    categoryKey: null,
    sortOrder: 30,
  },
  {
    id: 90007,
    fullName: "İsmail Çağlar",
    boardRole: null,
    professionalTitle: {
      tr: "Gayrimenkul Danışmanı",
      en: "Real Estate Consultant",
    },
    summary: {
      tr: "2011’den bu yana gayrimenkul sektöründe çalışan İsmail Çağlar, Ankara ve özellikle Keçiören’de konut, arsa ve ticari gayrimenkul danışmanlığı yürütmektedir.",
      en: "İsmail Çağlar has worked in real estate since 2011, providing residential, land and commercial property consultancy in Ankara, particularly in Keçiören.",
    },
    imageUrl: "/yonetim-kurulu/ismail-caglar.webp",
    categoryKey: null,
    sortOrder: 40,
  },
  {
    id: 90008,
    fullName: "Muhammed Emin Yeşil",
    boardRole: null,
    professionalTitle: {
      tr: "Avukat",
      en: "Attorney",
    },
    summary: {
      tr: "Marmara Üniversitesi Hukuk Fakültesi mezunu olan Muhammed Emin Yeşil; ticaret, şirketler, iş, gayrimenkul, yabancılar ve tüketici hukuku alanlarında çalışmaktadır.",
      en: "Muhammed Emin Yeşil graduated from Marmara University Faculty of Law and works across commercial, corporate, labour, real estate, immigration and consumer law.",
    },
    imageUrl: "/yonetim-kurulu/muhammed-emin-yesil.webp",
    categoryKey: null,
    sortOrder: 50,
  },
  {
    id: 90009,
    fullName: "Murat Kahya",
    boardRole: null,
    professionalTitle: {
      tr: "Gayrimenkul Danışmanı",
      en: "Real Estate Consultant",
    },
    summary: {
      tr: "Müteahhitlik deneyiminin ardından 2013’ten bu yana gayrimenkul danışmanlığı yapan Murat Kahya, mesleki ve sivil toplum kuruluşlarında çeşitli görevler üstlenmiştir.",
      en: "Following his experience as a contractor, Murat Kahya has worked in real estate consultancy since 2013 and has held roles in professional and civil society organisations.",
    },
    imageUrl: "/yonetim-kurulu/murat-kahya.webp",
    categoryKey: null,
    sortOrder: 60,
  },
];

export function getFallbackBoardMembers(locale = "tr") {
  const language = locale === "en" ? "en" : "tr";

  return boardMembers.map((member) => {
    const category = member.categoryKey ? boardCategories[member.categoryKey] : null;

    return {
      id: member.id,
      fullName: member.fullName,
      boardRole: member.boardRole?.[language] || null,
      professionalTitle: member.professionalTitle[language],
      summary: member.summary[language],
      category: category
        ? {
            id: category.id,
            title: category.title[language],
            slug: category.slug,
            sortOrder: category.sortOrder,
          }
        : null,
      image: {
        id: member.id,
        url: member.imageUrl,
        altText:
          language === "en"
            ? `Portrait of ${member.fullName}`
            : `${member.fullName} portresi`,
      },
      sortOrder: member.sortOrder,
    };
  });
}
