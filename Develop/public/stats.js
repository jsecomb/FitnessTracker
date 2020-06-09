// get all workout data from back-end

fetch("/api/workouts/range")
  .then(response => {
    return response.json();
  })
  .then(data => {
    populateChart(data);
  });


API.getWorkoutsInRange()

  function generatePalette() {
    const arr = [
    "#003f5c",
    "#2f4b7c",
    "#665191",
    "#a05195",
    "#d45087",
    "#f95d6a",
    "#ff7c43",
    "ffa600",
    "#003f5c",
    "#2f4b7c",
    "#665191",
    "#a05195",
    "#d45087",
    "#f95d6a",
    "#ff7c43",
    "ffa600"
  ]

  return arr;
  }
function populateChart(data) {
  let durations = duration(data);
  let pounds = calculateTotalWeight(data);
  let workouts = workoutNames(data);
  const colors = generatePalette();

  let line = document.querySelector("#canvas").getContext("2d");
  let bar = document.querySelector("#canvas2").getContext("2d");
  let pie = document.querySelector("#canvas3").getContext("2d");
  let pie2 = document.querySelector("#canvas4").getContext("2d");
  
  //this adds up the duration for every workout within the range and renders total to page

  let sum1 = 0;
  data.map(workout => workout.exercises).forEach(day => day.forEach(activity => sum1+= activity.duration));
  
  document.getElementById("durationTotal").innerHTML = `Total Duration: ${sum1} minutes`;

  //this adds up the weight for every workout within the range and renders total to page

  let sum2 = 0;
  data.map(workout => workout.exercises).forEach(day => day.forEach(activity => {
    if(!activity.weight){ //ignores cardio activities (no weight)
      sum2+=0;
    }
    else{
      sum2+= activity.weight;
    }
  }));
  
  document.getElementById("weightTotal").innerHTML = `Total Poundage: ${sum2} pounds`;

  //get all dates workout dates for display on charts
  let dateArray = getDays(data).map(date => date.substring(0,10));

  let lineChart = new Chart(line, {
    type: "line",
    data: {
      labels: dateArray,
      datasets: [
        {
          label: "Workout Duration In Minutes",
          backgroundColor: "red",
          borderColor: "red",
          data: durations,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      title: {
        display: true
      },
      scales: {
        xAxes: [
          {
            display: true,
            scaleLabel: {
              display: true
            }
          }
        ],
        yAxes: [
          {
            display: true,
            scaleLabel: {
              display: true
            }
          }
        ]
      }
    }
  });

  let barChart = new Chart(bar, {
    type: "bar",
    data: {
      labels: dateArray,
      datasets: [
        {
          label: "Pounds",
          data: pounds,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)"
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)"
          ],
          borderWidth: 1
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: "Pounds Lifted"
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            }
          }
        ]
      }
    }
  });

  let pieChart = new Chart(pie, {
    type: "pie",
    data: {
      labels: workouts,
      datasets: [
        {
          label: "Excercises Performed",
          backgroundColor: colors,
          data: durationPerExercise(data)
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: "Excercises Performed"
      }
    }
  });

  let donutChart = new Chart(pie2, {
    type: "doughnut",
    data: {
      labels: workouts,
      datasets: [
        {
          label: "Excercises Performed",
          backgroundColor: colors,
          data: calculateWeightAll(data)
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: "Excercises Performed"
      }
    }
  });
}


function duration(data) {
  let durations = [];
  let allWorkouts = [];

  //function to remove duplicate days

  const arrayUnique = function (arr) {
    return arr.filter(function(item, index){
      return arr.indexOf(item) >= index;
    });
  };

  //insanely over-complicated code to extract and sum duration for each day

  data.forEach(workout => {
    let workoutSum = [];
    let daySum = 0;
    workoutSum.push(workout.day)
    workout.exercises.forEach(exercise => daySum += exercise.duration);
    workoutSum.push(daySum);
    allWorkouts.push(workoutSum);
  });

  let uniqueDays = arrayUnique(allWorkouts.map(workout => workout[0]));
  
  for(let j=0; j<uniqueDays.length; j++){
    let daySum = 0;
    (allWorkouts.filter(workout => workout[0] === uniqueDays[j])).forEach(wrk => daySum+=wrk[1]);
    durations.push(daySum);
  }

  return durations;
}

function calculateTotalWeight(data) {
  let weights = [];
  let allWorkouts = [];

  //function to remove duplicate days

  const arrayUnique = function (arr) {
    return arr.filter(function(item, index){
      return arr.indexOf(item) >= index;
    });
  };

  //insanely over-complicated code to extract and sum weight for each day

  data.forEach(workout => {
    let workoutSum = [];
    let daySum = 0;
    workoutSum.push(workout.day)
    workout.exercises.forEach(exercise => {
      if (exercise.weight) {
        daySum += exercise.weight
      }
    });
    workoutSum.push(daySum);
    allWorkouts.push(workoutSum);
  });

  let uniqueDays = arrayUnique(allWorkouts.map(workout => workout[0]));
  
  for(let j=0; j<uniqueDays.length; j++){
    let daySum = 0;
    (allWorkouts.filter(workout => workout[0] === uniqueDays[j])).forEach(wrk => {
      if(wrk[1]){
        daySum+=wrk[1]
      }
    });
    weights.push(daySum);
  }
  return weights;
}

function workoutNames(data) {
  let workouts = [];

  data.forEach(workout => {
    workout.exercises.forEach(exercise => {
      workouts.push(exercise.name);
    });
  });
  
  return workouts;
}

function getDays(data){

  let allWorkouts = [];
  
  const arrayUnique = function (arr) {
    return arr.filter(function(item, index){
      return arr.indexOf(item) >= index;
    });
  };

  data.forEach(workout => {
    let workoutSum = [];
    let daySum = 0;
    workoutSum.push(workout.day)
    workout.exercises.forEach(exercise => daySum += exercise.duration);
    workoutSum.push(daySum);
    allWorkouts.push(workoutSum);
  });

  let uniqueDays = arrayUnique(allWorkouts.map(workout => workout[0]));

  return uniqueDays;
}

function durationPerExercise(data) {
  let durationPerExercise = [];

  data.forEach(workout => {
    workout.exercises.forEach(exercise => {
      durationPerExercise.push(exercise.duration);
    });
  });

  return durationPerExercise;
}

function calculateWeightAll(data) {
  let total = [];

  data.forEach(workout => {
    workout.exercises.forEach(exercise => {
      total.push(exercise.weight);
    });
  });

  return total;
}


