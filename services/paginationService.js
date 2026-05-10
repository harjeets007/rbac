const paginate = async (
  Model,
  filter = {},
  options = {},
  useAggregation = false,
) => {
  const page = Math.max(parseInt(options.page) || 1, 1);
  const limit = Math.max(parseInt(options.limit) || 10, 1);
  const skip = (page - 1) * limit;

  if (!useAggregation) {
    const total = await Model.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    const data = await Model.find(filter).skip(skip).limit(limit).lean();

    return {
      pagination: {
        totalItems: total,
        totalPages,
        currentPage: page,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      list: data,
    };
  }

  const pipeline = options.pipeline || [];

  const [result] = await Model.aggregate([
    ...pipeline,
    {
      $facet: {
        metadata: [{ $count: "total" }],
        data: [{ $skip: skip }, { $limit: limit }],
      },
    },
  ]);

  const total = result.metadata[0]?.total ?? 0;
  const totalPages = total > 0 ? Math.ceil(total / limit) : 0;

  return {
    pagination: {
      totalItems: total,
      totalPages,
      currentPage: page,
      limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
    list: result.data,
  };
};

module.exports = paginate;
