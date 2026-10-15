/* =====================================================================
   PORTFOLIO CONTENT
   This is the only file you need to edit to add or change projects.
   The page builds itself from the lists below.
   =====================================================================

   HOW TO ADD A PROJECT
   1. Open the "images" folder on GitHub, click Add file > Upload files
      and drag in your photos/videos. Keep everything directly in
      "images" (no sub-folders) and start each file name with the
      project, e.g. images/pmsm-results.png.
   2. Copy the template below, paste it into the PROJECTS list
      (in the right year), and fill it in.
   3. Commit. GitHub Pages updates the live site in about a minute
      (press Ctrl + F5 on the site to skip your browser's cache).

   TEMPLATE  (everything except title and year is optional)

    {
      title: "Project name",
      year: 2,                              // 1, 2 or 3 = year of study
      date: "Semester 1",                   // shown in the title block
      type: "Group design project",         // e.g. Individual project, Competition
      status: "",                           // "Ongoing" shows an ongoing tag
      logo: "",                             // small round badge, e.g. "images/swanseds-logo.png"
      description: `One or two short paragraphs. Leave a blank line
        between paragraphs. You can use <strong>bold</strong> here.`,
      stats: [                              // key numbers / results
        { value: "600 m", label: "Target apogee" },
      ],
      highlights: [                         // bullet points
        "What you did or achieved",
      ],
      tools: ["MATLAB", "Simulink", "Excel"],   // software used (becomes filter buttons)
      media: [                              // the first item is shown first
        { src: "images/my-cad.png", caption: "Final assembly in Fusion 360" },
        { src: "images/my-photo.jpg", caption: "Prototype on test" },
        { src: "images/my-video.mp4", caption: "Test run", poster: "images/my-video-cover.jpg" },
        { src: "images/my-part.glb", caption: "3D model", poster: "images/my-part.jpg" },
        { src: "https://www.youtube.com/watch?v=VIDEO_ID", caption: "A YouTube video works too" },
      ],
      links: [
        { label: "Read the report (PDF)", url: "files/my-report.pdf" },
      ],
    },

   TIPS
   - File names must match EXACTLY, including capitals and extension:
     "Rocket.JPG" is not the same file as "rocket.jpg". Watch out for
     Windows hiding extensions: "video.mp4" can really be "video.mp4.mp4".
   - Add  ?edit  to the end of your site address to see which files
     are missing (e.g. https://tommaley.github.io/Thomas-Maley.github.io/?edit).
     Visitors never see this.
   - Pictures are never cropped: the page fits them into neat rows at
     their own shape, so tall photos and wide plots both work. The first
     item in the list comes first. Click any picture to see it full size.
   - caption is optional, but a short one helps recruiters.
   - Videos should be .mp4 (not .mov). Keep each file under 25 MB (GitHub's
     limit for browser uploads), or upload to YouTube and paste the link.
   - 3D models must be .glb files (export OBJ/STEP from your CAD, then
     convert to .glb with a free tool such as Blender). Keep them under
     about 5 MB. orbit: "35deg 65deg auto" sets the starting camera angle.
   - Every project needs a comma after its closing } brace.
   ===================================================================== */


/* ---------- Your details (leave "" to hide a button) ---------- */
const SITE = {
  email: "",                                   // e.g. "thomas.maley@example.com"
  linkedin: "",                                // e.g. "https://www.linkedin.com/in/your-name"
  github: "https://github.com/TomMaley",
  cv: "",                                      // e.g. "files/Thomas-Maley-CV.pdf"
  newestFirst: false,                          // false = Year 1 first (chronological)
};


/* ---------- Year labels shown on the timeline ---------- */
const YEARS = {
  1: { label: "Year 1", dates: "2024–25" },
  2: { label: "Year 2", dates: "2025–26" },
  3: { label: "Year 3", dates: "2026–27" },
};


/* ---------- Projects (order within each year = order shown) ---------- */
const PROJECTS = [

  /* ===================== YEAR 1 ===================== */

  {
    title: "Swansea Rocketry Challenge: Weatherman",
    year: 1,
    type: "Team of 5, SwanSEDS competition",
    logo: "images/swanseds-logo.png",
    description: `Our five-person team designed, built and flew <strong>Weatherman</strong>, a
      high-power rocket for the 2024/25 Swansea Rocketry Challenge. The brief was to fly as close
      as possible to a 600 m apogee on an Aerotech G74 motor, carry an Arduino Nano payload and
      recover safely under parachute.

      The payload logged temperature, humidity, pressure, altitude and GPS position to a memory
      card, so wind speed could be worked out from the rocket's drift. My role was the concept
      sketches and the bill of materials and budget.`,
    stats: [
      { value: "600 m", label: "Target apogee" },
      { value: "1.5–1.9 cal", label: "Stability margin" },
      { value: "5.7 m/s", label: "Landing speed (limit 8 m/s)" },
      { value: "£140", label: "Build budget" },
    ],
    highlights: [
      "Power-series nosecone, 3D-printed in PLA, with a threaded shoulder that locks the payload board in place",
      "24-inch parachute deployed by the motor's ejection charge 9 s after burnout",
      "Simulated up to 550 m of drift in a 15 mph wind to size the recovery area",
    ],
    tools: ["OpenRocket", "SolidWorks", "Excel"],
    media: [
      { src: "images/src-rocket-cad.jpg", caption: "Full rocket assembly in SolidWorks" },
      { src: "images/src-launch.mp4", caption: "Launch day", poster: "images/src-launch-poster.jpg" },
      { src: "images/src-rockets.jpg", caption: "SRC rockets ready for launch day" },
      { src: "images/src-launch-rail.jpg", caption: "Loading a rocket onto the launch rail" },
      { src: "images/src-payload-sketches.jpg", caption: "Payload board sketches, front and back" },
      { src: "images/src-openrocket-stability.png", caption: "OpenRocket: stability margin through the flight" },
      { src: "images/src-openrocket-flight-path.png", caption: "OpenRocket: flight path and drift in a 15 mph wind" },
      { src: "images/src-team.jpg", caption: "SwanSEDS members at the launch site" },
    ],
  },

  {
    title: "IMechE Design Challenge: Automated EV Charging",
    year: 1,
    type: "Team of 6, IMechE competition",
    description: `The 2025 IMechE Design Challenge asked first-year teams for a self-contained
      device that drives to a wall target, "plugs in" to simulate charging an electric vehicle,
      then returns to where it started, all on its own and within three minutes.

      Our device runs on a 1:48 geared DC motor, uses a gear-train odometer to measure distance
      and stop on its start point, and a relay-and-capacitor timing circuit to hold the "charge"
      for 10–15 seconds. <strong>I designed the plug mechanism:</strong> a spring-loaded plug whose
      second contact switch trips when it meets the target, reversing the motor to send the device
      home.`,
    stats: [
      { value: "1,236 g", label: "Total mass" },
      { value: "495 cm", label: "Max travel (track 400 cm)" },
      { value: "10–15 s", label: "Simulated charge" },
    ],
    tools: ["Fusion 360"],
    media: [
      { src: "images/Design 1 Final Assembly Render.PNG", caption: "Design 1: rendered final assembly in Fusion 360" },
      { src: "images/Design 1 Motion test.mp4", caption: "Motion test on the track", poster: "images/Design 1 Motion test poster.jpg" },
      { src: "images/Design 1 Dissassemble Final product.jpg", caption: "The built device with its covers off: gear train, motor and circuit" },
      { src: "images/imeche-gear-train.png", caption: "Gear-train odometer that measures the distance travelled" },
      { src: "images/imeche-concept-matrix.png", caption: "Scoring the concept options for each part of the device" },
      { src: "images/imeche-track.png", caption: "The challenge track, with its vertical and horizontal targets" },
    ],
  },

  /* ===================== YEAR 2 ===================== */

  {
    title: "Helical Rocket Channel Development",
    year: 2,
    type: "SwanSEDS society project",
    logo: "images/swanseds-logo.png",
    description: `Designed and evaluated regenerative helical cooling channels for a liquid rocket
      engine. Analysed coolant flow dynamics and heat transfer rates to optimise thermal management
      and maintain structural integrity during combustion.`,
    tools: ["SolidWorks"],   // ← add any other software you used, e.g. "Fusion 360", "Excel"
    media: [
      { src: "images/Liquid Engine Full Assembly.jpg", caption: "Full engine assembly in SolidWorks" },
      { src: "images/Helical rocket channels stripped view .png", caption: "Stripped view showing the helical cooling channels around the chamber and nozzle" },
      { src: "images/Liquid Engine Sectional View.jpg", caption: "Section through the injector, combustion chamber and nozzle" },
    ],
  },

  {
    title: "Direct Torque Control of a PMSM",
    year: 2,
    type: "Individual coursework",
    description: `Modelled and simulated Direct Torque Control (DTC) of a permanent magnet
      synchronous motor in MATLAB and Simulink, alongside a power analysis of DC and AC RLC
      circuits that checked hand calculations against Simscape measurements.

      Getting the drive to behave meant tracking down why the simulation misbehaved, which taught
      me as much as the results did.`,
    stats: [
      { value: "600 rpm", label: "Held through a 1.5 Nm load step" },
      { value: "< 0.5 %", label: "DC model vs. calculation" },
    ],
    highlights: [
      "Traced high-frequency torque oscillation to a reversed phase sequence between the inverter and the measurement inputs, and fixed the wiring to restore control",
      "Found a per-unit vs. SI scaling mismatch that pushed the flux estimate above 40 Wb and stopped the inverter switching",
      "Showed that new motor parameters (R<sub>s</sub> = 2.6 Ω, J = 0.0024 kg·m²) caused pole slipping unless the controller's internal observer was updated to match",
    ],
    tools: ["MATLAB", "Simulink"],
    media: [
      { src: "images/pmsm-dtc-simulink-model.png", caption: "Simulink model of the DTC drive" },
      { src: "images/pmsm-speed-torque-response.png", caption: "Speed (left) and torque (right) responding to a 1.5 Nm load step at 0.2 s" },
      { src: "images/pmsm-dc-circuit-model.png", caption: "DC circuit model used to check the hand calculations" },
    ],
  },

  {
    title: "Wheelchair Clamp Base Attachment",
    year: 2,
    type: "Team of 4, group design project",
    description: `Our team designed an adjustable arm that holds a tablet or laptop for a school-age
      wheelchair user with cerebral palsy, fitted to an Invacare Action 3NG SP.

      <strong>I was responsible for the base:</strong> a two-point clamp that carries the
      cantilevered arm without marking or crushing the wheelchair's thin-walled 26.65 mm frame
      tubing, and that a carer can remove in under a minute.`,
    stats: [
      { value: "25 Nm", label: "Bending moment carried" },
      { value: "≈ 4", label: "Factor of safety (target > 2)" },
      { value: "+40 %", label: "Peak load for < 15 g added" },
    ],
    highlights: [
      "Scored three clamp concepts against a U-bolt datum in a weighted decision matrix, led by user safety and frame protection",
      "Ran static stress FEA in Fusion 360 and fed the results into an FMEA that drove the design changes",
      "Added a 1.5 mm rubber friction shim so the clamp resists rotation with far lower bolt torque",
      "Replaced threads tapped into the print with captured steel nuts so they can't strip",
      "Chose PETG over PLA and ABS using CES EduPack strength, cost and eco-audit data",
    ],
    tools: ["Fusion 360", "CES EduPack"],
    media: [
      { src: "images/Wheel chair CAD full assembly.png", caption: "Full assembly in Fusion 360: clamp base, arm and device platform" },
      { src: "images/Wheelchair Design in use.jpeg", caption: "The prototype fitted to a wheelchair and in use" },
      { src: "images/wheelchair-fea-stress.jpg", caption: "Von Mises stress in the base assembly under peak load" },
      { src: "images/wheelchair-base-assembly-drawing.png", caption: "General arrangement drawing of the base assembly" },
    ],
  },

  /* ===================== YEAR 3 ===================== */

  {
    title: "High-Temperature CO₂ Heat Pump",
    year: 3,
    type: "Individual research project",
    status: "Ongoing",
    description: `Individual research project supervised by Dr R. S. Ransing, focused on ejector
      design and performance analysis for a high-temperature CO₂ heat pump system.`,
    tools: [],   // ← e.g. "MATLAB", "Excel"
    media: [
      // ← no pictures yet: add lines like { src: "images/name.jpg", caption: "..." }
    ],
  },

  {
    title: "Liquid Rocket Engine Development",
    year: 3,
    type: "SwanSEDS society project",
    status: "Starting this year",
    logo: "images/swanseds-logo.png",
    description: `This year I'm continuing on the Swansea University Rocketry Society's liquid
      rocket engine, building on my Year 2 cooling-channel work. The plan is conjugate heat
      transfer modelling and ANSYS Fluent simulations of the nozzle's thermal performance,
      alongside Fusion 360 component modelling.`,
    tools: [],   // ← add software here once you've used it on this project
    media: [
      // ← no pictures yet: add lines like { src: "images/name.jpg", caption: "..." }
    ],
  },

  {
    title: "In-Pipe Micro-Hydroelectric Turbine",
    year: 3,
    type: "",    // ← e.g. "Group design project"
    description: `Investigated fluid dynamics and power transmission concepts for generating energy
      inside municipal water pipes, featuring a planetary gear step-up system and a direct current
      generator.`,
    tools: [],   // ← add the software you used
    media: [
      // ← no pictures yet: add lines like { src: "images/name.jpg", caption: "..." }
    ],
  },

];
