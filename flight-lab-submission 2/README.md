# AI 101 — CesiumJS Flight Lab

This is an original teaching starter: a steerable moving point, not a realistic aircraft simulator.

## Run
Upload all files in this folder to the root of a public GitHub repository. In Settings → Pages choose Deploy from a branch, main, /(root). Open the site URL after deployment. Alternatively serve this folder with your editor's local web server. If Python is already installed: `python -m http.server 8000`, then open http://localhost:8000.

Internet and WebGL are required. CesiumJS 1.145 and its matching CSS load from Cesium's CDN. No build step, Node installation, ion token, imagery service, or paid data is needed. Keep Cesium's on-screen credits visible.

## Controls
Fly starts motion; Pause stops it. Left/Right change heading by 10 degrees. Speed is 0–250 meters/second; height is 50–5000 meters above the model ellipsoid. Height changes instantly: this starter does not simulate climbing. Reset restores the paused initial state. Switching to another browser tab pauses the app. On returning, press Fly again. The camera follows while flying.

## Test
Open tests.html on the same site. Also perform the six manual checks on Canvas page 05. Optional developer command: `node -e "require('./flight-core.js');require('./tests.js')"`.

## Model and geography
Uses spherical destination-point math with Earth radius 6,371,000 m, displayed on Cesium's ellipsoid globe. This approximation is for learning. Heading remains constant between clicks. Frame dt is capped at 0.1 s to prevent large jumps after stalls, so low frame rates can slow simulated time. There is no lift, drag, bank, pitch, collision, real terrain, flight data, or navigation accuracy. The marker is a point, not an aircraft model. Grid lines provide visual reference, not roads.
The approximate origin (-75.93, 40.33) is a Reading-area classroom reference, not a verified Alvernia campus location. Validate real location claims separately.

## Student additions — complete before submission

Pitch: I want to make a flight tour for computer science students at Alvernia University who are looking for local internships. To make sure the companies used for this tour actually exist and really do offer internships for CS students I'll be looking through each company and doing through research on them.


Feature changed: Added a "Slow Tour (20 m/s)" button that sets speed to 20 m/s, starts flying, and changes the status label to "Slow Tour — simulated movement at 20 m/s". Speed constant lives in flight-core.js (SLOW_TOUR_SPEED); one extra automated check added in tests.js (8 checks total).

AI assistance accepted/rejected: 

Accepted:

* Slow tour button
* First 5 Checks in test_log
* Pitch Help
* accepted using CesiumJS to create my flight simulator.
* accepted using a realistic 3D Earth/globe instead of a simple blue background.
* accepted using real-world imagery from Cesium World Imagery.
* accepted using real-world terrain through Cesium.
* accepted adding 3D buildings using Cesium's OpenStreetMap buildings.
* accepted using my Cesium Ion token to access the Cesium features.
* accepted creating a yellow aircraft marker to make the aircraft easy to see on the map.
* accepted making the aircraft move slowly so the flight can be clearly followed.
* accepted having the aircraft visit the internship locations in order.
* accepted using six internship locations: Penske Truck Leasing, Hubbell, Fidelity Technologies, EnerSys Global Technology Center, Materion, and East Penn Manufacturing.
* accepted adding company markers to show where each internship location is.
* accepted adding company names next to the markers so the locations are easy to identify.
* accepted adding clickable company information boxes with information about each company and internship opportunity.
* accepted making the company information box match my Flight Controls panel with the futuristic blue design.
* accepted adding flight controls for Fly, Pause, Slow Tour, and Reset.
* accepted adding Left 10° and Right 10° controls for changing the aircraft's heading.
* accepted adding a speed slider so I can control the aircraft's speed.
* accepted adding a height slider so I can control the aircraft's altitude.
* accepted adding telemetry showing latitude, longitude, altitude, and heading.
* accepted having the aircraft stop at each company before continuing to the next location.
* accepted having the camera show each company when the aircraft arrives.
* accepted allowing the user to manually zoom and explore the map.
* accepted using a futuristic PlayStation-inspired blue interface for the overall design.
* accepted using dark glass-style panels, blue borders, and glowing effects for the interface.
* accepted using an async function to properly load Cesium's imagery and 3D building resources.
* accepted fixing the missing } in moveAircraft() to solve the JavaScript syntax error.
* accepted keeping the existing working parts of my project instead of unnecessarily rewriting the entire application.
* accepted regenerating my Cesium token after it was exposed, to keep my project secure.

  
Rejected:

* 7 additional test
* rejected Freddie Mac as one of the internship stops.
* rejected World Wide Technology as one of the internship stops.
* rejected numbered company markers because I wanted the map to look cleaner.
* rejected the blue-only globe because I wanted a realistic Earth with real imagery.
* rejected creating a completely new building design because I wanted the buildings to stay accurate to the real ones.
* rejected changing globe to cesiumContainer because my HTML uses globe.
* rejected removing all imagery layers because it caused my globe/imagery to disappear.
* rejected using top-level await because it caused a JavaScript error.
*  rejected putting ```javascript at the top of my app.js file because that is Markdown formatting, not part of the JavaScript code.
* rejected changing my entire app.js unnecessarily because I did not want to risk breaking the parts that were already working.
* rejected having the aircraft skip stops because I wanted it to visit every internship location in order.
* rejected having the aircraft move too quickly because I wanted to clearly see it traveling between locations.
* rejected having the camera completely control my view because I wanted to manually zoom in and look at the buildings.
* rejected removing the telemetry because I wanted to see the aircraft's latitude, longitude, altitude, and heading.
* rejected removing my original flight controls because I wanted to keep Fly, Pause, Slow Tour, Reset, Left 10°, and Right 10°.
* rejected having the Left and Right buttons do nothing because I wanted them to actually change the aircraft's heading.
* rejected using the Left and Right buttons to completely change the internship route because I wanted the aircraft to continue following the planned stops.
* rejected the basic Cesium InfoBox design because I wanted the company information box to match the futuristic Flight Controls panel.
* rejected having duplicate InfoBox CSS because I wanted one clean styling section.
______________________________________________________________________________________________________

Ai Excerpts:

Excerpt 1.)  tests.js has 7 new tests next to your original 7. They cover zero distance, 1° of latitude being about 111.2 km, due-north and due-east bearings, picking the closer site, an empty list, and flying toward a site shrinking the distance.

Excerpt 2.) Here's a tightened version of your pitch, built around the six-company tour. 

Audience: Computer science students at Alvernia University who are looking for local internships.

Purpose: Searching for internships usually means jumping between company websites and maps with no real sense of where anything is. The Internship Flight Tour turns that search into a simulated flight over the Reading area. The marker visits six local companies that offer internships for computer science students. At each stop, students see the company name and its distance and direction from their position, so they can compare locations at a glance. The flight is simulated and uses no real aircraft or commute data. It is a tool for exploring and comparing places, not for navigation.

What I changed:

Named the audience and problem first. A pitch lands better when it opens with who it's for and what's frustrating about the current way of doing things.
Gave the app a name. "Internship Flight Tour" says what it does.
Made the tour concrete. "Six Reading-area companies" is specific and easy to check, which graders like.
Added the "simulated, not for navigation" line. It matches the starter's own limitations and keeps you from overclaiming.
Dropped "simulated flight data." Your app generates movement. It doesn't use flight data, and the old phrase could be read as claiming real data.

Excerpt 3.) I started over from your original starter and added only the Slow Tour feature, so the nearest-site changes from before are gone. All 8 checks pass in Node. I haven't opened it in a browser, so run it there before you screenshot anything.

**What changed, file by file**
1. **flight-core.js:** added `SLOW_TOUR_SPEED = 20` and exported it, so the constant lives there as you asked.
2. **index.html:** added a **Slow Tour (20 m/s)** button next to Reset.
3. **app.js:** clicking the button does three things:
   - sets speed to `Flight.SLOW_TOUR_SPEED` and updates the speed box
   - starts flying
   - shows the status "Slow Tour — simulated movement at 20 m/s"
4. **tests.js:** added one check (now 8 total) that the speed is 20 and that one second of flying north moves about 20 meters.

**How the label behaves**
- The Slow Tour label shows only while flying at 20 m/s after the button was clicked.
- If you change the speed or press Reset, the label goes back to "Flying — simulated movement."
- Pausing still shows "Paused — ready to inspect."

**Checks for your evidence**
- In `tests.html`, confirm all 8 checks show PASS and screenshot it.
- On the main page, click Slow Tour and confirm the speed box shows 20, the marker moves, and the label matches the wording exactly. Screenshot that too.

I didn't touch the README, so its "Student additions" section is still blank. Do you want me to draft it for this feature, or work on the pitch wording next?
______________________________________________________________________________________________________

# Photos for test log evidence can be found in the evidence folder

Partner reproduction feedback: My partner for this project was Makayla. She took a look at my application and tested it out. She really liked the design and said that it reminded her of the Santa Tracker. She also said that she didn’t see anything that I needed to improve, which was good to hear because I felt like the application was coming together well.

Reflection:  

For this project, I contributed to the design and development of my flight simulator. I wanted the application to connect students with internship opportunities around the Reading area while making the experience interactive. I worked on the flight controls, company locations, telemetry, and the overall futuristic blue design. My partner, Makayla, tested the application and said she liked the design and that it reminded her of the Santa Tracker.

One problem I worked through involved `dt`, which controls how the aircraft's movement connects to real time. I struggled to make the change myself, so I used AI to create a version of the folder without `dt`. When I ran `tests.html`, the "Duration consistency" test failed. This helped me understand that without `dt`, the aircraft's speed and distance could change depending on the computer. After restoring it, all 8 tests passed. I also kept the AI's suggestion for a Slow Tour button because it makes the distances around Reading easier to see.

One limitation I noticed in the original flight simulator was that the height could only be set between 50 and 5000 meters. I found it strange that I could not go lower or higher. Overall, this project taught me that AI can be a useful tool for building and understanding a project, but I still need to test the changes and make sure they work myself. By running the tests and checking the results, I became more confident in troubleshooting and improving my application.

Geographic/API sources: CesiumJS 1.145 (cesium.com/learn). Origin (-75.93, 40.33) is an approximate Reading-area reference, not a verified campus location. : For my geographic/API source, I used CesiumJS 1.145 from Cesium's documentation at cesium.com/learn. The starting point of (-75.93, 40.33) is an approximate Reading-area reference and is not meant to represent a verified campus location. I checked the geographic locations by comparing the coordinates used in the simulator with the intended Reading-area locations of the companies.


Known limitations: One limitation of my simulator is that it does not use real aircraft physics. The height also changes instantly instead of gradually. The frame `dt` is capped at 0.1 seconds to help keep the movement consistent, and the Slow Tour button is only a speed preset rather than a separate flight mode. Another limitation I noticed is that the original height setting was limited to 50–5000 meters.

## References
https://cesium.com/learn/cesiumjs-learn/
https://cesium.com/learn/cesiumjs/ref-doc/Viewer.html
https://cesium.com/learn/cesiumjs/ref-doc/Cartesian3.html
https://cesium.com/learn/cesiumjs/ref-doc/GridImageryProvider.html

CesiumJS is an external dependency with its own license and notices. It is not bundled in this resource ZIP.
