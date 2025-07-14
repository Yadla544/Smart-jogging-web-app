// script.js
const canvas = document.getElementById("cityCanvas");
const ctx = canvas.getContext("2d");
const statusEl = document.getElementById("status");
const alertList = document.getElementById("alertList");

let userPos = null;
let cars = [];
let trafficSignals = [];

function drawMap() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#999";
  ctx.fillRect(100, 0, 50, 500); 
  ctx.fillRect(0, 200, 800, 50); 

  trafficSignals.forEach(sig => {
    ctx.fillStyle = sig.color;
    ctx.beginPath();
    ctx.arc(sig.x, sig.y, 8, 0, 2 * Math.PI);
    ctx.fill();
  });

  ctx.fillStyle = "blue";
  cars.forEach(car => {
    ctx.fillRect(car.x, car.y, 20, 10);
    car.x += car.speed;
    if (car.x > canvas.width) car.x = 0;
  });

  if (userPos) {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(userPos.x, userPos.y, 6, 0, 2 * Math.PI);
    ctx.fill();
  }

  requestAnimationFrame(drawMap);
}

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      statusEl.textContent = `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`;
      userPos = {
        x: 100 + (longitude % 0.01) * 80000,
        y: 200 + (latitude % 0.01) * 50000,
      };
    },
    () => {
      statusEl.textContent = "Location access denied.";
    },
    { enableHighAccuracy: true }
  );
}

function showIdleAlert(deadline) {
  if (deadline.timeRemaining() > 0 || deadline.didTimeout) {
    const li = document.createElement("li");
    li.textContent = "🚧 Heavy traffic near Main Street";
    alertList.appendChild(li);
  }
}
requestIdleCallback(showIdleAlert, { timeout: 8000 });

function initTraffic() {
  cars = Array.from({ length: 5 }, () => ({
    x: Math.random() * canvas.width,
    y: 205 + Math.random() * 30,
    speed: 1 + Math.random(),
  }));

  trafficSignals = [
    { x: 125, y: 200, color: "green" },
    { x: 125, y: 250, color: "red" },
    { x: 400, y: 225, color: "orange" },
  ];
}

initTraffic();
drawMap();
