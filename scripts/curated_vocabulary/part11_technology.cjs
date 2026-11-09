const fs = require('fs');

const technology = [
  {
    word: 'Telescope',
    subtle: [
      { hint: 'Aperture', rationale: 'Diameter of primary mirror collecting faint starry photons.' },
      { hint: 'Galileo', rationale: 'Pioneering Italian scientist discovering moons of Jupiter.' },
      { hint: 'Eyepiece', rationale: 'Interchangeable cylinder through which astronomer peers.' }
    ],
    balanced: [
      { hint: 'Observatory', rationale: 'Mountaintop dome housing massive scientific instruments.' },
      { hint: 'Lenses', rationale: 'Curved optical glass focusing distant starlight.' },
      { hint: 'Magnify', rationale: 'Enlarging distant planets and lunar craters for view.' }
    ],
    easy: [
      { hint: 'Stars', rationale: 'Celestial objects brought into sharp visual focus.' },
      { hint: 'Space', rationale: 'Cosmic void surveyed beyond Earth atmosphere.' },
      { hint: 'Moon', rationale: 'Cratered satellite scrutinized in nighttime sky.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Optical instrument magnifying stars, moons, and distant galaxies.' }
  },
  {
    word: 'Gravity',
    subtle: [
      { hint: 'Orbits', rationale: 'Curved paths planets trace around their parent stars.' },
      { hint: 'Tides', rationale: 'Ocean water bulges pulled by lunar gravitational attraction.' },
      { hint: 'Mass', rationale: 'Quantity of matter generating gravitational curvature.' }
    ],
    balanced: [
      { hint: 'Newton', rationale: 'Physicist who formulated universal attraction laws.' },
      { hint: 'Falling', rationale: 'Downward motion of objects dropped towards center of Earth.' },
      { hint: 'Weight', rationale: 'Force measured by scale in gravitational field.' }
    ],
    easy: [
      { hint: 'Pull', rationale: 'Universal attractive force drawing matter together.' },
      { hint: 'Earth', rationale: 'Planetary body keeping feet planted on ground.' },
      { hint: 'Down', rationale: 'Direction in which dropped objects accelerate.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Universal fundamental force pulling objects toward Earth center.' }
  },
  {
    word: 'Smartphone',
    subtle: [
      { hint: 'Corning', rationale: 'Glass manufacturer producing chemically strengthened screens.' },
      { hint: 'Haptic', rationale: 'Vibrational feedback simulating mechanical button clicks.' },
      { hint: 'SIM', rationale: 'Subscriber identity module card connecting to cellular networks.' }
    ],
    balanced: [
      { hint: 'Touchscreen', rationale: 'Glass display responding to finger swipes and taps.' },
      { hint: 'Apps', rationale: 'Software applications installed from mobile stores.' },
      { hint: 'Battery', rationale: 'Lithium-ion cell recharged daily via cord or pad.' }
    ],
    easy: [
      { hint: 'Call', rationale: 'Voice communication between dialed numbers.' },
      { hint: 'Pocket', rationale: 'Pants compartment where mobile device is kept.' },
      { hint: 'Screen', rationale: 'Luminous glass surface displaying messages.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Ubiquitous touchscreen mobile device carrying apps and internet.' }
  },
  {
    word: 'Drone',
    subtle: [
      { hint: 'Gimbal', rationale: 'Motorized pivoted support keeping onboard camera steady.' },
      { hint: 'Telemetry', rationale: 'Live radio feed reporting altitude, GPS, and battery.' },
      { hint: 'Hover', rationale: 'Stationary airborne position held via counter-rotating blades.' }
    ],
    balanced: [
      { hint: 'Quadcopter', rationale: 'Four-armed multirotor unmanned aerial platform.' },
      { hint: 'Propellers', rationale: 'Spinning plastic blades generating aerodynamic lift.' },
      { hint: 'Remote', rationale: 'Handheld controller with twin joysticks directing flight.' }
    ],
    easy: [
      { hint: 'Fly', rationale: 'Airborne flight across open skies.' },
      { hint: 'Camera', rationale: 'Optical sensor capturing high aerial panoramic video.' },
      { hint: 'Pilot', rationale: 'Ground operator steering flight with handheld sticks.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Unmanned aerial quadcopter flown via remote control.' }
  },
  {
    word: 'Virtual Reality',
    subtle: [
      { hint: 'Latency', rationale: 'Sub-millisecond delay between head movement and display.' },
      { hint: 'Gyroscopes', rationale: 'Motion sensors tracking six degrees of head rotation.' },
      { hint: 'Immersion', rationale: 'Psychological sensation of being present inside digital space.' }
    ],
    balanced: [
      { hint: 'Headset', rationale: 'Goggles strapped to face with stereoscopic lenses.' },
      { hint: 'Avatar', rationale: 'Digital representation representing user inside world.' },
      { hint: 'Controllers', rationale: 'Tracked handgrips mirroring real hand motions.' }
    ],
    easy: [
      { hint: 'Goggles', rationale: 'Enclosed display worn over eyes.' },
      { hint: 'Simulation', rationale: 'Computer-generated three-dimensional environment.' },
      { hint: 'Gaming', rationale: 'Entertainment medium experiencing interactive worlds.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Immersive stereoscopic headset gaming and simulation tech.' }
  },
  {
    word: 'Smartwatch',
    subtle: [
      { hint: 'OLED', rationale: 'Energy-efficient high-contrast miniature color display.' },
      { hint: 'Haptic', rationale: 'Gentle wrist vibration tapping user on incoming alerts.' },
      { hint: 'Pedometer', rationale: 'Sensor counting daily steps toward fitness targets.' }
    ],
    balanced: [
      { hint: 'Wrist', rationale: 'Limb worn upon strapped by silicone or leather band.' },
      { hint: 'Pulse', rationale: 'Optical green LEDs measuring heart rate on skin.' },
      { hint: 'Fitness', rationale: 'Activity tracking monitoring workout calories and laps.' }
    ],
    easy: [
      { hint: 'Time', rationale: 'Digital clock face showing hours and minutes.' },
      { hint: 'Strap', rationale: 'Buckled band securing timepiece to wrist.' },
      { hint: 'Notifications', rationale: 'Alerts and text previews buzzing on wrist.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Wrist-worn smart device tracking pulse, steps, and time.' }
  },
  {
    word: '3D Printer',
    subtle: [
      { hint: 'G-code', rationale: 'Numerical control programming language commanding motors.' },
      { hint: 'Extruder', rationale: 'Heated motor assembly pushing plastic filament.' },
      { hint: 'Nozzle', rationale: 'Brass orifice extruding melted plastic at 200 degrees.' }
    ],
    balanced: [
      { hint: 'Filament', rationale: 'Spool of PLA plastic wound on plastic reel.' },
      { hint: 'Layers', rationale: 'Horizontal slices stacked atop each other to form model.' },
      { hint: 'Bed', rationale: 'Heated flat build platform receiving molten passes.' }
    ],
    easy: [
      { hint: 'Plastic', rationale: 'Thermoplastic material melted into physical items.' },
      { hint: 'Build', rationale: 'Fabricating physical three-dimensional objects from CAD.' },
      { hint: 'Fabricate', rationale: 'Additive fabrication creating items layer by layer.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Additive manufacturing machine laying melted plastic layers.' }
  },
  {
    word: 'Satellite',
    subtle: [
      { hint: 'Transponder', rationale: 'Communications payload receiving and relaying frequencies.' },
      { hint: 'Apogee', rationale: 'Highest orbital altitude point above Earth surface.' },
      { hint: 'Thrusters', rationale: 'Hydrazine jets maintaining station-keeping orientation.' }
    ],
    balanced: [
      { hint: 'Orbit', rationale: 'Continuous gravitational free-fall path circling Earth.' },
      { hint: 'Solar', rationale: 'Wings covered in photovoltaic cells providing power.' },
      { hint: 'Antenna', rationale: 'Dish beaming signals down to terrestrial ground stations.' }
    ],
    easy: [
      { hint: 'Space', rationale: 'Vacuum cosmic environment beyond atmosphere.' },
      { hint: 'Signals', rationale: 'Radio emissions providing GPS, weather, and television.' },
      { hint: 'Dish', rationale: 'Curved ground receiver pointed at orbital craft.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Orbital spacecraft relaying communications and weather data.' }
  },
  {
    word: 'Microchip',
    subtle: [
      { hint: 'Photolithography', rationale: 'Nanoscale optical etching method printing circuit gates.' },
      { hint: 'Cleanroom', rationale: 'Filtered sterile manufacturing facility with bunny suits.' },
      { hint: 'Wafer', rationale: 'Round sliced disc of pure monocrystalline silicon.' }
    ],
    balanced: [
      { hint: 'Silicon', rationale: 'Semiconductor mineral element forming semiconductor base.' },
      { hint: 'Transistors', rationale: 'Billions of nanoscale electronic switching gates.' },
      { hint: 'Circuit', rationale: 'Miniaturized pathways conducting electrical impulses.' }
    ],
    easy: [
      { hint: 'Tiny', rationale: 'Fingernail-sized piece of advanced electronics.' },
      { hint: 'Computer', rationale: 'Machine powered by internal silicon processor.' },
      { hint: 'Processor', rationale: 'Central computing unit crunching binary logic.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Silicon semiconductor wafer containing billions of transistors.' }
  },
  {
    word: 'Bluetooth',
    subtle: [
      { hint: 'Pairing', rationale: 'Handshake protocol exchanging cryptographic passkeys.' },
      { hint: 'Viking', rationale: 'Tenth-century Scandinavian king inspiring wireless name.' },
      { hint: 'Frequency', rationale: '2.4 GHz short-range radio hopping band.' }
    ],
    balanced: [
      { hint: 'Wireless', rationale: 'Cables eliminated by short-range radio transmission.' },
      { hint: 'Headphones', rationale: 'Audio listening accessories linked without cords.' },
      { hint: 'Radio', rationale: 'Electromagnetic wave medium carrying digital streams.' }
    ],
    easy: [
      { hint: 'Connect', rationale: 'Linking smartphone with speakers or car audio.' },
      { hint: 'Blue', rationale: 'Color of Nordic rune logo badge.' },
      { hint: 'Cordless', rationale: 'Freedom from physical connection cables.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Short-range wireless radio technology connecting accessories.' }
  },
  {
    word: 'Solar Panel',
    subtle: [
      { hint: 'Inverter', rationale: 'Electrical box converting DC current into household AC.' },
      { hint: 'Photovoltaic', rationale: 'Physical effect producing voltage when hit by photons.' },
      { hint: 'Monocrystalline', rationale: 'High-purity black silicon cell manufacturing type.' }
    ],
    balanced: [
      { hint: 'Sunlight', rationale: 'Solar radiant energy captured and converted.' },
      { hint: 'Rooftop', rationale: 'Sloped home roof surface tilted to maximize rays.' },
      { hint: 'Silicon', rationale: 'Semiconductor material absorbing light photons.' }
    ],
    easy: [
      { hint: 'Electricity', rationale: 'Clean power generated from sunlight.' },
      { hint: 'Renewable', rationale: 'Green sustainable energy source.' },
      { hint: 'Sun', rationale: 'Celestial star supplying free endless energy.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Photovoltaic grid on roofs converting sunlight into electricity.' }
  },
  {
    word: 'Robot',
    subtle: [
      { hint: 'Servo', rationale: 'Motor mechanism providing precise rotational control.' },
      { hint: 'Asimov', rationale: 'Sci-fi author who formulated the Three Laws of robotics.' },
      { hint: 'Actuator', rationale: 'Mechanical component converting signal into physical motion.' }
    ],
    balanced: [
      { hint: 'Automated', rationale: 'Self-operating machinery executing pre-set routines.' },
      { hint: 'Sensors', rationale: 'Electronic inputs detecting obstacles in environment.' },
      { hint: 'Steel', rationale: 'Rigid metallic chassis enclosing wires and motors.' }
    ],
    easy: [
      { hint: 'Mechanical', rationale: 'Artificial motorized physical machine.' },
      { hint: 'Metal', rationale: 'Chassis material of autonomous machines.' },
      { hint: 'Machine', rationale: 'Programmable electronic apparatus performing tasks.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Programmable mechanical machine performing automated tasks.' }
  },
  {
    word: 'Artificial Intelligence',
    subtle: [
      { hint: 'Weights', rationale: 'Mathematical parameters adjusted during network training.' },
      { hint: 'Turing', rationale: 'British mathematician proposing imitation game test.' },
      { hint: 'Inference', rationale: 'Execution of trained mathematical model on new data.' }
    ],
    balanced: [
      { hint: 'Neural', rationale: 'Biologically inspired multi-layer mathematical network.' },
      { hint: 'Algorithm', rationale: 'Structured set of rules processing data arrays.' },
      { hint: 'Machine', rationale: 'Computing hardware learning patterns from text.' }
    ],
    easy: [
      { hint: 'Smart', rationale: 'Synthetic reasoning rivaling human cognitive feats.' },
      { hint: 'Computer', rationale: 'Silicon hardware running complex models.' },
      { hint: 'Thinking', rationale: 'Simulated cognitive reasoning process.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Synthetic machine cognitive capability learning from data.' }
  },
  {
    word: 'Wi-Fi Router',
    subtle: [
      { hint: 'Bandwidth', rationale: 'Maximum data transfer rate measured in gigabits.' },
      { hint: 'Ethernet', rationale: 'Yellow LAN cable plugged into back ports.' },
      { hint: 'Gateway', rationale: 'Network node routing home packets to wider internet.' }
    ],
    balanced: [
      { hint: 'Antenna', rationale: 'Black plastic rods broadcasting wireless radio signals.' },
      { hint: 'Modem', rationale: 'Companion box converting cable signal for home.' },
      { hint: 'Broadband', rationale: 'High-speed telecommunication internet access.' }
    ],
    easy: [
      { hint: 'Internet', rationale: 'Global web connection distributed to rooms.' },
      { hint: 'Wireless', rationale: 'Elimination of network cables throughout house.' },
      { hint: 'Password', rationale: 'Security key entered on phones to connect.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Home wireless networking box broadcasting internet signals.' }
  },
  {
    word: 'Supercomputer',
    subtle: [
      { hint: 'Petaflops', rationale: 'Quadrillions of floating-point operations per second.' },
      { hint: 'Cryogenic', rationale: 'Specialized liquid cooling chilling racks of processors.' },
      { hint: 'Racks', rationale: 'Tall metal server cabinets filling warehouse floors.' }
    ],
    balanced: [
      { hint: 'Processors', rationale: 'Thousands of linked CPUs crunching massive datasets.' },
      { hint: 'Simulation', rationale: 'Modeling climate, quantum physics, and nuclear fusion.' },
      { hint: 'Powerful', rationale: 'Unmatched computational throughput exceeding normal PCs.' }
    ],
    easy: [
      { hint: 'Fastest', rationale: 'Title held on global TOP500 computing lists.' },
      { hint: 'Calculations', rationale: 'Massive numerical operations solved in seconds.' },
      { hint: 'Complex', rationale: 'Scientific problems beyond standard hardware.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Massive warehouse computing system calculating scientific simulations.' }
  },
  {
    word: 'Laser',
    subtle: [
      { hint: 'Coherent', rationale: 'Electromagnetic waves locked in identical phase and wavelength.' },
      { hint: 'Photons', rationale: 'Light particles emitted via stimulated emission.' },
      { hint: 'Cavity', rationale: 'Optical resonator bouncing beam between parallel mirrors.' }
    ],
    balanced: [
      { hint: 'Beam', rationale: 'Concentrated narrow column of monochromatic light.' },
      { hint: 'Red', rationale: 'Most common color of handheld pointers.' },
      { hint: 'Cutting', rationale: 'High-powered industrial beam slicing through sheet steel.' }
    ],
    easy: [
      { hint: 'Light', rationale: 'Electromagnetic radiation source.' },
      { hint: 'Pointer', rationale: 'Pen-sized classroom tool projecting dot on board.' },
      { hint: 'Precise', rationale: 'Pinpoint surgical and industrial targeting accuracy.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Coherent concentrated beam of monochromatic light.' }
  },
  {
    word: 'Hoverboard',
    subtle: [
      { hint: 'Gyroscopic', rationale: 'Internal orientation sensors leveling dual motorized footpads.' },
      { hint: 'Lithium', rationale: 'Rechargeable internal battery pack powering hub motors.' },
      { hint: 'Levitate', rationale: 'Sci-fi fantasy inspiration from Back to the Future.' }
    ],
    balanced: [
      { hint: 'Balance', rationale: 'Rider leaning forward or back to accelerate and brake.' },
      { hint: 'Wheels', rationale: 'Rubber tires mounted on opposite ends of footboard.' },
      { hint: 'Ride', rationale: 'Gliding along sidewalk standing upright on platform.' }
    ],
    easy: [
      { hint: 'Electric', rationale: 'Battery-powered personal mobility device.' },
      { hint: 'Feet', rationale: 'Body parts resting on pressure-sensitive pads.' },
      { hint: 'Sidewalk', rationale: 'Paved pedestrian path rolled upon.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Two-wheeled self-balancing personal electric transporter.' }
  },
  {
    word: 'Microscope',
    subtle: [
      { hint: 'Cover-slip', rationale: 'Ultrathin square glass sheet placed over biological drop.' },
      { hint: 'Staining', rationale: 'Chemical dyes coloring transparent cellular organelles.' },
      { hint: 'Stage', rationale: 'Flat mechanical platform clipped with glass specimen slide.' }
    ],
    balanced: [
      { hint: 'Magnify', rationale: 'Optical or electron enlargement of microscopic specimens.' },
      { hint: 'Slide', rationale: 'Rectangular glass wafer holding biological specimen.' },
      { hint: 'Lenses', rationale: 'Objective and ocular optics providing high zoom.' }
    ],
    easy: [
      { hint: 'Cells', rationale: 'Microscopic biological units invisible to naked eye.' },
      { hint: 'Bacteria', rationale: 'Microorganisms viewed swimming in water drops.' },
      { hint: 'Laboratory', rationale: 'Scientific room equipped with bench microscopes.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Laboratory instrument magnifying cellular and bacterial specimens.' }
  },
  {
    word: 'Fiber Optic',
    subtle: [
      { hint: 'Cladding', rationale: 'Lower-index outer glass layer causing total internal reflection.' },
      { hint: 'Subsea', rationale: 'Cables laid across ocean trenches connecting continents.' },
      { hint: 'Splicing', rationale: 'Precision fusion welding of microscopic hair strands.' }
    ],
    balanced: [
      { hint: 'Glass', rationale: 'Ultra-pure silica thread thinner than human hair.' },
      { hint: 'Light', rationale: 'Laser pulses transmitting binary data down strands.' },
      { hint: 'Cables', rationale: 'Bundled insulated strands buried underground.' }
    ],
    easy: [
      { hint: 'Fast', rationale: 'Gigabit telecommunications speeds.' },
      { hint: 'Internet', rationale: 'Global network infrastructure backbone.' },
      { hint: 'Broadband', rationale: 'High-speed home connection.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Glass strand cables transmitting internet data at the speed of light.' }
  },
  {
    word: 'Electric Car',
    subtle: [
      { hint: 'Regenerative', rationale: 'Braking system capturing kinetic energy back into battery.' },
      { hint: 'Kilowatt', rationale: 'Unit of measure quantifying battery storage capacity.' },
      { hint: 'Torque', rationale: 'Instantaneous rotational force delivered at zero RPM.' }
    ],
    balanced: [
      { hint: 'Battery', rationale: 'Massive floor-mounted lithium-ion power pack.' },
      { hint: 'Motor', rationale: 'Silent electromagnetic powertrain spinning axles.' },
      { hint: 'Silent', rationale: 'Absence of internal combustion engine exhaust rumble.' }
    ],
    easy: [
      { hint: 'Charge', rationale: 'Plugging into wall charger or supercharger station.' },
      { hint: 'Plug', rationale: 'Cord connected to charging port.' },
      { hint: 'Clean', rationale: 'Zero tailpipe emissions vehicle.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Battery-powered motor vehicle recharged via charging plugs.' }
  },
  {
    word: 'Touchscreen',
    subtle: [
      { hint: 'Capacitive', rationale: 'Electrical sensing grid detecting finger conductivity.' },
      { hint: 'Oleophobic', rationale: 'Chemical coating repelling natural fingerprint oils.' },
      { hint: 'Digitizer', rationale: 'Glass layer converting touch into coordinates.' }
    ],
    balanced: [
      { hint: 'Swipe', rationale: 'Gliding fingertip horizontally to turn pages.' },
      { hint: 'Glass', rationale: 'Smooth polished surface forming interactive display.' },
      { hint: 'Fingers', rationale: 'Body parts tapped directly on display.' }
    ],
    easy: [
      { hint: 'Tap', rationale: 'Quick finger press opening buttons and links.' },
      { hint: 'Panel', rationale: 'Flat interactive surface presenting controls.' },
      { hint: 'Display', rationale: 'Luminous interactive visual panel.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Interactive glass display responding to taps and swipes.' }
  },
  {
    word: 'Biometric Scanner',
    subtle: [
      { hint: 'Minutiae', rationale: 'Specific ridge bifurcations and endings compared in scan.' },
      { hint: 'Iris', rationale: 'Unique colored eye pattern read by infrared cameras.' },
      { hint: 'False-reject', rationale: 'Error rate when legitimate user is refused entry.' }
    ],
    balanced: [
      { hint: 'Fingerprint', rationale: 'Unique whorl impression pressed against glass platen.' },
      { hint: 'Facial', rationale: '3D depth mapping recognizing user face structure.' },
      { hint: 'Security', rationale: 'Identity verification protecting vaults and phones.' }
    ],
    easy: [
      { hint: 'Unlock', rationale: 'Granting access to secured phone or door.' },
      { hint: 'Identity', rationale: 'Verifying biological self against saved database.' },
      { hint: 'Sensor', rationale: 'Hardware component reading biological marks.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Identity sensor unlocking devices with fingerprints or faces.' }
  },
  {
    word: 'Game Console',
    subtle: [
      { hint: 'HDMI', rationale: 'Digital cable routing audio and video to television.' },
      { hint: 'Disc', rationale: 'Blu-ray media inserted into slot-loading drive.' },
      { hint: 'Firmware', rationale: 'System software updated regularly over network.' }
    ],
    balanced: [
      { hint: 'Controller', rationale: 'Wireless gamepad held in hands with thumbsticks.' },
      { hint: 'Television', rationale: 'Living room screen displaying gameplay graphics.' },
      { hint: 'PlayStation', rationale: 'Famous Japanese brand dominating home entertainment.' }
    ],
    easy: [
      { hint: 'Play', rationale: 'Interactive entertainment enjoyed with friends.' },
      { hint: 'Box', rationale: 'Hardware unit connected beside TV.' },
      { hint: 'Buttons', rationale: 'Gamepad triggers and face keys pressed.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Home entertainment box plugged into TV for video games.' }
  },
  {
    word: 'GPS Navigation',
    subtle: [
      { hint: 'Trilateration', rationale: 'Geometry calculating position from three satellite distances.' },
      { hint: 'Constellation', rationale: 'Fleet of 24 orbital atomic-clock atomic satellites.' },
      { hint: 'Waypoints', rationale: 'Saved coordinate destinations along plotted route.' }
    ],
    balanced: [
      { hint: 'Satellites', rationale: 'Spacecraft broadcasting precise atomic time signals.' },
      { hint: 'Map', rationale: 'Digital street overview with plotted blue line.' },
      { hint: 'Coordinates', rationale: 'Exact latitude and longitude of current location.' }
    ],
    easy: [
      { hint: 'Route', rationale: 'Turn-by-turn driving directions to destination.' },
      { hint: 'Directions', rationale: 'Voice guidance instructing next turn in 500 feet.' },
      { hint: 'Location', rationale: 'Pinpointing where you are on planet.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Satellite navigation system guiding routes and directions.' }
  },
  {
    word: 'Cloud Server',
    subtle: [
      { hint: 'Virtualization', rationale: 'Dividing physical hardware into isolated software guests.' },
      { hint: 'Datacenter', rationale: 'Massive climate-controlled warehouse hosting servers.' },
      { hint: 'Redundancy', rationale: 'Duplicate hardware ensuring uptime during outages.' }
    ],
    balanced: [
      { hint: 'Storage', rationale: 'Offsite hard drive capacity holding remote backups.' },
      { hint: 'Racks', rationale: 'Metal cabinets housing networked blade computers.' },
      { hint: 'Hosting', rationale: 'Providing web access to websites and databases.' }
    ],
    easy: [
      { hint: 'Online', rationale: 'Connected continuously to the global internet.' },
      { hint: 'Files', rationale: 'Documents and photos accessible from any device.' },
      { hint: 'Backup', rationale: 'Safeguarding personal data offsite.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Remote datacenter computer storing online files and databases.' }
  },
  {
    word: 'Wireless Charger',
    subtle: [
      { hint: 'Induction', rationale: 'Electromagnetic field transferring energy between coils.' },
      { hint: 'Qi', rationale: 'Standardized international inductive power transfer protocol.' },
      { hint: 'Coil', rationale: 'Wound copper spiral generating oscillating magnetic field.' }
    ],
    balanced: [
      { hint: 'Pad', rationale: 'Flat disc or stand resting on bedside nightstand.' },
      { hint: 'Cordless', rationale: 'Charging battery without plugging in physical cable.' },
      { hint: 'Magnetic', rationale: 'Magnetic alignment snapping phone into optimal position.' }
    ],
    easy: [
      { hint: 'Battery', rationale: 'Power cell replenished while phone rests on surface.' },
      { hint: 'Power', rationale: 'Energy transferred to phone automatically.' },
      { hint: 'Rest', rationale: 'Action of laying device flat to recharge.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Inductive mat recharging device batteries without cords.' }
  },
  {
    word: 'Subwoofer',
    subtle: [
      { hint: 'Hertz', rationale: 'Deep low frequencies below 80 Hz handled by driver.' },
      { hint: 'Crossover', rationale: 'Circuit routing only deep bass to specialized cone.' },
      { hint: 'Port', rationale: 'Tuned vent tube in cabinet boosting resonant boom.' }
    ],
    balanced: [
      { hint: 'Bass', rationale: 'Rumbling low-pitch acoustic frequencies.' },
      { hint: 'Rumble', rationale: 'Physical vibration felt in chest and floorboards.' },
      { hint: 'Speaker', rationale: 'Audio transducer pushing air with large cone.' }
    ],
    easy: [
      { hint: 'Boom', rationale: 'Explosive low sonic detonation sound.' },
      { hint: 'Music', rationale: 'Soundtrack enhanced by heavy rhythmic low-end.' },
      { hint: 'Loud', rationale: 'Powerful sound pressure shaking the room.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Dedicated audio driver reproducing deep rumbling bass frequencies.' }
  },
  {
    word: 'Smart Bulb',
    subtle: [
      { hint: 'Zigbee', rationale: 'Low-power mesh wireless protocol linking lights.' },
      { hint: 'Lumens', rationale: 'Unit measuring brightness output of LED diodes.' },
      { hint: 'Dimmer', rationale: 'Software slider lowering brightness smoothly.' }
    ],
    balanced: [
      { hint: 'Colors', rationale: 'RGB LEDs shifting between millions of vivid hues.' },
      { hint: 'Socket', rationale: 'Standard threaded screw fixture screwed into lamp.' },
      { hint: 'App', rationale: 'Smartphone software scheduling lights and colors.' }
    ],
    easy: [
      { hint: 'Light', rationale: 'Illumination fixture brightening rooms.' },
      { hint: 'Lamp', rationale: 'Household fixture holding the smart diode.' },
      { hint: 'Voice', rationale: 'Commands toggling lights via smart home assistants.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Color-changing LED light screwed into lamp and controlled by app.' }
  },
  {
    word: 'Earbuds',
    subtle: [
      { hint: 'Silicone', rationale: 'Soft flexible tip sealing inside ear canal.' },
      { hint: 'Case', rationale: 'Pocket-sized magnetic container recharging stems.' },
      { hint: 'Microphone', rationale: 'Tiny array filtering out ambient wind noise during calls.' }
    ],
    balanced: [
      { hint: 'Music', rationale: 'Personal audio streamed directly into ears.' },
      { hint: 'Bluetooth', rationale: 'Wireless connection linking earbuds to phone.' },
      { hint: 'Canceling', rationale: 'Active noise reduction inverting ambient roar.' }
    ],
    easy: [
      { hint: 'Ears', rationale: 'Auditory canals where tiny speakers sit.' },
      { hint: 'Listen', rationale: 'Private listening to podcasts and songs.' },
      { hint: 'Sound', rationale: 'High-fidelity audio piped into head.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Miniature wireless in-ear headphones with charging case.' }
  },
  {
    word: 'Projector',
    subtle: [
      { hint: 'Keystone', rationale: 'Digital correction squaring trapezoidal projected image.' },
      { hint: 'Lumens', rationale: 'Measurement of lamp brightness punching through daylight.' },
      { hint: 'DLP', rationale: 'Digital micromirror chip modulating projected light.' }
    ],
    balanced: [
      { hint: 'Lens', rationale: 'Optical glass projecting expanded beam onto wall.' },
      { hint: 'Screen', rationale: 'White pulled-down fabric surface catching beam.' },
      { hint: 'Cinema', rationale: 'Movie theater experience recreated in home theater.' }
    ],
    easy: [
      { hint: 'Beam', rationale: 'Conical shaft of bright light shining across room.' },
      { hint: 'Movie', rationale: 'Films displayed on giant hundred-inch wall.' },
      { hint: 'Dark', rationale: 'Room lights dimmed to maximize picture contrast.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Optical device beaming movies onto large white screens.' }
  },
  {
    word: 'Power Bank',
    subtle: [
      { hint: 'Milliamp', rationale: 'Measure of electrical charge capacity in battery cell.' },
      { hint: 'Port', rationale: 'USB sockets dispensing juice to connected cords.' },
      { hint: 'Lithium', rationale: 'Chemical makeup of dense rechargeable pouch cells.' }
    ],
    balanced: [
      { hint: 'Battery', rationale: 'Portable energy brick recharging drained devices.' },
      { hint: 'Portable', rationale: 'Handheld accessory slipped into backpack during travel.' },
      { hint: 'Charge', rationale: 'Transferring stored electricity into smartphone.' }
    ],
    easy: [
      { hint: 'Travel', rationale: 'Journey where wall outlets are inaccessible.' },
      { hint: 'Phone', rationale: 'Mobile device rescued from zero percent battery.' },
      { hint: 'Cable', rationale: 'Connecting cord plugging brick to device.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Portable battery brick recharging mobile devices on the go.' }
  },
  {
    word: 'Self-Driving Car',
    subtle: [
      { hint: 'Lidar', rationale: 'Spinning laser radar mapping 3D point cloud of surroundings.' },
      { hint: 'Waymo', rationale: 'Autonomous commercial robotaxi fleet operating in cities.' },
      { hint: 'Autopilot', rationale: 'Computer-directed driver assistance highway cruise system.' }
    ],
    balanced: [
      { hint: 'Autonomous', rationale: 'Operating safely without human steering wheel input.' },
      { hint: 'Cameras', rationale: 'Multi-angle optical sensors reading lanes and stoplights.' },
      { hint: 'Steering', rationale: 'Wheel turning automatically guided by software.' }
    ],
    easy: [
      { hint: 'Wheels', rationale: 'Four tires rolling down asphalt without driver.' },
      { hint: 'Robot', rationale: 'Computer algorithm controlling vehicle pedals.' },
      { hint: 'Drive', rationale: 'Automated road transit between destinations.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Autonomous vehicle navigating roads with lidar and cameras.' }
  },
  {
    word: 'Motion Sensor',
    subtle: [
      { hint: 'Passive', rationale: 'PIR device reading ambient body heat changes without emitting.' },
      { hint: 'Fresnel', rationale: 'Concentric ridged plastic lens focusing infrared zones.' },
      { hint: 'Infrared', rationale: 'Heat radiation emitted by passing warm bodies.' }
    ],
    balanced: [
      { hint: 'Detect', rationale: 'Sensing footsteps or movement within coverage cone.' },
      { hint: 'Alarm', rationale: 'Security siren triggered by unauthorized movement.' },
      { hint: 'Security', rationale: 'Home defense protecting windows and hallways.' }
    ],
    easy: [
      { hint: 'Movement', rationale: 'Physical shifting triggering electrical switch.' },
      { hint: 'Light', rationale: 'Security floodlight snapping on automatically.' },
      { hint: 'Switch', rationale: 'Electrical mechanism toggling current upon detecting presence.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Security device detecting movement and switching on lights.' }
  },
  {
    word: 'Nanotechnology',
    subtle: [
      { hint: 'Fullerene', rationale: 'Hollow carbon buckyball molecule structure.' },
      { hint: 'Quantum', rationale: 'Subatomic physics laws governing properties at nanoscale.' },
      { hint: 'Graphene', rationale: 'Single atomic layer of carbon with extreme strength.' }
    ],
    balanced: [
      { hint: 'Atoms', rationale: 'Individual building blocks manipulated mechanically.' },
      { hint: 'Nanometer', rationale: 'One billionth of a meter measurement scale.' },
      { hint: 'Molecules', rationale: 'Chemical clusters engineered for targeted medicine.' }
    ],
    easy: [
      { hint: 'Microscopic', rationale: 'Scale far too small to see with standard optical lenses.' },
      { hint: 'Tiny', rationale: 'Ultralight sub-cellular dimensions.' },
      { hint: 'Science', rationale: 'Cutting-edge material physics and engineering field.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Engineering matter at the atomic and molecular scale.' }
  },
  {
    word: 'Webcam',
    subtle: [
      { hint: 'Bezel', rationale: 'Thin frame around laptop display holding miniature camera.' },
      { hint: 'Shutter', rationale: 'Physical plastic sliding privacy cover over lens.' },
      { hint: 'Framerate', rationale: 'Video smoothness measured in 30 or 60 frames per second.' }
    ],
    balanced: [
      { hint: 'Conference', rationale: 'Workplace meetings held across Zoom or Teams.' },
      { hint: 'Video', rationale: 'Live digital visual stream broadcast to callers.' },
      { hint: 'Streamer', rationale: 'Content creator broadcasting face to gaming audience.' }
    ],
    easy: [
      { hint: 'Camera', rationale: 'Optical digital capture unit clipped to monitor.' },
      { hint: 'Call', rationale: 'Face-to-face video chat with friends.' },
      { hint: 'Online', rationale: 'Connected to computer for internet calls.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Digital camera clipped to computer monitor for video calls.' }
  }
];

// Clean any special characters in hints
technology.forEach(item => {
  [...item.subtle, ...item.balanced, ...item.easy].forEach(h => {
    h.hint = h.hint.replace(/[^a-zA-Z0-9]/g, '');
  });
});

fs.writeFileSync('scripts/curated_vocabulary/part11_technology.json', JSON.stringify({ technology }, null, 2), 'utf8');
console.log('Successfully wrote part11_technology.json (35 words)');
