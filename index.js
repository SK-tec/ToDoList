const express = require("express");
const fs = require("fs");
const app = express();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
const port = 5000;

app.get("/", (req, res) => {
  res.send("Helloworld!");
});
app.get("/todos", (req, res) => {
  const incompleted = req.query.incomplete;
  console.log("incompletedTasks" + incompleted);
  const completedTasks = req.query.complete;
  console.log("completedTasks" + completedTasks);
  fs.readFile("./store/todolist.json", "utf-8", (err, data) => {
    if (err) {
      return res.status(5000).send("Something went worng with reading file");
    }
    const todos = JSON.parse(data);
    if (incompleted !== "1" && completedTasks !== "1") {
      return res.json({ todos: todos });
    } else if (incompleted === "1") {
      return res.json({
        todos: todos.filter((task) => task.complete === false),
      });
    } else {
      return res.json({
        todos: todos.filter((task) => task.complete === true),
      });
    }
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
app.put("/todos/:id/complete", (req, res) => {
  const id = parseInt(req.params.id);
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
      return res.status(500).send("Somthing went worng with file reading");
    }
    let todos = JSON.parse(data);
    const todoIndex = findTodoById(todos, id);
    if (todoIndex === -1) return res.status(404).send("Id not found");
    todos[todoIndex].complete = true;
    fs.writeFile("./store/todolist.json", JSON.stringify(todos), () => {
      return res.json({ status: 'ok"' });
    });
  });
});
app.post("/todos", (req, res) => {
  if (!req.body.name) {
    return res.status(400).send("Missing the name");
  }
  fs.readFile("./store/todolist.json", "utf-8", (err, data) => {
    if (err)
      return res.status(500).send("Something went wrong with File reading");

    const todos = JSON.parse(data);
    const maxId = Math.max.apply(
      Math,
      todos.map((task) => {
        return task.id;
      })
    );
    todos.push({
      id: maxId + 1,
      complete: false,
      name: req.body.name,
    });
    fs.writeFile("./store/todolist.json", JSON.stringify(todos), () => {
      return res.json({ status: "ok" });
    });
  });
  // const task = JSON.stringify(req.body);
  // console.log(req.body);
  // if (task === "{}") {
  //   return res.status(404).send({ message: "Content cannot be empty" });
  // }
  // res.send("hi");
});
app.listen(port, () => {
  console.log(`Application is running on the port ${port}`);
});
