"use client";

import { FileText, LoaderCircle, Newspaper, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AdminFormField } from "@/components/admin/common/admin-form-field";
import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
} from "@/components/ui/combobox";
import { listPublicContent } from "@/lib/admin-api";

const STATIC_INTERNAL_LINK_OPTIONS = [
  { value: "", label: "Bağlantı kullanma", icon: Sparkles },
  { value: "/", label: "Ana sayfa", icon: FileText },
  { value: "/kurumsal", label: "Kurumsal", icon: FileText },
  { value: "/basvuru-rehberi", label: "Başvuru Rehberi", icon: FileText },
  { value: "/basvuru-yap", label: "Başvuru Yap", icon: FileText },
  { value: "/hak-rehberleri", label: "Hak Rehberleri", icon: FileText },
  { value: "/haberler", label: "Haberler", icon: FileText },
  { value: "/duyurular", label: "Duyurular", icon: FileText },
  { value: "/sss", label: "Sıkça Sorulan Sorular", icon: FileText },
  { value: "/iletisim", label: "İletişim", icon: FileText },
  { value: "/aydinlatma-metni", label: "Aydınlatma Metni", icon: FileText },
  { value: "/kvkk", label: "KVKK", icon: FileText },
  { value: "/gizlilik", label: "Gizlilik Politikası", icon: FileText },
];

function LinkOption({ option }) {
  const Icon = option.icon;

  return (
    <>
      <Icon className="text-muted" />
      <div className="grid min-w-0 gap-0.5">
        <span className="truncate">{option.label}</span>
        {option.value ? <span className="truncate text-xs text-muted">{option.value}</span> : null}
      </div>
    </>
  );
}

export function HeroLinkField({ ctaHref, error, register, setValue }) {
  const [linkItems, setLinkItems] = useState([]);
  const [linkItemsError, setLinkItemsError] = useState("");
  const [loadingLinkItems, setLoadingLinkItems] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadLinkItems() {
      try {
        setLoadingLinkItems(true);
        setLinkItemsError("");
        const data = await listPublicContent({ locale: "tr", limit: 50 });

        if (cancelled) return;

        setLinkItems((data?.items || []).filter((entry) => entry.slug && ["news", "guide"].includes(entry.type)));
      } catch (loadError) {
        if (!cancelled) {
          setLinkItemsError(loadError.message || "Bağlantı seçenekleri yüklenemedi.");
        }
      } finally {
        if (!cancelled) {
          setLoadingLinkItems(false);
        }
      }
    }

    void loadLinkItems();

    return () => {
      cancelled = true;
    };
  }, []);

  const newsLinkOptions = useMemo(
    () =>
      linkItems
        .filter((entry) => entry.type === "news")
        .map((entry) => ({
          value: `/haberler/${entry.slug}`,
          label: entry.title,
          icon: Newspaper,
        })),
    [linkItems],
  );

  const guideLinkOptions = useMemo(
    () =>
      linkItems
        .filter((entry) => entry.type === "guide")
        .map((entry) => ({
          value: `/hak-rehberleri/${entry.slug}`,
          label: entry.title,
          icon: FileText,
        })),
    [linkItems],
  );

  const linkableOptions = useMemo(
    () => [...STATIC_INTERNAL_LINK_OPTIONS, ...newsLinkOptions, ...guideLinkOptions],
    [guideLinkOptions, newsLinkOptions],
  );

  const selectedLinkOption = useMemo(
    () => linkableOptions.find((option) => option.value === ctaHref) || STATIC_INTERNAL_LINK_OPTIONS[0],
    [ctaHref, linkableOptions],
  );

  return (
    <section className="grid gap-5 rounded-lg border border-line bg-white p-4">
      <div className="grid gap-1">
        <h3 className="text-base font-semibold text-ink">Yönlendirme</h3>
        <p className="text-sm leading-6 text-muted">CTA butonu için yalnızca site içi bağlantı seçilebilir.</p>
      </div>

      <AdminFormField
        error={error}
        hint={
          linkItemsError ||
          "Yayınlanmış haber ve hak rehberi içerikleri listeye otomatik eklenir."
        }
        label="CTA bağlantısı"
      >
        <input type="hidden" {...register("ctaHref")} />

        <Combobox
          itemToStringValue={(option) => {
            if (!option) return "";
            return option.value ? `${option.label} (${option.value})` : option.label;
          }}
          items={linkableOptions}
          onValueChange={(option) => {
            setValue("ctaHref", option?.value || "", { shouldDirty: true, shouldValidate: true });
          }}
          value={selectedLinkOption}
        >
          <ComboboxInput placeholder="Sayfa veya haber ara..." showClear />
          <ComboboxContent>
            <ComboboxEmpty>Aramanızla eşleşen bağlantı bulunamadı.</ComboboxEmpty>
            <ComboboxList className="max-h-72">
              {loadingLinkItems ? (
                <div className="flex items-center gap-2 px-3 py-3 text-sm text-muted">
                  <LoaderCircle className="size-4 animate-spin" />
                  Bağlantı seçenekleri yükleniyor...
                </div>
              ) : (
                <>
                  <ComboboxGroup>
                    <ComboboxLabel>Seçim</ComboboxLabel>
                    <ComboboxCollection items={STATIC_INTERNAL_LINK_OPTIONS.slice(0, 1)}>
                      {(option) => (
                        <ComboboxItem key={`choice-${option.label}`} value={option}>
                          <LinkOption option={option} />
                        </ComboboxItem>
                      )}
                    </ComboboxCollection>
                  </ComboboxGroup>

                  <ComboboxSeparator />

                  <ComboboxGroup>
                    <ComboboxLabel>Sabit sayfalar</ComboboxLabel>
                    <ComboboxCollection items={STATIC_INTERNAL_LINK_OPTIONS.slice(1)}>
                      {(option) => (
                        <ComboboxItem key={option.value} value={option}>
                          <LinkOption option={option} />
                        </ComboboxItem>
                      )}
                    </ComboboxCollection>
                  </ComboboxGroup>

                  {newsLinkOptions.length ? <ComboboxSeparator /> : null}
                  {newsLinkOptions.length ? (
                    <ComboboxGroup>
                      <ComboboxLabel>Haber içerikleri</ComboboxLabel>
                      <ComboboxCollection items={newsLinkOptions}>
                        {(option) => (
                          <ComboboxItem key={option.value} value={option}>
                            <LinkOption option={option} />
                          </ComboboxItem>
                        )}
                      </ComboboxCollection>
                    </ComboboxGroup>
                  ) : null}

                  {guideLinkOptions.length ? <ComboboxSeparator /> : null}
                  {guideLinkOptions.length ? (
                    <ComboboxGroup>
                      <ComboboxLabel>Hak rehberleri</ComboboxLabel>
                      <ComboboxCollection items={guideLinkOptions}>
                        {(option) => (
                          <ComboboxItem key={option.value} value={option}>
                            <LinkOption option={option} />
                          </ComboboxItem>
                        )}
                      </ComboboxCollection>
                    </ComboboxGroup>
                  ) : null}
                </>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </AdminFormField>
    </section>
  );
}
