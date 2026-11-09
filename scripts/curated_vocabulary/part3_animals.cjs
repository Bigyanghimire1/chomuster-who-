const fs = require('fs');

const animals = [
  {
    word: 'Penguin',
    subtle: [
      { hint: 'Tuxedo', rationale: 'Black and white formal plumage coloration.' },
      { hint: 'Antarctica', rationale: 'Cold southern polar habitat.' },
      { hint: 'Waddle', rationale: 'Charming clumsy walking gait on land.' }
    ],
    balanced: [
      { hint: 'Flippers', rationale: 'Modified wings functioning as underwater paddles.' },
      { hint: 'Iceberg', rationale: 'Floating polar platform where colonies rest.' },
      { hint: 'Feathers', rationale: 'Dense waterproof insulating coat.' }
    ],
    easy: [
      { hint: 'Beak', rationale: 'Pointed bill snatching krill from water.' },
      { hint: 'Slide', rationale: 'Tobogganing movement on bellies over snow.' },
      { hint: 'Bird', rationale: 'Flightless marine avian category.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Flightless Antarctic bird with tuxedo coloring.' }
  },
  {
    word: 'Kangaroo',
    subtle: [
      { hint: 'Outback', rationale: 'Arid Australian wilderness habitat.' },
      { hint: 'Joey', rationale: 'Name given to offspring carried in pouch.' },
      { hint: 'Boxing', rationale: 'Sparring stance balancing on powerful tail.' }
    ],
    balanced: [
      { hint: 'Pouch', rationale: 'Maternal abdominal pocket nurturing young.' },
      { hint: 'Bounce', rationale: 'High-energy bounding locomotion across terrain.' },
      { hint: 'Australia', rationale: 'Country of endemic native origin.' }
    ],
    easy: [
      { hint: 'Hop', rationale: 'Primary leaping mode of movement.' },
      { hint: 'Tail', rationale: 'Heavy muscular fifth limb balancing hops.' },
      { hint: 'Marsupial', rationale: 'Mammalian group raising young in pouches.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Hopping Australian marsupial with pouch.' }
  },
  {
    word: 'Dolphin',
    subtle: [
      { hint: 'Pod', rationale: 'Social family group swimming together.' },
      { hint: 'Sonar', rationale: 'Biological echolocation clicks navigating depths.' },
      { hint: 'Playful', rationale: 'Acrobatic intelligent behavior riding boat wakes.' }
    ],
    balanced: [
      { hint: 'Blowhole', rationale: 'Cranial respiratory opening breathing surface air.' },
      { hint: 'Flippers', rationale: 'Streamlined pectoral limbs steering through waves.' },
      { hint: 'Ocean', rationale: 'Marine saltwater environment.' }
    ],
    easy: [
      { hint: 'Swim', rationale: 'Fast fluid locomotion through water.' },
      { hint: 'Bottle', rationale: 'Common snout shape descriptor.' },
      { hint: 'Whistle', rationale: 'Vocal acoustic communication clicks and chirps.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Intelligent aquatic mammal leaping in ocean pods.' }
  },
  {
    word: 'Owl',
    subtle: [
      { hint: 'Barn', rationale: 'Rural wooden structure commonly chosen for roosting.' },
      { hint: 'Silent', rationale: 'Specialized fringed feathers muting flight sound.' },
      { hint: 'Wisdom', rationale: 'Mythological and folklore virtue linked to the bird.' }
    ],
    balanced: [
      { hint: 'Nocturnal', rationale: 'Nighttime waking and hunting cycle.' },
      { hint: 'Hoot', rationale: 'Distinct low rhythmic vocal call in the dark.' },
      { hint: 'Talons', rationale: 'Curved sharp claws seizing field mice.' }
    ],
    easy: [
      { hint: 'Feathers', rationale: 'Soft plumage insulating the raptor.' },
      { hint: 'Wings', rationale: 'Spanned limbs gliding silently through night.' },
      { hint: 'Bird', rationale: 'Avian raptor class.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Nocturnal predatory bird with swivel head and silent flight.' }
  },
  {
    word: 'Giraffe',
    subtle: [
      { hint: 'Savannah', rationale: 'African grassland dotted with acacia trees.' },
      { hint: 'Spots', rationale: 'Distinct polygon patches breaking up silhouette.' },
      { hint: 'Acacia', rationale: 'Thorny tree whose high leaves form staple diet.' }
    ],
    balanced: [
      { hint: 'Leaves', rationale: 'Foliage plucked from high branches.' },
      { hint: 'Tallest', rationale: 'Record stature among all terrestrial animals.' },
      { hint: 'Tongue', rationale: 'Prehensile 45-centimeter purple grasping organ.' }
    ],
    easy: [
      { hint: 'Neck', rationale: 'Elongated cervical vertebrae reaching treetops.' },
      { hint: 'Legs', rationale: 'Slender stilt-like limbs supporting height.' },
      { hint: 'Africa', rationale: 'Continent of native habitat.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Tallest land mammal with spotted coat and towering neck.' }
  },
  {
    word: 'Octopus',
    subtle: [
      { hint: 'Ink', rationale: 'Dark defensive cloud squirted to blind predators.' },
      { hint: 'Coral', rationale: 'Reef crevices where dens are hidden.' },
      { hint: 'Clever', rationale: 'High problem-solving cognitive intelligence.' }
    ],
    balanced: [
      { hint: 'Tentacles', rationale: 'Flexible suction-lined muscular arms.' },
      { hint: 'Suction', rationale: 'Circular adhesive cups gripping surfaces.' },
      { hint: 'Camouflage', rationale: 'Rapid color and texture changing skin.' }
    ],
    easy: [
      { hint: 'Eight', rationale: 'Exact number of flexible grasping limbs.' },
      { hint: 'Ocean', rationale: 'Saltwater seabed domain.' },
      { hint: 'Mollusk', rationale: 'Soft-bodied cephalopod invertebrate family.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Eight-armed intelligent marine mollusk squirting ink.' }
  },
  {
    word: 'Elephant',
    subtle: [
      { hint: 'Memory', rationale: 'Legendary cognitive capacity to remember herds.' },
      { hint: 'Ivory', rationale: 'Valuable mineralized dentin in curved tusks.' },
      { hint: 'Herd', rationale: 'Matriarchal multi-generational family unit.' }
    ],
    balanced: [
      { hint: 'Tusks', rationale: 'Elongated ivory incisors used for digging and defense.' },
      { hint: 'Ears', rationale: 'Enormous flapping cooling fans shaped like continents.' },
      { hint: 'Huge', rationale: 'Massive scale as largest living land mammal.' }
    ],
    easy: [
      { hint: 'Trunk', rationale: 'Long muscular prehensile nasal appendage.' },
      { hint: 'Stomp', rationale: 'Heavy reverberating footfall across plains.' },
      { hint: 'Grey', rationale: 'Thick wrinkled hide color.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Giant land mammal with trunk, tusks, and broad ears.' }
  },
  {
    word: 'Cheetah',
    subtle: [
      { hint: 'Sprint', rationale: 'Short explosive burst exceeding 100 km/h.' },
      { hint: 'Savannah', rationale: 'Open African plains offering clear chase paths.' },
      { hint: 'Tears', rationale: 'Black facial stripes running from eyes to mouth.' }
    ],
    balanced: [
      { hint: 'Fastest', rationale: 'Global title holder for terrestrial acceleration.' },
      { hint: 'Spots', rationale: 'Solid round black markings across golden coat.' },
      { hint: 'Chase', rationale: 'High-speed pursuit of gazelles and impalas.' }
    ],
    easy: [
      { hint: 'Speed', rationale: 'Defining physical performance capability.' },
      { hint: 'Feline', rationale: 'Large carnivorous cat family member.' },
      { hint: 'Claws', rationale: 'Semi-retractable cleats providing traction.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Fastest land animal with black spots and tear stripes.' }
  },
  {
    word: 'Panda',
    subtle: [
      { hint: 'Sichuan', rationale: 'Chinese mountain province holding wild reserves.' },
      { hint: 'Lazy', rationale: 'Placid low-energy lifestyle conserving calories.' },
      { hint: 'Gentle', rationale: 'Peaceful demeanor beloved worldwide.' }
    ],
    balanced: [
      { hint: 'Bamboo', rationale: 'Fibrous green stalks comprising 99% of diet.' },
      { hint: 'China', rationale: 'National symbolic treasure and native home.' },
      { hint: 'Fur', rationale: 'Thick woolly insulating coat.' }
    ],
    easy: [
      { hint: 'Black', rationale: 'Color of ears, eye patches, and legs.' },
      { hint: 'White', rationale: 'Color of belly and face fur.' },
      { hint: 'Climb', rationale: 'Acrobatic tree-resting behavior.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Black and white Chinese bear subsisting on bamboo.' }
  },
  {
    word: 'Wolf',
    subtle: [
      { hint: 'Moon', rationale: 'Celestial body associated with vocal choruses.' },
      { hint: 'Alpha', rationale: 'Dominant breeding pair leading the group.' },
      { hint: 'Wilderness', rationale: 'Remote boreal forests and tundra habitat.' }
    ],
    balanced: [
      { hint: 'Pack', rationale: 'Cooperative social hunting family unit.' },
      { hint: 'Howl', rationale: 'Long haunting vocal call echoing across hills.' },
      { hint: 'Canine', rationale: 'Wild ancestor of the domestic dog.' }
    ],
    easy: [
      { hint: 'Fang', rationale: 'Sharp pointed canine tooth gripping prey.' },
      { hint: 'Fur', rationale: 'Thick grey winter coat shedding water.' },
      { hint: 'Forest', rationale: 'Dense woodland roaming ground.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Apex pack canine known for howling under the moon.' }
  },
  {
    word: 'Chameleon',
    subtle: [
      { hint: 'Blends', rationale: 'Disappearing into leafy surroundings.' },
      { hint: 'Branch', rationale: 'Perch held firmly by fused zygodactylous toes.' },
      { hint: 'Patience', rationale: 'Motionless stalking waiting for passing insects.' }
    ],
    balanced: [
      { hint: 'Color', rationale: 'Shifting skin pigments expressing mood and warmth.' },
      { hint: 'Tongue', rationale: 'Ballistic elastic projection catching flies.' },
      { hint: 'Reptile', rationale: 'Scaly cold-blooded vertebrate class.' }
    ],
    easy: [
      { hint: 'Lizard', rationale: 'Suborder of scaly reptiles.' },
      { hint: 'Eyes', rationale: 'Independently swiveling 360-degree vision turrets.' },
      { hint: 'Tail', rationale: 'Prehensile curling fifth anchor gripping twigs.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Color-changing reptile with independent swiveling eyes.' }
  },
  {
    word: 'Flamingo',
    subtle: [
      { hint: 'Balance', rationale: 'Poised stance resting effortlessly on single foot.' },
      { hint: 'Lagoon', rationale: 'Shallow alkaline lake breeding territory.' },
      { hint: 'Flock', rationale: 'Massive colony of thousands displaying in unison.' }
    ],
    balanced: [
      { hint: 'Pink', rationale: 'Vibrant plumage color derived from carotenoid algae.' },
      { hint: 'Wading', rationale: 'Walking through shallow brackish waters.' },
      { hint: 'Beak', rationale: 'Curved down-turned filter-feeding bill.' }
    ],
    easy: [
      { hint: 'Feathers', rationale: 'Bright coral plumage covering wings.' },
      { hint: 'Legs', rationale: 'Extremely long slender stilt limbs.' },
      { hint: 'Bird', rationale: 'Avian tropical waterbird class.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Pink wading bird balancing on one stilt leg.' }
  },
  {
    word: 'Koala',
    subtle: [
      { hint: 'Sleepy', rationale: 'Dozing up to 20 hours daily to conserve energy.' },
      { hint: 'Canopy', rationale: 'High treetop resting place.' },
      { hint: 'Branch', rationale: 'Wooden perch held securely during naps.' }
    ],
    balanced: [
      { hint: 'Eucalyptus', rationale: 'Toxic fragrant leaves forming sole food source.' },
      { hint: 'Pouch', rationale: 'Rear-facing marsupial pouch sheltering joey.' },
      { hint: 'Australia', rationale: 'Native continent where gum forests grow.' }
    ],
    easy: [
      { hint: 'Claws', rationale: 'Sharp curved talons gripping tree bark.' },
      { hint: 'Furry', rationale: 'Soft grey woolly coat insulating against rain.' },
      { hint: 'Ears', rationale: 'Large round fluffy hearing organs.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Sleepy Australian marsupial chewing eucalyptus leaves.' }
  },
  {
    word: 'Platypus',
    subtle: [
      { hint: 'Burrow', rationale: 'Riverbank tunnel where eggs are laid.' },
      { hint: 'Creek', rationale: 'Freshwater stream where diving occurs.' },
      { hint: 'Venom', rationale: 'Painful ankle spur found on mature males.' }
    ],
    balanced: [
      { hint: 'Bill', rationale: 'Sensitive rubbery duck-like electrosensory snout.' },
      { hint: 'Eggs', rationale: 'Rare trait laying clutches despite being a mammal.' },
      { hint: 'Australia', rationale: 'Exclusive native eastern water system home.' }
    ],
    easy: [
      { hint: 'Webbed', rationale: 'Paddled feet paddling under murky water.' },
      { hint: 'Tail', rationale: 'Flat broad beaver-like fat storage paddle.' },
      { hint: 'Swim', rationale: 'Graceful underwater diving locomotion.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Unique egg-laying mammal with duck bill and beaver tail.' }
  },
  {
    word: 'Gorilla',
    subtle: [
      { hint: 'Silverback', rationale: 'Mature dominant male showing grey saddle fur.' },
      { hint: 'Jungle', rationale: 'Dense central African rainforest sanctuary.' },
      { hint: 'Chest', rationale: 'Torso beaten with cupped hands in display.' }
    ],
    balanced: [
      { hint: 'Troop', rationale: 'Cohesive family group led by elder male.' },
      { hint: 'Knuckles', rationale: 'Hand posture used for terrestrial walking.' },
      { hint: 'Strong', rationale: 'Massive muscular physical power.' }
    ],
    easy: [
      { hint: 'Primate', rationale: 'Intelligent higher order mammalian family.' },
      { hint: 'Ape', rationale: 'Tailless large hominid category.' },
      { hint: 'Black', rationale: 'Deep dark coloration of coarse coat and skin.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Largest great ape living in peaceful jungle troops.' }
  },
  {
    word: 'Sloth',
    subtle: [
      { hint: 'Slow', rationale: 'Extremely leisurely metabolic pace of life.' },
      { hint: 'Canopy', rationale: 'High rainforest treetops where life is spent.' },
      { hint: 'Algae', rationale: 'Green microscopic flora growing in fur.' }
    ],
    balanced: [
      { hint: 'Hanging', rationale: 'Suspended upside down from branches for days.' },
      { hint: 'Claws', rationale: 'Long curved hooks locking onto limbs.' },
      { hint: 'Lazy', rationale: 'Colloquial reputation from endless resting.' }
    ],
    easy: [
      { hint: 'Sleep', rationale: 'Resting state occupying majority of diurnal hours.' },
      { hint: 'Tree', rationale: 'Arboreal home rarely descended from.' },
      { hint: 'Fur', rationale: 'Long coarse shaggy hair shedding rain.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Slowest mammal hanging upside down in rainforest canopies.' }
  },
  {
    word: 'Hedgehog',
    subtle: [
      { hint: 'Garden', rationale: 'Suburban backyard where evening visits occur.' },
      { hint: 'Nocturnal', rationale: 'Night foraging schedule searching for insects.' },
      { hint: 'Snout', rationale: 'Pointed twitching nose sniffing out worms.' }
    ],
    balanced: [
      { hint: 'Spines', rationale: 'Sharp keratin quills coating back and flanks.' },
      { hint: 'Quills', rationale: 'Prickly protective needles bristling in defense.' },
      { hint: 'Curl', rationale: 'Reflexive roll into an impenetrable spiky ball.' }
    ],
    easy: [
      { hint: 'Sharp', rationale: 'Tactile sensation when touching quills.' },
      { hint: 'Ball', rationale: 'Spherical defensive shape concealing face.' },
      { hint: 'Small', rationale: 'Handheld mammalian size.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Small spiny mammal curling into protective prickly ball.' }
  },
  {
    word: 'Bald Eagle',
    subtle: [
      { hint: 'Symbol', rationale: 'Official national emblem of the United States.' },
      { hint: 'River', rationale: 'Freshwater canyon where salmon migrate.' },
      { hint: 'Nest', rationale: 'Massive stick platform built atop tall trees.' }
    ],
    balanced: [
      { hint: 'Talons', rationale: 'Curved razor-sharp yellow claws snatching fish.' },
      { hint: 'Soar', rationale: 'Riding thermal air currents high above valleys.' },
      { hint: 'Raptor', rationale: 'Predatory bird of prey classification.' }
    ],
    easy: [
      { hint: 'Feathers', rationale: 'Dark body plumage contrasting with white head.' },
      { hint: 'Wings', rationale: 'Broad two-meter span catching wind.' },
      { hint: 'Beak', rationale: 'Hooked yellow bill tearing caught prey.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Iconic North American raptor with white head plumage.' }
  },
  {
    word: 'Tiger',
    subtle: [
      { hint: 'Jungle', rationale: 'Dense Asian forests and mangrove swamps.' },
      { hint: 'Bengal', rationale: 'Famous majestic subspecies in Indian subcontinent.' },
      { hint: 'Solitary', rationale: 'Independent lifestyle hunting alone in vast territory.' }
    ],
    balanced: [
      { hint: 'Stripes', rationale: 'Black vertical camouflage bands across body.' },
      { hint: 'Orange', rationale: 'Rich fiery base coat color.' },
      { hint: 'Roar', rationale: 'Terrifying low-frequency vocal territorial rumble.' }
    ],
    easy: [
      { hint: 'Paws', rationale: 'Massive padded feet with retractable razor claws.' },
      { hint: 'Feline', rationale: 'Largest species in the big cat family.' },
      { hint: 'Fangs', rationale: 'Long canine teeth delivering fatal bite.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Largest apex wild cat with iconic black and orange stripes.' }
  },
  {
    word: 'Sea Turtle',
    subtle: [
      { hint: 'Reef', rationale: 'Coral feeding grounds teeming with jellyfish.' },
      { hint: 'Navigation', rationale: 'Incredible geomagnetic orientation crossing oceans.' },
      { hint: 'Ancient', rationale: 'Lineage surviving over one hundred million years.' }
    ],
    balanced: [
      { hint: 'Shell', rationale: 'Streamlined bony carapace protecting vital organs.' },
      { hint: 'Flippers', rationale: 'Long paddle-shaped forelimbs propelling strokes.' },
      { hint: 'Beach', rationale: 'Sandy shores where females crawl ashore to lay eggs.' }
    ],
    easy: [
      { hint: 'Ocean', rationale: 'Saltwater global marine environment.' },
      { hint: 'Swim', rationale: 'Graceful weightless gliding through waves.' },
      { hint: 'Reptile', rationale: 'Air-breathing cold-blooded marine vertebrate.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Marine reptile with carapace paddling oceans for decades.' }
  },
  {
    word: 'Zebra',
    subtle: [
      { hint: 'Savannah', rationale: 'Vast East African grasslands roamed by herds.' },
      { hint: 'Flies', rationale: 'Pests deterred by polarized striping patterns.' },
      { hint: 'Gallop', rationale: 'Fast rhythmic gait escaping predatory lions.' }
    ],
    balanced: [
      { hint: 'Stripes', rationale: 'Unmistakable alternating monochrome body markings.' },
      { hint: 'Herd', rationale: 'Large social family group grazing together.' },
      { hint: 'Mane', rationale: 'Erect stiff brush of hair along upper neck.' }
    ],
    easy: [
      { hint: 'Black', rationale: 'Dark pigment in distinctive alternating coat.' },
      { hint: 'White', rationale: 'Pale background fur contrasting with dark bands.' },
      { hint: 'Hooves', rationale: 'Solid single-toed keratin feet kicking predators.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'African wild horse species recognized by black and white stripes.' }
  },
  {
    word: 'Walrus',
    subtle: [
      { hint: 'Arctic', rationale: 'Frigid northern polar pack ice territory.' },
      { hint: 'Blubber', rationale: 'Thick insulating subcutaneous fat layer.' },
      { hint: 'Floe', rationale: 'Floating sheet of sea ice hauled out upon.' }
    ],
    balanced: [
      { hint: 'Tusks', rationale: 'Long downward-pointing ivory canine teeth.' },
      { hint: 'Whiskers', rationale: 'Sensitive stiff bristles detecting clams in mud.' },
      { hint: 'Flippers', rationale: 'Broad fleshy limbs dragging massive bulk.' }
    ],
    easy: [
      { hint: 'Heavy', rationale: 'Enormous multi-ton pinniped body weight.' },
      { hint: 'Ice', rationale: 'Frozen sea surface where herds congregate.' },
      { hint: 'Ocean', rationale: 'Cold marine feeding grounds.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Giant Arctic marine mammal with long ivory tusks and whiskers.' }
  },
  {
    word: 'Polar Bear',
    subtle: [
      { hint: 'Arctic', rationale: 'Frozen northern circumpolar habitat.' },
      { hint: 'Blubber', rationale: 'Rich fat layer providing warmth and sustenance.' },
      { hint: 'Seals', rationale: 'Primary marine prey hunted at breathing holes.' }
    ],
    balanced: [
      { hint: 'White', rationale: 'Camouflaged fur blending seamlessly into snow.' },
      { hint: 'Iceberg', rationale: 'Drifting pack ice used as hunting platforms.' },
      { hint: 'Paws', rationale: 'Enormous paddle-like feet distributing heavy weight.' }
    ],
    easy: [
      { hint: 'Snow', rationale: 'Wintry frozen landscape inhabited year-round.' },
      { hint: 'Cold', rationale: 'Subzero environment survived with dense coat.' },
      { hint: 'Swim', rationale: 'Strong endurance paddling across open arctic waters.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Apex white predator of the Arctic sea ice.' }
  },
  {
    word: 'Otter',
    subtle: [
      { hint: 'Stream', rationale: 'Flowing freshwater river or coastal kelp forest.' },
      { hint: 'Playful', rationale: 'Sliding down muddy banks and juggling pebbles.' },
      { hint: 'Shellfish', rationale: 'Clams and urchins gathered from seabed.' }
    ],
    balanced: [
      { hint: 'Floating', rationale: 'Floating on back while resting and dining.' },
      { hint: 'Whiskers', rationale: 'Sensitive muzzle hairs sensing water currents.' },
      { hint: 'Fur', rationale: 'Densest insulating coat in the animal kingdom.' }
    ],
    easy: [
      { hint: 'Swim', rationale: 'Agile undulating aquatic locomotion.' },
      { hint: 'Paws', rationale: 'Dexterous hands cracking open seafood.' },
      { hint: 'River', rationale: 'Freshwater watercourse habitat.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Playful aquatic mammal floating on its back and eating shellfish.' }
  },
  {
    word: 'Rhinoceros',
    subtle: [
      { hint: 'Mud', rationale: 'Wallow coating skin to protect against insects and sun.' },
      { hint: 'Charge', rationale: 'Sudden explosive forward rush when startled.' },
      { hint: 'Poaching', rationale: 'Conservation crisis targeting keratin horns.' }
    ],
    balanced: [
      { hint: 'Armor', rationale: 'Thick folded grey hide resembling plate mail.' },
      { hint: 'Heavy', rationale: 'Massive multi-ton herbivorous bulk.' },
      { hint: 'Savannah', rationale: 'African and Asian grassland roaming grounds.' }
    ],
    easy: [
      { hint: 'Horn', rationale: 'Solid keratin growth protruding from snout.' },
      { hint: 'Grey', rationale: 'Slate hue of thick wrinkled body.' },
      { hint: 'Herbivore', rationale: 'Plant-eating dietary classification.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Heavy armoured herbivore with prominent snout horn.' }
  },
  {
    word: 'Parrot',
    subtle: [
      { hint: 'Perch', rationale: 'Wooden branch or cage rod gripped tightly.' },
      { hint: 'Jungle', rationale: 'Lush tropical rainforest canopy.' },
      { hint: 'Pirate', rationale: 'Maritime folklore companion perched on shoulder.' }
    ],
    balanced: [
      { hint: 'Mimic', rationale: 'Remarkable vocal imitation of human speech.' },
      { hint: 'Feathers', rationale: 'Brilliant vibrant scarlet, blue, and green plumage.' },
      { hint: 'Beak', rationale: 'Curved hooked bill cracking hard nuts.' }
    ],
    easy: [
      { hint: 'Talk', rationale: 'Acoustic ability to repeat words and phrases.' },
      { hint: 'Wings', rationale: 'Colorful feathered appendages enabling flight.' },
      { hint: 'Bird', rationale: 'Avian companion category.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Colorful talking bird with hooked beak.' }
  },
  {
    word: 'Hippopotamus',
    subtle: [
      { hint: 'Submerged', rationale: 'Resting underwater with only eyes and nostrils showing.' },
      { hint: 'Riverbank', rationale: 'Muddy shoreline where nocturnal grazing starts.' },
      { hint: 'Territory', rationale: 'Aggressively defended aquatic zone.' }
    ],
    balanced: [
      { hint: 'Yawn', rationale: 'Intimidating wide gape displaying tusks.' },
      { hint: 'Tusks', rationale: 'Massive ivory teeth lining bottom jaw.' },
      { hint: 'Heavy', rationale: 'Barrel-shaped multi-ton semi-aquatic giant.' }
    ],
    easy: [
      { hint: 'Water', rationale: 'Freshwater river and lake home.' },
      { hint: 'Africa', rationale: 'Continent containing native river basins.' },
      { hint: 'Mouth', rationale: 'Enormous jaw opening nearly 180 degrees.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Massive river mammal with enormous jaws and tusks.' }
  },
  {
    word: 'Squirrel',
    subtle: [
      { hint: 'Acorn', rationale: 'Oak tree nut gathered and cached underground.' },
      { hint: 'Autumn', rationale: 'Busiest season frantically burying winter reserves.' },
      { hint: 'Park', rationale: 'Urban green space where bold scampers occur.' }
    ],
    balanced: [
      { hint: 'Bury', rationale: 'Digging small holes in soil to hide nuts.' },
      { hint: 'Branch', rationale: 'Slender tree limbs navigated at high speed.' },
      { hint: 'Cheeks', rationale: 'Expandable facial pouches transporting seeds.' }
    ],
    easy: [
      { hint: 'Tail', rationale: 'Bushy curved plume balancing leaps.' },
      { hint: 'Climb', rationale: 'Rapid spiraling ascent up tree trunks.' },
      { hint: 'Nuts', rationale: 'Staple hard-shelled rodent diet.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Agile bushy-tailed rodent gathering acorns in trees.' }
  },
  {
    word: 'Peacock',
    subtle: [
      { hint: 'Palace', rationale: 'Historic royal gardens where birds strutted.' },
      { hint: 'Pride', rationale: 'Symbolic association with vain showing off.' },
      { hint: 'Courtship', rationale: 'Romantic ritual fanning plumage to attract peahens.' }
    ],
    balanced: [
      { hint: 'Train', rationale: 'Massive elongated tail covert feathers.' },
      { hint: 'Eyespots', rationale: 'Iridescent circular markings adorning plumage.' },
      { hint: 'Strut', rationale: 'Proud rhythmic pacing displaying fan.' }
    ],
    easy: [
      { hint: 'Feathers', rationale: 'Shimmering emerald and cobalt quills.' },
      { hint: 'Fan', rationale: 'Semicircular posture opening tail wide.' },
      { hint: 'Bird', rationale: 'Spectacular decorative pheasant species.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Magnificent decorative bird fanning shimmering eyespot tail.' }
  },
  {
    word: 'Lion',
    subtle: [
      { hint: 'Pride', rationale: 'Social family group of females and cubs.' },
      { hint: 'Savannah', rationale: 'Sun-baked African plains habitat.' },
      { hint: 'Royalty', rationale: 'Cultural title as undisputed king of beasts.' }
    ],
    balanced: [
      { hint: 'Mane', rationale: 'Majestic dark collar of hair around male neck.' },
      { hint: 'Roar', rationale: 'Deep resonant territorial roar carrying five miles.' },
      { hint: 'Hunt', rationale: 'Cooperative ambush led by lionesses.' }
    ],
    easy: [
      { hint: 'Feline', rationale: 'Apex golden wild cat family.' },
      { hint: 'Paws', rationale: 'Large muscular padded feet with sharp claws.' },
      { hint: 'Africa', rationale: 'Continent where wild prides roam.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'King of the jungle boasting a regal mane and loud roar.' }
  },
  {
    word: 'Fox',
    subtle: [
      { hint: 'Cunning', rationale: 'Folklore reputation for cleverness and stealth.' },
      { hint: 'Den', rationale: 'Underground burrow sheltering kits.' },
      { hint: 'Nocturnal', rationale: 'Dusk and nighttime foraging habits.' }
    ],
    balanced: [
      { hint: 'Red', rationale: 'Fiery ginger coat color.' },
      { hint: 'Sneaky', rationale: 'Silent cautious stalking demeanor.' },
      { hint: 'Pounce', rationale: 'Graceful vertical leap diving headfirst into snow.' }
    ],
    easy: [
      { hint: 'Tail', rationale: 'Thick bushy white-tipped brush.' },
      { hint: 'Ears', rationale: 'Pointed erect triangular auditory cones.' },
      { hint: 'Forest', rationale: 'Woodland and meadow foraging grounds.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Clever red-coated wild canine with bushy brush tail.' }
  },
  {
    word: 'Badger',
    subtle: [
      { hint: 'Sett', rationale: 'Extensive underground multi-chamber network.' },
      { hint: 'Nocturnal', rationale: 'Night waking hours emerging after twilight.' },
      { hint: 'Fierce', rationale: 'Tenacious aggressive defense against larger animals.' }
    ],
    balanced: [
      { hint: 'Stripes', rationale: 'Distinct black and white facial mask.' },
      { hint: 'Digging', rationale: 'Excavating soil with sturdy curved front claws.' },
      { hint: 'Burrow', rationale: 'Subterranean tunnels winding underground.' }
    ],
    easy: [
      { hint: 'Claws', rationale: 'Strong broad digging implements on front paws.' },
      { hint: 'Ground', rationale: 'Earth surface excavated for earthworms.' },
      { hint: 'Stout', rationale: 'Low-slung muscular compact body build.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Stocky burrowing creature with striped face and powerful claws.' }
  },
  {
    word: 'Meerkat',
    subtle: [
      { hint: 'Kalahari', rationale: 'Southern African desert home terrain.' },
      { hint: 'Burrow', rationale: 'Interconnected subterranean warren sheltering mob.' },
      { hint: 'Forage', rationale: 'Digging frantically for scorpions in sand.' }
    ],
    balanced: [
      { hint: 'Sentry', rationale: 'Lookout perched high on hind legs scanning for hawks.' },
      { hint: 'Upright', rationale: 'Characteristic tall standing posture on rear paws.' },
      { hint: 'Clan', rationale: 'Tight-knit cooperative social group.' }
    ],
    easy: [
      { hint: 'Desert', rationale: 'Arid sandy scrub environment.' },
      { hint: 'Small', rationale: 'Slender miniature mongoose relative.' },
      { hint: 'Watch', rationale: 'Constant visual vigil over surrounding plains.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Desert sentinel standing on hind legs on sentry duty.' }
  },
  {
    word: 'Jaguar',
    subtle: [
      { hint: 'Amazon', rationale: 'Lush tropical South American river basin.' },
      { hint: 'Bite', rationale: 'Strongest jaw bite force crushing turtle shells.' },
      { hint: 'Stealth', rationale: 'Silent ambush predator through murky rainforest.' }
    ],
    balanced: [
      { hint: 'Rosettes', rationale: 'Rose-shaped black spot clusters with center dots.' },
      { hint: 'Swim', rationale: 'Love of water frequently hunting caimans in rivers.' },
      { hint: 'Jungle', rationale: 'Dense green rainforest hunting territory.' }
    ],
    easy: [
      { hint: 'Feline', rationale: 'Third-largest wild cat species globally.' },
      { hint: 'Spots', rationale: 'Camouflaged markings breaking up golden coat.' },
      { hint: 'Paws', rationale: 'Heavy padded feet moving silently across ground.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Powerful South American big cat with rosette spots.' }
  },
  {
    word: 'Falcon',
    subtle: [
      { hint: 'Peregrine', rationale: 'Famous species setting dive speed records.' },
      { hint: 'Hood', rationale: 'Leather cap used in traditional hunting sports.' },
      { hint: 'Cliff', rationale: 'High crag or skyscraper ledge chosen for eyries.' }
    ],
    balanced: [
      { hint: 'Dive', rationale: 'High-speed stoop exceeding 300 km/h in descent.' },
      { hint: 'Fastest', rationale: 'Global title holder for absolute flight velocity.' },
      { hint: 'Talons', rationale: 'Sharp needle claws striking birds mid-air.' }
    ],
    easy: [
      { hint: 'Raptor', rationale: 'Fierce predatory bird of prey category.' },
      { hint: 'Wings', rationale: 'Pointed swept-back aerodynamic airfoils.' },
      { hint: 'Beak', rationale: 'Notched sharp bill dispatching captured prey.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Speed-record raptor plunging at incredible velocity.' }
  }
];

fs.writeFileSync('scripts/curated_vocabulary/part3_animals.json', JSON.stringify({ animals }, null, 2), 'utf8');
console.log('Successfully wrote part3_animals.json (35 words)');
