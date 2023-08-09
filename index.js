const express = require("express");
const fs = require("fs");
const app = express();
const port = 5000;

app.get("/", (req, res) => {
  res.send("Helloworld!");
});
app.get("/todos", (req, res) => {
  fs.readFile("./store/todolist.json", "utf-8", (err, data) => {
    if (err) {
      return res.status(5000).send("Something went worng with reading file");
    }
    const todos = JSON.parse(data);
    return res.json({ todos: todos });
  });
});
app.listen(port, () => {
  console.log(`Application is running on the port ${port}`);
});
