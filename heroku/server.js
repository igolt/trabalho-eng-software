const path = require("path");
const express = require("express");
const app = express();

const port = process.env.PORT || 5555;

const index = path.resolve(__dirname, "index.html");

app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(index);
});

app.listen(port);
