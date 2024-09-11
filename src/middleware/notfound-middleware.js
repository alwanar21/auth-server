export const notFoundMiddleware = async (req, res, next) => {
  res.status(404).json({
    message: "Resource not found.",
  });
};
