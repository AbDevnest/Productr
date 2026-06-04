const path = require("path");

const createUniqueFileName = (originalName) => {
  const ext = path.extname(originalName);
  return Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
};

module.exports = { createUniqueFileName };