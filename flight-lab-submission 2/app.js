(async () => {
  "use strict";

  // =========================
  // CESIUM SETUP
  // =========================

  Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImoxNDJicUlhYlB5Mjd2bDQiLCJqdGkiOiI1OWU3MjBhNC00M2U3LTRiN2QtODcxOC1hYWNkN2JjZjU4ZDAiLCJpZCI6NTA1NzM0LCJpc3MiOiJodHRwczovL2FwaS5jZXNpdW0uY29tIiwiYXVkIjoidW5kZWZpbmVkX2RlZmF1bHQiLCJpYXQiOjE3OTAxNjk0NTV9.7i8qqGsNYbbkX7JFYb7MSzGlMmybpYPmv5_GRIZlyc8";

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

  try {
    const imageryProvider = await Cesium.createWorldImageryAsync();
    viewer.imageryLayers.addImageryProvider(imageryProvider);
  } catch (error) {
    console.error("Could not load Cesium World Imagery:", error);
  }

  try {
    const buildings = await Cesium.createOsmBuildingsAsync();
    viewer.scene.primitives.add(buildings);
  } catch (error) {
    console.error("Could not load 3D buildings:", error);
  }

  viewer.scene.globe.depthTestAgainstTerrain = true;
  viewer.scene.globe.enableLighting = true;
  viewer.scene.skyAtmosphere.show = true;


  // =========================
  // FLIGHT STOPS
  // =========================

 const flightStops = [
  {
    name: "Penske Truck Leasing",
    city: "Reading, PA",
    internship: "2027 Corporate Internship — Information Systems",
    description:
      "Penske Truck Leasing's 2027 Corporate Internship program includes opportunities in Information Systems. This internship is a strong fit for Computer Science students interested in technology, information systems, business technology, and using technology to support a large organization. The flight stop represents Penske's Reading corporate location.",
    longitude: -75.8728,
    latitude: 40.3026
  },

  {
    name: "Hubbell",
    city: "Reading, PA",
    internship: "2027 Engineering / Technology Internship",
    description:
      "Hubbell offers 2027 internship opportunities in engineering and technology-related areas. Students in Computer Science and related technology fields can gain experience applying technical and problem-solving skills in a professional environment. This flight stop represents Hubbell's Reading-area location.",
    longitude: -75.9387,
    latitude: 40.3787
  },

  {
    name: "Freddie Mac",
    city: "Remote",
    internship: "Technology Summer Internship — 2027",
    description:
      "This is a remote technology internship opportunity involving areas such as software, applications, data, cybersecurity, and information technology. It provides an opportunity for students interested in Computer Science to gain experience working with technology in a professional financial-services environment. The aircraft travels to the location represented by the internship stop, while the internship itself is remote.",
    longitude: -75.9269,
    latitude: 40.3356
  },

  {
    name: "World Wide Technology",
    city: "Remote",
    internship: "2027 Solutions, Consulting & Engineering Internship",
    description:
      "This remote technology internship provides opportunities to work with areas such as Computer Science, cybersecurity, data science, information technology, solutions, consulting, and software engineering. It is designed for students interested in applying technical knowledge to real-world technology projects. The internship is remote, while the flight marker represents the location used for this stop.",
    longitude: -75.9269,
    latitude: 40.3356
  },

  {
    name: "Materion",
    city: "Leesport, PA",
    internship: "2027 Summer Internship Program",
    description:
      "Materion's 2027 Summer Internship Program includes opportunities connected to Information Technology, Computer Science, and Data Science. This stop is useful for students interested in applying programming, data, technology, and problem-solving skills in a professional setting. The flight stop represents Materion's Leesport-area location.",
    longitude: -75.9685,
    latitude: 40.4498
  },

  {
    name: "East Penn Manufacturing",
    city: "Lyon Station, PA",
    internship: "IT Cybersecurity Internship — Summer 2027",
    description:
      "East Penn Manufacturing offers an IT cybersecurity internship focused on areas relevant to Computer Science and information technology. Students can explore cybersecurity, networking, operating systems, and other technical concepts while gaining professional experience. The flight stop represents East Penn Manufacturing's Lyon Station location.",
    longitude: -76.0037,
    latitude: 40.5247
  }
];


  // =========================
  // FLIGHT SETTINGS
  // =========================

  const START_LOCATION = {
    longitude: -75.9300,
    latitude: 40.3300
  };

  // Height of aircraft
  const FLIGHT_HEIGHT = 1200;

  // Slower than the previous version
  // Smaller number = slower movement
  const FLIGHT_SPEED = 0.00012;

  // Distance at which the aircraft considers
  // itself to have reached a stop
  const ARRIVAL_DISTANCE = 0.00035;

  // How long to pause at each company
  const STOP_TIME = 5000;


  // =========================
  // STATUS MESSAGE
  // =========================

  const message = document.getElementById("message");

  if (message) {
    message.textContent = "Flight simulator ready.";
  }


  // =========================
  // COMPANY MARKERS
  // =========================

  const companyEntities = [];

  flightStops.forEach((stop, index) => {

    const entity = viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(
        stop.longitude,
        stop.latitude,
        0
      ),

      point: {
        pixelSize: 13,
        color: Cesium.Color.ORANGE,
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 2
      },

      label: {
        text: `${index + 1}. ${stop.name}`,
        font: "bold 15px sans-serif",
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
        <p><strong>Location:</strong> ${stop.city}</p>
        <p><strong>Internship:</strong> ${stop.internship}</p>
        <p>${stop.description}</p>
      `
    });

    companyEntities.push(entity);
  });


  // =========================
  // AIRCRAFT
  // =========================

  let aircraftLongitude = START_LOCATION.longitude;
  let aircraftLatitude = START_LOCATION.latitude;

  const aircraft = viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(
      aircraftLongitude,
      aircraftLatitude,
      FLIGHT_HEIGHT
    ),

    point: {
      pixelSize: 16,
      color: Cesium.Color.YELLOW,
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 3
    },

    label: {
      text: "✈ Aircraft",
      font: "bold 14px sans-serif",
      fillColor: Cesium.Color.YELLOW,
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 3,
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      pixelOffset: new Cesium.Cartesian2(0, -18),
      disableDepthTestDistance: Number.POSITIVE_INFINITY
    }
  });


  // =========================
  // FLIGHT STATE
  // =========================

  let currentStopIndex = 0;
  let flying = true;
  let waitingAtStop = false;
  let waitTimer = null;


  // =========================
  // DISTANCE CALCULATION
  // =========================

  function distanceToStop(stop) {

    const dx = stop.longitude - aircraftLongitude;
    const dy = stop.latitude - aircraftLatitude;

    return Math.sqrt(
      dx * dx +
      dy * dy
    );
  }


  // =========================
  // MOVE AIRCRAFT
  // =========================

  function moveAircraft() {

    if (!flying || waitingAtStop) {
      return;
    }

    if (currentStopIndex >= flightStops.length) {
      finishFlight();
      return;
    }

    const stop = flightStops[currentStopIndex];

    const dx =
      stop.longitude - aircraftLongitude;

    const dy =
      stop.latitude - aircraftLatitude;

    const distance =
      Math.sqrt(dx * dx + dy * dy);

    // Arrived at destination
    if (distance <= ARRIVAL_DISTANCE) {

      aircraftLongitude = stop.longitude;
      aircraftLatitude = stop.latitude;

      aircraft.position = Cesium.Cartesian3.fromDegrees(
        aircraftLongitude,
        aircraftLatitude,
        FLIGHT_HEIGHT
      );

      arriveAtStop();

      return;
    }

    // Normalize movement direction
    const directionX = dx / distance;
    const directionY = dy / distance;

    // Move slowly toward destination
    aircraftLongitude +=
      directionX * FLIGHT_SPEED;

    aircraftLatitude +=
      directionY * FLIGHT_SPEED;


    // Update aircraft position
    aircraft.position = Cesium.Cartesian3.fromDegrees(
      aircraftLongitude,
      aircraftLatitude,
      FLIGHT_HEIGHT
    );


    // =========================
    // FOLLOW THE AIRCRAFT
    // =========================

    // This keeps the yellow aircraft visible
    // instead of jumping the camera to each stop.

    viewer.camera.lookAt(
      aircraft.position.getValue(Cesium.JulianDate.now()),
      new Cesium.HeadingPitchRange(
        0,
        Cesium.Math.toRadians(-35),
        35000
      )
    );
  }


  // =========================
  // ARRIVAL
  // =========================

  function arriveAtStop() {

    const stop = flightStops[currentStopIndex];

    waitingAtStop = true;

    if (message) {
      message.textContent =
        `Arrived at ${stop.name}`;
    }

    viewer.selectedEntity =
      companyEntities[currentStopIndex];


    // Keep the camera near the aircraft.
    // Do NOT use camera.flyTo here.
    viewer.camera.lookAt(
      aircraft.position.getValue(
        Cesium.JulianDate.now()
      ),
      new Cesium.HeadingPitchRange(
        0,
        Cesium.Math.toRadians(-35),
        25000
      )
    );


    // Wait before continuing
    waitTimer = setTimeout(() => {

      waitingAtStop = false;

      currentStopIndex++;

      if (currentStopIndex >= flightStops.length) {
        finishFlight();
      } else {
        const nextStop =
          flightStops[currentStopIndex];

        if (message) {
          message.textContent =
            `Flying to ${nextStop.name}...`;
        }
      }

    }, STOP_TIME);
  }


  // =========================
  // FINISH FLIGHT
  // =========================

  function finishFlight() {

    flying = false;
    waitingAtStop = false;

    if (message) {
      message.textContent =
        "Flight complete — all internship stops visited.";
    }

    viewer.camera.lookAt(
      aircraft.position.getValue(
        Cesium.JulianDate.now()
      ),
      new Cesium.HeadingPitchRange(
        0,
        Cesium.Math.toRadians(-35),
        40000
      )
    );
  }


  // =========================
  // RESET
  // =========================

  function resetFlight() {

    if (waitTimer) {
      clearTimeout(waitTimer);
      waitTimer = null;
    }

    aircraftLongitude =
      START_LOCATION.longitude;

    aircraftLatitude =
      START_LOCATION.latitude;

    currentStopIndex = 0;

    flying = true;
    waitingAtStop = false;

    aircraft.position =
      Cesium.Cartesian3.fromDegrees(
        aircraftLongitude,
        aircraftLatitude,
        FLIGHT_HEIGHT
      );

    viewer.selectedEntity = undefined;

    if (message) {
      message.textContent =
        `Flying to ${flightStops[0].name}...`;
    }
  }


  // =========================
  // CONTINUE BUTTON
  // =========================

  function continueFlight() {

    if (currentStopIndex < flightStops.length) {

      waitingAtStop = false;
      flying = true;

      if (message) {
        message.textContent =
          `Flying to ${flightStops[currentStopIndex].name}...`;
      }
    }
  }


  // =========================
  // CAMERA START POSITION
  // =========================

  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(
      START_LOCATION.longitude,
      START_LOCATION.latitude,
      50000
    )
  });


  // =========================
  // FLIGHT LOOP
  // =========================

  viewer.clock.onTick.addEventListener(() => {

    moveAircraft();

  });


  // =========================
  // ORIGINAL CONTROLS
  // =========================

  const flyButton =
    document.getElementById("fly");

  const pauseButton =
    document.getElementById("pause");

  const resetButton =
    document.getElementById("reset");


  if (flyButton) {

    flyButton.addEventListener(
      "click",
      () => {

        flying = true;
        waitingAtStop = false;

        if (message) {
          message.textContent =
            `Flying to ${flightStops[currentStopIndex].name}...`;
        }

      }
    );

  }


  if (pauseButton) {

    pauseButton.addEventListener(
      "click",
      () => {

        flying = false;

        if (message) {
          message.textContent =
            "Flight paused.";
        }

      }
    );

  }


  if (resetButton) {

    resetButton.addEventListener(
      "click",
      resetFlight
    );

  }


  // =========================
  // CLICK COMPANY MARKERS
  // =========================

  viewer.screenSpaceEventHandler.setInputAction(
    (movement) => {

      const picked =
        viewer.scene.pick(movement.position);

      if (
        Cesium.defined(picked) &&
        picked.id
      ) {

        viewer.selectedEntity =
          picked.id;

      }

    },
    Cesium.ScreenSpaceEventType.LEFT_CLICK
  );


  // =========================
  // START FLIGHT
  // =========================

  if (message) {
    message.textContent =
      `Flying to ${flightStops[0].name}...`;
  }

})();
