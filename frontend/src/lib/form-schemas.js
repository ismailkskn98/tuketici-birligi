import { z } from "zod";

const phoneSchema = z
  .string()
  .trim()
  .min(7, "Telefon numarası çok kısa.")
  .max(30, "Telefon numarası çok uzun.");

export const contactSchema = z.object({
  fullName: z.string().trim().min(3, "Ad soyad en az 3 karakter olmalı."),
  email: z.string().trim().email("Geçerli bir e-posta adresi girin."),
  phone: phoneSchema.optional().or(z.literal("")),
  subject: z.string().trim().min(3, "Konu en az 3 karakter olmalı."),
  message: z.string().trim().min(20, "Mesaj en az 20 karakter olmalı."),
  privacy: z.literal(true, {
    errorMap: () => ({ message: "Aydınlatma metnini onaylamalısınız." })
  }),
  companyName: z.string().optional()
});

export const APPLICATION_CATEGORIES = [
  "defective_goods",
  "defective_service",
  "return_withdrawal",
  "warranty",
  "shipping",
  "subscription",
  "ecommerce",
  "banking_finance",
  "other"
];

export const preApplicationSchema = z.object({
  fullName: z.string().trim().min(3, "Ad soyad en az 3 karakter olmalı."),
  email: z.string().trim().email("Geçerli bir e-posta adresi girin."),
  phone: phoneSchema,
  category: z.string().trim().min(2, "Başvuru kategorisi seçin."),
  subject: z.string().trim().min(3, "Konu en az 3 karakter olmalı."),
  message: z
    .string()
    .trim()
    .min(50, "Ön başvuru açıklaması en az 50 karakter olmalı."),
  privacy: z.literal(true, {
    errorMap: () => ({ message: "Aydınlatma metnini onaylamalısınız." })
  }),
  companyName: z.string().optional()
});

export function createApplicationSchema(messages) {
  return z.object({
    fullName: z.string().trim().min(3, messages.fullName),
    phone: z.string().trim().min(7, messages.phone).max(30, messages.phone),
    email: z.string().trim().email(messages.email),
    category: z
      .string()
      .trim()
      .min(1, messages.category)
      .refine((value) => APPLICATION_CATEGORIES.includes(value), messages.category),
    companyName: z.string().trim().min(2, messages.companyName).max(160, messages.companyName),
    purchaseDate: z.string().optional().or(z.literal("")),
    productName: z.string().trim().max(220).optional().or(z.literal("")),
    requestedAmount: z.string().trim().max(40).optional().or(z.literal("")),
    message: z.string().trim().min(50, messages.message).max(10000, messages.message),
    privacyConsent: z.literal(true, {
      errorMap: () => ({ message: messages.privacy })
    }),
    contactConsent: z.literal(true, {
      errorMap: () => ({ message: messages.contact })
    }),
    website: z.string().optional()
  });
}

export const heroSlideSchema = z.object({
  titleTr: z
    .string()
    .trim()
    .min(2, "Türkçe başlık en az 2 karakter olmalı.")
    .max(220, "Türkçe başlık en fazla 220 karakter olabilir."),
  titleEn: z
    .string()
    .trim()
    .min(2, "İngilizce başlık en az 2 karakter olmalı.")
    .max(220, "İngilizce başlık en fazla 220 karakter olabilir."),
  summaryTr: z
    .string()
    .trim()
    .max(4000, "Türkçe özet en fazla 4000 karakter olabilir.")
    .optional()
    .or(z.literal("")),
  summaryEn: z
    .string()
    .trim()
    .max(4000, "İngilizce özet en fazla 4000 karakter olabilir.")
    .optional()
    .or(z.literal("")),
  ctaLabelTr: z
    .string()
    .trim()
    .max(80, "Türkçe buton metni en fazla 80 karakter olabilir.")
    .optional()
    .or(z.literal("")),
  ctaLabelEn: z
    .string()
    .trim()
    .max(80, "İngilizce buton metni en fazla 80 karakter olabilir.")
    .optional()
    .or(z.literal("")),
  ctaHref: z
    .string()
    .trim()
    .max(500, "Bağlantı en fazla 500 karakter olabilir.")
    .optional()
    .or(z.literal(""))
    .refine((value) => !value || value.startsWith("/"), {
      message: "Bağlantı yalnızca iç bağlantı olabilir ve / ile başlamalı."
    }),
  mediaId: z.coerce.number({
    invalid_type_error: "Masaüstü görseli seçmelisiniz."
  }).int().min(0, "Masaüstü görseli seçmelisiniz."),
  mediaMobileId: z.coerce.number({
    invalid_type_error: "Mobil görseli seçmelisiniz."
  }).int().min(0, "Mobil görseli seçmelisiniz."),
  mediaTabletId: z.coerce.number({
    invalid_type_error: "Tablet görseli seçmelisiniz."
  }).int().min(0, "Tablet görseli seçmelisiniz."),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce
    .number()
    .int("Sıra tam sayı olmalı.")
    .min(0, "Sıra 0 veya daha büyük olmalı.")
    .max(999, "Sıra en fazla 999 olabilir.")
});

const boardShortText = z
  .string()
  .trim()
  .max(160, "Bu alan en fazla 160 karakter olabilir.");

const boardSummary = z
  .string()
  .trim()
  .max(2000, "Özet en fazla 2000 karakter olabilir.");

export const boardMemberSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Ad ve soyad en az 2 karakter olmalı.")
      .max(160, "Ad ve soyad en fazla 160 karakter olabilir."),
    roleTr: boardShortText,
    roleEn: boardShortText,
    titleTr: boardShortText,
    titleEn: boardShortText,
    summaryTr: boardSummary,
    summaryEn: boardSummary,
    mediaId: z.number().int().positive().nullable(),
    categoryId: z.number().int().positive().nullable(),
    isActive: z.boolean(),
    sortOrder: z.coerce
      .number()
      .int("Görüntülenme sırası tam sayı olmalı.")
      .min(0, "Görüntülenme sırası 0 veya daha büyük olmalı.")
      .max(9999, "Görüntülenme sırası en fazla 9999 olabilir."),
    hasPortrait: z.boolean(),
  })
  .superRefine((values, context) => {
    if (Boolean(values.roleTr) !== Boolean(values.roleEn)) {
      const missingField = values.roleTr ? "roleEn" : "roleTr";
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Yönetim görevi iki dilde birlikte girilmelidir.",
        path: [missingField],
      });
    }

    if (!values.isActive) return;

    if (!values.titleTr) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Yayın için Türkçe mesleki unvan zorunludur.",
        path: ["titleTr"],
      });
    }

    if (!values.titleEn) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Yayın için İngilizce mesleki unvan zorunludur.",
        path: ["titleEn"],
      });
    }

    if (values.summaryTr.length < 10) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Yayın için Türkçe özet en az 10 karakter olmalı.",
        path: ["summaryTr"],
      });
    }

    if (values.summaryEn.length < 10) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Yayın için İngilizce özet en az 10 karakter olmalı.",
        path: ["summaryEn"],
      });
    }

    if (!values.hasPortrait) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Yayın için 4:5 oranında bir portre seçmelisiniz.",
        path: ["mediaId"],
      });
    }
  });

export const boardMemberCategorySchema = z.object({
  titleTr: z
    .string()
    .trim()
    .min(2, "Türkçe kategori adı en az 2 karakter olmalı.")
    .max(160, "Türkçe kategori adı en fazla 160 karakter olabilir."),
  titleEn: z
    .string()
    .trim()
    .min(2, "İngilizce kategori adı en az 2 karakter olmalı.")
    .max(160, "İngilizce kategori adı en fazla 160 karakter olabilir."),
  sortOrder: z.coerce
    .number()
    .int("Görüntülenme sırası tam sayı olmalı.")
    .min(0, "Görüntülenme sırası 0 veya daha büyük olmalı.")
    .max(9999, "Görüntülenme sırası en fazla 9999 olabilir."),
  isActive: z.boolean(),
});
