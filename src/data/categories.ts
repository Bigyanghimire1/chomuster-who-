import { Category } from '../types/game';

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'everyday_objects',
    name: 'Everyday Objects',
    icon: 'Package',
    description: 'Familiar tools, accessories, and household items.',
    words: [
      'Umbrella', 'Toothbrush', 'Backpack', 'Sunglasses', 'Headphones',
      'Keychain', 'Blender', 'Flashlight', 'Pillow', 'Mirror',
      'Scissors', 'Hammer', 'Alarm Clock', 'Wallet', 'Coffee Mug',
      'Wristwatch', 'Water Bottle', 'Stapler', 'Notebook', 'Candle',
      'Blanket', 'Luggage', 'Towel', 'Hairbrush', 'Doorbell',
      'Teapot', 'Screwdriver', 'Thermos', 'Curtain', 'Sponge',
      'Calculator', 'Compass', 'Lighter', 'Broom', 'Padlock'
    ]
  },
  {
    id: 'food_drinks',
    name: 'Food & Drinks',
    icon: 'Utensils',
    description: 'Delicious dishes, snacks, desserts, and beverages.',
    words: [
      'Pizza', 'Sushi', 'Croissant', 'Cappuccino', 'Taco',
      'Waffles', 'Burger', 'Guacamole', 'Spaghetti', 'Smoothie',
      'Cheesecake', 'Bagel', 'Donut', 'Ice Cream', 'Pancakes',
      'Ramen', 'Lasagna', 'French Fries', 'Popcorn', 'Brownie',
      'Espresso', 'Hot Chocolate', 'Lemonade', 'Burrito', 'Dumplings',
      'Steak', 'Apple Pie', 'Cupcake', 'Pretzel', 'Milkshake',
      'Nachos', 'Churro', 'Fondue', 'Falafel', 'Omelet'
    ]
  },
  {
    id: 'animals',
    name: 'Animals',
    icon: 'PawPrint',
    description: 'Creatures from the jungle, ocean, sky, and savannah.',
    words: [
      'Penguin', 'Kangaroo', 'Dolphin', 'Chameleon', 'Owl',
      'Giraffe', 'Cheetah', 'Octopus', 'Elephant', 'Koala',
      'Platypus', 'Wolf', 'Flamingo', 'Panda', 'Gorilla',
      'Sloth', 'Hedgehog', 'Bald Eagle', 'Tiger', 'Sea Turtle',
      'Zebra', 'Walrus', 'Polar Bear', 'Otter', 'Rhinoceros',
      'Parrot', 'Hippopotamus', 'Squirrel', 'Peacock', 'Lion',
      'Fox', 'Badger', 'Meerkat', 'Jaguar', 'Falcon'
    ]
  },
  {
    id: 'famous_people',
    name: 'Famous People',
    icon: 'UserCheck',
    description: 'Iconic historical figures, artists, innovators, and icons.',
    words: [
      'Albert Einstein', 'Leonardo da Vinci', 'Michael Jackson', 'Serena Williams', 'Steve Jobs',
      'Taylor Swift', 'Elon Musk', 'Marilyn Monroe', 'Wolfgang Mozart', 'Cleopatra',
      'William Shakespeare', 'Muhammad Ali', 'Frida Kahlo', 'Nelson Mandela', 'Stephen Hawking',
      'Walt Disney', 'Vincent van Gogh', 'Audrey Hepburn', 'Isaac Newton', 'Bob Marley',
      'Marie Curie', 'Lionel Messi', 'Abraham Lincoln', 'Beyoncé', 'Pablo Picasso',
      'Charles Darwin', 'Oprah Winfrey', 'Usain Bolt', 'Ludwig van Beethoven', 'Freddie Mercury',
      'Bill Gates', 'Amelia Earhart', 'David Bowie', 'Neil Armstrong', 'Michael Jordan'
    ]
  },
  {
    id: 'movies_tv',
    name: 'Movies & TV Shows',
    icon: 'Film',
    description: 'Blockbusters, binge-worthy series, and cinematic classics.',
    words: [
      'Titanic', 'Inception', 'Stranger Things', 'Harry Potter', 'The Matrix',
      'Finding Nemo', 'Jurassic Park', 'Breaking Bad', 'Star Wars', 'Avatar',
      'The Lion King', 'The Avengers', 'Forrest Gump', 'Game of Thrones', 'Interstellar',
      'Pulp Fiction', 'Shrek', 'Back to the Future', 'The Dark Knight', 'Gladiator',
      'The Office', 'Toy Story', 'Spider-Man', 'Home Alone', 'Friends',
      'Ghostbusters', 'The Lord of the Rings', 'Jaws', 'Monsters Inc', 'Squid Game',
      'Pirates of the Caribbean', 'The Godfather', 'Frozen', 'Up', 'Casablanca'
    ]
  },
  {
    id: 'geography',
    name: 'Countries & Cities',
    icon: 'Globe',
    description: 'Nations, capitals, and famous world destinations.',
    words: [
      'Japan', 'France', 'Egypt', 'Brazil', 'Australia',
      'Tokyo', 'Paris', 'New York', 'Rome', 'London',
      'Iceland', 'Canada', 'Greece', 'Peru', 'Mexico',
      'Barcelona', 'Amsterdam', 'Cairo', 'Sydney', 'Venice',
      'Switzerland', 'Norway', 'Thailand', 'South Africa', 'India',
      'Singapore', 'Dubai', 'Rio de Janeiro', 'Istanbul', 'San Francisco',
      'New Zealand', 'Morocco', 'Seoul', 'Argentina', 'Kenya'
    ]
  },
  {
    id: 'professions',
    name: 'Jobs & Professions',
    icon: 'Briefcase',
    description: 'Careers, vocations, and specialized trades.',
    words: [
      'Astronaut', 'Firefighter', 'Detective', 'Architect', 'Chef',
      'Pilot', 'Surgeon', 'Librarian', 'Journalist', 'Plumber',
      'Sculptor', 'Veterinarian', 'Photographer', 'Judge', 'Electrician',
      'Paramedic', 'Archaeologist', 'Lifeguard', 'Flight Attendant', 'Carpenter',
      'Graphic Designer', 'Teacher', 'Farmer', 'Blacksmith', 'Dentist',
      'Astronomer', 'Choreographer', 'Barista', 'Fisherman', 'Mechanic',
      'Baker', 'Florist', 'Translator', 'Coach', 'Scientist'
    ]
  },
  {
    id: 'brands',
    name: 'Popular Brands',
    icon: 'Tag',
    description: 'Globally recognized household brands and companies.',
    words: [
      'Apple', 'Nike', 'Lego', 'Spotify', 'Netflix',
      'Nintendo', 'Tesla', 'Disney', 'Starbucks', 'Ikea',
      'Coca-Cola', 'Adidas', 'McDonalds', 'Amazon', 'PlayStation',
      'Ferrari', 'Google', 'Samsung', 'Rolex', 'Target',
      'Gucci', 'eBay', 'Microsoft', 'Harley-Davidson', 'YouTube',
      'Vans', 'Puma', 'Visa', 'Sony', 'Red Bull',
      'Porsche', 'Twitch', 'Subway', 'Heineken', 'Audi'
    ]
  },
  {
    id: 'hobbies',
    name: 'Hobbies & Activities',
    icon: 'Sparkles',
    description: 'Passions, pastimes, and creative weekend pursuits.',
    words: [
      'Gardening', 'Photography', 'Scuba Diving', 'Origami', 'Skateboarding',
      'Baking', 'Hiking', 'Chess', 'Painting', 'Yoga',
      'Camping', 'Pottery', 'Fishing', 'Bird Watching', 'Knitting',
      'Rock Climbing', 'Calligraphy', 'Astronomy', 'Magic Tricks', 'Archery',
      'Woodworking', 'Kite Flying', 'Surfing', 'Bowling', 'Karaoke',
      'Sudoku', 'Scrapbooking', 'Roller Skating', 'Jewelry Making', 'Geocaching',
      'Snorkeling', 'Model Building', 'Board Games', 'Billiards', 'Juggling'
    ]
  },
  {
    id: 'music',
    name: 'Music & Instruments',
    icon: 'Music',
    description: 'Instruments, musical styles, and sound equipment.',
    words: [
      'Acoustic Guitar', 'Grand Piano', 'Saxophone', 'Violin', 'Drum Kit',
      'Electric Bass', 'Trumpet', 'Harmonica', 'Cello', 'Microphone',
      'Vinyl Record', 'Synthesizer', 'Flute', 'Tambourine', 'Ukulele',
      'Accordion', 'Harp', 'Bagpipes', 'Turntable', 'Xylophone',
      'Clarinet', 'Trombone', 'Bongos', 'Rock and Roll', 'Jazz',
      'Hip Hop', 'Classical Symphony', 'Reggae', 'Heavy Metal', 'Orchestra',
      'Amplifier', 'Metronome', 'Concert Stage', 'Sheet Music', 'Headset'
    ]
  },
  {
    id: 'sports',
    name: 'Sports & Games',
    icon: 'Trophy',
    description: 'Athletic competitions, Olympic disciplines, and team sports.',
    words: [
      'Basketball', 'Tennis', 'Snowboarding', 'Surfing', 'Volleyball',
      'Formula 1', 'Rugby', 'Badminton', 'Gymnastics', 'Golf',
      'Baseball', 'Ice Hockey', 'Cricket', 'Boxing', 'Figure Skating',
      'Table Tennis', 'Track and Field', 'Curling', 'Water Polo', 'BMX',
      'Fencing', 'Dodgeball', 'Marathon', 'Ski Jumping', 'Rowing',
      'Judo', 'Handball', 'Bobsled', 'Archery', 'Triathlon',
      'Billiards', 'Darts', 'Skateboarding', 'Wrestling', 'Polo'
    ]
  },
  {
    id: 'technology',
    name: 'Technology & Science',
    icon: 'Cpu',
    description: 'Inventions, digital innovations, and electronic devices.',
    words: [
      'Smartphone', 'Drone', 'Virtual Reality', 'Smartwatch', '3D Printer',
      'Satellite', 'Microchip', 'Bluetooth', 'Solar Panel', 'Robot',
      'Artificial Intelligence', 'Wi-Fi Router', 'Supercomputer', 'Laser', 'Telescope',
      'Hoverboard', 'Microscope', 'Fiber Optic', 'Electric Car', 'Touchscreen',
      'Biometric Scanner', 'Game Console', 'GPS Navigation', 'Cloud Server', 'Wireless Charger',
      'Subwoofer', 'Smart Bulb', 'Earbuds', 'Projector', 'Power Bank',
      'Self-Driving Car', 'Motion Sensor', 'Nanotechnology', 'Microphone', 'Webcam'
    ]
  },
  {
    id: 'nature',
    name: 'Nature & Wonders',
    icon: 'Trees',
    description: 'Phenomena, landscapes, ecosystems, and natural forces.',
    words: [
      'Volcano', 'Waterfall', 'Northern Lights', 'Glacier', 'Coral Reef',
      'Desert Dunes', 'Rainforest', 'Lightning Storm', 'Grand Canyon', 'Rainbow',
      'Cave System', 'Avalanche', 'Tsunami', 'Geyser', 'Tornado',
      'Sunburst', 'Meteor Shower', 'Sand Dune', 'Oasis', 'Volcanic Crater',
      'Mangrove', 'Tundra', 'Fjord', 'Stalactite', 'Hot Spring',
      'Wildfire', 'Tide Pool', 'Iceberg', 'Forest Canopy', 'Eclipse',
      'Thunderstorm', 'Sequoia Tree', 'Bioluminescence', 'Mist', 'Canyon'
    ]
  },
  {
    id: 'vehicles',
    name: 'Vehicles & Transport',
    icon: 'Car',
    description: 'Land, air, sea, and space transportation machines.',
    words: [
      'Helicopter', 'Submarine', 'Electric Scooter', 'Sailboat', 'Hot Air Balloon',
      'High-Speed Train', 'Spaceship', 'Bulldozer', 'Ambulance', 'Jet Ski',
      'Fire Truck', 'Hovercraft', 'Motorcycle', 'Steam Locomotive', 'Monster Truck',
      'Yacht', 'Tractor', 'Gondola', 'Airplane', 'Cable Car',
      'Hang Glider', 'Tugboat', 'Forklift', 'Cruise Ship', 'Snowmobile',
      'Go-Kart', 'Segway', 'Tanker Ship', 'Cargo Plane', 'Delivery Van',
      'Camper Van', 'Double Decker Bus', 'Subway Train', 'Rowboat', 'Kayak'
    ]
  },
  {
    id: 'landmarks',
    name: 'Places & Landmarks',
    icon: 'Landmark',
    description: 'Famous monuments, architectural marvels, and heritage sites.',
    words: [
      'Eiffel Tower', 'Colosseum', 'Great Wall of China', 'Taj Mahal', 'Statue of Liberty',
      'Machu Picchu', 'Pyramids of Giza', 'Big Ben', 'Golden Gate Bridge', 'Christ the Redeemer',
      'Sydney Opera House', 'Leaning Tower of Pisa', 'Petra', 'Stonehenge', 'Mount Everest',
      'Louvre Museum', 'Times Square', 'Burj Khalifa', 'Acropolis of Athens', 'Empire State Building',
      'Niagara Falls', 'St. Basil Cathedral', 'Alcatraz Island', 'Mount Fuji', 'Angkor Wat',
      'Chichen Itza', 'Notre Dame', 'Sagrada Familia', 'Tower Bridge', 'Hollywood Sign',
      'Vatican City', 'Versailles Palace', 'Alhambra', 'Mount Rushmore', 'Trevi Fountain'
    ]
  }
];

export const TOTAL_BUILTIN_WORDS = DEFAULT_CATEGORIES.reduce(
  (acc, cat) => acc + cat.words.length,
  0
);
