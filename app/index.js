import clock from "clock";
import document from "document";
import { display } from "display";
import { HeartRateSensor } from "heart-rate";

import { goals } from "user-activity";
import { today } from "user-activity";

import * as util from "../common/utils";

// Get a handle on the <text> element
let _root = document.getElementById("root");
let _clockDigits1 = document.getElementById("clockDigits1");
let _clockDigits2 = document.getElementById("clockDigits2");
let _date = document.getElementById("date");
let _heartRate = document.getElementById("heartRate");

let _mainDisplay = document.getElementById("mainDisplay");
let _secondDisplay = document.getElementById("secondDisplay");

let _activityIndex = 0;

// Update the clock every minute
clock.granularity = "minutes";

// Create a new instance of the HeartRateSensor object
var _hrm = new HeartRateSensor();

_hrm.onreading = function() {
  // Peek the current sensor values
  _heartRate.text = _hrm.heartRate;
}

const _days = {
  0: 'SUN',
  1: 'MON',
  2: 'TUE',
  3: 'WED',
  4: 'THU',
  5: 'FRI',
  6: 'SAT'
};

const _months = {
  0: 'JAN',
  1: 'FEB',
  2: 'MAR',
  3: 'APR',
  4: 'MAY',
  5: 'JUN',
  6: 'JUL',
  7: 'AUG',
  8: 'SEP',
  9: 'OCT',
  10: 'NOV',
  11: 'DEC'
}

function updateDate() {
  let today = new Date();
  _date.text = `${_days[today.getDay()]} ${today.getDate()} ${_months[today.getMonth()]}`;
}

// Update the <text> element with the current time
function updateClock() {
  let today = new Date();
  let hours = today.getHours();
  let mins = util.zeroPad(today.getMinutes());

  //_clockFace.text = `${hours}:${mins}`;
  _clockDigits1.text = `${hours}`;
  _clockDigits2.text = `${mins}`;
}

function updateHeartRateSensor() {
  // Begin monitoring the sensor
  _hrm.start();
}

function stopHearRateSensor() {
  // Stop monitoring the sensor
  _hrm.stop();
}

// Update the clock every tick event
clock.ontick = () => updateClock();

display.addEventListener('change', function() {
  if (this.on) {
    updateDate();
    updateHeartRateSensor();
    
  } else {
    stopHearRateSensor();
  }
});

_root.onclick = (e) => {
  showNextActivity();
}

function updateArcMeter(name) {
  let distance = document.getElementById(name);
  let distanceArc = document.getElementById(name + 'Arc');
  
  let todaySteps = (today.local[name] || 0);  
  let percentSteps = todaySteps * 360 / (goals[name] || 1);
  
  distanceArc.sweepAngle = percentSteps;
  distance.text = todaySteps;
}

function showNextActivity() {
  _activityIndex = (_activityIndex + 1) % 6;
  
  switch (_activityIndex) {
    case 0:
      showHeartrate();
      break;
    case 1:
      showSteps();
      break;
    case 2:
      showElevationGain();
      break;
    case 3:
      showDistance();
      break;
    case 4:
      showActiveMinutes();
      break;
    case 5:
      showCalories();
    default:
      break;
  }
}

function showHeartrate() {
  hideAndShow('caloriesContainer', 'heartRateContainer');
}

function showSteps() {
  hideAndShow('heartRateContainer', 'stepsContainer');
  updateArcMeter('steps');
}

function showElevationGain() {
  hideAndShow('stepsContainer', 'elevationGainContainer');  
  updateArcMeter('elevationGain');
}

function showDistance() {
  hideAndShow('elevationGainContainer', 'distanceContainer');  
  updateArcMeter('distance');
}

function showActiveMinutes() {
  hideAndShow('distanceContainer', 'activeMinutesContainer');
  updateArcMeter('activeMinutes');
}

function showCalories() {
  hideAndShow('activeMinutesContainer', 'caloriesContainer');
  updateArcMeter('calories');
}

function hideAndShow(elementToHide, elementToShow) {
  let elementToHide = document.getElementById(elementToHide);
  let elementToShow = document.getElementById(elementToShow);
  
  elementToHide.style.visibility = 'hidden';
  elementToShow.style.visibility = 'visible';
}

updateDate();
updateHeartRateSensor();