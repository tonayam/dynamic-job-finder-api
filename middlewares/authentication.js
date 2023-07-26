const CustomError = require(`../errors`);
const { isTokenValid } = require(`../utils/jwt`);

const authenticateUser = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith(`Bearer `)) {
    throw new CustomError.UnauthenticatedError(`Authentication Invalid`);
  }

  token = authHeader.split(` `)[1];
  if (!token) {
    throw new CustomError.UnauthenticatedError(`Authentication Invalid`);
  }

  try {
    const payload = isTokenValid({ token });
    req.user = { userId: payload.userId, role: payload.role };
    next();
  } catch (error) {
    throw new CustomError.UnauthenticatedError(`Authentication Invalid`);
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError(
        `Unauthorized to access this route`
      );
    }
    next();
  };
};

module.exports = { authenticateUser, authorizeRoles };
