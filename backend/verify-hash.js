const bcrypt = require("bcrypt");

(async () => {
  const plain = "user123";
  const hash = await bcrypt.hash(plain, 10);
  console.log("HASH=" + hash);
  const match = await bcrypt.compare(plain, hash);
  console.log("MATCH=" + match);
})();
