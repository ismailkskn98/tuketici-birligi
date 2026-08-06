"use client";

import { ClipboardList, Inbox, Mail, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminAlert } from "@/components/admin/common/admin-alert";
import { AdminEmptyState } from "@/components/admin/common/admin-empty-state";
import { AdminPage } from "@/components/admin/common/admin-page";
import { AdminSelect } from "@/components/admin/common/admin-select";
import { AdminStatCard } from "@/components/admin/common/admin-stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { listFormSubmissions, updateFormSubmission } from "@/lib/admin-api";
import { formatDate } from "@/lib/utils";

const statusOptions = [
  { label: "Yeni", value: "new" },
  { label: "İncelemede", value: "in_review" },
  { label: "Çözüldü", value: "resolved" },
  { label: "Spam", value: "spam" },
];

const typeOptions = [
  { label: "Başvuru", value: "pre_application" },
  { label: "İletişim", value: "contact" },
];

const statusLabels = {
  new: "Yeni",
  in_review: "İncelemede",
  resolved: "Çözüldü",
  spam: "Spam",
};

const statusStyles = {
  new: "bg-primary-soft text-primary-dark",
  in_review: "bg-wheat/20 text-ink",
  resolved: "bg-secondary-soft text-secondary-dark",
  spam: "bg-surface text-muted",
};

function DetailRow({ label, value }) {
  if (!value) return null;

  return (
    <div className="grid gap-1">
      <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">{label}</dt>
      <dd className="text-sm leading-6 text-ink">{value}</dd>
    </div>
  );
}

export function FormSubmissionsAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filters, setFilters] = useState({
    formType: "",
    query: "",
    status: "",
  });

  const stats = useMemo(
    () => ({
      total: items.length,
      applications: items.filter((item) => item.formType === "pre_application").length,
      newItems: items.filter((item) => item.status === "new").length,
    }),
    [items],
  );

  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await listFormSubmissions({
        formType: filters.formType,
        q: filters.query,
        status: filters.status,
      });
      setItems(data.items || []);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, [filters.formType, filters.query, filters.status]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadItems();
    }, 200);

    return () => clearTimeout(timeout);
  }, [loadItems]);

  async function handleStatusChange(item, status) {
    try {
      setSavingId(item.id);
      await updateFormSubmission(item.id, { status });
      setItems((current) => current.map((entry) => (entry.id === item.id ? { ...entry, status } : entry)));
      setSelectedItem((current) => (current?.id === item.id ? { ...current, status } : current));
    } catch (updateError) {
      setError(updateError.message);
    } finally {
      setSavingId(null);
    }
  }

  return (
    <AdminPage
      description="İletişim ve tüketici başvuru kayıtlarını inceleyin, durumlarını güncelleyin."
      title="Formlar"
    >
      <div className="grid gap-4 md:grid-cols-3">
        <AdminStatCard description="Son 200 kayıt" icon={Inbox} title="Toplam" value={stats.total} />
        <AdminStatCard description="Tüketici başvuruları" icon={ClipboardList} title="Başvuru" value={stats.applications} />
        <AdminStatCard description="İşlem bekleyenler" icon={Mail} title="Yeni" value={stats.newItems} />
      </div>

      <section className="grid gap-4 rounded-lg border border-line bg-white p-4 shadow-xs md:p-5">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_12rem_12rem]">
          <label className="relative">
            <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
            <Input
              className="pl-9"
              onChange={(event) => setFilters((current) => ({ ...current, query: event.target.value }))}
              placeholder="Başvuru no, ad, e-posta veya konu"
              value={filters.query}
            />
          </label>
          <AdminSelect
            onChange={(event) => setFilters((current) => ({ ...current, formType: event.target.value }))}
            options={typeOptions}
            placeholder="Tüm türler"
            value={filters.formType}
          />
          <AdminSelect
            onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}
            options={statusOptions}
            placeholder="Tüm durumlar"
            value={filters.status}
          />
        </div>

        {error ? <AdminAlert title="Kayıtlar yüklenemedi">{error}</AdminAlert> : null}

        {loading ? (
          <div className="grid gap-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : items.length ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Başvuru No</TableHead>
                <TableHead>Ad Soyad</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.applicationNumber || "—"}</TableCell>
                  <TableCell>
                    <div className="grid gap-0.5">
                      <span>{item.fullName}</span>
                      <span className="text-xs text-muted">{item.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>{item.category || item.subject}</TableCell>
                  <TableCell>
                    <Badge className={statusStyles[item.status] || statusStyles.new}>{statusLabels[item.status] || item.status}</Badge>
                  </TableCell>
                  <TableCell>{formatDate(item.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <Button onClick={() => setSelectedItem(item)} size="sm" variant="outline">
                      Detay
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <AdminEmptyState
            description="Filtrelere uygun form kaydı bulunamadı."
            title="Kayıt yok"
          />
        )}
      </section>

      <Dialog onOpenChange={(open) => !open && setSelectedItem(null)} open={Boolean(selectedItem)}>
        <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedItem?.applicationNumber || selectedItem?.subject || "Form detayı"}</DialogTitle>
            <DialogDescription>
              {selectedItem?.formType === "pre_application" ? "Tüketici başvurusu" : "İletişim formu"} · {formatDate(selectedItem?.createdAt)}
            </DialogDescription>
          </DialogHeader>

          {selectedItem ? (
            <div className="grid gap-5">
              <dl className="grid gap-4 sm:grid-cols-2">
                <DetailRow label="Ad Soyad" value={selectedItem.fullName} />
                <DetailRow label="E-posta" value={selectedItem.email} />
                <DetailRow label="Telefon" value={selectedItem.phone} />
                <DetailRow label="Kategori" value={selectedItem.category} />
                <DetailRow label="Firma" value={selectedItem.payload?.companyName} />
                <DetailRow label="Ürün / Hizmet" value={selectedItem.payload?.productName} />
                <DetailRow label="Alışveriş tarihi" value={selectedItem.payload?.purchaseDate} />
                <DetailRow label="Talep edilen tutar" value={selectedItem.payload?.requestedAmount} />
              </dl>

              <div className="grid gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">Açıklama</p>
                <p className="whitespace-pre-wrap text-sm leading-7 text-ink">{selectedItem.message}</p>
              </div>

              {selectedItem.payload?.files?.length ? (
                <div className="grid gap-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">Dosyalar</p>
                  <ul className="grid gap-2">
                    {selectedItem.payload.files.map((file) => (
                      <li key={`${file.originalName}-${file.publicUrl || file.path}`}>
                        {file.publicUrl ? (
                          <a className="text-sm text-primary-dark underline-offset-2 hover:underline" href={file.publicUrl} rel="noreferrer" target="_blank">
                            {file.originalName}
                          </a>
                        ) : (
                          <span className="text-sm text-ink">{file.originalName}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="grid gap-2 sm:max-w-xs">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">Durum</p>
                <AdminSelect
                  disabled={savingId === selectedItem.id}
                  onChange={(event) => handleStatusChange(selectedItem, event.target.value)}
                  options={statusOptions}
                  placeholder="Durum seçin"
                  value={selectedItem.status}
                />
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </AdminPage>
  );
}
