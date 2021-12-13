const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();

const { Schema } = mongoose;

const taskSchema = new Schema({
  name: String,
  text: String,
  isCheck: Boolean,
});

const Task = mongoose.model("tasks", taskSchema);

app.use(cors());

const url =
  "mongodb+srv://user:user@cluster0.fiygj.mongodb.net/TestEducationDB?retryWrites=true&w=majority";
mongoose.connect(url);

app.use(express.json());

app.get("/allTasks", (req, res) => {
  Task.find().then((result) => {
    res.send({ data: result });
  });
});

app.post("/createTask", (req, res) => {
  if (
    req.body.hasOwnProperty("name") &&
    req.body.hasOwnProperty("text") &&
    req.body.hasOwnProperty("isCheck")
  ) {
		const task = new Task(req.body);
    task.save().then(() => {
      Task.find().then((result) => {
        res.send({ data: result });
      });
    });
  } else {
		res.status(422).send("Error! Неверные параметры!");
  }
});

app.delete("/deleteTask", (req, res) => {
  const id = req.query._id;
  if (id) {
    Task.deleteOne({ _id: id }).then(() => {
      Task.find().then((result) => {
        res.send({ data: result });
      });
    });
  } else {
    res.status(422).send("Error! Неверные параметры!");
  }
});

app.patch("/updateTask", (req, res) => {
  const body = req.body;
  if (
    body.hasOwnProperty("_id") &&
    (body.hasOwnProperty("name") ||
      body.hasOwnProperty("text") ||
      body.hasOwnProperty("isCheck"))
  ) {
    Task.updateOne({ _id: body._id }, body).then(() => {
      Task.find().then((result) => {
        res.send({ data: result });
      });
    });
  } else {
    res.status(422).send("Error! Неверные параметры!");
  }
});

app.delete('/delAllTasks', (req, res) => {
	Task.deleteMany().then((result) => {
		res.send({ data: result });
	});
});

app.listen(8000, () => {
  console.log("listening on port 8000!");
});
