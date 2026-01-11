const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello from private eks ");
});

app.listen(3000, () => console.log("App running on 3000"));
