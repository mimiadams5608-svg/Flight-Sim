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

Rejected:

* 7 additional test
* 

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

# Photos for test log evidence can be found in the evidence folder

Partner reproduction feedback: TODO (partner name, what they followed, one improvement you made)

Geographic/API sources: CesiumJS 1.145 (cesium.com/learn). Origin (-75.93, 40.33) is an approximate Reading-area reference, not a verified campus location. TODO: how you checked it.
Known limitations: No real aircraft physics; height changes instantly; frame dt capped at 0.1 s; Slow Tour is only a speed preset. TODO add any others you observe.

## References
https://cesium.com/learn/cesiumjs-learn/
https://cesium.com/learn/cesiumjs/ref-doc/Viewer.html
https://cesium.com/learn/cesiumjs/ref-doc/Cartesian3.html
https://cesium.com/learn/cesiumjs/ref-doc/GridImageryProvider.html

CesiumJS is an external dependency with its own license and notices. It is not bundled in this resource ZIP.
