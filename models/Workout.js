const mongoose = require("mongoose");
const moment = require("moment");

const Schema = mongoose.Schema;

const workoutSchema = new Schema({
  day: {
    type: Date,
    default: moment().add(7,'h').format('MM/DD/YYYY')
  },
  exercises: [
    {
      type: {
        type: String,
      },
      name: {
        type: String,
      },
      duration: {
        type: Number
      },
      weight: {
        type: Number
      },
      reps: {
        type: Number
      },
      sets: {
        type: Number
      },
      distance: {
        type: Number
      }      
    }
  ]
});

const Workout = mongoose.model("Workout", workoutSchema);

module.exports = Workout;