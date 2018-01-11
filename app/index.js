import clock from "clock";
import document from "document";
import { display } from "display";
import { HeartRateSensor } from "heart-rate";

import * as util from "../common/utils";

// Get a handle on the <text> element
let _clockFace = document.getElementById("clockFace");
let _date = document.getElementById("date");
let _heartRate = document.getElementById("heartrate");

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
  5: 'FRI'
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

  _clockFace.text = `${hours}:${mins}`;
}

function updateHeartRateSensor() {
  // Begin monitoring the sensor
  _hrm.start();
  console.log("starting heart")
}

function stopHearRateSensor() {
  // Stop monitoring the sensor
  _hrm.stop();
  console.log("stoping heart")
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

updateDate();