import { getTranslations } from "next-intl/server";
import { getBoardMembers } from "@/lib/api";
import { BoardMemberDirectory } from "./board-member-directory";
import { BoardMembersMotion } from "./board-members-motion";

function groupMembers(members, generalGroupTitle, generalGroupSlug) {
  const groups = new Map();

  for (const member of members) {
    const key = member.category?.slug
      ? `category-${member.category.slug}`
      : "general";

    if (!groups.has(key)) {
      groups.set(key, {
        id: key,
        title: member.category?.title || generalGroupTitle,
        slug: member.category?.slug || generalGroupSlug,
        sortOrder: member.category?.sortOrder ?? 9999,
        members: [],
      });
    }

    groups.get(key).members.push(member);
  }

  return [...groups.values()].sort((first, second) => first.sortOrder - second.sortOrder);
}

export async function BoardMembersPageContent({ locale }) {
  const [t, members] = await Promise.all([
    getTranslations("BoardMembers"),
    getBoardMembers(locale),
  ]);
  const groups = groupMembers(
    members,
    t("generalGroup"),
    locale === "en" ? "board-members" : "kurul-uyeleri",
  );

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: members.map((member, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Person",
        name: member.fullName,
        jobTitle: member.boardRole || member.professionalTitle,
        image: member.image.url,
      },
    })),
  };

  return (
    <main
      className="relative isolate overflow-x-clip bg-white text-ink"
      data-board-motion-root
    >
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        type="application/ld+json"
      />

      <header className="gridContainer border-b border-[#e8ebef] bg-white">
        <div className="mx-auto grid w-full max-w-[88rem] gap-10 py-14 sm:py-18 lg:grid-cols-[minmax(0,1.45fr)_minmax(18rem,0.55fr)] lg:items-end lg:gap-20 lg:py-24">
          <div data-board-masthead-item>
            <p className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-secondary sm:text-[11px]">
              <span aria-hidden="true" className="h-px w-8 bg-secondary" />
              {t("eyebrow")}
            </p>
            <h1 className="mt-7 max-w-[13ch] font-heading text-[clamp(3.25rem,6.8vw,6.3rem)] font-medium leading-[0.9] tracking-[-0.06em] text-[#14213d] sm:mt-8">
              {t("title")}
            </h1>
          </div>

          <div className="border-t border-[#dfe3e8] pt-6" data-board-masthead-item>
            <p className="max-w-[34rem] text-sm leading-7 text-[#657083] sm:text-[15px]">
              {t("description")}
            </p>
          </div>
        </div>
      </header>

      {groups.length ? (
        <BoardMemberDirectory
          groups={groups}
          labels={{
            allMembers: t("allMembers"),
            categoryIndex: t("categoryIndex"),
            categoryNavLabel: t("categoryNavLabel"),
            portraitAlt: t.raw("portraitAlt"),
            viewToggle: {
              group: t("viewToggleGroup"),
              single: t("singleColumnView"),
              double: t("twoColumnView"),
            },
          }}
        />
      ) : (
        <section className="gridContainer bg-white py-20 sm:py-28">
          <div className="mx-auto max-w-3xl border-y border-[#e8ebef] py-16 text-center sm:py-20">
            <p className="font-heading text-2xl font-medium leading-tight text-[#14213d] sm:text-3xl">
              {t("empty")}
            </p>
          </div>
        </section>
      )}

      <BoardMembersMotion />
    </main>
  );
}
