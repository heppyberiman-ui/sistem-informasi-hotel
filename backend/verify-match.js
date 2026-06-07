const bcrypt = require("bcrypt");

(async () => {
  const hash = "$2b$10$AaXAZw5yd2Pr2eQGZ5OekuKwP1JQXo.HG.m6WxGYthwDst2W91uZC";
  const match = await bcrypt.compare("user123", hash);
  console.log("MATCH=" + match);
})();
