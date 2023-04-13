const express = require("express");
const app = express();
const port = 3000;

app.get("/", async function (req, res) {
  res.type("json");
  await new Promise((resolve) => setTimeout(resolve, 50));
  const sqlite3 = require("sqlite3").verbose();
  let db = new sqlite3.Database("db.sqlite3", sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Connected to the  database.");
  });
  db.all(`SELECT * FROM courses`, [], (err, rows) => {
    res.status(200).json({ rows });
  });
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
