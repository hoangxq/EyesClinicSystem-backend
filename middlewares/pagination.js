const pagination = (req, res, next) => {
  const { page, size, sort, filter } = req.query;
  req.pagination = {
    limit: parseInt(size) || 100,
    offset: parseInt(page - 1) * size || 0,
    sort: parseInt(sort) || 0,
    filter:
      filter != null
        ? filter.map((f) => {
            return parseInt(f);
          })
        : 0,
  };
  next();
};
module.exports = pagination;
