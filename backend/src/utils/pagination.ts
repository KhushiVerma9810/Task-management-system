export const getPagination = (pageRaw?: string, limitRaw?: string) => {
  const parsedPage = Number.parseInt(pageRaw ?? "1", 10);
  const parsedLimit = Number.parseInt(limitRaw ?? "10", 10);
  const page = Number.isNaN(parsedPage) ? 1 : Math.max(1, parsedPage);
  const limit = Number.isNaN(parsedLimit) ? 10 : Math.min(50, Math.max(1, parsedLimit));
  const skip = (page - 1) * limit;

  return { page, limit, skip, take: limit };
};

export const buildPaginationMeta = (page: number, limit: number, total: number) => {
  const totalPages = total === 0 ? 0 : Math.ceil(total / limit);
  return { page, limit, total, totalPages };
};
