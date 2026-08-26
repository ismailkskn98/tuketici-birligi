import { getTranslations } from "next-intl/server";
import { getBoardMembers } from "@/lib/api";
import { BoardMembersMotion } from "./board-members-motion";
import { MemberCard } from "./member-card";

export async function BoardMembersPageContent({ locale }) {
  const [t, members] = await Promise.all([
    getTranslations("BoardMembers"),
    getBoardMembers(locale),
  ]);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: members.map((member, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Person",
        name: member.fullName,
        jobTitle: member.professionalTitle,
        image: member.image.url,
      },
    })),
  };

  return (
    <div
      className="relative isolate overflow-hidden bg-white text-ink"
      data-board-motion-root
    >
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        type="application/ld+json"
      />

      <header className="gridContainer border-b border-[#e9eaec] bg-white">
        <div className="relative mx-auto w-full max-w-[82rem] overflow-hidden pb-16 pt-14 sm:pb-20 sm:pt-18 lg:pb-24 lg:pt-20">
          <p
            className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-secondary sm:text-[11px]"
            data-board-masthead-item
          >
            <span aria-hidden="true" className="h-px w-8 bg-secondary" />
            {t("eyebrow")}
          </p>

          <h1
            className="mt-8 max-w-[10ch] font-heading text-[clamp(3.5rem,8vw,7.5rem)] font-medium leading-[0.78] tracking-[-0.07em] text-[#14213d] sm:mt-10"
            data-board-masthead-item
          >
            <span className="block">{t("titleLineOne")}</span>
            <span className="ml-[0.7em] block text-[#273652] sm:ml-[1.15em]">
              {t("titleLineTwo")}
            </span>
          </h1>

          <div
            className="mt-9 max-w-[38rem] sm:ml-[12vw] sm:mt-11"
            data-board-masthead-item
          >
            <span aria-hidden="true" className="mb-5 block h-0.5 w-10 bg-secondary" />
            <p className="text-sm leading-7 text-[#5e6879] sm:text-[15px]">
              {t("description")}
            </p>
          </div>
        </div>
      </header>

      <section className="gridContainer py-14 sm:py-20 lg:py-24">
        {members.length ? (
          <div className="mx-auto w-full max-w-[82rem]">
            <div className="mb-10 flex items-end justify-between gap-6 border-b border-[#e9eaec] pb-5 sm:mb-14 sm:pb-6">
              <h2 className="font-heading text-xl font-medium tracking-[-0.03em] text-[#14213d] sm:text-2xl">
                {t("membersTitle")}
              </h2>
              <p className="shrink-0 text-xs font-medium text-[#717b8b]">
                {t("memberCount", { count: members.length })}
              </p>
            </div>

            <div className="grid min-w-0 gap-x-8 gap-y-16 md:grid-cols-2 md:gap-y-20 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-24">
              {members.map((member, index) => (
                <MemberCard
                  index={index}
                  key={member.id}
                  member={member}
                  portraitAlt={t("portraitAlt", { name: member.fullName })}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl border-y border-[#e9eaec] py-16 text-center sm:py-20">
            <p className="font-heading text-2xl font-medium leading-tight text-[#14213d] sm:text-3xl">
              {t("empty")}
            </p>
          </div>
        )}
      </section>

      <BoardMembersMotion />
    </div>
  );
}
