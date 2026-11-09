const fs = require('fs');

const hobbies = [
  {
    word: 'Minecraft',
    subtle: [
      { hint: 'Creeper', rationale: 'Green hissing mob exploding near player shelters.' },
      { hint: 'Redstone', rationale: 'Conductive mineral dust wiring logic gates and contraptions.' },
      { hint: 'Diamond', rationale: 'Precious blue gemstone mined deep underground for gear.' }
    ],
    balanced: [
      { hint: 'Blocks', rationale: 'Cubic voxels composing entire procedurally generated world.' },
      { hint: 'Pickaxe', rationale: 'Handheld tool used to excavate stone and ore.' },
      { hint: 'Crafting', rationale: 'Grid interface combining ingredients into tools.' }
    ],
    easy: [
      { hint: 'Mine', rationale: 'Digging shafts into dark underground caverns.' },
      { hint: 'Build', rationale: 'Constructing castles and houses out of voxel blocks.' },
      { hint: 'Game', rationale: 'Bestselling sandbox video game phenomenon.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Bestselling sandbox block-building video game.' }
  },
  {
    word: 'Pokemon',
    subtle: [
      { hint: 'Badge', rationale: 'Gym leader metal tokens collected to enter league.' },
      { hint: 'Professor', rationale: 'Lab scientist gifting rookie trainer starter creature.' },
      { hint: 'Grass', rationale: 'Tall wilderness patches where wild creatures appear.' }
    ],
    balanced: [
      { hint: 'Pikachu', rationale: 'Yellow electric mouse mascot of global franchise.' },
      { hint: 'Evolve', rationale: 'Metamorphosis into larger, more powerful combat forms.' },
      { hint: 'Trainer', rationale: 'Adventurer traveling routes to catch and battle.' }
    ],
    easy: [
      { hint: 'Catch', rationale: 'Trapping wild pocket creatures with red-and-white spheres.' },
      { hint: 'Battle', rationale: 'Turn-based tactical arena contests between creatures.' },
      { hint: 'Monsters', rationale: 'Pocket creatures collected in Pokedex database.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Franchise collecting, evolving, and battling pocket creatures.' }
  },
  {
    word: 'Super Mario',
    subtle: [
      { hint: 'Mustache', rationale: 'Bushy black facial hair on round plumber face.' },
      { hint: 'Overalls', rationale: 'Blue denim work suit worn over red shirt.' },
      { hint: 'Castle', rationale: 'Fortress where princess is famously in another room.' }
    ],
    balanced: [
      { hint: 'Mushroom', rationale: 'Red spotted fungus granting growth power-up.' },
      { hint: 'Plumber', rationale: 'Hero trade traversing green warp drainage pipes.' },
      { hint: 'Goomba', rationale: 'Little brown mushroom foot-soldier squashed from above.' }
    ],
    easy: [
      { hint: 'Jump', rationale: 'Primary athletic platforming action leaping over pits.' },
      { hint: 'Nintendo', rationale: 'Japanese gaming company mascot platform franchise.' },
      { hint: 'Coins', rationale: 'Golden spinning tokens collected in blocks.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Nintendo flagship platformer featuring the jumping plumber.' }
  },
  {
    word: 'The Legend of Zelda',
    subtle: [
      { hint: 'Ocarina', rationale: 'Ceramic blue wind instrument playing magical tunes.' },
      { hint: 'Pots', rationale: 'Clay pottery smashed inside houses for rupees.' },
      { hint: 'Rupees', rationale: 'Colorful hexagonal gemstone currency in Hyrule.' }
    ],
    balanced: [
      { hint: 'Triforce', rationale: 'Three golden sacred triangles granting wishes.' },
      { hint: 'Hyrule', rationale: 'Fantasy kingdom realm threatened by Ganon.' },
      { hint: 'Mastersword', rationale: 'Sacred blade resting in stone pedestal in forest.' }
    ],
    easy: [
      { hint: 'Link', rationale: 'Green-tunicked silent hero carrying shield and blade.' },
      { hint: 'Princess', rationale: 'Royal maiden carrying the crest of wisdom.' },
      { hint: 'Sword', rationale: 'Blade swung in spin attack against moblins.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Epic fantasy adventure series set in Hyrule.' }
  },
  {
    word: 'Tetris',
    subtle: [
      { hint: 'Rotate', rationale: 'Spinning falling polyominoes 90 degrees to fit gaps.' },
      { hint: 'Cleared', rationale: 'Horizontal row vanishing when completely solid.' },
      { hint: 'Russian', rationale: 'National heritage of creator Alexey Pajitnov.' }
    ],
    balanced: [
      { hint: 'Blocks', rationale: 'Four-square tetromino shapes falling from top.' },
      { hint: 'Lines', rationale: 'Completed horizontal rows disappearing for score.' },
      { hint: 'Falling', rationale: 'Downward descent speeding up with each level.' }
    ],
    easy: [
      { hint: 'Puzzle', rationale: 'Spatial logic tile-matching video game.' },
      { hint: 'Grid', rationale: 'Ten-by-twenty rectangular matrix playing well.' },
      { hint: 'Stack', rationale: 'Piling pieces carefully without topping out.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Legendary falling-block tile-matching puzzle game.' }
  },
  {
    word: 'Pac-Man',
    subtle: [
      { hint: 'Fruit', rationale: 'Cherries and strawberries appearing for bonus points.' },
      { hint: 'Pellets', rationale: 'Small dots lining corridors eaten in succession.' },
      { hint: 'Waka', rationale: 'Onomatopoeic chomp sound repeated continuously.' }
    ],
    balanced: [
      { hint: 'Ghosts', rationale: 'Blinky, Pinky, Inky, and Clyde chasing through turns.' },
      { hint: 'Maze', rationale: 'Blue neon labyrinth corridors navigated on screen.' },
      { hint: 'Chomp', rationale: 'Mouth action consuming white power dots.' }
    ],
    easy: [
      { hint: 'Yellow', rationale: 'Iconic pizza-with-slice-missing circular body color.' },
      { hint: 'Arcade', rationale: 'Coin-operated cabinet game pioneer from 1980.' },
      { hint: 'Dots', rationale: 'Trail of light nibbled away across screen.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Iconic arcade maze game chomping dots and evading ghosts.' }
  },
  {
    word: 'Gardening',
    subtle: [
      { hint: 'Mulch', rationale: 'Wood chips layered over soil to retain moisture.' },
      { hint: 'Compost', rationale: 'Decomposed organic matter enriching garden bed.' },
      { hint: 'Prune', rationale: 'Trimming back overgrown shrub branches.' }
    ],
    balanced: [
      { hint: 'Seeds', rationale: 'Small kernels planted in furrows to sprout.' },
      { hint: 'Trowel', rationale: 'Small handheld spade digging planting holes.' },
      { hint: 'Watering', rationale: 'Hydrating flower beds with can or garden hose.' }
    ],
    easy: [
      { hint: 'Flowers', rationale: 'Colorful blooms cultivated in outdoor beds.' },
      { hint: 'Soil', rationale: 'Rich dark earth tilled with spade.' },
      { hint: 'Plants', rationale: 'Flora nurtured in backyard garden plots.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Outdoor leisure pastime cultivating flowers, soil, and plants.' }
  },
  {
    word: 'Photography',
    subtle: [
      { hint: 'Bokeh', rationale: 'Aesthetic out-of-focus blur in background lights.' },
      { hint: 'Aperture', rationale: 'Iris mechanism controlling lens light entry.' },
      { hint: 'Shutter', rationale: 'Curtain opening for a fraction of a second.' }
    ],
    balanced: [
      { hint: 'Lens', rationale: 'Optical glass cylinder focusing image on sensor.' },
      { hint: 'Tripod', rationale: 'Three-legged mount stabilizing exposures.' },
      { hint: 'Framing', rationale: 'Composing visual elements within viewfinder.' }
    ],
    easy: [
      { hint: 'Camera', rationale: 'Handheld apparatus capturing visual frames.' },
      { hint: 'Picture', rationale: 'Snapshot frozen in time on memory card.' },
      { hint: 'Shoot', rationale: 'Action of taking photographic shots.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Visual art hobby capturing moments through camera lenses.' }
  },
  {
    word: 'Scuba Diving',
    subtle: [
      { hint: 'Regulator', rationale: 'Mouthpiece valve reducing high tank pressure for breathing.' },
      { hint: 'Nitrox', rationale: 'Enriched oxygen gas blend extending bottom time.' },
      { hint: 'Wetsuit', rationale: 'Neoprene insulation keeping core warm in deep water.' }
    ],
    balanced: [
      { hint: 'Tank', rationale: 'Compressed air cylinder strapped to diver back.' },
      { hint: 'Flippers', rationale: 'Rubber swim fins kicking through underwater currents.' },
      { hint: 'Reef', rationale: 'Coral ecosystem explored beneath ocean surface.' }
    ],
    easy: [
      { hint: 'Underwater', rationale: 'Submerged marine realm explored by divers.' },
      { hint: 'Mask', rationale: 'Tempered glass viewing window over eyes and nose.' },
      { hint: 'Ocean', rationale: 'Deep saltwater domain of marine life.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Underwater exploration pastime breathing through tanks.' }
  },
  {
    word: 'Origami',
    subtle: [
      { hint: 'Square', rationale: 'Geometric starting shape of specialized thin paper.' },
      { hint: 'Valley', rationale: 'Downward inward crease fold technique.' },
      { hint: 'Japanese', rationale: 'Cultural country where paper art was codified.' }
    ],
    balanced: [
      { hint: 'Crane', rationale: 'Iconic folded paper bird with flapping wings.' },
      { hint: 'Crease', rationale: 'Sharp pressed fold line across paper surface.' },
      { hint: 'Scissors', rationale: 'Tool strictly forbidden in traditional folding.' }
    ],
    easy: [
      { hint: 'Paper', rationale: 'Core pliable sheet folded into intricate sculptures.' },
      { hint: 'Fold', rationale: 'Primary manual manipulation technique.' },
      { hint: 'Craft', rationale: 'Delicate manual decorative art form.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Japanese art of folding square paper into intricate animal forms.' }
  },
  {
    word: 'Skateboarding',
    subtle: [
      { hint: 'Grip-tape', rationale: 'Abrasive sandpaper sheet adhered to deck top.' },
      { hint: 'Trucks', rationale: 'Metal axle assemblies mounting wheels to wooden deck.' },
      { hint: 'Ollie', rationale: 'Foundational trick popping board airborne without hands.' }
    ],
    balanced: [
      { hint: 'Deck', rationale: 'Seven-ply maple laminated riding board.' },
      { hint: 'Wheels', rationale: 'Polyurethane rollers spinning on precision bearings.' },
      { hint: 'Grind', rationale: 'Sliding trucks along concrete curb or metal handrail.' }
    ],
    easy: [
      { hint: 'Ramp', rationale: 'Halfpipe or quarterpipe curved skatepark wooden transition.' },
      { hint: 'Park', rationale: 'Concrete recreational facility with bowls and ledges.' },
      { hint: 'Tricks', rationale: 'Kickflips, heelflips, and manuals executed on street.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Street and park action pastime riding four-wheeled decks.' }
  },
  {
    word: 'Baking',
    subtle: [
      { hint: 'Yeast', rationale: 'Microorganism producing gas bubbles to leaven dough.' },
      { hint: 'Whisk', rationale: 'Wire balloon tool aerating eggs and cream.' },
      { hint: 'Vanilla', rationale: 'Fragrant aromatic extract flavoring sweet batters.' }
    ],
    balanced: [
      { hint: 'Flour', rationale: 'Finely milled grain foundation of cakes and loaves.' },
      { hint: 'Dough', rationale: 'Thick pliable flour mixture kneaded on counter.' },
      { hint: 'Oven', rationale: 'Heated dry chamber cooking pastries to golden brown.' }
    ],
    easy: [
      { hint: 'Cake', rationale: 'Sweet celebratory baked confection.' },
      { hint: 'Cookies', rationale: 'Sweet chocolate chip baked rounds.' },
      { hint: 'Sweet', rationale: 'Pleasant sugary profile of finished desserts.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Culinary hobby cooking cakes, cookies, and bread in ovens.' }
  },
  {
    word: 'Hiking',
    subtle: [
      { hint: 'Blaze', rationale: 'Painted colored mark on tree bark designating trail path.' },
      { hint: 'Cairn', rationale: 'Balanced stone stack marking alpine summit routes.' },
      { hint: 'Switchback', rationale: 'Zig-zag mountain trail easing steep ascents.' }
    ],
    balanced: [
      { hint: 'Trail', rationale: 'Dirt footpath winding through forest and ridges.' },
      { hint: 'Backpack', rationale: 'Gear bag carrying water, map, and snacks.' },
      { hint: 'Boots', rationale: 'Sturdy ankle-high footwear with rugged lug soles.' }
    ],
    easy: [
      { hint: 'Mountain', rationale: 'Elevated peak climbed for panoramic summit views.' },
      { hint: 'Walk', rationale: 'Extended foot travel through natural terrain.' },
      { hint: 'Nature', rationale: 'Wild scenic outdoor wilderness environment.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Outdoor pastime trekking trails up scenic mountains.' }
  },
  {
    word: 'Chess',
    subtle: [
      { hint: 'Gambit', rationale: 'Strategic sacrifice of pawn in opening for positional lead.' },
      { hint: 'En-passant', rationale: 'Special pawn capture capturing passing neighbor.' },
      { hint: 'Fianchetto', rationale: 'Developing bishop to long knight diagonal.' }
    ],
    balanced: [
      { hint: 'Checkmate', rationale: 'Irrevocable fatal trap cornering opponent king.' },
      { hint: 'Knight', rationale: 'L-shaped leaping piece carved as equine steed.' },
      { hint: 'Rook', rationale: 'Castle turret sliding along orthogonal ranks.' }
    ],
    easy: [
      { hint: 'Board', rationale: 'Sixty-four black and white alternating squares.' },
      { hint: 'King', rationale: 'Pivotal royal piece whose loss ends match.' },
      { hint: 'Queen', rationale: 'Most powerful wide-ranging piece on the board.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Ancient strategy board game of kings, rooks, and checkmate.' }
  },
  {
    word: 'Painting',
    subtle: [
      { hint: 'Impasto', rationale: 'Thick textured layer of paint applied with palette knife.' },
      { hint: 'Gesso', rationale: 'White chalk primer coating raw canvas fabric.' },
      { hint: 'Turpentine', rationale: 'Pungent solvent used to thin oil pigments and clean hair.' }
    ],
    balanced: [
      { hint: 'Palette', rationale: 'Handheld board holding dollops of colored paint.' },
      { hint: 'Easel', rationale: 'Three-legged wooden tripod standing canvas upright.' },
      { hint: 'Brushes', rationale: 'Bristle wands applying strokes to canvas.' }
    ],
    easy: [
      { hint: 'Canvas', rationale: 'Stretched linen fabric surface of artwork.' },
      { hint: 'Color', rationale: 'Vibrant hues mixed together for artwork.' },
      { hint: 'Art', rationale: 'Visual fine artistic discipline.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Fine art hobby applying colors to canvas with brushes.' }
  },
  {
    word: 'Yoga',
    subtle: [
      { hint: 'Pranayama', rationale: 'Rhythmic breath regulation calming nervous system.' },
      { hint: 'Chakra', rationale: 'Subtle energy centers aligned through practice.' },
      { hint: 'Savasana', rationale: 'Final restorative corpse posture lying still on back.' }
    ],
    balanced: [
      { hint: 'Namaste', rationale: 'Respectful greeting bow honoring inner spirit.' },
      { hint: 'Asana', rationale: 'Physical posture holding steady form.' },
      { hint: 'Stretch', rationale: 'Lengthening hamstrings and spine through poses.' }
    ],
    easy: [
      { hint: 'Mat', rationale: 'Non-slip rubber foam pad unrolled on floor.' },
      { hint: 'Breathe', rationale: 'Inhaling and exhaling mindfully with movements.' },
      { hint: 'Pose', rationale: 'Warrior, cobra, or downward dog physical shape.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Mindful practice combining poses, breath, and stretching on mats.' }
  },
  {
    word: 'Camping',
    subtle: [
      { hint: 'Kindling', rationale: 'Dry twigs and birch bark catching match spark.' },
      { hint: 'Tarp', rationale: 'Waterproof sheet strung overhead against heavy rain.' },
      { hint: 'Carabiner', rationale: 'Spring-loaded metal clip hanging gear from ropes.' }
    ],
    balanced: [
      { hint: 'Tent', rationale: 'Nylon canopy pitched with fiberglass shock-cord poles.' },
      { hint: 'Campfire', rationale: 'Blazing pit of logs roasting sausages and marshmallows.' },
      { hint: 'Sleepingbag', rationale: 'Insulated zip-up cocoon keeping campers warm.' }
    ],
    easy: [
      { hint: 'Outdoors', rationale: 'Sleeping in open wilderness under stars.' },
      { hint: 'Woods', rationale: 'Forested wilderness setting away from cities.' },
      { hint: 'Fire', rationale: 'Warmth and cooking hearth in campsite circle.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Outdoor retreat sleeping in tents around campfires.' }
  },
  {
    word: 'Pottery',
    subtle: [
      { hint: 'Wedging', rationale: 'Kneading clay to remove trapped air pockets.' },
      { hint: 'Glaze', rationale: 'Liquid silica paint turning glassy in kiln fire.' },
      { hint: 'Centering', rationale: 'Aligning clay mound firmly over wheel spin axis.' }
    ],
    balanced: [
      { hint: 'Wheel', rationale: 'Rotating motorized spinning turntable plate.' },
      { hint: 'Kiln', rationale: 'High-temperature insulated furnace firing ceramics.' },
      { hint: 'Clay', rationale: 'Malleable mineral earth shaped with wet hands.' }
    ],
    easy: [
      { hint: 'Vase', rationale: 'Hollow vessel thrown on wheel to hold flowers.' },
      { hint: 'Mug', rationale: 'Ceramic drinking cup shaped and attached with handle.' },
      { hint: 'Ceramic', rationale: 'Hard durable material produced by kiln firing.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Crafting vessels from wet clay on spinning wheels.' }
  },
  {
    word: 'Fishing',
    subtle: [
      { hint: 'Bobber', rationale: 'Red and white floating sphere dipping when bite occurs.' },
      { hint: 'Sinker', rationale: 'Lead weight dragging bait down into water column.' },
      { hint: 'Creel', rationale: 'Woven wicker basket storing caught trout.' }
    ],
    balanced: [
      { hint: 'Rod', rationale: 'Flexible fiberglass wand casting line over water.' },
      { hint: 'Bait', rationale: 'Live earthworm or feathered artificial fly lure.' },
      { hint: 'Hook', rationale: 'Barbed curved metal point snaring fish jaw.' }
    ],
    easy: [
      { hint: 'Reel', rationale: 'Spool mechanism winding nylon line back in.' },
      { hint: 'Lake', rationale: 'Calm freshwater body where lines are cast.' },
      { hint: 'Catch', rationale: 'Hauling in a freshwater bass or pike.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Patience pastime casting rods and reels into lakes for fish.' }
  },
  {
    word: 'Bird Watching',
    subtle: [
      { hint: 'Life-list', rationale: 'Personal ledger recording every species spotted in life.' },
      { hint: 'Plumage', rationale: 'Distinct seasonal feather patterns distinguishing species.' },
      { hint: 'Hide', rationale: 'Camouflaged wooden shelter observing wetland flocks.' }
    ],
    balanced: [
      { hint: 'Binoculars', rationale: 'Dual optical lenses magnifying distant treetop silhouettes.' },
      { hint: 'Guidebook', rationale: 'Field identification volume showing color plates.' },
      { hint: 'Song', rationale: 'Acoustic territorial whistle identifying hidden warblers.' }
    ],
    easy: [
      { hint: 'Feathers', rationale: 'Avian features examined through binoculars.' },
      { hint: 'Woods', rationale: 'Forested park where quiet walkers spot birds.' },
      { hint: 'Spot', rationale: 'Identifying rare migratory visitors in trees.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Quiet nature hobby spotting feathered species with binoculars.' }
  },
  {
    word: 'Knitting',
    subtle: [
      { hint: 'Purl', rationale: 'Reverse stitch looping yarn from front of needle.' },
      { hint: 'Skein', rationale: 'Loosely coiled bundle of spun wool yarn.' },
      { hint: 'Gauge', rationale: 'Measurement of stitch count per square inch.' }
    ],
    balanced: [
      { hint: 'Yarn', rationale: 'Continuous spun fiber strand pulled from ball.' },
      { hint: 'Needles', rationale: 'Pair of pointed wooden or metal slender rods.' },
      { hint: 'Stitch', rationale: 'Interlocking loop of yarn transferred between rods.' }
    ],
    easy: [
      { hint: 'Wool', rationale: 'Natural warm sheep fleece spun into yarn.' },
      { hint: 'Scarf', rationale: 'Long winter neck garment crafted stitch by stitch.' },
      { hint: 'Sweater', rationale: 'Warm pullover garment knitted for chilly days.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Yarn craft working needles into loops to make scarves.' }
  },
  {
    word: 'Rock Climbing',
    subtle: [
      { hint: 'Belay', rationale: 'Friction rope control system arresting climber falls.' },
      { hint: 'Chalk', rationale: 'White magnesium powder drying sweaty fingertips.' },
      { hint: 'Crimp', rationale: 'Grip using only fingertips on narrow edge.' }
    ],
    balanced: [
      { hint: 'Harness', rationale: 'Padded webbing loops worn around waist and thighs.' },
      { hint: 'Rope', rationale: 'Dynamic nylon line absorbing fall forces.' },
      { hint: 'Carabiner', rationale: 'Gate-locking aluminum clip snapping into bolts.' }
    ],
    easy: [
      { hint: 'Cliff', rationale: 'Vertical granite face ascended hand over hand.' },
      { hint: 'Grip', rationale: 'Holding handholds and footholds securely.' },
      { hint: 'Ascend', rationale: 'Scaling up sheer canyon walls.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Extreme vertical sport scaling cliff faces with ropes.' }
  },
  {
    word: 'Calligraphy',
    subtle: [
      { hint: 'Nib', rationale: 'Split metallic point dispensing ink when pressed.' },
      { hint: 'Parchment', rationale: 'Smooth heavy textured paper receiving wet strokes.' },
      { hint: 'Flourish', rationale: 'Decorative sweeping loop embellishing letter tails.' }
    ],
    balanced: [
      { hint: 'Ink', rationale: 'Dark black or colored fluid well dipped into.' },
      { hint: 'Lettering', rationale: 'Artistic disciplined rendering of beautiful alphabets.' },
      { hint: 'Quill', rationale: 'Traditional feather shaft shaped for script.' }
    ],
    easy: [
      { hint: 'Pen', rationale: 'Specialized dip holder with metallic nib.' },
      { hint: 'Writing', rationale: 'Formal manual script execution.' },
      { hint: 'Stroke', rationale: 'Careful thick and thin lines formed on paper.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Art of beautiful handwritten script using specialized pens and ink.' }
  },
  {
    word: 'Astronomy',
    subtle: [
      { hint: 'Aperture', rationale: 'Diameter of objective mirror collecting starry photons.' },
      { hint: 'Zenith', rationale: 'Point in night sky directly overhead observer.' },
      { hint: 'Nebula', rationale: 'Glowing cloud of cosmic dust birthing stellar systems.' }
    ],
    balanced: [
      { hint: 'Telescope', rationale: 'Tube with mirrors or lenses magnifying celestial bodies.' },
      { hint: 'Constellation', rationale: 'Mythological shape traced across star clusters.' },
      { hint: 'Planets', rationale: 'Worlds like Saturn and Jupiter viewed with rings.' }
    ],
    easy: [
      { hint: 'Stars', rationale: 'Twinkling celestial furnace bodies in deep sky.' },
      { hint: 'Moon', rationale: 'Cratered satellite studied through eyepiece.' },
      { hint: 'Night', rationale: 'Dark clear hours required for stargazing.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Celestial hobby gazing through telescopes at stars and planets.' }
  },
  {
    word: 'Magic Tricks',
    subtle: [
      { hint: 'Patter', rationale: 'Distracting verbal storytelling engaging audience.' },
      { hint: 'Gimmick', rationale: 'Concealed mechanical secret built into apparatus.' },
      { hint: 'Misdirection', rationale: 'Guiding audience gaze away from sleight of hand.' }
    ],
    balanced: [
      { hint: 'Illusion', rationale: 'Apparent supernatural impossibility performed live.' },
      { hint: 'Sleight', rationale: 'Dexterous concealed finger manipulation of cards.' },
      { hint: 'Wand', rationale: 'Black lacquered rod with white tips tapped on props.' }
    ],
    easy: [
      { hint: 'Cards', rationale: 'Standard 52-card deck shuffled and palmed.' },
      { hint: 'Rabbit', rationale: 'Bunny pulled unexpectedly from top hat.' },
      { hint: 'Disappear', rationale: 'Making coins or people vanish into thin air.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Performing arts hobby using sleight of hand and illusions.' }
  },
  {
    word: 'Archery',
    subtle: [
      { hint: 'Nock', rationale: 'Notched plastic rear groove seating arrow on string.' },
      { hint: 'Quiver', rationale: 'Cylindrical leather pouch slung over shoulder holding arrows.' },
      { hint: 'Draw', rationale: 'Pulling bowstring back smoothly to cheek anchor point.' }
    ],
    balanced: [
      { hint: 'Bow', rationale: 'Recurve or compound tensioned wood and fiberglass spring.' },
      { hint: 'Arrow', rationale: 'Slender shaft fitted with pointed tip and fletching.' },
      { hint: 'Bullseye', rationale: 'Center yellow gold circle on ten-ring target.' }
    ],
    easy: [
      { hint: 'Target', rationale: 'Straw round faced with concentric color rings.' },
      { hint: 'Aim', rationale: 'Sighting down shaft before releasing string.' },
      { hint: 'Shoot', rationale: 'Releasing bowstring to fire arrow down range.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Ancient precision sport shooting arrows with bows at targets.' }
  },
  {
    word: 'Woodworking',
    subtle: [
      { hint: 'Dovetail', rationale: 'Interlocking trapezoidal joint securing drawer corners.' },
      { hint: 'Planing', rationale: 'Hand tool shaving paper-thin curls off rough lumber.' },
      { hint: 'Grain', rationale: 'Natural longitudinal alignment of timber fibers.' }
    ],
    balanced: [
      { hint: 'Chisel', rationale: 'Sharp beveled steel blade pairing mortises.' },
      { hint: 'Sawdust', rationale: 'Fine wood powder blanketing shop floor.' },
      { hint: 'Workbench', rationale: 'Heavy wooden table fitted with vises and dogs.' }
    ],
    easy: [
      { hint: 'Timber', rationale: 'Rough-sawn oak or pine boards milled to size.' },
      { hint: 'Build', rationale: 'Crafting chairs, tables, and cabinets by hand.' },
      { hint: 'Wood', rationale: 'Organic material worked with hand and power tools.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Artisan craft shaping timber and building furniture.' }
  },
  {
    word: 'Kite Flying',
    subtle: [
      { hint: 'Ripstop', rationale: 'Nylon grid fabric resisting tears in high winds.' },
      { hint: 'Bridle', rationale: 'Multi-string harness setting aerodynamic flight angle.' },
      { hint: 'Spool', rationale: 'Reel holding hundreds of feet of high-test cord.' }
    ],
    balanced: [
      { hint: 'Breeze', rationale: 'Sustained wind lifting craft into open skies.' },
      { hint: 'String', rationale: 'Line held in hands controlling altitude and tug.' },
      { hint: 'Diamond', rationale: 'Classic geometric cross-stick frame shape.' }
    ],
    easy: [
      { hint: 'Wind', rationale: 'Atmospheric air current necessary for lift.' },
      { hint: 'Tail', rationale: 'Fluttering ribbon stabilizing flight path.' },
      { hint: 'Sky', rationale: 'Airy realm where colorful kites soar.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Leisure pastime tethering colorful kites in gusty breezes.' }
  },
  {
    word: 'Surfing',
    subtle: [
      { hint: 'Wax', rationale: 'Sticky paraffin rubbed on deck for foot grip.' },
      { hint: 'Leash', rationale: 'Urethane cord anchoring board to surfer ankle.' },
      { hint: 'Swell', rationale: 'Open-ocean wave energy traveling toward break.' }
    ],
    balanced: [
      { hint: 'Barrel', rationale: 'Hollow cylinder formed as wave crest curls over.' },
      { hint: 'Board', rationale: 'Fiberglass foam surfboard steered down face.' },
      { hint: 'Tide', rationale: 'Ocean water level influencing break conditions.' }
    ],
    easy: [
      { hint: 'Waves', rationale: 'Crested water ridges ridden to shore.' },
      { hint: 'Ocean', rationale: 'Coastal marine saltwater setting.' },
      { hint: 'Beach', rationale: 'Sandy shoreline where surfers paddle out.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Ocean sport riding breaking waves on fiberglass boards.' }
  },
  {
    word: 'Karaoke',
    subtle: [
      { hint: 'Reverb', rationale: 'Acoustic vocal echo added through sound mixer.' },
      { hint: 'Tambourine', rationale: 'Handheld percussion rattled by waiting party friends.' },
      { hint: 'Duet', rationale: 'Two-person vocal performance sharing microphones.' }
    ],
    balanced: [
      { hint: 'Lyrics', rationale: 'Words highlighted in color on TV screen in sync.' },
      { hint: 'Microphone', rationale: 'Audio device held while belting out chart hits.' },
      { hint: 'Screen', rationale: 'Video monitor displaying scrolling text.' }
    ],
    easy: [
      { hint: 'Sing', rationale: 'Vocal performance over recorded backing music.' },
      { hint: 'Music', rationale: 'Instrumental pop soundtrack playing through speakers.' },
      { hint: 'Party', rationale: 'Social gathering with drinks and singing.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Social entertainment singing along to scrolling lyrics.' }
  },
  {
    word: 'Sudoku',
    subtle: [
      { hint: 'Candidates', rationale: 'Pencil-marked small numbers testing possibilities in cell.' },
      { hint: 'Logic', rationale: 'Pure deductive reasoning without any arithmetic math.' },
      { hint: 'Japanese', rationale: 'Name origin meaning single digit placement.' }
    ],
    balanced: [
      { hint: 'Digits', rationale: 'Numbers from one through nine placed in cells.' },
      { hint: 'Grid', rationale: 'Nine-by-nine matrix divided into sub-squares.' },
      { hint: 'Nine', rationale: 'Count of unique numbers required per row and column.' }
    ],
    easy: [
      { hint: 'Puzzle', rationale: 'Newspaper brainteaser solved with pencil.' },
      { hint: 'Numbers', rationale: 'Symbols filled into blank boxes without repeating.' },
      { hint: 'Pencil', rationale: 'Writing instrument with eraser for trying numbers.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Logic number-placement puzzle filling a 9x9 grid.' }
  },
  {
    word: 'Scrapbooking',
    subtle: [
      { hint: 'Acid-free', rationale: 'Archival paper quality preventing photo yellowing.' },
      { hint: 'Washi', rationale: 'Decorative patterned Japanese paper tape.' },
      { hint: 'Embellish', rationale: 'Adding die-cuts, stickers, and stamps around images.' }
    ],
    balanced: [
      { hint: 'Stickers', rationale: 'Adhesive colorful decals decorating page borders.' },
      { hint: 'Memories', rationale: 'Keepsake life milestones preserved in bound album.' },
      { hint: 'Scissors', rationale: 'Decorative edge blades cutting fancy paper margins.' }
    ],
    easy: [
      { hint: 'Photos', rationale: 'Printed photographic snapshots pasted into albums.' },
      { hint: 'Album', rationale: 'Bound blank book holding decorated pages.' },
      { hint: 'Glue', rationale: 'Adhesive paste affixing memorabilia to paper.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Crafting decorated keepsake memory albums with photos and stickers.' }
  },
  {
    word: 'Roller Skating',
    subtle: [
      { hint: 'Toestop', rationale: 'Rubber plug on front used for braking and pushing.' },
      { hint: 'Quad', rationale: 'Traditional four-wheel two-by-two axle layout.' },
      { hint: 'Disco', rationale: 'Seventies music era celebrated in retro wooden rinks.' }
    ],
    balanced: [
      { hint: 'Wheels', rationale: 'Four polyurethane rollers spinning on axles.' },
      { hint: 'Boots', rationale: 'Laced high-top footwear mounted over chassis.' },
      { hint: 'Rink', rationale: 'Hardwood oval arena lit by mirror balls.' }
    ],
    easy: [
      { hint: 'Glide', rationale: 'Smooth forward motion rolling across floor.' },
      { hint: 'Roll', rationale: 'Movement on spinning wheels.' },
      { hint: 'Laces', rationale: 'Cords tied tight to secure ankles in boots.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Retro leisure pastime rolling on four-wheeled quad boots.' }
  },
  {
    word: 'Jewelry Making',
    subtle: [
      { hint: 'Crimp', rationale: 'Tiny metal bead squashed with pliers to secure cord.' },
      { hint: 'Bezel', rationale: 'Metal rim securing faceted gemstone in ring mount.' },
      { hint: 'Solder', rationale: 'Melting alloy joining precious metal wire joints.' }
    ],
    balanced: [
      { hint: 'Beads', rationale: 'Glass, crystal, or wooden spheres threaded on wire.' },
      { hint: 'Pliers', rationale: 'Needle-nose hand tool bending wire loops.' },
      { hint: 'Silver', rationale: 'Precious shiny metal crafted into earrings.' }
    ],
    easy: [
      { hint: 'Necklace', rationale: 'Ornamental chain worn around the neck.' },
      { hint: 'Bracelet', rationale: 'Beaded wrist band crafted for adornment.' },
      { hint: 'Gems', rationale: 'Sparkling polished stones mounted in settings.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Craft hobby stringing beads and shaping silver into necklaces.' }
  },
  {
    word: 'Geocaching',
    subtle: [
      { hint: 'Muggle', rationale: 'Non-playing bystander who must not see cache find.' },
      { hint: 'Logbook', rationale: 'Paper scroll signed and dated inside container.' },
      { hint: 'Swag', rationale: 'Small trinkets traded inside waterproof cache container.' }
    ],
    balanced: [
      { hint: 'Coordinates', rationale: 'Latitude and longitude coordinates leading to spot.' },
      { hint: 'Container', rationale: 'Hidden waterproof plastic box or ammo can.' },
      { hint: 'Cache', rationale: 'Hidden treasure hidden in urban or nature spot.' }
    ],
    easy: [
      { hint: 'Treasure', rationale: 'Hidden items hunted down in real world.' },
      { hint: 'Gps', rationale: 'Satellite navigation locating hidden coordinates.' },
      { hint: 'Find', rationale: 'Discovering concealed caches after searching terrain.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Real-world GPS treasure hunt finding hidden containers.' }
  },
  {
    word: 'Snorkeling',
    subtle: [
      { hint: 'Purge', rationale: 'One-way valve clearing water from breathing tube.' },
      { hint: 'Shallows', rationale: 'Sunlit near-shore waters ideal for surface viewing.' },
      { hint: 'Defogger', rationale: 'Drop applied to inside mask lens to prevent mist.' }
    ],
    balanced: [
      { hint: 'Fins', rationale: 'Rubber paddles on feet propelling surface swimmer.' },
      { hint: 'Mask', rationale: 'Tempered glass viewport enclosing eyes and nose.' },
      { hint: 'Reef', rationale: 'Shallow coral garden teeming with tropical fish.' }
    ],
    easy: [
      { hint: 'Tube', rationale: 'Curved plastic pipe breathing air from surface.' },
      { hint: 'Swim', rationale: 'Surface paddling looking down into clear water.' },
      { hint: 'Ocean', rationale: 'Warm tropical saltwater environment.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Surface water hobby viewing marine life through a breathing tube.' }
  },
  {
    word: 'Model Building',
    subtle: [
      { hint: 'Sprue', rationale: 'Plastic runner frame from which parts are clipped.' },
      { hint: 'Decals', rationale: 'Water-slide markings and insignias soaked in saucer.' },
      { hint: 'Cement', rationale: 'Solvent adhesive chemically welding plastic joints.' }
    ],
    balanced: [
      { hint: 'Kit', rationale: 'Boxed set containing unassembled plastic components.' },
      { hint: 'Tweezers', rationale: 'Precision tools positioning tiny cockpit parts.' },
      { hint: 'Scale', rationale: 'Miniature ratio like 1:72 replicating real vehicles.' }
    ],
    easy: [
      { hint: 'Paint', rationale: 'Enamel or acrylic colors applied with fine brush.' },
      { hint: 'Glue', rationale: 'Bonding agent joining miniature components.' },
      { hint: 'Plastic', rationale: 'Molded polymer material of replica parts.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Patience craft assembling and painting miniature scale replicas.' }
  },
  {
    word: 'Board Games',
    subtle: [
      { hint: 'Meeple', rationale: 'Wooden human-shaped token placed on territory tiles.' },
      { hint: 'Turn', rationale: 'Sequential clockwise rotation of player actions.' },
      { hint: 'Rulebook', rationale: 'Printed booklet detailing setup and victory points.' }
    ],
    balanced: [
      { hint: 'Dice', rationale: 'Numbered cubic cubes rolled to determine outcomes.' },
      { hint: 'Tokens', rationale: 'Cardboard or plastic counters marking player score.' },
      { hint: 'Tabletop', rationale: 'Dining or living room table surface hosting play.' }
    ],
    easy: [
      { hint: 'Cards', rationale: 'Decks drawn to trigger events or acquire resources.' },
      { hint: 'Play', rationale: 'Social gaming activity shared around table with friends.' },
      { hint: 'Win', rationale: 'Accumulating highest score or completing objective.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Social tabletop pastime rolling dice and advancing tokens.' }
  },
  {
    word: 'Billiards',
    subtle: [
      { hint: 'Chalk', rationale: 'Blue cube coating cue tip to prevent miscue.' },
      { hint: 'Bank', rationale: 'Rebounding ball off rubber cushion into pocket.' },
      { hint: 'Felt', rationale: 'Green baize cloth covering smooth slate table.' }
    ],
    balanced: [
      { hint: 'Cue', rationale: 'Tapered wooden stick striking balls.' },
      { hint: 'Pocket', rationale: 'Corner or side net hole catching sunk balls.' },
      { hint: 'Rack', rationale: 'Triangular frame arranging balls before break.' }
    ],
    easy: [
      { hint: 'Balls', rationale: 'Striped and solid polished resin spheres.' },
      { hint: 'Table', rationale: 'Heavy slate rectangular playing surface.' },
      { hint: 'Eight', rationale: 'Black ball sunk last to claim victory.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Cue sport sinking balls into table pockets across green felt.' }
  },
  {
    word: 'Juggling',
    subtle: [
      { hint: 'Cascade', rationale: 'Fundamental figure-eight passing pattern for three props.' },
      { hint: 'Drop', rationale: 'Mishap sending flying prop clattering to floor.' },
      { hint: 'Clubs', rationale: 'Bowling-pin-shaped props spun end over end in air.' }
    ],
    balanced: [
      { hint: 'Toss', rationale: 'Rhythmic airborne release into parabolic arc.' },
      { hint: 'Balls', rationale: 'Soft beanbags or bounce spheres tossed in rhythm.' },
      { hint: 'Circus', rationale: 'Carnival performance art entertaining crowds.' }
    ],
    easy: [
      { hint: 'Catch', rationale: 'Snatching flying props cleanly with palms.' },
      { hint: 'Air', rationale: 'Medium where objects are continuously suspended.' },
      { hint: 'Hands', rationale: 'Rapid dexterity moving between catches and throws.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Acrobatic coordination skill keeping multiple balls airborne.' }
  }
];

// Clean any special characters in hints
hobbies.forEach(item => {
  [...item.subtle, ...item.balanced, ...item.easy].forEach(h => {
    h.hint = h.hint.replace(/[^a-zA-Z0-9]/g, '');
  });
});

fs.writeFileSync('scripts/curated_vocabulary/part9_hobbies.json', JSON.stringify({ hobbies }, null, 2), 'utf8');
console.log('Successfully wrote part9_hobbies.json (40 words)');
