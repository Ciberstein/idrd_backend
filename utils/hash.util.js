const crypto = require("crypto");

const hash = (strig) => {
  const hash = crypto.createHash("sha512");
  hash.update(strig);
  const hashed = hash.digest("hex");

  return hashed;
};

module.exports = hash;
