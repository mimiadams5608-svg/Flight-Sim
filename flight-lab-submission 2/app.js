(async () => {
  "use strict";

  // ============================================================
  // CESIUM TOKEN
  // ============================================================
  // PUT YOUR CESIUM ION TOKEN BETWEEN THE QUOTES.
  Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImoxNDJicUlhYlB5Mjd2bDQiLCJqdGkiOiI1OWU3MjBhNC00M2U3LTRiN2QtODcxOC1hYWNkN2JjZjU4ZDAiLCJpZCI6NTA1NzM0LCJpc3MiOiJodHRwczovL2FwaS5jZXNpdW0uY29tIiwiYXVkIjoidW5kZWZpbmVkX2RlZmF1bHQiLCJpYXQiOjE3OTAxNjk0NTV9.7i8qqGsNYbbkX7JFYb7MSzGlMmybpYPmv5_GRIZlyc8";


  // ============================================================
  // FLIGHT STOPS
  // ============================================================
  //
  // THIS IS THE MAIN SECTION YOU CAN EDIT.
  //
  // Each stop contains:
  // name
  // city
  // internship
  // description
  // longitude
  // latitude
  //
  // IMPORTANT:
  // Longitude comes FIRST in Cesium.fromDegrees().
  //
  // Remote internships are identified in the description.
  // The map location represents the location associated with
  // the company/opportunity.


  const flightStops = [

    // ----------------------------------------------------------
    // STOP 1 — HUBBELL
    // ----------------------------------------------------------

    {
      name: "Hubbell",

      city: "Reading, PA",

      internship:
        "2027 Engineering / Technology Internship",

      description:
        "Hubbell offers 2027 internship opportunities in engineering and technology-related areas at its Reading location. This stop represents Hubbell's Reading-area operations.",

      longitude: -75.9387,

      latitude: 40.3787
    },


    // ----------------------------------------------------------
    // STOP 2 — PENSKE
    // ----------------------------------------------------------

    {
      name: "Penske Truck Leasing",

      city: "Reading, PA",

      internship:
        "2027 Corporate Internship — Information Systems",

      description:
        "Penske offers a 2027 corporate internship program that includes Information Systems. This stop represents Penske's Reading corporate location.",

      longitude: -75.8728,

      latitude: 40.3026
    },


    // ----------------------------------------------------------
    // STOP 3 — EAST PENN
    // ----------------------------------------------------------

    {
      name: "East Penn Manufacturing",

      city: "Lyon Station, PA",

      internship:
        "IT Cybersecurity Internship — Summer 2027",

      description:
        "This cybersecurity internship is relevant to Computer Science, cybersecurity, networking, operating systems, and information technology. The position is associated with East Penn Manufacturing in Lyon Station.",

      longitude: -76.0037,

      latitude: 40.5247
    },


    // ----------------------------------------------------------
    // STOP 4 — MATERION
    // ----------------------------------------------------------

    {
      name: "Materion",

      city: "Leesport, PA",

      internship:
        "2027 Summer Internship Program",

      description:
        "Materion's 2027 internship program includes opportunities related to Information Technology, Computer Science, and Data Science. This stop represents the Materion location associated with the internship opportunity.",

      longitude: -75.9685,

      latitude: 40.4498
    },


    // ----------------------------------------------------------
    // STOP 5 — FREDDIE MAC
    // ----------------------------------------------------------

    {
      name: "Freddie Mac",

      city: "Reading, PA",

      internship:
        "Technology Summer Internship — 2027",

      description:
        "This is a remote technology internship opportunity related to areas such as software, applications, data, cybersecurity, and information technology. The flight stop represents the Reading-area location listed for the opportunity.",

      longitude: -75.9269,

      latitude: 40.3356
    },


    // ----------------------------------------------------------
    // STOP 6 — WORLD WIDE TECHNOLOGY
    // ----------------------------------------------------------

    {
      name: "World Wide Technology",

      city: "Reading, PA",

      internship:
        "2027 Solutions, Consulting & Engineering Internship",

      description:
        "This is a remote technology internship opportunity with areas including Computer Science, cybersecurity, data science, information technology, and software engineering. The flight stop represents the Reading-area location associated with the opportunity.",

      longitude: -75.9269,

      latitude: 40.3356
    }

  ];


  // ============================================================
  // SIMULATOR SETTINGS
  // ============================================================

  const START_LOCATION = {

    longitude: -75.9300,

    latitude: 40.3300

  };


  // Height of the aircraft above the ground.

  const FLIGHT_HEIGHT = 1200;


  // Speed of the aircraft.

  const FLIGHT_SPEED = 0.00065;


  // Distance required to trigger a stop.

  const ARRIVAL_DISTANCE = 0.00065;


  // How long the plane waits at each company.

  const STOP_TIME = 5000;



  // ============================================================
  // CREATE CESIUM VIEWER
  // ============================================================

  const viewer = new Cesium.Viewer(
    "cesiumContainer",
    {

      // --------------------------------------------------------
      // REAL WORLD 3D TERRAIN
      // --------------------------------------------------------

      terrain:
        Cesium.Terrain.fromWorldTerrain(),


      animation: false,

      timeline: false,

      baseLayerPicker: false,

      geocoder: false,

      homeButton: true,

      sceneModePicker: true,

      navigationHelpButton: false,

      selectionIndicator: true,

      infoBox: true

    }
  );



  // ============================================================
  // REAL WORLD IMAGERY
  // ============================================================
  //
  // This replaces the plain blue/grid appearance with
  // real-world imagery.
  //
  // Cesium World Imagery is provided through Cesium ion.


  try {

    const imageryProvider =
      await Cesium.createWorldImageryAsync({

        style:
          Cesium.IonWorldImageryStyle.AERIAL_WITH_LABELS

      });


    viewer.imageryLayers.addImageryProvider(
      imageryProvider
    );


  } catch (error) {

    console.error(
      "World imagery could not be loaded:",
      error
    );

  }



  // ============================================================
  // REAL 3D BUILDINGS
  // ============================================================
  //
  // This loads real-world 3D buildings from Cesium OSM
  // Buildings.


  try {

    const buildings =
      await Cesium.createOsmBuildingsAsync();


    viewer.scene.primitives.add(
      buildings
    );


  } catch (error) {

    console.error(
      "3D buildings could not be loaded:",
      error
    );

  }



  // ============================================================
  // TERRAIN VISUAL SETTINGS
  // ============================================================

  viewer.scene.globe.depthTestAgainstTerrain = true;

  viewer.scene.globe.enableLighting = true;

  viewer.scene.skyAtmosphere.show = true;



  // ============================================================
  // COMPANY MARKERS
  // ============================================================

  const stopEntities = [];


  flightStops.forEach(
    (stop, index) => {


      const entity =
        viewer.entities.add({

          name: stop.name,


          // Company marker location

          position:
            Cesium.Cartesian3.fromDegrees(

              stop.longitude,

              stop.latitude,

              30

            ),


          // ----------------------------------------------------
          // ORANGE COMPANY MARKER
          // ----------------------------------------------------

          point: {

            pixelSize: 15,

            color:
              Cesium.Color.ORANGE,

            outlineColor:
              Cesium.Color.WHITE,

            outlineWidth: 3,

            heightReference:
              Cesium.HeightReference
                .CLAMP_TO_GROUND

          },


          // ----------------------------------------------------
          // COMPANY NAME
          // ----------------------------------------------------

          label: {

            text:
              `${index + 1}. ${stop.name}`,

            font:
              "bold 15px sans-serif",

            fillColor:
              Cesium.Color.WHITE,

            outlineColor:
              Cesium.Color.BLACK,

            outlineWidth: 4,

            style:
              Cesium.LabelStyle
                .FILL_AND_OUTLINE,

            verticalOrigin:
              Cesium.VerticalOrigin.BOTTOM,

            pixelOffset:
              new Cesium.Cartesian2(
                0,
                -20
              ),

            heightReference:
              Cesium.HeightReference
                .CLAMP_TO_GROUND

          },


          // ----------------------------------------------------
          // COMPANY INFORMATION
          // ----------------------------------------------------

          description: `

            <div style="
              font-family: Arial, sans-serif;
              padding: 8px;
              min-width: 270px;
            ">

              <h2 style="
                margin-top:0;
              ">
                ${index + 1}. ${stop.name}
              </h2>

              <p>
                <strong>Location:</strong>
                ${stop.city}
              </p>

              <p>
                <strong>Internship:</strong>
                ${stop.internship}
              </p>

              <p>
                ${stop.description}
              </p>

            </div>

          `

        });


      stopEntities.push(
        entity
      );

    }
  );



  // ============================================================
  // CREATE AIRCRAFT
  // ============================================================

  const aircraft =
    viewer.entities.add({

      name:
        "Flight Simulator Aircraft",


      position:
        Cesium.Cartesian3.fromDegrees(

          START_LOCATION.longitude,

          START_LOCATION.latitude,

          FLIGHT_HEIGHT

        ),


      // --------------------------------------------------------
      // YELLOW AIRCRAFT
      // --------------------------------------------------------

      point: {

        pixelSize: 18,

        color:
          Cesium.Color.YELLOW,

        outlineColor:
          Cesium.Color.BLACK,

        outlineWidth: 3

      },


      // --------------------------------------------------------
      // AIRCRAFT LABEL
      // --------------------------------------------------------

      label: {

        text:
          "Aircraft",

        font:
          "bold 14px sans-serif",

        fillColor:
          Cesium.Color.YELLOW,

        outlineColor:
          Cesium.Color.BLACK,

        outlineWidth: 3,

        style:
          Cesium.LabelStyle
            .FILL_AND_OUTLINE,

        verticalOrigin:
          Cesium.VerticalOrigin.BOTTOM,

        pixelOffset:
          new Cesium.Cartesian2(
            0,
            -22
          )

      }

    });



  // ============================================================
  // FLIGHT STATE
  // ============================================================

  let currentStopIndex = 0;

  let flightPaused = false;

  let flightFinished = false;

  let lastTime =
    performance.now();

  let stopTimer = null;



  // ============================================================
  // DISTANCE FUNCTION
  // ============================================================

  function distanceBetween(

    longitude1,

    latitude1,

    longitude2,

    latitude2

  ) {

    const dx =
      longitude2 -
      longitude1;


    const dy =
      latitude2 -
      latitude1;


    return Math.sqrt(

      dx * dx +
      dy * dy

    );

  }



  // ============================================================
  // MOVE AIRCRAFT
  // ============================================================

  function moveAircraft(
    deltaTime
  ) {


    if (
      flightPaused ||
      flightFinished
    ) {

      return;

    }


    const target =
      flightStops[
        currentStopIndex
      ];


    if (!target) {

      finishFlight();

      return;

    }


    const currentCartesian =
      aircraft.position.getValue(

        Cesium.JulianDate.now()

      );


    if (!currentCartesian) {

      return;

    }


    const currentCartographic =
      Cesium.Cartographic
        .fromCartesian(
          currentCartesian
        );


    const currentLongitude =
      Cesium.Math.toDegrees(

        currentCartographic
          .longitude

      );


    const currentLatitude =
      Cesium.Math.toDegrees(

        currentCartographic
          .latitude

      );


    const distance =
      distanceBetween(

        currentLongitude,

        currentLatitude,

        target.longitude,

        target.latitude

      );



    // ========================================================
    // ARRIVED AT COMPANY
    // ========================================================

    if (
      distance <=
      ARRIVAL_DISTANCE
    ) {


      aircraft.position =
        Cesium.Cartesian3.fromDegrees(

          target.longitude,

          target.latitude,

          FLIGHT_HEIGHT

        );


      arriveAtStop();


      return;

    }



    // ========================================================
    // MOVE TOWARD COMPANY
    // ========================================================

    const step =
      FLIGHT_SPEED *
      deltaTime;


    const ratio =
      Math.min(

        step / distance,

        1

      );


    const newLongitude =

      currentLongitude +

      (
        target.longitude -
        currentLongitude
      ) *

      ratio;


    const newLatitude =

      currentLatitude +

      (
        target.latitude -
        currentLatitude
      ) *

      ratio;


    aircraft.position =
      Cesium.Cartesian3.fromDegrees(

        newLongitude,

        newLatitude,

        FLIGHT_HEIGHT

      );

  }



  // ============================================================
  // ARRIVE AT STOP
  // ============================================================

  function arriveAtStop() {


    flightPaused = true;


    const stop =
      flightStops[
        currentStopIndex
      ];


    aircraft.label.text =
      `STOP ${
        currentStopIndex + 1
      }: ${stop.name}`;


    viewer.selectedEntity =
      stopEntities[
        currentStopIndex
      ];



    // ----------------------------------------------------------
    // FLY CAMERA TO COMPANY
    // ----------------------------------------------------------

    viewer.camera.flyTo({

      destination:

        Cesium.Cartesian3.fromDegrees(

          stop.longitude,

          stop.latitude,

          3500

        ),


      orientation: {

        heading:
          Cesium.Math.toRadians(0),

        pitch:
          Cesium.Math.toRadians(-55),

        roll: 0

      },


      duration: 2

    });



    showStopPanel(
      stop
    );


    // ----------------------------------------------------------
    // AUTOMATICALLY CONTINUE
    // ----------------------------------------------------------

    stopTimer =
      setTimeout(

        () => {

          continueToNextStop();

        },

        STOP_TIME

      );

  }



  // ============================================================
  // CONTINUE TO NEXT STOP
  // ============================================================

  function continueToNextStop() {


    if (stopTimer) {

      clearTimeout(
        stopTimer
      );

      stopTimer = null;

    }


    hideStopPanel();


    currentStopIndex++;


    if (
      currentStopIndex >=
      flightStops.length
    ) {

      finishFlight();

      return;

    }


    flightPaused = false;


    const nextStop =
      flightStops[
        currentStopIndex
      ];


    aircraft.label.text =
      `Flying to ${nextStop.name}`;


    viewer.camera.flyTo({

      destination:

        Cesium.Cartesian3.fromDegrees(

          nextStop.longitude,

          nextStop.latitude,

          10000

        ),


      orientation: {

        heading:
          Cesium.Math.toRadians(0),

        pitch:
          Cesium.Math.toRadians(-35),

        roll: 0

      },


      duration: 2

    });

  }



  // ============================================================
  // FINISH FLIGHT
  // ============================================================

  function finishFlight() {


    flightFinished = true;

    flightPaused = true;


    aircraft.label.text =
      "FLIGHT COMPLETE";


    showCompletionPanel();

  }



  // ============================================================
  // CREATE INFORMATION PANEL
  // ============================================================

  function createPanel() {


    let panel =
      document.getElementById(
        "flightStopPanel"
      );


    if (panel) {

      return panel;

    }


    panel =
      document.createElement(
        "div"
      );


    panel.id =
      "flightStopPanel";


    panel.style.position =
      "absolute";


    panel.style.top =
      "20px";


    panel.style.left =
      "20px";


    panel.style.width =
      "300px";


    panel.style.background =
      "rgba(0, 0, 0, 0.82)";


    panel.style.color =
      "white";


    panel.style.padding =
      "18px";


    panel.style.borderRadius =
      "12px";


    panel.style.fontFamily =
      "Arial, sans-serif";


    panel.style.zIndex =
      "1000";


    panel.style.display =
      "none";


    document.body.appendChild(
      panel
    );


    return panel;

  }



  // ============================================================
  // SHOW COMPANY PANEL
  // ============================================================

  function showStopPanel(
    stop
  ) {


    const panel =
      createPanel();


    panel.style.display =
      "block";


    panel.innerHTML = `

      <div style="
        font-size:12px;
        text-transform:uppercase;
        opacity:.7;
        margin-bottom:5px;
      ">

        Flight Stop
        ${currentStopIndex + 1}
        of
        ${flightStops.length}

      </div>


      <h2 style="
        margin:0 0 8px 0;
      ">

        ${stop.name}

      </h2>


      <div style="
        margin-bottom:8px;
        opacity:.85;
      ">

        📍 ${stop.city}

      </div>


      <div style="
        margin-bottom:10px;
      ">

        <strong>
          Internship:
        </strong>

        <br>

        ${stop.internship}

      </div>


      <div style="
        font-size:13px;
        line-height:1.4;
        opacity:.9;
      ">

        ${stop.description}

      </div>


      <button
        id="continueFlightButton"
        style="
          margin-top:15px;
          width:100%;
          padding:10px;
          border:0;
          border-radius:7px;
          cursor:pointer;
          font-weight:bold;
        "
      >

        Continue Flight

      </button>

    `;


    document
      .getElementById(
        "continueFlightButton"
      )
      .addEventListener(

        "click",

        continueToNextStop

      );

  }



  // ============================================================
  // HIDE COMPANY PANEL
  // ============================================================

  function hideStopPanel() {


    const panel =
      document.getElementById(
        "flightStopPanel"
      );


    if (panel) {

      panel.style.display =
        "none";

    }

  }



  // ============================================================
  // COMPLETION PANEL
  // ============================================================

  function showCompletionPanel() {


    const panel =
      createPanel();


    panel.style.display =
      "block";


    panel.innerHTML = `

      <div style="
        font-size:12px;
        text-transform:uppercase;
        opacity:.7;
      ">

        Flight Complete

      </div>


      <h2>
        ✈️ Internship Tour Complete
      </h2>


      <p style="
        line-height:1.5;
      ">

        You have completed all
        ${flightStops.length}
        internship stops.

      </p>


      <button
        id="restartFlightButton"
        style="
          margin-top:10px;
          width:100%;
          padding:10px;
          border:0;
          border-radius:7px;
          cursor:pointer;
          font-weight:bold;
        "
      >

        Restart Flight

      </button>

    `;


    document
      .getElementById(
        "restartFlightButton"
      )
      .addEventListener(

        "click",

        restartFlight

      );

  }



  // ============================================================
  // RESTART FLIGHT
  // ============================================================

  function restartFlight() {


    if (stopTimer) {

      clearTimeout(
        stopTimer
      );

      stopTimer = null;

    }


    currentStopIndex = 0;


    flightPaused = false;


    flightFinished = false;


    aircraft.position =
      Cesium.Cartesian3.fromDegrees(

        START_LOCATION.longitude,

        START_LOCATION.latitude,

        FLIGHT_HEIGHT

      );


    aircraft.label.text =
      "Aircraft";


    hideStopPanel();



    viewer.camera.flyTo({

      destination:

        Cesium.Cartesian3.fromDegrees(

          START_LOCATION.longitude,

          START_LOCATION.latitude,

          12000

        ),


      orientation: {

        heading:
          Cesium.Math.toRadians(0),

        pitch:
          Cesium.Math.toRadians(-40),

        roll: 0

      },


      duration: 2

    });

  }



  // ============================================================
  // INITIAL CAMERA
  // ============================================================

  viewer.camera.flyTo({

    destination:

      Cesium.Cartesian3.fromDegrees(

        START_LOCATION.longitude,

        START_LOCATION.latitude,

        12000

      ),


    orientation: {

      heading:
        Cesium.Math.toRadians(0),

      pitch:
        Cesium.Math.toRadians(-40),

      roll: 0

    },


    duration: 2

  });



  // ============================================================
  // MAIN FLIGHT LOOP
  // ============================================================

  viewer.clock.onTick.addEventListener(
    () => {


      const now =
        performance.now();


      const deltaTime =
        Math.min(

          (now - lastTime) /
          16.67,

          3

        );


      lastTime = now;


      moveAircraft(
        deltaTime
      );

    }
  );



  // ============================================================
  // CLICK COMPANY MARKERS
  // ============================================================

  viewer
    .screenSpaceEventHandler
    .setInputAction(

      function (click) {


        const picked =
          viewer.scene.pick(
            click.position
          );


        if (

          Cesium.defined(
            picked
          ) &&

          picked.id

        ) {


          viewer.selectedEntity =
            picked.id;

        }

      },


      Cesium
        .ScreenSpaceEventType
        .LEFT_CLICK

    );

})();
