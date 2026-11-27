import { RandomSource, secureShuffle } from '../services/random';

export type HintDifficulty = 'subtle' | 'balanced' | 'easy' | 'none';

export interface WordEntry {
  id: string; // Stable word ID
  word: string;
  categoryId: string;
  categoryName: string;
  hints?: {
    subtle: [string, string, string];   // 3 distinct single-word subtle associations
    balanced: [string, string, string]; // 3 distinct single-word balanced clues
    easy: [string, string, string];     // 3 distinct single-word recognizable clues
  };
}

/**
 * Curated, hint-supported words across all 15 party categories.
 * Single source of truth: 593 words, each with 9 handcrafted single-word hints
 * (3 per difficulty) guaranteeing that up to 3 imposters receive distinct hints without repetition.
 */
export const HINT_SUPPORTED_WORDS: WordEntry[] = [
  {
    "id": "obj_umbrella",
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
    "id": "obj_toothbrush",
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
    "id": "obj_backpack",
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
    "id": "obj_sunglasses",
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
    "id": "obj_headphones",
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
    "id": "obj_flashlight",
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
    "id": "obj_mirror",
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
    "id": "obj_wallet",
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
    "id": "obj_alarm_clock",
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
    "id": "obj_scissors",
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
    "id": "obj_pillow",
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
    "id": "obj_hammer",
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
    "id": "obj_candle",
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
    "id": "obj_blender",
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
    "id": "obj_coffee_mug",
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
    "id": "obj_water_bottle",
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
    "id": "obj_notebook",
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
    "id": "obj_blanket",
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
    "id": "obj_towel",
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
    "id": "obj_doorbell",
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
    "id": "obj_teapot",
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
    "id": "obj_screwdriver",
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
    "id": "obj_curtain",
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
    "id": "obj_sponge",
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
    "id": "obj_calculator",
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
    "id": "obj_compass",
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
    "id": "obj_lighter",
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
    "id": "obj_broom",
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
    "id": "obj_keys",
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
    "id": "obj_watch",
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
    "id": "obj_suitcase",
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
    "id": "obj_comb",
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
    "id": "obj_passport",
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
    "id": "obj_calendar",
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
    "id": "obj_camera",
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
    "id": "obj_soap",
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
    "id": "obj_perfume",
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
    "id": "obj_shoes",
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
    "id": "obj_jacket",
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
    "id": "obj_lock",
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
    "id": "food_pizza",
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
    "id": "food_sushi",
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
    "id": "food_croissant",
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
    "id": "food_burger",
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
    "id": "food_taco",
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
    "id": "food_coffee",
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
    "id": "food_ramen",
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
    "id": "food_ice_cream",
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
    "id": "food_waffles",
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
    "id": "food_popcorn",
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
    "id": "food_donut",
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
    "id": "food_cheesecake",
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
    "id": "food_lemonade",
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
    "id": "food_chocolate",
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
    "id": "food_spaghetti",
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
    "id": "food_guacamole",
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
    "id": "food_smoothie",
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
    "id": "food_bagel",
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
    "id": "food_pancakes",
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
    "id": "food_french_fries",
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
    "id": "food_brownie",
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
    "id": "food_hot_chocolate",
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
    "id": "food_burrito",
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
    "id": "food_dumplings",
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
    "id": "food_steak",
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
    "id": "food_apple_pie",
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
    "id": "food_cupcake",
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
    "id": "food_pretzel",
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
    "id": "food_milkshake",
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
    "id": "food_nachos",
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
    "id": "food_omelet",
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
    "id": "food_tea",
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
    "id": "food_noodles",
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
    "id": "food_cake",
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
    "id": "food_sandwich",
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
    "id": "food_salad",
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
    "id": "food_soup",
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
    "id": "food_fried_rice",
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
    "id": "food_biryani",
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
    "id": "food_curry",
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
    "id": "food_pasta",
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
    "id": "food_cookies",
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
    "id": "food_mango",
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
    "id": "food_watermelon",
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
    "id": "food_banana",
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
    "id": "food_cheese",
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
    "id": "food_bread",
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
    "id": "food_honey",
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
    "id": "anim_penguin",
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
    "id": "anim_kangaroo",
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
    "id": "anim_dolphin",
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
    "id": "anim_owl",
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
    "id": "anim_giraffe",
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
    "id": "anim_octopus",
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
    "id": "anim_elephant",
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
    "id": "anim_cheetah",
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
    "id": "anim_panda",
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
    "id": "anim_wolf",
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
    "id": "anim_chameleon",
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
    "id": "anim_flamingo",
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
    "id": "anim_koala",
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
    "id": "anim_gorilla",
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
    "id": "anim_sloth",
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
    "id": "anim_hedgehog",
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
    "id": "anim_tiger",
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
    "id": "anim_zebra",
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
    "id": "anim_polar_bear",
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
    "id": "anim_otter",
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
    "id": "anim_rhinoceros",
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
    "id": "anim_parrot",
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
    "id": "anim_hippopotamus",
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
    "id": "anim_squirrel",
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
    "id": "anim_peacock",
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
    "id": "anim_lion",
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
    "id": "anim_fox",
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
    "id": "anim_jaguar",
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
    "id": "anim_falcon",
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
    "id": "anim_eagle",
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
    "id": "anim_turtle",
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
    "id": "anim_shark",
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
    "id": "anim_whale",
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
    "id": "anim_camel",
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
    "id": "anim_horse",
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
    "id": "anim_monkey",
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
    "id": "anim_crocodile",
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
    "id": "anim_snake",
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
    "id": "anim_butterfly",
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
    "id": "anim_frog",
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
    "id": "anim_rabbit",
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
    "id": "anim_dog",
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
    "id": "fam_albert_einstein",
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
    "id": "fam_leonardo_da_vinci",
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
    "id": "fam_michael_jackson",
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
    "id": "fam_steve_jobs",
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
    "id": "fam_william_shakespeare",
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
    "id": "fam_cleopatra",
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
    "id": "fam_wolfgang_mozart",
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
    "id": "fam_neil_armstrong",
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
    "id": "fam_serena_williams",
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
    "id": "fam_taylor_swift",
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
    "id": "fam_elon_musk",
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
    "id": "fam_marilyn_monroe",
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
    "id": "fam_muhammad_ali",
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
    "id": "fam_frida_kahlo",
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
    "id": "fam_nelson_mandela",
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
    "id": "fam_stephen_hawking",
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
    "id": "fam_walt_disney",
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
    "id": "fam_vincent_van_gogh",
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
    "id": "fam_isaac_newton",
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
    "id": "fam_bob_marley",
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
    "id": "fam_marie_curie",
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
    "id": "fam_lionel_messi",
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
    "id": "fam_abraham_lincoln",
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
    "id": "fam_pablo_picasso",
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
    "id": "fam_oprah_winfrey",
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
    "id": "fam_usain_bolt",
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
    "id": "fam_ludwig_van_beethoven",
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
    "id": "fam_freddie_mercury",
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
    "id": "fam_bill_gates",
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
    "id": "fam_michael_jordan",
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
    "id": "fam_cristiano_ronaldo",
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
    "id": "fam_beyonce",
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
    "id": "fam_jackie_chan",
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
    "id": "fam_bruce_lee",
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
    "id": "fam_charlie_chaplin",
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
    "id": "fam_mahatma_gandhi",
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
    "id": "fam_barack_obama",
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
    "id": "fam_nikola_tesla",
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
    "id": "fam_virat_kohli",
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
    "id": "fam_shah_rukh_khan",
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
    "id": "fam_tom_cruise",
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
    "id": "fam_bts",
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
    "id": "fam_mark_zuckerberg",
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
    "id": "mov_titanic",
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
    "id": "mov_inception",
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
    "id": "mov_harry_potter",
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
    "id": "mov_the_matrix",
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
    "id": "mov_star_wars",
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
    "id": "mov_jurassic_park",
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
    "id": "mov_shrek",
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
    "id": "mov_the_lion_king",
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
    "id": "mov_spider_man",
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
    "id": "mov_batman",
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
    "id": "mov_superman",
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
    "id": "mov_iron_man",
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
    "id": "mov_thor",
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
    "id": "mov_hulk",
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
    "id": "mov_stranger_things",
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
    "id": "mov_finding_nemo",
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
    "id": "mov_breaking_bad",
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
    "id": "mov_avatar",
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
    "id": "mov_the_avengers",
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
    "id": "mov_forrest_gump",
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
    "id": "mov_game_of_thrones",
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
    "id": "mov_interstellar",
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
    "id": "mov_back_to_the_future",
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
    "id": "mov_the_dark_knight",
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
    "id": "mov_the_office",
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
    "id": "mov_toy_story",
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
    "id": "mov_home_alone",
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
    "id": "mov_friends",
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
    "id": "mov_ghostbusters",
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
    "id": "mov_the_lord_of_the_rings",
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
    "id": "mov_jaws",
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
    "id": "mov_monsters_inc",
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
    "id": "mov_squid_game",
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
    "id": "mov_pirates_of_the_caribbean",
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
    "id": "mov_the_godfather",
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
    "id": "mov_frozen",
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
    "id": "mov_up",
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
    "id": "mov_money_heist",
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
    "id": "mov_kung_fu_panda",
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
    "id": "mov_tom_and_jerry",
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
    "id": "mov_naruto",
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
    "id": "mov_one_piece",
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
    "id": "mov_wednesday",
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
    "id": "mov_barbie",
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
    "id": "mov_oppenheimer",
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
    "id": "geo_japan",
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
    "id": "geo_france",
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
    "id": "geo_egypt",
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
    "id": "geo_brazil",
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
    "id": "geo_iceland",
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
    "id": "geo_australia",
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
    "id": "geo_canada",
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
    "id": "geo_italy",
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
    "id": "geo_tokyo",
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
    "id": "geo_paris",
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
    "id": "geo_new_york",
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
    "id": "geo_rome",
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
    "id": "geo_london",
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
    "id": "geo_greece",
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
    "id": "geo_mexico",
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
    "id": "geo_barcelona",
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
    "id": "geo_amsterdam",
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
    "id": "geo_cairo",
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
    "id": "geo_sydney",
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
    "id": "geo_venice",
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
    "id": "geo_switzerland",
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
    "id": "geo_norway",
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
    "id": "geo_thailand",
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
    "id": "geo_south_africa",
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
    "id": "geo_india",
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
    "id": "geo_singapore",
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
    "id": "geo_dubai",
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
    "id": "geo_rio_de_janeiro",
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
    "id": "geo_istanbul",
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
    "id": "geo_san_francisco",
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
    "id": "geo_new_zealand",
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
    "id": "geo_seoul",
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
    "id": "geo_argentina",
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
    "id": "geo_china",
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
    "id": "geo_united_states",
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
    "id": "geo_united_kingdom",
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
    "id": "geo_germany",
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
    "id": "geo_spain",
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
    "id": "geo_south_korea",
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
    "id": "geo_turkey",
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
    "id": "geo_nepal",
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
    "id": "geo_russia",
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
    "id": "geo_bangkok",
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
    "id": "prof_astronaut",
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
    "id": "prof_detective",
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
    "id": "prof_chef",
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
    "id": "prof_firefighter",
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
    "id": "prof_pilot",
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
    "id": "prof_architect",
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
    "id": "prof_surgeon",
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
    "id": "prof_photographer",
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
    "id": "prof_librarian",
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
    "id": "prof_journalist",
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
    "id": "prof_plumber",
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
    "id": "prof_veterinarian",
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
    "id": "prof_judge",
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
    "id": "prof_electrician",
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
    "id": "prof_lifeguard",
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
    "id": "prof_flight_attendant",
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
    "id": "prof_carpenter",
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
    "id": "prof_graphic_designer",
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
    "id": "prof_teacher",
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
    "id": "prof_farmer",
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
    "id": "prof_dentist",
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
    "id": "prof_astronomer",
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
    "id": "prof_barista",
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
    "id": "prof_fisherman",
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
    "id": "prof_mechanic",
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
    "id": "prof_baker",
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
    "id": "prof_florist",
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
    "id": "prof_coach",
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
    "id": "prof_scientist",
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
    "id": "prof_doctor",
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
    "id": "prof_police_officer",
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
    "id": "prof_lawyer",
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
    "id": "prof_nurse",
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
    "id": "prof_engineer",
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
    "id": "prof_barber",
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
    "id": "prof_artist",
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
    "id": "prof_singer",
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
    "id": "prof_actor",
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
    "id": "prof_waiter",
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
    "id": "prof_driver",
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
    "id": "prof_programmer",
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
    "id": "brand_nike",
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
    "id": "brand_apple",
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
    "id": "brand_coca_cola",
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
    "id": "brand_google",
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
    "id": "brand_disney",
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
    "id": "brand_lego",
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
    "id": "brand_spotify",
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
    "id": "brand_netflix",
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
    "id": "brand_nintendo",
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
    "id": "brand_tesla",
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
    "id": "brand_starbucks",
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
    "id": "brand_ikea",
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
    "id": "brand_adidas",
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
    "id": "brand_mcdonalds",
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
    "id": "brand_amazon",
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
    "id": "brand_playstation",
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
    "id": "brand_ferrari",
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
    "id": "brand_samsung",
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
    "id": "brand_rolex",
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
    "id": "brand_gucci",
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
    "id": "brand_microsoft",
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
    "id": "brand_youtube",
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
    "id": "brand_vans",
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
    "id": "brand_puma",
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
    "id": "brand_visa",
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
    "id": "brand_sony",
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
    "id": "brand_red_bull",
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
    "id": "brand_porsche",
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
    "id": "brand_subway",
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
    "id": "brand_audi",
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
    "id": "brand_instagram",
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
    "id": "brand_tiktok",
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
    "id": "brand_whatsapp",
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
    "id": "brand_kfc",
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
    "id": "brand_pepsi",
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
    "id": "brand_toyota",
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
    "id": "brand_bmw",
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
    "id": "brand_mercedes",
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
    "id": "hobby_minecraft",
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
    "id": "hobby_gardening",
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
    "id": "hobby_photography",
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
    "id": "hobby_origami",
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
    "id": "hobby_baking",
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
    "id": "hobby_hiking",
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
    "id": "hobby_painting",
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
    "id": "hobby_yoga",
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
    "id": "hobby_camping",
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
    "id": "hobby_pottery",
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
    "id": "hobby_fishing",
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
    "id": "hobby_bird_watching",
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
    "id": "hobby_knitting",
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
    "id": "hobby_rock_climbing",
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
    "id": "hobby_magic_tricks",
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
    "id": "hobby_woodworking",
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
    "id": "hobby_kite_flying",
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
    "id": "hobby_karaoke",
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
    "id": "hobby_sudoku",
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
    "id": "hobby_roller_skating",
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
    "id": "hobby_snorkeling",
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
    "id": "hobby_board_games",
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
    "id": "hobby_juggling",
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
    "id": "hobby_cooking",
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
    "id": "hobby_drawing",
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
    "id": "hobby_reading",
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
    "id": "hobby_writing",
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
    "id": "hobby_dancing",
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
    "id": "hobby_singing",
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
    "id": "hobby_traveling",
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
    "id": "hobby_cycling",
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
    "id": "hobby_running",
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
    "id": "hobby_gaming",
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
    "id": "hobby_shopping",
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
    "id": "hobby_meditation",
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
    "id": "hobby_stargazing",
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
    "id": "mus_guitar",
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
    "id": "mus_piano",
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
    "id": "mus_drums",
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
    "id": "mus_violin",
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
    "id": "mus_microphone",
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
    "id": "mus_saxophone",
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
    "id": "mus_trumpet",
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
    "id": "mus_harmonica",
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
    "id": "mus_cello",
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
    "id": "mus_vinyl_record",
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
    "id": "mus_flute",
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
    "id": "mus_tambourine",
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
    "id": "mus_ukulele",
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
    "id": "mus_accordion",
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
    "id": "mus_harp",
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
    "id": "mus_bagpipes",
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
    "id": "mus_xylophone",
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
    "id": "mus_bongos",
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
    "id": "mus_jazz",
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
    "id": "mus_hip_hop",
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
    "id": "mus_reggae",
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
    "id": "mus_orchestra",
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
    "id": "mus_sheet_music",
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
    "id": "mus_headset",
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
    "id": "mus_bell",
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
    "id": "mus_whistle",
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
    "id": "mus_speaker",
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
    "id": "mus_concert",
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
    "id": "mus_rock_music",
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
    "id": "mus_pop_music",
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
    "id": "mus_classical_music",
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
    "id": "mus_dj",
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
    "id": "mus_choir",
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
    "id": "mus_opera",
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
    "id": "mus_radio",
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
    "id": "sport_basketball",
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
    "id": "sport_tennis",
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
    "id": "sport_swimming",
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
    "id": "sport_baseball",
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
    "id": "sport_bowling",
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
    "id": "sport_snowboarding",
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
    "id": "sport_volleyball",
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
    "id": "sport_formula_1",
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
    "id": "sport_rugby",
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
    "id": "sport_badminton",
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
    "id": "sport_gymnastics",
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
    "id": "sport_golf",
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
    "id": "sport_ice_hockey",
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
    "id": "sport_cricket",
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
    "id": "sport_boxing",
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
    "id": "sport_table_tennis",
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
    "id": "sport_fencing",
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
    "id": "sport_marathon",
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
    "id": "sport_darts",
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
    "id": "sport_wrestling",
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
    "id": "sport_football",
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
    "id": "sport_chess",
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
    "id": "sport_karate",
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
    "id": "sport_archery",
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
    "id": "sport_surfing",
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
    "id": "sport_skateboarding",
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
    "id": "sport_skiing",
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
    "id": "sport_billiards",
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
    "id": "sport_weightlifting",
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
    "id": "sport_hide_and_seek",
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
    "id": "sport_poker",
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
    "id": "sport_ludo",
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
    "id": "sport_monopoly",
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
    "id": "tech_telescope",
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
    "id": "tech_gravity",
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
    "id": "tech_smartphone",
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
    "id": "tech_drone",
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
    "id": "tech_virtual_reality",
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
    "id": "tech_smartwatch",
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
    "id": "tech_3d_printer",
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
    "id": "tech_satellite",
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
    "id": "tech_microchip",
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
    "id": "tech_bluetooth",
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
    "id": "tech_solar_panel",
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
    "id": "tech_robot",
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
    "id": "tech_artificial_intelligence",
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
    "id": "tech_laser",
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
    "id": "tech_microscope",
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
    "id": "tech_electric_car",
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
    "id": "tech_touchscreen",
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
    "id": "tech_game_console",
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
    "id": "tech_earbuds",
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
    "id": "tech_projector",
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
    "id": "tech_power_bank",
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
    "id": "tech_self_driving_car",
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
    "id": "tech_webcam",
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
    "id": "tech_laptop",
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
    "id": "tech_internet",
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
    "id": "tech_wi_fi",
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
    "id": "tech_battery",
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
    "id": "tech_gps",
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
    "id": "tech_television",
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
    "id": "tech_keyboard",
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
    "id": "tech_computer_mouse",
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
    "id": "tech_usb_drive",
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
    "id": "tech_qr_code",
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
    "id": "tech_email",
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
    "id": "tech_social_media",
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
    "id": "tech_video_game",
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
    "id": "tech_magnet",
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
    "id": "tech_electricity",
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
    "id": "tech_dna",
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
    "id": "tech_vaccine",
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
    "id": "nat_volcano",
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
    "id": "nat_rainbow",
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
    "id": "nat_earthquake",
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
    "id": "nat_lightning",
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
    "id": "nat_waterfall",
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
    "id": "nat_northern_lights",
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
    "id": "nat_glacier",
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
    "id": "nat_coral_reef",
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
    "id": "nat_rainforest",
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
    "id": "nat_cave_system",
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
    "id": "nat_avalanche",
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
    "id": "nat_tsunami",
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
    "id": "nat_tornado",
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
    "id": "nat_meteor_shower",
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
    "id": "nat_oasis",
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
    "id": "nat_hot_spring",
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
    "id": "nat_wildfire",
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
    "id": "nat_iceberg",
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
    "id": "nat_eclipse",
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
    "id": "nat_thunderstorm",
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
    "id": "nat_canyon",
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
    "id": "nat_desert",
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
    "id": "nat_cave",
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
    "id": "nat_island",
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
    "id": "nat_ocean",
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
    "id": "nat_mountain",
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
    "id": "nat_river",
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
    "id": "nat_lake",
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
    "id": "nat_forest",
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
    "id": "nat_beach",
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
    "id": "nat_fog",
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
    "id": "nat_sunrise",
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
    "id": "nat_sunset",
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
    "id": "nat_full_moon",
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
    "id": "nat_snow",
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
    "id": "nat_wind",
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
    "id": "veh_helicopter",
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
    "id": "veh_submarine",
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
    "id": "veh_sailboat",
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
    "id": "veh_hot_air_balloon",
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
    "id": "veh_spaceship",
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
    "id": "veh_bulldozer",
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
    "id": "veh_ambulance",
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
    "id": "veh_jet_ski",
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
    "id": "veh_fire_truck",
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
    "id": "veh_motorcycle",
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
    "id": "veh_yacht",
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
    "id": "veh_tractor",
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
    "id": "veh_airplane",
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
    "id": "veh_cable_car",
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
    "id": "veh_forklift",
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
    "id": "veh_cruise_ship",
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
    "id": "veh_go_kart",
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
    "id": "veh_delivery_van",
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
    "id": "veh_camper_van",
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
    "id": "veh_double_decker_bus",
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
    "id": "veh_kayak",
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
    "id": "veh_car",
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
    "id": "veh_bus",
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
    "id": "veh_train",
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
    "id": "veh_bicycle",
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
    "id": "veh_rocket",
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
    "id": "veh_police_car",
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
    "id": "veh_taxi",
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
    "id": "veh_truck",
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
    "id": "veh_scooter",
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
    "id": "veh_metro_train",
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
    "id": "veh_school_bus",
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
    "id": "veh_rickshaw",
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
    "id": "veh_speedboat",
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
    "id": "veh_tram",
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
    "id": "land_eiffel_tower",
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
    "id": "land_statue_of_liberty",
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
    "id": "land_great_wall_of_china",
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
    "id": "land_colosseum",
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
    "id": "land_pyramids_of_giza",
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
    "id": "land_taj_mahal",
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
    "id": "land_machu_picchu",
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
    "id": "land_big_ben",
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
    "id": "land_golden_gate_bridge",
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
    "id": "land_christ_the_redeemer",
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
    "id": "land_sydney_opera_house",
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
    "id": "land_leaning_tower_of_pisa",
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
    "id": "land_petra",
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
    "id": "land_stonehenge",
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
    "id": "land_mount_everest",
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
    "id": "land_louvre_museum",
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
    "id": "land_times_square",
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
    "id": "land_burj_khalifa",
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
    "id": "land_empire_state_building",
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
    "id": "land_niagara_falls",
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
    "id": "land_mount_fuji",
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
    "id": "land_angkor_wat",
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
    "id": "land_chichen_itza",
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
    "id": "land_notre_dame",
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
    "id": "land_sagrada_familia",
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
    "id": "land_tower_bridge",
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
    "id": "land_hollywood_sign",
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
    "id": "land_vatican_city",
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
    "id": "land_versailles_palace",
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
    "id": "land_mount_rushmore",
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
    "id": "land_grand_canyon",
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
    "id": "land_disneyland",
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
    "id": "land_sahara_desert",
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
    "id": "land_amazon_rainforest",
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
    "id": "land_great_barrier_reef",
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
    "id": "land_white_house",
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
    "id": "land_buckingham_palace",
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
    "id": "land_santorini",
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

/**
 * Assigns unique, non-repeating single-word hints to every imposter for a given word.
 * In a game with up to 3 imposters, each imposter receives a distinct single-word hint
 * drawn from the curated 3-item array for the selected difficulty level.
 */
export function assignUniqueImposterHints(
  wordEntry: WordEntry,
  imposterIds: readonly string[],
  difficulty: HintDifficulty,
  source?: RandomSource
): Record<string, string> {
  const result: Record<string, string> = {};

  if (difficulty === 'none' || !wordEntry.hints) {
    // No-hint mode: imposters receive no hint
    for (const id of imposterIds) {
      result[id] = '';
    }
    return result;
  }

  const difficultyLevel = difficulty === 'easy' ? 'easy' : difficulty === 'balanced' ? 'balanced' : 'subtle';
  const availableHints = [...wordEntry.hints[difficultyLevel]];

  // Securely shuffle available hints
  const shuffledHints = secureShuffle(availableHints, source);

  // Assign without replacement for up to 3 imposters
  imposterIds.forEach((id, index) => {
    result[id] = shuffledHints[index % shuffledHints.length];
  });

  return result;
}
