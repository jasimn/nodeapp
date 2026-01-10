const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello from private eks + Jenkins");
});

app.listen(3000, () => console.log("App running on 3000"));
