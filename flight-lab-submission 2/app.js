/* UI + Cesium rendering. Movement rules live in flight-core.js. */
/* UI + Cesium rendering. Movement rules live in flight-core.js. */

(async () => {

const $ = id => document.getElementById(id);

if (typeof Cesium === 'undefined') {
    $('message').textContent =
        'Cesium did not load. Check your internet connection or CDN access.';
    return;
}


/* =========================================================
   PUT YOUR CESIUM ION TOKEN HERE
   ========================================================= */

Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImoxNDJicUlhYlB5Mjd2bDQiLCJqdGkiOiI1OWU3MjBhNC00M2U3LTRiN2QtODcxOC1hYWNkN2JjZjU4ZDAiLCJpZCI6NTA1NzM0LCJpc3MiOiJodHRwczovL2FwaS5jZXNpdW0uY29tIiwiYXVkIjoidW5kZWZpbmVkX2RlZmF1bHQiLCJpYXQiOjE3OTAxNjk0NTV9.7i8qqGsNYbbkX7JFYb7MSzGlMmybpYPmv5_GRIZlyc8";


let state = Flight.initial();

try {

    /* =====================================================
       CESIUM VIEWER
       ===================================================== */

    const viewer = new Cesium.Viewer('globe', {

        baseLayer: false,
        baseLayerPicker: false,
        geocoder: false,
        animation: false,
        timeline: false,
        homeButton: false,
        sceneModePicker: false,
        navigationHelpButton: false,
        fullscreenButton: false,
        infoBox: false,
        selectionIndicator: false,

        // Real-world 3D terrain
        terrain: Cesium.Terrain.fromWorldTerrain()

    });


    /* =====================================================
       REAL WORLD IMAGERY
       ===================================================== */

    const imageryProvider =
        await Cesium.createWorldImageryAsync();

    viewer.imageryLayers.addImageryProvider(imageryProvider);


    /* =====================================================
       REAL 3D BUILDINGS
       ===================================================== */

    const buildingsTileset =
        await Cesium.createOsmBuildingsAsync();

    viewer.scene.primitives.add(buildingsTileset);


    /* =====================================================
       AIRCRAFT POSITION
       ===================================================== */

    const position = () =>
        Cesium.Cartesian3.fromDegrees(
            state.lon,
            state.lat,
            state.height
        );


    /* =====================================================
       SIMULATED AIRCRAFT
       ===================================================== */

    const plane = viewer.entities.add({

        position: new Cesium.CallbackProperty(
            position,
            false
        ),

        point: {
            pixelSize: 16,
            color: Cesium.Color.GOLD,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2
        },

        label: {
            text: 'SIMULATED FLIGHT',
            font: '14px sans-serif',
            pixelOffset: new Cesium.Cartesian2(0, -28),
            showBackground: true
        }

    });


    /* =====================================================
       READING-AREA STARTING POINT
       ===================================================== */

    viewer.entities.add({

        position: Cesium.Cartesian3.fromDegrees(
            -75.93,
            40.33,
            0
        ),

        point: {
            pixelSize: 10,
            color: Cesium.Color.WHITE
        },

        label: {
            text: 'Reading-area teaching origin',
            font: '14px sans-serif',
            pixelOffset: new Cesium.Cartesian2(0, 22),
            showBackground: true
        }

    });


    /* =====================================================
       UI
       ===================================================== */

    function paint() {

        $('message').textContent =
            state.paused
                ? 'Paused — ready to inspect'
                : (
                    state.speed === Flight.SLOW_TOUR_SPEED
                        ? 'Slow Tour — simulated movement at 20 m/s'
                        : 'Flying — simulated movement'
                );

        $('readout').textContent =
            `Heading ${state.heading.toFixed(0)}° · ` +
            `Longitude ${state.lon.toFixed(5)} · ` +
            `Latitude ${state.lat.toFixed(5)} · ` +
            `Height ${state.height.toFixed(0)} m · ` +
            `Speed ${state.speed.toFixed(0)} m/s`;

    }


    /* =====================================================
       CAMERA FOLLOW
       ===================================================== */

    function follow() {

        viewer.camera.lookAt(

            position(),

            new Cesium.HeadingPitchRange(

                Cesium.Math.toRadians(
                    state.heading
                ),

                Cesium.Math.toRadians(-30),

                2500

            )

        );

    }


    /* =====================================================
       FLIGHT CONTROLS
       ===================================================== */

    $('fly').onclick = () => {

        state.paused = false;

        paint();

    };


    $('pause').onclick = () => {

        state.paused = true;

        paint();

    };


    $('slow').onclick = () => {

        state.speed = Flight.SLOW_TOUR_SPEED;

        $('speed').value = state.speed;

        state.paused = false;

        paint();

    };


    $('left').onclick = () => {

        state.heading =
            Flight.wrap(
                state.heading - 10
            );

        paint();

        follow();

    };


    $('right').onclick = () => {

        state.heading =
            Flight.wrap(
                state.heading + 10
            );

        paint();

        follow();

    };


    $('reset').onclick = () => {

        state = Flight.initial();

        $('speed').value = state.speed;

        $('height').value = state.height;

        paint();

        follow();

    };


    /* =====================================================
       SPEED + HEIGHT CONTROLS
       ===================================================== */

    for (
        const [id, min, max]
        of [
            ['speed', 0, 250],
            ['height', 50, 5000]
        ]
    ) {

        $(id).onchange = () => {

            const n = Number(
                $(id).value
            );

            if (Number.isFinite(n)) {

                state[id] =
                    Flight.clamp(
                        n,
                        min,
                        max
                    );

            }

            $(id).value = state[id];

            paint();

            follow();

        };

    }


    /* =====================================================
       PAUSE WHEN TAB IS HIDDEN
       ===================================================== */

    document.addEventListener(
        'visibilitychange',
        () => {

            if (document.hidden) {

                state.paused = true;

                paint();

            }

        }
    );


    /* =====================================================
       FLIGHT SIMULATION LOOP
       ===================================================== */

    let last = performance.now();

    let lastPaint = 0;


    viewer.scene.preRender.addEventListener(() => {

        const now = performance.now();

        const dt =
            Math.min(
                (now - last) / 1000,
                0.1
            );

        last = now;


        state =
            Flight.step(
                state,
                dt
            );


        if (!state.paused) {

            follow();

        }


        if (now - lastPaint > 150) {

            paint();

            lastPaint = now;

        }

    });


    /* =====================================================
       START SIMULATOR
       ===================================================== */

    paint();

    follow();


}
catch (error) {

    $('message').textContent =
        'The globe could not start. Check your Cesium token, WebGL support, and browser console.';

    console.error(error);

}

})();
