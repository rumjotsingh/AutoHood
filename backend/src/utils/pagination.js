/**
 * Pagination utility for consistent pagination across the API
 * @param {Object} query - Mongoose query object
 * @param {Number} page - Current page number
 * @param {Number} limit - Items per page
 * @returns {Object} - Paginated results with metadata
 */
export const paginate = async (query, page = 1, limit = 20) => {
  const currentPage = parseInt(page) || 1;
  const itemsPerPage = parseInt(limit) || 20;
  const skip = (currentPage - 1) * itemsPerPage;

  // Execute query with pagination
  const results = await query.skip(skip).limit(itemsPerPage);

  // Get total count
  const totalItems = await query.model.countDocuments(query.getQuery());
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return {
    data: results,
    pagination: {
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
      nextPage: currentPage < totalPages ? currentPage + 1 : null,
      prevPage: currentPage > 1 ? currentPage - 1 : null,
    },
  };
};

/**
 * Build pagination metadata
 */
export const buildPaginationMeta = (page, limit, total) => {
  const currentPage = parseInt(page) || 1;
  const itemsPerPage = parseInt(limit) || 20;
  const totalPages = Math.ceil(total / itemsPerPage);

  return {
    currentPage,
    totalPages,
    totalItems: total,
    itemsPerPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    nextPage: currentPage < totalPages ? currentPage + 1 : null,
    prevPage: currentPage > 1 ? currentPage - 1 : null,
  };
};

/**
 * Extract pagination params from request
 */
export const getPaginationParams = (req) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

export default {
  paginate,
  buildPaginationMeta,
  getPaginationParams,
};
