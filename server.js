const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const path = require("path");
const moment = require("moment");

const PORT = process.env.PORT || 4000;

const db = require("./models");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/populatedb", { useNewUrlParser: true, useCreateIndex: true });

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"))
})

app.get("/exercise", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/exercise.html"))
})

app.get("/stats", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/stats.html"))
})

app.get("/api/workouts", (req, res) => {
  db.Workout.find({})
  .then((dbWorkout => {
    res.json(dbWorkout)
  }))
  .catch((err) => {
    res.json(err);
  });
});

app.post("/api/workouts", ({ body }, res) => {
  db.Workout.create(body)
  .then((dbWorkout) => {
    res.json(dbWorkout);
  })
  .catch((err) => {
    res.json(err);
  });
});

app.put("/api/workouts/:id", (req, res) => {
  db.Workout.update(
    {_id: req.params.id},
    {$push: {exercises: req.body}}
    )
    .then((dbWorkout) => {
      res.json(dbWorkout);
    })
    .catch((err) => {
      res.json(err);
    });
});

app.get("/api/workouts/range", (req, res) => {
  db.Workout.find({day: {$gte: moment().subtract(7,'d').format('YYYY-MM-DD')}})
    .then((dbWorkout) => {
      
      res.json(dbWorkout);
    })
    .catch((err) => {
      res.json(err);
    });
});

app.delete("/api/workouts", (req, res) => {
  db.Workout.deleteMany({})
  .then((dbWorkout => {
    res.json(dbWorkout)
  }))
  .catch((err) => {
    res.json(err);
  });
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});