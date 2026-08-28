import Image from "next/image";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { LockKeyhole, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  return (
    <main className="relative min-h-svh overflow-hidden bg-white">
      <div aria-hidden="true" className="admin-login-grid absolute inset-0 opacity-70" />
      <div className="relative mx-auto grid min-h-svh w-full max-w-[92rem] lg:grid-cols-[minmax(22rem,0.9fr)_minmax(32rem,1.1fr)]">
        <section className="relative hidden overflow-hidden border-r border-line bg-[#f8fafc]/90 p-10 lg:flex lg:flex-col lg:justify-between xl:p-14">
          <div>
            <Image
              alt="Tüketici Birliği"
              className="h-auto w-[13rem]"
              height={78}
              priority
              src="/main-logo-yatay.svg"
              width={280}
            />
          </div>

          <div className="max-w-lg pb-6">
            <div aria-hidden="true" className="mb-7 flex h-px w-16 overflow-hidden bg-primary/20">
              <span className="h-full w-10 bg-primary" />
              <span className="h-full flex-1 bg-secondary" />
            </div>
            <p className="font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-primary">
              Kurumsal yönetim
            </p>
            <h1 className="mt-4 max-w-md text-4xl font-semibold leading-[1.08] tracking-[-0.045em] text-ink xl:text-5xl">
              İçeriklerinizi tek ve düzenli bir çalışma alanından yönetin.
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-muted">
              Kurul üyeleri, yayınlar, başvurular ve site ayarları için sadeleştirilmiş yönetim paneli.
            </p>
          </div>

          <div className="flex items-center gap-3 border-t border-line pt-6 text-sm text-muted">
            <ShieldCheck aria-hidden="true" className="size-4 text-primary" />
            <span>Yalnızca yetkili kullanıcı erişimi</span>
          </div>
        </section>

        <section className="flex min-h-svh items-center justify-center px-5 py-10 sm:px-10 lg:px-14">
          <div className="w-full max-w-[27rem]">
            <div className="mb-10 flex items-center justify-between lg:hidden">
              <Image alt="Tüketici Birliği" className="h-auto w-[10.5rem]" height={56} priority src="/main-logo-yatay.svg" width={220} />
              <span className="grid size-9 place-items-center rounded-full border border-line bg-white text-primary shadow-xs">
                <LockKeyhole aria-hidden="true" className="size-4" />
              </span>
            </div>

            <div className="mb-8">
              <div className="flex items-center gap-2">
                <span className="h-px w-7 bg-secondary" />
                <p className="font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-secondary-dark">
                  Yönetim paneli
                </p>
              </div>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-ink sm:text-[2.25rem]">Tekrar hoş geldiniz</h2>
              <p className="mt-2 text-sm leading-6 text-muted">Devam etmek için yönetici hesabınızla giriş yapın.</p>
            </div>

            <AdminLoginForm />
          </div>
        </section>
      </div>
    </main>
  );
}
