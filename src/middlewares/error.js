const httpCodes = require('../schemas/httpCodes');

module.exports = (err, _req, res, _next) => {
  if (err.isJoi) {
    return res.status(httpCodes.BAD_REQUEST).json({ message: err.details[0].message });
  }
  
  return res.status(err.code).json({ message: err.message });
};