
(async function () {

  // ==========================================
  // CESIUM FLIGHT LAB
  // Reading, Pennsylvania Internship Flight
  // ==========================================

  Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IlJrYXozVzlic2x6eU5NSlYiLCJqdGkiOiJhNzcwMDAyZC1lYWI4LTQ3NTctOWI1OS1mMDhhMGViNWU4MjciLCJpZCI6NTA1NzM0LCJzdWIiOiJtaW1pMyIsImlzcyI6Imh0dHBzOi8vYXBpLmNlc2l1bS5jb20iLCJhdWQiOiJtaW1pM19kZWZhdWx0IiwiaWF0IjoxNzkxMjUwNTQ2fQ.lvsj1owqres_vF8j2dk2Hgakt_ju4fLcYudR7PfGU6w";

  // ==========================================
  // FLIGHT STOPS
  // ==========================================

  const flightStops = [
    {
      name: "Penske Truck Leasing",
      city: "Reading, PA",
      internship: "2027 Corporate Internship — Information Systems",
      description:
        "Penske Truck Leasing offers corporate internship opportunities in Information Systems and technology. This stop represents Penske's Reading-area corporate location and connects the flight to information systems, business technology, and computer science.",
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
        "Fidelity Technologies is a Reading-based technology and engineering company working with simulation, training systems, software, engineering, and technical solutions.",
      longitude: -75.9248,
      latitude: 40.3822
    },

    {
      name: "EnerSys Global Technology Center",
      city: "Reading, PA",
      internship: "Engineering, Information Technology & Technology",
      description:
        "EnerSys operates its Global Technology Center in Reading. The facility supports engineering, product development, testing, energy-storage technology, electronics, software, and related technical work.",
      longitude: -75.9456,
      latitude: 40.3825
    },

    {
      name: "Materion",
      city: "Leesport, PA",
      internship: "2027 Summer Internship Program",
      description:
        "Materion's 2027 Summer Internship Program includes opportunities connected to Information Technology, Computer Science, and Data Science.",
      longitude: -75.9685,
      latitude: 40.4498
    },

    {
      name: "East Penn Manufacturing",
      city: "Lyon Station, PA",
      internship: "IT Cybersecurity Internship — Summer 2027",
      description:
        "East Penn Manufacturing offers IT and cybersecurity opportunities involving networking, operating systems, information technology, and cybersecurity.",
      longitude: -76.0037,
      latitude: 40.5247
    }
  ];

  // ==========================================
  // VIEWER
  // ==========================================

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

  // ==========================================
  // WORLD IMAGERY
  // ==========================================

  try {
    const imageryProvider =
      await Cesium.createWorldImageryAsync();

    viewer.imageryLayers.addImageryProvider(
      imageryProvider
    );

  } catch (error) {
    console.error(
      "Could not load Cesium World Imagery:",
      error
    );
  }

  // ==========================================
  // 3D BUILDINGS
  // ==========================================

  try {
    const buildings =
      await Cesium.createOsmBuildingsAsync();

    viewer.scene.primitives.add(buildings);

  } catch (error) {
    console.error(
      "Could not load 3D buildings:",
      error
    );
  }

  // ==========================================
  // TERRAIN / LIGHTING
  // ==========================================

  viewer.scene.globe.depthTestAgainstTerrain = true;
  viewer.scene.globe.enableLighting = true;
  viewer.scene.skyAtmosphere.show = true;

  // ==========================================
  // FLIGHT SETTINGS
  // ==========================================

let flightSpeed = 70;
let flightHeight = 1200;

let heading = 0;
let headingOffset = 0;

const STOP_TIME = 4000;
const FOLLOW_CAMERA_DISTANCE = 9000;
  // ==========================================
  // FLIGHT STATE
  // ==========================================

  let currentStopIndex = 0;

  let flying = false;

  let lastFrameTime = null;

  let stopPauseUntil = 0;

  let cameraFollowing = false;

  // ==========================================
  // AIRCRAFT POSITION
  // ==========================================

  let aircraftLongitude =
    flightStops[0].longitude;

  let aircraftLatitude =
    flightStops[0].latitude;

  // ==========================================
  // COMPANY MARKERS
  // ==========================================

  const companyEntities = [];

  flightStops.forEach((stop) => {

    const entity = viewer.entities.add({

      name: stop.name,

      position:
        Cesium.Cartesian3.fromDegrees(
          stop.longitude,
          stop.latitude,
          100
        ),

      point: {
        pixelSize: 13,

        color: Cesium.Color.ORANGE,

        outlineColor: Cesium.Color.WHITE,

        outlineWidth: 2,

        disableDepthTestDistance:
          Number.POSITIVE_INFINITY
      },

      label: {

        text: stop.name,

        font: "16px sans-serif",

        fillColor: Cesium.Color.WHITE,

        outlineColor: Cesium.Color.BLACK,

        outlineWidth: 4,

        style:
          Cesium.LabelStyle.FILL_AND_OUTLINE,

        verticalOrigin:
          Cesium.VerticalOrigin.BOTTOM,

        pixelOffset:
          new Cesium.Cartesian2(0, -15),

        disableDepthTestDistance:
          Number.POSITIVE_INFINITY
      },

      description: `
        <h2>${stop.name}</h2>

        <p>
          <strong>Location:</strong>
          ${stop.city}
        </p>

        <p>
          <strong>Opportunity:</strong>
          ${stop.internship}
        </p>

        <p>
          ${stop.description}
        </p>
      `
    });

    companyEntities.push(entity);
  });

  // ==========================================
  // AIRCRAFT
  // ==========================================

  const aircraft = viewer.entities.add({

    name: "Aircraft",

    position:
      new Cesium.CallbackPositionProperty(
        () => {

          return Cesium.Cartesian3.fromDegrees(
            aircraftLongitude,
            aircraftLatitude,
            flightHeight
          );

        },
        false
      ),

    point: {

      pixelSize: 18,

      color: Cesium.Color.YELLOW,

      outlineColor: Cesium.Color.BLACK,

      outlineWidth: 3,

      disableDepthTestDistance:
        Number.POSITIVE_INFINITY
    },

    label: {

      text: "Aircraft",

      font: "15px sans-serif",

      fillColor: Cesium.Color.YELLOW,

      outlineColor: Cesium.Color.BLACK,

      outlineWidth: 4,

      style:
        Cesium.LabelStyle.FILL_AND_OUTLINE,

      verticalOrigin:
        Cesium.VerticalOrigin.BOTTOM,

      pixelOffset:
        new Cesium.Cartesian2(0, -22),

      disableDepthTestDistance:
        Number.POSITIVE_INFINITY
    }
  });

  // ==========================================
  // AIRCRAFT POSITION
  // ==========================================

  function getAircraftPosition() {

    return Cesium.Cartesian3.fromDegrees(

      aircraftLongitude,

      aircraftLatitude,

      flightHeight

    );

  }

  // ==========================================
  // DISTANCE
  // ==========================================

  function distanceBetween(
    longitude1,
    latitude1,
    longitude2,
    latitude2
  ) {

    const lon1 =
      Cesium.Math.toRadians(longitude1);

    const lat1 =
      Cesium.Math.toRadians(latitude1);

    const lon2 =
      Cesium.Math.toRadians(longitude2);

    const lat2 =
      Cesium.Math.toRadians(latitude2);

    const x =
      (lon2 - lon1) *
      Math.cos(
        (lat1 + lat2) / 2
      );

    const y =
      lat2 - lat1;

    const earthRadius = 6371000;

    return (
      Math.sqrt(
        x * x +
        y * y
      ) *
      earthRadius
    );

  }

  // ==========================================
  // UPDATE TELEMETRY
  // ==========================================

  function updateTelemetry() {

    const latitude =
      document.getElementById(
        "latitudeReadout"
      );

    const longitude =
      document.getElementById(
        "longitudeReadout"
      );

    const altitude =
      document.getElementById(
        "altitudeReadout"
      );

    const headingDisplay =
      document.getElementById(
        "headingReadout"
      );

    if (latitude) {

      latitude.textContent =
        aircraftLatitude.toFixed(5) + "°";

    }

    if (longitude) {

      longitude.textContent =
        aircraftLongitude.toFixed(5) + "°";

    }

    if (altitude) {

      altitude.textContent =
        Math.round(flightHeight) + " m";

    }

    if (headingDisplay) {

      headingDisplay.textContent =
        Math.round(heading) + "°";

    }

  }

  // ==========================================
  // UPDATE DESTINATION
  // ==========================================

  function updateDestinationDisplay() {

    const stop =
      flightStops[currentStopIndex];

    const destinationName =
      document.getElementById(
        "destinationName"
      );

    const readout =
      document.getElementById(
        "readout"
      );

    if (destinationName) {

      destinationName.textContent =
        stop.name;

    }

    if (readout) {

      readout.innerHTML =
        `${stop.city}<br>${stop.internship}`;

    }

  }

  // ==========================================
  // MOVE AIRCRAFT
  // ==========================================

  function moveAircraft(deltaSeconds) {

    if (!flying) {
      return;
    }

    if (
      Date.now() <
      stopPauseUntil
    ) {
      return;
    }

    const destination =
      flightStops[currentStopIndex];

    const distance =
      distanceBetween(

        aircraftLongitude,

        aircraftLatitude,

        destination.longitude,

        destination.latitude

      );

    // ----------------------------------------
    // ARRIVAL
    // ----------------------------------------

    if (distance <= 5) {

      aircraftLongitude =
        destination.longitude;

      aircraftLatitude =
        destination.latitude;

      arriveAtStop();

      return;
    }

    // ----------------------------------------
    // DIRECTION
    // ----------------------------------------

    const longitudeDifference =
      destination.longitude -
      aircraftLongitude;

    const latitudeDifference =
      destination.latitude -
      aircraftLatitude;

    const directionLength =
      Math.sqrt(

        longitudeDifference *
        longitudeDifference +

        latitudeDifference *
        latitudeDifference

      );

    if (
      directionLength === 0
    ) {

      return;

    }

    const directionLongitude =
      longitudeDifference /
      directionLength;

    const directionLatitude =
      latitudeDifference /
      directionLength;

    // ----------------------------------------
    // TIME BASED MOVEMENT
    // ----------------------------------------

    const metersThisFrame =
      flightSpeed *
      deltaSeconds;

    const degreesPerMeter =
      1 / 111320;

    let movementDegrees =
      metersThisFrame *
      degreesPerMeter;

    // ----------------------------------------
    // PREVENT OVERSHOOT
    // ----------------------------------------

    if (
      movementDegrees >
      directionLength
    ) {

      movementDegrees =
        directionLength;

    }

    aircraftLongitude +=
      directionLongitude *
      movementDegrees;

    aircraftLatitude +=
      directionLatitude *
      movementDegrees;

    // ----------------------------------------
    // CALCULATE HEADING
    // ----------------------------------------

const routeHeading =
  Cesium.Math.toDegrees(
    Math.atan2(
      directionLongitude,
      directionLatitude
    )
  );

// Apply manual left/right adjustment
heading =
  routeHeading + headingOffset;

if (heading < 0) {
  heading += 360;
}

if (heading >= 360) {
  heading -= 360;
    }
  }
  // ==========================================
  // ARRIVE AT STOP
  // ==========================================

  function arriveAtStop() {

    const stop =
      flightStops[currentStopIndex];

    flying = false;

    cameraFollowing = false;

    stopPauseUntil =
      Date.now() +
      STOP_TIME;

    const message =
      document.getElementById(
        "message"
      );

    if (message) {

      message.textContent =
        `Arrived at ${stop.name}.`;

    }

    updateDestinationDisplay();

    updateTelemetry();

    // ----------------------------------------
    // ZOOM TO COMPANY
    // ----------------------------------------

    viewer.camera.flyTo({

      destination:
        Cesium.Cartesian3.fromDegrees(

          stop.longitude,

          stop.latitude,

          3500

        ),

      orientation: {

        heading: 0,

        pitch:
          Cesium.Math.toRadians(-35),

        roll: 0

      },

      duration: 1.5

    });

    // ----------------------------------------
    // SELECT COMPANY
    // ----------------------------------------

    viewer.selectedEntity =
      companyEntities[
        currentStopIndex
      ];

    // ----------------------------------------
    // NEXT STOP
    // ----------------------------------------

    setTimeout(() => {

      if (
        currentStopIndex <
        flightStops.length - 1
      ) {

        currentStopIndex++;

        flying = true;

        lastFrameTime = null;

        cameraFollowing = true;

        updateDestinationDisplay();

        const message =
          document.getElementById(
            "message"
          );

        if (message) {

          message.textContent =
            `Flying to ${flightStops[currentStopIndex].name}...`;

        }

        viewer.selectedEntity =
          undefined;

      }

    }, STOP_TIME);

  }

  // ==========================================
  // START FLIGHT
  // ==========================================

  function startFlight() {

    flying = true;

    cameraFollowing = true;

    lastFrameTime = null;

    const message =
      document.getElementById(
        "message"
      );

    if (message) {

      message.textContent =
        `Flying to ${flightStops[currentStopIndex].name}...`;

    }

    viewer.selectedEntity =
      undefined;

  }

  // ==========================================
  // PAUSE
  // ==========================================

  function pauseFlight() {

    flying = false;

    cameraFollowing = false;

    const message =
      document.getElementById(
        "message"
      );

    if (message) {

      message.textContent =
        "Flight paused.";

    }

  }

  // ==========================================
  // RESET
  // ==========================================

  function resetFlight() {

    flying = false;

    cameraFollowing = false;

    currentStopIndex = 0;

    stopPauseUntil = 0;

    aircraftLongitude =
      flightStops[0].longitude;

    aircraftLatitude =
      flightStops[0].latitude;

    heading = 0;
    headingOffset = 0;

    updateDestinationDisplay();

    updateTelemetry();

    const message =
      document.getElementById(
        "message"
      );

    if (message) {

      message.textContent =
        `Ready at ${flightStops[0].name}.`;

    }

    viewer.selectedEntity =
      undefined;

    viewer.camera.flyTo({

      destination:
        Cesium.Cartesian3.fromDegrees(

          flightStops[0].longitude,

          flightStops[0].latitude,

          5000

        ),

      orientation: {

        heading: 0,

        pitch:
          Cesium.Math.toRadians(-35),

        roll: 0

      },

      duration: 1.5

    });

  }

  // ==========================================
  // CAMERA
  // ==========================================

  function updateCamera() {

    if (
      !cameraFollowing ||
      !flying
    ) {

      return;

    }

    const aircraftPosition =
      getAircraftPosition();

    viewer.camera.lookAt(

      aircraftPosition,

      new Cesium.HeadingPitchRange(

        Cesium.Math.toRadians(
          heading
        ),

        Cesium.Math.toRadians(-35),

        FOLLOW_CAMERA_DISTANCE

      )

    );

  }

  // ==========================================
  // SPEED CONTROL
  // ==========================================

  const speedSlider =
    document.getElementById(
      "speed"
    );

  const speedValue =
    document.getElementById(
      "speedValue"
    );

  if (speedSlider) {

    speedSlider.addEventListener(
      "input",
      () => {

        flightSpeed =
          Number(
            speedSlider.value
          );

        if (speedValue) {

          speedValue.textContent =
            flightSpeed;

        }

      }
    );

  }

  // ==========================================
  // HEIGHT CONTROL
  // ==========================================

  const heightSlider =
    document.getElementById(
      "height"
    );

  const heightValue =
    document.getElementById(
      "heightValue"
    );

  if (heightSlider) {

    heightSlider.addEventListener(
      "input",
      () => {

        flightHeight =
          Number(
            heightSlider.value
          );

        if (heightValue) {

          heightValue.textContent =
            flightHeight;

        }

        updateTelemetry();

      }
    );

  }

  // ==========================================
  // SLOW TOUR
  // ==========================================

  const slowButton =
    document.getElementById(
      "slow"
    );

  if (slowButton) {

    slowButton.addEventListener(
      "click",
      () => {

        flightSpeed = 20;

        if (speedSlider) {

          speedSlider.value = 20;

        }

        if (speedValue) {

          speedValue.textContent = 20;

        }

        startFlight();

      }
    );

  }

  // ==========================================
  // LEFT 10°
  // ==========================================
    const leftButton =
  document.getElementById(
    "left"
  );

if (leftButton) {

  leftButton.addEventListener(
    "click",
    () => {

      headingOffset -= 10;

      if (headingOffset < -180) {
        headingOffset = -180;
      }

      updateTelemetry();

    }
  );

}


  // ==========================================
  // RIGHT 10°
  // ==========================================

  const rightButton =
  document.getElementById(
    "right"
  );

if (rightButton) {

  rightButton.addEventListener(
    "click",
    () => {

      headingOffset += 10;

      if (headingOffset > 180) {
        headingOffset = 180;
      }

      updateTelemetry();

    }
  );

}

  // ==========================================
  // BUTTONS
  // ==========================================

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

  // ==========================================
  // FRAME LOOP
  // ==========================================

  viewer.clock.onTick.addEventListener(
    () => {

      const now =
        performance.now();

      if (
        lastFrameTime === null
      ) {

        lastFrameTime = now;

        updateTelemetry();

        return;

      }

      let deltaSeconds =
        (now - lastFrameTime) /
        1000;

      lastFrameTime = now;

      // Prevent a huge jump if the browser
      // temporarily stops rendering.

      deltaSeconds =
        Math.min(
          deltaSeconds,
          0.1
        );

      moveAircraft(
        deltaSeconds
      );

      updateCamera();

      updateTelemetry();

    }
  );

  // ==========================================
  // INITIALIZE
  // ==========================================

  if (speedValue) {

    speedValue.textContent =
      flightSpeed;

  }

  if (heightValue) {

    heightValue.textContent =
      flightHeight;

  }

  resetFlight();

})();
