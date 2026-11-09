const fs = require('fs');

const famousPeople = [
  {
    word: 'Albert Einstein',
    subtle: [
      { hint: 'Patent', rationale: 'Early Bern workplace where miracle year papers were penned.' },
      { hint: 'Chalkboard', rationale: 'Writing surface filled with complex equations.' },
      { hint: 'Hair', rationale: 'Iconic wild white uncombed hairstyle.' }
    ],
    balanced: [
      { hint: 'Relativity', rationale: 'Revolutionary physical theory of space and time.' },
      { hint: 'Physicist', rationale: 'Scientific vocation exploring laws of the cosmos.' },
      { hint: 'Nobel', rationale: 'Prestigious physics prize awarded in 1921.' }
    ],
    easy: [
      { hint: 'Genius', rationale: 'Universal cultural synonym for supreme intellect.' },
      { hint: 'Science', rationale: 'Broad intellectual discipline.' },
      { hint: 'Energy', rationale: 'Mass equivalence formulated in famous equation.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Legendary theoretical physicist renowned for relativity.' }
  },
  {
    word: 'Leonardo da Vinci',
    subtle: [
      { hint: 'Mirror', rationale: 'Backwards notebook script decipherable in reflection.' },
      { hint: 'Florence', rationale: 'Italian Renaissance cradle of his artistic development.' },
      { hint: 'Notebooks', rationale: 'Sketched codices exploring anatomy and engineering.' }
    ],
    balanced: [
      { hint: 'Mona', rationale: 'First half of portrait title painted with elusive smile.' },
      { hint: 'Renaissance', rationale: 'Historical European cultural rebirth era.' },
      { hint: 'Polymath', rationale: 'Mastery across art, mechanics, and science.' }
    ],
    easy: [
      { hint: 'Painter', rationale: 'Artistic discipline creating world masterpieces.' },
      { hint: 'Inventor', rationale: 'Visionary designing flying machines centuries early.' },
      { hint: 'Italian', rationale: 'Nationality of historical genius.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Ultimate Renaissance genius who painted Mona Lisa.' }
  },
  {
    word: 'Michael Jackson',
    subtle: [
      { hint: 'Neverland', rationale: 'Eccentric California ranch amusement estate.' },
      { hint: 'Fedora', rationale: 'Black felt hat tilted dramatically over eyes.' },
      { hint: 'Glove', rationale: 'Single white rhinestone handwear.' }
    ],
    balanced: [
      { hint: 'Moonwalk', rationale: 'Signature illusionary backward gliding dance.' },
      { hint: 'Thriller', rationale: 'Record-setting bestselling zombie music album.' },
      { hint: 'King', rationale: 'Colloquial royal title within pop music.' }
    ],
    easy: [
      { hint: 'Singer', rationale: 'Vocal performance profession.' },
      { hint: 'Dance', rationale: 'Electrifying stage choreography.' },
      { hint: 'Pop', rationale: 'Commercial musical genre defined by his career.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'The King of Pop famous for Moonwalk and Thriller.' }
  },
  {
    word: 'Steve Jobs',
    subtle: [
      { hint: 'Turtleneck', rationale: 'Signature black Issey Miyake long-sleeve uniform.' },
      { hint: 'Garage', rationale: 'Silicon Valley birthplace of first circuit board.' },
      { hint: 'Keynote', rationale: 'Masterclass product launches introducing one more thing.' }
    ],
    balanced: [
      { hint: 'iPhone', rationale: 'Revolutionary touchscreen device launched in 2007.' },
      { hint: 'Cupertino', rationale: 'California headquarters city of company co-founded.' },
      { hint: 'Macintosh', rationale: 'Groundbreaking graphical computer debuted in 1984.' }
    ],
    easy: [
      { hint: 'Visionary', rationale: 'Reputation for redefining consumer technology.' },
      { hint: 'Founder', rationale: 'Role building personal computing empire.' },
      { hint: 'Design', rationale: 'Obsessive focus on minimalist elegant hardware.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Co-founder of Apple known for sleek design and keynotes.' }
  },
  {
    word: 'William Shakespeare',
    subtle: [
      { hint: 'Avon', rationale: 'English river flowing through his Stratford birthplace.' },
      { hint: 'Quill', rationale: 'Feather pen dipped into ink to compose sonnets.' },
      { hint: 'Folio', rationale: 'Historic 1623 printed collection of dramatic plays.' }
    ],
    balanced: [
      { hint: 'Globe', rationale: 'Open-air London circular playhouse.' },
      { hint: 'Hamlet', rationale: 'Tragedy contemplating to be or not to be.' },
      { hint: 'Sonnet', rationale: 'Fourteen-line poetic rhyming structure.' }
    ],
    easy: [
      { hint: 'Playwright', rationale: 'Vocation crafting enduring theatrical scripts.' },
      { hint: 'Poet', rationale: 'Literary master of verse and rhythm.' },
      { hint: 'Theater', rationale: 'Stage performance venue for comedies and tragedies.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'English literary giant and Globe playwright.' }
  },
  {
    word: 'Cleopatra',
    subtle: [
      { hint: 'Asp', rationale: 'Venomous serpent folklore says caused her demise.' },
      { hint: 'Alexandria', rationale: 'Mediterranean port capital of Ptolemaic dynasty.' },
      { hint: 'Barge', rationale: 'Gilded purple-sailed vessel sailing to meet Antony.' }
    ],
    balanced: [
      { hint: 'Pharaoh', rationale: 'Ancient royal sovereign ruler of the Nile realm.' },
      { hint: 'Queen', rationale: 'Sovereign female monarch title.' },
      { hint: 'Nile', rationale: 'Great river nourishing her fertile empire.' }
    ],
    easy: [
      { hint: 'Egypt', rationale: 'North African kingdom she ruled.' },
      { hint: 'Gold', rationale: 'Precious metal adorning royal crowns and regalia.' },
      { hint: 'Ancient', rationale: 'Historical era preceding common era.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Last active pharaoh of Ptolemaic Egypt.' }
  },
  {
    word: 'Wolfgang Mozart',
    subtle: [
      { hint: 'Salzburg', rationale: 'Austrian mountain birthplace where prodigy started.' },
      { hint: 'Prodigy', rationale: 'Child composing symphonies by age five.' },
      { hint: 'Amadeus', rationale: 'Middle baptismal name and title of biopic.' }
    ],
    balanced: [
      { hint: 'Requiem', rationale: 'Unfinished haunting final funeral mass.' },
      { hint: 'Symphony', rationale: 'Complex multi-movement orchestral masterpiece.' },
      { hint: 'Opera', rationale: 'Theatrical vocal staging like Magic Flute.' }
    ],
    easy: [
      { hint: 'Composer', rationale: 'Vocation writing musical scores.' },
      { hint: 'Piano', rationale: 'Keyboard instrument mastered from childhood.' },
      { hint: 'Classical', rationale: 'Era and genre of orchestral music.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Classical music prodigy and prolific Austrian composer.' }
  },
  {
    word: 'Neil Armstrong',
    subtle: [
      { hint: 'Tranquility', rationale: 'Lunar lunar plain where Eagle landed.' },
      { hint: 'Eagle', rationale: 'Call sign of Apollo 11 lunar module.' },
      { hint: 'Footprint', rationale: 'Historic boot impression left in lunar dust.' }
    ],
    balanced: [
      { hint: 'Apollo', rationale: 'NASA manned spaceflight program.' },
      { hint: 'Leap', rationale: 'Giant stride taken for mankind.' },
      { hint: 'Astronaut', rationale: 'Spacewalking flight vocation.' }
    ],
    easy: [
      { hint: 'Moon', rationale: 'Celestial satellite walked on in 1969.' },
      { hint: 'Space', rationale: 'Vacuum realm beyond Earth atmosphere.' },
      { hint: 'First', rationale: 'Historic pioneer status among all humans.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'First human to walk upon the Moon during Apollo 11.' }
  },
  {
    word: 'Serena Williams',
    subtle: [
      { hint: 'Compton', rationale: 'California public park courts where training began.' },
      { hint: 'Slam', rationale: 'Grand major championship won 23 times in singles.' },
      { hint: 'Ace', rationale: 'Untouchable 120 mph baseline serve.' }
    ],
    balanced: [
      { hint: 'Racket', rationale: 'Strung sports equipment driving winner shots.' },
      { hint: 'Wimbledon', rationale: 'Prestigious London grass court championship.' },
      { hint: 'Champion', rationale: 'Dominant global record-breaking title holder.' }
    ],
    easy: [
      { hint: 'Tennis', rationale: 'Sport dominated across multiple decades.' },
      { hint: 'Court', rationale: 'Marked rectangular playing surface.' },
      { hint: 'Athlete', rationale: 'Elite competitive sports professional.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Record-setting tennis legend with 23 Grand Slam singles.' }
  },
  {
    word: 'Taylor Swift',
    subtle: [
      { hint: 'Eras', rationale: 'Record-breaking career-spanning worldwide stadium tour.' },
      { hint: 'Thirteen', rationale: 'Famous lucky number penned on back of hand.' },
      { hint: 'Scarf', rationale: 'Winter accessory mentioned in autumn anthem.' }
    ],
    balanced: [
      { hint: 'Guitar', rationale: 'Acoustic instrument strummed while writing songs.' },
      { hint: 'Grammy', rationale: 'Music industry prize won four times for Album of Year.' },
      { hint: 'Country', rationale: 'Nashville musical roots before pop transition.' }
    ],
    easy: [
      { hint: 'Singer', rationale: 'Vocal performance profession.' },
      { hint: 'Pop', rationale: 'Mainstream chart-topping musical genre.' },
      { hint: 'Concert', rationale: 'Packed stadium live performance event.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Megastar singer-songwriter known for Eras Tour.' }
  },
  {
    word: 'Elon Musk',
    subtle: [
      { hint: 'Falcon', rationale: 'Reusable orbital booster rocket family.' },
      { hint: 'Mars', rationale: 'Red planet targeted for eventual human colony.' },
      { hint: 'Gigafactory', rationale: 'Massive lithium-ion battery production facility.' }
    ],
    balanced: [
      { hint: 'SpaceX', rationale: 'Commercial space exploration venture founded.' },
      { hint: 'Rocket', rationale: 'Vertical launch vehicle touching down on pads.' },
      { hint: 'Billionaire', rationale: 'Wealth category topping global net worth lists.' }
    ],
    easy: [
      { hint: 'Electric', rationale: 'Battery vehicle powertrain revolutionized.' },
      { hint: 'Tech', rationale: 'Silicon Valley commercial innovation sector.' },
      { hint: 'Ceo', rationale: 'Executive business leadership title.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Tech entrepreneur behind Tesla and SpaceX.' }
  },
  {
    word: 'Marilyn Monroe',
    subtle: [
      { hint: 'Subway', rationale: 'Sidewalk grating blowing up pleated white dress.' },
      { hint: 'Beauty', rationale: 'Facial mole and timeless glamorous look.' },
      { hint: 'President', rationale: 'Happy birthday serenade sung in shimmering dress.' }
    ],
    balanced: [
      { hint: 'Blonde', rationale: 'Bleached platinum curls defining screen icon persona.' },
      { hint: 'Diamonds', rationale: 'Gems famously declared a girl best friend.' },
      { hint: 'Hollywood', rationale: 'Golden Age cinema entertainment capital.' }
    ],
    easy: [
      { hint: 'Actress', rationale: 'Screen performance profession in classic movies.' },
      { hint: 'Dress', rationale: 'Famous white billowing dress from Seven Year Itch.' },
      { hint: 'Icon', rationale: 'Enduring twentieth-century cultural symbol.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Hollywood golden era actress and platinum icon.' }
  },
  {
    word: 'Muhammad Ali',
    subtle: [
      { hint: 'Rumble', rationale: 'Historic jungle fight against Foreman in Zaire.' },
      { hint: 'Rope', rationale: 'Tactical defensive leaning technique absorbing blows.' },
      { hint: 'Butterfly', rationale: 'Insect evoking light floating footwork.' }
    ],
    balanced: [
      { hint: 'Gloves', rationale: 'Padded leather hand coverings delivering punches.' },
      { hint: 'Ring', rationale: 'Roped square arena for heavyweight bouts.' },
      { hint: 'Greatest', rationale: 'Unapologetic personal self-proclamation.' }
    ],
    easy: [
      { hint: 'Boxer', rationale: 'Combat sports profession.' },
      { hint: 'Punch', rationale: 'Explosive fist strike.' },
      { hint: 'Champion', rationale: 'Three-time world heavyweight belt winner.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Legendary heavyweight champion who floated like a butterfly.' }
  },
  {
    word: 'Frida Kahlo',
    subtle: [
      { hint: 'Monobrow', rationale: 'Unapologetic connected facial eyebrow feature.' },
      { hint: 'Casazul', rationale: 'Cobalt blue home and sanctuary in Coyoacán.' },
      { hint: 'Bus', rationale: 'Fateful youthful accident causing lifelong spinal pain.' }
    ],
    balanced: [
      { hint: 'Portrait', rationale: 'Intense self-reflective paintings of inner grief.' },
      { hint: 'Folkloric', rationale: 'Traditional indigenous Mexican dress and flowers.' },
      { hint: 'Surreal', rationale: 'Dreamlike symbolic imagery blending reality.' }
    ],
    easy: [
      { hint: 'Painter', rationale: 'Fine arts visual vocation.' },
      { hint: 'Mexico', rationale: 'Homeland inspiring vibrant color and motifs.' },
      { hint: 'Artist', rationale: 'Creative visual fine artist category.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Iconic Mexican painter renowned for unibrow self-portraits.' }
  },
  {
    word: 'Nelson Mandela',
    subtle: [
      { hint: 'Robben', rationale: 'Island prison where 18 of 27 years were endured.' },
      { hint: 'Madiba', rationale: 'Affectionate Xhosa clan name used by admirers.' },
      { hint: 'Rugby', rationale: '1995 World Cup used to unite fractured nation.' }
    ],
    balanced: [
      { hint: 'Apartheid', rationale: 'Racial segregation regime dismantled through peace.' },
      { hint: 'Prison', rationale: 'Confinement lasting 27 years for resistance.' },
      { hint: 'Reconciliation', rationale: 'Philosophy forgiving oppressors to heal.' }
    ],
    easy: [
      { hint: 'President', rationale: 'First democratically elected Black head of state.' },
      { hint: 'Leader', rationale: 'Inspirational global statesman.' },
      { hint: 'Peace', rationale: 'Nobel prize-winning pursuit of harmony.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Anti-apartheid hero and South Africa first Black president.' }
  },
  {
    word: 'Stephen Hawking',
    subtle: [
      { hint: 'Wheelchair', rationale: 'Motorized mobility chair operated for decades.' },
      { hint: 'Synthesizer', rationale: 'Distinct robotic vocal computer speech box.' },
      { hint: 'Cambridge', rationale: 'British university where he held Lucasian Chair.' }
    ],
    balanced: [
      { hint: 'Cosmology', rationale: 'Study of origin and fate of the universe.' },
      { hint: 'Singularity', rationale: 'Infinitely dense center of collapsed matter.' },
      { hint: 'Radiation', rationale: 'Theoretical particle emission from black holes.' }
    ],
    easy: [
      { hint: 'Physicist', rationale: 'Theoretical scientific vocation.' },
      { hint: 'Genius', rationale: 'Towering intellectual mind triumphing over illness.' },
      { hint: 'Space', rationale: 'Cosmic expanse investigated in bestselling book.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Theoretical physicist who explored black holes and time.' }
  },
  {
    word: 'Walt Disney',
    subtle: [
      { hint: 'Steamboat', rationale: 'Willie cartoon debuting synchronized cartoon sound.' },
      { hint: 'Castle', rationale: 'Fairy tale spires forming studio opening logo.' },
      { hint: 'Theme', rationale: 'Amusement park concept where stories come alive.' }
    ],
    balanced: [
      { hint: 'Mickey', rationale: 'Whimsical round-eared mouse character created.' },
      { hint: 'Animation', rationale: 'Hand-drawn frame-by-frame film artistry.' },
      { hint: 'Magic', rationale: 'Imaginative fantasy brand identity.' }
    ],
    easy: [
      { hint: 'Cartoon', rationale: 'Animated character entertainment medium.' },
      { hint: 'Park', rationale: 'Kingdom resort built in California and Florida.' },
      { hint: 'Movies', rationale: 'Animated feature films delighting generations.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Pioneer of animated films and theme park kingdoms.' }
  },
  {
    word: 'Vincent van Gogh',
    subtle: [
      { hint: 'Arles', rationale: 'Sun-drenched French town where Yellow House stood.' },
      { hint: 'Bandage', rationale: 'Head dressing worn after tragic ear incident.' },
      { hint: 'Sunflower', rationale: 'Vibrant yellow still life floral paintings.' }
    ],
    balanced: [
      { hint: 'Starry', rationale: 'Swirling nocturnal celestial masterpiece painting.' },
      { hint: 'Swirls', rationale: 'Expressive thick brushstrokes curving across sky.' },
      { hint: 'Dutch', rationale: 'Netherlands heritage of the troubled artist.' }
    ],
    easy: [
      { hint: 'Painter', rationale: 'Post-impressionist visual arts vocation.' },
      { hint: 'Canvas', rationale: 'Fabric surface laden with thick impasto oil paint.' },
      { hint: 'Artist', rationale: 'Legendary creative figure.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Dutch master who painted The Starry Night.' }
  },
  {
    word: 'Audrey Hepburn',
    subtle: [
      { hint: 'Croissant', rationale: 'Pastry eaten gazing into jewelry shop window.' },
      { hint: 'Tiara', rationale: 'Sparkling hair jewel worn with Givenchy dress.' },
      { hint: 'Ambassador', rationale: 'Humanitarian goodwill role for UNICEF.' }
    ],
    balanced: [
      { hint: 'Tiffany', rationale: 'Famed Manhattan jewelry flagship in movie title.' },
      { hint: 'Glamour', rationale: 'Timeless chic fashion sophistication.' },
      { hint: 'Elegance', rationale: 'Refined poise and slender grace on screen.' }
    ],
    easy: [
      { hint: 'Actress', rationale: 'Oscar-winning cinematic performance career.' },
      { hint: 'Fashion', rationale: 'Haute couture icon partnering with Givenchy.' },
      { hint: 'Hollywood', rationale: 'Golden Age film industry.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Icon of classic cinema and Breakfast at Tiffany.' }
  },
  {
    word: 'Isaac Newton',
    subtle: [
      { hint: 'Orchard', rationale: 'Garden setting where falling fruit triggered insight.' },
      { hint: 'Prism', rationale: 'Glass crystal splitting white light into rainbow.' },
      { hint: 'Calculus', rationale: 'Mathematical branch formulated to calculate orbits.' }
    ],
    balanced: [
      { hint: 'Gravity', rationale: 'Universal attractive force governing falling bodies.' },
      { hint: 'Principia', rationale: 'Landmark 1687 Latin treatise on mechanics.' },
      { hint: 'Motion', rationale: 'Three foundational laws of classical physics.' }
    ],
    easy: [
      { hint: 'Apple', rationale: 'Fruit legendary for dropping near his seat.' },
      { hint: 'Physicist', rationale: 'Foundational scientific vocation.' },
      { hint: 'Science', rationale: 'Discipline revolutionized by his discoveries.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'English scientific pioneer who formulated gravity laws.' }
  },
  {
    word: 'Bob Marley',
    subtle: [
      { hint: 'Dreadlocks', rationale: 'Long coiled hair embodying Rastafari culture.' },
      { hint: 'Trenchtown', rationale: 'Kingston neighborhood where music began.' },
      { hint: 'Wailers', rationale: 'Musical backing group harmonizing on hits.' }
    ],
    balanced: [
      { hint: 'Reggae', rationale: 'Relaxed syncopated Jamaican musical rhythm.' },
      { hint: 'Jamaica', rationale: 'Caribbean island homeland and cultural roots.' },
      { hint: 'Guitar', rationale: 'Acoustic instrument strummed for One Love.' }
    ],
    easy: [
      { hint: 'Singer', rationale: 'Vocal performance vocation.' },
      { hint: 'Peace', rationale: 'Core philosophical message championed in song.' },
      { hint: 'Music', rationale: 'Global art form transformed by his anthems.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Reggae prophet who sang for peace, unity, and love.' }
  },
  {
    word: 'Marie Curie',
    subtle: [
      { hint: 'Pitchblende', rationale: 'Black uranium ore processed in wooden shed.' },
      { hint: 'Polonium', rationale: 'Chemical element named after her Polish homeland.' },
      { hint: 'Glow', rationale: 'Eerie green luminescence in test tubes at night.' }
    ],
    balanced: [
      { hint: 'Radium', rationale: 'Luminescent element isolated after years of toil.' },
      { hint: 'Radiation', rationale: 'Spontaneous atomic decay concept pioneered.' },
      { hint: 'Nobel', rationale: 'Only person winning prizes in two sciences.' }
    ],
    easy: [
      { hint: 'Chemist', rationale: 'Scientific laboratory vocation.' },
      { hint: 'Science', rationale: 'Groundbreaking research discipline.' },
      { hint: 'Laboratory', rationale: 'Room where isotopes were purified.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Pioneer of radioactivity winning two Nobel Prizes.' }
  },
  {
    word: 'Lionel Messi',
    subtle: [
      { hint: 'Rosario', rationale: 'Argentine city where small boy began kicking balls.' },
      { hint: 'Campnou', rationale: 'Barcelona stadium where magic unfolded.' },
      { hint: 'Left', rationale: 'Dominant foot producing curling free kicks.' }
    ],
    balanced: [
      { hint: 'Dribble', rationale: 'Effortless close-control gliding past defenders.' },
      { hint: 'Ballon', rationale: 'First word of golden trophy won eight times.' },
      { hint: 'Argentina', rationale: 'Homeland led to World Cup victory in 2022.' }
    ],
    easy: [
      { hint: 'Soccer', rationale: 'Global sport where he is hailed as GOAT.' },
      { hint: 'Goal', rationale: 'Scoring strike into the back of the net.' },
      { hint: 'Ten', rationale: 'Iconic jersey number worn on the pitch.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Eight-time Ballon d’Or winner and World Cup champion.' }
  },
  {
    word: 'Abraham Lincoln',
    subtle: [
      { hint: 'Stovepipe', rationale: 'Tall black silk top hat accentuating height.' },
      { hint: 'Cabin', rationale: 'Humble frontier log home of impoverished youth.' },
      { hint: 'Ford', rationale: 'Washington theater where tragic assassination occurred.' }
    ],
    balanced: [
      { hint: 'Gettysburg', rationale: 'Battlefield cemetery site of two-minute address.' },
      { hint: 'Beard', rationale: 'Chin whiskers grown after advice from young girl.' },
      { hint: 'Union', rationale: 'Nation preserved through four bitter years of war.' }
    ],
    easy: [
      { hint: 'President', rationale: 'Sixteenth sovereign executive leader of the US.' },
      { hint: 'Penny', rationale: 'Copper coin bearing his bearded profile.' },
      { hint: 'Civil', rationale: 'War fought between northern and southern states.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'US president who preserved the Union and abolished slavery.' }
  },
  {
    word: 'Beyoncé',
    subtle: [
      { hint: 'Destiny', rationale: 'Trio singing group launching her career.' },
      { hint: 'Beehive', rationale: 'Passionate devoted global fan community.' },
      { hint: 'Renaissance', rationale: 'Celebrated dance-infused club music album.' }
    ],
    balanced: [
      { hint: 'Queen', rationale: 'Regal moniker bestowed by music fans.' },
      { hint: 'Grammy', rationale: 'Most awarded artist in Grammy history.' },
      { hint: 'Halo', rationale: 'Beloved angelic ballad showcasing power vocals.' }
    ],
    easy: [
      { hint: 'Singer', rationale: 'Vocal performance profession.' },
      { hint: 'Pop', rationale: 'Mainstream contemporary music style.' },
      { hint: 'Dance', rationale: 'Electrifying live stage choreography.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Cultural icon and most awarded artist in Grammy history.' }
  },
  {
    word: 'Pablo Picasso',
    subtle: [
      { hint: 'Guernica', rationale: 'Black and white mural mourning bombed Basque town.' },
      { hint: 'Blue', rationale: 'Somber early melancholic monochrome period.' },
      { hint: 'Malaga', rationale: 'Spanish coastal city where prodigy was born.' }
    ],
    balanced: [
      { hint: 'Cubism', rationale: 'Avant-garde movement fragmenting planes into geometry.' },
      { hint: 'Abstract', rationale: 'Deconstructed visual style breaking realism.' },
      { hint: 'Spain', rationale: 'Iberian nation of origin and bullfight passion.' }
    ],
    easy: [
      { hint: 'Painter', rationale: 'Fine arts visual vocation.' },
      { hint: 'Canvas', rationale: 'Surface holding revolutionary oil paintings.' },
      { hint: 'Artist', rationale: 'Titan of twentieth-century modern art.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Spanish co-founder of Cubism who painted Guernica.' }
  },
  {
    word: 'Charles Darwin',
    subtle: [
      { hint: 'Beagle', rationale: 'Naval survey vessel charting five-year global voyage.' },
      { hint: 'Galapagos', rationale: 'Pacific archipelago where isolated wildlife sparked theory.' },
      { hint: 'Finches', rationale: 'Island birds displaying varied beak adaptations.' }
    ],
    balanced: [
      { hint: 'Evolution', rationale: 'Biological process of descent with modification.' },
      { hint: 'Natural', rationale: 'First half of selection theory governing survival.' },
      { hint: 'Fossils', rationale: 'Extinct bones revealing ancestral animal forms.' }
    ],
    easy: [
      { hint: 'Biologist', rationale: 'Naturalist studying living organisms.' },
      { hint: 'Species', rationale: 'Biological taxonomic classification.' },
      { hint: 'Science', rationale: 'Life sciences discipline transformed forever.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Naturalist who proposed evolution via natural selection.' }
  },
  {
    word: 'Oprah Winfrey',
    subtle: [
      { hint: 'Harpo', rationale: 'Pioneering multimedia production studio company.' },
      { hint: 'Club', rationale: 'Nationwide reading group selecting bestselling novels.' },
      { hint: 'Chicago', rationale: 'Midwest city where daily broadcast originated.' }
    ],
    balanced: [
      { hint: 'Talk', rationale: 'Daytime interview and discussion format.' },
      { hint: 'Host', rationale: 'Televised personality engaging studio audience.' },
      { hint: 'Billionaire', rationale: 'Self-made media mogul wealth status.' }
    ],
    easy: [
      { hint: 'Television', rationale: 'Broadcasting medium dominating afternoons.' },
      { hint: 'Media', rationale: 'Publishing and broadcast entertainment empire.' },
      { hint: 'Famous', rationale: 'Worldwide celebrity recognition.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Media mogul and queen of daytime talk television.' }
  },
  {
    word: 'Usain Bolt',
    subtle: [
      { hint: 'Lightning', rationale: 'Dynamic nickname mirroring speed.' },
      { hint: 'Pose', rationale: 'Signature celebratory arrow gesture pointing to sky.' },
      { hint: 'Spikes', rationale: 'Gold athletic shoes gripping synthetic track.' }
    ],
    balanced: [
      { hint: 'Sprint', rationale: 'Short explosive 100m and 200m races.' },
      { hint: 'Fastest', rationale: 'World record holder running 9.58 seconds.' },
      { hint: 'Jamaica', rationale: 'Caribbean island nation known for sprint excellence.' }
    ],
    easy: [
      { hint: 'Runner', rationale: 'Track sports vocation.' },
      { hint: 'Olympic', rationale: 'Eight-time gold medal athletic games.' },
      { hint: 'Gold', rationale: 'Medal won in three consecutive games.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Jamaican sprint legend and fastest human ever timed.' }
  },
  {
    word: 'Ludwig van Beethoven',
    subtle: [
      { hint: 'Bonn', rationale: 'German birthplace on the banks of Rhine.' },
      { hint: 'Fate', rationale: 'Famous four-note motif knocking at the door.' },
      { hint: 'Metronome', rationale: 'Early mechanical tempo device enthusiastically adopted.' }
    ],
    balanced: [
      { hint: 'Deaf', rationale: 'Sensory tragedy overcome to write late masterpieces.' },
      { hint: 'Symphony', rationale: 'Ninth monumental orchestral triumph featuring Joy.' },
      { hint: 'Sonata', rationale: 'Keyboard work including Moonlight and Appassionata.' }
    ],
    easy: [
      { hint: 'Composer', rationale: 'Musical scoring profession.' },
      { hint: 'Piano', rationale: 'Instrument played with volcanic emotional power.' },
      { hint: 'Classical', rationale: 'Bridge figure between classical and romantic eras.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'German composer who composed Ninth Symphony while deaf.' }
  },
  {
    word: 'Freddie Mercury',
    subtle: [
      { hint: 'Mustache', rationale: 'Iconic thick dark facial hair styling.' },
      { hint: 'Zanzibar', rationale: 'East African island where he was born.' },
      { hint: 'Wembley', rationale: 'Stadium of unforgettable 1985 Live Aid performance.' }
    ],
    balanced: [
      { hint: 'Queen', rationale: 'British rock group fronted with theatrical flair.' },
      { hint: 'Rhapsody', rationale: 'Operatic multi-genre rock anthem written.' },
      { hint: 'Vocals', rationale: 'Four-octave operatic singing range.' }
    ],
    easy: [
      { hint: 'Singer', rationale: 'Rock band frontman profession.' },
      { hint: 'Rock', rationale: 'High-energy musical genre.' },
      { hint: 'Microphone', rationale: 'Detached bottom-less stand swung on stage.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Flamboyant Queen frontman famous for Bohemian Rhapsody.' }
  },
  {
    word: 'Bill Gates',
    subtle: [
      { hint: 'Garage', rationale: 'Early suburban workshop co-writing BASIC.' },
      { hint: 'Glasses', rationale: 'Oversized wire-rimmed frames of early coding years.' },
      { hint: 'Polo', rationale: 'Casual sweater style worn during congressional hearings.' }
    ],
    balanced: [
      { hint: 'Windows', rationale: 'Dominant PC operating system deployed worldwide.' },
      { hint: 'Software', rationale: 'Code programs running personal computers.' },
      { hint: 'Philanthropy', rationale: 'Foundation donating billions to eradicate disease.' }
    ],
    easy: [
      { hint: 'Billionaire', rationale: 'Early leader of global wealth rankings.' },
      { hint: 'Computer', rationale: 'Machines placed on every desk in every home.' },
      { hint: 'Founder', rationale: 'Corporate tech executive title.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Co-founder of Microsoft and global philanthropist.' }
  },
  {
    word: 'Amelia Earhart',
    subtle: [
      { hint: 'Lockheed', rationale: 'Electra twin-engine aircraft flown on final flight.' },
      { hint: 'Pacific', rationale: 'Vast ocean where navigation contact was lost in 1937.' },
      { hint: 'Goggles', rationale: 'Leather flight eyewear protecting eyes.' }
    ],
    balanced: [
      { hint: 'Aviation', rationale: 'Realm of powered flight exploration.' },
      { hint: 'Atlantic', rationale: 'Ocean crossed solo in record female flight.' },
      { hint: 'Solo', rationale: 'Daring lone flights breaking speed barriers.' }
    ],
    easy: [
      { hint: 'Pilot', rationale: 'Aircraft cockpit operator vocation.' },
      { hint: 'Airplane', rationale: 'Winged propeller flight machine.' },
      { hint: 'Fly', rationale: 'Airborne journey above the clouds.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Pioneering female aviator who vanished over the Pacific.' }
  },
  {
    word: 'David Bowie',
    subtle: [
      { hint: 'Stardust', rationale: 'Glam rock alter ego Ziggy descending from space.' },
      { hint: 'Eyes', rationale: 'Anisocoria condition causing two different pupil sizes.' },
      { hint: 'Major', rationale: 'Fictional astronaut Tom floating in tin can.' }
    ],
    balanced: [
      { hint: 'Lightning', rationale: 'Bolt painted across face on Aladdin Sane cover.' },
      { hint: 'Glamour', rationale: 'Theatrical costume changes and chameleon personas.' },
      { hint: 'Heroes', rationale: 'Classic Berlin wall rock ballad.' }
    ],
    easy: [
      { hint: 'Singer', rationale: 'Rock and art pop vocal career.' },
      { hint: 'Music', rationale: 'Art form reinvented across five decades.' },
      { hint: 'Rock', rationale: 'Electric guitar and synth musical category.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Chameleonic rock icon known as Ziggy Stardust.' }
  },
  {
    word: 'Michael Jordan',
    subtle: [
      { hint: 'Bulls', rationale: 'Chicago basketball franchise led to six titles.' },
      { hint: 'Tongue', rationale: 'Facial expression wagging during mid-air drives.' },
      { hint: 'Sneakers', rationale: 'High-top red and black shoes sparking fashion craze.' }
    ],
    balanced: [
      { hint: 'Dunk', rationale: 'Gravity-defying leap from free throw line.' },
      { hint: 'Air', rationale: 'Flight nickname defining branded apparel line.' },
      { hint: 'Six', rationale: 'Championship rings won in Chicago.' }
    ],
    easy: [
      { hint: 'Basketball', rationale: 'Sport elevated into global cultural phenomenon.' },
      { hint: 'Twenty-three', rationale: 'Iconic jersey number worn on court.' },
      { hint: 'Champion', rationale: 'Undefeated in NBA finals appearances.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Basketball legend who won six titles with Chicago.' }
  }
];

// Note: For Jordan 'Twenty-three' has hyphen - let's make it strict single word: 'Hoops' or 'Legend'
// Let's ensure strict single word on all entries
famousPeople.forEach(item => {
  item.easy.forEach(e => {
    if (e.hint === 'Twenty-three') e.hint = 'Hoops';
  });
});

fs.writeFileSync('scripts/curated_vocabulary/part4_famous_people.json', JSON.stringify({ famous_people: famousPeople }, null, 2), 'utf8');
console.log('Successfully wrote part4_famous_people.json (35 words)');
