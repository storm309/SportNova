
const rateLimit = {};
const rateLimiter = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  return (req, res, next) => {
    const identifier = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    if (!rateLimit[identifier]) {
      rateLimit[identifier] = {
        count: 1,
        resetTime: now + windowMs
      };
      return next();
    }
    const userLimit = rateLimit[identifier];
    if (now > userLimit.resetTime) {
      userLimit.count = 1;
      userLimit.resetTime = now + windowMs;
      return next();
    }
    if (userLimit.count >= maxRequests) {
      const remainingTime = Math.ceil((userLimit.resetTime - now) / 1000);
      return res.status(429).json({
        success: false,
        message: "Too many requests. Please try again later.",
        retryAfter: remainingTime
      });
    }
    userLimit.count++;
    next();
  };
};
const authRateLimiter = rateLimiter(100, 15 * 60 * 1000); 
const apiRateLimiter = rateLimiter(100, 15 * 60 * 1000); 
module.exports = {
  authRateLimiter,
  apiRateLimiter,
  rateLimiter
};
