const { createSession } = require("./src/main");
const fs = require("fs/promises");

(async () => {
  const raw = JSON.parse(await fs.readFile("cookies.json", "utf-8"));
  const cookies = Object.fromEntries(raw.map((cookie) => [cookie.name, cookie.value]));
  const session = await createSession(cookies);
  const transactionId = await session.get("POST", "/1.1/statuses/update.json");
  console.log(transactionId);
})();
