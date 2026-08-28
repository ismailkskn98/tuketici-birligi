"use client";

import { useEffect, useMemo, useState } from "react";
import { MemberCard } from "./member-card";

const allMembersKey = "all";

export function BoardMemberDirectory({ groups, labels }) {
  const [selectedGroup, setSelectedGroup] = useState(allMembersKey);
  const members = useMemo(
    () =>
      groups.flatMap((group) =>
        group.members.map((member) => ({
          ...member,
          groupId: group.id,
        })),
      ),
    [groups],
  );
  const tabs = [
    {
      id: allMembersKey,
      title: labels.allMembers,
    },
    ...groups.map((group) => ({
      id: group.id,
      title: group.title,
    })),
  ];
  const activeTab = tabs.find((tab) => tab.id === selectedGroup) || tabs[0];

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("board-directory-change"));
  }, [selectedGroup]);

  return (
    <section className="gridContainer bg-white pb-20 sm:pb-28 lg:pb-36">
      <div className="mx-auto grid w-full max-w-[88rem] gap-10 py-12 sm:py-16 lg:grid-cols-[13rem_minmax(0,1fr)] lg:items-start lg:gap-12 lg:py-24">
        <aside className="min-w-0 lg:sticky lg:top-28">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8a93a2]">
            {labels.categoryIndex}
          </p>
          <div
            aria-label={labels.categoryNavLabel}
            className="mt-5 flex snap-x gap-0 overflow-x-auto border-b border-[#dfe3e8] lg:block lg:overflow-visible lg:border-b-0 lg:border-l"
            role="tablist"
          >
            {tabs.map((tab) => {
              const isActive = tab.id === selectedGroup;

              return (
                <button
                  aria-controls="board-member-panel"
                  aria-selected={isActive}
                  className={`relative flex shrink-0 snap-start items-center px-4 py-3 text-left text-sm transition-colors focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-inset lg:w-full lg:py-3.5 ${
                    isActive
                      ? "font-semibold text-[#14213d] before:absolute before:bottom-[-1px] before:left-0 before:h-0.5 before:w-full before:bg-[#14213d] lg:before:-left-px lg:before:bottom-auto lg:before:top-0 lg:before:h-full lg:before:w-0.5"
                      : "font-medium text-[#8a93a2] hover:text-[#39465d]"
                  }`}
                  id={`board-tab-${tab.id}`}
                  key={tab.id}
                  onClick={() => setSelectedGroup(tab.id)}
                  role="tab"
                  type="button"
                >
                  <span className="whitespace-nowrap">{tab.title}</span>
                </button>
              );
            })}
          </div>
        </aside>

        <div
          aria-labelledby={`board-tab-${activeTab.id}`}
          id="board-member-panel"
          role="tabpanel"
        >
          <div className="mb-8 border-b border-[#e8ebef] pb-5 sm:mb-10">
            <p className="font-heading text-2xl font-medium tracking-[-0.04em] text-[#14213d] sm:text-[1.75rem]">
              {activeTab.title}
            </p>
          </div>

          <div
            className="grid min-w-0 items-start gap-x-7 gap-y-14 sm:grid-cols-2 sm:gap-y-18 xl:grid-cols-3 xl:gap-x-8 xl:gap-y-20"
            data-board-group
          >
            {members.map((member, index) => (
              <MemberCard
                index={index}
                isVisible={selectedGroup === allMembersKey || member.groupId === selectedGroup}
                key={member.id}
                member={member}
                portraitAlt={labels.portraitAlt.replace("{name}", member.fullName)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
