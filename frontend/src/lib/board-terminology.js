export function normalizeBoardLabel(value) {
  if (typeof value !== "string") return value;

  return value.replace(/^(?:Geçici|Interim)\s+/iu, "").trim();
}

export function normalizeBoardCategorySlug(slug) {
  return ["gecici-yonetim-kurulu", "interim-board"].includes(slug)
    ? "yonetim-kurulu"
    : slug;
}

export function hasLegacyBoardTerminology(members = []) {
  return members.some((member) =>
    /^(?:Geçici|Interim)\s+/iu.test(member.boardRole || "") ||
    /^(?:Geçici|Interim)\s+/iu.test(member.category?.title || "") ||
    ["gecici-yonetim-kurulu", "interim-board"].includes(member.category?.slug)
  );
}

export function mergeBoardMemberFallbacks(members, fallbackMembers) {
  const existingNames = new Set(members.map((member) => member.fullName));
  const mergedMembers = [
    ...members,
    ...fallbackMembers.filter((member) => !existingNames.has(member.fullName)),
  ];

  return mergedMembers.sort((first, second) => {
    const categoryDifference =
      (first.category?.sortOrder ?? 9999) - (second.category?.sortOrder ?? 9999);

    if (categoryDifference) return categoryDifference;
    if (first.sortOrder !== second.sortOrder) return first.sortOrder - second.sortOrder;
    return first.fullName.localeCompare(second.fullName, "tr");
  });
}

export function normalizePublicBoardMembers(members = []) {
  return members.map((member) => ({
    ...member,
    boardRole: normalizeBoardLabel(member.boardRole),
    category: member.category
      ? {
          ...member.category,
          title: normalizeBoardLabel(member.category.title),
          slug: normalizeBoardCategorySlug(member.category.slug),
        }
      : null,
  }));
}

export function normalizeAdminBoardMember(member) {
  return {
    ...member,
    roleTr: normalizeBoardLabel(member.roleTr),
    roleEn: normalizeBoardLabel(member.roleEn),
    category: member.category
      ? {
          ...member.category,
          titleTr: normalizeBoardLabel(member.category.titleTr),
          titleEn: normalizeBoardLabel(member.category.titleEn),
        }
      : null,
  };
}

export function normalizeAdminBoardCategory(category) {
  return {
    ...category,
    titleTr: normalizeBoardLabel(category.titleTr),
    titleEn: normalizeBoardLabel(category.titleEn),
    slug: normalizeBoardCategorySlug(category.slug),
  };
}
