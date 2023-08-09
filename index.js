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
app.get("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  console.log(id);
  const findTodoById = (todos, id) => {
    for (let index = 0; index < todos.length; index++) {
      if (todos[index].id === id) {
        return index;
      }
    }
    return -1;
  };
  fs.readFile("./store/todolist.json", "utf-8", (err, data) => {
    if (err) {
      res.status(500).send("Some thing went wrong in Reading file");
    }
    let todos = JSON.parse(data);
    const todoIndex = findTodoById(todos, id);
    if (todoIndex === -1) {
      return res.status(404).send("Item with the given Id not found");
    }
    return res.json(todos[todoIndex]);
  });
});
app.listen(port, () => {
  console.log(`Application is running on the port ${port}`);
});
