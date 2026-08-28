export function normalizeBoardLabel(value) {
  if (typeof value !== "string") return value;

  return value.replace(/^(?:Geçici|Interim)\s+/iu, "").trim();
}

export function normalizeBoardCategorySlug(slug) {
  return ["gecici-yonetim-kurulu", "interim-board"].includes(slug)
    ? "yonetim-kurulu"
    : slug;
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
