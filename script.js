let startTime, updatedTime, difference, timerInterval;
let running = false;
let laps = [];
let previousLapTime = 0;

const display = document.getElementById("display");
const lapList = document.getElementById("laps");
const beep = document.getElementById("beep");

function formatTime(ms) {
  const date = new Date(ms);
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  const milliseconds = String(Math.floor(date.getUTCMilliseconds() / 10)).padStart(2, '0');
  return `${minutes}:${seconds}:${milliseconds}`;
}

function updateDisplay() {
  updatedTime = new Date().getTime();
  difference = updatedTime - startTime;
  display.textContent = formatTime(difference);
}

function startStop() {
  beep.play();
  if (!running) {
    running = true;
    startTime = new Date().getTime() - (difference || 0);
    timerInterval = setInterval(updateDisplay, 10);
  } else {
    running = false;
    clearInterval(timerInterval);
  }
}

function reset() {
  beep.play();
  running = false;
  clearInterval(timerInterval);
  display.textContent = "00:00:00";
  difference = 0;
  previousLapTime = 0;
  lapList.innerHTML = "";
  laps = [];
}

function lap() {
  if (!running) return;
  beep.play();
  const currentTime = difference;
  const lapTime = currentTime - previousLapTime;
  previousLapTime = currentTime;

  const lapItem = document.createElement("li");
  lapItem.textContent = `Lap ${laps.length + 1}: ${formatTime(currentTime)} (+${formatTime(lapTime)})`;
  laps.push(lapItem);
  lapList.appendChild(lapItem);
}

function exportCSV() {
  let csv = "Lap,Time\n";
  laps.forEach((lap, i) => {
    csv += `${i + 1},${lap.textContent}\n`;
  });
  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "lap_times.csv";
  link.click();
}

function toggleTheme() {
  document.body.classList.toggle("dark-mode");
}
