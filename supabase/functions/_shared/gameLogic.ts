export type HintDifficulty = 'subtle' | 'balanced' | 'easy' | 'none';

export interface CustomWordInput {
  word: string;
  hint?: string;
  categoryName?: string;
}

export interface RoomSettings {
  categoryIds: string[];
  turnDurationSeconds: number;
  discussionDurationSeconds: number;
  votingDurationSeconds: number;
  hintDifficulty: HintDifficulty;
  chomuCount: number;
  soundEnabled: boolean;
  customWords?: CustomWordInput[];
}

interface BankWord {
  word: string;
  categoryId: string;
  categoryName: string;
  hints: {
    subtle: [string, string, string];
    balanced: [string, string, string];
    easy: [string, string, string];
  };
}

const ROOM_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const ALLOWED_TURN_DURATIONS = [0, 15, 20, 30] as const;
const ALLOWED_DISCUSSION_DURATIONS = [30, 45, 60] as const;
const ALLOWED_HINT_DIFFICULTIES: readonly HintDifficulty[] = ['subtle', 'balanced', 'easy', 'none'];

const BUILTIN_WORD_BANK: readonly BankWord[] = [
  {
    "word": "Umbrella",
    "categoryId": "everyday_objects",
    "categoryName": "Everyday Objects",
    "hints": {
      "subtle": [
        "Storm",
        "Shelter",
        "Drizzle"
      ],
      "balanced": [
        "Raincoat",
        "Canopy",
        "Puddle"
      ],
      "easy": [
        "Downpour",
        "Waterproof",
        "Drops"
      ]
    }
  },
  {
    "word": "Toothbrush",
    "categoryId": "everyday_objects",
    "categoryName": "Everyday Objects",
    "hints": {
      "subtle": [
        "Morning",
        "Bathroom",
        "Routine"
      ],
      "balanced": [
        "Mouthwash",
        "Bristles",
        "Dentist"
      ],
      "easy": [
        "Toothpaste",
        "Smile",
        "Clean"
      ]
    }
  },
  {
    "word": "Backpack",
    "categoryId": "everyday_objects",
    "categoryName": "Everyday Objects",
    "hints": {
      "subtle": [
        "Journey",
        "Travel",
        "Hiking"
      ],
      "balanced": [
        "Zipper",
        "Shoulder",
        "Straps"
      ],
      "easy": [
        "Books",
        "School",
        "Bag"
      ]
    }
  },
  {
    "word": "Sunglasses",
    "categoryId": "everyday_objects",
    "categoryName": "Everyday Objects",
    "hints": {
      "subtle": [
        "Horizon",
        "Afternoon",
        "Glare"
      ],
      "balanced": [
        "Beach",
        "Lenses",
        "Shades"
      ],
      "easy": [
        "Summer",
        "Sunlight",
        "Dark"
      ]
    }
  },
  {
    "word": "Headphones",
    "categoryId": "everyday_objects",
    "categoryName": "Everyday Objects",
    "hints": {
      "subtle": [
        "Travel",
        "Commute",
        "Volume"
      ],
      "balanced": [
        "Podcast",
        "Beats",
        "Sound"
      ],
      "easy": [
        "Music",
        "Ears",
        "Audio"
      ]
    }
  },
  {
    "word": "Flashlight",
    "categoryId": "everyday_objects",
    "categoryName": "Everyday Objects",
    "hints": {
      "subtle": [
        "Night",
        "Darkness",
        "Outage"
      ],
      "balanced": [
        "Battery",
        "Handheld",
        "Beam"
      ],
      "easy": [
        "Torch",
        "Glow",
        "Shine"
      ]
    }
  },
  {
    "word": "Mirror",
    "categoryId": "everyday_objects",
    "categoryName": "Everyday Objects",
    "hints": {
      "subtle": [
        "Vanity",
        "Wall",
        "Glass"
      ],
      "balanced": [
        "Look",
        "Appearance",
        "Silver"
      ],
      "easy": [
        "Reflection",
        "Face",
        "Reverse"
      ]
    }
  },
  {
    "word": "Wallet",
    "categoryId": "everyday_objects",
    "categoryName": "Everyday Objects",
    "hints": {
      "subtle": [
        "Pocket",
        "Leather",
        "Purchase"
      ],
      "balanced": [
        "Receipts",
        "Cards",
        "Coins"
      ],
      "easy": [
        "Money",
        "Cash",
        "Pay"
      ]
    }
  },
  {
    "word": "Alarm Clock",
    "categoryId": "everyday_objects",
    "categoryName": "Everyday Objects",
    "hints": {
      "subtle": [
        "Dawn",
        "Bedside",
        "Ticking"
      ],
      "balanced": [
        "Snooze",
        "Morning",
        "Ringtone"
      ],
      "easy": [
        "Wakeup",
        "Early",
        "Buzzer"
      ]
    }
  },
  {
    "word": "Scissors",
    "categoryId": "everyday_objects",
    "categoryName": "Everyday Objects",
    "hints": {
      "subtle": [
        "Crafts",
        "Barber",
        "Ribbon"
      ],
      "balanced": [
        "Snip",
        "Blades",
        "Handles"
      ],
      "easy": [
        "Cut",
        "Paper",
        "Sharp"
      ]
    }
  },
  {
    "word": "Pillow",
    "categoryId": "everyday_objects",
    "categoryName": "Everyday Objects",
    "hints": {
      "subtle": [
        "Rest",
        "Dream",
        "Bed"
      ],
      "balanced": [
        "Feathers",
        "Cushion",
        "Cotton"
      ],
      "easy": [
        "Sleep",
        "Soft",
        "Head"
      ]
    }
  },
  {
    "word": "Hammer",
    "categoryId": "everyday_objects",
    "categoryName": "Everyday Objects",
    "hints": {
      "subtle": [
        "Toolbox",
        "Workbench",
        "Construction"
      ],
      "balanced": [
        "Wood",
        "Steel",
        "Handle"
      ],
      "easy": [
        "Nail",
        "Pound",
        "Hit"
      ]
    }
  },
  {
    "word": "Candle",
    "categoryId": "everyday_objects",
    "categoryName": "Everyday Objects",
    "hints": {
      "subtle": [
        "Dinner",
        "Scent",
        "Warmth"
      ],
      "balanced": [
        "Wick",
        "Wax",
        "Melt"
      ],
      "easy": [
        "Flame",
        "Fire",
        "Light"
      ]
    }
  },
  {
    "word": "Blender",
    "categoryId": "everyday_objects",
    "categoryName": "Everyday Objects",
    "hints": {
      "subtle": [
        "Kitchen",
        "Smoothie",
        "Spin"
      ],
      "balanced": [
        "Pitcher",
        "Crush",
        "Counter"
      ],
      "easy": [
        "Blades",
        "Mix",
        "Juice"
      ]
    }
  },
  {
    "word": "Coffee Mug",
    "categoryId": "everyday_objects",
    "categoryName": "Everyday Objects",
    "hints": {
      "subtle": [
        "Morning",
        "Desk",
        "Warmth"
      ],
      "balanced": [
        "Ceramic",
        "Handle",
        "Sip"
      ],
      "easy": [
        "Brew",
        "Tea",
        "Cup"
      ]
    }
  },
  {
    "word": "Water Bottle",
    "categoryId": "everyday_objects",
    "categoryName": "Everyday Objects",
    "hints": {
      "subtle": [
        "Gym",
        "Thirst",
        "Plastic"
      ],
      "balanced": [
        "Hydrate",
        "Cap",
        "Refill"
      ],
      "easy": [
        "Liquid",
        "Drink",
        "Flask"
      ]
    }
  },
  {
    "word": "Notebook",
    "categoryId": "everyday_objects",
    "categoryName": "Everyday Objects",
    "hints": {
      "subtle": [
        "Thoughts",
        "Diary",
        "Student"
      ],
      "balanced": [
        "Spiral",
        "Pages",
        "Pen"
      ],
      "easy": [
        "Write",
        "Paper",
        "Notes"
      ]
    }
  },
  {
    "word": "Blanket",
    "categoryId": "everyday_objects",
    "categoryName": "Everyday Objects",
    "hints": {
      "subtle": [
        "Winter",
        "Cozy",
        "Couch"
      ],
      "balanced": [
        "Fleece",
        "Warmth",
        "Wrap"
      ],
      "easy": [
        "Bed",
        "Cover",
        "Sleep"
      ]
    }
  },
  {
    "word": "Towel",
    "categoryId": "everyday_objects",
    "categoryName": "Everyday Objects",
    "hints": {
      "subtle": [
        "Cotton",
        "Pool",
        "Fabric"
      ],
      "balanced": [
        "Bathroom",
        "Shower",
        "Cloth"
      ],
      "easy": [
        "Dry",
        "Wet",
        "Bath"
      ]
    }
  },
  {
    "word": "Doorbell",
    "categoryId": "everyday_objects",
    "categoryName": "Everyday Objects",
    "hints": {
      "subtle": [
        "Porch",
        "Visitor",
        "Arrival"
      ],
      "balanced": [
        "Button",
        "Chime",
        "Entry"
      ],
      "easy": [
        "Ring",
        "Front",
        "Guest"
      ]
    }
  },
  {
    "word": "Teapot",
    "categoryId": "everyday_objects",
    "categoryName": "Everyday Objects",
    "hints": {
      "subtle": [
        "Afternoon",
        "Porcelain",
        "Pour"
      ],
      "balanced": [
        "Kettle",
        "Spout",
        "Steep"
      ],
      "easy": [
        "Brew",
        "Leaves",
        "Drink"
      ]
    }
  },
  {
    "word": "Screwdriver",
    "categoryId": "everyday_objects",
    "categoryName": "Everyday Objects",
    "hints": {
      "subtle": [
        "Toolbox",
        "Repair",
        "Workbench"
      ],
      "balanced": [
        "Handle",
        "Twist",
        "Steel"
      ],
      "easy": [
        "Fasten",
        "Turn",
        "Tighten"
      ]
    }
  },
  {
    "word": "Curtain",
    "categoryId": "everyday_objects",
    "categoryName": "Everyday Objects",
    "hints": {
      "subtle": [
        "Fabric",
        "Stage",
        "Morning"
      ],
      "balanced": [
        "Drapes",
        "Shade",
        "Rod"
      ],
      "easy": [
        "Window",
        "Close",
        "Room"
      ]
    }
  },
  {
    "word": "Sponge",
    "categoryId": "everyday_objects",
    "categoryName": "Everyday Objects",
    "hints": {
      "subtle": [
        "Kitchen",
        "Yellow",
        "Soapy"
      ],
      "balanced": [
        "Absorb",
        "Foam",
        "Scrub"
      ],
      "easy": [
        "Dishes",
        "Wash",
        "Clean"
      ]
    }
  },
  {
    "word": "Calculator",
    "categoryId": "everyday_objects",
    "categoryName": "Everyday Objects",
    "hints": {
      "subtle": [
        "Math",
        "Office",
        "Student"
      ],
      "balanced": [
        "Buttons",
        "Digits",
        "Solve"
      ],
      "easy": [
        "Numbers",
        "Count",
        "Screen"
      ]
    }
  },
  {
    "word": "Compass",
    "categoryId": "everyday_objects",
    "categoryName": "Everyday Objects",
    "hints": {
      "subtle": [
        "Hiking",
        "Explorer",
        "Map"
      ],
      "balanced": [
        "Needle",
        "Direction",
        "Magnetic"
      ],
      "easy": [
        "North",
        "Navigate",
        "Lost"
      ]
    }
  },
  {
    "word": "Lighter",
    "categoryId": "everyday_objects",
    "categoryName": "Everyday Objects",
    "hints": {
      "subtle": [
        "Pocket",
        "Thumb",
        "Spark"
      ],
      "balanced": [
        "Flint",
        "Gas",
        "Click"
      ],
      "easy": [
        "Flame",
        "Fire",
        "Burn"
      ]
    }
  },
  {
    "word": "Broom",
    "categoryId": "everyday_objects",
    "categoryName": "Everyday Objects",
    "hints": {
      "subtle": [
        "Corner",
        "Handle",
        "Floor"
      ],
      "balanced": [
        "Straw",
        "Dustpan",
        "Bristles"
      ],
      "easy": [
        "Sweep",
        "Dust",
        "Clean"
      ]
    }
  },
  {
    "word": "Keys",
    "categoryId": "everyday_objects",
    "categoryName": "Everyday Objects",
    "hints": {
      "subtle": [
        "Pocket",
        "Home",
        "Metal"
      ],
      "balanced": [
        "Car",
        "Ring",
        "Open"
      ],
      "easy": [
        "Door",
        "Lock",
        "Unlock"
      ]
    }
  },
  {
    "word": "Watch",
    "categoryId": "everyday_objects",
    "categoryName": "Everyday Objects",
    "hints": {
      "subtle": [
        "Style",
        "Fashion",
        "Late"
      ],
      "balanced": [
        "Strap",
        "Round",
        "Hand"
      ],
      "easy": [
        "Time",
        "Clock",
        "Hour"
      ]
    }
  },
  {
    "word": "Suitcase",
    "categoryId": "everyday_objects",
    "categoryName": "Everyday Objects",
    "hints": {
      "subtle": [
        "Holiday",
        "Hotel",
        "Pack"
      ],
      "balanced": [
        "Wheels",
        "Handle",
        "Clothes"
      ],
      "easy": [
        "Airport",
        "Travel",
        "Bag"
      ]
    }
  },
  {
    "word": "Comb",
    "categoryId": "everyday_objects",
    "categoryName": "Everyday Objects",
    "hints": {
      "subtle": [
        "Morning",
        "Mirror",
        "Bathroom"
      ],
      "balanced": [
        "Plastic",
        "Teeth",
        "Style"
      ],
      "easy": [
        "Hair",
        "Brush",
        "Head"
      ]
    }
  },
  {
    "word": "Passport",
    "categoryId": "everyday_objects",
    "categoryName": "Everyday Objects",
    "hints": {
      "subtle": [
        "Border",
        "Trip",
        "Official"
      ],
      "balanced": [
        "Photo",
        "Stamp",
        "Book"
      ],
      "easy": [
        "Airport",
        "Travel",
        "Country"
      ]
    }
  },
  {
    "word": "Calendar",
    "categoryId": "everyday_objects",
    "categoryName": "Everyday Objects",
    "hints": {
      "subtle": [
        "Wall",
        "Desk",
        "Plan"
      ],
      "balanced": [
        "Month",
        "Week",
        "Numbers"
      ],
      "easy": [
        "Date",
        "Year",
        "Day"
      ]
    }
  },
  {
    "word": "Camera",
    "categoryId": "everyday_objects",
    "categoryName": "Everyday Objects",
    "hints": {
      "subtle": [
        "Vacation",
        "Memory",
        "Art"
      ],
      "balanced": [
        "Flash",
        "Lens",
        "Click"
      ],
      "easy": [
        "Photo",
        "Picture",
        "Smile"
      ]
    }
  },
  {
    "word": "Soap",
    "categoryId": "everyday_objects",
    "categoryName": "Everyday Objects",
    "hints": {
      "subtle": [
        "Bathroom",
        "Sink",
        "Smell"
      ],
      "balanced": [
        "Bubbles",
        "Foam",
        "Shower"
      ],
      "easy": [
        "Wash",
        "Hands",
        "Clean"
      ]
    }
  },
  {
    "word": "Perfume",
    "categoryId": "everyday_objects",
    "categoryName": "Everyday Objects",
    "hints": {
      "subtle": [
        "Bottle",
        "Gift",
        "Party"
      ],
      "balanced": [
        "Spray",
        "Sweet",
        "Flower"
      ],
      "easy": [
        "Smell",
        "Nice",
        "Scent"
      ]
    }
  },
  {
    "word": "Shoes",
    "categoryId": "everyday_objects",
    "categoryName": "Everyday Objects",
    "hints": {
      "subtle": [
        "Street",
        "Walk",
        "Style"
      ],
      "balanced": [
        "Laces",
        "Pair",
        "Run"
      ],
      "easy": [
        "Feet",
        "Wear",
        "Socks"
      ]
    }
  },
  {
    "word": "Jacket",
    "categoryId": "everyday_objects",
    "categoryName": "Everyday Objects",
    "hints": {
      "subtle": [
        "Autumn",
        "Street",
        "Pocket"
      ],
      "balanced": [
        "Zipper",
        "Wear",
        "Warm"
      ],
      "easy": [
        "Cold",
        "Coat",
        "Winter"
      ]
    }
  },
  {
    "word": "Lock",
    "categoryId": "everyday_objects",
    "categoryName": "Everyday Objects",
    "hints": {
      "subtle": [
        "Safe",
        "Door",
        "Metal"
      ],
      "balanced": [
        "Close",
        "Guard",
        "Steel"
      ],
      "easy": [
        "Key",
        "Secret",
        "Open"
      ]
    }
  },
  {
    "word": "Pizza",
    "categoryId": "food_drinks",
    "categoryName": "Food & Drinks",
    "hints": {
      "subtle": [
        "Delivery",
        "Slice",
        "Cardboard"
      ],
      "balanced": [
        "Crust",
        "Pepperoni",
        "Mozzarella"
      ],
      "easy": [
        "Oven",
        "Topping",
        "Italian"
      ]
    }
  },
  {
    "word": "Sushi",
    "categoryId": "food_drinks",
    "categoryName": "Food & Drinks",
    "hints": {
      "subtle": [
        "Chopsticks",
        "Rolls",
        "Ginger"
      ],
      "balanced": [
        "Seaweed",
        "Rice",
        "Wasabi"
      ],
      "easy": [
        "Salmon",
        "Raw",
        "Japanese"
      ]
    }
  },
  {
    "word": "Croissant",
    "categoryId": "food_drinks",
    "categoryName": "Food & Drinks",
    "hints": {
      "subtle": [
        "Breakfast",
        "Morning",
        "Layers"
      ],
      "balanced": [
        "Butter",
        "Flaky",
        "Crescent"
      ],
      "easy": [
        "Bakery",
        "Pastry",
        "French"
      ]
    }
  },
  {
    "word": "Burger",
    "categoryId": "food_drinks",
    "categoryName": "Food & Drinks",
    "hints": {
      "subtle": [
        "Fastfood",
        "Grill",
        "Sesame"
      ],
      "balanced": [
        "Patty",
        "Lettuce",
        "Pickle"
      ],
      "easy": [
        "Bun",
        "Beef",
        "Ketchup"
      ]
    }
  },
  {
    "word": "Taco",
    "categoryId": "food_drinks",
    "categoryName": "Food & Drinks",
    "hints": {
      "subtle": [
        "Street",
        "Lime",
        "Tuesday"
      ],
      "balanced": [
        "Shell",
        "Salsa",
        "Cilantro"
      ],
      "easy": [
        "Tortilla",
        "Mexican",
        "Filling"
      ]
    }
  },
  {
    "word": "Coffee",
    "categoryId": "food_drinks",
    "categoryName": "Food & Drinks",
    "hints": {
      "subtle": [
        "Morning",
        "Roasted",
        "Energy"
      ],
      "balanced": [
        "Beans",
        "Caffeine",
        "Mug"
      ],
      "easy": [
        "Brew",
        "Cup",
        "Drink"
      ]
    }
  },
  {
    "word": "Ramen",
    "categoryId": "food_drinks",
    "categoryName": "Food & Drinks",
    "hints": {
      "subtle": [
        "Steam",
        "College",
        "Slurp"
      ],
      "balanced": [
        "Broth",
        "Chopsticks",
        "Noodles"
      ],
      "easy": [
        "Bowl",
        "Soup",
        "Japanese"
      ]
    }
  },
  {
    "word": "Ice Cream",
    "categoryId": "food_drinks",
    "categoryName": "Food & Drinks",
    "hints": {
      "subtle": [
        "Summer",
        "Sweet",
        "Scoop"
      ],
      "balanced": [
        "Cone",
        "Vanilla",
        "Sundae"
      ],
      "easy": [
        "Freeze",
        "Melt",
        "Dessert"
      ]
    }
  },
  {
    "word": "Waffles",
    "categoryId": "food_drinks",
    "categoryName": "Food & Drinks",
    "hints": {
      "subtle": [
        "Breakfast",
        "Grid",
        "Iron"
      ],
      "balanced": [
        "Batter",
        "Syrup",
        "Crisp"
      ],
      "easy": [
        "Honey",
        "Brunch",
        "Plate"
      ]
    }
  },
  {
    "word": "Popcorn",
    "categoryId": "food_drinks",
    "categoryName": "Food & Drinks",
    "hints": {
      "subtle": [
        "Kernels",
        "Movie",
        "Cinema"
      ],
      "balanced": [
        "Butter",
        "Microwave",
        "Salty"
      ],
      "easy": [
        "Snack",
        "Popped",
        "Bucket"
      ]
    }
  },
  {
    "word": "Donut",
    "categoryId": "food_drinks",
    "categoryName": "Food & Drinks",
    "hints": {
      "subtle": [
        "Coffee",
        "Round",
        "Glaze"
      ],
      "balanced": [
        "Sprinkles",
        "Hole",
        "Bakery"
      ],
      "easy": [
        "Fried",
        "Dough",
        "Sweet"
      ]
    }
  },
  {
    "word": "Cheesecake",
    "categoryId": "food_drinks",
    "categoryName": "Food & Drinks",
    "hints": {
      "subtle": [
        "Rich",
        "Slice",
        "Graham"
      ],
      "balanced": [
        "Creamy",
        "Crust",
        "Berries"
      ],
      "easy": [
        "Dairy",
        "Dessert",
        "Cake"
      ]
    }
  },
  {
    "word": "Lemonade",
    "categoryId": "food_drinks",
    "categoryName": "Food & Drinks",
    "hints": {
      "subtle": [
        "Stand",
        "Refreshing",
        "Summer"
      ],
      "balanced": [
        "Citrus",
        "Pitcher",
        "Sweet"
      ],
      "easy": [
        "Sour",
        "Yellow",
        "Juice"
      ]
    }
  },
  {
    "word": "Chocolate",
    "categoryId": "food_drinks",
    "categoryName": "Food & Drinks",
    "hints": {
      "subtle": [
        "Cocoa",
        "Wrapped",
        "Sweet"
      ],
      "balanced": [
        "Bar",
        "Dark",
        "Milk"
      ],
      "easy": [
        "Candy",
        "Melt",
        "Dessert"
      ]
    }
  },
  {
    "word": "Spaghetti",
    "categoryId": "food_drinks",
    "categoryName": "Food & Drinks",
    "hints": {
      "subtle": [
        "Twirl",
        "Fork",
        "Long"
      ],
      "balanced": [
        "Meatball",
        "Marinara",
        "Tomato"
      ],
      "easy": [
        "Pasta",
        "Noodles",
        "Italian"
      ]
    }
  },
  {
    "word": "Guacamole",
    "categoryId": "food_drinks",
    "categoryName": "Food & Drinks",
    "hints": {
      "subtle": [
        "Dip",
        "Green",
        "Bowl"
      ],
      "balanced": [
        "Avocado",
        "Lime",
        "Cilantro"
      ],
      "easy": [
        "Chips",
        "Salsa",
        "Mexican"
      ]
    }
  },
  {
    "word": "Smoothie",
    "categoryId": "food_drinks",
    "categoryName": "Food & Drinks",
    "hints": {
      "subtle": [
        "Blender",
        "Straw",
        "Thick"
      ],
      "balanced": [
        "Fruit",
        "Yogurt",
        "Berries"
      ],
      "easy": [
        "Drink",
        "Cold",
        "Juice"
      ]
    }
  },
  {
    "word": "Bagel",
    "categoryId": "food_drinks",
    "categoryName": "Food & Drinks",
    "hints": {
      "subtle": [
        "Breakfast",
        "Round",
        "Chewy"
      ],
      "balanced": [
        "Toasted",
        "Hole",
        "Salmon"
      ],
      "easy": [
        "Cream",
        "Bread",
        "Bakery"
      ]
    }
  },
  {
    "word": "Pancakes",
    "categoryId": "food_drinks",
    "categoryName": "Food & Drinks",
    "hints": {
      "subtle": [
        "Sunday",
        "Stack",
        "Griddle"
      ],
      "balanced": [
        "Batter",
        "Syrup",
        "Butter"
      ],
      "easy": [
        "Breakfast",
        "Flat",
        "Plate"
      ]
    }
  },
  {
    "word": "French Fries",
    "categoryId": "food_drinks",
    "categoryName": "Food & Drinks",
    "hints": {
      "subtle": [
        "Fastfood",
        "Salty",
        "Side"
      ],
      "balanced": [
        "Potato",
        "Crispy",
        "Ketchup"
      ],
      "easy": [
        "Golden",
        "Fried",
        "Snack"
      ]
    }
  },
  {
    "word": "Brownie",
    "categoryId": "food_drinks",
    "categoryName": "Food & Drinks",
    "hints": {
      "subtle": [
        "Square",
        "Fudge",
        "Warm"
      ],
      "balanced": [
        "Cocoa",
        "Walnuts",
        "Rich"
      ],
      "easy": [
        "Chocolate",
        "Baked",
        "Dessert"
      ]
    }
  },
  {
    "word": "Hot Chocolate",
    "categoryId": "food_drinks",
    "categoryName": "Food & Drinks",
    "hints": {
      "subtle": [
        "Winter",
        "Warm",
        "Mug"
      ],
      "balanced": [
        "Marshmallow",
        "Cocoa",
        "Sweet"
      ],
      "easy": [
        "Milk",
        "Drink",
        "Cream"
      ]
    }
  },
  {
    "word": "Burrito",
    "categoryId": "food_drinks",
    "categoryName": "Food & Drinks",
    "hints": {
      "subtle": [
        "Foil",
        "Rolled",
        "Heavy"
      ],
      "balanced": [
        "Beans",
        "Rice",
        "Salsa"
      ],
      "easy": [
        "Tortilla",
        "Wrap",
        "Mexican"
      ]
    }
  },
  {
    "word": "Dumplings",
    "categoryId": "food_drinks",
    "categoryName": "Food & Drinks",
    "hints": {
      "subtle": [
        "Steam",
        "Bamboo",
        "Folded"
      ],
      "balanced": [
        "Dough",
        "Dipping",
        "Pork"
      ],
      "easy": [
        "Asian",
        "Filling",
        "Steamed"
      ]
    }
  },
  {
    "word": "Steak",
    "categoryId": "food_drinks",
    "categoryName": "Food & Drinks",
    "hints": {
      "subtle": [
        "Sizzle",
        "Grill",
        "Knife"
      ],
      "balanced": [
        "Rare",
        "Sirloin",
        "Pepper"
      ],
      "easy": [
        "Meat",
        "Beef",
        "Dinner"
      ]
    }
  },
  {
    "word": "Apple Pie",
    "categoryId": "food_drinks",
    "categoryName": "Food & Drinks",
    "hints": {
      "subtle": [
        "Autumn",
        "Crust",
        "Cinnamon"
      ],
      "balanced": [
        "Baked",
        "Slice",
        "Golden"
      ],
      "easy": [
        "Fruit",
        "Dessert",
        "Sweet"
      ]
    }
  },
  {
    "word": "Cupcake",
    "categoryId": "food_drinks",
    "categoryName": "Food & Drinks",
    "hints": {
      "subtle": [
        "Birthday",
        "Wrapper",
        "Party"
      ],
      "balanced": [
        "Frosting",
        "Sprinkles",
        "Vanilla"
      ],
      "easy": [
        "Sweet",
        "Miniature",
        "Bakery"
      ]
    }
  },
  {
    "word": "Pretzel",
    "categoryId": "food_drinks",
    "categoryName": "Food & Drinks",
    "hints": {
      "subtle": [
        "Knot",
        "Salty",
        "Twisted"
      ],
      "balanced": [
        "Mustard",
        "Baked",
        "Brown"
      ],
      "easy": [
        "Dough",
        "Snack",
        "Beer"
      ]
    }
  },
  {
    "word": "Milkshake",
    "categoryId": "food_drinks",
    "categoryName": "Food & Drinks",
    "hints": {
      "subtle": [
        "Diner",
        "Straw",
        "Tall"
      ],
      "balanced": [
        "Malt",
        "Whipped",
        "Vanilla"
      ],
      "easy": [
        "Cold",
        "Sweet",
        "Drink"
      ]
    }
  },
  {
    "word": "Nachos",
    "categoryId": "food_drinks",
    "categoryName": "Food & Drinks",
    "hints": {
      "subtle": [
        "Cinema",
        "Sharing",
        "Platter"
      ],
      "balanced": [
        "Jalapeno",
        "Salsa",
        "Melted"
      ],
      "easy": [
        "Chips",
        "Cheese",
        "Snack"
      ]
    }
  },
  {
    "word": "Omelet",
    "categoryId": "food_drinks",
    "categoryName": "Food & Drinks",
    "hints": {
      "subtle": [
        "Breakfast",
        "Skillet",
        "Folded"
      ],
      "balanced": [
        "Whisk",
        "Mushrooms",
        "Cheesy"
      ],
      "easy": [
        "Egg",
        "Pan",
        "Morning"
      ]
    }
  },
  {
    "word": "Tea",
    "categoryId": "food_drinks",
    "categoryName": "Food & Drinks",
    "hints": {
      "subtle": [
        "Afternoon",
        "Warm",
        "Relax"
      ],
      "balanced": [
        "Leaves",
        "Cup",
        "Water"
      ],
      "easy": [
        "Hot",
        "Green",
        "Drink"
      ]
    }
  },
  {
    "word": "Noodles",
    "categoryId": "food_drinks",
    "categoryName": "Food & Drinks",
    "hints": {
      "subtle": [
        "Bowl",
        "Long",
        "Fast"
      ],
      "balanced": [
        "Soup",
        "Fork",
        "Boil"
      ],
      "easy": [
        "Asia",
        "Slurp",
        "Pasta"
      ]
    }
  },
  {
    "word": "Cake",
    "categoryId": "food_drinks",
    "categoryName": "Food & Drinks",
    "hints": {
      "subtle": [
        "Party",
        "Candle",
        "Slice"
      ],
      "balanced": [
        "Cream",
        "Bake",
        "Oven"
      ],
      "easy": [
        "Birthday",
        "Sweet",
        "Dessert"
      ]
    }
  },
  {
    "word": "Sandwich",
    "categoryId": "food_drinks",
    "categoryName": "Food & Drinks",
    "hints": {
      "subtle": [
        "Lunch",
        "Picnic",
        "School"
      ],
      "balanced": [
        "Slices",
        "Cheese",
        "Quick"
      ],
      "easy": [
        "Bread",
        "Fill",
        "Eat"
      ]
    }
  },
  {
    "word": "Salad",
    "categoryId": "food_drinks",
    "categoryName": "Food & Drinks",
    "hints": {
      "subtle": [
        "Fresh",
        "Light",
        "Bowl"
      ],
      "balanced": [
        "Leaves",
        "Tomato",
        "Fork"
      ],
      "easy": [
        "Green",
        "Healthy",
        "Vegetables"
      ]
    }
  },
  {
    "word": "Soup",
    "categoryId": "food_drinks",
    "categoryName": "Food & Drinks",
    "hints": {
      "subtle": [
        "Winter",
        "Sick",
        "Warm"
      ],
      "balanced": [
        "Bowl",
        "Liquid",
        "Cook"
      ],
      "easy": [
        "Spoon",
        "Hot",
        "Broth"
      ]
    }
  },
  {
    "word": "Fried Rice",
    "categoryId": "food_drinks",
    "categoryName": "Food & Drinks",
    "hints": {
      "subtle": [
        "Dinner",
        "Pan",
        "Asia"
      ],
      "balanced": [
        "Egg",
        "Oil",
        "Bowl"
      ],
      "easy": [
        "White",
        "Grain",
        "Mix"
      ]
    }
  },
  {
    "word": "Biryani",
    "categoryId": "food_drinks",
    "categoryName": "Food & Drinks",
    "hints": {
      "subtle": [
        "Feast",
        "Rich",
        "Pot"
      ],
      "balanced": [
        "Spicy",
        "Yellow",
        "Meat"
      ],
      "easy": [
        "Rice",
        "India",
        "Flavor"
      ]
    }
  },
  {
    "word": "Curry",
    "categoryId": "food_drinks",
    "categoryName": "Food & Drinks",
    "hints": {
      "subtle": [
        "Dinner",
        "Warm",
        "Bowl"
      ],
      "balanced": [
        "Sauce",
        "Yellow",
        "Rice"
      ],
      "easy": [
        "Spicy",
        "India",
        "Hot"
      ]
    }
  },
  {
    "word": "Pasta",
    "categoryId": "food_drinks",
    "categoryName": "Food & Drinks",
    "hints": {
      "subtle": [
        "Dinner",
        "Boil",
        "Plate"
      ],
      "balanced": [
        "Sauce",
        "Fork",
        "Cheese"
      ],
      "easy": [
        "Italy",
        "Tomato",
        "Wheat"
      ]
    }
  },
  {
    "word": "Cookies",
    "categoryId": "food_drinks",
    "categoryName": "Food & Drinks",
    "hints": {
      "subtle": [
        "Milk",
        "Jar",
        "Oven"
      ],
      "balanced": [
        "Round",
        "Chips",
        "Crunch"
      ],
      "easy": [
        "Sweet",
        "Bake",
        "Snack"
      ]
    }
  },
  {
    "word": "Mango",
    "categoryId": "food_drinks",
    "categoryName": "Food & Drinks",
    "hints": {
      "subtle": [
        "Summer",
        "Tree",
        "Tropical"
      ],
      "balanced": [
        "Yellow",
        "Juicy",
        "Seed"
      ],
      "easy": [
        "Fruit",
        "Sweet",
        "King"
      ]
    }
  },
  {
    "word": "Watermelon",
    "categoryId": "food_drinks",
    "categoryName": "Food & Drinks",
    "hints": {
      "subtle": [
        "Summer",
        "Picnic",
        "Heavy"
      ],
      "balanced": [
        "Green",
        "Seeds",
        "Slice"
      ],
      "easy": [
        "Red",
        "Fruit",
        "Juicy"
      ]
    }
  },
  {
    "word": "Banana",
    "categoryId": "food_drinks",
    "categoryName": "Food & Drinks",
    "hints": {
      "subtle": [
        "Monkey",
        "Snack",
        "Soft"
      ],
      "balanced": [
        "Peel",
        "Long",
        "Fruit"
      ],
      "easy": [
        "Yellow",
        "Sweet",
        "Curved"
      ]
    }
  },
  {
    "word": "Cheese",
    "categoryId": "food_drinks",
    "categoryName": "Food & Drinks",
    "hints": {
      "subtle": [
        "Mouse",
        "Sandwich",
        "Pizza"
      ],
      "balanced": [
        "Yellow",
        "Slice",
        "Melt"
      ],
      "easy": [
        "Milk",
        "Dairy",
        "Soft"
      ]
    }
  },
  {
    "word": "Bread",
    "categoryId": "food_drinks",
    "categoryName": "Food & Drinks",
    "hints": {
      "subtle": [
        "Bakery",
        "Morning",
        "Toast"
      ],
      "balanced": [
        "Loaf",
        "Slice",
        "Soft"
      ],
      "easy": [
        "Wheat",
        "Butter",
        "Food"
      ]
    }
  },
  {
    "word": "Honey",
    "categoryId": "food_drinks",
    "categoryName": "Food & Drinks",
    "hints": {
      "subtle": [
        "Nature",
        "Gold",
        "Jar"
      ],
      "balanced": [
        "Sticky",
        "Flower",
        "Tea"
      ],
      "easy": [
        "Bee",
        "Sweet",
        "Yellow"
      ]
    }
  },
  {
    "word": "Penguin",
    "categoryId": "animals",
    "categoryName": "Animals",
    "hints": {
      "subtle": [
        "Tuxedo",
        "Antarctica",
        "Waddle"
      ],
      "balanced": [
        "Flippers",
        "Iceberg",
        "Feathers"
      ],
      "easy": [
        "Beak",
        "Slide",
        "Bird"
      ]
    }
  },
  {
    "word": "Kangaroo",
    "categoryId": "animals",
    "categoryName": "Animals",
    "hints": {
      "subtle": [
        "Outback",
        "Joey",
        "Boxing"
      ],
      "balanced": [
        "Pouch",
        "Bounce",
        "Australia"
      ],
      "easy": [
        "Hop",
        "Tail",
        "Marsupial"
      ]
    }
  },
  {
    "word": "Dolphin",
    "categoryId": "animals",
    "categoryName": "Animals",
    "hints": {
      "subtle": [
        "Pod",
        "Sonar",
        "Playful"
      ],
      "balanced": [
        "Blowhole",
        "Flippers",
        "Ocean"
      ],
      "easy": [
        "Swim",
        "Bottle",
        "Whistle"
      ]
    }
  },
  {
    "word": "Owl",
    "categoryId": "animals",
    "categoryName": "Animals",
    "hints": {
      "subtle": [
        "Barn",
        "Silent",
        "Wisdom"
      ],
      "balanced": [
        "Nocturnal",
        "Hoot",
        "Talons"
      ],
      "easy": [
        "Feathers",
        "Wings",
        "Bird"
      ]
    }
  },
  {
    "word": "Giraffe",
    "categoryId": "animals",
    "categoryName": "Animals",
    "hints": {
      "subtle": [
        "Savannah",
        "Spots",
        "Acacia"
      ],
      "balanced": [
        "Leaves",
        "Tallest",
        "Tongue"
      ],
      "easy": [
        "Neck",
        "Legs",
        "Africa"
      ]
    }
  },
  {
    "word": "Octopus",
    "categoryId": "animals",
    "categoryName": "Animals",
    "hints": {
      "subtle": [
        "Ink",
        "Coral",
        "Clever"
      ],
      "balanced": [
        "Tentacles",
        "Suction",
        "Camouflage"
      ],
      "easy": [
        "Eight",
        "Ocean",
        "Mollusk"
      ]
    }
  },
  {
    "word": "Elephant",
    "categoryId": "animals",
    "categoryName": "Animals",
    "hints": {
      "subtle": [
        "Memory",
        "Ivory",
        "Herd"
      ],
      "balanced": [
        "Tusks",
        "Ears",
        "Huge"
      ],
      "easy": [
        "Trunk",
        "Stomp",
        "Grey"
      ]
    }
  },
  {
    "word": "Cheetah",
    "categoryId": "animals",
    "categoryName": "Animals",
    "hints": {
      "subtle": [
        "Sprint",
        "Savannah",
        "Tears"
      ],
      "balanced": [
        "Fastest",
        "Spots",
        "Chase"
      ],
      "easy": [
        "Speed",
        "Feline",
        "Claws"
      ]
    }
  },
  {
    "word": "Panda",
    "categoryId": "animals",
    "categoryName": "Animals",
    "hints": {
      "subtle": [
        "Sichuan",
        "Lazy",
        "Gentle"
      ],
      "balanced": [
        "Bamboo",
        "China",
        "Fur"
      ],
      "easy": [
        "Black",
        "White",
        "Climb"
      ]
    }
  },
  {
    "word": "Wolf",
    "categoryId": "animals",
    "categoryName": "Animals",
    "hints": {
      "subtle": [
        "Moon",
        "Alpha",
        "Wilderness"
      ],
      "balanced": [
        "Pack",
        "Howl",
        "Canine"
      ],
      "easy": [
        "Fang",
        "Fur",
        "Forest"
      ]
    }
  },
  {
    "word": "Chameleon",
    "categoryId": "animals",
    "categoryName": "Animals",
    "hints": {
      "subtle": [
        "Blends",
        "Branch",
        "Patience"
      ],
      "balanced": [
        "Color",
        "Tongue",
        "Reptile"
      ],
      "easy": [
        "Lizard",
        "Eyes",
        "Tail"
      ]
    }
  },
  {
    "word": "Flamingo",
    "categoryId": "animals",
    "categoryName": "Animals",
    "hints": {
      "subtle": [
        "Balance",
        "Lagoon",
        "Flock"
      ],
      "balanced": [
        "Pink",
        "Wading",
        "Beak"
      ],
      "easy": [
        "Feathers",
        "Legs",
        "Bird"
      ]
    }
  },
  {
    "word": "Koala",
    "categoryId": "animals",
    "categoryName": "Animals",
    "hints": {
      "subtle": [
        "Sleepy",
        "Canopy",
        "Branch"
      ],
      "balanced": [
        "Eucalyptus",
        "Pouch",
        "Australia"
      ],
      "easy": [
        "Claws",
        "Furry",
        "Ears"
      ]
    }
  },
  {
    "word": "Gorilla",
    "categoryId": "animals",
    "categoryName": "Animals",
    "hints": {
      "subtle": [
        "Silverback",
        "Jungle",
        "Chest"
      ],
      "balanced": [
        "Troop",
        "Knuckles",
        "Strong"
      ],
      "easy": [
        "Primate",
        "Ape",
        "Black"
      ]
    }
  },
  {
    "word": "Sloth",
    "categoryId": "animals",
    "categoryName": "Animals",
    "hints": {
      "subtle": [
        "Slow",
        "Canopy",
        "Algae"
      ],
      "balanced": [
        "Hanging",
        "Claws",
        "Lazy"
      ],
      "easy": [
        "Sleep",
        "Tree",
        "Fur"
      ]
    }
  },
  {
    "word": "Hedgehog",
    "categoryId": "animals",
    "categoryName": "Animals",
    "hints": {
      "subtle": [
        "Garden",
        "Nocturnal",
        "Snout"
      ],
      "balanced": [
        "Spines",
        "Quills",
        "Curl"
      ],
      "easy": [
        "Sharp",
        "Ball",
        "Small"
      ]
    }
  },
  {
    "word": "Tiger",
    "categoryId": "animals",
    "categoryName": "Animals",
    "hints": {
      "subtle": [
        "Jungle",
        "Bengal",
        "Solitary"
      ],
      "balanced": [
        "Stripes",
        "Orange",
        "Roar"
      ],
      "easy": [
        "Paws",
        "Feline",
        "Fangs"
      ]
    }
  },
  {
    "word": "Zebra",
    "categoryId": "animals",
    "categoryName": "Animals",
    "hints": {
      "subtle": [
        "Savannah",
        "Flies",
        "Gallop"
      ],
      "balanced": [
        "Stripes",
        "Herd",
        "Mane"
      ],
      "easy": [
        "Black",
        "White",
        "Hooves"
      ]
    }
  },
  {
    "word": "Polar Bear",
    "categoryId": "animals",
    "categoryName": "Animals",
    "hints": {
      "subtle": [
        "Arctic",
        "Blubber",
        "Seals"
      ],
      "balanced": [
        "White",
        "Iceberg",
        "Paws"
      ],
      "easy": [
        "Snow",
        "Cold",
        "Swim"
      ]
    }
  },
  {
    "word": "Otter",
    "categoryId": "animals",
    "categoryName": "Animals",
    "hints": {
      "subtle": [
        "Stream",
        "Playful",
        "Shellfish"
      ],
      "balanced": [
        "Floating",
        "Whiskers",
        "Fur"
      ],
      "easy": [
        "Swim",
        "Paws",
        "River"
      ]
    }
  },
  {
    "word": "Rhinoceros",
    "categoryId": "animals",
    "categoryName": "Animals",
    "hints": {
      "subtle": [
        "Mud",
        "Charge",
        "Poaching"
      ],
      "balanced": [
        "Armor",
        "Heavy",
        "Savannah"
      ],
      "easy": [
        "Horn",
        "Grey",
        "Herbivore"
      ]
    }
  },
  {
    "word": "Parrot",
    "categoryId": "animals",
    "categoryName": "Animals",
    "hints": {
      "subtle": [
        "Perch",
        "Jungle",
        "Pirate"
      ],
      "balanced": [
        "Mimic",
        "Feathers",
        "Beak"
      ],
      "easy": [
        "Talk",
        "Wings",
        "Bird"
      ]
    }
  },
  {
    "word": "Hippopotamus",
    "categoryId": "animals",
    "categoryName": "Animals",
    "hints": {
      "subtle": [
        "Submerged",
        "Riverbank",
        "Territory"
      ],
      "balanced": [
        "Yawn",
        "Tusks",
        "Heavy"
      ],
      "easy": [
        "Water",
        "Africa",
        "Mouth"
      ]
    }
  },
  {
    "word": "Squirrel",
    "categoryId": "animals",
    "categoryName": "Animals",
    "hints": {
      "subtle": [
        "Acorn",
        "Autumn",
        "Park"
      ],
      "balanced": [
        "Bury",
        "Branch",
        "Cheeks"
      ],
      "easy": [
        "Tail",
        "Climb",
        "Nuts"
      ]
    }
  },
  {
    "word": "Peacock",
    "categoryId": "animals",
    "categoryName": "Animals",
    "hints": {
      "subtle": [
        "Palace",
        "Pride",
        "Courtship"
      ],
      "balanced": [
        "Train",
        "Eyespots",
        "Strut"
      ],
      "easy": [
        "Feathers",
        "Fan",
        "Bird"
      ]
    }
  },
  {
    "word": "Lion",
    "categoryId": "animals",
    "categoryName": "Animals",
    "hints": {
      "subtle": [
        "Pride",
        "Savannah",
        "Royalty"
      ],
      "balanced": [
        "Mane",
        "Roar",
        "Hunt"
      ],
      "easy": [
        "Feline",
        "Paws",
        "Africa"
      ]
    }
  },
  {
    "word": "Fox",
    "categoryId": "animals",
    "categoryName": "Animals",
    "hints": {
      "subtle": [
        "Cunning",
        "Den",
        "Nocturnal"
      ],
      "balanced": [
        "Red",
        "Sneaky",
        "Pounce"
      ],
      "easy": [
        "Tail",
        "Ears",
        "Forest"
      ]
    }
  },
  {
    "word": "Jaguar",
    "categoryId": "animals",
    "categoryName": "Animals",
    "hints": {
      "subtle": [
        "Amazon",
        "Bite",
        "Stealth"
      ],
      "balanced": [
        "Rosettes",
        "Swim",
        "Jungle"
      ],
      "easy": [
        "Feline",
        "Spots",
        "Paws"
      ]
    }
  },
  {
    "word": "Falcon",
    "categoryId": "animals",
    "categoryName": "Animals",
    "hints": {
      "subtle": [
        "Peregrine",
        "Hood",
        "Cliff"
      ],
      "balanced": [
        "Dive",
        "Fastest",
        "Talons"
      ],
      "easy": [
        "Raptor",
        "Wings",
        "Beak"
      ]
    }
  },
  {
    "word": "Eagle",
    "categoryId": "animals",
    "categoryName": "Animals",
    "hints": {
      "subtle": [
        "Mountain",
        "Sky",
        "High"
      ],
      "balanced": [
        "Sharp",
        "Eyes",
        "Hunt"
      ],
      "easy": [
        "Bird",
        "Wings",
        "Fly"
      ]
    }
  },
  {
    "word": "Turtle",
    "categoryId": "animals",
    "categoryName": "Animals",
    "hints": {
      "subtle": [
        "Beach",
        "Old",
        "Ocean"
      ],
      "balanced": [
        "Hard",
        "Green",
        "Swim"
      ],
      "easy": [
        "Shell",
        "Slow",
        "Water"
      ]
    }
  },
  {
    "word": "Shark",
    "categoryId": "animals",
    "categoryName": "Animals",
    "hints": {
      "subtle": [
        "Deep",
        "Fear",
        "Fast"
      ],
      "balanced": [
        "Fin",
        "Grey",
        "Hunt"
      ],
      "easy": [
        "Ocean",
        "Teeth",
        "Fish"
      ]
    }
  },
  {
    "word": "Whale",
    "categoryId": "animals",
    "categoryName": "Animals",
    "hints": {
      "subtle": [
        "Deep",
        "Song",
        "Water"
      ],
      "balanced": [
        "Big",
        "Blue",
        "Tail"
      ],
      "easy": [
        "Ocean",
        "Huge",
        "Giant"
      ]
    }
  },
  {
    "word": "Camel",
    "categoryId": "animals",
    "categoryName": "Animals",
    "hints": {
      "subtle": [
        "Hot",
        "Travel",
        "Dry"
      ],
      "balanced": [
        "Sand",
        "Water",
        "Ride"
      ],
      "easy": [
        "Desert",
        "Hump",
        "Walk"
      ]
    }
  },
  {
    "word": "Horse",
    "categoryId": "animals",
    "categoryName": "Animals",
    "hints": {
      "subtle": [
        "Farm",
        "Race",
        "Fast"
      ],
      "balanced": [
        "Ride",
        "Hair",
        "Strong"
      ],
      "easy": [
        "Run",
        "Saddle",
        "Animal"
      ]
    }
  },
  {
    "word": "Monkey",
    "categoryId": "animals",
    "categoryName": "Animals",
    "hints": {
      "subtle": [
        "Tree",
        "Play",
        "Smart"
      ],
      "balanced": [
        "Climb",
        "Tail",
        "Funny"
      ],
      "easy": [
        "Banana",
        "Jungle",
        "Jump"
      ]
    }
  },
  {
    "word": "Crocodile",
    "categoryId": "animals",
    "categoryName": "Animals",
    "hints": {
      "subtle": [
        "River",
        "Wait",
        "Danger"
      ],
      "balanced": [
        "Green",
        "Skin",
        "Swamp"
      ],
      "easy": [
        "Teeth",
        "Water",
        "Bite"
      ]
    }
  },
  {
    "word": "Snake",
    "categoryId": "animals",
    "categoryName": "Animals",
    "hints": {
      "subtle": [
        "Grass",
        "Quiet",
        "Danger"
      ],
      "balanced": [
        "Long",
        "Bite",
        "Ground"
      ],
      "easy": [
        "No",
        "Legs",
        "Venom"
      ]
    }
  },
  {
    "word": "Butterfly",
    "categoryId": "animals",
    "categoryName": "Animals",
    "hints": {
      "subtle": [
        "Garden",
        "Spring",
        "Light"
      ],
      "balanced": [
        "Flower",
        "Color",
        "Soft"
      ],
      "easy": [
        "Wings",
        "Fly",
        "Insect"
      ]
    }
  },
  {
    "word": "Frog",
    "categoryId": "animals",
    "categoryName": "Animals",
    "hints": {
      "subtle": [
        "Rain",
        "Pond",
        "Green"
      ],
      "balanced": [
        "Wet",
        "Tongue",
        "Sound"
      ],
      "easy": [
        "Jump",
        "Water",
        "Small"
      ]
    }
  },
  {
    "word": "Rabbit",
    "categoryId": "animals",
    "categoryName": "Animals",
    "hints": {
      "subtle": [
        "Garden",
        "Fast",
        "Cute"
      ],
      "balanced": [
        "White",
        "Jump",
        "Soft"
      ],
      "easy": [
        "Ears",
        "Carrot",
        "Hop"
      ]
    }
  },
  {
    "word": "Dog",
    "categoryId": "animals",
    "categoryName": "Animals",
    "hints": {
      "subtle": [
        "Home",
        "Friend",
        "Walk"
      ],
      "balanced": [
        "Loyal",
        "Bark",
        "Tail"
      ],
      "easy": [
        "Pet",
        "Puppy",
        "Bone"
      ]
    }
  },
  {
    "word": "Albert Einstein",
    "categoryId": "famous_people",
    "categoryName": "Famous People",
    "hints": {
      "subtle": [
        "Patent",
        "Chalkboard",
        "Hair"
      ],
      "balanced": [
        "Relativity",
        "Physicist",
        "Nobel"
      ],
      "easy": [
        "Genius",
        "Science",
        "Energy"
      ]
    }
  },
  {
    "word": "Leonardo da Vinci",
    "categoryId": "famous_people",
    "categoryName": "Famous People",
    "hints": {
      "subtle": [
        "Mirror",
        "Florence",
        "Notebooks"
      ],
      "balanced": [
        "Mona",
        "Renaissance",
        "Polymath"
      ],
      "easy": [
        "Painter",
        "Inventor",
        "Italian"
      ]
    }
  },
  {
    "word": "Michael Jackson",
    "categoryId": "famous_people",
    "categoryName": "Famous People",
    "hints": {
      "subtle": [
        "Neverland",
        "Fedora",
        "Glove"
      ],
      "balanced": [
        "Moonwalk",
        "Thriller",
        "King"
      ],
      "easy": [
        "Singer",
        "Dance",
        "Pop"
      ]
    }
  },
  {
    "word": "Steve Jobs",
    "categoryId": "famous_people",
    "categoryName": "Famous People",
    "hints": {
      "subtle": [
        "Turtleneck",
        "Garage",
        "Keynote"
      ],
      "balanced": [
        "iPhone",
        "Cupertino",
        "Macintosh"
      ],
      "easy": [
        "Visionary",
        "Founder",
        "Design"
      ]
    }
  },
  {
    "word": "William Shakespeare",
    "categoryId": "famous_people",
    "categoryName": "Famous People",
    "hints": {
      "subtle": [
        "Avon",
        "Quill",
        "Folio"
      ],
      "balanced": [
        "Globe",
        "Hamlet",
        "Sonnet"
      ],
      "easy": [
        "Playwright",
        "Poet",
        "Theater"
      ]
    }
  },
  {
    "word": "Cleopatra",
    "categoryId": "famous_people",
    "categoryName": "Famous People",
    "hints": {
      "subtle": [
        "Asp",
        "Alexandria",
        "Barge"
      ],
      "balanced": [
        "Pharaoh",
        "Queen",
        "Nile"
      ],
      "easy": [
        "Egypt",
        "Gold",
        "Ancient"
      ]
    }
  },
  {
    "word": "Wolfgang Mozart",
    "categoryId": "famous_people",
    "categoryName": "Famous People",
    "hints": {
      "subtle": [
        "Salzburg",
        "Prodigy",
        "Amadeus"
      ],
      "balanced": [
        "Requiem",
        "Symphony",
        "Opera"
      ],
      "easy": [
        "Composer",
        "Piano",
        "Classical"
      ]
    }
  },
  {
    "word": "Neil Armstrong",
    "categoryId": "famous_people",
    "categoryName": "Famous People",
    "hints": {
      "subtle": [
        "Tranquility",
        "Eagle",
        "Footprint"
      ],
      "balanced": [
        "Apollo",
        "Leap",
        "Astronaut"
      ],
      "easy": [
        "Moon",
        "Space",
        "First"
      ]
    }
  },
  {
    "word": "Serena Williams",
    "categoryId": "famous_people",
    "categoryName": "Famous People",
    "hints": {
      "subtle": [
        "Compton",
        "Slam",
        "Ace"
      ],
      "balanced": [
        "Racket",
        "Wimbledon",
        "Champion"
      ],
      "easy": [
        "Tennis",
        "Court",
        "Athlete"
      ]
    }
  },
  {
    "word": "Taylor Swift",
    "categoryId": "famous_people",
    "categoryName": "Famous People",
    "hints": {
      "subtle": [
        "Eras",
        "Thirteen",
        "Scarf"
      ],
      "balanced": [
        "Guitar",
        "Grammy",
        "Country"
      ],
      "easy": [
        "Singer",
        "Pop",
        "Concert"
      ]
    }
  },
  {
    "word": "Elon Musk",
    "categoryId": "famous_people",
    "categoryName": "Famous People",
    "hints": {
      "subtle": [
        "Falcon",
        "Mars",
        "Gigafactory"
      ],
      "balanced": [
        "SpaceX",
        "Rocket",
        "Billionaire"
      ],
      "easy": [
        "Electric",
        "Tech",
        "Ceo"
      ]
    }
  },
  {
    "word": "Marilyn Monroe",
    "categoryId": "famous_people",
    "categoryName": "Famous People",
    "hints": {
      "subtle": [
        "Subway",
        "Beauty",
        "President"
      ],
      "balanced": [
        "Blonde",
        "Diamonds",
        "Hollywood"
      ],
      "easy": [
        "Actress",
        "Dress",
        "Icon"
      ]
    }
  },
  {
    "word": "Muhammad Ali",
    "categoryId": "famous_people",
    "categoryName": "Famous People",
    "hints": {
      "subtle": [
        "Rumble",
        "Rope",
        "Butterfly"
      ],
      "balanced": [
        "Gloves",
        "Ring",
        "Greatest"
      ],
      "easy": [
        "Boxer",
        "Punch",
        "Champion"
      ]
    }
  },
  {
    "word": "Frida Kahlo",
    "categoryId": "famous_people",
    "categoryName": "Famous People",
    "hints": {
      "subtle": [
        "Monobrow",
        "Casazul",
        "Bus"
      ],
      "balanced": [
        "Portrait",
        "Folkloric",
        "Surreal"
      ],
      "easy": [
        "Painter",
        "Mexico",
        "Artist"
      ]
    }
  },
  {
    "word": "Nelson Mandela",
    "categoryId": "famous_people",
    "categoryName": "Famous People",
    "hints": {
      "subtle": [
        "Robben",
        "Madiba",
        "Rugby"
      ],
      "balanced": [
        "Apartheid",
        "Prison",
        "Reconciliation"
      ],
      "easy": [
        "President",
        "Leader",
        "Peace"
      ]
    }
  },
  {
    "word": "Stephen Hawking",
    "categoryId": "famous_people",
    "categoryName": "Famous People",
    "hints": {
      "subtle": [
        "Wheelchair",
        "Synthesizer",
        "Cambridge"
      ],
      "balanced": [
        "Cosmology",
        "Singularity",
        "Radiation"
      ],
      "easy": [
        "Physicist",
        "Genius",
        "Space"
      ]
    }
  },
  {
    "word": "Walt Disney",
    "categoryId": "famous_people",
    "categoryName": "Famous People",
    "hints": {
      "subtle": [
        "Steamboat",
        "Castle",
        "Theme"
      ],
      "balanced": [
        "Mickey",
        "Animation",
        "Magic"
      ],
      "easy": [
        "Cartoon",
        "Park",
        "Movies"
      ]
    }
  },
  {
    "word": "Vincent van Gogh",
    "categoryId": "famous_people",
    "categoryName": "Famous People",
    "hints": {
      "subtle": [
        "Arles",
        "Bandage",
        "Sunflower"
      ],
      "balanced": [
        "Starry",
        "Swirls",
        "Dutch"
      ],
      "easy": [
        "Painter",
        "Canvas",
        "Artist"
      ]
    }
  },
  {
    "word": "Isaac Newton",
    "categoryId": "famous_people",
    "categoryName": "Famous People",
    "hints": {
      "subtle": [
        "Orchard",
        "Prism",
        "Calculus"
      ],
      "balanced": [
        "Gravity",
        "Principia",
        "Motion"
      ],
      "easy": [
        "Apple",
        "Physicist",
        "Science"
      ]
    }
  },
  {
    "word": "Bob Marley",
    "categoryId": "famous_people",
    "categoryName": "Famous People",
    "hints": {
      "subtle": [
        "Dreadlocks",
        "Trenchtown",
        "Wailers"
      ],
      "balanced": [
        "Reggae",
        "Jamaica",
        "Guitar"
      ],
      "easy": [
        "Singer",
        "Peace",
        "Music"
      ]
    }
  },
  {
    "word": "Marie Curie",
    "categoryId": "famous_people",
    "categoryName": "Famous People",
    "hints": {
      "subtle": [
        "Pitchblende",
        "Polonium",
        "Glow"
      ],
      "balanced": [
        "Radium",
        "Radiation",
        "Nobel"
      ],
      "easy": [
        "Chemist",
        "Science",
        "Laboratory"
      ]
    }
  },
  {
    "word": "Lionel Messi",
    "categoryId": "famous_people",
    "categoryName": "Famous People",
    "hints": {
      "subtle": [
        "Rosario",
        "Campnou",
        "Left"
      ],
      "balanced": [
        "Dribble",
        "Ballon",
        "Argentina"
      ],
      "easy": [
        "Soccer",
        "Goal",
        "Ten"
      ]
    }
  },
  {
    "word": "Abraham Lincoln",
    "categoryId": "famous_people",
    "categoryName": "Famous People",
    "hints": {
      "subtle": [
        "Stovepipe",
        "Cabin",
        "Ford"
      ],
      "balanced": [
        "Gettysburg",
        "Beard",
        "Union"
      ],
      "easy": [
        "President",
        "Penny",
        "Civil"
      ]
    }
  },
  {
    "word": "Pablo Picasso",
    "categoryId": "famous_people",
    "categoryName": "Famous People",
    "hints": {
      "subtle": [
        "Guernica",
        "Blue",
        "Malaga"
      ],
      "balanced": [
        "Cubism",
        "Abstract",
        "Spain"
      ],
      "easy": [
        "Painter",
        "Canvas",
        "Artist"
      ]
    }
  },
  {
    "word": "Oprah Winfrey",
    "categoryId": "famous_people",
    "categoryName": "Famous People",
    "hints": {
      "subtle": [
        "Harpo",
        "Club",
        "Chicago"
      ],
      "balanced": [
        "Talk",
        "Host",
        "Billionaire"
      ],
      "easy": [
        "Television",
        "Media",
        "Famous"
      ]
    }
  },
  {
    "word": "Usain Bolt",
    "categoryId": "famous_people",
    "categoryName": "Famous People",
    "hints": {
      "subtle": [
        "Lightning",
        "Pose",
        "Spikes"
      ],
      "balanced": [
        "Sprint",
        "Fastest",
        "Jamaica"
      ],
      "easy": [
        "Runner",
        "Olympic",
        "Gold"
      ]
    }
  },
  {
    "word": "Ludwig van Beethoven",
    "categoryId": "famous_people",
    "categoryName": "Famous People",
    "hints": {
      "subtle": [
        "Bonn",
        "Fate",
        "Metronome"
      ],
      "balanced": [
        "Deaf",
        "Symphony",
        "Sonata"
      ],
      "easy": [
        "Composer",
        "Piano",
        "Classical"
      ]
    }
  },
  {
    "word": "Freddie Mercury",
    "categoryId": "famous_people",
    "categoryName": "Famous People",
    "hints": {
      "subtle": [
        "Mustache",
        "Zanzibar",
        "Wembley"
      ],
      "balanced": [
        "Queen",
        "Rhapsody",
        "Vocals"
      ],
      "easy": [
        "Singer",
        "Rock",
        "Microphone"
      ]
    }
  },
  {
    "word": "Bill Gates",
    "categoryId": "famous_people",
    "categoryName": "Famous People",
    "hints": {
      "subtle": [
        "Garage",
        "Glasses",
        "Polo"
      ],
      "balanced": [
        "Windows",
        "Software",
        "Philanthropy"
      ],
      "easy": [
        "Billionaire",
        "Computer",
        "Founder"
      ]
    }
  },
  {
    "word": "Michael Jordan",
    "categoryId": "famous_people",
    "categoryName": "Famous People",
    "hints": {
      "subtle": [
        "Bulls",
        "Tongue",
        "Sneakers"
      ],
      "balanced": [
        "Dunk",
        "Air",
        "Six"
      ],
      "easy": [
        "Basketball",
        "Hoops",
        "Champion"
      ]
    }
  },
  {
    "word": "Cristiano Ronaldo",
    "categoryId": "famous_people",
    "categoryName": "Famous People",
    "hints": {
      "subtle": [
        "Seven",
        "Jump",
        "Fast"
      ],
      "balanced": [
        "Portugal",
        "Goal",
        "Strong"
      ],
      "easy": [
        "Football",
        "Soccer",
        "Star"
      ]
    }
  },
  {
    "word": "Beyonce",
    "categoryId": "famous_people",
    "categoryName": "Famous People",
    "hints": {
      "subtle": [
        "Stage",
        "Power",
        "Queen"
      ],
      "balanced": [
        "Dance",
        "Voice",
        "Gold"
      ],
      "easy": [
        "Pop",
        "Singer",
        "Music"
      ]
    }
  },
  {
    "word": "Jackie Chan",
    "categoryId": "famous_people",
    "categoryName": "Famous People",
    "hints": {
      "subtle": [
        "Funny",
        "Action",
        "Jump"
      ],
      "balanced": [
        "China",
        "Stunt",
        "Fight"
      ],
      "easy": [
        "Movie",
        "Actor",
        "Kungfu"
      ]
    }
  },
  {
    "word": "Bruce Lee",
    "categoryId": "famous_people",
    "categoryName": "Famous People",
    "hints": {
      "subtle": [
        "Yellow",
        "Fast",
        "Legend"
      ],
      "balanced": [
        "Dragon",
        "Kick",
        "Strong"
      ],
      "easy": [
        "Fight",
        "Kungfu",
        "Actor"
      ]
    }
  },
  {
    "word": "Charlie Chaplin",
    "categoryId": "famous_people",
    "categoryName": "Famous People",
    "hints": {
      "subtle": [
        "Hat",
        "Walk",
        "Silent"
      ],
      "balanced": [
        "Black",
        "White",
        "Funny"
      ],
      "easy": [
        "Comedy",
        "Actor",
        "Movie"
      ]
    }
  },
  {
    "word": "Mahatma Gandhi",
    "categoryId": "famous_people",
    "categoryName": "Famous People",
    "hints": {
      "subtle": [
        "Peace",
        "Glasses",
        "Walk"
      ],
      "balanced": [
        "Freedom",
        "Simple",
        "Leader"
      ],
      "easy": [
        "India",
        "Nonviolence",
        "Hero"
      ]
    }
  },
  {
    "word": "Barack Obama",
    "categoryId": "famous_people",
    "categoryName": "Famous People",
    "hints": {
      "subtle": [
        "Speech",
        "Hope",
        "Suit"
      ],
      "balanced": [
        "Leader",
        "First",
        "Whitehouse"
      ],
      "easy": [
        "America",
        "President",
        "Politics"
      ]
    }
  },
  {
    "word": "Nikola Tesla",
    "categoryId": "famous_people",
    "categoryName": "Famous People",
    "hints": {
      "subtle": [
        "Spark",
        "Genius",
        "Future"
      ],
      "balanced": [
        "Power",
        "Light",
        "Invent"
      ],
      "easy": [
        "Electricity",
        "Science",
        "Energy"
      ]
    }
  },
  {
    "word": "Virat Kohli",
    "categoryId": "famous_people",
    "categoryName": "Famous People",
    "hints": {
      "subtle": [
        "Bat",
        "Blue",
        "King"
      ],
      "balanced": [
        "Run",
        "Captain",
        "Sport"
      ],
      "easy": [
        "Cricket",
        "India",
        "Star"
      ]
    }
  },
  {
    "word": "Shah Rukh Khan",
    "categoryId": "famous_people",
    "categoryName": "Famous People",
    "hints": {
      "subtle": [
        "Arms",
        "Love",
        "King"
      ],
      "balanced": [
        "Dance",
        "Star",
        "Cinema"
      ],
      "easy": [
        "Bollywood",
        "India",
        "Actor"
      ]
    }
  },
  {
    "word": "Tom Cruise",
    "categoryId": "famous_people",
    "categoryName": "Famous People",
    "hints": {
      "subtle": [
        "Run",
        "Action",
        "Stunt"
      ],
      "balanced": [
        "Spy",
        "Plane",
        "Star"
      ],
      "easy": [
        "Movie",
        "Hollywood",
        "Actor"
      ]
    }
  },
  {
    "word": "BTS",
    "categoryId": "famous_people",
    "categoryName": "Famous People",
    "hints": {
      "subtle": [
        "Seven",
        "Dance",
        "Fans"
      ],
      "balanced": [
        "Korea",
        "Stage",
        "Boys"
      ],
      "easy": [
        "Kpop",
        "Music",
        "Band"
      ]
    }
  },
  {
    "word": "Mark Zuckerberg",
    "categoryId": "famous_people",
    "categoryName": "Famous People",
    "hints": {
      "subtle": [
        "Blue",
        "College",
        "Tech"
      ],
      "balanced": [
        "Friends",
        "App",
        "Rich"
      ],
      "easy": [
        "Facebook",
        "Social",
        "Internet"
      ]
    }
  },
  {
    "word": "Titanic",
    "categoryId": "movies_tv",
    "categoryName": "Movies & TV Shows",
    "hints": {
      "subtle": [
        "Whistle",
        "Stern",
        "Locket"
      ],
      "balanced": [
        "Iceberg",
        "Lifeboats",
        "Unsinkable"
      ],
      "easy": [
        "Ship",
        "Atlantic",
        "Sink"
      ]
    }
  },
  {
    "word": "Inception",
    "categoryId": "movies_tv",
    "categoryName": "Movies & TV Shows",
    "hints": {
      "subtle": [
        "Kick",
        "Hallway",
        "Freight"
      ],
      "balanced": [
        "Totem",
        "Subconscious",
        "Spinner"
      ],
      "easy": [
        "Dream",
        "Layers",
        "Maze"
      ]
    }
  },
  {
    "word": "Harry Potter",
    "categoryId": "movies_tv",
    "categoryName": "Movies & TV Shows",
    "hints": {
      "subtle": [
        "Cupboard",
        "Owl",
        "Platform"
      ],
      "balanced": [
        "Wand",
        "Scar",
        "Hogwarts"
      ],
      "easy": [
        "Glasses",
        "Magic",
        "Spell"
      ]
    }
  },
  {
    "word": "The Matrix",
    "categoryId": "movies_tv",
    "categoryName": "Movies & TV Shows",
    "hints": {
      "subtle": [
        "Spoon",
        "Rabbit",
        "Sunglasses"
      ],
      "balanced": [
        "Pill",
        "Zion",
        "Code"
      ],
      "easy": [
        "Simulation",
        "Dodge",
        "Machines"
      ]
    }
  },
  {
    "word": "Star Wars",
    "categoryId": "movies_tv",
    "categoryName": "Movies & TV Shows",
    "hints": {
      "subtle": [
        "Cantina",
        "Moons",
        "Rebel"
      ],
      "balanced": [
        "Lightsaber",
        "Force",
        "Jedi"
      ],
      "easy": [
        "Galaxy",
        "Droids",
        "Empire"
      ]
    }
  },
  {
    "word": "Jurassic Park",
    "categoryId": "movies_tv",
    "categoryName": "Movies & TV Shows",
    "hints": {
      "subtle": [
        "Puddle",
        "Amber",
        "Jeep"
      ],
      "balanced": [
        "Dinosaurs",
        "Raptor",
        "Island"
      ],
      "easy": [
        "Rex",
        "Fossils",
        "Cloning"
      ]
    }
  },
  {
    "word": "Shrek",
    "categoryId": "movies_tv",
    "categoryName": "Movies & TV Shows",
    "hints": {
      "subtle": [
        "Onions",
        "Duloc",
        "Waffles"
      ],
      "balanced": [
        "Swamp",
        "Ogre",
        "Donkey"
      ],
      "easy": [
        "Green",
        "Fairy",
        "Princess"
      ]
    }
  },
  {
    "word": "The Lion King",
    "categoryId": "movies_tv",
    "categoryName": "Movies & TV Shows",
    "hints": {
      "subtle": [
        "Baobab",
        "Stampede",
        "Sunrise"
      ],
      "balanced": [
        "Savannah",
        "Hakuna",
        "Pride"
      ],
      "easy": [
        "Cub",
        "Roar",
        "Crown"
      ]
    }
  },
  {
    "word": "Spider-Man",
    "categoryId": "movies_tv",
    "categoryName": "Movies & TV Shows",
    "hints": {
      "subtle": [
        "Photographer",
        "Subway",
        "Bugle"
      ],
      "balanced": [
        "Web",
        "Mask",
        "Crawler"
      ],
      "easy": [
        "Suit",
        "Superhero",
        "Bite"
      ]
    }
  },
  {
    "word": "Batman",
    "categoryId": "movies_tv",
    "categoryName": "Movies & TV Shows",
    "hints": {
      "subtle": [
        "Gotham",
        "Billionaire",
        "Night"
      ],
      "balanced": [
        "Cape",
        "Joker",
        "Detective"
      ],
      "easy": [
        "Hero",
        "Cave",
        "Mask"
      ]
    }
  },
  {
    "word": "Superman",
    "categoryId": "movies_tv",
    "categoryName": "Movies & TV Shows",
    "hints": {
      "subtle": [
        "Metropolis",
        "Journalist",
        "Alien"
      ],
      "balanced": [
        "Krypton",
        "Glasses",
        "Planet"
      ],
      "easy": [
        "Cape",
        "Fly",
        "Hero"
      ]
    }
  },
  {
    "word": "Iron Man",
    "categoryId": "movies_tv",
    "categoryName": "Movies & TV Shows",
    "hints": {
      "subtle": [
        "Billionaire",
        "Reactor",
        "Genius"
      ],
      "balanced": [
        "Armor",
        "Stark",
        "Metal"
      ],
      "easy": [
        "Suit",
        "Avenger",
        "Fly"
      ]
    }
  },
  {
    "word": "Thor",
    "categoryId": "movies_tv",
    "categoryName": "Movies & TV Shows",
    "hints": {
      "subtle": [
        "Rainbow",
        "Goats",
        "Mead"
      ],
      "balanced": [
        "Hammer",
        "Lightning",
        "Asgard"
      ],
      "easy": [
        "God",
        "Thunder",
        "Cape"
      ]
    }
  },
  {
    "word": "Hulk",
    "categoryId": "movies_tv",
    "categoryName": "Movies & TV Shows",
    "hints": {
      "subtle": [
        "Purple",
        "Heartbeat",
        "Serum"
      ],
      "balanced": [
        "Gamma",
        "Smash",
        "Anger"
      ],
      "easy": [
        "Green",
        "Monster",
        "Muscles"
      ]
    }
  },
  {
    "word": "Stranger Things",
    "categoryId": "movies_tv",
    "categoryName": "Movies & TV Shows",
    "hints": {
      "subtle": [
        "Waffles",
        "Christmas",
        "Bikes"
      ],
      "balanced": [
        "Upside",
        "Hawkins",
        "Telekinesis"
      ],
      "easy": [
        "Eighties",
        "Monster",
        "Nosebleed"
      ]
    }
  },
  {
    "word": "Finding Nemo",
    "categoryId": "movies_tv",
    "categoryName": "Movies & TV Shows",
    "hints": {
      "subtle": [
        "Dentist",
        "Current",
        "Goggles"
      ],
      "balanced": [
        "Anemone",
        "Fin",
        "Reef"
      ],
      "easy": [
        "Clownfish",
        "Orange",
        "Ocean"
      ]
    }
  },
  {
    "word": "Breaking Bad",
    "categoryId": "movies_tv",
    "categoryName": "Movies & TV Shows",
    "hints": {
      "subtle": [
        "Camper",
        "Pollos",
        "Fly"
      ],
      "balanced": [
        "Blue",
        "Chemistry",
        "Meth"
      ],
      "easy": [
        "Teacher",
        "Desert",
        "Crime"
      ]
    }
  },
  {
    "word": "Avatar",
    "categoryId": "movies_tv",
    "categoryName": "Movies & TV Shows",
    "hints": {
      "subtle": [
        "Arch",
        "Tree",
        "Bioluminescence"
      ],
      "balanced": [
        "Pandora",
        "Navi",
        "Blue"
      ],
      "easy": [
        "Jungle",
        "Alien",
        "Scifi"
      ]
    }
  },
  {
    "word": "The Avengers",
    "categoryId": "movies_tv",
    "categoryName": "Movies & TV Shows",
    "hints": {
      "subtle": [
        "Shawarma",
        "Helicarrier",
        "Tower"
      ],
      "balanced": [
        "Assemble",
        "Stones",
        "Team"
      ],
      "easy": [
        "Heroes",
        "Shield",
        "Marvel"
      ]
    }
  },
  {
    "word": "Forrest Gump",
    "categoryId": "movies_tv",
    "categoryName": "Movies & TV Shows",
    "hints": {
      "subtle": [
        "Feather",
        "Shrimp",
        "Bench"
      ],
      "balanced": [
        "Chocolates",
        "Pingpong",
        "Run"
      ],
      "easy": [
        "Sneakers",
        "Medal",
        "Alabama"
      ]
    }
  },
  {
    "word": "Game of Thrones",
    "categoryId": "movies_tv",
    "categoryName": "Movies & TV Shows",
    "hints": {
      "subtle": [
        "Raven",
        "Valyrian",
        "Winter"
      ],
      "balanced": [
        "Westeros",
        "Dragons",
        "Wall"
      ],
      "easy": [
        "Swords",
        "Kingdom",
        "Kings"
      ]
    }
  },
  {
    "word": "Interstellar",
    "categoryId": "movies_tv",
    "categoryName": "Movies & TV Shows",
    "hints": {
      "subtle": [
        "Watch",
        "Cornfield",
        "Waves"
      ],
      "balanced": [
        "Wormhole",
        "Gargantua",
        "Tesseract"
      ],
      "easy": [
        "Gravity",
        "Astronaut",
        "Space"
      ]
    }
  },
  {
    "word": "Back to the Future",
    "categoryId": "movies_tv",
    "categoryName": "Movies & TV Shows",
    "hints": {
      "subtle": [
        "Giga",
        "Clocktower",
        "Vest"
      ],
      "balanced": [
        "DeLorean",
        "Hoverboard",
        "Lightning"
      ],
      "easy": [
        "Time",
        "Eightyeight",
        "Doctor"
      ]
    }
  },
  {
    "word": "The Dark Knight",
    "categoryId": "movies_tv",
    "categoryName": "Movies & TV Shows",
    "hints": {
      "subtle": [
        "Pencil",
        "Coin",
        "Hospital"
      ],
      "balanced": [
        "Joker",
        "Chaos",
        "Gotham"
      ],
      "easy": [
        "Hero",
        "Clown",
        "Bat"
      ]
    }
  },
  {
    "word": "The Office",
    "categoryId": "movies_tv",
    "categoryName": "Movies & TV Shows",
    "hints": {
      "subtle": [
        "JellO",
        "Dundie",
        "Scranton"
      ],
      "balanced": [
        "Paper",
        "Cubicle",
        "Manager"
      ],
      "easy": [
        "Desks",
        "Comedy",
        "Pranks"
      ]
    }
  },
  {
    "word": "Toy Story",
    "categoryId": "movies_tv",
    "categoryName": "Movies & TV Shows",
    "hints": {
      "subtle": [
        "Boot",
        "Claw",
        "Moving"
      ],
      "balanced": [
        "Woody",
        "Buzz",
        "Andy"
      ],
      "easy": [
        "Plastic",
        "Play",
        "Pixar"
      ]
    }
  },
  {
    "word": "Home Alone",
    "categoryId": "movies_tv",
    "categoryName": "Movies & TV Shows",
    "hints": {
      "subtle": [
        "Microvan",
        "Statue",
        "Tarantula"
      ],
      "balanced": [
        "Traps",
        "Burglars",
        "Kevin"
      ],
      "easy": [
        "Christmas",
        "House",
        "Left"
      ]
    }
  },
  {
    "word": "Friends",
    "categoryId": "movies_tv",
    "categoryName": "Movies & TV Shows",
    "hints": {
      "subtle": [
        "Smelly",
        "Fountain",
        "Break"
      ],
      "balanced": [
        "Perk",
        "Couch",
        "Pivot"
      ],
      "easy": [
        "Manhattan",
        "Sitcom",
        "Six"
      ]
    }
  },
  {
    "word": "Ghostbusters",
    "categoryId": "movies_tv",
    "categoryName": "Movies & TV Shows",
    "hints": {
      "subtle": [
        "Twinkie",
        "Keymaster",
        "Firehouse"
      ],
      "balanced": [
        "Proton",
        "Slimer",
        "Trap"
      ],
      "easy": [
        "Specter",
        "Stream",
        "Slime"
      ]
    }
  },
  {
    "word": "The Lord of the Rings",
    "categoryId": "movies_tv",
    "categoryName": "Movies & TV Shows",
    "hints": {
      "subtle": [
        "Second",
        "Precious",
        "Mithril"
      ],
      "balanced": [
        "Mordor",
        "Hobbit",
        "Fellowship"
      ],
      "easy": [
        "Volcano",
        "Elves",
        "Fantasy"
      ]
    }
  },
  {
    "word": "Jaws",
    "categoryId": "movies_tv",
    "categoryName": "Movies & TV Shows",
    "hints": {
      "subtle": [
        "Barrels",
        "Orca",
        "Amity"
      ],
      "balanced": [
        "Fin",
        "Bigger",
        "Shark"
      ],
      "easy": [
        "Beach",
        "Ocean",
        "Teeth"
      ]
    }
  },
  {
    "word": "Monsters Inc",
    "categoryId": "movies_tv",
    "categoryName": "Movies & TV Shows",
    "hints": {
      "subtle": [
        "Sock",
        "Doors",
        "Canister"
      ],
      "balanced": [
        "Sulley",
        "Mike",
        "Scream"
      ],
      "easy": [
        "Closet",
        "Laughter",
        "Scare"
      ]
    }
  },
  {
    "word": "Squid Game",
    "categoryId": "movies_tv",
    "categoryName": "Movies & TV Shows",
    "hints": {
      "subtle": [
        "Honeycomb",
        "Marbles",
        "Tracksuit"
      ],
      "balanced": [
        "Island",
        "Doll",
        "Guards"
      ],
      "easy": [
        "Money",
        "Survival",
        "Korean"
      ]
    }
  },
  {
    "word": "Pirates of the Caribbean",
    "categoryId": "movies_tv",
    "categoryName": "Movies & TV Shows",
    "hints": {
      "subtle": [
        "Compass",
        "Aztec",
        "Rum"
      ],
      "balanced": [
        "Sparrow",
        "Blackpearl",
        "Curse"
      ],
      "easy": [
        "Ship",
        "Captain",
        "Sword"
      ]
    }
  },
  {
    "word": "The Godfather",
    "categoryId": "movies_tv",
    "categoryName": "Movies & TV Shows",
    "hints": {
      "subtle": [
        "Cannoli",
        "Orange",
        "Rose"
      ],
      "balanced": [
        "Corleone",
        "Mafia",
        "Offer"
      ],
      "easy": [
        "Family",
        "Don",
        "Crime"
      ]
    }
  },
  {
    "word": "Frozen",
    "categoryId": "movies_tv",
    "categoryName": "Movies & TV Shows",
    "hints": {
      "subtle": [
        "Arendelle",
        "Gloves",
        "Carrot"
      ],
      "balanced": [
        "Snowman",
        "Elsa",
        "Blizzard"
      ],
      "easy": [
        "Ice",
        "Sisters",
        "Princess"
      ]
    }
  },
  {
    "word": "Up",
    "categoryId": "movies_tv",
    "categoryName": "Movies & TV Shows",
    "hints": {
      "subtle": [
        "Grape",
        "Snipe",
        "Chair"
      ],
      "balanced": [
        "Balloons",
        "Falls",
        "Wilderness"
      ],
      "easy": [
        "Fly",
        "House",
        "Old"
      ]
    }
  },
  {
    "word": "Money Heist",
    "categoryId": "movies_tv",
    "categoryName": "Movies & TV Shows",
    "hints": {
      "subtle": [
        "Red",
        "Mask",
        "Plan"
      ],
      "balanced": [
        "Bank",
        "Gold",
        "Spain"
      ],
      "easy": [
        "Robbery",
        "Show",
        "Netflix"
      ]
    }
  },
  {
    "word": "Kung Fu Panda",
    "categoryId": "movies_tv",
    "categoryName": "Movies & TV Shows",
    "hints": {
      "subtle": [
        "Noodles",
        "Master",
        "Funny"
      ],
      "balanced": [
        "Dragon",
        "Train",
        "Fight"
      ],
      "easy": [
        "China",
        "Cartoon",
        "Bear"
      ]
    }
  },
  {
    "word": "Tom and Jerry",
    "categoryId": "movies_tv",
    "categoryName": "Movies & TV Shows",
    "hints": {
      "subtle": [
        "House",
        "Run",
        "Funny"
      ],
      "balanced": [
        "Cheese",
        "Trap",
        "Chase"
      ],
      "easy": [
        "Cat",
        "Mouse",
        "Cartoon"
      ]
    }
  },
  {
    "word": "Naruto",
    "categoryId": "movies_tv",
    "categoryName": "Movies & TV Shows",
    "hints": {
      "subtle": [
        "Village",
        "Orange",
        "Run"
      ],
      "balanced": [
        "Ninja",
        "Fight",
        "Power"
      ],
      "easy": [
        "Anime",
        "Japan",
        "Boy"
      ]
    }
  },
  {
    "word": "One Piece",
    "categoryId": "movies_tv",
    "categoryName": "Movies & TV Shows",
    "hints": {
      "subtle": [
        "Ocean",
        "Hat",
        "Dream"
      ],
      "balanced": [
        "Crew",
        "Treasure",
        "Ship"
      ],
      "easy": [
        "Pirate",
        "Anime",
        "Sea"
      ]
    }
  },
  {
    "word": "Wednesday",
    "categoryId": "movies_tv",
    "categoryName": "Movies & TV Shows",
    "hints": {
      "subtle": [
        "Black",
        "School",
        "Dark"
      ],
      "balanced": [
        "Dance",
        "Hand",
        "Girl"
      ],
      "easy": [
        "Gothic",
        "Show",
        "Netflix"
      ]
    }
  },
  {
    "word": "Barbie",
    "categoryId": "movies_tv",
    "categoryName": "Movies & TV Shows",
    "hints": {
      "subtle": [
        "House",
        "Car",
        "Fun"
      ],
      "balanced": [
        "Doll",
        "Blonde",
        "Fashion"
      ],
      "easy": [
        "Pink",
        "Movie",
        "Toy"
      ]
    }
  },
  {
    "word": "Oppenheimer",
    "categoryId": "movies_tv",
    "categoryName": "Movies & TV Shows",
    "hints": {
      "subtle": [
        "Desert",
        "Fire",
        "Loud"
      ],
      "balanced": [
        "Science",
        "War",
        "Test"
      ],
      "easy": [
        "Bomb",
        "History",
        "Movie"
      ]
    }
  },
  {
    "word": "Japan",
    "categoryId": "geography",
    "categoryName": "Countries & Cities",
    "hints": {
      "subtle": [
        "Bullet",
        "Fuji",
        "Kimono"
      ],
      "balanced": [
        "Tokyo",
        "Cherry",
        "Islands"
      ],
      "easy": [
        "Anime",
        "Sushi",
        "Asia"
      ]
    }
  },
  {
    "word": "France",
    "categoryId": "geography",
    "categoryName": "Countries & Cities",
    "hints": {
      "subtle": [
        "Tricolor",
        "Seine",
        "Riviera"
      ],
      "balanced": [
        "Baguette",
        "Eiffel",
        "Wine"
      ],
      "easy": [
        "Paris",
        "Europe",
        "Cheese"
      ]
    }
  },
  {
    "word": "Egypt",
    "categoryId": "geography",
    "categoryName": "Countries & Cities",
    "hints": {
      "subtle": [
        "Papyrus",
        "Sphinx",
        "Hieroglyph"
      ],
      "balanced": [
        "Nile",
        "Pyramids",
        "Pharaoh"
      ],
      "easy": [
        "Desert",
        "Cairo",
        "Mummy"
      ]
    }
  },
  {
    "word": "Brazil",
    "categoryId": "geography",
    "categoryName": "Countries & Cities",
    "hints": {
      "subtle": [
        "Pel",
        "Copacabana",
        "Bossa"
      ],
      "balanced": [
        "Carnival",
        "Amazon",
        "Samba"
      ],
      "easy": [
        "Soccer",
        "Tropical",
        "Yellow"
      ]
    }
  },
  {
    "word": "Iceland",
    "categoryId": "geography",
    "categoryName": "Countries & Cities",
    "hints": {
      "subtle": [
        "Puffin",
        "Lava",
        "Reykjavik"
      ],
      "balanced": [
        "Geysers",
        "Glaciers",
        "Thermal"
      ],
      "easy": [
        "Island",
        "Aurora",
        "Volcano"
      ]
    }
  },
  {
    "word": "Australia",
    "categoryId": "geography",
    "categoryName": "Countries & Cities",
    "hints": {
      "subtle": [
        "Boomerang",
        "Billabong",
        "Didgeridoo"
      ],
      "balanced": [
        "Kangaroo",
        "Outback",
        "Koala"
      ],
      "easy": [
        "Sydney",
        "Reef",
        "Continent"
      ]
    }
  },
  {
    "word": "Canada",
    "categoryId": "geography",
    "categoryName": "Countries & Cities",
    "hints": {
      "subtle": [
        "Mountie",
        "Moose",
        "Loonie"
      ],
      "balanced": [
        "Maple",
        "Hockey",
        "Poutine"
      ],
      "easy": [
        "Snow",
        "Toronto",
        "North"
      ]
    }
  },
  {
    "word": "Italy",
    "categoryId": "geography",
    "categoryName": "Countries & Cities",
    "hints": {
      "subtle": [
        "Gondola",
        "Vespa",
        "Boot"
      ],
      "balanced": [
        "Pasta",
        "Colosseum",
        "Pizza"
      ],
      "easy": [
        "Rome",
        "Gelato",
        "Europe"
      ]
    }
  },
  {
    "word": "Tokyo",
    "categoryId": "geography",
    "categoryName": "Countries & Cities",
    "hints": {
      "subtle": [
        "Shibuya",
        "Metro",
        "Akihabara"
      ],
      "balanced": [
        "Skytree",
        "Neon",
        "Ramen"
      ],
      "easy": [
        "Japan",
        "Crowded",
        "City"
      ]
    }
  },
  {
    "word": "Paris",
    "categoryId": "geography",
    "categoryName": "Countries & Cities",
    "hints": {
      "subtle": [
        "Seine",
        "Louvre",
        "Bistro"
      ],
      "balanced": [
        "Eiffel",
        "Romance",
        "Croissant"
      ],
      "easy": [
        "France",
        "Fashion",
        "Capital"
      ]
    }
  },
  {
    "word": "New York",
    "categoryId": "geography",
    "categoryName": "Countries & Cities",
    "hints": {
      "subtle": [
        "Empire",
        "Yellow",
        "Subway"
      ],
      "balanced": [
        "Broadway",
        "Manhattan",
        "Bagel"
      ],
      "easy": [
        "Statue",
        "Skyscrapers",
        "City"
      ]
    }
  },
  {
    "word": "Rome",
    "categoryId": "geography",
    "categoryName": "Countries & Cities",
    "hints": {
      "subtle": [
        "Vespa",
        "Tiber",
        "Pantheon"
      ],
      "balanced": [
        "Colosseum",
        "Vatican",
        "Fountain"
      ],
      "easy": [
        "Italy",
        "Ancient",
        "Gladiator"
      ]
    }
  },
  {
    "word": "London",
    "categoryId": "geography",
    "categoryName": "Countries & Cities",
    "hints": {
      "subtle": [
        "Underground",
        "Thames",
        "Guards"
      ],
      "balanced": [
        "Bigben",
        "Palace",
        "Cab"
      ],
      "easy": [
        "England",
        "Rain",
        "Bridge"
      ]
    }
  },
  {
    "word": "Greece",
    "categoryId": "geography",
    "categoryName": "Countries & Cities",
    "hints": {
      "subtle": [
        "Feta",
        "Laurel",
        "Mykonos"
      ],
      "balanced": [
        "Athens",
        "Mythology",
        "Olives"
      ],
      "easy": [
        "Parthenon",
        "Islands",
        "Ancient"
      ]
    }
  },
  {
    "word": "Mexico",
    "categoryId": "geography",
    "categoryName": "Countries & Cities",
    "hints": {
      "subtle": [
        "Agave",
        "Mariachi",
        "Mayan"
      ],
      "balanced": [
        "Taco",
        "Salsa",
        "Sombrero"
      ],
      "easy": [
        "Guacamole",
        "Fiesta",
        "Spanish"
      ]
    }
  },
  {
    "word": "Barcelona",
    "categoryId": "geography",
    "categoryName": "Countries & Cities",
    "hints": {
      "subtle": [
        "Ramblas",
        "Trencadis",
        "Catalan"
      ],
      "balanced": [
        "Gaudi",
        "Sagrada",
        "Campnou"
      ],
      "easy": [
        "Spain",
        "Beach",
        "Soccer"
      ]
    }
  },
  {
    "word": "Amsterdam",
    "categoryId": "geography",
    "categoryName": "Countries & Cities",
    "hints": {
      "subtle": [
        "Clogs",
        "Herring",
        "Windmill"
      ],
      "balanced": [
        "Canals",
        "Bicycles",
        "Tulips"
      ],
      "easy": [
        "Netherlands",
        "Dutch",
        "Museums"
      ]
    }
  },
  {
    "word": "Cairo",
    "categoryId": "geography",
    "categoryName": "Countries & Cities",
    "hints": {
      "subtle": [
        "Bazaar",
        "Minarets",
        "Tahrir"
      ],
      "balanced": [
        "Nile",
        "Pyramids",
        "Sphinx"
      ],
      "easy": [
        "Egypt",
        "Desert",
        "Ancient"
      ]
    }
  },
  {
    "word": "Sydney",
    "categoryId": "geography",
    "categoryName": "Countries & Cities",
    "hints": {
      "subtle": [
        "Bondi",
        "Ferry",
        "Coogee"
      ],
      "balanced": [
        "Harbour",
        "Bridge",
        "Opera"
      ],
      "easy": [
        "Australia",
        "Surfing",
        "City"
      ]
    }
  },
  {
    "word": "Venice",
    "categoryId": "geography",
    "categoryName": "Countries & Cities",
    "hints": {
      "subtle": [
        "Piazza",
        "Masks",
        "Lagoon"
      ],
      "balanced": [
        "Gondola",
        "Bridges",
        "Waterways"
      ],
      "easy": [
        "Italy",
        "Canal",
        "Floating"
      ]
    }
  },
  {
    "word": "Switzerland",
    "categoryId": "geography",
    "categoryName": "Countries & Cities",
    "hints": {
      "subtle": [
        "Yodel",
        "Fondue",
        "Chalet"
      ],
      "balanced": [
        "Alps",
        "Watch",
        "Chocolate"
      ],
      "easy": [
        "Skiing",
        "Neutral",
        "Banks"
      ]
    }
  },
  {
    "word": "Norway",
    "categoryId": "geography",
    "categoryName": "Countries & Cities",
    "hints": {
      "subtle": [
        "Viking",
        "Lofoten",
        "Troll"
      ],
      "balanced": [
        "Fjords",
        "Midnight",
        "Oslo"
      ],
      "easy": [
        "Aurora",
        "Snow",
        "Nordic"
      ]
    }
  },
  {
    "word": "Thailand",
    "categoryId": "geography",
    "categoryName": "Countries & Cities",
    "hints": {
      "subtle": [
        "Tuktuk",
        "Muay",
        "Elephant"
      ],
      "balanced": [
        "Bangkok",
        "Pad",
        "Temples"
      ],
      "easy": [
        "Spicy",
        "Islands",
        "Asia"
      ]
    }
  },
  {
    "word": "South Africa",
    "categoryId": "geography",
    "categoryName": "Countries & Cities",
    "hints": {
      "subtle": [
        "Vuvuzela",
        "Table",
        "Springboks"
      ],
      "balanced": [
        "Mandela",
        "Safari",
        "Cape"
      ],
      "easy": [
        "Lions",
        "Gold",
        "Rainbow"
      ]
    }
  },
  {
    "word": "India",
    "categoryId": "geography",
    "categoryName": "Countries & Cities",
    "hints": {
      "subtle": [
        "Sari",
        "Ganges",
        "Rickshaw"
      ],
      "balanced": [
        "Mahal",
        "Curry",
        "Cricket"
      ],
      "easy": [
        "Spices",
        "Bollywood",
        "Asia"
      ]
    }
  },
  {
    "word": "Singapore",
    "categoryId": "geography",
    "categoryName": "Countries & Cities",
    "hints": {
      "subtle": [
        "Merlion",
        "Hawker",
        "Changi"
      ],
      "balanced": [
        "Clean",
        "Marina",
        "Island"
      ],
      "easy": [
        "Port",
        "Skyscrapers",
        "Gardens"
      ]
    }
  },
  {
    "word": "Dubai",
    "categoryId": "geography",
    "categoryName": "Countries & Cities",
    "hints": {
      "subtle": [
        "Burj",
        "Dune",
        "Mall"
      ],
      "balanced": [
        "Tallest",
        "Luxury",
        "Palm"
      ],
      "easy": [
        "Desert",
        "Skyscrapers",
        "Gold"
      ]
    }
  },
  {
    "word": "Rio de Janeiro",
    "categoryId": "geography",
    "categoryName": "Countries & Cities",
    "hints": {
      "subtle": [
        "Copacabana",
        "Sugarloaf",
        "Favela"
      ],
      "balanced": [
        "Carnival",
        "Samba",
        "Redeemer"
      ],
      "easy": [
        "Beach",
        "Brazil",
        "Statue"
      ]
    }
  },
  {
    "word": "Istanbul",
    "categoryId": "geography",
    "categoryName": "Countries & Cities",
    "hints": {
      "subtle": [
        "Bosphorus",
        "Cats",
        "Galata"
      ],
      "balanced": [
        "Mosque",
        "Bazaar",
        "Continents"
      ],
      "easy": [
        "Turkey",
        "Spices",
        "Ancient"
      ]
    }
  },
  {
    "word": "San Francisco",
    "categoryId": "geography",
    "categoryName": "Countries & Cities",
    "hints": {
      "subtle": [
        "Alcatraz",
        "Lombard",
        "Sourdough"
      ],
      "balanced": [
        "Bridge",
        "Cablecar",
        "Fog"
      ],
      "easy": [
        "Hills",
        "Bay",
        "California"
      ]
    }
  },
  {
    "word": "New Zealand",
    "categoryId": "geography",
    "categoryName": "Countries & Cities",
    "hints": {
      "subtle": [
        "Haka",
        "Hobbiton",
        "Fern"
      ],
      "balanced": [
        "Kiwi",
        "Sheep",
        "Islands"
      ],
      "easy": [
        "Mountains",
        "Green",
        "Pacific"
      ]
    }
  },
  {
    "word": "Seoul",
    "categoryId": "geography",
    "categoryName": "Countries & Cities",
    "hints": {
      "subtle": [
        "Han",
        "Hanbok",
        "Soju"
      ],
      "balanced": [
        "Kimchi",
        "Palaces",
        "Tower"
      ],
      "easy": [
        "Korea",
        "Kpop",
        "Metro"
      ]
    }
  },
  {
    "word": "Argentina",
    "categoryId": "geography",
    "categoryName": "Countries & Cities",
    "hints": {
      "subtle": [
        "Mate",
        "Gaucho",
        "Patagonia"
      ],
      "balanced": [
        "Tango",
        "Steak",
        "Messi"
      ],
      "easy": [
        "Soccer",
        "Andes",
        "South"
      ]
    }
  },
  {
    "word": "China",
    "categoryId": "geography",
    "categoryName": "Countries & Cities",
    "hints": {
      "subtle": [
        "Big",
        "Old",
        "Red"
      ],
      "balanced": [
        "Wall",
        "Dragon",
        "Tea"
      ],
      "easy": [
        "Asia",
        "Panda",
        "Beijing"
      ]
    }
  },
  {
    "word": "United States",
    "categoryId": "geography",
    "categoryName": "Countries & Cities",
    "hints": {
      "subtle": [
        "Big",
        "Movies",
        "Flag"
      ],
      "balanced": [
        "Stars",
        "Burger",
        "Rich"
      ],
      "easy": [
        "America",
        "Newyork",
        "Hollywood"
      ]
    }
  },
  {
    "word": "United Kingdom",
    "categoryId": "geography",
    "categoryName": "Countries & Cities",
    "hints": {
      "subtle": [
        "Rain",
        "Tea",
        "Royal"
      ],
      "balanced": [
        "Queen",
        "Bus",
        "Island"
      ],
      "easy": [
        "London",
        "England",
        "Europe"
      ]
    }
  },
  {
    "word": "Germany",
    "categoryId": "geography",
    "categoryName": "Countries & Cities",
    "hints": {
      "subtle": [
        "Cars",
        "Beer",
        "Castle"
      ],
      "balanced": [
        "Fast",
        "Bread",
        "Europe"
      ],
      "easy": [
        "Berlin",
        "Football",
        "Clean"
      ]
    }
  },
  {
    "word": "Spain",
    "categoryId": "geography",
    "categoryName": "Countries & Cities",
    "hints": {
      "subtle": [
        "Sun",
        "Dance",
        "Beach"
      ],
      "balanced": [
        "Bull",
        "Food",
        "Europe"
      ],
      "easy": [
        "Madrid",
        "Football",
        "Warm"
      ]
    }
  },
  {
    "word": "South Korea",
    "categoryId": "geography",
    "categoryName": "Countries & Cities",
    "hints": {
      "subtle": [
        "Modern",
        "Fast",
        "Tech"
      ],
      "balanced": [
        "Music",
        "Food",
        "Asia"
      ],
      "easy": [
        "Seoul",
        "Kpop",
        "Drama"
      ]
    }
  },
  {
    "word": "Turkey",
    "categoryId": "geography",
    "categoryName": "Countries & Cities",
    "hints": {
      "subtle": [
        "Bridge",
        "Tea",
        "Old"
      ],
      "balanced": [
        "Market",
        "Carpet",
        "East"
      ],
      "easy": [
        "Istanbul",
        "Europe",
        "Asia"
      ]
    }
  },
  {
    "word": "Nepal",
    "categoryId": "geography",
    "categoryName": "Countries & Cities",
    "hints": {
      "subtle": [
        "High",
        "Cold",
        "Flag"
      ],
      "balanced": [
        "Climb",
        "Peace",
        "Asia"
      ],
      "easy": [
        "Everest",
        "Mountains",
        "Himalayas"
      ]
    }
  },
  {
    "word": "Russia",
    "categoryId": "geography",
    "categoryName": "Countries & Cities",
    "hints": {
      "subtle": [
        "Huge",
        "Cold",
        "Snow"
      ],
      "balanced": [
        "Winter",
        "Bear",
        "North"
      ],
      "easy": [
        "Moscow",
        "Big",
        "Europe"
      ]
    }
  },
  {
    "word": "Bangkok",
    "categoryId": "geography",
    "categoryName": "Countries & Cities",
    "hints": {
      "subtle": [
        "Busy",
        "Warm",
        "Street"
      ],
      "balanced": [
        "Food",
        "Boat",
        "Gold"
      ],
      "easy": [
        "Thailand",
        "Capital",
        "Temples"
      ]
    }
  },
  {
    "word": "Astronaut",
    "categoryId": "professions",
    "categoryName": "Jobs & Professions",
    "hints": {
      "subtle": [
        "Floating",
        "Visor",
        "Tether"
      ],
      "balanced": [
        "Spacesuit",
        "Rocket",
        "Spacewalk"
      ],
      "easy": [
        "Moon",
        "Orbit",
        "Cosmos"
      ]
    }
  },
  {
    "word": "Detective",
    "categoryId": "professions",
    "categoryName": "Jobs & Professions",
    "hints": {
      "subtle": [
        "Trenchcoat",
        "Alibi",
        "Fingerprints"
      ],
      "balanced": [
        "Magnifier",
        "Suspect",
        "Clues"
      ],
      "easy": [
        "Mystery",
        "Police",
        "Solve"
      ]
    }
  },
  {
    "word": "Chef",
    "categoryId": "professions",
    "categoryName": "Jobs & Professions",
    "hints": {
      "subtle": [
        "Apron",
        "Garnish",
        "Simmer"
      ],
      "balanced": [
        "Toque",
        "Kitchen",
        "Knife"
      ],
      "easy": [
        "Cook",
        "Restaurant",
        "Menu"
      ]
    }
  },
  {
    "word": "Firefighter",
    "categoryId": "professions",
    "categoryName": "Jobs & Professions",
    "hints": {
      "subtle": [
        "Hydrant",
        "Siren",
        "Axe"
      ],
      "balanced": [
        "Hose",
        "Ladder",
        "Helmet"
      ],
      "easy": [
        "Flames",
        "Smoke",
        "Rescue"
      ]
    }
  },
  {
    "word": "Pilot",
    "categoryId": "professions",
    "categoryName": "Jobs & Professions",
    "hints": {
      "subtle": [
        "Rudder",
        "Checklist",
        "Aviator"
      ],
      "balanced": [
        "Cockpit",
        "Runway",
        "Altitude"
      ],
      "easy": [
        "Airplane",
        "Wings",
        "Fly"
      ]
    }
  },
  {
    "word": "Architect",
    "categoryId": "professions",
    "categoryName": "Jobs & Professions",
    "hints": {
      "subtle": [
        "Drafting",
        "Facade",
        "Scale"
      ],
      "balanced": [
        "Blueprint",
        "Building",
        "Hardhat"
      ],
      "easy": [
        "Design",
        "Skyscraper",
        "House"
      ]
    }
  },
  {
    "word": "Surgeon",
    "categoryId": "professions",
    "categoryName": "Jobs & Professions",
    "hints": {
      "subtle": [
        "Scrubs",
        "Sterile",
        "Forceps"
      ],
      "balanced": [
        "Scalpel",
        "Hospital",
        "Sutures"
      ],
      "easy": [
        "Doctor",
        "Operation",
        "Gloves"
      ]
    }
  },
  {
    "word": "Photographer",
    "categoryId": "professions",
    "categoryName": "Jobs & Professions",
    "hints": {
      "subtle": [
        "Aperture",
        "Shutter",
        "Darkroom"
      ],
      "balanced": [
        "Tripod",
        "Lens",
        "Flash"
      ],
      "easy": [
        "Camera",
        "Picture",
        "Shoot"
      ]
    }
  },
  {
    "word": "Librarian",
    "categoryId": "professions",
    "categoryName": "Jobs & Professions",
    "hints": {
      "subtle": [
        "Barcode",
        "Dewey",
        "Bookmarks"
      ],
      "balanced": [
        "Shelves",
        "Quiet",
        "Catalog"
      ],
      "easy": [
        "Books",
        "Reading",
        "Borrow"
      ]
    }
  },
  {
    "word": "Journalist",
    "categoryId": "professions",
    "categoryName": "Jobs & Professions",
    "hints": {
      "subtle": [
        "Deadline",
        "Byline",
        "Dictaphone"
      ],
      "balanced": [
        "Headline",
        "Interview",
        "Reporter"
      ],
      "easy": [
        "Newspaper",
        "News",
        "Article"
      ]
    }
  },
  {
    "word": "Plumber",
    "categoryId": "professions",
    "categoryName": "Jobs & Professions",
    "hints": {
      "subtle": [
        "Wrench",
        "Drain",
        "Washer"
      ],
      "balanced": [
        "Pipes",
        "Leak",
        "Clog"
      ],
      "easy": [
        "Water",
        "Sink",
        "Toilet"
      ]
    }
  },
  {
    "word": "Veterinarian",
    "categoryId": "professions",
    "categoryName": "Jobs & Professions",
    "hints": {
      "subtle": [
        "Kennel",
        "Rabies",
        "Microchip"
      ],
      "balanced": [
        "Clinic",
        "Paws",
        "Vaccine"
      ],
      "easy": [
        "Animals",
        "Doctor",
        "Pets"
      ]
    }
  },
  {
    "word": "Judge",
    "categoryId": "professions",
    "categoryName": "Jobs & Professions",
    "hints": {
      "subtle": [
        "Bench",
        "Chambers",
        "Objection"
      ],
      "balanced": [
        "Gavel",
        "Robe",
        "Verdict"
      ],
      "easy": [
        "Court",
        "Law",
        "Jury"
      ]
    }
  },
  {
    "word": "Electrician",
    "categoryId": "professions",
    "categoryName": "Jobs & Professions",
    "hints": {
      "subtle": [
        "Strippers",
        "Conduit",
        "Multimeter"
      ],
      "balanced": [
        "Breaker",
        "Voltage",
        "Outlet"
      ],
      "easy": [
        "Wires",
        "Power",
        "Current"
      ]
    }
  },
  {
    "word": "Lifeguard",
    "categoryId": "professions",
    "categoryName": "Jobs & Professions",
    "hints": {
      "subtle": [
        "Sunscreen",
        "Buoy",
        "Umbrella"
      ],
      "balanced": [
        "Whistle",
        "Tower",
        "Rescue"
      ],
      "easy": [
        "Beach",
        "Pool",
        "Swim"
      ]
    }
  },
  {
    "word": "Flight Attendant",
    "categoryId": "professions",
    "categoryName": "Jobs & Professions",
    "hints": {
      "subtle": [
        "Aisle",
        "Overhead",
        "Briefing"
      ],
      "balanced": [
        "Cabin",
        "Cart",
        "Safety"
      ],
      "easy": [
        "Airplane",
        "Passengers",
        "Uniform"
      ]
    }
  },
  {
    "word": "Carpenter",
    "categoryId": "professions",
    "categoryName": "Jobs & Professions",
    "hints": {
      "subtle": [
        "Sawdust",
        "Sandpaper",
        "Level"
      ],
      "balanced": [
        "Hammer",
        "Timber",
        "Saw"
      ],
      "easy": [
        "Wood",
        "Nails",
        "Build"
      ]
    }
  },
  {
    "word": "Graphic Designer",
    "categoryId": "professions",
    "categoryName": "Jobs & Professions",
    "hints": {
      "subtle": [
        "Kerning",
        "Vector",
        "Pantone"
      ],
      "balanced": [
        "Typography",
        "Layout",
        "Tablet"
      ],
      "easy": [
        "Logo",
        "Visual",
        "Digital"
      ]
    }
  },
  {
    "word": "Teacher",
    "categoryId": "professions",
    "categoryName": "Jobs & Professions",
    "hints": {
      "subtle": [
        "Chalk",
        "Recess",
        "Attendance"
      ],
      "balanced": [
        "Classroom",
        "Homework",
        "Lesson"
      ],
      "easy": [
        "School",
        "Students",
        "Learn"
      ]
    }
  },
  {
    "word": "Farmer",
    "categoryId": "professions",
    "categoryName": "Jobs & Professions",
    "hints": {
      "subtle": [
        "Scarecrow",
        "Silo",
        "Trough"
      ],
      "balanced": [
        "Tractor",
        "Barn",
        "Harvest"
      ],
      "easy": [
        "Crops",
        "Soil",
        "Fields"
      ]
    }
  },
  {
    "word": "Dentist",
    "categoryId": "professions",
    "categoryName": "Jobs & Professions",
    "hints": {
      "subtle": [
        "Mirror",
        "Spit",
        "Floss"
      ],
      "balanced": [
        "Drill",
        "Cavity",
        "Enamel"
      ],
      "easy": [
        "Teeth",
        "Smile",
        "Mouth"
      ]
    }
  },
  {
    "word": "Astronomer",
    "categoryId": "professions",
    "categoryName": "Jobs & Professions",
    "hints": {
      "subtle": [
        "Spectra",
        "Nebula",
        "Orbit"
      ],
      "balanced": [
        "Telescope",
        "Observatory",
        "Constellation"
      ],
      "easy": [
        "Stars",
        "Planets",
        "Space"
      ]
    }
  },
  {
    "word": "Barista",
    "categoryId": "professions",
    "categoryName": "Jobs & Professions",
    "hints": {
      "subtle": [
        "Tamper",
        "Portafilter",
        "Roast"
      ],
      "balanced": [
        "Espresso",
        "Froth",
        "Cafe"
      ],
      "easy": [
        "Coffee",
        "Latte",
        "Cup"
      ]
    }
  },
  {
    "word": "Fisherman",
    "categoryId": "professions",
    "categoryName": "Jobs & Professions",
    "hints": {
      "subtle": [
        "Trawler",
        "Bait",
        "Tackle"
      ],
      "balanced": [
        "Net",
        "Hook",
        "Wharf"
      ],
      "easy": [
        "Boat",
        "Ocean",
        "Catch"
      ]
    }
  },
  {
    "word": "Mechanic",
    "categoryId": "professions",
    "categoryName": "Jobs & Professions",
    "hints": {
      "subtle": [
        "Dipstick",
        "Gasket",
        "Lift"
      ],
      "balanced": [
        "Wrench",
        "Engine",
        "Grease"
      ],
      "easy": [
        "Car",
        "Garage",
        "Fix"
      ]
    }
  },
  {
    "word": "Baker",
    "categoryId": "professions",
    "categoryName": "Jobs & Professions",
    "hints": {
      "subtle": [
        "Proofing",
        "Apron",
        "Peel"
      ],
      "balanced": [
        "Yeast",
        "Oven",
        "Knead"
      ],
      "easy": [
        "Flour",
        "Bread",
        "Pastry"
      ]
    }
  },
  {
    "word": "Florist",
    "categoryId": "professions",
    "categoryName": "Jobs & Professions",
    "hints": {
      "subtle": [
        "Shears",
        "Ribbon",
        "Greenhouse"
      ],
      "balanced": [
        "Bouquet",
        "Petals",
        "Roses"
      ],
      "easy": [
        "Flowers",
        "Vase",
        "Shop"
      ]
    }
  },
  {
    "word": "Coach",
    "categoryId": "professions",
    "categoryName": "Jobs & Professions",
    "hints": {
      "subtle": [
        "Clipboard",
        "Stopwatch",
        "Drills"
      ],
      "balanced": [
        "Whistle",
        "Sideline",
        "Tactics"
      ],
      "easy": [
        "Team",
        "Training",
        "Win"
      ]
    }
  },
  {
    "word": "Scientist",
    "categoryId": "professions",
    "categoryName": "Jobs & Professions",
    "hints": {
      "subtle": [
        "Beaker",
        "Peer",
        "Data"
      ],
      "balanced": [
        "Hypothesis",
        "Labcoat",
        "Microscope"
      ],
      "easy": [
        "Experiment",
        "Research",
        "Lab"
      ]
    }
  },
  {
    "word": "Doctor",
    "categoryId": "professions",
    "categoryName": "Jobs & Professions",
    "hints": {
      "subtle": [
        "White",
        "Help",
        "Care"
      ],
      "balanced": [
        "Medicine",
        "Sick",
        "Check"
      ],
      "easy": [
        "Hospital",
        "Health",
        "Clinic"
      ]
    }
  },
  {
    "word": "Police Officer",
    "categoryId": "professions",
    "categoryName": "Jobs & Professions",
    "hints": {
      "subtle": [
        "Uniform",
        "Car",
        "Street"
      ],
      "balanced": [
        "Badge",
        "Safe",
        "Catch"
      ],
      "easy": [
        "Law",
        "Crime",
        "Arrest"
      ]
    }
  },
  {
    "word": "Lawyer",
    "categoryId": "professions",
    "categoryName": "Jobs & Professions",
    "hints": {
      "subtle": [
        "Suit",
        "Talk",
        "Books"
      ],
      "balanced": [
        "Case",
        "Argue",
        "Rules"
      ],
      "easy": [
        "Court",
        "Law",
        "Judge"
      ]
    }
  },
  {
    "word": "Nurse",
    "categoryId": "professions",
    "categoryName": "Jobs & Professions",
    "hints": {
      "subtle": [
        "Care",
        "Help",
        "Kind"
      ],
      "balanced": [
        "Medicine",
        "Needle",
        "White"
      ],
      "easy": [
        "Hospital",
        "Doctor",
        "Patient"
      ]
    }
  },
  {
    "word": "Engineer",
    "categoryId": "professions",
    "categoryName": "Jobs & Professions",
    "hints": {
      "subtle": [
        "Math",
        "Plan",
        "Smart"
      ],
      "balanced": [
        "Build",
        "Machine",
        "Design"
      ],
      "easy": [
        "Bridge",
        "Tech",
        "Fix"
      ]
    }
  },
  {
    "word": "Barber",
    "categoryId": "professions",
    "categoryName": "Jobs & Professions",
    "hints": {
      "subtle": [
        "Chair",
        "Mirror",
        "Talk"
      ],
      "balanced": [
        "Sharp",
        "Trim",
        "Style"
      ],
      "easy": [
        "Hair",
        "Cut",
        "Scissors"
      ]
    }
  },
  {
    "word": "Artist",
    "categoryId": "professions",
    "categoryName": "Jobs & Professions",
    "hints": {
      "subtle": [
        "Color",
        "Dream",
        "Hands"
      ],
      "balanced": [
        "Brush",
        "Draw",
        "Canvas"
      ],
      "easy": [
        "Paint",
        "Art",
        "Picture"
      ]
    }
  },
  {
    "word": "Singer",
    "categoryId": "professions",
    "categoryName": "Jobs & Professions",
    "hints": {
      "subtle": [
        "Stage",
        "Lights",
        "Fans"
      ],
      "balanced": [
        "Voice",
        "Loud",
        "Concert"
      ],
      "easy": [
        "Song",
        "Music",
        "Microphone"
      ]
    }
  },
  {
    "word": "Actor",
    "categoryId": "professions",
    "categoryName": "Jobs & Professions",
    "hints": {
      "subtle": [
        "Stage",
        "Lights",
        "Fame"
      ],
      "balanced": [
        "Camera",
        "Role",
        "Script"
      ],
      "easy": [
        "Movie",
        "Film",
        "Star"
      ]
    }
  },
  {
    "word": "Waiter",
    "categoryId": "professions",
    "categoryName": "Jobs & Professions",
    "hints": {
      "subtle": [
        "Tray",
        "Smile",
        "Walk"
      ],
      "balanced": [
        "Order",
        "Table",
        "Menu"
      ],
      "easy": [
        "Food",
        "Restaurant",
        "Serve"
      ]
    }
  },
  {
    "word": "Driver",
    "categoryId": "professions",
    "categoryName": "Jobs & Professions",
    "hints": {
      "subtle": [
        "Road",
        "Wheel",
        "Seats"
      ],
      "balanced": [
        "Map",
        "Traffic",
        "Trip"
      ],
      "easy": [
        "Car",
        "Bus",
        "Taxi"
      ]
    }
  },
  {
    "word": "Programmer",
    "categoryId": "professions",
    "categoryName": "Jobs & Professions",
    "hints": {
      "subtle": [
        "Screen",
        "Night",
        "Coffee"
      ],
      "balanced": [
        "Laptop",
        "Logic",
        "App"
      ],
      "easy": [
        "Code",
        "Computer",
        "Software"
      ]
    }
  },
  {
    "word": "Nike",
    "categoryId": "brands",
    "categoryName": "Popular Brands",
    "hints": {
      "subtle": [
        "Goddess",
        "Waffle",
        "Oregon"
      ],
      "balanced": [
        "Swoosh",
        "Sneakers",
        "Athletic"
      ],
      "easy": [
        "Shoes",
        "Jordan",
        "Sport"
      ]
    }
  },
  {
    "word": "Apple",
    "categoryId": "brands",
    "categoryName": "Popular Brands",
    "hints": {
      "subtle": [
        "Cupertino",
        "Bitten",
        "Wozniak"
      ],
      "balanced": [
        "iPhone",
        "Macintosh",
        "Minimalist"
      ],
      "easy": [
        "Computer",
        "Tablet",
        "Tech"
      ]
    }
  },
  {
    "word": "Coca-Cola",
    "categoryId": "brands",
    "categoryName": "Popular Brands",
    "hints": {
      "subtle": [
        "Pemberton",
        "Contour",
        "Secret"
      ],
      "balanced": [
        "Soda",
        "Fizz",
        "Script"
      ],
      "easy": [
        "Red",
        "Drink",
        "Can"
      ]
    }
  },
  {
    "word": "Google",
    "categoryId": "brands",
    "categoryName": "Popular Brands",
    "hints": {
      "subtle": [
        "PageRank",
        "Googol",
        "Mountainview"
      ],
      "balanced": [
        "Search",
        "Browser",
        "Android"
      ],
      "easy": [
        "Internet",
        "Query",
        "Answers"
      ]
    }
  },
  {
    "word": "Disney",
    "categoryId": "brands",
    "categoryName": "Popular Brands",
    "hints": {
      "subtle": [
        "Steamboat",
        "Imagineer",
        "Vault"
      ],
      "balanced": [
        "Castle",
        "Mickey",
        "Kingdom"
      ],
      "easy": [
        "Animation",
        "Movies",
        "Magic"
      ]
    }
  },
  {
    "word": "Lego",
    "categoryId": "brands",
    "categoryName": "Popular Brands",
    "hints": {
      "subtle": [
        "Billund",
        "ABS",
        "Leggodt"
      ],
      "balanced": [
        "Bricks",
        "Studs",
        "Minifigure"
      ],
      "easy": [
        "Toy",
        "Build",
        "Plastic"
      ]
    }
  },
  {
    "word": "Spotify",
    "categoryId": "brands",
    "categoryName": "Popular Brands",
    "hints": {
      "subtle": [
        "Discover",
        "Wrapped",
        "Stockholm"
      ],
      "balanced": [
        "Streaming",
        "Playlist",
        "Podcasts"
      ],
      "easy": [
        "Music",
        "Songs",
        "Listen"
      ]
    }
  },
  {
    "word": "Netflix",
    "categoryId": "brands",
    "categoryName": "Popular Brands",
    "hints": {
      "subtle": [
        "Redenvelope",
        "Tadum",
        "Binge"
      ],
      "balanced": [
        "Streaming",
        "Series",
        "Movies"
      ],
      "easy": [
        "Subscription",
        "Television",
        "Watch"
      ]
    }
  },
  {
    "word": "Nintendo",
    "categoryId": "brands",
    "categoryName": "Popular Brands",
    "hints": {
      "subtle": [
        "Hanafuda",
        "Kyoto",
        "Dpad"
      ],
      "balanced": [
        "Switch",
        "Mario",
        "Console"
      ],
      "easy": [
        "Gaming",
        "Japanese",
        "Play"
      ]
    }
  },
  {
    "word": "Tesla",
    "categoryId": "brands",
    "categoryName": "Popular Brands",
    "hints": {
      "subtle": [
        "Gigafactory",
        "Supercharger",
        "Ludicrous"
      ],
      "balanced": [
        "Autopilot",
        "Battery",
        "Sedan"
      ],
      "easy": [
        "Electric",
        "Car",
        "Musk"
      ]
    }
  },
  {
    "word": "Starbucks",
    "categoryId": "brands",
    "categoryName": "Popular Brands",
    "hints": {
      "subtle": [
        "Pikeplace",
        "Siren",
        "Frappuccino"
      ],
      "balanced": [
        "Barista",
        "Espresso",
        "Cup"
      ],
      "easy": [
        "Coffee",
        "Cafe",
        "Green"
      ]
    }
  },
  {
    "word": "Ikea",
    "categoryId": "brands",
    "categoryName": "Popular Brands",
    "hints": {
      "subtle": [
        "Allen",
        "Smland",
        "Billy"
      ],
      "balanced": [
        "Meatballs",
        "Flatpack",
        "Showroom"
      ],
      "easy": [
        "Furniture",
        "Swedish",
        "Assemble"
      ]
    }
  },
  {
    "word": "Adidas",
    "categoryId": "brands",
    "categoryName": "Popular Brands",
    "hints": {
      "subtle": [
        "Dassler",
        "Boost",
        "StanSmith"
      ],
      "balanced": [
        "Stripes",
        "Trefoil",
        "Tracksuit"
      ],
      "easy": [
        "Sneakers",
        "Sport",
        "German"
      ]
    }
  },
  {
    "word": "McDonalds",
    "categoryId": "brands",
    "categoryName": "Popular Brands",
    "hints": {
      "subtle": [
        "Kroc",
        "Playplace",
        "Drivethru"
      ],
      "balanced": [
        "Arches",
        "Bigmac",
        "Happy"
      ],
      "easy": [
        "Burger",
        "Fries",
        "Fastfood"
      ]
    }
  },
  {
    "word": "Amazon",
    "categoryId": "brands",
    "categoryName": "Popular Brands",
    "hints": {
      "subtle": [
        "Bezos",
        "Smile",
        "AWS"
      ],
      "balanced": [
        "Prime",
        "Delivery",
        "Cardboard"
      ],
      "easy": [
        "Shopping",
        "Packages",
        "Online"
      ]
    }
  },
  {
    "word": "PlayStation",
    "categoryId": "brands",
    "categoryName": "Popular Brands",
    "hints": {
      "subtle": [
        "DualSense",
        "Symbols",
        "Kutaragi"
      ],
      "balanced": [
        "Console",
        "Controller",
        "Sony"
      ],
      "easy": [
        "Gaming",
        "Play",
        "Games"
      ]
    }
  },
  {
    "word": "Ferrari",
    "categoryId": "brands",
    "categoryName": "Popular Brands",
    "hints": {
      "subtle": [
        "Maranello",
        "Scuderia",
        "Enzo"
      ],
      "balanced": [
        "Horse",
        "Rosso",
        "Supercar"
      ],
      "easy": [
        "Red",
        "Fast",
        "Italian"
      ]
    }
  },
  {
    "word": "Samsung",
    "categoryId": "brands",
    "categoryName": "Popular Brands",
    "hints": {
      "subtle": [
        "Chaebol",
        "Suwon",
        "Threestars"
      ],
      "balanced": [
        "Galaxy",
        "Displays",
        "Korean"
      ],
      "easy": [
        "Phones",
        "Electronics",
        "Television"
      ]
    }
  },
  {
    "word": "Rolex",
    "categoryId": "brands",
    "categoryName": "Popular Brands",
    "hints": {
      "subtle": [
        "Oyster",
        "Submariner",
        "Geneva"
      ],
      "balanced": [
        "Crown",
        "Luxury",
        "Swiss"
      ],
      "easy": [
        "Watch",
        "Gold",
        "Time"
      ]
    }
  },
  {
    "word": "Gucci",
    "categoryId": "brands",
    "categoryName": "Popular Brands",
    "hints": {
      "subtle": [
        "Horsebit",
        "Florence",
        "Bamboo"
      ],
      "balanced": [
        "Handbags",
        "Luxury",
        "Fashion"
      ],
      "easy": [
        "Italian",
        "Designer",
        "Leather"
      ]
    }
  },
  {
    "word": "Microsoft",
    "categoryId": "brands",
    "categoryName": "Popular Brands",
    "hints": {
      "subtle": [
        "Redmond",
        "Clippy",
        "Ballmer"
      ],
      "balanced": [
        "Windows",
        "Office",
        "Xbox"
      ],
      "easy": [
        "Software",
        "Computer",
        "Gates"
      ]
    }
  },
  {
    "word": "YouTube",
    "categoryId": "brands",
    "categoryName": "Popular Brands",
    "hints": {
      "subtle": [
        "Jawad",
        "Monetize",
        "Sanbruno"
      ],
      "balanced": [
        "Subscribe",
        "Creator",
        "Channels"
      ],
      "easy": [
        "Video",
        "Watch",
        "Red"
      ]
    }
  },
  {
    "word": "Vans",
    "categoryId": "brands",
    "categoryName": "Popular Brands",
    "hints": {
      "subtle": [
        "Waffle",
        "Anaheim",
        "Sidestripe"
      ],
      "balanced": [
        "Checkerboard",
        "Skateboarding",
        "Canvas"
      ],
      "easy": [
        "Sneakers",
        "Shoes",
        "Slipon"
      ]
    }
  },
  {
    "word": "Puma",
    "categoryId": "brands",
    "categoryName": "Popular Brands",
    "hints": {
      "subtle": [
        "Herzogenaurach",
        "Formstrip",
        "Suede"
      ],
      "balanced": [
        "Feline",
        "Soccer",
        "Sprint"
      ],
      "easy": [
        "Sneakers",
        "Sport",
        "German"
      ]
    }
  },
  {
    "word": "Visa",
    "categoryId": "brands",
    "categoryName": "Popular Brands",
    "hints": {
      "subtle": [
        "Deehock",
        "Interchange",
        "Everywhere"
      ],
      "balanced": [
        "Credit",
        "Debit",
        "Chip"
      ],
      "easy": [
        "Payment",
        "Card",
        "Swipe"
      ]
    }
  },
  {
    "word": "Sony",
    "categoryId": "brands",
    "categoryName": "Popular Brands",
    "hints": {
      "subtle": [
        "Morita",
        "Trinitron",
        "Betamax"
      ],
      "balanced": [
        "Walkman",
        "PlayStation",
        "Cameras"
      ],
      "easy": [
        "Electronics",
        "Japanese",
        "Television"
      ]
    }
  },
  {
    "word": "Red Bull",
    "categoryId": "brands",
    "categoryName": "Popular Brands",
    "hints": {
      "subtle": [
        "Mateschitz",
        "Stratos",
        "Taurine"
      ],
      "balanced": [
        "Wings",
        "Energy",
        "Extreme"
      ],
      "easy": [
        "Drink",
        "Can",
        "Caffeine"
      ]
    }
  },
  {
    "word": "Porsche",
    "categoryId": "brands",
    "categoryName": "Popular Brands",
    "hints": {
      "subtle": [
        "Stuttgart",
        "Track",
        "Luxury"
      ],
      "balanced": [
        "Coupe",
        "Turbo",
        "German"
      ],
      "easy": [
        "Sports",
        "Car",
        "Fast"
      ]
    }
  },
  {
    "word": "Subway",
    "categoryId": "brands",
    "categoryName": "Popular Brands",
    "hints": {
      "subtle": [
        "DeLuca",
        "Footlong",
        "Herbs"
      ],
      "balanced": [
        "Sandwich",
        "Artist",
        "Toasted"
      ],
      "easy": [
        "Bread",
        "Fastfood",
        "Eat"
      ]
    }
  },
  {
    "word": "Audi",
    "categoryId": "brands",
    "categoryName": "Popular Brands",
    "hints": {
      "subtle": [
        "Bavaria",
        "Luxury",
        "Sedan"
      ],
      "balanced": [
        "Rings",
        "Quattro",
        "German"
      ],
      "easy": [
        "Car",
        "Drive",
        "Auto"
      ]
    }
  },
  {
    "word": "Instagram",
    "categoryId": "brands",
    "categoryName": "Popular Brands",
    "hints": {
      "subtle": [
        "Photo",
        "Like",
        "Story"
      ],
      "balanced": [
        "Filter",
        "Follow",
        "App"
      ],
      "easy": [
        "Social",
        "Pictures",
        "Phone"
      ]
    }
  },
  {
    "word": "TikTok",
    "categoryId": "brands",
    "categoryName": "Popular Brands",
    "hints": {
      "subtle": [
        "Short",
        "Trend",
        "Dance"
      ],
      "balanced": [
        "Scroll",
        "Viral",
        "App"
      ],
      "easy": [
        "Video",
        "Music",
        "Phone"
      ]
    }
  },
  {
    "word": "WhatsApp",
    "categoryId": "brands",
    "categoryName": "Popular Brands",
    "hints": {
      "subtle": [
        "Green",
        "Call",
        "Phone"
      ],
      "balanced": [
        "Group",
        "Voice",
        "App"
      ],
      "easy": [
        "Chat",
        "Message",
        "Text"
      ]
    }
  },
  {
    "word": "KFC",
    "categoryId": "brands",
    "categoryName": "Popular Brands",
    "hints": {
      "subtle": [
        "Red",
        "Bucket",
        "Fast"
      ],
      "balanced": [
        "Crispy",
        "Old",
        "Man"
      ],
      "easy": [
        "Chicken",
        "Fried",
        "Food"
      ]
    }
  },
  {
    "word": "Pepsi",
    "categoryId": "brands",
    "categoryName": "Popular Brands",
    "hints": {
      "subtle": [
        "Cold",
        "Sweet",
        "Can"
      ],
      "balanced": [
        "Blue",
        "Bubbles",
        "Red"
      ],
      "easy": [
        "Soda",
        "Drink",
        "Cola"
      ]
    }
  },
  {
    "word": "Toyota",
    "categoryId": "brands",
    "categoryName": "Popular Brands",
    "hints": {
      "subtle": [
        "Road",
        "Safe",
        "Japan"
      ],
      "balanced": [
        "Drive",
        "Engine",
        "Family"
      ],
      "easy": [
        "Car",
        "Auto",
        "Vehicle"
      ]
    }
  },
  {
    "word": "BMW",
    "categoryId": "brands",
    "categoryName": "Popular Brands",
    "hints": {
      "subtle": [
        "Fast",
        "Rich",
        "Blue"
      ],
      "balanced": [
        "Drive",
        "Luxury",
        "Germany"
      ],
      "easy": [
        "Car",
        "Auto",
        "Engine"
      ]
    }
  },
  {
    "word": "Mercedes",
    "categoryId": "brands",
    "categoryName": "Popular Brands",
    "hints": {
      "subtle": [
        "Rich",
        "Star",
        "Silver"
      ],
      "balanced": [
        "Luxury",
        "Germany",
        "Drive"
      ],
      "easy": [
        "Car",
        "Auto",
        "Expensive"
      ]
    }
  },
  {
    "word": "Minecraft",
    "categoryId": "hobbies",
    "categoryName": "Hobbies & Activities",
    "hints": {
      "subtle": [
        "Sandbox",
        "Survival",
        "Crafting"
      ],
      "balanced": [
        "Blocks",
        "Creeper",
        "Pixel"
      ],
      "easy": [
        "Build",
        "Mining",
        "Game"
      ]
    }
  },
  {
    "word": "Gardening",
    "categoryId": "hobbies",
    "categoryName": "Hobbies & Activities",
    "hints": {
      "subtle": [
        "Mulch",
        "Compost",
        "Prune"
      ],
      "balanced": [
        "Seeds",
        "Trowel",
        "Watering"
      ],
      "easy": [
        "Flowers",
        "Soil",
        "Plants"
      ]
    }
  },
  {
    "word": "Photography",
    "categoryId": "hobbies",
    "categoryName": "Hobbies & Activities",
    "hints": {
      "subtle": [
        "Bokeh",
        "Aperture",
        "Shutter"
      ],
      "balanced": [
        "Lens",
        "Tripod",
        "Framing"
      ],
      "easy": [
        "Camera",
        "Picture",
        "Shoot"
      ]
    }
  },
  {
    "word": "Origami",
    "categoryId": "hobbies",
    "categoryName": "Hobbies & Activities",
    "hints": {
      "subtle": [
        "Square",
        "Valley",
        "Japanese"
      ],
      "balanced": [
        "Crane",
        "Crease",
        "Scissors"
      ],
      "easy": [
        "Paper",
        "Fold",
        "Craft"
      ]
    }
  },
  {
    "word": "Baking",
    "categoryId": "hobbies",
    "categoryName": "Hobbies & Activities",
    "hints": {
      "subtle": [
        "Yeast",
        "Whisk",
        "Vanilla"
      ],
      "balanced": [
        "Flour",
        "Dough",
        "Oven"
      ],
      "easy": [
        "Cake",
        "Cookies",
        "Sweet"
      ]
    }
  },
  {
    "word": "Hiking",
    "categoryId": "hobbies",
    "categoryName": "Hobbies & Activities",
    "hints": {
      "subtle": [
        "Blaze",
        "Cairn",
        "Switchback"
      ],
      "balanced": [
        "Trail",
        "Backpack",
        "Boots"
      ],
      "easy": [
        "Mountain",
        "Walk",
        "Nature"
      ]
    }
  },
  {
    "word": "Painting",
    "categoryId": "hobbies",
    "categoryName": "Hobbies & Activities",
    "hints": {
      "subtle": [
        "Impasto",
        "Gesso",
        "Turpentine"
      ],
      "balanced": [
        "Palette",
        "Easel",
        "Brushes"
      ],
      "easy": [
        "Canvas",
        "Color",
        "Art"
      ]
    }
  },
  {
    "word": "Yoga",
    "categoryId": "hobbies",
    "categoryName": "Hobbies & Activities",
    "hints": {
      "subtle": [
        "Pranayama",
        "Chakra",
        "Savasana"
      ],
      "balanced": [
        "Namaste",
        "Asana",
        "Stretch"
      ],
      "easy": [
        "Mat",
        "Breathe",
        "Pose"
      ]
    }
  },
  {
    "word": "Camping",
    "categoryId": "hobbies",
    "categoryName": "Hobbies & Activities",
    "hints": {
      "subtle": [
        "Kindling",
        "Tarp",
        "Carabiner"
      ],
      "balanced": [
        "Tent",
        "Campfire",
        "Sleepingbag"
      ],
      "easy": [
        "Outdoors",
        "Woods",
        "Fire"
      ]
    }
  },
  {
    "word": "Pottery",
    "categoryId": "hobbies",
    "categoryName": "Hobbies & Activities",
    "hints": {
      "subtle": [
        "Wedging",
        "Glaze",
        "Centering"
      ],
      "balanced": [
        "Wheel",
        "Kiln",
        "Clay"
      ],
      "easy": [
        "Vase",
        "Mug",
        "Ceramic"
      ]
    }
  },
  {
    "word": "Fishing",
    "categoryId": "hobbies",
    "categoryName": "Hobbies & Activities",
    "hints": {
      "subtle": [
        "Bobber",
        "Sinker",
        "Creel"
      ],
      "balanced": [
        "Rod",
        "Bait",
        "Hook"
      ],
      "easy": [
        "Reel",
        "Lake",
        "Catch"
      ]
    }
  },
  {
    "word": "Bird Watching",
    "categoryId": "hobbies",
    "categoryName": "Hobbies & Activities",
    "hints": {
      "subtle": [
        "Lifelist",
        "Plumage",
        "Hide"
      ],
      "balanced": [
        "Binoculars",
        "Guidebook",
        "Song"
      ],
      "easy": [
        "Feathers",
        "Woods",
        "Spot"
      ]
    }
  },
  {
    "word": "Knitting",
    "categoryId": "hobbies",
    "categoryName": "Hobbies & Activities",
    "hints": {
      "subtle": [
        "Purl",
        "Skein",
        "Gauge"
      ],
      "balanced": [
        "Yarn",
        "Needles",
        "Stitch"
      ],
      "easy": [
        "Wool",
        "Scarf",
        "Sweater"
      ]
    }
  },
  {
    "word": "Rock Climbing",
    "categoryId": "hobbies",
    "categoryName": "Hobbies & Activities",
    "hints": {
      "subtle": [
        "Belay",
        "Chalk",
        "Crimp"
      ],
      "balanced": [
        "Harness",
        "Rope",
        "Carabiner"
      ],
      "easy": [
        "Cliff",
        "Grip",
        "Ascend"
      ]
    }
  },
  {
    "word": "Magic Tricks",
    "categoryId": "hobbies",
    "categoryName": "Hobbies & Activities",
    "hints": {
      "subtle": [
        "Patter",
        "Gimmick",
        "Misdirection"
      ],
      "balanced": [
        "Illusion",
        "Sleight",
        "Wand"
      ],
      "easy": [
        "Cards",
        "Rabbit",
        "Disappear"
      ]
    }
  },
  {
    "word": "Woodworking",
    "categoryId": "hobbies",
    "categoryName": "Hobbies & Activities",
    "hints": {
      "subtle": [
        "Dovetail",
        "Planing",
        "Grain"
      ],
      "balanced": [
        "Chisel",
        "Sawdust",
        "Workbench"
      ],
      "easy": [
        "Timber",
        "Build",
        "Wood"
      ]
    }
  },
  {
    "word": "Kite Flying",
    "categoryId": "hobbies",
    "categoryName": "Hobbies & Activities",
    "hints": {
      "subtle": [
        "Ripstop",
        "Bridle",
        "Spool"
      ],
      "balanced": [
        "Breeze",
        "String",
        "Diamond"
      ],
      "easy": [
        "Wind",
        "Tail",
        "Sky"
      ]
    }
  },
  {
    "word": "Karaoke",
    "categoryId": "hobbies",
    "categoryName": "Hobbies & Activities",
    "hints": {
      "subtle": [
        "Reverb",
        "Tambourine",
        "Duet"
      ],
      "balanced": [
        "Lyrics",
        "Microphone",
        "Screen"
      ],
      "easy": [
        "Sing",
        "Music",
        "Party"
      ]
    }
  },
  {
    "word": "Sudoku",
    "categoryId": "hobbies",
    "categoryName": "Hobbies & Activities",
    "hints": {
      "subtle": [
        "Candidates",
        "Logic",
        "Japanese"
      ],
      "balanced": [
        "Digits",
        "Grid",
        "Nine"
      ],
      "easy": [
        "Puzzle",
        "Numbers",
        "Pencil"
      ]
    }
  },
  {
    "word": "Roller Skating",
    "categoryId": "hobbies",
    "categoryName": "Hobbies & Activities",
    "hints": {
      "subtle": [
        "Toestop",
        "Quad",
        "Disco"
      ],
      "balanced": [
        "Wheels",
        "Boots",
        "Rink"
      ],
      "easy": [
        "Glide",
        "Roll",
        "Laces"
      ]
    }
  },
  {
    "word": "Snorkeling",
    "categoryId": "hobbies",
    "categoryName": "Hobbies & Activities",
    "hints": {
      "subtle": [
        "Purge",
        "Shallows",
        "Defogger"
      ],
      "balanced": [
        "Fins",
        "Mask",
        "Reef"
      ],
      "easy": [
        "Tube",
        "Swim",
        "Ocean"
      ]
    }
  },
  {
    "word": "Board Games",
    "categoryId": "hobbies",
    "categoryName": "Hobbies & Activities",
    "hints": {
      "subtle": [
        "Meeple",
        "Turn",
        "Rulebook"
      ],
      "balanced": [
        "Dice",
        "Tokens",
        "Tabletop"
      ],
      "easy": [
        "Cards",
        "Play",
        "Win"
      ]
    }
  },
  {
    "word": "Juggling",
    "categoryId": "hobbies",
    "categoryName": "Hobbies & Activities",
    "hints": {
      "subtle": [
        "Cascade",
        "Drop",
        "Clubs"
      ],
      "balanced": [
        "Toss",
        "Balls",
        "Circus"
      ],
      "easy": [
        "Catch",
        "Air",
        "Hands"
      ]
    }
  },
  {
    "word": "Cooking",
    "categoryId": "hobbies",
    "categoryName": "Hobbies & Activities",
    "hints": {
      "subtle": [
        "Home",
        "Heat",
        "Smell"
      ],
      "balanced": [
        "Pan",
        "Taste",
        "Recipe"
      ],
      "easy": [
        "Kitchen",
        "Food",
        "Make"
      ]
    }
  },
  {
    "word": "Drawing",
    "categoryId": "hobbies",
    "categoryName": "Hobbies & Activities",
    "hints": {
      "subtle": [
        "Quiet",
        "Art",
        "Hands"
      ],
      "balanced": [
        "Sketch",
        "Lines",
        "Book"
      ],
      "easy": [
        "Pencil",
        "Paper",
        "Picture"
      ]
    }
  },
  {
    "word": "Reading",
    "categoryId": "hobbies",
    "categoryName": "Hobbies & Activities",
    "hints": {
      "subtle": [
        "Quiet",
        "Night",
        "Mind"
      ],
      "balanced": [
        "Pages",
        "Story",
        "Eyes"
      ],
      "easy": [
        "Book",
        "Library",
        "Words"
      ]
    }
  },
  {
    "word": "Writing",
    "categoryId": "hobbies",
    "categoryName": "Hobbies & Activities",
    "hints": {
      "subtle": [
        "Quiet",
        "Mind",
        "Desk"
      ],
      "balanced": [
        "Story",
        "Pen",
        "Notebook"
      ],
      "easy": [
        "Words",
        "Paper",
        "Book"
      ]
    }
  },
  {
    "word": "Dancing",
    "categoryId": "hobbies",
    "categoryName": "Hobbies & Activities",
    "hints": {
      "subtle": [
        "Party",
        "Fun",
        "Stage"
      ],
      "balanced": [
        "Move",
        "Rhythm",
        "Steps"
      ],
      "easy": [
        "Music",
        "Body",
        "Dance"
      ]
    }
  },
  {
    "word": "Singing",
    "categoryId": "hobbies",
    "categoryName": "Hobbies & Activities",
    "hints": {
      "subtle": [
        "Stage",
        "Fun",
        "Loud"
      ],
      "balanced": [
        "Voice",
        "Lyrics",
        "Tune"
      ],
      "easy": [
        "Song",
        "Music",
        "Mouth"
      ]
    }
  },
  {
    "word": "Traveling",
    "categoryId": "hobbies",
    "categoryName": "Hobbies & Activities",
    "hints": {
      "subtle": [
        "World",
        "Map",
        "Fun"
      ],
      "balanced": [
        "Bag",
        "Flight",
        "Hotel"
      ],
      "easy": [
        "Trip",
        "Airport",
        "Explore"
      ]
    }
  },
  {
    "word": "Cycling",
    "categoryId": "hobbies",
    "categoryName": "Hobbies & Activities",
    "hints": {
      "subtle": [
        "Road",
        "Wind",
        "Park"
      ],
      "balanced": [
        "Wheels",
        "Helmet",
        "Pedal"
      ],
      "easy": [
        "Bike",
        "Ride",
        "Bicycle"
      ]
    }
  },
  {
    "word": "Running",
    "categoryId": "hobbies",
    "categoryName": "Hobbies & Activities",
    "hints": {
      "subtle": [
        "Morning",
        "Park",
        "Shoes"
      ],
      "balanced": [
        "Fast",
        "Sweat",
        "Track"
      ],
      "easy": [
        "Jog",
        "Exercise",
        "Legs"
      ]
    }
  },
  {
    "word": "Gaming",
    "categoryId": "hobbies",
    "categoryName": "Hobbies & Activities",
    "hints": {
      "subtle": [
        "Screen",
        "Night",
        "Fun"
      ],
      "balanced": [
        "Online",
        "Play",
        "Friends"
      ],
      "easy": [
        "Video",
        "Controller",
        "Game"
      ]
    }
  },
  {
    "word": "Shopping",
    "categoryId": "hobbies",
    "categoryName": "Hobbies & Activities",
    "hints": {
      "subtle": [
        "Mall",
        "Bags",
        "Fun"
      ],
      "balanced": [
        "Clothes",
        "Store",
        "Pay"
      ],
      "easy": [
        "Buy",
        "Money",
        "Market"
      ]
    }
  },
  {
    "word": "Meditation",
    "categoryId": "hobbies",
    "categoryName": "Hobbies & Activities",
    "hints": {
      "subtle": [
        "Calm",
        "Peace",
        "Mind"
      ],
      "balanced": [
        "Sit",
        "Breathe",
        "Eyes"
      ],
      "easy": [
        "Quiet",
        "Relax",
        "Focus"
      ]
    }
  },
  {
    "word": "Stargazing",
    "categoryId": "hobbies",
    "categoryName": "Hobbies & Activities",
    "hints": {
      "subtle": [
        "Night",
        "Dark",
        "Quiet"
      ],
      "balanced": [
        "Look",
        "Moon",
        "Clear"
      ],
      "easy": [
        "Stars",
        "Sky",
        "Space"
      ]
    }
  },
  {
    "word": "Guitar",
    "categoryId": "music",
    "categoryName": "Music & Instruments",
    "hints": {
      "subtle": [
        "Capo",
        "Pegs",
        "Rosette"
      ],
      "balanced": [
        "Frets",
        "Strum",
        "Pick"
      ],
      "easy": [
        "Strings",
        "Chords",
        "Acoustic"
      ]
    }
  },
  {
    "word": "Piano",
    "categoryId": "music",
    "categoryName": "Music & Instruments",
    "hints": {
      "subtle": [
        "Damper",
        "Bench",
        "Castiron"
      ],
      "balanced": [
        "Keys",
        "Hammers",
        "Pedals"
      ],
      "easy": [
        "Keyboard",
        "Classical",
        "Chopin"
      ]
    }
  },
  {
    "word": "Drums",
    "categoryId": "music",
    "categoryName": "Music & Instruments",
    "hints": {
      "subtle": [
        "Lugs",
        "Snare",
        "Rimshot"
      ],
      "balanced": [
        "Sticks",
        "Cymbals",
        "Pedal"
      ],
      "easy": [
        "Beat",
        "Rhythm",
        "Skins"
      ]
    }
  },
  {
    "word": "Violin",
    "categoryId": "music",
    "categoryName": "Music & Instruments",
    "hints": {
      "subtle": [
        "Rosin",
        "Purfling",
        "Stradivarius"
      ],
      "balanced": [
        "Bow",
        "Chinrest",
        "Strings"
      ],
      "easy": [
        "Orchestra",
        "Classical",
        "Fiddle"
      ]
    }
  },
  {
    "word": "Microphone",
    "categoryId": "music",
    "categoryName": "Music & Instruments",
    "hints": {
      "subtle": [
        "Stage",
        "Studio",
        "Podcast"
      ],
      "balanced": [
        "Stand",
        "Amplify",
        "Karaoke"
      ],
      "easy": [
        "Voice",
        "Sing",
        "Speak"
      ]
    }
  },
  {
    "word": "Saxophone",
    "categoryId": "music",
    "categoryName": "Music & Instruments",
    "hints": {
      "subtle": [
        "Ligature",
        "Pads",
        "Adolphe"
      ],
      "balanced": [
        "Reed",
        "Brass",
        "Jazz"
      ],
      "easy": [
        "Horn",
        "Keys",
        "Solo"
      ]
    }
  },
  {
    "word": "Trumpet",
    "categoryId": "music",
    "categoryName": "Music & Instruments",
    "hints": {
      "subtle": [
        "Mute",
        "Spitvalve",
        "Embouchure"
      ],
      "balanced": [
        "Valves",
        "Brass",
        "Bell"
      ],
      "easy": [
        "Horn",
        "Blow",
        "Fanfare"
      ]
    }
  },
  {
    "word": "Harmonica",
    "categoryId": "music",
    "categoryName": "Music & Instruments",
    "hints": {
      "subtle": [
        "Crossharp",
        "Comb",
        "Bending"
      ],
      "balanced": [
        "Reeds",
        "Blues",
        "Pocket"
      ],
      "easy": [
        "Breathe",
        "Mouth",
        "Harp"
      ]
    }
  },
  {
    "word": "Cello",
    "categoryId": "music",
    "categoryName": "Music & Instruments",
    "hints": {
      "subtle": [
        "Endpin",
        "Bassclef",
        "Spruce"
      ],
      "balanced": [
        "Bow",
        "Seated",
        "Warm"
      ],
      "easy": [
        "Strings",
        "Orchestra",
        "Wood"
      ]
    }
  },
  {
    "word": "Vinyl Record",
    "categoryId": "music",
    "categoryName": "Music & Instruments",
    "hints": {
      "subtle": [
        "Rpm",
        "Groove",
        "Crate"
      ],
      "balanced": [
        "Needle",
        "Turntable",
        "Album"
      ],
      "easy": [
        "Spin",
        "Analog",
        "Music"
      ]
    }
  },
  {
    "word": "Flute",
    "categoryId": "music",
    "categoryName": "Music & Instruments",
    "hints": {
      "subtle": [
        "Boehm",
        "Embouchure",
        "Silver"
      ],
      "balanced": [
        "Transverse",
        "Woodwind",
        "Highpitched"
      ],
      "easy": [
        "Blow",
        "Keys",
        "Metal"
      ]
    }
  },
  {
    "word": "Tambourine",
    "categoryId": "music",
    "categoryName": "Music & Instruments",
    "hints": {
      "subtle": [
        "Thumbroll",
        "Zils",
        "Gospel"
      ],
      "balanced": [
        "Jingles",
        "Shake",
        "Percussion"
      ],
      "easy": [
        "Slap",
        "Ring",
        "Rhythm"
      ]
    }
  },
  {
    "word": "Ukulele",
    "categoryId": "music",
    "categoryName": "Music & Instruments",
    "hints": {
      "subtle": [
        "Flea",
        "Koa",
        "GCEA"
      ],
      "balanced": [
        "Hawaii",
        "Four",
        "Strum"
      ],
      "easy": [
        "Small",
        "Strings",
        "Island"
      ]
    }
  },
  {
    "word": "Accordion",
    "categoryId": "music",
    "categoryName": "Music & Instruments",
    "hints": {
      "subtle": [
        "Treble",
        "Polka",
        "Straps"
      ],
      "balanced": [
        "Bellows",
        "Buttons",
        "Squeeze"
      ],
      "easy": [
        "Keys",
        "Folk",
        "Air"
      ]
    }
  },
  {
    "word": "Harp",
    "categoryId": "music",
    "categoryName": "Music & Instruments",
    "hints": {
      "subtle": [
        "Pillar",
        "Soundboard",
        "Celtic"
      ],
      "balanced": [
        "Pluck",
        "Pedals",
        "Triangular"
      ],
      "easy": [
        "Strings",
        "Angelic",
        "Graceful"
      ]
    }
  },
  {
    "word": "Bagpipes",
    "categoryId": "music",
    "categoryName": "Music & Instruments",
    "hints": {
      "subtle": [
        "Chanter",
        "Drones",
        "Tartan"
      ],
      "balanced": [
        "Scotland",
        "Kilts",
        "Blowpipe"
      ],
      "easy": [
        "Loud",
        "Highland",
        "Bag"
      ]
    }
  },
  {
    "word": "Xylophone",
    "categoryId": "music",
    "categoryName": "Music & Instruments",
    "hints": {
      "subtle": [
        "Rosewood",
        "Resonators",
        "Orff"
      ],
      "balanced": [
        "Mallets",
        "Bars",
        "Percussion"
      ],
      "easy": [
        "Strike",
        "Wood",
        "Melody"
      ]
    }
  },
  {
    "word": "Bongos",
    "categoryId": "music",
    "categoryName": "Music & Instruments",
    "hints": {
      "subtle": [
        "Hembra",
        "Macho",
        "Martillo"
      ],
      "balanced": [
        "Pair",
        "Knees",
        "Cuban"
      ],
      "easy": [
        "Hands",
        "Drums",
        "Beat"
      ]
    }
  },
  {
    "word": "Jazz",
    "categoryId": "music",
    "categoryName": "Music & Instruments",
    "hints": {
      "subtle": [
        "Syncopation",
        "Scat",
        "Standard"
      ],
      "balanced": [
        "Saxophone",
        "Swing",
        "Orleans"
      ],
      "easy": [
        "Club",
        "Trumpet",
        "Improv"
      ]
    }
  },
  {
    "word": "Hip Hop",
    "categoryId": "music",
    "categoryName": "Music & Instruments",
    "hints": {
      "subtle": [
        "Bronx",
        "Turntablism",
        "Freestyle"
      ],
      "balanced": [
        "Beats",
        "Rap",
        "Graffiti"
      ],
      "easy": [
        "Rhyme",
        "Dj",
        "Microphone"
      ]
    }
  },
  {
    "word": "Reggae",
    "categoryId": "music",
    "categoryName": "Music & Instruments",
    "hints": {
      "subtle": [
        "Skank",
        "Rastafari",
        "Trenchtown"
      ],
      "balanced": [
        "Marley",
        "Jamaica",
        "Bassline"
      ],
      "easy": [
        "Island",
        "Peace",
        "Dreadlocks"
      ]
    }
  },
  {
    "word": "Orchestra",
    "categoryId": "music",
    "categoryName": "Music & Instruments",
    "hints": {
      "subtle": [
        "Podium",
        "Tuning",
        "Pit"
      ],
      "balanced": [
        "Baton",
        "Conductor",
        "Violins"
      ],
      "easy": [
        "Classical",
        "Hall",
        "Instruments"
      ]
    }
  },
  {
    "word": "Sheet Music",
    "categoryId": "music",
    "categoryName": "Music & Instruments",
    "hints": {
      "subtle": [
        "Clef",
        "Staves",
        "Coda"
      ],
      "balanced": [
        "Notes",
        "Stand",
        "Score"
      ],
      "easy": [
        "Paper",
        "Read",
        "Melody"
      ]
    }
  },
  {
    "word": "Headset",
    "categoryId": "music",
    "categoryName": "Music & Instruments",
    "hints": {
      "subtle": [
        "Boom",
        "Earcups",
        "Splitter"
      ],
      "balanced": [
        "Gamer",
        "Audio",
        "Headband"
      ],
      "easy": [
        "Ears",
        "Talk",
        "Listen"
      ]
    }
  },
  {
    "word": "Bell",
    "categoryId": "music",
    "categoryName": "Music & Instruments",
    "hints": {
      "subtle": [
        "Metal",
        "Church",
        "School"
      ],
      "balanced": [
        "Loud",
        "Shake",
        "Hit"
      ],
      "easy": [
        "Ring",
        "Sound",
        "Ding"
      ]
    }
  },
  {
    "word": "Whistle",
    "categoryId": "music",
    "categoryName": "Music & Instruments",
    "hints": {
      "subtle": [
        "Small",
        "Pocket",
        "Loud"
      ],
      "balanced": [
        "Sport",
        "Air",
        "Sound"
      ],
      "easy": [
        "Blow",
        "Mouth",
        "Referee"
      ]
    }
  },
  {
    "word": "Speaker",
    "categoryId": "music",
    "categoryName": "Music & Instruments",
    "hints": {
      "subtle": [
        "Room",
        "Party",
        "Black"
      ],
      "balanced": [
        "Loud",
        "Box",
        "Audio"
      ],
      "easy": [
        "Sound",
        "Music",
        "Volume"
      ]
    }
  },
  {
    "word": "Concert",
    "categoryId": "music",
    "categoryName": "Music & Instruments",
    "hints": {
      "subtle": [
        "Night",
        "Lights",
        "Fans"
      ],
      "balanced": [
        "Ticket",
        "Crowd",
        "Live"
      ],
      "easy": [
        "Stage",
        "Music",
        "Show"
      ]
    }
  },
  {
    "word": "Rock Music",
    "categoryId": "music",
    "categoryName": "Music & Instruments",
    "hints": {
      "subtle": [
        "Loud",
        "Stage",
        "Energy"
      ],
      "balanced": [
        "Band",
        "Drums",
        "Fans"
      ],
      "easy": [
        "Guitar",
        "Electric",
        "Song"
      ]
    }
  },
  {
    "word": "Pop Music",
    "categoryId": "music",
    "categoryName": "Music & Instruments",
    "hints": {
      "subtle": [
        "Radio",
        "Dance",
        "Fans"
      ],
      "balanced": [
        "Famous",
        "Catchy",
        "Chart"
      ],
      "easy": [
        "Singer",
        "Hit",
        "Song"
      ]
    }
  },
  {
    "word": "Classical Music",
    "categoryId": "music",
    "categoryName": "Music & Instruments",
    "hints": {
      "subtle": [
        "Old",
        "Calm",
        "Hall"
      ],
      "balanced": [
        "Piano",
        "Violin",
        "Study"
      ],
      "easy": [
        "Mozart",
        "Orchestra",
        "Song"
      ]
    }
  },
  {
    "word": "DJ",
    "categoryId": "music",
    "categoryName": "Music & Instruments",
    "hints": {
      "subtle": [
        "Club",
        "Night",
        "Party"
      ],
      "balanced": [
        "Mix",
        "Headphones",
        "Lights"
      ],
      "easy": [
        "Music",
        "Spin",
        "Dance"
      ]
    }
  },
  {
    "word": "Choir",
    "categoryId": "music",
    "categoryName": "Music & Instruments",
    "hints": {
      "subtle": [
        "Church",
        "Group",
        "Calm"
      ],
      "balanced": [
        "Voices",
        "Together",
        "Stage"
      ],
      "easy": [
        "Sing",
        "Song",
        "Music"
      ]
    }
  },
  {
    "word": "Opera",
    "categoryId": "music",
    "categoryName": "Music & Instruments",
    "hints": {
      "subtle": [
        "Hall",
        "Dress",
        "Classic"
      ],
      "balanced": [
        "Drama",
        "Stage",
        "High"
      ],
      "easy": [
        "Sing",
        "Voice",
        "Theater"
      ]
    }
  },
  {
    "word": "Radio",
    "categoryId": "music",
    "categoryName": "Music & Instruments",
    "hints": {
      "subtle": [
        "Car",
        "News",
        "Home"
      ],
      "balanced": [
        "Station",
        "Signal",
        "Listen"
      ],
      "easy": [
        "Music",
        "Sound",
        "Audio"
      ]
    }
  },
  {
    "word": "Basketball",
    "categoryId": "sports",
    "categoryName": "Sports & Games",
    "hints": {
      "subtle": [
        "Squeak",
        "Travel",
        "Alleyoop"
      ],
      "balanced": [
        "Dribble",
        "Hoop",
        "Dunk"
      ],
      "easy": [
        "Court",
        "Shoot",
        "Net"
      ]
    }
  },
  {
    "word": "Tennis",
    "categoryId": "sports",
    "categoryName": "Sports & Games",
    "hints": {
      "subtle": [
        "Deuce",
        "Baseline",
        "Drop"
      ],
      "balanced": [
        "Racket",
        "Serve",
        "Volley"
      ],
      "easy": [
        "Court",
        "Net",
        "Ace"
      ]
    }
  },
  {
    "word": "Swimming",
    "categoryId": "sports",
    "categoryName": "Sports & Games",
    "hints": {
      "subtle": [
        "Turn",
        "Chlorine",
        "Blocks"
      ],
      "balanced": [
        "Goggles",
        "Lanes",
        "Stroke"
      ],
      "easy": [
        "Pool",
        "Water",
        "Dive"
      ]
    }
  },
  {
    "word": "Baseball",
    "categoryId": "sports",
    "categoryName": "Sports & Games",
    "hints": {
      "subtle": [
        "Dugout",
        "Umpire",
        "Bunt"
      ],
      "balanced": [
        "Bat",
        "Glove",
        "Homerun"
      ],
      "easy": [
        "Diamond",
        "Pitcher",
        "Bases"
      ]
    }
  },
  {
    "word": "Bowling",
    "categoryId": "sports",
    "categoryName": "Sports & Games",
    "hints": {
      "subtle": [
        "Lanes",
        "Alley",
        "Shoes"
      ],
      "balanced": [
        "Strike",
        "Spare",
        "Gutter"
      ],
      "easy": [
        "Pins",
        "Ball",
        "Roll"
      ]
    }
  },
  {
    "word": "Snowboarding",
    "categoryId": "sports",
    "categoryName": "Sports & Games",
    "hints": {
      "subtle": [
        "Bindings",
        "Carve",
        "Goggles"
      ],
      "balanced": [
        "Halfpipe",
        "Slope",
        "Powder"
      ],
      "easy": [
        "Snow",
        "Glide",
        "Winter"
      ]
    }
  },
  {
    "word": "Volleyball",
    "categoryId": "sports",
    "categoryName": "Sports & Games",
    "hints": {
      "subtle": [
        "Rotation",
        "Kneepads",
        "Setter"
      ],
      "balanced": [
        "Spike",
        "Bump",
        "Block"
      ],
      "easy": [
        "Net",
        "Beach",
        "Serve"
      ]
    }
  },
  {
    "word": "Formula 1",
    "categoryId": "sports",
    "categoryName": "Sports & Games",
    "hints": {
      "subtle": [
        "Chicane",
        "Halo",
        "Telemetries"
      ],
      "balanced": [
        "Pitstop",
        "Circuit",
        "Podium"
      ],
      "easy": [
        "Fast",
        "Tires",
        "Driver"
      ]
    }
  },
  {
    "word": "Rugby",
    "categoryId": "sports",
    "categoryName": "Sports & Games",
    "hints": {
      "subtle": [
        "Try",
        "Lineout",
        "Mouthguard"
      ],
      "balanced": [
        "Scrum",
        "Tackle",
        "Punt"
      ],
      "easy": [
        "Oval",
        "Pitch",
        "Pass"
      ]
    }
  },
  {
    "word": "Badminton",
    "categoryId": "sports",
    "categoryName": "Sports & Games",
    "hints": {
      "subtle": [
        "Feathers",
        "Drop",
        "Grip"
      ],
      "balanced": [
        "Shuttlecock",
        "Smash",
        "Racket"
      ],
      "easy": [
        "Net",
        "Court",
        "Fast"
      ]
    }
  },
  {
    "word": "Gymnastics",
    "categoryId": "sports",
    "categoryName": "Sports & Games",
    "hints": {
      "subtle": [
        "Chalk",
        "Dismount",
        "Leotard"
      ],
      "balanced": [
        "Vault",
        "Beam",
        "Rings"
      ],
      "easy": [
        "Flip",
        "Mat",
        "Flexibility"
      ]
    }
  },
  {
    "word": "Golf",
    "categoryId": "sports",
    "categoryName": "Sports & Games",
    "hints": {
      "subtle": [
        "Divot",
        "Fairway",
        "Birdie"
      ],
      "balanced": [
        "Clubs",
        "Bunker",
        "Putter"
      ],
      "easy": [
        "Tee",
        "Hole",
        "Green"
      ]
    }
  },
  {
    "word": "Ice Hockey",
    "categoryId": "sports",
    "categoryName": "Sports & Games",
    "hints": {
      "subtle": [
        "Zamboni",
        "Crease",
        "Slapshot"
      ],
      "balanced": [
        "Puck",
        "Skates",
        "Stick"
      ],
      "easy": [
        "Rink",
        "Goal",
        "Check"
      ]
    }
  },
  {
    "word": "Cricket",
    "categoryId": "sports",
    "categoryName": "Sports & Games",
    "hints": {
      "subtle": [
        "Crease",
        "Innings",
        "Spin"
      ],
      "balanced": [
        "Wicket",
        "Bat",
        "Bowler"
      ],
      "easy": [
        "Runs",
        "Pitch",
        "Leather"
      ]
    }
  },
  {
    "word": "Boxing",
    "categoryId": "sports",
    "categoryName": "Sports & Games",
    "hints": {
      "subtle": [
        "Jab",
        "Corner",
        "Bell"
      ],
      "balanced": [
        "Gloves",
        "Knockout",
        "Ring"
      ],
      "easy": [
        "Punch",
        "Rounds",
        "Fight"
      ]
    }
  },
  {
    "word": "Table Tennis",
    "categoryId": "sports",
    "categoryName": "Sports & Games",
    "hints": {
      "subtle": [
        "Spin",
        "Rubber",
        "Pingpong"
      ],
      "balanced": [
        "Paddle",
        "Celluloid",
        "Smash"
      ],
      "easy": [
        "Net",
        "Bounce",
        "Fast"
      ]
    }
  },
  {
    "word": "Fencing",
    "categoryId": "sports",
    "categoryName": "Sports & Games",
    "hints": {
      "subtle": [
        "Engarde",
        "Lame",
        "Piste"
      ],
      "balanced": [
        "Foil",
        "Mask",
        "Lunge"
      ],
      "easy": [
        "Sword",
        "White",
        "Duel"
      ]
    }
  },
  {
    "word": "Marathon",
    "categoryId": "sports",
    "categoryName": "Sports & Games",
    "hints": {
      "subtle": [
        "Pacing",
        "Hydration",
        "Wall"
      ],
      "balanced": [
        "Twentysix",
        "Endurance",
        "Finish"
      ],
      "easy": [
        "Run",
        "Race",
        "Bib"
      ]
    }
  },
  {
    "word": "Darts",
    "categoryId": "sports",
    "categoryName": "Sports & Games",
    "hints": {
      "subtle": [
        "Oche",
        "Flights",
        "Treb"
      ],
      "balanced": [
        "Bullseye",
        "Board",
        "Throw"
      ],
      "easy": [
        "Points",
        "Pub",
        "Target"
      ]
    }
  },
  {
    "word": "Wrestling",
    "categoryId": "sports",
    "categoryName": "Sports & Games",
    "hints": {
      "subtle": [
        "Singlet",
        "Takedown",
        "Bridge"
      ],
      "balanced": [
        "Pin",
        "Mat",
        "Grapple"
      ],
      "easy": [
        "Fight",
        "Hold",
        "Weight"
      ]
    }
  },
  {
    "word": "Football",
    "categoryId": "sports",
    "categoryName": "Sports & Games",
    "hints": {
      "subtle": [
        "Field",
        "Grass",
        "Team"
      ],
      "balanced": [
        "Goal",
        "World",
        "Match"
      ],
      "easy": [
        "Kick",
        "Round",
        "Soccer"
      ]
    }
  },
  {
    "word": "Chess",
    "categoryId": "sports",
    "categoryName": "Sports & Games",
    "hints": {
      "subtle": [
        "Quiet",
        "Smart",
        "Think"
      ],
      "balanced": [
        "Black",
        "White",
        "Move"
      ],
      "easy": [
        "King",
        "Queen",
        "Board"
      ]
    }
  },
  {
    "word": "Karate",
    "categoryId": "sports",
    "categoryName": "Sports & Games",
    "hints": {
      "subtle": [
        "Belt",
        "White",
        "Respect"
      ],
      "balanced": [
        "Japan",
        "Chop",
        "Kick"
      ],
      "easy": [
        "Martial",
        "Fight",
        "Punch"
      ]
    }
  },
  {
    "word": "Archery",
    "categoryId": "sports",
    "categoryName": "Sports & Games",
    "hints": {
      "subtle": [
        "Quiver",
        "Aim",
        "Medieval"
      ],
      "balanced": [
        "Bullseye",
        "String",
        "Olympic"
      ],
      "easy": [
        "Arrow",
        "Bow",
        "Target"
      ]
    }
  },
  {
    "word": "Surfing",
    "categoryId": "sports",
    "categoryName": "Sports & Games",
    "hints": {
      "subtle": [
        "Swell",
        "Coast",
        "Balance"
      ],
      "balanced": [
        "Wetsuit",
        "Paddle",
        "Tide"
      ],
      "easy": [
        "Waves",
        "Board",
        "Ocean"
      ]
    }
  },
  {
    "word": "Skateboarding",
    "categoryId": "sports",
    "categoryName": "Sports & Games",
    "hints": {
      "subtle": [
        "Pavement",
        "Ramp",
        "Street"
      ],
      "balanced": [
        "Deck",
        "Ollie",
        "Helmet"
      ],
      "easy": [
        "Wheels",
        "Trick",
        "Kickflip"
      ]
    }
  },
  {
    "word": "Skiing",
    "categoryId": "sports",
    "categoryName": "Sports & Games",
    "hints": {
      "subtle": [
        "Winter",
        "Cold",
        "Mountain"
      ],
      "balanced": [
        "Sticks",
        "Fast",
        "Slide"
      ],
      "easy": [
        "Snow",
        "Two",
        "Slope"
      ]
    }
  },
  {
    "word": "Billiards",
    "categoryId": "sports",
    "categoryName": "Sports & Games",
    "hints": {
      "subtle": [
        "Felt",
        "Chalk",
        "Lounge"
      ],
      "balanced": [
        "Pockets",
        "Rack",
        "Break"
      ],
      "easy": [
        "Cue",
        "Pool",
        "Balls"
      ]
    }
  },
  {
    "word": "Weightlifting",
    "categoryId": "sports",
    "categoryName": "Sports & Games",
    "hints": {
      "subtle": [
        "Gym",
        "Strong",
        "Heavy"
      ],
      "balanced": [
        "Raise",
        "Bar",
        "Arms"
      ],
      "easy": [
        "Weights",
        "Muscle",
        "Power"
      ]
    }
  },
  {
    "word": "Hide and Seek",
    "categoryId": "sports",
    "categoryName": "Sports & Games",
    "hints": {
      "subtle": [
        "Kids",
        "Fun",
        "Count"
      ],
      "balanced": [
        "Quiet",
        "Search",
        "Behind"
      ],
      "easy": [
        "Cover",
        "Find",
        "Game"
      ]
    }
  },
  {
    "word": "Poker",
    "categoryId": "sports",
    "categoryName": "Sports & Games",
    "hints": {
      "subtle": [
        "Table",
        "Night",
        "Money"
      ],
      "balanced": [
        "Bluff",
        "Bet",
        "Chips"
      ],
      "easy": [
        "Cards",
        "Casino",
        "Game"
      ]
    }
  },
  {
    "word": "Ludo",
    "categoryId": "sports",
    "categoryName": "Sports & Games",
    "hints": {
      "subtle": [
        "Family",
        "Classic",
        "Colors"
      ],
      "balanced": [
        "Move",
        "Four",
        "Home"
      ],
      "easy": [
        "Dice",
        "Board",
        "Game"
      ]
    }
  },
  {
    "word": "Monopoly",
    "categoryId": "sports",
    "categoryName": "Sports & Games",
    "hints": {
      "subtle": [
        "Family",
        "Long",
        "Rich"
      ],
      "balanced": [
        "Buy",
        "Houses",
        "Jail"
      ],
      "easy": [
        "Money",
        "Board",
        "Game"
      ]
    }
  },
  {
    "word": "Telescope",
    "categoryId": "technology",
    "categoryName": "Technology & Science",
    "hints": {
      "subtle": [
        "Aperture",
        "Galileo",
        "Eyepiece"
      ],
      "balanced": [
        "Observatory",
        "Lenses",
        "Magnify"
      ],
      "easy": [
        "Stars",
        "Space",
        "Moon"
      ]
    }
  },
  {
    "word": "Gravity",
    "categoryId": "technology",
    "categoryName": "Technology & Science",
    "hints": {
      "subtle": [
        "Orbits",
        "Tides",
        "Mass"
      ],
      "balanced": [
        "Newton",
        "Falling",
        "Weight"
      ],
      "easy": [
        "Pull",
        "Earth",
        "Down"
      ]
    }
  },
  {
    "word": "Smartphone",
    "categoryId": "technology",
    "categoryName": "Technology & Science",
    "hints": {
      "subtle": [
        "Corning",
        "Haptic",
        "SIM"
      ],
      "balanced": [
        "Touchscreen",
        "Apps",
        "Battery"
      ],
      "easy": [
        "Call",
        "Pocket",
        "Screen"
      ]
    }
  },
  {
    "word": "Drone",
    "categoryId": "technology",
    "categoryName": "Technology & Science",
    "hints": {
      "subtle": [
        "Gimbal",
        "Telemetry",
        "Hover"
      ],
      "balanced": [
        "Quadcopter",
        "Propellers",
        "Remote"
      ],
      "easy": [
        "Fly",
        "Camera",
        "Pilot"
      ]
    }
  },
  {
    "word": "Virtual Reality",
    "categoryId": "technology",
    "categoryName": "Technology & Science",
    "hints": {
      "subtle": [
        "Latency",
        "Gyroscopes",
        "Immersion"
      ],
      "balanced": [
        "Headset",
        "Avatar",
        "Controllers"
      ],
      "easy": [
        "Goggles",
        "Simulation",
        "Gaming"
      ]
    }
  },
  {
    "word": "Smartwatch",
    "categoryId": "technology",
    "categoryName": "Technology & Science",
    "hints": {
      "subtle": [
        "OLED",
        "Haptic",
        "Pedometer"
      ],
      "balanced": [
        "Wrist",
        "Pulse",
        "Fitness"
      ],
      "easy": [
        "Time",
        "Strap",
        "Notifications"
      ]
    }
  },
  {
    "word": "3D Printer",
    "categoryId": "technology",
    "categoryName": "Technology & Science",
    "hints": {
      "subtle": [
        "Gcode",
        "Extruder",
        "Nozzle"
      ],
      "balanced": [
        "Filament",
        "Layers",
        "Bed"
      ],
      "easy": [
        "Plastic",
        "Build",
        "Fabricate"
      ]
    }
  },
  {
    "word": "Satellite",
    "categoryId": "technology",
    "categoryName": "Technology & Science",
    "hints": {
      "subtle": [
        "Transponder",
        "Apogee",
        "Thrusters"
      ],
      "balanced": [
        "Orbit",
        "Solar",
        "Antenna"
      ],
      "easy": [
        "Space",
        "Signals",
        "Dish"
      ]
    }
  },
  {
    "word": "Microchip",
    "categoryId": "technology",
    "categoryName": "Technology & Science",
    "hints": {
      "subtle": [
        "Photolithography",
        "Cleanroom",
        "Wafer"
      ],
      "balanced": [
        "Silicon",
        "Transistors",
        "Circuit"
      ],
      "easy": [
        "Tiny",
        "Computer",
        "Processor"
      ]
    }
  },
  {
    "word": "Bluetooth",
    "categoryId": "technology",
    "categoryName": "Technology & Science",
    "hints": {
      "subtle": [
        "Pairing",
        "Viking",
        "Frequency"
      ],
      "balanced": [
        "Wireless",
        "Headphones",
        "Radio"
      ],
      "easy": [
        "Connect",
        "Blue",
        "Cordless"
      ]
    }
  },
  {
    "word": "Solar Panel",
    "categoryId": "technology",
    "categoryName": "Technology & Science",
    "hints": {
      "subtle": [
        "Inverter",
        "Photovoltaic",
        "Monocrystalline"
      ],
      "balanced": [
        "Sunlight",
        "Rooftop",
        "Silicon"
      ],
      "easy": [
        "Electricity",
        "Renewable",
        "Sun"
      ]
    }
  },
  {
    "word": "Robot",
    "categoryId": "technology",
    "categoryName": "Technology & Science",
    "hints": {
      "subtle": [
        "Servo",
        "Asimov",
        "Actuator"
      ],
      "balanced": [
        "Automated",
        "Sensors",
        "Steel"
      ],
      "easy": [
        "Mechanical",
        "Metal",
        "Machine"
      ]
    }
  },
  {
    "word": "Artificial Intelligence",
    "categoryId": "technology",
    "categoryName": "Technology & Science",
    "hints": {
      "subtle": [
        "Weights",
        "Turing",
        "Inference"
      ],
      "balanced": [
        "Neural",
        "Algorithm",
        "Machine"
      ],
      "easy": [
        "Smart",
        "Computer",
        "Thinking"
      ]
    }
  },
  {
    "word": "Laser",
    "categoryId": "technology",
    "categoryName": "Technology & Science",
    "hints": {
      "subtle": [
        "Coherent",
        "Photons",
        "Cavity"
      ],
      "balanced": [
        "Beam",
        "Red",
        "Cutting"
      ],
      "easy": [
        "Light",
        "Pointer",
        "Precise"
      ]
    }
  },
  {
    "word": "Microscope",
    "categoryId": "technology",
    "categoryName": "Technology & Science",
    "hints": {
      "subtle": [
        "Coverslip",
        "Staining",
        "Stage"
      ],
      "balanced": [
        "Magnify",
        "Slide",
        "Lenses"
      ],
      "easy": [
        "Cells",
        "Bacteria",
        "Laboratory"
      ]
    }
  },
  {
    "word": "Electric Car",
    "categoryId": "technology",
    "categoryName": "Technology & Science",
    "hints": {
      "subtle": [
        "Regenerative",
        "Kilowatt",
        "Torque"
      ],
      "balanced": [
        "Battery",
        "Motor",
        "Silent"
      ],
      "easy": [
        "Charge",
        "Plug",
        "Clean"
      ]
    }
  },
  {
    "word": "Touchscreen",
    "categoryId": "technology",
    "categoryName": "Technology & Science",
    "hints": {
      "subtle": [
        "Capacitive",
        "Oleophobic",
        "Digitizer"
      ],
      "balanced": [
        "Swipe",
        "Glass",
        "Fingers"
      ],
      "easy": [
        "Tap",
        "Panel",
        "Display"
      ]
    }
  },
  {
    "word": "Game Console",
    "categoryId": "technology",
    "categoryName": "Technology & Science",
    "hints": {
      "subtle": [
        "Living",
        "Couch",
        "TV"
      ],
      "balanced": [
        "Joystick",
        "Cartridge",
        "Multiplayer"
      ],
      "easy": [
        "Controller",
        "Play",
        "Games"
      ]
    }
  },
  {
    "word": "Earbuds",
    "categoryId": "technology",
    "categoryName": "Technology & Science",
    "hints": {
      "subtle": [
        "Pocket",
        "Commute",
        "Case"
      ],
      "balanced": [
        "Wireless",
        "Bluetooth",
        "Fit"
      ],
      "easy": [
        "Music",
        "Ears",
        "Audio"
      ]
    }
  },
  {
    "word": "Projector",
    "categoryId": "technology",
    "categoryName": "Technology & Science",
    "hints": {
      "subtle": [
        "Keystone",
        "Lumens",
        "DLP"
      ],
      "balanced": [
        "Lens",
        "Screen",
        "Cinema"
      ],
      "easy": [
        "Beam",
        "Movie",
        "Dark"
      ]
    }
  },
  {
    "word": "Power Bank",
    "categoryId": "technology",
    "categoryName": "Technology & Science",
    "hints": {
      "subtle": [
        "Milliamp",
        "Port",
        "Lithium"
      ],
      "balanced": [
        "Battery",
        "Portable",
        "Charge"
      ],
      "easy": [
        "Travel",
        "Phone",
        "Cable"
      ]
    }
  },
  {
    "word": "Self-Driving Car",
    "categoryId": "technology",
    "categoryName": "Technology & Science",
    "hints": {
      "subtle": [
        "Lidar",
        "Waymo",
        "Autopilot"
      ],
      "balanced": [
        "Autonomous",
        "Cameras",
        "Steering"
      ],
      "easy": [
        "Wheels",
        "Robot",
        "Drive"
      ]
    }
  },
  {
    "word": "Webcam",
    "categoryId": "technology",
    "categoryName": "Technology & Science",
    "hints": {
      "subtle": [
        "Bezel",
        "Shutter",
        "Framerate"
      ],
      "balanced": [
        "Conference",
        "Video",
        "Streamer"
      ],
      "easy": [
        "Camera",
        "Call",
        "Online"
      ]
    }
  },
  {
    "word": "Laptop",
    "categoryId": "technology",
    "categoryName": "Technology & Science",
    "hints": {
      "subtle": [
        "Desk",
        "Work",
        "Bag"
      ],
      "balanced": [
        "Type",
        "Fold",
        "Battery"
      ],
      "easy": [
        "Computer",
        "Screen",
        "Keyboard"
      ]
    }
  },
  {
    "word": "Internet",
    "categoryId": "technology",
    "categoryName": "Technology & Science",
    "hints": {
      "subtle": [
        "Global",
        "Fast",
        "Daily"
      ],
      "balanced": [
        "Connect",
        "Web",
        "Search"
      ],
      "easy": [
        "Online",
        "Wifi",
        "Network"
      ]
    }
  },
  {
    "word": "Wi-Fi",
    "categoryId": "technology",
    "categoryName": "Technology & Science",
    "hints": {
      "subtle": [
        "Home",
        "Cafe",
        "Signal"
      ],
      "balanced": [
        "Password",
        "Fast",
        "Connect"
      ],
      "easy": [
        "Wireless",
        "Internet",
        "Router"
      ]
    }
  },
  {
    "word": "Battery",
    "categoryId": "technology",
    "categoryName": "Technology & Science",
    "hints": {
      "subtle": [
        "Inside",
        "Small",
        "Dead"
      ],
      "balanced": [
        "Charge",
        "Plus",
        "Minus"
      ],
      "easy": [
        "Power",
        "Energy",
        "Phone"
      ]
    }
  },
  {
    "word": "GPS",
    "categoryId": "technology",
    "categoryName": "Technology & Science",
    "hints": {
      "subtle": [
        "Car",
        "Phone",
        "Travel"
      ],
      "balanced": [
        "Find",
        "Road",
        "Signal"
      ],
      "easy": [
        "Map",
        "Location",
        "Direction"
      ]
    }
  },
  {
    "word": "Television",
    "categoryId": "technology",
    "categoryName": "Technology & Science",
    "hints": {
      "subtle": [
        "Living",
        "Sofa",
        "Remote"
      ],
      "balanced": [
        "Channel",
        "News",
        "Movie"
      ],
      "easy": [
        "TV",
        "Screen",
        "Watch"
      ]
    }
  },
  {
    "word": "Keyboard",
    "categoryId": "technology",
    "categoryName": "Technology & Science",
    "hints": {
      "subtle": [
        "Desk",
        "Work",
        "Click"
      ],
      "balanced": [
        "Letters",
        "Buttons",
        "Hands"
      ],
      "easy": [
        "Type",
        "Computer",
        "Keys"
      ]
    }
  },
  {
    "word": "Computer Mouse",
    "categoryId": "technology",
    "categoryName": "Technology & Science",
    "hints": {
      "subtle": [
        "Desk",
        "Hand",
        "Move"
      ],
      "balanced": [
        "Scroll",
        "Arrow",
        "Pad"
      ],
      "easy": [
        "Click",
        "Laptop",
        "Cursor"
      ]
    }
  },
  {
    "word": "USB Drive",
    "categoryId": "technology",
    "categoryName": "Technology & Science",
    "hints": {
      "subtle": [
        "Small",
        "Pocket",
        "Data"
      ],
      "balanced": [
        "Plug",
        "Save",
        "Files"
      ],
      "easy": [
        "Memory",
        "Flash",
        "Computer"
      ]
    }
  },
  {
    "word": "QR Code",
    "categoryId": "technology",
    "categoryName": "Technology & Science",
    "hints": {
      "subtle": [
        "Black",
        "White",
        "Square"
      ],
      "balanced": [
        "Menu",
        "Pay",
        "Camera"
      ],
      "easy": [
        "Scan",
        "Phone",
        "Link"
      ]
    }
  },
  {
    "word": "Email",
    "categoryId": "technology",
    "categoryName": "Technology & Science",
    "hints": {
      "subtle": [
        "Work",
        "Fast",
        "Inbox"
      ],
      "balanced": [
        "Send",
        "Address",
        "Reply"
      ],
      "easy": [
        "Letter",
        "Message",
        "Online"
      ]
    }
  },
  {
    "word": "Social Media",
    "categoryId": "technology",
    "categoryName": "Technology & Science",
    "hints": {
      "subtle": [
        "Phone",
        "Daily",
        "Share"
      ],
      "balanced": [
        "Like",
        "Post",
        "Follow"
      ],
      "easy": [
        "Apps",
        "Friends",
        "Online"
      ]
    }
  },
  {
    "word": "Video Game",
    "categoryId": "technology",
    "categoryName": "Technology & Science",
    "hints": {
      "subtle": [
        "Fun",
        "Screen",
        "Night"
      ],
      "balanced": [
        "Level",
        "Play",
        "Win"
      ],
      "easy": [
        "Console",
        "Controller",
        "Gaming"
      ]
    }
  },
  {
    "word": "Magnet",
    "categoryId": "technology",
    "categoryName": "Technology & Science",
    "hints": {
      "subtle": [
        "Metal",
        "Fridge",
        "Pull"
      ],
      "balanced": [
        "North",
        "South",
        "Stick"
      ],
      "easy": [
        "Iron",
        "Attract",
        "Force"
      ]
    }
  },
  {
    "word": "Electricity",
    "categoryId": "technology",
    "categoryName": "Technology & Science",
    "hints": {
      "subtle": [
        "Home",
        "Fast",
        "Danger"
      ],
      "balanced": [
        "Wire",
        "Light",
        "Switch"
      ],
      "easy": [
        "Power",
        "Energy",
        "Shock"
      ]
    }
  },
  {
    "word": "DNA",
    "categoryId": "technology",
    "categoryName": "Technology & Science",
    "hints": {
      "subtle": [
        "Body",
        "Science",
        "Tiny"
      ],
      "balanced": [
        "Family",
        "Spiral",
        "Code"
      ],
      "easy": [
        "Genes",
        "Life",
        "Biology"
      ]
    }
  },
  {
    "word": "Vaccine",
    "categoryId": "technology",
    "categoryName": "Technology & Science",
    "hints": {
      "subtle": [
        "Clinic",
        "Safe",
        "Health"
      ],
      "balanced": [
        "Needle",
        "Arm",
        "Protect"
      ],
      "easy": [
        "Doctor",
        "Medicine",
        "Virus"
      ]
    }
  },
  {
    "word": "Volcano",
    "categoryId": "nature",
    "categoryName": "Nature & Wonders",
    "hints": {
      "subtle": [
        "Basalt",
        "Pompeii",
        "Magma"
      ],
      "balanced": [
        "Lava",
        "Erupt",
        "Crater"
      ],
      "easy": [
        "Ash",
        "Mountain",
        "Fire"
      ]
    }
  },
  {
    "word": "Rainbow",
    "categoryId": "nature",
    "categoryName": "Nature & Wonders",
    "hints": {
      "subtle": [
        "Prism",
        "Droplets",
        "Leprechaun"
      ],
      "balanced": [
        "Spectrum",
        "Colors",
        "Shower"
      ],
      "easy": [
        "Sky",
        "Rain",
        "Sun"
      ]
    }
  },
  {
    "word": "Earthquake",
    "categoryId": "nature",
    "categoryName": "Nature & Wonders",
    "hints": {
      "subtle": [
        "Seismograph",
        "Epicenter",
        "Richter"
      ],
      "balanced": [
        "Tremor",
        "Fault",
        "Rumble"
      ],
      "easy": [
        "Shake",
        "Ground",
        "Disaster"
      ]
    }
  },
  {
    "word": "Lightning",
    "categoryId": "nature",
    "categoryName": "Nature & Wonders",
    "hints": {
      "subtle": [
        "Thunderclap",
        "Conductor",
        "Plasma"
      ],
      "balanced": [
        "Bolt",
        "Strike",
        "Thunder"
      ],
      "easy": [
        "Storm",
        "Flash",
        "Electric"
      ]
    }
  },
  {
    "word": "Waterfall",
    "categoryId": "nature",
    "categoryName": "Nature & Wonders",
    "hints": {
      "subtle": [
        "Mist",
        "Plunge",
        "Gorge"
      ],
      "balanced": [
        "Cascade",
        "Cliff",
        "Roar"
      ],
      "easy": [
        "River",
        "Drop",
        "Spray"
      ]
    }
  },
  {
    "word": "Northern Lights",
    "categoryId": "nature",
    "categoryName": "Nature & Wonders",
    "hints": {
      "subtle": [
        "Borealis",
        "Magnetic",
        "Particles"
      ],
      "balanced": [
        "Aurora",
        "Curtain",
        "Green"
      ],
      "easy": [
        "Arctic",
        "Sky",
        "Glow"
      ]
    }
  },
  {
    "word": "Glacier",
    "categoryId": "nature",
    "categoryName": "Nature & Wonders",
    "hints": {
      "subtle": [
        "Moraine",
        "Crevasse",
        "Calving"
      ],
      "balanced": [
        "Ice",
        "Valley",
        "Slow"
      ],
      "easy": [
        "Melt",
        "Cold",
        "Frozen"
      ]
    }
  },
  {
    "word": "Coral Reef",
    "categoryId": "nature",
    "categoryName": "Nature & Wonders",
    "hints": {
      "subtle": [
        "Polyp",
        "Bleaching",
        "Atoll"
      ],
      "balanced": [
        "Fish",
        "Limestone",
        "Lagoon"
      ],
      "easy": [
        "Ocean",
        "Colorful",
        "Undersea"
      ]
    }
  },
  {
    "word": "Rainforest",
    "categoryId": "nature",
    "categoryName": "Nature & Wonders",
    "hints": {
      "subtle": [
        "Understory",
        "Bromeliad",
        "Amazon"
      ],
      "balanced": [
        "Canopy",
        "Jungle",
        "Humid"
      ],
      "easy": [
        "Trees",
        "Green",
        "Tropical"
      ]
    }
  },
  {
    "word": "Cave System",
    "categoryId": "nature",
    "categoryName": "Nature & Wonders",
    "hints": {
      "subtle": [
        "Spelunker",
        "Guano",
        "Echo"
      ],
      "balanced": [
        "Tunnels",
        "Stalactites",
        "Subterranean"
      ],
      "easy": [
        "Dark",
        "Bats",
        "Underground"
      ]
    }
  },
  {
    "word": "Avalanche",
    "categoryId": "nature",
    "categoryName": "Nature & Wonders",
    "hints": {
      "subtle": [
        "Slab",
        "Transceiver",
        "Incline"
      ],
      "balanced": [
        "Snowpack",
        "Slide",
        "Bury"
      ],
      "easy": [
        "Mountain",
        "Snow",
        "Danger"
      ]
    }
  },
  {
    "word": "Tsunami",
    "categoryId": "nature",
    "categoryName": "Nature & Wonders",
    "hints": {
      "subtle": [
        "Recede",
        "Subduction",
        "Buoy"
      ],
      "balanced": [
        "Surge",
        "Harbor",
        "Inundation"
      ],
      "easy": [
        "Wave",
        "Coast",
        "Flooding"
      ]
    }
  },
  {
    "word": "Tornado",
    "categoryId": "nature",
    "categoryName": "Nature & Wonders",
    "hints": {
      "subtle": [
        "Fujita",
        "Sirens",
        "Debris"
      ],
      "balanced": [
        "Funnel",
        "Vortex",
        "Twister"
      ],
      "easy": [
        "Wind",
        "Storm",
        "Spin"
      ]
    }
  },
  {
    "word": "Meteor Shower",
    "categoryId": "nature",
    "categoryName": "Nature & Wonders",
    "hints": {
      "subtle": [
        "Perseids",
        "Comet",
        "Radiant"
      ],
      "balanced": [
        "Streaks",
        "Shooting",
        "Reentry"
      ],
      "easy": [
        "Stars",
        "Night",
        "Sky"
      ]
    }
  },
  {
    "word": "Oasis",
    "categoryId": "nature",
    "categoryName": "Nature & Wonders",
    "hints": {
      "subtle": [
        "Aquifer",
        "Dates",
        "Caravan"
      ],
      "balanced": [
        "Palms",
        "Spring",
        "Haven"
      ],
      "easy": [
        "Desert",
        "Water",
        "Green"
      ]
    }
  },
  {
    "word": "Hot Spring",
    "categoryId": "nature",
    "categoryName": "Nature & Wonders",
    "hints": {
      "subtle": [
        "Minerals",
        "Onsen",
        "Thermal"
      ],
      "balanced": [
        "Boiling",
        "Bath",
        "Steam"
      ],
      "easy": [
        "Pool",
        "Soak",
        "Warmth"
      ]
    }
  },
  {
    "word": "Wildfire",
    "categoryId": "nature",
    "categoryName": "Nature & Wonders",
    "hints": {
      "subtle": [
        "Embers",
        "Canadair",
        "Drought"
      ],
      "balanced": [
        "Blaze",
        "Smoke",
        "Forest"
      ],
      "easy": [
        "Flames",
        "Fire",
        "Burn"
      ]
    }
  },
  {
    "word": "Iceberg",
    "categoryId": "nature",
    "categoryName": "Nature & Wonders",
    "hints": {
      "subtle": [
        "Titanic",
        "Buoyancy",
        "Bergybit"
      ],
      "balanced": [
        "Floating",
        "Calved",
        "Massive"
      ],
      "easy": [
        "Ice",
        "Ocean",
        "Cold"
      ]
    }
  },
  {
    "word": "Eclipse",
    "categoryId": "nature",
    "categoryName": "Nature & Wonders",
    "hints": {
      "subtle": [
        "Totality",
        "Umbra",
        "Corona"
      ],
      "balanced": [
        "Shadow",
        "Moon",
        "Alignment"
      ],
      "easy": [
        "Sun",
        "Darkness",
        "Sky"
      ]
    }
  },
  {
    "word": "Thunderstorm",
    "categoryId": "nature",
    "categoryName": "Nature & Wonders",
    "hints": {
      "subtle": [
        "Supercell",
        "Downburst",
        "Hailstones"
      ],
      "balanced": [
        "Lightning",
        "Rumble",
        "Downpour"
      ],
      "easy": [
        "Rain",
        "Clouds",
        "Boom"
      ]
    }
  },
  {
    "word": "Canyon",
    "categoryId": "nature",
    "categoryName": "Nature & Wonders",
    "hints": {
      "subtle": [
        "Erosion",
        "Strata",
        "Plateau"
      ],
      "balanced": [
        "Gorge",
        "Cliffs",
        "Ravine"
      ],
      "easy": [
        "River",
        "Deep",
        "Valley"
      ]
    }
  },
  {
    "word": "Desert",
    "categoryId": "nature",
    "categoryName": "Nature & Wonders",
    "hints": {
      "subtle": [
        "Hot",
        "Dry",
        "Empty"
      ],
      "balanced": [
        "Sun",
        "Camel",
        "Gold"
      ],
      "easy": [
        "Sand",
        "Dunes",
        "Sahara"
      ]
    }
  },
  {
    "word": "Cave",
    "categoryId": "nature",
    "categoryName": "Nature & Wonders",
    "hints": {
      "subtle": [
        "Dark",
        "Cold",
        "Quiet"
      ],
      "balanced": [
        "Rock",
        "Bat",
        "Inside"
      ],
      "easy": [
        "Mountain",
        "Underground",
        "Hollow"
      ]
    }
  },
  {
    "word": "Island",
    "categoryId": "nature",
    "categoryName": "Nature & Wonders",
    "hints": {
      "subtle": [
        "Blue",
        "Vacation",
        "Small"
      ],
      "balanced": [
        "Beach",
        "Palm",
        "Boat"
      ],
      "easy": [
        "Water",
        "Sand",
        "Ocean"
      ]
    }
  },
  {
    "word": "Ocean",
    "categoryId": "nature",
    "categoryName": "Nature & Wonders",
    "hints": {
      "subtle": [
        "Deep",
        "Salt",
        "Huge"
      ],
      "balanced": [
        "Waves",
        "Fish",
        "Ship"
      ],
      "easy": [
        "Sea",
        "Blue",
        "Water"
      ]
    }
  },
  {
    "word": "Mountain",
    "categoryId": "nature",
    "categoryName": "Nature & Wonders",
    "hints": {
      "subtle": [
        "High",
        "Cold",
        "Climb"
      ],
      "balanced": [
        "Top",
        "Rock",
        "Snow"
      ],
      "easy": [
        "Peak",
        "Tall",
        "Hill"
      ]
    }
  },
  {
    "word": "River",
    "categoryId": "nature",
    "categoryName": "Nature & Wonders",
    "hints": {
      "subtle": [
        "Long",
        "Fish",
        "Bridge"
      ],
      "balanced": [
        "Flow",
        "Fresh",
        "Boat"
      ],
      "easy": [
        "Water",
        "Stream",
        "Bank"
      ]
    }
  },
  {
    "word": "Lake",
    "categoryId": "nature",
    "categoryName": "Nature & Wonders",
    "hints": {
      "subtle": [
        "Calm",
        "Fresh",
        "Fish"
      ],
      "balanced": [
        "Boat",
        "Swim",
        "Still"
      ],
      "easy": [
        "Water",
        "Pond",
        "Blue"
      ]
    }
  },
  {
    "word": "Forest",
    "categoryId": "nature",
    "categoryName": "Nature & Wonders",
    "hints": {
      "subtle": [
        "Green",
        "Quiet",
        "Wild"
      ],
      "balanced": [
        "Wood",
        "Animals",
        "Shade"
      ],
      "easy": [
        "Trees",
        "Nature",
        "Woods"
      ]
    }
  },
  {
    "word": "Beach",
    "categoryId": "nature",
    "categoryName": "Nature & Wonders",
    "hints": {
      "subtle": [
        "Summer",
        "Fun",
        "Warm"
      ],
      "balanced": [
        "Waves",
        "Sun",
        "Swim"
      ],
      "easy": [
        "Sand",
        "Ocean",
        "Sea"
      ]
    }
  },
  {
    "word": "Fog",
    "categoryId": "nature",
    "categoryName": "Nature & Wonders",
    "hints": {
      "subtle": [
        "Morning",
        "Grey",
        "Slow"
      ],
      "balanced": [
        "Cloud",
        "Low",
        "Drive"
      ],
      "easy": [
        "Mist",
        "White",
        "Blurry"
      ]
    }
  },
  {
    "word": "Sunrise",
    "categoryId": "nature",
    "categoryName": "Nature & Wonders",
    "hints": {
      "subtle": [
        "Early",
        "Orange",
        "New"
      ],
      "balanced": [
        "East",
        "Light",
        "Sky"
      ],
      "easy": [
        "Morning",
        "Sun",
        "Dawn"
      ]
    }
  },
  {
    "word": "Sunset",
    "categoryId": "nature",
    "categoryName": "Nature & Wonders",
    "hints": {
      "subtle": [
        "Evening",
        "Orange",
        "Calm"
      ],
      "balanced": [
        "West",
        "Red",
        "Sky"
      ],
      "easy": [
        "Night",
        "Sun",
        "Dusk"
      ]
    }
  },
  {
    "word": "Full Moon",
    "categoryId": "nature",
    "categoryName": "Nature & Wonders",
    "hints": {
      "subtle": [
        "Night",
        "Bright",
        "Sky"
      ],
      "balanced": [
        "White",
        "Wolf",
        "Glow"
      ],
      "easy": [
        "Round",
        "Space",
        "Circle"
      ]
    }
  },
  {
    "word": "Snow",
    "categoryId": "nature",
    "categoryName": "Nature & Wonders",
    "hints": {
      "subtle": [
        "Winter",
        "Quiet",
        "Soft"
      ],
      "balanced": [
        "Freeze",
        "Flakes",
        "Play"
      ],
      "easy": [
        "White",
        "Cold",
        "Ice"
      ]
    }
  },
  {
    "word": "Wind",
    "categoryId": "nature",
    "categoryName": "Nature & Wonders",
    "hints": {
      "subtle": [
        "Invisible",
        "Cool",
        "Move"
      ],
      "balanced": [
        "Trees",
        "Kite",
        "Fast"
      ],
      "easy": [
        "Air",
        "Blow",
        "Breeze"
      ]
    }
  },
  {
    "word": "Helicopter",
    "categoryId": "vehicles",
    "categoryName": "Vehicles & Transport",
    "hints": {
      "subtle": [
        "Collective",
        "Helipad",
        "Chopper"
      ],
      "balanced": [
        "Rotors",
        "Hover",
        "Skids"
      ],
      "easy": [
        "Fly",
        "Blades",
        "Rescue"
      ]
    }
  },
  {
    "word": "Submarine",
    "categoryId": "vehicles",
    "categoryName": "Vehicles & Transport",
    "hints": {
      "subtle": [
        "Ballast",
        "Periscope",
        "Torpedo"
      ],
      "balanced": [
        "Sonar",
        "Submerged",
        "Nuclear"
      ],
      "easy": [
        "Underwater",
        "Ocean",
        "Dive"
      ]
    }
  },
  {
    "word": "Sailboat",
    "categoryId": "vehicles",
    "categoryName": "Vehicles & Transport",
    "hints": {
      "subtle": [
        "Tack",
        "Keel",
        "Halyard"
      ],
      "balanced": [
        "Mast",
        "Canvas",
        "Rudder"
      ],
      "easy": [
        "Wind",
        "Ocean",
        "Voyage"
      ]
    }
  },
  {
    "word": "Hot Air Balloon",
    "categoryId": "vehicles",
    "categoryName": "Vehicles & Transport",
    "hints": {
      "subtle": [
        "Envelope",
        "Crownline",
        "Propane"
      ],
      "balanced": [
        "Burner",
        "Basket",
        "Float"
      ],
      "easy": [
        "Sky",
        "Fly",
        "Wicker"
      ]
    }
  },
  {
    "word": "Spaceship",
    "categoryId": "vehicles",
    "categoryName": "Vehicles & Transport",
    "hints": {
      "subtle": [
        "Airlock",
        "Thrusters",
        "Heatshield"
      ],
      "balanced": [
        "Rocket",
        "Orbit",
        "Astronauts"
      ],
      "easy": [
        "Cosmos",
        "Stars",
        "Launch"
      ]
    }
  },
  {
    "word": "Bulldozer",
    "categoryId": "vehicles",
    "categoryName": "Vehicles & Transport",
    "hints": {
      "subtle": [
        "Ripper",
        "Hydraulic",
        "Clearing"
      ],
      "balanced": [
        "Tracks",
        "Blade",
        "Heavy"
      ],
      "easy": [
        "Dirt",
        "Yellow",
        "Push"
      ]
    }
  },
  {
    "word": "Ambulance",
    "categoryId": "vehicles",
    "categoryName": "Vehicles & Transport",
    "hints": {
      "subtle": [
        "Defibrillator",
        "Gurney",
        "Paramedic"
      ],
      "balanced": [
        "Siren",
        "Emergency",
        "Flashers"
      ],
      "easy": [
        "Hospital",
        "White",
        "Rescue"
      ]
    }
  },
  {
    "word": "Jet Ski",
    "categoryId": "vehicles",
    "categoryName": "Vehicles & Transport",
    "hints": {
      "subtle": [
        "Impeller",
        "Lanyard",
        "Sponson"
      ],
      "balanced": [
        "Throttle",
        "Spray",
        "Waves"
      ],
      "easy": [
        "Water",
        "Fast",
        "Ride"
      ]
    }
  },
  {
    "word": "Fire Truck",
    "categoryId": "vehicles",
    "categoryName": "Vehicles & Transport",
    "hints": {
      "subtle": [
        "Outriggers",
        "Pumper",
        "Nozzle"
      ],
      "balanced": [
        "Ladder",
        "Hose",
        "Siren"
      ],
      "easy": [
        "Red",
        "Flames",
        "Water"
      ]
    }
  },
  {
    "word": "Motorcycle",
    "categoryId": "vehicles",
    "categoryName": "Vehicles & Transport",
    "hints": {
      "subtle": [
        "Clutch",
        "Kickstand",
        "Fairing"
      ],
      "balanced": [
        "Handlebars",
        "Helmet",
        "Exhaust"
      ],
      "easy": [
        "Wheels",
        "Engine",
        "Ride"
      ]
    }
  },
  {
    "word": "Yacht",
    "categoryId": "vehicles",
    "categoryName": "Vehicles & Transport",
    "hints": {
      "subtle": [
        "Helipad",
        "Stewardess",
        "Mooring"
      ],
      "balanced": [
        "Deck",
        "Luxury",
        "Marina"
      ],
      "easy": [
        "Boat",
        "Ocean",
        "White"
      ]
    }
  },
  {
    "word": "Tractor",
    "categoryId": "vehicles",
    "categoryName": "Vehicles & Transport",
    "hints": {
      "subtle": [
        "PTO",
        "Hitch",
        "Diesel"
      ],
      "balanced": [
        "Plow",
        "Fields",
        "Farmer"
      ],
      "easy": [
        "Tires",
        "Green",
        "Farm"
      ]
    }
  },
  {
    "word": "Airplane",
    "categoryId": "vehicles",
    "categoryName": "Vehicles & Transport",
    "hints": {
      "subtle": [
        "Altimeter",
        "Aileron",
        "Turbofan"
      ],
      "balanced": [
        "Runway",
        "Wings",
        "Cockpit"
      ],
      "easy": [
        "Fly",
        "Sky",
        "Airport"
      ]
    }
  },
  {
    "word": "Cable Car",
    "categoryId": "vehicles",
    "categoryName": "Vehicles & Transport",
    "hints": {
      "subtle": [
        "Bullwheel",
        "Grip",
        "Turntable"
      ],
      "balanced": [
        "Hills",
        "Bell",
        "Track"
      ],
      "easy": [
        "Trolley",
        "Sanfrancisco",
        "Ride"
      ]
    }
  },
  {
    "word": "Forklift",
    "categoryId": "vehicles",
    "categoryName": "Vehicles & Transport",
    "hints": {
      "subtle": [
        "Mast",
        "Counterweight",
        "Pallet"
      ],
      "balanced": [
        "Prongs",
        "Warehouse",
        "Hydraulic"
      ],
      "easy": [
        "Lift",
        "Boxes",
        "Drive"
      ]
    }
  },
  {
    "word": "Cruise Ship",
    "categoryId": "vehicles",
    "categoryName": "Vehicles & Transport",
    "hints": {
      "subtle": [
        "Promenade",
        "Porthole",
        "Lido"
      ],
      "balanced": [
        "Buffet",
        "Balcony",
        "Cabins"
      ],
      "easy": [
        "Vacation",
        "Ocean",
        "Huge"
      ]
    }
  },
  {
    "word": "Go-Kart",
    "categoryId": "vehicles",
    "categoryName": "Vehicles & Transport",
    "hints": {
      "subtle": [
        "Slicks",
        "Centrifugal",
        "Apex"
      ],
      "balanced": [
        "Lap",
        "Helmet",
        "Karting"
      ],
      "easy": [
        "Fast",
        "Race",
        "Track"
      ]
    }
  },
  {
    "word": "Delivery Van",
    "categoryId": "vehicles",
    "categoryName": "Vehicles & Transport",
    "hints": {
      "subtle": [
        "Parcelshelf",
        "Handbrake",
        "Manifest"
      ],
      "balanced": [
        "Courier",
        "Packages",
        "Sliding"
      ],
      "easy": [
        "Boxes",
        "Drive",
        "Street"
      ]
    }
  },
  {
    "word": "Camper Van",
    "categoryId": "vehicles",
    "categoryName": "Vehicles & Transport",
    "hints": {
      "subtle": [
        "Poptop",
        "Kitchenette",
        "Westfalia"
      ],
      "balanced": [
        "Camping",
        "Bed",
        "Roadtrip"
      ],
      "easy": [
        "Travel",
        "Sleep",
        "Wheels"
      ]
    }
  },
  {
    "word": "Double Decker Bus",
    "categoryId": "vehicles",
    "categoryName": "Vehicles & Transport",
    "hints": {
      "subtle": [
        "Routemaster",
        "Frontrow",
        "Staircase"
      ],
      "balanced": [
        "Upper",
        "Twotier",
        "London"
      ],
      "easy": [
        "Red",
        "Passengers",
        "Transit"
      ]
    }
  },
  {
    "word": "Kayak",
    "categoryId": "vehicles",
    "categoryName": "Vehicles & Transport",
    "hints": {
      "subtle": [
        "Sprayskirt",
        "Eskimoroll",
        "Inuit"
      ],
      "balanced": [
        "Paddle",
        "Cockpit",
        "Rapids"
      ],
      "easy": [
        "Boat",
        "River",
        "Water"
      ]
    }
  },
  {
    "word": "Car",
    "categoryId": "vehicles",
    "categoryName": "Vehicles & Transport",
    "hints": {
      "subtle": [
        "Road",
        "Daily",
        "Family"
      ],
      "balanced": [
        "Drive",
        "Four",
        "Engine"
      ],
      "easy": [
        "Wheels",
        "Traffic",
        "Auto"
      ]
    }
  },
  {
    "word": "Bus",
    "categoryId": "vehicles",
    "categoryName": "Vehicles & Transport",
    "hints": {
      "subtle": [
        "City",
        "Seats",
        "Stop"
      ],
      "balanced": [
        "Big",
        "Ticket",
        "Road"
      ],
      "easy": [
        "Public",
        "Passengers",
        "Drive"
      ]
    }
  },
  {
    "word": "Train",
    "categoryId": "vehicles",
    "categoryName": "Vehicles & Transport",
    "hints": {
      "subtle": [
        "Long",
        "Station",
        "Fast"
      ],
      "balanced": [
        "Ticket",
        "Travel",
        "Iron"
      ],
      "easy": [
        "Track",
        "Rail",
        "Wagons"
      ]
    }
  },
  {
    "word": "Bicycle",
    "categoryId": "vehicles",
    "categoryName": "Vehicles & Transport",
    "hints": {
      "subtle": [
        "Park",
        "Healthy",
        "Chain"
      ],
      "balanced": [
        "Two",
        "Ride",
        "Helmet"
      ],
      "easy": [
        "Pedal",
        "Wheels",
        "Bike"
      ]
    }
  },
  {
    "word": "Rocket",
    "categoryId": "vehicles",
    "categoryName": "Vehicles & Transport",
    "hints": {
      "subtle": [
        "Loud",
        "Fire",
        "Fast"
      ],
      "balanced": [
        "Launch",
        "Stars",
        "Astronaut"
      ],
      "easy": [
        "Space",
        "Moon",
        "Fly"
      ]
    }
  },
  {
    "word": "Police Car",
    "categoryId": "vehicles",
    "categoryName": "Vehicles & Transport",
    "hints": {
      "subtle": [
        "City",
        "Fast",
        "Blue"
      ],
      "balanced": [
        "Siren",
        "Lights",
        "Chase"
      ],
      "easy": [
        "Officer",
        "Law",
        "Patrol"
      ]
    }
  },
  {
    "word": "Taxi",
    "categoryId": "vehicles",
    "categoryName": "Vehicles & Transport",
    "hints": {
      "subtle": [
        "City",
        "Pay",
        "Ride"
      ],
      "balanced": [
        "Yellow",
        "Meter",
        "Driver"
      ],
      "easy": [
        "Cab",
        "Car",
        "Trip"
      ]
    }
  },
  {
    "word": "Truck",
    "categoryId": "vehicles",
    "categoryName": "Vehicles & Transport",
    "hints": {
      "subtle": [
        "Road",
        "Big",
        "Heavy"
      ],
      "balanced": [
        "Goods",
        "Carry",
        "Long"
      ],
      "easy": [
        "Cargo",
        "Drive",
        "Large"
      ]
    }
  },
  {
    "word": "Scooter",
    "categoryId": "vehicles",
    "categoryName": "Vehicles & Transport",
    "hints": {
      "subtle": [
        "City",
        "Small",
        "Easy"
      ],
      "balanced": [
        "Two",
        "Stand",
        "Ride"
      ],
      "easy": [
        "Wheels",
        "Electric",
        "Fast"
      ]
    }
  },
  {
    "word": "Metro Train",
    "categoryId": "vehicles",
    "categoryName": "Vehicles & Transport",
    "hints": {
      "subtle": [
        "City",
        "Fast",
        "Busy"
      ],
      "balanced": [
        "Station",
        "Ticket",
        "Dark"
      ],
      "easy": [
        "Underground",
        "Rail",
        "Subway"
      ]
    }
  },
  {
    "word": "School Bus",
    "categoryId": "vehicles",
    "categoryName": "Vehicles & Transport",
    "hints": {
      "subtle": [
        "Morning",
        "Kids",
        "Stop"
      ],
      "balanced": [
        "Seats",
        "Driver",
        "Ride"
      ],
      "easy": [
        "Yellow",
        "Students",
        "Class"
      ]
    }
  },
  {
    "word": "Rickshaw",
    "categoryId": "vehicles",
    "categoryName": "Vehicles & Transport",
    "hints": {
      "subtle": [
        "Street",
        "Busy",
        "Asia"
      ],
      "balanced": [
        "Three",
        "Ride",
        "City"
      ],
      "easy": [
        "Auto",
        "Wheels",
        "Taxi"
      ]
    }
  },
  {
    "word": "Speedboat",
    "categoryId": "vehicles",
    "categoryName": "Vehicles & Transport",
    "hints": {
      "subtle": [
        "Fast",
        "Loud",
        "Splash"
      ],
      "balanced": [
        "Engine",
        "Lake",
        "Ocean"
      ],
      "easy": [
        "Water",
        "Ship",
        "Race"
      ]
    }
  },
  {
    "word": "Tram",
    "categoryId": "vehicles",
    "categoryName": "Vehicles & Transport",
    "hints": {
      "subtle": [
        "City",
        "Bell",
        "Slow"
      ],
      "balanced": [
        "Street",
        "Electric",
        "Rail"
      ],
      "easy": [
        "Track",
        "Train",
        "Public"
      ]
    }
  },
  {
    "word": "Eiffel Tower",
    "categoryId": "landmarks",
    "categoryName": "Places & Landmarks",
    "hints": {
      "subtle": [
        "Gustave",
        "Champdemars",
        "Centennial"
      ],
      "balanced": [
        "Lattice",
        "Paris",
        "Spire"
      ],
      "easy": [
        "France",
        "Iron",
        "Monument"
      ]
    }
  },
  {
    "word": "Statue of Liberty",
    "categoryId": "landmarks",
    "categoryName": "Places & Landmarks",
    "hints": {
      "subtle": [
        "Bartholdi",
        "Bedloe",
        "Tabula"
      ],
      "balanced": [
        "Torch",
        "Crown",
        "Copper"
      ],
      "easy": [
        "Harbor",
        "Green",
        "Freedom"
      ]
    }
  },
  {
    "word": "Great Wall of China",
    "categoryId": "landmarks",
    "categoryName": "Places & Landmarks",
    "hints": {
      "subtle": [
        "Badaling",
        "Mortar",
        "Beacon"
      ],
      "balanced": [
        "Fortress",
        "Ridges",
        "Bricks"
      ],
      "easy": [
        "Longest",
        "Stone",
        "Ancient"
      ]
    }
  },
  {
    "word": "Colosseum",
    "categoryId": "landmarks",
    "categoryName": "Places & Landmarks",
    "hints": {
      "subtle": [
        "Vespasian",
        "Hypogeum",
        "Velarium"
      ],
      "balanced": [
        "Gladiators",
        "Arches",
        "Arena"
      ],
      "easy": [
        "Rome",
        "Italy",
        "Ancient"
      ]
    }
  },
  {
    "word": "Pyramids of Giza",
    "categoryId": "landmarks",
    "categoryName": "Places & Landmarks",
    "hints": {
      "subtle": [
        "Khufu",
        "Limestone",
        "Shafts"
      ],
      "balanced": [
        "Sphinx",
        "Pharaohs",
        "Tombs"
      ],
      "easy": [
        "Desert",
        "Egypt",
        "Triangular"
      ]
    }
  },
  {
    "word": "Taj Mahal",
    "categoryId": "landmarks",
    "categoryName": "Places & Landmarks",
    "hints": {
      "subtle": [
        "Mumtaz",
        "Pietradura",
        "Yamuna"
      ],
      "balanced": [
        "Mausoleum",
        "Minarets",
        "Dome"
      ],
      "easy": [
        "India",
        "Marble",
        "Love"
      ]
    }
  },
  {
    "word": "Machu Picchu",
    "categoryId": "landmarks",
    "categoryName": "Places & Landmarks",
    "hints": {
      "subtle": [
        "Ashlar",
        "Intihuatana",
        "Urubamba"
      ],
      "balanced": [
        "Inca",
        "Terraces",
        "Llamas"
      ],
      "easy": [
        "Peru",
        "Andes",
        "Ruins"
      ]
    }
  },
  {
    "word": "Big Ben",
    "categoryId": "landmarks",
    "categoryName": "Places & Landmarks",
    "hints": {
      "subtle": [
        "Westminster",
        "Thirteen",
        "Pennies"
      ],
      "balanced": [
        "Clock",
        "Chimes",
        "London"
      ],
      "easy": [
        "Bell",
        "England",
        "Hour"
      ]
    }
  },
  {
    "word": "Golden Gate Bridge",
    "categoryId": "landmarks",
    "categoryName": "Places & Landmarks",
    "hints": {
      "subtle": [
        "Strauss",
        "Marin",
        "Rivets"
      ],
      "balanced": [
        "Suspension",
        "Orange",
        "Fog"
      ],
      "easy": [
        "California",
        "Bay",
        "Red"
      ]
    }
  },
  {
    "word": "Christ the Redeemer",
    "categoryId": "landmarks",
    "categoryName": "Places & Landmarks",
    "hints": {
      "subtle": [
        "Corcovado",
        "Soapstone",
        "Tijuca"
      ],
      "balanced": [
        "Arms",
        "Deco",
        "Summit"
      ],
      "easy": [
        "Statue",
        "Brazil",
        "Rio"
      ]
    }
  },
  {
    "word": "Sydney Opera House",
    "categoryId": "landmarks",
    "categoryName": "Places & Landmarks",
    "hints": {
      "subtle": [
        "Utzon",
        "Ceramic",
        "Bennelong"
      ],
      "balanced": [
        "Sails",
        "Harbor",
        "Music"
      ],
      "easy": [
        "Australia",
        "White",
        "Performance"
      ]
    }
  },
  {
    "word": "Leaning Tower of Pisa",
    "categoryId": "landmarks",
    "categoryName": "Places & Landmarks",
    "hints": {
      "subtle": [
        "Campanile",
        "Subsoil",
        "Counterweights"
      ],
      "balanced": [
        "Tilt",
        "Marble",
        "Bells"
      ],
      "easy": [
        "Italy",
        "Diagonal",
        "Galileo"
      ]
    }
  },
  {
    "word": "Petra",
    "categoryId": "landmarks",
    "categoryName": "Places & Landmarks",
    "hints": {
      "subtle": [
        "Siq",
        "Nabataean",
        "Urn"
      ],
      "balanced": [
        "Treasury",
        "Rosered",
        "Carved"
      ],
      "easy": [
        "Jordan",
        "Desert",
        "Ancient"
      ]
    }
  },
  {
    "word": "Stonehenge",
    "categoryId": "landmarks",
    "categoryName": "Places & Landmarks",
    "hints": {
      "subtle": [
        "Heel",
        "Aubrey",
        "Preseli"
      ],
      "balanced": [
        "Solstice",
        "Monoliths",
        "Lintels"
      ],
      "easy": [
        "Circle",
        "England",
        "Ancient"
      ]
    }
  },
  {
    "word": "Mount Everest",
    "categoryId": "landmarks",
    "categoryName": "Places & Landmarks",
    "hints": {
      "subtle": [
        "Khumbu",
        "Sherpa",
        "Chomolungma"
      ],
      "balanced": [
        "Summit",
        "Himalayas",
        "Oxygen"
      ],
      "easy": [
        "Highest",
        "Snow",
        "Climb"
      ]
    }
  },
  {
    "word": "Louvre Museum",
    "categoryId": "landmarks",
    "categoryName": "Places & Landmarks",
    "hints": {
      "subtle": [
        "Pei",
        "Palace",
        "Sully"
      ],
      "balanced": [
        "Pyramid",
        "Mona",
        "Venus"
      ],
      "easy": [
        "Paris",
        "Art",
        "Paintings"
      ]
    }
  },
  {
    "word": "Times Square",
    "categoryId": "landmarks",
    "categoryName": "Places & Landmarks",
    "hints": {
      "subtle": [
        "Ball",
        "Naked",
        "Crossroads"
      ],
      "balanced": [
        "Billboards",
        "Broadway",
        "Midnight"
      ],
      "easy": [
        "Neon",
        "Manhattan",
        "Crowded"
      ]
    }
  },
  {
    "word": "Burj Khalifa",
    "categoryId": "landmarks",
    "categoryName": "Places & Landmarks",
    "hints": {
      "subtle": [
        "Yshaped",
        "Spire",
        "Eighty"
      ],
      "balanced": [
        "Tallest",
        "Dubai",
        "Elevators"
      ],
      "easy": [
        "Skyscraper",
        "Desert",
        "High"
      ]
    }
  },
  {
    "word": "Empire State Building",
    "categoryId": "landmarks",
    "categoryName": "Places & Landmarks",
    "hints": {
      "subtle": [
        "Mooring",
        "Kong",
        "Limestone"
      ],
      "balanced": [
        "Artdeco",
        "Spire",
        "Observation"
      ],
      "easy": [
        "Manhattan",
        "Skyscraper",
        "Lights"
      ]
    }
  },
  {
    "word": "Niagara Falls",
    "categoryId": "landmarks",
    "categoryName": "Places & Landmarks",
    "hints": {
      "subtle": [
        "Maid",
        "Barrel",
        "Horseshoe"
      ],
      "balanced": [
        "Cataract",
        "Mist",
        "Border"
      ],
      "easy": [
        "Water",
        "River",
        "Roar"
      ]
    }
  },
  {
    "word": "Mount Fuji",
    "categoryId": "landmarks",
    "categoryName": "Places & Landmarks",
    "hints": {
      "subtle": [
        "Hokusai",
        "Stratovolcano",
        "Shinto"
      ],
      "balanced": [
        "Snowcapped",
        "Volcano",
        "Sacred"
      ],
      "easy": [
        "Japan",
        "Peak",
        "Tokyo"
      ]
    }
  },
  {
    "word": "Angkor Wat",
    "categoryId": "landmarks",
    "categoryName": "Places & Landmarks",
    "hints": {
      "subtle": [
        "Suryavarman",
        "Basrelief",
        "Meru"
      ],
      "balanced": [
        "Khmer",
        "Towers",
        "Moat"
      ],
      "easy": [
        "Cambodia",
        "Temple",
        "Stone"
      ]
    }
  },
  {
    "word": "Chichen Itza",
    "categoryId": "landmarks",
    "categoryName": "Places & Landmarks",
    "hints": {
      "subtle": [
        "Kukulkan",
        "Cenote",
        "Caracol"
      ],
      "balanced": [
        "Mayan",
        "Pyramid",
        "Equinox"
      ],
      "easy": [
        "Mexico",
        "Ruins",
        "Stone"
      ]
    }
  },
  {
    "word": "Notre Dame",
    "categoryId": "landmarks",
    "categoryName": "Places & Landmarks",
    "hints": {
      "subtle": [
        "Gargoyles",
        "Quasimodo",
        "Spire"
      ],
      "balanced": [
        "Gothic",
        "Bells",
        "Rose"
      ],
      "easy": [
        "Paris",
        "Cathedral",
        "France"
      ]
    }
  },
  {
    "word": "Sagrada Familia",
    "categoryId": "landmarks",
    "categoryName": "Places & Landmarks",
    "hints": {
      "subtle": [
        "Gaudi",
        "Nativity",
        "Organic"
      ],
      "balanced": [
        "Barcelona",
        "Unfinished",
        "Spires"
      ],
      "easy": [
        "Basilica",
        "Spain",
        "Church"
      ]
    }
  },
  {
    "word": "Tower Bridge",
    "categoryId": "landmarks",
    "categoryName": "Places & Landmarks",
    "hints": {
      "subtle": [
        "Bascules",
        "Walkways",
        "Victorian"
      ],
      "balanced": [
        "Thames",
        "Lifting",
        "Turrets"
      ],
      "easy": [
        "London",
        "England",
        "River"
      ]
    }
  },
  {
    "word": "Hollywood Sign",
    "categoryId": "landmarks",
    "categoryName": "Places & Landmarks",
    "hints": {
      "subtle": [
        "Land",
        "Lee",
        "Peg"
      ],
      "balanced": [
        "Letters",
        "Cinema",
        "Hills"
      ],
      "easy": [
        "California",
        "White",
        "Movies"
      ]
    }
  },
  {
    "word": "Vatican City",
    "categoryId": "landmarks",
    "categoryName": "Places & Landmarks",
    "hints": {
      "subtle": [
        "Enclave",
        "Swiss",
        "Conclave"
      ],
      "balanced": [
        "Pope",
        "Sistine",
        "Basilica"
      ],
      "easy": [
        "Catholic",
        "Smallest",
        "Rome"
      ]
    }
  },
  {
    "word": "Versailles Palace",
    "categoryId": "landmarks",
    "categoryName": "Places & Landmarks",
    "hints": {
      "subtle": [
        "Sunking",
        "Orangerie",
        "Trianon"
      ],
      "balanced": [
        "Mirrors",
        "Gardens",
        "Gilded"
      ],
      "easy": [
        "Royalty",
        "France",
        "Opulent"
      ]
    }
  },
  {
    "word": "Mount Rushmore",
    "categoryId": "landmarks",
    "categoryName": "Places & Landmarks",
    "hints": {
      "subtle": [
        "Borglum",
        "Blackhills",
        "Dynamite"
      ],
      "balanced": [
        "Presidents",
        "Carved",
        "Granite"
      ],
      "easy": [
        "Faces",
        "Mountain",
        "Monument"
      ]
    }
  },
  {
    "word": "Grand Canyon",
    "categoryId": "landmarks",
    "categoryName": "Places & Landmarks",
    "hints": {
      "subtle": [
        "Red",
        "Deep",
        "Dry"
      ],
      "balanced": [
        "Wide",
        "River",
        "View"
      ],
      "easy": [
        "America",
        "Rock",
        "Valley"
      ]
    }
  },
  {
    "word": "Disneyland",
    "categoryId": "landmarks",
    "categoryName": "Places & Landmarks",
    "hints": {
      "subtle": [
        "Kids",
        "Happy",
        "Castle"
      ],
      "balanced": [
        "Rides",
        "Mouse",
        "Fun"
      ],
      "easy": [
        "Park",
        "Cartoon",
        "Magic"
      ]
    }
  },
  {
    "word": "Sahara Desert",
    "categoryId": "landmarks",
    "categoryName": "Places & Landmarks",
    "hints": {
      "subtle": [
        "Hot",
        "Dry",
        "Huge"
      ],
      "balanced": [
        "Sun",
        "Camel",
        "Empty"
      ],
      "easy": [
        "Africa",
        "Sand",
        "Dunes"
      ]
    }
  },
  {
    "word": "Amazon Rainforest",
    "categoryId": "landmarks",
    "categoryName": "Places & Landmarks",
    "hints": {
      "subtle": [
        "Green",
        "Wild",
        "Wet"
      ],
      "balanced": [
        "River",
        "Animals",
        "Huge"
      ],
      "easy": [
        "Jungle",
        "Brazil",
        "Trees"
      ]
    }
  },
  {
    "word": "Great Barrier Reef",
    "categoryId": "landmarks",
    "categoryName": "Places & Landmarks",
    "hints": {
      "subtle": [
        "Blue",
        "Dive",
        "Colors"
      ],
      "balanced": [
        "Fish",
        "Sea",
        "Coral"
      ],
      "easy": [
        "Australia",
        "Ocean",
        "Underwater"
      ]
    }
  },
  {
    "word": "White House",
    "categoryId": "landmarks",
    "categoryName": "Places & Landmarks",
    "hints": {
      "subtle": [
        "Clean",
        "Guard",
        "Power"
      ],
      "balanced": [
        "Leader",
        "Office",
        "Home"
      ],
      "easy": [
        "America",
        "President",
        "Washington"
      ]
    }
  },
  {
    "word": "Buckingham Palace",
    "categoryId": "landmarks",
    "categoryName": "Places & Landmarks",
    "hints": {
      "subtle": [
        "Guards",
        "Red",
        "Gold"
      ],
      "balanced": [
        "Royal",
        "Crown",
        "Queen"
      ],
      "easy": [
        "London",
        "England",
        "Castle"
      ]
    }
  },
  {
    "word": "Santorini",
    "categoryId": "landmarks",
    "categoryName": "Places & Landmarks",
    "hints": {
      "subtle": [
        "Blue",
        "White",
        "Sea"
      ],
      "balanced": [
        "Sunset",
        "Island",
        "View"
      ],
      "easy": [
        "Greece",
        "Vacation",
        "Ocean"
      ]
    }
  }
];

const BUILTIN_CATEGORY_IDS = new Set(BUILTIN_WORD_BANK.map((w) => w.categoryId));

const CATEGORY_ALIASES: Record<string, string> = {
  geography: 'countries_cities',
  professions: 'jobs_professions',
};

function secureRandomInt(maxExclusive: number): number {
  if (!Number.isInteger(maxExclusive) || maxExclusive <= 0) {
    throw new RangeError('maxExclusive must be a positive integer');
  }
  if (maxExclusive === 1) return 0;

  const range = 0x100000000;
  const limit = range - (range % maxExclusive);
  const buf = new Uint32Array(1);

  while (true) {
    globalThis.crypto.getRandomValues(buf);
    const val = buf[0];
    if (val < limit) {
      return val % maxExclusive;
    }
  }
}

function secureShuffle<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1);
    const tmp = copy[i];
    copy[i] = copy[j];
    copy[j] = tmp;
  }
  return copy;
}

export function generateRoomCode(length = 4): string {
  if (!Number.isInteger(length) || length <= 0) {
    throw new RangeError('Room code length must be a positive integer');
  }
  const bytes = new Uint8Array(length);
  globalThis.crypto.getRandomValues(bytes);
  let code = '';
  for (let i = 0; i < length; i++) {
    code += ROOM_CODE_ALPHABET[bytes[i] & 31];
  }
  return code;
}

export function validateAndNormalizeSettings(raw: unknown): RoomSettings {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    throw new Error('Settings must be a non-null object');
  }

  const obj = raw as Record<string, unknown>;

  if (!Array.isArray(obj.categoryIds)) {
    throw new Error('categoryIds must be a non-empty array of strings');
  }
  const categoryIds = Array.from(
    new Set(
      obj.categoryIds
        .filter((id): id is string => typeof id === 'string')
        .map((id) => id.trim())
        .filter((id) => id.length > 0),
    ),
  );
  if (categoryIds.length === 0) {
    throw new Error('categoryIds must contain at least one non-empty category ID');
  }

  let turnDurationSeconds = 20;
  if (obj.turnDurationSeconds !== undefined) {
    if (
      typeof obj.turnDurationSeconds !== 'number' ||
      !ALLOWED_TURN_DURATIONS.includes(obj.turnDurationSeconds as (typeof ALLOWED_TURN_DURATIONS)[number])
    ) {
      throw new Error(`turnDurationSeconds must be one of ${ALLOWED_TURN_DURATIONS.join(', ')}`);
    }
    turnDurationSeconds = obj.turnDurationSeconds;
  }

  let discussionDurationSeconds = 45;
  if (obj.discussionDurationSeconds !== undefined) {
    if (
      typeof obj.discussionDurationSeconds !== 'number' ||
      !ALLOWED_DISCUSSION_DURATIONS.includes(
        obj.discussionDurationSeconds as (typeof ALLOWED_DISCUSSION_DURATIONS)[number],
      )
    ) {
      throw new Error(
        `discussionDurationSeconds must be one of ${ALLOWED_DISCUSSION_DURATIONS.join(', ')}`,
      );
    }
    discussionDurationSeconds = obj.discussionDurationSeconds;
  }

  let votingDurationSeconds = 60;
  if (obj.votingDurationSeconds !== undefined) {
    if (typeof obj.votingDurationSeconds !== 'number' || !Number.isFinite(obj.votingDurationSeconds)) {
      throw new Error('votingDurationSeconds must be a finite number');
    }
    votingDurationSeconds = Math.min(120, Math.max(15, Math.round(obj.votingDurationSeconds)));
  }

  let hintDifficulty: HintDifficulty = 'subtle';
  if (obj.hintDifficulty !== undefined) {
    if (
      typeof obj.hintDifficulty !== 'string' ||
      !ALLOWED_HINT_DIFFICULTIES.includes(obj.hintDifficulty as HintDifficulty)
    ) {
      throw new Error(`hintDifficulty must be one of ${ALLOWED_HINT_DIFFICULTIES.join(', ')}`);
    }
    hintDifficulty = obj.hintDifficulty as HintDifficulty;
  }

  let chomuCount = 1;
  if (obj.chomuCount !== undefined) {
    if (typeof obj.chomuCount !== 'number' || !Number.isFinite(obj.chomuCount)) {
      throw new Error('chomuCount must be a finite number');
    }
    chomuCount = Math.min(3, Math.max(1, Math.round(obj.chomuCount)));
  }

  let soundEnabled = true;
  if (obj.soundEnabled !== undefined) {
    if (typeof obj.soundEnabled !== 'boolean') {
      throw new Error('soundEnabled must be a boolean');
    }
    soundEnabled = obj.soundEnabled;
  }

  let customWords: CustomWordInput[] | undefined;
  if (obj.customWords !== undefined) {
    if (!Array.isArray(obj.customWords)) {
      throw new Error('customWords must be an array');
    }
    const normalized: CustomWordInput[] = [];
    for (const item of obj.customWords) {
      if (typeof item !== 'object' || item === null) continue;
      const entry = item as Record<string, unknown>;
      if (typeof entry.word !== 'string') continue;
      const trimmedWord = entry.word.trim();
      if (!trimmedWord) continue;
      const customEntry: CustomWordInput = { word: trimmedWord };
      if (typeof entry.hint === 'string' && entry.hint.trim()) {
        customEntry.hint = entry.hint.trim();
      }
      if (typeof entry.categoryName === 'string' && entry.categoryName.trim()) {
        customEntry.categoryName = entry.categoryName.trim();
      }
      normalized.push(customEntry);
    }
    customWords = normalized;
  }

  const result: RoomSettings = {
    categoryIds,
    turnDurationSeconds,
    discussionDurationSeconds,
    votingDurationSeconds,
    hintDifficulty,
    chomuCount,
    soundEnabled,
  };
  if (customWords !== undefined) {
    result.customWords = customWords;
  }
  return result;
}

interface CandidateWord {
  word: string;
  categoryName: string;
  hints?: {
    subtle: [string, string, string];
    balanced: [string, string, string];
    easy: [string, string, string];
  };
  customHint?: string;
}

function buildWordPool(settings: RoomSettings): CandidateWord[] {
  const resolvedIds = settings.categoryIds.map((id) => CATEGORY_ALIASES[id] ?? id);
  const selectedBuiltInIds = new Set(resolvedIds.filter((id) => BUILTIN_CATEGORY_IDS.has(id)));
  const customCategoryIds = resolvedIds.filter((id) => !BUILTIN_CATEGORY_IDS.has(id));

  const pool: CandidateWord[] = [];

  for (const entry of BUILTIN_WORD_BANK) {
    if (selectedBuiltInIds.has(entry.categoryId)) {
      pool.push({
        word: entry.word,
        categoryName: entry.categoryName,
        hints: entry.hints,
      });
    }
  }

  if (customCategoryIds.length > 0 && settings.customWords && settings.customWords.length > 0) {
    const hasGenericCustom = customCategoryIds.includes('custom');
    const customIdSet = new Set(customCategoryIds.map((id) => id.toLowerCase()));

    for (const cw of settings.customWords) {
      const trimmedWord = cw.word.trim();
      if (!trimmedWord) continue;

      const cwCategory = cw.categoryName?.trim();
      const matchesSpecificCustom =
        cwCategory !== undefined &&
        (customIdSet.has(cwCategory.toLowerCase()) ||
          customIdSet.has(`custom_${cwCategory.toLowerCase()}`));

      if (hasGenericCustom || !cwCategory || matchesSpecificCustom || customCategoryIds.length > 0) {
        pool.push({
          word: trimmedWord,
          categoryName: cwCategory || 'Custom',
          customHint: cw.hint?.trim() || undefined,
        });
      }
    }
  }

  return pool;
}

export function assignRolesAndWord(params: {
  playerUserIds: string[];
  settings: RoomSettings;
  usedWords?: string[];
}): {
  secretWord: string;
  secretCategory: string;
  chomuIds: string[];
  turnOrder: string[];
  hintsByUserId: Record<string, string | null>;
  updatedUsedWords: string[];
} {
  const { playerUserIds, settings, usedWords = [] } = params;

  if (playerUserIds.length < 2) {
    throw new Error('At least 2 players are required to assign roles');
  }

  const pool = buildWordPool(settings);
  if (pool.length === 0) {
    throw new Error('No words available for the selected categories');
  }

  const usedSet = new Set(usedWords);
  let available = pool.filter((item) => !usedSet.has(item.word));
  let baseUsedWords = usedWords;

  if (available.length === 0) {
    available = pool;
    baseUsedWords = [];
  }

  const picked = available[secureRandomInt(available.length)];
  const updatedUsedWords = [...baseUsedWords, picked.word];

  const effectiveChomuCount = Math.max(
    1,
    Math.min(settings.chomuCount, playerUserIds.length - 1),
  );

  const turnOrder = secureShuffle(playerUserIds);
  const chomuIds = secureShuffle(playerUserIds).slice(0, effectiveChomuCount);
  const chomuSet = new Set(chomuIds);

  const hintsByUserId: Record<string, string | null> = {};
  let chomuHintIndex = 0;

  for (const userId of playerUserIds) {
    if (!chomuSet.has(userId)) {
      hintsByUserId[userId] = null;
      continue;
    }

    if (settings.hintDifficulty === 'none') {
      hintsByUserId[userId] = null;
    } else if (picked.hints) {
      const tierHints = picked.hints[settings.hintDifficulty];
      hintsByUserId[userId] = tierHints[chomuHintIndex % tierHints.length];
      chomuHintIndex++;
    } else {
      hintsByUserId[userId] = picked.customHint ?? null;
    }
  }

  return {
    secretWord: picked.word,
    secretCategory: picked.categoryName,
    chomuIds,
    turnOrder,
    hintsByUserId,
    updatedUsedWords,
  };
}

function toBase64Url(input: Uint8Array | string): string {
  const bytes = typeof input === 'string' ? new TextEncoder().encode(input) : input;
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function mintLiveKitJwt(params: {
  apiKey: string;
  apiSecret: string;
  roomName: string;
  identity: string;
  name: string;
  ttlSeconds?: number;
}): Promise<string> {
  const { apiKey, apiSecret, roomName, identity, name, ttlSeconds = 7200 } = params;
  const now = Math.floor(Date.now() / 1000);

  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = {
    iss: apiKey,
    sub: identity,
    name,
    nbf: now,
    exp: now + ttlSeconds,
    video: {
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    },
  };

  const encodedHeader = toBase64Url(JSON.stringify(header));
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  const key = await globalThis.crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(apiSecret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );

  const signatureBuffer = await globalThis.crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(signingInput),
  );

  const encodedSignature = toBase64Url(new Uint8Array(signatureBuffer));
  return `${signingInput}.${encodedSignature}`;
}
