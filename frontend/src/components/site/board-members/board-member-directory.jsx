"use client";

import { motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";
import { BoardCategoryNavigation } from "./board-category-navigation";
import { MemberCard } from "./member-card";

const allMembersKey = "all";

export function BoardMemberDirectory({ groups, labels }) {
  const [selectedGroup, setSelectedGroup] = useState(allMembersKey);
  const shouldReduceMotion = useReducedMotion();
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

  return (
    <section className="gridContainer bg-white pb-20 sm:pb-28 lg:pb-36">
      <div className="mx-auto grid w-full max-w-[88rem] gap-10 py-12 sm:py-16 lg:grid-cols-[13rem_minmax(0,1fr)] lg:items-start lg:gap-12 lg:py-24">
        <motion.aside className="min-w-0 lg:sticky lg:top-28" layoutRoot>
          <BoardCategoryNavigation
            activeId={selectedGroup}
            categoryLabel={labels.categoryIndex}
            navigationLabel={labels.categoryNavLabel}
            onSelect={setSelectedGroup}
            reduceMotion={shouldReduceMotion}
            tabs={tabs}
          />
        </motion.aside>

        <div
          aria-label={activeTab.title}
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
