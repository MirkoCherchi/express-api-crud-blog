const express = require("express");
const app = express();
const port = 3000;
const postRouter = require("./routers/posts");
const posts = require("./db/db.json");

app.use(express.static("public"));
app.use(express.json());

app.get("/", (req, res) => {
  res.send(`<h1>Benvenuto nel mio Blog!</h1>`);
});

app.use("/posts", postRouter);

app.listen(port, () => {
  console.log(`Server http://localhost:${port}`);
});
