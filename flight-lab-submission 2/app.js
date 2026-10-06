// ==========================================
// CESIUM FLIGHT LAB
// Reading, Pennsylvania Internship Flight
// ==========================================

Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImoxNDJicUlhYlB5Mjd2bDQiLCJqdGkiOiI1OWU3MjBhNC00M2U3LTRiN2QtODcxOC1hYWNkN2JjZjU4ZDAiLCJpZCI6NTA1NzM0LCJpc3MiOiJodHRwczovL2FwaS5jZXNpdW0uY29tIiwiYXVkIjoidW5kZWZpbmVkX2RlZmF1bHQiLCJpYXQiOjE3OTAxNjk0NTV9.7i8qqGsNYbbkX7JFYb7MSzGlMmybpYPmv5_GRIZlyc8";

// ------------------------------------------
// FLIGHT STOPS
// ------------------------------------------

const flightStops = [
  {
    name: "Penske Truck Leasing",
    city: "Reading, PA",
    internship: "2027 Corporate Internship — Information Systems",
    description:
      "Penske Truck Leasing offers corporate internship opportunities in Information Systems and technology. This stop represents Penske's Reading-area corporate location and connects the flight to opportunities involving information systems, business technology, and computer science.",
    longitude: -75.8730,
    latitude: 40.3027
  },

  {
    name: "Hubbell",
    city: "Reading, PA",
    internship: "2027 Engineering / Technology Internship",
    description:
      "Hubbell offers 2027 internship opportunities in engineering and technology-related areas. Students can apply technical, analytical, and problem-solving skills in a professional environment. This stop represents Hubbell's Reading facility.",
    longitude: -75.9387,
    latitude: 40.3787
  },

  {
    name: "Fidelity Technologies",
    city: "Reading, PA",
    internship: "Technology, Engineering & Simulation",
    description:
      "Fidelity Technologies is a Reading-based defense and aerospace technology company. Its work includes simulation and training systems, software, engineering, manufacturing, and other technical systems. This makes it a strong Computer Science-related stop because the company develops technology-driven simulation and training solutions.",
    longitude: -75.9248,
    latitude: 40.3822
  },

  {
    name: "EnerSys Global Technology Center",
    city: "Reading, PA",
    internship: "Engineering, Information Technology & Technology",
    description:
      "EnerSys operates its Global Technology Center in Reading. The facility supports engineering, product development, testing, energy-storage technology, electronics, software, and related technical work. This stop represents a local technology-focused employer with strong connections to engineering and computer science.",
    longitude: -75.9456,
    latitude: 40.3825
  },

  {
    name: "Materion",
    city: "Leesport, PA",
    internship: "2027 Summer Internship Program",
    description:
      "Materion's 2027 Summer Internship Program includes opportunities connected to Information Technology, Computer Science, and Data Science. Students can apply programming, data, technology, and problem-solving skills in a professional environment. This stop represents Materion's Leesport-area facility.",
    longitude: -75.9685,
    latitude: 40.4498
  },

  {
    name: "East Penn Manufacturing",
    city: "Lyon Station, PA",
    internship: "IT Cybersecurity Internship — Summer 2027",
    description:
      "East Penn Manufacturing offers IT and cybersecurity opportunities involving areas such as networking, operating systems, information technology, and cybersecurity. This stop represents East Penn Manufacturing's Lyon Station headquarters and manufacturing campus.",
    longitude: -76.0037,
    latitude: 40.5247
  }
];

// ------------------------------------------
// CESIUM VIEWER
// ------------------------------------------

const viewer = new Cesium.Viewer("globe", {
  terrain: Cesium.Terrain.fromWorldTerrain(),

  animation: false,
  timeline: false,

  baseLayerPicker: false,
  geocoder: false,

  homeButton: true,
  sceneModePicker: true,
  navigationHelpButton: false,

  selectionIndicator: true,
  infoBox: true
});

// ------------------------------------------
// WORLD IMAGERY
// ------------------------------------------

try {
  const imageryProvider = await Cesium.createWorldImageryAsync();
  viewer.imageryLayers.addImageryProvider(imageryProvider);
} catch (error) {
  console.error("Could not load Cesium World Imagery:", error);
}

// ------------------------------------------
// 3D BUILDINGS
// ------------------------------------------

try {
  const buildings = await Cesium.createOsmBuildingsAsync();
  viewer.scene.primitives.add(buildings);
} catch (error) {
  console.error("Could not load 3D buildings:", error);
}

// ------------------------------------------
// TERRAIN / LIGHTING
// ------------------------------------------

viewer.scene.globe.depthTestAgainstTerrain = true;
viewer.scene.globe.enableLighting = true;
viewer.scene.skyAtmosphere.show = true;

// ------------------------------------------
// FLIGHT SETTINGS
// ------------------------------------------

// Height of the aircraft above the terrain
const FLIGHT_HEIGHT = 1200;

// Aircraft speed in meters per second.
//
// This is intentionally slow so the yellow aircraft
// can clearly be seen traveling between stops.
const FLIGHT_SPEED = 90;

// How long the aircraft pauses at each company
const STOP_TIME = 4000;

// Camera distance when arriving at a company
const ARRIVAL_CAMERA_DISTANCE = 3500;

// Camera distance while following the flight
const FOLLOW_CAMERA_DISTANCE = 9000;

// ------------------------------------------
// STATE
// ------------------------------------------

let currentStopIndex = 0;
let flying = false;
let lastFrameTime = null;
let stopPauseUntil = 0;
let cameraFollowing = false;

// ------------------------------------------
// AIRCRAFT POSITION
// ------------------------------------------

let aircraftLongitude = flightStops[0].longitude;
let aircraftLatitude = flightStops[0].latitude;

// ------------------------------------------
// CREATE COMPANY MARKERS
// ------------------------------------------

const companyEntities = [];

flightStops.forEach((stop) => {
  const entity = viewer.entities.add({
    name: stop.name,

    position: Cesium.Cartesian3.fromDegrees(
      stop.longitude,
      stop.latitude,
      100
    ),

    point: {
      pixelSize: 13,
      color: Cesium.Color.ORANGE,
      outlineColor: Cesium.Color.WHITE,
      outlineWidth: 2,

      disableDepthTestDistance: Number.POSITIVE_INFINITY
    },

    label: {
      text: stop.name,

      font: "16px sans-serif",

      fillColor: Cesium.Color.WHITE,

      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 4,

      style: Cesium.LabelStyle.FILL_AND_OUTLINE,

      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,

      pixelOffset: new Cesium.Cartesian2(0, -15),

      disableDepthTestDistance: Number.POSITIVE_INFINITY
    },

    description: `
      <h2>${stop.name}</h2>

      <p>
        <strong>Location:</strong> ${stop.city}
      </p>

      <p>
        <strong>Opportunity:</strong> ${stop.internship}
      </p>

      <p>
        ${stop.description}
      </p>
    `
  });

  companyEntities.push(entity);
});

// ------------------------------------------
// CREATE YELLOW AIRCRAFT
// ------------------------------------------

const aircraft = viewer.entities.add({
  name: "Aircraft",

  position: new Cesium.CallbackPositionProperty(
    () => {
      return Cesium.Cartesian3.fromDegrees(
        aircraftLongitude,
        aircraftLatitude,
        FLIGHT_HEIGHT
      );
    },
    false
  ),

  point: {
    pixelSize: 18,

    color: Cesium.Color.YELLOW,

    outlineColor: Cesium.Color.BLACK,
    outlineWidth: 3,

    disableDepthTestDistance: Number.POSITIVE_INFINITY
  },

  label: {
    text: "Aircraft",

    font: "15px sans-serif",

    fillColor: Cesium.Color.YELLOW,

    outlineColor: Cesium.Color.BLACK,
    outlineWidth: 4,

    style: Cesium.LabelStyle.FILL_AND_OUTLINE,

    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,

    pixelOffset: new Cesium.Cartesian2(0, -22),

    disableDepthTestDistance: Number.POSITIVE_INFINITY
  }
});

// ------------------------------------------
// HELPER: AIRCRAFT CARTESIAN POSITION
// ------------------------------------------

function getAircraftPosition() {
  return Cesium.Cartesian3.fromDegrees(
    aircraftLongitude,
    aircraftLatitude,
    FLIGHT_HEIGHT
  );
}

// ------------------------------------------
// DISTANCE BETWEEN TWO LOCATIONS
// ------------------------------------------

function distanceBetween(
  longitude1,
  latitude1,
  longitude2,
  latitude2
) {
  const lon1 = Cesium.Math.toRadians(longitude1);
  const lat1 = Cesium.Math.toRadians(latitude1);

  const lon2 = Cesium.Math.toRadians(longitude2);
  const lat2 = Cesium.Math.toRadians(latitude2);

  const x =
    (lon2 - lon1) *
    Math.cos((lat1 + lat2) / 2);

  const y = lat2 - lat1;

  const earthRadius = 6371000;

  return (
    Math.sqrt(x * x + y * y) *
    earthRadius
  );
}

// ------------------------------------------
// MOVE AIRCRAFT
// ------------------------------------------

function moveAircraft(deltaSeconds) {

  if (!flying) {
    return;
  }

  // If the aircraft is currently paused at a company,
  // wait until the pause has finished.
  if (Date.now() < stopPauseUntil) {
    return;
  }

  const destination = flightStops[currentStopIndex];

  const distance = distanceBetween(
    aircraftLongitude,
    aircraftLatitude,
    destination.longitude,
    destination.latitude
  );

  // ----------------------------------------
  // ARRIVAL
  // ----------------------------------------

  if (distance <= 5) {

    // IMPORTANT:
    // Put the aircraft EXACTLY on the destination.
    // This prevents it from skipping past the marker.
    aircraftLongitude = destination.longitude;
    aircraftLatitude = destination.latitude;

    arriveAtStop();

    return;
  }

  // ----------------------------------------
  // CALCULATE DIRECTION
  // ----------------------------------------

  const longitudeDifference =
    destination.longitude - aircraftLongitude;

  const latitudeDifference =
    destination.latitude - aircraftLatitude;

  const directionLength = Math.sqrt(
    longitudeDifference * longitudeDifference +
    latitudeDifference * latitudeDifference
  );

  if (directionLength === 0) {
    return;
  }

  const directionLongitude =
    longitudeDifference / directionLength;

  const directionLatitude =
    latitudeDifference / directionLength;

  // ----------------------------------------
  // TIME-BASED MOVEMENT
  // ----------------------------------------

  // Instead of moving a fixed amount every frame,
  // calculate movement using elapsed time.
  //
  // This means the aircraft speed stays consistent
  // even if the browser goes from 60 FPS to 30 FPS.
  const metersThisFrame =
    FLIGHT_SPEED * deltaSeconds;

  // Convert meters into approximate latitude/longitude
  // movement.
  const degreesPerMeter = 1 / 111320;

  let movementDegrees =
    metersThisFrame * degreesPerMeter;

  // ----------------------------------------
  // NEVER OVERSHOOT
  // ----------------------------------------

  const remainingDegrees =
    directionLength;

  if (movementDegrees >= remainingDegrees) {
    movementDegrees = remainingDegrees;
  }

  aircraftLongitude +=
    directionLongitude * movementDegrees;

  aircraftLatitude +=
    directionLatitude * movementDegrees;
}

// ------------------------------------------
// ARRIVE AT COMPANY
// ------------------------------------------

function arriveAtStop() {

  const stop = flightStops[currentStopIndex];

  flying = false;

  stopPauseUntil =
    Date.now() + STOP_TIME;

  document.getElementById("message").textContent =
    `Arrived at ${stop.name}.`;

  document.getElementById("readout").innerHTML = `
    <strong>${stop.name}</strong><br>
    ${stop.city}<br>
    ${stop.internship}
  `;

  // ----------------------------------------
  // CLOSE CAMERA VIEW
  // ----------------------------------------

  cameraFollowing = false;

  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(
      stop.longitude,
      stop.latitude,
      3500
    ),

    orientation: {
      heading: 0,

      pitch: Cesium.Math.toRadians(-35),

      roll: 0
    },

    duration: 1.5
  });

  // ----------------------------------------
  // SELECT COMPANY
  // ----------------------------------------

  viewer.selectedEntity =
    companyEntities[currentStopIndex];

  // ----------------------------------------
  // AUTOMATICALLY CONTINUE
  // ----------------------------------------

  setTimeout(() => {

    // Make sure we're still at the same stop.
    if (
      currentStopIndex <
      flightStops.length - 1
    ) {

      currentStopIndex++;

      flying = true;

      lastFrameTime = null;

      cameraFollowing = true;

      document.getElementById("message").textContent =
        `Flying to ${flightStops[currentStopIndex].name}...`;

      viewer.selectedEntity = undefined;
    }

  }, STOP_TIME);
}

// ------------------------------------------
// START FLIGHT
// ------------------------------------------

function startFlight() {

  if (
    currentStopIndex >=
    flightStops.length
  ) {
    return;
  }

  flying = true;

  lastFrameTime = null;

  cameraFollowing = true;

  document.getElementById("message").textContent =
    `Flying to ${flightStops[currentStopIndex].name}...`;

  viewer.selectedEntity = undefined;
}

// ------------------------------------------
// PAUSE FLIGHT
// ------------------------------------------

function pauseFlight() {

  flying = false;

  cameraFollowing = false;

  document.getElementById("message").textContent =
    "Flight paused.";
}

// ------------------------------------------
// RESET FLIGHT
// ------------------------------------------

function resetFlight() {

  flying = false;

  currentStopIndex = 0;

  stopPauseUntil = 0;

  cameraFollowing = false;

  aircraftLongitude =
    flightStops[0].longitude;

  aircraftLatitude =
    flightStops[0].latitude;

  document.getElementById("message").textContent =
    `Ready at ${flightStops[0].name}.`;

  document.getElementById("readout").textContent =
    `${flightStops[0].city} • ${flightStops[0].internship}`;

  viewer.selectedEntity = undefined;

  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(
      flightStops[0].longitude,
      flightStops[0].latitude,
      5000
    ),

    orientation: {
      heading: 0,

      pitch: Cesium.Math.toRadians(-35),

      roll: 0
    },

    duration: 1.5
  });
}

// ------------------------------------------
// CAMERA FOLLOW
// ------------------------------------------

function updateCamera() {

  // IMPORTANT:
  // We only update the camera while the flight is
  // actively following the aircraft.
  //
  // This means when the aircraft reaches a company,
  // you can manually zoom and explore the buildings.

  if (!cameraFollowing || !flying) {
    return;
  }

  const aircraftPosition =
    getAircraftPosition();

  viewer.camera.lookAt(
    aircraftPosition,

    new Cesium.HeadingPitchRange(
      0,

      Cesium.Math.toRadians(-35),

      FOLLOW_CAMERA_DISTANCE
    )
  );
}

// ------------------------------------------
// CESIUM FRAME LOOP
// ------------------------------------------

viewer.clock.onTick.addEventListener(() => {

  const now = performance.now();

  // First frame
  if (lastFrameTime === null) {
    lastFrameTime = now;
    return;
  }

  // Time since previous frame
  let deltaSeconds =
    (now - lastFrameTime) / 1000;

  lastFrameTime = now;

  // Prevent giant jumps if the browser tab
  // was inactive for a while.
  deltaSeconds =
    Math.min(deltaSeconds, 0.1);

  moveAircraft(deltaSeconds);

  updateCamera();
});

// ------------------------------------------
// BUTTONS
// ------------------------------------------

document
  .getElementById("fly")
  .addEventListener(
    "click",
    startFlight
  );

document
  .getElementById("pause")
  .addEventListener(
    "click",
    pauseFlight
  );

document
  .getElementById("reset")
  .addEventListener(
    "click",
    resetFlight
  );

// ------------------------------------------
// INITIAL CAMERA
// ------------------------------------------

resetFlight();
