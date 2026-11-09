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
 * Each of the 548 words has 9 handcrafted single-word hints (3 per difficulty) guaranteeing that
 * up to 3 imposters in any match receive distinct hints without repetition.
 */
export const HINT_SUPPORTED_WORDS: WordEntry[] = [
  {
    id: 'obj_umbrella',
    word: "Umbrella",
    categoryId: 'everyday_objects',
    categoryName: "Everyday Objects",
    hints: {
      subtle: ["Storm", "Shelter", "Drizzle"],
      balanced: ["Raincoat", "Canopy", "Puddle"],
      easy: ["Downpour", "Waterproof", "Drops"]
    }
  },
  {
    id: 'obj_toothbrush',
    word: "Toothbrush",
    categoryId: 'everyday_objects',
    categoryName: "Everyday Objects",
    hints: {
      subtle: ["Morning", "Bathroom", "Routine"],
      balanced: ["Mouthwash", "Bristles", "Dentist"],
      easy: ["Toothpaste", "Smile", "Clean"]
    }
  },
  {
    id: 'obj_backpack',
    word: "Backpack",
    categoryId: 'everyday_objects',
    categoryName: "Everyday Objects",
    hints: {
      subtle: ["Journey", "Travel", "Hiking"],
      balanced: ["Zipper", "Shoulder", "Straps"],
      easy: ["Books", "School", "Bag"]
    }
  },
  {
    id: 'obj_sunglasses',
    word: "Sunglasses",
    categoryId: 'everyday_objects',
    categoryName: "Everyday Objects",
    hints: {
      subtle: ["Horizon", "Afternoon", "Glare"],
      balanced: ["Beach", "Lenses", "Shades"],
      easy: ["Summer", "Sunlight", "Dark"]
    }
  },
  {
    id: 'obj_headphones',
    word: "Headphones",
    categoryId: 'everyday_objects',
    categoryName: "Everyday Objects",
    hints: {
      subtle: ["Travel", "Commute", "Volume"],
      balanced: ["Podcast", "Beats", "Sound"],
      easy: ["Music", "Ears", "Audio"]
    }
  },
  {
    id: 'obj_flashlight',
    word: "Flashlight",
    categoryId: 'everyday_objects',
    categoryName: "Everyday Objects",
    hints: {
      subtle: ["Night", "Darkness", "Outage"],
      balanced: ["Battery", "Handheld", "Beam"],
      easy: ["Torch", "Glow", "Shine"]
    }
  },
  {
    id: 'obj_mirror',
    word: "Mirror",
    categoryId: 'everyday_objects',
    categoryName: "Everyday Objects",
    hints: {
      subtle: ["Vanity", "Wall", "Glass"],
      balanced: ["Look", "Appearance", "Silver"],
      easy: ["Reflection", "Face", "Reverse"]
    }
  },
  {
    id: 'obj_wallet',
    word: "Wallet",
    categoryId: 'everyday_objects',
    categoryName: "Everyday Objects",
    hints: {
      subtle: ["Pocket", "Leather", "Purchase"],
      balanced: ["Receipts", "Cards", "Coins"],
      easy: ["Money", "Cash", "Pay"]
    }
  },
  {
    id: 'obj_alarm_clock',
    word: "Alarm Clock",
    categoryId: 'everyday_objects',
    categoryName: "Everyday Objects",
    hints: {
      subtle: ["Dawn", "Bedside", "Ticking"],
      balanced: ["Snooze", "Morning", "Ringtone"],
      easy: ["Wakeup", "Early", "Buzzer"]
    }
  },
  {
    id: 'obj_scissors',
    word: "Scissors",
    categoryId: 'everyday_objects',
    categoryName: "Everyday Objects",
    hints: {
      subtle: ["Crafts", "Barber", "Ribbon"],
      balanced: ["Snip", "Blades", "Handles"],
      easy: ["Cut", "Paper", "Sharp"]
    }
  },
  {
    id: 'obj_pillow',
    word: "Pillow",
    categoryId: 'everyday_objects',
    categoryName: "Everyday Objects",
    hints: {
      subtle: ["Rest", "Dream", "Bed"],
      balanced: ["Feathers", "Cushion", "Cotton"],
      easy: ["Sleep", "Soft", "Head"]
    }
  },
  {
    id: 'obj_hammer',
    word: "Hammer",
    categoryId: 'everyday_objects',
    categoryName: "Everyday Objects",
    hints: {
      subtle: ["Toolbox", "Workbench", "Construction"],
      balanced: ["Wood", "Steel", "Handle"],
      easy: ["Nail", "Pound", "Hit"]
    }
  },
  {
    id: 'obj_candle',
    word: "Candle",
    categoryId: 'everyday_objects',
    categoryName: "Everyday Objects",
    hints: {
      subtle: ["Dinner", "Scent", "Warmth"],
      balanced: ["Wick", "Wax", "Melt"],
      easy: ["Flame", "Fire", "Light"]
    }
  },
  {
    id: 'obj_keychain',
    word: "Keychain",
    categoryId: 'everyday_objects',
    categoryName: "Everyday Objects",
    hints: {
      subtle: ["Pocket", "Brass", "Jingle"],
      balanced: ["Metal", "Ring", "Holder"],
      easy: ["Keys", "Door", "Lock"]
    }
  },
  {
    id: 'obj_blender',
    word: "Blender",
    categoryId: 'everyday_objects',
    categoryName: "Everyday Objects",
    hints: {
      subtle: ["Kitchen", "Counter", "Whirring"],
      balanced: ["Puree", "Crush", "Pitcher"],
      easy: ["Smoothie", "Mixer", "Juice"]
    }
  },
  {
    id: 'obj_coffee_mug',
    word: "Coffee Mug",
    categoryId: 'everyday_objects',
    categoryName: "Everyday Objects",
    hints: {
      subtle: ["Morning", "Desk", "Warmth"],
      balanced: ["Ceramic", "Handle", "Sip"],
      easy: ["Brew", "Tea", "Cup"]
    }
  },
  {
    id: 'obj_wristwatch',
    word: "Wristwatch",
    categoryId: 'everyday_objects',
    categoryName: "Everyday Objects",
    hints: {
      subtle: ["Strap", "Tick", "Minutes"],
      balanced: ["Dial", "Hands", "Arm"],
      easy: ["Clock", "Time", "Hour"]
    }
  },
  {
    id: 'obj_water_bottle',
    word: "Water Bottle",
    categoryId: 'everyday_objects',
    categoryName: "Everyday Objects",
    hints: {
      subtle: ["Gym", "Thirst", "Plastic"],
      balanced: ["Hydrate", "Cap", "Refill"],
      easy: ["Liquid", "Drink", "Flask"]
    }
  },
  {
    id: 'obj_stapler',
    word: "Stapler",
    categoryId: 'everyday_objects',
    categoryName: "Everyday Objects",
    hints: {
      subtle: ["Office", "Desk", "Fasten"],
      balanced: ["Metal", "Bind", "Press"],
      easy: ["Paper", "Staples", "Sheets"]
    }
  },
  {
    id: 'obj_notebook',
    word: "Notebook",
    categoryId: 'everyday_objects',
    categoryName: "Everyday Objects",
    hints: {
      subtle: ["Thoughts", "Diary", "Student"],
      balanced: ["Spiral", "Pages", "Pen"],
      easy: ["Write", "Paper", "Notes"]
    }
  },
  {
    id: 'obj_blanket',
    word: "Blanket",
    categoryId: 'everyday_objects',
    categoryName: "Everyday Objects",
    hints: {
      subtle: ["Winter", "Cozy", "Couch"],
      balanced: ["Fleece", "Warmth", "Wrap"],
      easy: ["Bed", "Cover", "Sleep"]
    }
  },
  {
    id: 'obj_luggage',
    word: "Luggage",
    categoryId: 'everyday_objects',
    categoryName: "Everyday Objects",
    hints: {
      subtle: ["Packing", "Journey", "Vacation"],
      balanced: ["Wheels", "Handle", "Trip"],
      easy: ["Suitcase", "Airport", "Travel"]
    }
  },
  {
    id: 'obj_towel',
    word: "Towel",
    categoryId: 'everyday_objects',
    categoryName: "Everyday Objects",
    hints: {
      subtle: ["Cotton", "Pool", "Fabric"],
      balanced: ["Bathroom", "Shower", "Cloth"],
      easy: ["Dry", "Wet", "Bath"]
    }
  },
  {
    id: 'obj_hairbrush',
    word: "Hairbrush",
    categoryId: 'everyday_objects',
    categoryName: "Everyday Objects",
    hints: {
      subtle: ["Morning", "Mirror", "Tangle"],
      balanced: ["Handle", "Groom", "Bristles"],
      easy: ["Hair", "Comb", "Head"]
    }
  },
  {
    id: 'obj_doorbell',
    word: "Doorbell",
    categoryId: 'everyday_objects',
    categoryName: "Everyday Objects",
    hints: {
      subtle: ["Visitor", "Entrance", "Chime"],
      balanced: ["Button", "Ring", "Porch"],
      easy: ["Door", "Ding", "Guest"]
    }
  },
  {
    id: 'obj_teapot',
    word: "Teapot",
    categoryId: 'everyday_objects',
    categoryName: "Everyday Objects",
    hints: {
      subtle: ["Afternoon", "Porcelain", "Warm"],
      balanced: ["Spout", "Leaves", "Steam"],
      easy: ["Tea", "Boil", "Cup"]
    }
  },
  {
    id: 'obj_screwdriver',
    word: "Screwdriver",
    categoryId: 'everyday_objects',
    categoryName: "Everyday Objects",
    hints: {
      subtle: ["Toolbox", "Repair", "Workbench"],
      balanced: ["Handle", "Twist", "Steel"],
      easy: ["Fasten", "Turn", "Tighten"]
    }
  },
  {
    id: 'obj_thermos',
    word: "Thermos",
    categoryId: 'everyday_objects',
    categoryName: "Everyday Objects",
    hints: {
      subtle: ["Commute", "Winter", "Flask"],
      balanced: ["Insulated", "Warm", "Steel"],
      easy: ["Hot", "Soup", "Coffee"]
    }
  },
  {
    id: 'obj_curtain',
    word: "Curtain",
    categoryId: 'everyday_objects',
    categoryName: "Everyday Objects",
    hints: {
      subtle: ["Sunlight", "Fabric", "Room"],
      balanced: ["Drape", "Rod", "Privacy"],
      easy: ["Window", "Close", "Shade"]
    }
  },
  {
    id: 'obj_sponge',
    word: "Sponge",
    categoryId: 'everyday_objects',
    categoryName: "Everyday Objects",
    hints: {
      subtle: ["Kitchen", "Yellow", "Soapy"],
      balanced: ["Absorb", "Foam", "Scrub"],
      easy: ["Dishes", "Wash", "Clean"]
    }
  },
  {
    id: 'obj_calculator',
    word: "Calculator",
    categoryId: 'everyday_objects',
    categoryName: "Everyday Objects",
    hints: {
      subtle: ["Math", "Office", "Student"],
      balanced: ["Buttons", "Digits", "Solve"],
      easy: ["Numbers", "Count", "Screen"]
    }
  },
  {
    id: 'obj_compass',
    word: "Compass",
    categoryId: 'everyday_objects',
    categoryName: "Everyday Objects",
    hints: {
      subtle: ["Hiking", "Explorer", "Map"],
      balanced: ["Needle", "Direction", "Magnetic"],
      easy: ["North", "Navigate", "Lost"]
    }
  },
  {
    id: 'obj_lighter',
    word: "Lighter",
    categoryId: 'everyday_objects',
    categoryName: "Everyday Objects",
    hints: {
      subtle: ["Pocket", "Thumb", "Spark"],
      balanced: ["Flint", "Gas", "Click"],
      easy: ["Flame", "Fire", "Burn"]
    }
  },
  {
    id: 'obj_broom',
    word: "Broom",
    categoryId: 'everyday_objects',
    categoryName: "Everyday Objects",
    hints: {
      subtle: ["Corner", "Handle", "Floor"],
      balanced: ["Straw", "Dustpan", "Bristles"],
      easy: ["Sweep", "Dust", "Clean"]
    }
  },
  {
    id: 'obj_padlock',
    word: "Padlock",
    categoryId: 'everyday_objects',
    categoryName: "Everyday Objects",
    hints: {
      subtle: ["Security", "Chain", "Locker"],
      balanced: ["Shackle", "Brass", "Steel"],
      easy: ["Key", "Lock", "Safe"]
    }
  },
  {
    id: 'food_pizza',
    word: "Pizza",
    categoryId: 'food_drinks',
    categoryName: "Food & Drinks",
    hints: {
      subtle: ["Delivery", "Slice", "Cardboard"],
      balanced: ["Crust", "Pepperoni", "Mozzarella"],
      easy: ["Oven", "Topping", "Italian"]
    }
  },
  {
    id: 'food_sushi',
    word: "Sushi",
    categoryId: 'food_drinks',
    categoryName: "Food & Drinks",
    hints: {
      subtle: ["Chopsticks", "Rolls", "Ginger"],
      balanced: ["Seaweed", "Rice", "Wasabi"],
      easy: ["Salmon", "Raw", "Japanese"]
    }
  },
  {
    id: 'food_croissant',
    word: "Croissant",
    categoryId: 'food_drinks',
    categoryName: "Food & Drinks",
    hints: {
      subtle: ["Breakfast", "Morning", "Layers"],
      balanced: ["Butter", "Flaky", "Crescent"],
      easy: ["Bakery", "Pastry", "French"]
    }
  },
  {
    id: 'food_burger',
    word: "Burger",
    categoryId: 'food_drinks',
    categoryName: "Food & Drinks",
    hints: {
      subtle: ["Fastfood", "Grill", "Sesame"],
      balanced: ["Patty", "Lettuce", "Pickle"],
      easy: ["Bun", "Beef", "Ketchup"]
    }
  },
  {
    id: 'food_taco',
    word: "Taco",
    categoryId: 'food_drinks',
    categoryName: "Food & Drinks",
    hints: {
      subtle: ["Street", "Lime", "Tuesday"],
      balanced: ["Shell", "Salsa", "Cilantro"],
      easy: ["Tortilla", "Mexican", "Filling"]
    }
  },
  {
    id: 'food_coffee',
    word: "Coffee",
    categoryId: 'food_drinks',
    categoryName: "Food & Drinks",
    hints: {
      subtle: ["Morning", "Roasted", "Energy"],
      balanced: ["Beans", "Caffeine", "Mug"],
      easy: ["Brew", "Cup", "Drink"]
    }
  },
  {
    id: 'food_ramen',
    word: "Ramen",
    categoryId: 'food_drinks',
    categoryName: "Food & Drinks",
    hints: {
      subtle: ["Steam", "College", "Slurp"],
      balanced: ["Broth", "Chopsticks", "Noodles"],
      easy: ["Bowl", "Soup", "Japanese"]
    }
  },
  {
    id: 'food_ice_cream',
    word: "Ice Cream",
    categoryId: 'food_drinks',
    categoryName: "Food & Drinks",
    hints: {
      subtle: ["Summer", "Sweet", "Scoop"],
      balanced: ["Cone", "Vanilla", "Sundae"],
      easy: ["Freeze", "Melt", "Dessert"]
    }
  },
  {
    id: 'food_waffles',
    word: "Waffles",
    categoryId: 'food_drinks',
    categoryName: "Food & Drinks",
    hints: {
      subtle: ["Breakfast", "Grid", "Iron"],
      balanced: ["Batter", "Syrup", "Crisp"],
      easy: ["Honey", "Brunch", "Plate"]
    }
  },
  {
    id: 'food_popcorn',
    word: "Popcorn",
    categoryId: 'food_drinks',
    categoryName: "Food & Drinks",
    hints: {
      subtle: ["Kernels", "Movie", "Cinema"],
      balanced: ["Butter", "Microwave", "Salty"],
      easy: ["Snack", "Popped", "Bucket"]
    }
  },
  {
    id: 'food_donut',
    word: "Donut",
    categoryId: 'food_drinks',
    categoryName: "Food & Drinks",
    hints: {
      subtle: ["Coffee", "Round", "Glaze"],
      balanced: ["Sprinkles", "Hole", "Bakery"],
      easy: ["Fried", "Dough", "Sweet"]
    }
  },
  {
    id: 'food_cheesecake',
    word: "Cheesecake",
    categoryId: 'food_drinks',
    categoryName: "Food & Drinks",
    hints: {
      subtle: ["Rich", "Slice", "Graham"],
      balanced: ["Creamy", "Crust", "Berries"],
      easy: ["Dairy", "Dessert", "Cake"]
    }
  },
  {
    id: 'food_lemonade',
    word: "Lemonade",
    categoryId: 'food_drinks',
    categoryName: "Food & Drinks",
    hints: {
      subtle: ["Stand", "Refreshing", "Summer"],
      balanced: ["Citrus", "Pitcher", "Sweet"],
      easy: ["Sour", "Yellow", "Juice"]
    }
  },
  {
    id: 'food_chocolate',
    word: "Chocolate",
    categoryId: 'food_drinks',
    categoryName: "Food & Drinks",
    hints: {
      subtle: ["Cocoa", "Wrapped", "Sweet"],
      balanced: ["Bar", "Dark", "Milk"],
      easy: ["Candy", "Melt", "Dessert"]
    }
  },
  {
    id: 'food_spaghetti',
    word: "Spaghetti",
    categoryId: 'food_drinks',
    categoryName: "Food & Drinks",
    hints: {
      subtle: ["Twirl", "Fork", "Long"],
      balanced: ["Meatball", "Marinara", "Tomato"],
      easy: ["Pasta", "Noodles", "Italian"]
    }
  },
  {
    id: 'food_cappuccino',
    word: "Cappuccino",
    categoryId: 'food_drinks',
    categoryName: "Food & Drinks",
    hints: {
      subtle: ["Morning", "Barista", "Steam"],
      balanced: ["Foam", "Espresso", "Cinnamon"],
      easy: ["Coffee", "Cup", "Mug"]
    }
  },
  {
    id: 'food_guacamole',
    word: "Guacamole",
    categoryId: 'food_drinks',
    categoryName: "Food & Drinks",
    hints: {
      subtle: ["Dip", "Green", "Bowl"],
      balanced: ["Avocado", "Lime", "Cilantro"],
      easy: ["Chips", "Salsa", "Mexican"]
    }
  },
  {
    id: 'food_smoothie',
    word: "Smoothie",
    categoryId: 'food_drinks',
    categoryName: "Food & Drinks",
    hints: {
      subtle: ["Blender", "Straw", "Thick"],
      balanced: ["Fruit", "Yogurt", "Berries"],
      easy: ["Drink", "Cold", "Juice"]
    }
  },
  {
    id: 'food_bagel',
    word: "Bagel",
    categoryId: 'food_drinks',
    categoryName: "Food & Drinks",
    hints: {
      subtle: ["Breakfast", "Round", "Chewy"],
      balanced: ["Toasted", "Hole", "Salmon"],
      easy: ["Cream", "Bread", "Bakery"]
    }
  },
  {
    id: 'food_pancakes',
    word: "Pancakes",
    categoryId: 'food_drinks',
    categoryName: "Food & Drinks",
    hints: {
      subtle: ["Sunday", "Stack", "Griddle"],
      balanced: ["Batter", "Syrup", "Butter"],
      easy: ["Breakfast", "Flat", "Plate"]
    }
  },
  {
    id: 'food_lasagna',
    word: "Lasagna",
    categoryId: 'food_drinks',
    categoryName: "Food & Drinks",
    hints: {
      subtle: ["Oven", "Tray", "Layers"],
      balanced: ["Ricotta", "Marinara", "Meat"],
      easy: ["Pasta", "Cheese", "Italian"]
    }
  },
  {
    id: 'food_french_fries',
    word: "French Fries",
    categoryId: 'food_drinks',
    categoryName: "Food & Drinks",
    hints: {
      subtle: ["Fastfood", "Salty", "Side"],
      balanced: ["Potato", "Crispy", "Ketchup"],
      easy: ["Golden", "Fried", "Snack"]
    }
  },
  {
    id: 'food_brownie',
    word: "Brownie",
    categoryId: 'food_drinks',
    categoryName: "Food & Drinks",
    hints: {
      subtle: ["Square", "Fudge", "Warm"],
      balanced: ["Cocoa", "Walnuts", "Rich"],
      easy: ["Chocolate", "Baked", "Dessert"]
    }
  },
  {
    id: 'food_espresso',
    word: "Espresso",
    categoryId: 'food_drinks',
    categoryName: "Food & Drinks",
    hints: {
      subtle: ["Shot", "Energy", "Dark"],
      balanced: ["Crema", "Roasted", "Barista"],
      easy: ["Coffee", "Strong", "Small"]
    }
  },
  {
    id: 'food_hot_chocolate',
    word: "Hot Chocolate",
    categoryId: 'food_drinks',
    categoryName: "Food & Drinks",
    hints: {
      subtle: ["Winter", "Warm", "Mug"],
      balanced: ["Marshmallow", "Cocoa", "Sweet"],
      easy: ["Milk", "Drink", "Cream"]
    }
  },
  {
    id: 'food_burrito',
    word: "Burrito",
    categoryId: 'food_drinks',
    categoryName: "Food & Drinks",
    hints: {
      subtle: ["Foil", "Rolled", "Heavy"],
      balanced: ["Beans", "Rice", "Salsa"],
      easy: ["Tortilla", "Wrap", "Mexican"]
    }
  },
  {
    id: 'food_dumplings',
    word: "Dumplings",
    categoryId: 'food_drinks',
    categoryName: "Food & Drinks",
    hints: {
      subtle: ["Steam", "Bamboo", "Folded"],
      balanced: ["Dough", "Dipping", "Pork"],
      easy: ["Asian", "Filling", "Steamed"]
    }
  },
  {
    id: 'food_steak',
    word: "Steak",
    categoryId: 'food_drinks',
    categoryName: "Food & Drinks",
    hints: {
      subtle: ["Sizzle", "Grill", "Knife"],
      balanced: ["Rare", "Sirloin", "Pepper"],
      easy: ["Meat", "Beef", "Dinner"]
    }
  },
  {
    id: 'food_apple_pie',
    word: "Apple Pie",
    categoryId: 'food_drinks',
    categoryName: "Food & Drinks",
    hints: {
      subtle: ["Autumn", "Crust", "Cinnamon"],
      balanced: ["Baked", "Slice", "Golden"],
      easy: ["Fruit", "Dessert", "Sweet"]
    }
  },
  {
    id: 'food_cupcake',
    word: "Cupcake",
    categoryId: 'food_drinks',
    categoryName: "Food & Drinks",
    hints: {
      subtle: ["Birthday", "Wrapper", "Party"],
      balanced: ["Frosting", "Sprinkles", "Vanilla"],
      easy: ["Sweet", "Miniature", "Bakery"]
    }
  },
  {
    id: 'food_pretzel',
    word: "Pretzel",
    categoryId: 'food_drinks',
    categoryName: "Food & Drinks",
    hints: {
      subtle: ["Knot", "Salty", "Twisted"],
      balanced: ["Mustard", "Baked", "Brown"],
      easy: ["Dough", "Snack", "Beer"]
    }
  },
  {
    id: 'food_milkshake',
    word: "Milkshake",
    categoryId: 'food_drinks',
    categoryName: "Food & Drinks",
    hints: {
      subtle: ["Diner", "Straw", "Tall"],
      balanced: ["Malt", "Whipped", "Vanilla"],
      easy: ["Cold", "Sweet", "Drink"]
    }
  },
  {
    id: 'food_nachos',
    word: "Nachos",
    categoryId: 'food_drinks',
    categoryName: "Food & Drinks",
    hints: {
      subtle: ["Cinema", "Sharing", "Platter"],
      balanced: ["Jalapeno", "Salsa", "Melted"],
      easy: ["Chips", "Cheese", "Snack"]
    }
  },
  {
    id: 'food_churro',
    word: "Churro",
    categoryId: 'food_drinks',
    categoryName: "Food & Drinks",
    hints: {
      subtle: ["Carnival", "Long", "Fluted"],
      balanced: ["Cinnamon", "Sugar", "Fried"],
      easy: ["Dip", "Dough", "Sweet"]
    }
  },
  {
    id: 'food_fondue',
    word: "Fondue",
    categoryId: 'food_drinks',
    categoryName: "Food & Drinks",
    hints: {
      subtle: ["Alpine", "Skewer", "Dip"],
      balanced: ["Melted", "Swiss", "Pot"],
      easy: ["Cheese", "Warm", "Bread"]
    }
  },
  {
    id: 'food_falafel',
    word: "Falafel",
    categoryId: 'food_drinks',
    categoryName: "Food & Drinks",
    hints: {
      subtle: ["Pita", "Street", "Tahini"],
      balanced: ["Chickpeas", "Herb", "Fried"],
      easy: ["Ball", "Middle", "Vegetarian"]
    }
  },
  {
    id: 'food_omelet',
    word: "Omelet",
    categoryId: 'food_drinks',
    categoryName: "Food & Drinks",
    hints: {
      subtle: ["Breakfast", "Skillet", "Folded"],
      balanced: ["Whisk", "Mushrooms", "Cheesy"],
      easy: ["Egg", "Pan", "Morning"]
    }
  },
  {
    id: 'anim_penguin',
    word: "Penguin",
    categoryId: 'animals',
    categoryName: "Animals",
    hints: {
      subtle: ["Tuxedo", "Antarctica", "Waddle"],
      balanced: ["Flippers", "Iceberg", "Feathers"],
      easy: ["Beak", "Slide", "Bird"]
    }
  },
  {
    id: 'anim_kangaroo',
    word: "Kangaroo",
    categoryId: 'animals',
    categoryName: "Animals",
    hints: {
      subtle: ["Outback", "Joey", "Boxing"],
      balanced: ["Pouch", "Bounce", "Australia"],
      easy: ["Hop", "Tail", "Marsupial"]
    }
  },
  {
    id: 'anim_dolphin',
    word: "Dolphin",
    categoryId: 'animals',
    categoryName: "Animals",
    hints: {
      subtle: ["Pod", "Sonar", "Playful"],
      balanced: ["Blowhole", "Flippers", "Ocean"],
      easy: ["Swim", "Bottle", "Whistle"]
    }
  },
  {
    id: 'anim_owl',
    word: "Owl",
    categoryId: 'animals',
    categoryName: "Animals",
    hints: {
      subtle: ["Barn", "Silent", "Wisdom"],
      balanced: ["Nocturnal", "Hoot", "Talons"],
      easy: ["Feathers", "Wings", "Bird"]
    }
  },
  {
    id: 'anim_giraffe',
    word: "Giraffe",
    categoryId: 'animals',
    categoryName: "Animals",
    hints: {
      subtle: ["Savannah", "Spots", "Acacia"],
      balanced: ["Leaves", "Tallest", "Tongue"],
      easy: ["Neck", "Legs", "Africa"]
    }
  },
  {
    id: 'anim_octopus',
    word: "Octopus",
    categoryId: 'animals',
    categoryName: "Animals",
    hints: {
      subtle: ["Ink", "Coral", "Clever"],
      balanced: ["Tentacles", "Suction", "Camouflage"],
      easy: ["Eight", "Ocean", "Mollusk"]
    }
  },
  {
    id: 'anim_elephant',
    word: "Elephant",
    categoryId: 'animals',
    categoryName: "Animals",
    hints: {
      subtle: ["Memory", "Ivory", "Herd"],
      balanced: ["Tusks", "Ears", "Huge"],
      easy: ["Trunk", "Stomp", "Grey"]
    }
  },
  {
    id: 'anim_cheetah',
    word: "Cheetah",
    categoryId: 'animals',
    categoryName: "Animals",
    hints: {
      subtle: ["Sprint", "Savannah", "Tears"],
      balanced: ["Fastest", "Spots", "Chase"],
      easy: ["Speed", "Feline", "Claws"]
    }
  },
  {
    id: 'anim_panda',
    word: "Panda",
    categoryId: 'animals',
    categoryName: "Animals",
    hints: {
      subtle: ["Sichuan", "Lazy", "Gentle"],
      balanced: ["Bamboo", "China", "Fur"],
      easy: ["Black", "White", "Climb"]
    }
  },
  {
    id: 'anim_wolf',
    word: "Wolf",
    categoryId: 'animals',
    categoryName: "Animals",
    hints: {
      subtle: ["Moon", "Alpha", "Wilderness"],
      balanced: ["Pack", "Howl", "Canine"],
      easy: ["Fang", "Fur", "Forest"]
    }
  },
  {
    id: 'anim_chameleon',
    word: "Chameleon",
    categoryId: 'animals',
    categoryName: "Animals",
    hints: {
      subtle: ["Blends", "Branch", "Patience"],
      balanced: ["Color", "Tongue", "Reptile"],
      easy: ["Lizard", "Eyes", "Tail"]
    }
  },
  {
    id: 'anim_flamingo',
    word: "Flamingo",
    categoryId: 'animals',
    categoryName: "Animals",
    hints: {
      subtle: ["Balance", "Lagoon", "Flock"],
      balanced: ["Pink", "Wading", "Beak"],
      easy: ["Feathers", "Legs", "Bird"]
    }
  },
  {
    id: 'anim_koala',
    word: "Koala",
    categoryId: 'animals',
    categoryName: "Animals",
    hints: {
      subtle: ["Sleepy", "Canopy", "Branch"],
      balanced: ["Eucalyptus", "Pouch", "Australia"],
      easy: ["Claws", "Furry", "Ears"]
    }
  },
  {
    id: 'anim_platypus',
    word: "Platypus",
    categoryId: 'animals',
    categoryName: "Animals",
    hints: {
      subtle: ["Burrow", "Creek", "Venom"],
      balanced: ["Bill", "Eggs", "Australia"],
      easy: ["Webbed", "Tail", "Swim"]
    }
  },
  {
    id: 'anim_gorilla',
    word: "Gorilla",
    categoryId: 'animals',
    categoryName: "Animals",
    hints: {
      subtle: ["Silverback", "Jungle", "Chest"],
      balanced: ["Troop", "Knuckles", "Strong"],
      easy: ["Primate", "Ape", "Black"]
    }
  },
  {
    id: 'anim_sloth',
    word: "Sloth",
    categoryId: 'animals',
    categoryName: "Animals",
    hints: {
      subtle: ["Slow", "Canopy", "Algae"],
      balanced: ["Hanging", "Claws", "Lazy"],
      easy: ["Sleep", "Tree", "Fur"]
    }
  },
  {
    id: 'anim_hedgehog',
    word: "Hedgehog",
    categoryId: 'animals',
    categoryName: "Animals",
    hints: {
      subtle: ["Garden", "Nocturnal", "Snout"],
      balanced: ["Spines", "Quills", "Curl"],
      easy: ["Sharp", "Ball", "Small"]
    }
  },
  {
    id: 'anim_bald_eagle',
    word: "Bald Eagle",
    categoryId: 'animals',
    categoryName: "Animals",
    hints: {
      subtle: ["Symbol", "River", "Nest"],
      balanced: ["Talons", "Soar", "Raptor"],
      easy: ["Feathers", "Wings", "Beak"]
    }
  },
  {
    id: 'anim_tiger',
    word: "Tiger",
    categoryId: 'animals',
    categoryName: "Animals",
    hints: {
      subtle: ["Jungle", "Bengal", "Solitary"],
      balanced: ["Stripes", "Orange", "Roar"],
      easy: ["Paws", "Feline", "Fangs"]
    }
  },
  {
    id: 'anim_sea_turtle',
    word: "Sea Turtle",
    categoryId: 'animals',
    categoryName: "Animals",
    hints: {
      subtle: ["Reef", "Navigation", "Ancient"],
      balanced: ["Shell", "Flippers", "Beach"],
      easy: ["Ocean", "Swim", "Reptile"]
    }
  },
  {
    id: 'anim_zebra',
    word: "Zebra",
    categoryId: 'animals',
    categoryName: "Animals",
    hints: {
      subtle: ["Savannah", "Flies", "Gallop"],
      balanced: ["Stripes", "Herd", "Mane"],
      easy: ["Black", "White", "Hooves"]
    }
  },
  {
    id: 'anim_walrus',
    word: "Walrus",
    categoryId: 'animals',
    categoryName: "Animals",
    hints: {
      subtle: ["Arctic", "Blubber", "Floe"],
      balanced: ["Tusks", "Whiskers", "Flippers"],
      easy: ["Heavy", "Ice", "Ocean"]
    }
  },
  {
    id: 'anim_polar_bear',
    word: "Polar Bear",
    categoryId: 'animals',
    categoryName: "Animals",
    hints: {
      subtle: ["Arctic", "Blubber", "Seals"],
      balanced: ["White", "Iceberg", "Paws"],
      easy: ["Snow", "Cold", "Swim"]
    }
  },
  {
    id: 'anim_otter',
    word: "Otter",
    categoryId: 'animals',
    categoryName: "Animals",
    hints: {
      subtle: ["Stream", "Playful", "Shellfish"],
      balanced: ["Floating", "Whiskers", "Fur"],
      easy: ["Swim", "Paws", "River"]
    }
  },
  {
    id: 'anim_rhinoceros',
    word: "Rhinoceros",
    categoryId: 'animals',
    categoryName: "Animals",
    hints: {
      subtle: ["Mud", "Charge", "Poaching"],
      balanced: ["Armor", "Heavy", "Savannah"],
      easy: ["Horn", "Grey", "Herbivore"]
    }
  },
  {
    id: 'anim_parrot',
    word: "Parrot",
    categoryId: 'animals',
    categoryName: "Animals",
    hints: {
      subtle: ["Perch", "Jungle", "Pirate"],
      balanced: ["Mimic", "Feathers", "Beak"],
      easy: ["Talk", "Wings", "Bird"]
    }
  },
  {
    id: 'anim_hippopotamus',
    word: "Hippopotamus",
    categoryId: 'animals',
    categoryName: "Animals",
    hints: {
      subtle: ["Submerged", "Riverbank", "Territory"],
      balanced: ["Yawn", "Tusks", "Heavy"],
      easy: ["Water", "Africa", "Mouth"]
    }
  },
  {
    id: 'anim_squirrel',
    word: "Squirrel",
    categoryId: 'animals',
    categoryName: "Animals",
    hints: {
      subtle: ["Acorn", "Autumn", "Park"],
      balanced: ["Bury", "Branch", "Cheeks"],
      easy: ["Tail", "Climb", "Nuts"]
    }
  },
  {
    id: 'anim_peacock',
    word: "Peacock",
    categoryId: 'animals',
    categoryName: "Animals",
    hints: {
      subtle: ["Palace", "Pride", "Courtship"],
      balanced: ["Train", "Eyespots", "Strut"],
      easy: ["Feathers", "Fan", "Bird"]
    }
  },
  {
    id: 'anim_lion',
    word: "Lion",
    categoryId: 'animals',
    categoryName: "Animals",
    hints: {
      subtle: ["Pride", "Savannah", "Royalty"],
      balanced: ["Mane", "Roar", "Hunt"],
      easy: ["Feline", "Paws", "Africa"]
    }
  },
  {
    id: 'anim_fox',
    word: "Fox",
    categoryId: 'animals',
    categoryName: "Animals",
    hints: {
      subtle: ["Cunning", "Den", "Nocturnal"],
      balanced: ["Red", "Sneaky", "Pounce"],
      easy: ["Tail", "Ears", "Forest"]
    }
  },
  {
    id: 'anim_badger',
    word: "Badger",
    categoryId: 'animals',
    categoryName: "Animals",
    hints: {
      subtle: ["Sett", "Nocturnal", "Fierce"],
      balanced: ["Stripes", "Digging", "Burrow"],
      easy: ["Claws", "Ground", "Stout"]
    }
  },
  {
    id: 'anim_meerkat',
    word: "Meerkat",
    categoryId: 'animals',
    categoryName: "Animals",
    hints: {
      subtle: ["Kalahari", "Burrow", "Forage"],
      balanced: ["Sentry", "Upright", "Clan"],
      easy: ["Desert", "Small", "Watch"]
    }
  },
  {
    id: 'anim_jaguar',
    word: "Jaguar",
    categoryId: 'animals',
    categoryName: "Animals",
    hints: {
      subtle: ["Amazon", "Bite", "Stealth"],
      balanced: ["Rosettes", "Swim", "Jungle"],
      easy: ["Feline", "Spots", "Paws"]
    }
  },
  {
    id: 'anim_falcon',
    word: "Falcon",
    categoryId: 'animals',
    categoryName: "Animals",
    hints: {
      subtle: ["Peregrine", "Hood", "Cliff"],
      balanced: ["Dive", "Fastest", "Talons"],
      easy: ["Raptor", "Wings", "Beak"]
    }
  },
  {
    id: 'fam_albert_einstein',
    word: "Albert Einstein",
    categoryId: 'famous_people',
    categoryName: "Famous People",
    hints: {
      subtle: ["Patent", "Chalkboard", "Hair"],
      balanced: ["Relativity", "Physicist", "Nobel"],
      easy: ["Genius", "Science", "Energy"]
    }
  },
  {
    id: 'fam_leonardo_da_vinci',
    word: "Leonardo da Vinci",
    categoryId: 'famous_people',
    categoryName: "Famous People",
    hints: {
      subtle: ["Mirror", "Florence", "Notebooks"],
      balanced: ["Mona", "Renaissance", "Polymath"],
      easy: ["Painter", "Inventor", "Italian"]
    }
  },
  {
    id: 'fam_michael_jackson',
    word: "Michael Jackson",
    categoryId: 'famous_people',
    categoryName: "Famous People",
    hints: {
      subtle: ["Neverland", "Fedora", "Glove"],
      balanced: ["Moonwalk", "Thriller", "King"],
      easy: ["Singer", "Dance", "Pop"]
    }
  },
  {
    id: 'fam_steve_jobs',
    word: "Steve Jobs",
    categoryId: 'famous_people',
    categoryName: "Famous People",
    hints: {
      subtle: ["Turtleneck", "Garage", "Keynote"],
      balanced: ["iPhone", "Cupertino", "Macintosh"],
      easy: ["Visionary", "Founder", "Design"]
    }
  },
  {
    id: 'fam_william_shakespeare',
    word: "William Shakespeare",
    categoryId: 'famous_people',
    categoryName: "Famous People",
    hints: {
      subtle: ["Avon", "Quill", "Folio"],
      balanced: ["Globe", "Hamlet", "Sonnet"],
      easy: ["Playwright", "Poet", "Theater"]
    }
  },
  {
    id: 'fam_cleopatra',
    word: "Cleopatra",
    categoryId: 'famous_people',
    categoryName: "Famous People",
    hints: {
      subtle: ["Asp", "Alexandria", "Barge"],
      balanced: ["Pharaoh", "Queen", "Nile"],
      easy: ["Egypt", "Gold", "Ancient"]
    }
  },
  {
    id: 'fam_wolfgang_mozart',
    word: "Wolfgang Mozart",
    categoryId: 'famous_people',
    categoryName: "Famous People",
    hints: {
      subtle: ["Salzburg", "Prodigy", "Amadeus"],
      balanced: ["Requiem", "Symphony", "Opera"],
      easy: ["Composer", "Piano", "Classical"]
    }
  },
  {
    id: 'fam_neil_armstrong',
    word: "Neil Armstrong",
    categoryId: 'famous_people',
    categoryName: "Famous People",
    hints: {
      subtle: ["Tranquility", "Eagle", "Footprint"],
      balanced: ["Apollo", "Leap", "Astronaut"],
      easy: ["Moon", "Space", "First"]
    }
  },
  {
    id: 'fam_serena_williams',
    word: "Serena Williams",
    categoryId: 'famous_people',
    categoryName: "Famous People",
    hints: {
      subtle: ["Compton", "Slam", "Ace"],
      balanced: ["Racket", "Wimbledon", "Champion"],
      easy: ["Tennis", "Court", "Athlete"]
    }
  },
  {
    id: 'fam_taylor_swift',
    word: "Taylor Swift",
    categoryId: 'famous_people',
    categoryName: "Famous People",
    hints: {
      subtle: ["Eras", "Thirteen", "Scarf"],
      balanced: ["Guitar", "Grammy", "Country"],
      easy: ["Singer", "Pop", "Concert"]
    }
  },
  {
    id: 'fam_elon_musk',
    word: "Elon Musk",
    categoryId: 'famous_people',
    categoryName: "Famous People",
    hints: {
      subtle: ["Falcon", "Mars", "Gigafactory"],
      balanced: ["SpaceX", "Rocket", "Billionaire"],
      easy: ["Electric", "Tech", "Ceo"]
    }
  },
  {
    id: 'fam_marilyn_monroe',
    word: "Marilyn Monroe",
    categoryId: 'famous_people',
    categoryName: "Famous People",
    hints: {
      subtle: ["Subway", "Beauty", "President"],
      balanced: ["Blonde", "Diamonds", "Hollywood"],
      easy: ["Actress", "Dress", "Icon"]
    }
  },
  {
    id: 'fam_muhammad_ali',
    word: "Muhammad Ali",
    categoryId: 'famous_people',
    categoryName: "Famous People",
    hints: {
      subtle: ["Rumble", "Rope", "Butterfly"],
      balanced: ["Gloves", "Ring", "Greatest"],
      easy: ["Boxer", "Punch", "Champion"]
    }
  },
  {
    id: 'fam_frida_kahlo',
    word: "Frida Kahlo",
    categoryId: 'famous_people',
    categoryName: "Famous People",
    hints: {
      subtle: ["Monobrow", "Casazul", "Bus"],
      balanced: ["Portrait", "Folkloric", "Surreal"],
      easy: ["Painter", "Mexico", "Artist"]
    }
  },
  {
    id: 'fam_nelson_mandela',
    word: "Nelson Mandela",
    categoryId: 'famous_people',
    categoryName: "Famous People",
    hints: {
      subtle: ["Robben", "Madiba", "Rugby"],
      balanced: ["Apartheid", "Prison", "Reconciliation"],
      easy: ["President", "Leader", "Peace"]
    }
  },
  {
    id: 'fam_stephen_hawking',
    word: "Stephen Hawking",
    categoryId: 'famous_people',
    categoryName: "Famous People",
    hints: {
      subtle: ["Wheelchair", "Synthesizer", "Cambridge"],
      balanced: ["Cosmology", "Singularity", "Radiation"],
      easy: ["Physicist", "Genius", "Space"]
    }
  },
  {
    id: 'fam_walt_disney',
    word: "Walt Disney",
    categoryId: 'famous_people',
    categoryName: "Famous People",
    hints: {
      subtle: ["Steamboat", "Castle", "Theme"],
      balanced: ["Mickey", "Animation", "Magic"],
      easy: ["Cartoon", "Park", "Movies"]
    }
  },
  {
    id: 'fam_vincent_van_gogh',
    word: "Vincent van Gogh",
    categoryId: 'famous_people',
    categoryName: "Famous People",
    hints: {
      subtle: ["Arles", "Bandage", "Sunflower"],
      balanced: ["Starry", "Swirls", "Dutch"],
      easy: ["Painter", "Canvas", "Artist"]
    }
  },
  {
    id: 'fam_audrey_hepburn',
    word: "Audrey Hepburn",
    categoryId: 'famous_people',
    categoryName: "Famous People",
    hints: {
      subtle: ["Croissant", "Tiara", "Ambassador"],
      balanced: ["Tiffany", "Glamour", "Elegance"],
      easy: ["Actress", "Fashion", "Hollywood"]
    }
  },
  {
    id: 'fam_isaac_newton',
    word: "Isaac Newton",
    categoryId: 'famous_people',
    categoryName: "Famous People",
    hints: {
      subtle: ["Orchard", "Prism", "Calculus"],
      balanced: ["Gravity", "Principia", "Motion"],
      easy: ["Apple", "Physicist", "Science"]
    }
  },
  {
    id: 'fam_bob_marley',
    word: "Bob Marley",
    categoryId: 'famous_people',
    categoryName: "Famous People",
    hints: {
      subtle: ["Dreadlocks", "Trenchtown", "Wailers"],
      balanced: ["Reggae", "Jamaica", "Guitar"],
      easy: ["Singer", "Peace", "Music"]
    }
  },
  {
    id: 'fam_marie_curie',
    word: "Marie Curie",
    categoryId: 'famous_people',
    categoryName: "Famous People",
    hints: {
      subtle: ["Pitchblende", "Polonium", "Glow"],
      balanced: ["Radium", "Radiation", "Nobel"],
      easy: ["Chemist", "Science", "Laboratory"]
    }
  },
  {
    id: 'fam_lionel_messi',
    word: "Lionel Messi",
    categoryId: 'famous_people',
    categoryName: "Famous People",
    hints: {
      subtle: ["Rosario", "Campnou", "Left"],
      balanced: ["Dribble", "Ballon", "Argentina"],
      easy: ["Soccer", "Goal", "Ten"]
    }
  },
  {
    id: 'fam_abraham_lincoln',
    word: "Abraham Lincoln",
    categoryId: 'famous_people',
    categoryName: "Famous People",
    hints: {
      subtle: ["Stovepipe", "Cabin", "Ford"],
      balanced: ["Gettysburg", "Beard", "Union"],
      easy: ["President", "Penny", "Civil"]
    }
  },
  {
    id: 'fam_beyonc',
    word: "Beyoncé",
    categoryId: 'famous_people',
    categoryName: "Famous People",
    hints: {
      subtle: ["Destiny", "Beehive", "Renaissance"],
      balanced: ["Queen", "Grammy", "Halo"],
      easy: ["Singer", "Pop", "Dance"]
    }
  },
  {
    id: 'fam_pablo_picasso',
    word: "Pablo Picasso",
    categoryId: 'famous_people',
    categoryName: "Famous People",
    hints: {
      subtle: ["Guernica", "Blue", "Malaga"],
      balanced: ["Cubism", "Abstract", "Spain"],
      easy: ["Painter", "Canvas", "Artist"]
    }
  },
  {
    id: 'fam_charles_darwin',
    word: "Charles Darwin",
    categoryId: 'famous_people',
    categoryName: "Famous People",
    hints: {
      subtle: ["Beagle", "Galapagos", "Finches"],
      balanced: ["Evolution", "Natural", "Fossils"],
      easy: ["Biologist", "Species", "Science"]
    }
  },
  {
    id: 'fam_oprah_winfrey',
    word: "Oprah Winfrey",
    categoryId: 'famous_people',
    categoryName: "Famous People",
    hints: {
      subtle: ["Harpo", "Club", "Chicago"],
      balanced: ["Talk", "Host", "Billionaire"],
      easy: ["Television", "Media", "Famous"]
    }
  },
  {
    id: 'fam_usain_bolt',
    word: "Usain Bolt",
    categoryId: 'famous_people',
    categoryName: "Famous People",
    hints: {
      subtle: ["Lightning", "Pose", "Spikes"],
      balanced: ["Sprint", "Fastest", "Jamaica"],
      easy: ["Runner", "Olympic", "Gold"]
    }
  },
  {
    id: 'fam_ludwig_van_beethoven',
    word: "Ludwig van Beethoven",
    categoryId: 'famous_people',
    categoryName: "Famous People",
    hints: {
      subtle: ["Bonn", "Fate", "Metronome"],
      balanced: ["Deaf", "Symphony", "Sonata"],
      easy: ["Composer", "Piano", "Classical"]
    }
  },
  {
    id: 'fam_freddie_mercury',
    word: "Freddie Mercury",
    categoryId: 'famous_people',
    categoryName: "Famous People",
    hints: {
      subtle: ["Mustache", "Zanzibar", "Wembley"],
      balanced: ["Queen", "Rhapsody", "Vocals"],
      easy: ["Singer", "Rock", "Microphone"]
    }
  },
  {
    id: 'fam_bill_gates',
    word: "Bill Gates",
    categoryId: 'famous_people',
    categoryName: "Famous People",
    hints: {
      subtle: ["Garage", "Glasses", "Polo"],
      balanced: ["Windows", "Software", "Philanthropy"],
      easy: ["Billionaire", "Computer", "Founder"]
    }
  },
  {
    id: 'fam_amelia_earhart',
    word: "Amelia Earhart",
    categoryId: 'famous_people',
    categoryName: "Famous People",
    hints: {
      subtle: ["Lockheed", "Pacific", "Goggles"],
      balanced: ["Aviation", "Atlantic", "Solo"],
      easy: ["Pilot", "Airplane", "Fly"]
    }
  },
  {
    id: 'fam_david_bowie',
    word: "David Bowie",
    categoryId: 'famous_people',
    categoryName: "Famous People",
    hints: {
      subtle: ["Stardust", "Eyes", "Major"],
      balanced: ["Lightning", "Glamour", "Heroes"],
      easy: ["Singer", "Music", "Rock"]
    }
  },
  {
    id: 'fam_michael_jordan',
    word: "Michael Jordan",
    categoryId: 'famous_people',
    categoryName: "Famous People",
    hints: {
      subtle: ["Bulls", "Tongue", "Sneakers"],
      balanced: ["Dunk", "Air", "Six"],
      easy: ["Basketball", "Hoops", "Champion"]
    }
  },
  {
    id: 'mov_titanic',
    word: "Titanic",
    categoryId: 'movies_tv',
    categoryName: "Movies & TV Shows",
    hints: {
      subtle: ["Whistle", "Stern", "Locket"],
      balanced: ["Iceberg", "Lifeboats", "Unsinkable"],
      easy: ["Ship", "Atlantic", "Sink"]
    }
  },
  {
    id: 'mov_inception',
    word: "Inception",
    categoryId: 'movies_tv',
    categoryName: "Movies & TV Shows",
    hints: {
      subtle: ["Kick", "Hallway", "Freight"],
      balanced: ["Totem", "Subconscious", "Spinner"],
      easy: ["Dream", "Layers", "Maze"]
    }
  },
  {
    id: 'mov_harry_potter',
    word: "Harry Potter",
    categoryId: 'movies_tv',
    categoryName: "Movies & TV Shows",
    hints: {
      subtle: ["Cupboard", "Owl", "Platform"],
      balanced: ["Wand", "Scar", "Hogwarts"],
      easy: ["Glasses", "Magic", "Spell"]
    }
  },
  {
    id: 'mov_the_matrix',
    word: "The Matrix",
    categoryId: 'movies_tv',
    categoryName: "Movies & TV Shows",
    hints: {
      subtle: ["Spoon", "Rabbit", "Sunglasses"],
      balanced: ["Pill", "Zion", "Code"],
      easy: ["Simulation", "Dodge", "Machines"]
    }
  },
  {
    id: 'mov_star_wars',
    word: "Star Wars",
    categoryId: 'movies_tv',
    categoryName: "Movies & TV Shows",
    hints: {
      subtle: ["Cantina", "Moons", "Rebel"],
      balanced: ["Lightsaber", "Force", "Jedi"],
      easy: ["Galaxy", "Droids", "Empire"]
    }
  },
  {
    id: 'mov_jurassic_park',
    word: "Jurassic Park",
    categoryId: 'movies_tv',
    categoryName: "Movies & TV Shows",
    hints: {
      subtle: ["Puddle", "Amber", "Jeep"],
      balanced: ["Dinosaurs", "Raptor", "Island"],
      easy: ["Rex", "Fossils", "Cloning"]
    }
  },
  {
    id: 'mov_shrek',
    word: "Shrek",
    categoryId: 'movies_tv',
    categoryName: "Movies & TV Shows",
    hints: {
      subtle: ["Onions", "Duloc", "Waffles"],
      balanced: ["Swamp", "Ogre", "Donkey"],
      easy: ["Green", "Fairy", "Princess"]
    }
  },
  {
    id: 'mov_the_lion_king',
    word: "The Lion King",
    categoryId: 'movies_tv',
    categoryName: "Movies & TV Shows",
    hints: {
      subtle: ["Baobab", "Stampede", "Sunrise"],
      balanced: ["Savannah", "Hakuna", "Pride"],
      easy: ["Cub", "Roar", "Crown"]
    }
  },
  {
    id: 'mov_spider_man',
    word: "Spider-Man",
    categoryId: 'movies_tv',
    categoryName: "Movies & TV Shows",
    hints: {
      subtle: ["Photographer", "Subway", "Bugle"],
      balanced: ["Web", "Mask", "Crawler"],
      easy: ["Suit", "Superhero", "Bite"]
    }
  },
  {
    id: 'mov_batman',
    word: "Batman",
    categoryId: 'movies_tv',
    categoryName: "Movies & TV Shows",
    hints: {
      subtle: ["Batarang", "Butler", "Manor"],
      balanced: ["Gotham", "Signal", "Vigilante"],
      easy: ["Cave", "Cape", "Dark"]
    }
  },
  {
    id: 'mov_superman',
    word: "Superman",
    categoryId: 'movies_tv',
    categoryName: "Movies & TV Shows",
    hints: {
      subtle: ["Phonebooth", "Glasses", "Planet"],
      balanced: ["Krypton", "Cape", "Kryptonite"],
      easy: ["Fly", "Steel", "Hero"]
    }
  },
  {
    id: 'mov_iron_man',
    word: "Iron Man",
    categoryId: 'movies_tv',
    categoryName: "Movies & TV Shows",
    hints: {
      subtle: ["Cheeseburger", "Arc", "Malibu"],
      balanced: ["Armor", "Jarvis", "Repulsor"],
      easy: ["Billionaire", "Suit", "Avenger"]
    }
  },
  {
    id: 'mov_thor',
    word: "Thor",
    categoryId: 'movies_tv',
    categoryName: "Movies & TV Shows",
    hints: {
      subtle: ["Rainbow", "Goats", "Mead"],
      balanced: ["Hammer", "Lightning", "Asgard"],
      easy: ["God", "Thunder", "Cape"]
    }
  },
  {
    id: 'mov_hulk',
    word: "Hulk",
    categoryId: 'movies_tv',
    categoryName: "Movies & TV Shows",
    hints: {
      subtle: ["Purple", "Heartbeat", "Serum"],
      balanced: ["Gamma", "Smash", "Anger"],
      easy: ["Green", "Monster", "Muscles"]
    }
  },
  {
    id: 'mov_dragon',
    word: "Dragon",
    categoryId: 'movies_tv',
    categoryName: "Movies & TV Shows",
    hints: {
      subtle: ["Hoard", "Cavern", "Sulfur"],
      balanced: ["Wings", "Scales", "Breathe"],
      easy: ["Fire", "Mythical", "Tail"]
    }
  },
  {
    id: 'mov_unicorn',
    word: "Unicorn",
    categoryId: 'movies_tv',
    categoryName: "Movies & TV Shows",
    hints: {
      subtle: ["Purity", "Tapestry", "Clearing"],
      balanced: ["Spiral", "Rainbow", "White"],
      easy: ["Horn", "Horse", "Magic"]
    }
  },
  {
    id: 'mov_wizard',
    word: "Wizard",
    categoryId: 'movies_tv',
    categoryName: "Movies & TV Shows",
    hints: {
      subtle: ["Tome", "Crystal", "Tower"],
      balanced: ["Robe", "Staff", "Beard"],
      easy: ["Magic", "Hat", "Spell"]
    }
  },
  {
    id: 'mov_vampire',
    word: "Vampire",
    categoryId: 'movies_tv',
    categoryName: "Movies & TV Shows",
    hints: {
      subtle: ["Coffin", "Garlic", "Transylvania"],
      balanced: ["Fangs", "Mirror", "Bat"],
      easy: ["Blood", "Night", "Sunlight"]
    }
  },
  {
    id: 'mov_phoenix',
    word: "Phoenix",
    categoryId: 'movies_tv',
    categoryName: "Movies & TV Shows",
    hints: {
      subtle: ["Rebirth", "Tears", "Nest"],
      balanced: ["Ashes", "Flame", "Immortal"],
      easy: ["Bird", "Fire", "Feathers"]
    }
  },
  {
    id: 'mov_mermaid',
    word: "Mermaid",
    categoryId: 'movies_tv',
    categoryName: "Movies & TV Shows",
    hints: {
      subtle: ["Siren", "Comb", "Shipwreck"],
      balanced: ["Scales", "Fin", "Lagoon"],
      easy: ["Tail", "Ocean", "Swim"]
    }
  },
  {
    id: 'mov_stranger_things',
    word: "Stranger Things",
    categoryId: 'movies_tv',
    categoryName: "Movies & TV Shows",
    hints: {
      subtle: ["Waffles", "Christmas", "Bikes"],
      balanced: ["Upside", "Hawkins", "Telekinesis"],
      easy: ["Eighties", "Monster", "Nosebleed"]
    }
  },
  {
    id: 'mov_finding_nemo',
    word: "Finding Nemo",
    categoryId: 'movies_tv',
    categoryName: "Movies & TV Shows",
    hints: {
      subtle: ["Dentist", "Current", "Goggles"],
      balanced: ["Anemone", "Fin", "Reef"],
      easy: ["Clownfish", "Orange", "Ocean"]
    }
  },
  {
    id: 'mov_breaking_bad',
    word: "Breaking Bad",
    categoryId: 'movies_tv',
    categoryName: "Movies & TV Shows",
    hints: {
      subtle: ["Camper", "Pollos", "Fly"],
      balanced: ["Blue", "Chemistry", "Meth"],
      easy: ["Teacher", "Desert", "Crime"]
    }
  },
  {
    id: 'mov_avatar',
    word: "Avatar",
    categoryId: 'movies_tv',
    categoryName: "Movies & TV Shows",
    hints: {
      subtle: ["Arch", "Tree", "Bioluminescence"],
      balanced: ["Pandora", "Navi", "Blue"],
      easy: ["Jungle", "Alien", "Scifi"]
    }
  },
  {
    id: 'mov_the_avengers',
    word: "The Avengers",
    categoryId: 'movies_tv',
    categoryName: "Movies & TV Shows",
    hints: {
      subtle: ["Shawarma", "Helicarrier", "Tower"],
      balanced: ["Assemble", "Stones", "Team"],
      easy: ["Heroes", "Shield", "Marvel"]
    }
  },
  {
    id: 'mov_forrest_gump',
    word: "Forrest Gump",
    categoryId: 'movies_tv',
    categoryName: "Movies & TV Shows",
    hints: {
      subtle: ["Feather", "Shrimp", "Bench"],
      balanced: ["Chocolates", "Pingpong", "Run"],
      easy: ["Sneakers", "Medal", "Alabama"]
    }
  },
  {
    id: 'mov_game_of_thrones',
    word: "Game of Thrones",
    categoryId: 'movies_tv',
    categoryName: "Movies & TV Shows",
    hints: {
      subtle: ["Raven", "Valyrian", "Winter"],
      balanced: ["Westeros", "Dragons", "Wall"],
      easy: ["Swords", "Kingdom", "Kings"]
    }
  },
  {
    id: 'mov_interstellar',
    word: "Interstellar",
    categoryId: 'movies_tv',
    categoryName: "Movies & TV Shows",
    hints: {
      subtle: ["Watch", "Cornfield", "Waves"],
      balanced: ["Wormhole", "Gargantua", "Tesseract"],
      easy: ["Gravity", "Astronaut", "Space"]
    }
  },
  {
    id: 'mov_pulp_fiction',
    word: "Pulp Fiction",
    categoryId: 'movies_tv',
    categoryName: "Movies & TV Shows",
    hints: {
      subtle: ["Briefcase", "Watch", "Diner"],
      balanced: ["Twist", "Royale", "Hitman"],
      easy: ["Crime", "Tarantino", "Gangster"]
    }
  },
  {
    id: 'mov_back_to_the_future',
    word: "Back to the Future",
    categoryId: 'movies_tv',
    categoryName: "Movies & TV Shows",
    hints: {
      subtle: ["Giga", "Clocktower", "Vest"],
      balanced: ["DeLorean", "Hoverboard", "Lightning"],
      easy: ["Time", "Eightyeight", "Doctor"]
    }
  },
  {
    id: 'mov_the_dark_knight',
    word: "The Dark Knight",
    categoryId: 'movies_tv',
    categoryName: "Movies & TV Shows",
    hints: {
      subtle: ["Pencil", "Coin", "Hospital"],
      balanced: ["Joker", "Chaos", "Gotham"],
      easy: ["Hero", "Clown", "Bat"]
    }
  },
  {
    id: 'mov_gladiator',
    word: "Gladiator",
    categoryId: 'movies_tv',
    categoryName: "Movies & TV Shows",
    hints: {
      subtle: ["Wheat", "Thumb", "Spaniard"],
      balanced: ["Colosseum", "Sand", "General"],
      easy: ["Sword", "Rome", "Shield"]
    }
  },
  {
    id: 'mov_the_office',
    word: "The Office",
    categoryId: 'movies_tv',
    categoryName: "Movies & TV Shows",
    hints: {
      subtle: ["JellO", "Dundie", "Scranton"],
      balanced: ["Paper", "Cubicle", "Manager"],
      easy: ["Desks", "Comedy", "Pranks"]
    }
  },
  {
    id: 'mov_toy_story',
    word: "Toy Story",
    categoryId: 'movies_tv',
    categoryName: "Movies & TV Shows",
    hints: {
      subtle: ["Boot", "Claw", "Moving"],
      balanced: ["Woody", "Buzz", "Andy"],
      easy: ["Plastic", "Play", "Pixar"]
    }
  },
  {
    id: 'mov_home_alone',
    word: "Home Alone",
    categoryId: 'movies_tv',
    categoryName: "Movies & TV Shows",
    hints: {
      subtle: ["Microvan", "Statue", "Tarantula"],
      balanced: ["Traps", "Burglars", "Kevin"],
      easy: ["Christmas", "House", "Left"]
    }
  },
  {
    id: 'mov_friends',
    word: "Friends",
    categoryId: 'movies_tv',
    categoryName: "Movies & TV Shows",
    hints: {
      subtle: ["Smelly", "Fountain", "Break"],
      balanced: ["Perk", "Couch", "Pivot"],
      easy: ["Manhattan", "Sitcom", "Six"]
    }
  },
  {
    id: 'mov_ghostbusters',
    word: "Ghostbusters",
    categoryId: 'movies_tv',
    categoryName: "Movies & TV Shows",
    hints: {
      subtle: ["Twinkie", "Keymaster", "Firehouse"],
      balanced: ["Proton", "Slimer", "Trap"],
      easy: ["Specter", "Stream", "Slime"]
    }
  },
  {
    id: 'mov_the_lord_of_the_rings',
    word: "The Lord of the Rings",
    categoryId: 'movies_tv',
    categoryName: "Movies & TV Shows",
    hints: {
      subtle: ["Second", "Precious", "Mithril"],
      balanced: ["Mordor", "Hobbit", "Fellowship"],
      easy: ["Volcano", "Elves", "Fantasy"]
    }
  },
  {
    id: 'mov_jaws',
    word: "Jaws",
    categoryId: 'movies_tv',
    categoryName: "Movies & TV Shows",
    hints: {
      subtle: ["Barrels", "Orca", "Amity"],
      balanced: ["Fin", "Bigger", "Shark"],
      easy: ["Beach", "Ocean", "Teeth"]
    }
  },
  {
    id: 'mov_monsters_inc',
    word: "Monsters Inc",
    categoryId: 'movies_tv',
    categoryName: "Movies & TV Shows",
    hints: {
      subtle: ["Sock", "Doors", "Canister"],
      balanced: ["Sulley", "Mike", "Scream"],
      easy: ["Closet", "Laughter", "Scare"]
    }
  },
  {
    id: 'mov_squid_game',
    word: "Squid Game",
    categoryId: 'movies_tv',
    categoryName: "Movies & TV Shows",
    hints: {
      subtle: ["Honeycomb", "Marbles", "Tracksuit"],
      balanced: ["Island", "Doll", "Guards"],
      easy: ["Money", "Survival", "Korean"]
    }
  },
  {
    id: 'mov_pirates_of_the_caribbean',
    word: "Pirates of the Caribbean",
    categoryId: 'movies_tv',
    categoryName: "Movies & TV Shows",
    hints: {
      subtle: ["Compass", "Aztec", "Rum"],
      balanced: ["Sparrow", "Blackpearl", "Curse"],
      easy: ["Ship", "Captain", "Sword"]
    }
  },
  {
    id: 'mov_the_godfather',
    word: "The Godfather",
    categoryId: 'movies_tv',
    categoryName: "Movies & TV Shows",
    hints: {
      subtle: ["Cannoli", "Orange", "Rose"],
      balanced: ["Corleone", "Mafia", "Offer"],
      easy: ["Family", "Don", "Crime"]
    }
  },
  {
    id: 'mov_frozen',
    word: "Frozen",
    categoryId: 'movies_tv',
    categoryName: "Movies & TV Shows",
    hints: {
      subtle: ["Arendelle", "Gloves", "Carrot"],
      balanced: ["Snowman", "Elsa", "Blizzard"],
      easy: ["Ice", "Sisters", "Princess"]
    }
  },
  {
    id: 'mov_up',
    word: "Up",
    categoryId: 'movies_tv',
    categoryName: "Movies & TV Shows",
    hints: {
      subtle: ["Grape", "Snipe", "Chair"],
      balanced: ["Balloons", "Falls", "Wilderness"],
      easy: ["Fly", "House", "Old"]
    }
  },
  {
    id: 'mov_casablanca',
    word: "Casablanca",
    categoryId: 'movies_tv',
    categoryName: "Movies & TV Shows",
    hints: {
      subtle: ["Letters", "Gin", "Fog"],
      balanced: ["Piano", "Runway", "Cafe"],
      easy: ["Classic", "Morocco", "Romance"]
    }
  },
  {
    id: 'geo_japan',
    word: "Japan",
    categoryId: 'geography',
    categoryName: "Countries & Cities",
    hints: {
      subtle: ["Bullet", "Fuji", "Kimono"],
      balanced: ["Tokyo", "Cherry", "Islands"],
      easy: ["Anime", "Sushi", "Asia"]
    }
  },
  {
    id: 'geo_france',
    word: "France",
    categoryId: 'geography',
    categoryName: "Countries & Cities",
    hints: {
      subtle: ["Tricolor", "Seine", "Riviera"],
      balanced: ["Baguette", "Eiffel", "Wine"],
      easy: ["Paris", "Europe", "Cheese"]
    }
  },
  {
    id: 'geo_egypt',
    word: "Egypt",
    categoryId: 'geography',
    categoryName: "Countries & Cities",
    hints: {
      subtle: ["Papyrus", "Sphinx", "Hieroglyph"],
      balanced: ["Nile", "Pyramids", "Pharaoh"],
      easy: ["Desert", "Cairo", "Mummy"]
    }
  },
  {
    id: 'geo_brazil',
    word: "Brazil",
    categoryId: 'geography',
    categoryName: "Countries & Cities",
    hints: {
      subtle: ["Pel", "Copacabana", "Bossa"],
      balanced: ["Carnival", "Amazon", "Samba"],
      easy: ["Soccer", "Tropical", "Yellow"]
    }
  },
  {
    id: 'geo_iceland',
    word: "Iceland",
    categoryId: 'geography',
    categoryName: "Countries & Cities",
    hints: {
      subtle: ["Puffin", "Lava", "Reykjavik"],
      balanced: ["Geysers", "Glaciers", "Thermal"],
      easy: ["Island", "Aurora", "Volcano"]
    }
  },
  {
    id: 'geo_australia',
    word: "Australia",
    categoryId: 'geography',
    categoryName: "Countries & Cities",
    hints: {
      subtle: ["Boomerang", "Billabong", "Didgeridoo"],
      balanced: ["Kangaroo", "Outback", "Koala"],
      easy: ["Sydney", "Reef", "Continent"]
    }
  },
  {
    id: 'geo_canada',
    word: "Canada",
    categoryId: 'geography',
    categoryName: "Countries & Cities",
    hints: {
      subtle: ["Mountie", "Moose", "Loonie"],
      balanced: ["Maple", "Hockey", "Poutine"],
      easy: ["Snow", "Toronto", "North"]
    }
  },
  {
    id: 'geo_italy',
    word: "Italy",
    categoryId: 'geography',
    categoryName: "Countries & Cities",
    hints: {
      subtle: ["Gondola", "Vespa", "Boot"],
      balanced: ["Pasta", "Colosseum", "Pizza"],
      easy: ["Rome", "Gelato", "Europe"]
    }
  },
  {
    id: 'geo_tokyo',
    word: "Tokyo",
    categoryId: 'geography',
    categoryName: "Countries & Cities",
    hints: {
      subtle: ["Shibuya", "Metro", "Akihabara"],
      balanced: ["Skytree", "Neon", "Ramen"],
      easy: ["Japan", "Crowded", "City"]
    }
  },
  {
    id: 'geo_paris',
    word: "Paris",
    categoryId: 'geography',
    categoryName: "Countries & Cities",
    hints: {
      subtle: ["Seine", "Louvre", "Bistro"],
      balanced: ["Eiffel", "Romance", "Croissant"],
      easy: ["France", "Fashion", "Capital"]
    }
  },
  {
    id: 'geo_new_york',
    word: "New York",
    categoryId: 'geography',
    categoryName: "Countries & Cities",
    hints: {
      subtle: ["Empire", "Yellow", "Subway"],
      balanced: ["Broadway", "Manhattan", "Bagel"],
      easy: ["Statue", "Skyscrapers", "City"]
    }
  },
  {
    id: 'geo_rome',
    word: "Rome",
    categoryId: 'geography',
    categoryName: "Countries & Cities",
    hints: {
      subtle: ["Vespa", "Tiber", "Pantheon"],
      balanced: ["Colosseum", "Vatican", "Fountain"],
      easy: ["Italy", "Ancient", "Gladiator"]
    }
  },
  {
    id: 'geo_london',
    word: "London",
    categoryId: 'geography',
    categoryName: "Countries & Cities",
    hints: {
      subtle: ["Underground", "Thames", "Guards"],
      balanced: ["Bigben", "Palace", "Cab"],
      easy: ["England", "Rain", "Bridge"]
    }
  },
  {
    id: 'geo_greece',
    word: "Greece",
    categoryId: 'geography',
    categoryName: "Countries & Cities",
    hints: {
      subtle: ["Feta", "Laurel", "Mykonos"],
      balanced: ["Athens", "Mythology", "Olives"],
      easy: ["Parthenon", "Islands", "Ancient"]
    }
  },
  {
    id: 'geo_peru',
    word: "Peru",
    categoryId: 'geography',
    categoryName: "Countries & Cities",
    hints: {
      subtle: ["Ceviche", "Cusco", "Lines"],
      balanced: ["Machu", "Llama", "Andes"],
      easy: ["Inca", "Ruins", "Lima"]
    }
  },
  {
    id: 'geo_mexico',
    word: "Mexico",
    categoryId: 'geography',
    categoryName: "Countries & Cities",
    hints: {
      subtle: ["Agave", "Mariachi", "Mayan"],
      balanced: ["Taco", "Salsa", "Sombrero"],
      easy: ["Guacamole", "Fiesta", "Spanish"]
    }
  },
  {
    id: 'geo_barcelona',
    word: "Barcelona",
    categoryId: 'geography',
    categoryName: "Countries & Cities",
    hints: {
      subtle: ["Ramblas", "Trencadis", "Catalan"],
      balanced: ["Gaudi", "Sagrada", "Campnou"],
      easy: ["Spain", "Beach", "Soccer"]
    }
  },
  {
    id: 'geo_amsterdam',
    word: "Amsterdam",
    categoryId: 'geography',
    categoryName: "Countries & Cities",
    hints: {
      subtle: ["Clogs", "Herring", "Windmill"],
      balanced: ["Canals", "Bicycles", "Tulips"],
      easy: ["Netherlands", "Dutch", "Museums"]
    }
  },
  {
    id: 'geo_cairo',
    word: "Cairo",
    categoryId: 'geography',
    categoryName: "Countries & Cities",
    hints: {
      subtle: ["Bazaar", "Minarets", "Tahrir"],
      balanced: ["Nile", "Pyramids", "Sphinx"],
      easy: ["Egypt", "Desert", "Ancient"]
    }
  },
  {
    id: 'geo_sydney',
    word: "Sydney",
    categoryId: 'geography',
    categoryName: "Countries & Cities",
    hints: {
      subtle: ["Bondi", "Ferry", "Coogee"],
      balanced: ["Harbour", "Bridge", "Opera"],
      easy: ["Australia", "Surfing", "City"]
    }
  },
  {
    id: 'geo_venice',
    word: "Venice",
    categoryId: 'geography',
    categoryName: "Countries & Cities",
    hints: {
      subtle: ["Piazza", "Masks", "Lagoon"],
      balanced: ["Gondola", "Bridges", "Waterways"],
      easy: ["Italy", "Canal", "Floating"]
    }
  },
  {
    id: 'geo_switzerland',
    word: "Switzerland",
    categoryId: 'geography',
    categoryName: "Countries & Cities",
    hints: {
      subtle: ["Yodel", "Fondue", "Chalet"],
      balanced: ["Alps", "Watch", "Chocolate"],
      easy: ["Skiing", "Neutral", "Banks"]
    }
  },
  {
    id: 'geo_norway',
    word: "Norway",
    categoryId: 'geography',
    categoryName: "Countries & Cities",
    hints: {
      subtle: ["Viking", "Lofoten", "Troll"],
      balanced: ["Fjords", "Midnight", "Oslo"],
      easy: ["Aurora", "Snow", "Nordic"]
    }
  },
  {
    id: 'geo_thailand',
    word: "Thailand",
    categoryId: 'geography',
    categoryName: "Countries & Cities",
    hints: {
      subtle: ["Tuktuk", "Muay", "Elephant"],
      balanced: ["Bangkok", "Pad", "Temples"],
      easy: ["Spicy", "Islands", "Asia"]
    }
  },
  {
    id: 'geo_south_africa',
    word: "South Africa",
    categoryId: 'geography',
    categoryName: "Countries & Cities",
    hints: {
      subtle: ["Vuvuzela", "Table", "Springboks"],
      balanced: ["Mandela", "Safari", "Cape"],
      easy: ["Lions", "Gold", "Rainbow"]
    }
  },
  {
    id: 'geo_india',
    word: "India",
    categoryId: 'geography',
    categoryName: "Countries & Cities",
    hints: {
      subtle: ["Sari", "Ganges", "Rickshaw"],
      balanced: ["Mahal", "Curry", "Cricket"],
      easy: ["Spices", "Bollywood", "Asia"]
    }
  },
  {
    id: 'geo_singapore',
    word: "Singapore",
    categoryId: 'geography',
    categoryName: "Countries & Cities",
    hints: {
      subtle: ["Merlion", "Hawker", "Changi"],
      balanced: ["Clean", "Marina", "Island"],
      easy: ["Port", "Skyscrapers", "Gardens"]
    }
  },
  {
    id: 'geo_dubai',
    word: "Dubai",
    categoryId: 'geography',
    categoryName: "Countries & Cities",
    hints: {
      subtle: ["Burj", "Dune", "Mall"],
      balanced: ["Tallest", "Luxury", "Palm"],
      easy: ["Desert", "Skyscrapers", "Gold"]
    }
  },
  {
    id: 'geo_rio_de_janeiro',
    word: "Rio de Janeiro",
    categoryId: 'geography',
    categoryName: "Countries & Cities",
    hints: {
      subtle: ["Copacabana", "Sugarloaf", "Favela"],
      balanced: ["Carnival", "Samba", "Redeemer"],
      easy: ["Beach", "Brazil", "Statue"]
    }
  },
  {
    id: 'geo_istanbul',
    word: "Istanbul",
    categoryId: 'geography',
    categoryName: "Countries & Cities",
    hints: {
      subtle: ["Bosphorus", "Cats", "Galata"],
      balanced: ["Mosque", "Bazaar", "Continents"],
      easy: ["Turkey", "Spices", "Ancient"]
    }
  },
  {
    id: 'geo_san_francisco',
    word: "San Francisco",
    categoryId: 'geography',
    categoryName: "Countries & Cities",
    hints: {
      subtle: ["Alcatraz", "Lombard", "Sourdough"],
      balanced: ["Bridge", "Cablecar", "Fog"],
      easy: ["Hills", "Bay", "California"]
    }
  },
  {
    id: 'geo_new_zealand',
    word: "New Zealand",
    categoryId: 'geography',
    categoryName: "Countries & Cities",
    hints: {
      subtle: ["Haka", "Hobbiton", "Fern"],
      balanced: ["Kiwi", "Sheep", "Islands"],
      easy: ["Mountains", "Green", "Pacific"]
    }
  },
  {
    id: 'geo_morocco',
    word: "Morocco",
    categoryId: 'geography',
    categoryName: "Countries & Cities",
    hints: {
      subtle: ["Medina", "Tajine", "Marrakech"],
      balanced: ["Mint", "Sahara", "Bazaar"],
      easy: ["Spices", "Desert", "Africa"]
    }
  },
  {
    id: 'geo_seoul',
    word: "Seoul",
    categoryId: 'geography',
    categoryName: "Countries & Cities",
    hints: {
      subtle: ["Han", "Hanbok", "Soju"],
      balanced: ["Kimchi", "Palaces", "Tower"],
      easy: ["Korea", "Kpop", "Metro"]
    }
  },
  {
    id: 'geo_argentina',
    word: "Argentina",
    categoryId: 'geography',
    categoryName: "Countries & Cities",
    hints: {
      subtle: ["Mate", "Gaucho", "Patagonia"],
      balanced: ["Tango", "Steak", "Messi"],
      easy: ["Soccer", "Andes", "South"]
    }
  },
  {
    id: 'geo_kenya',
    word: "Kenya",
    categoryId: 'geography',
    categoryName: "Countries & Cities",
    hints: {
      subtle: ["Maasai", "Mara", "Swahili"],
      balanced: ["Safari", "Marathon", "Nairobi"],
      easy: ["Savannah", "Lions", "Africa"]
    }
  },
  {
    id: 'prof_astronaut',
    word: "Astronaut",
    categoryId: 'professions',
    categoryName: "Jobs & Professions",
    hints: {
      subtle: ["Floating", "Visor", "Tether"],
      balanced: ["Spacesuit", "Rocket", "Spacewalk"],
      easy: ["Moon", "Orbit", "Cosmos"]
    }
  },
  {
    id: 'prof_detective',
    word: "Detective",
    categoryId: 'professions',
    categoryName: "Jobs & Professions",
    hints: {
      subtle: ["Trenchcoat", "Alibi", "Fingerprints"],
      balanced: ["Magnifier", "Suspect", "Clues"],
      easy: ["Mystery", "Police", "Solve"]
    }
  },
  {
    id: 'prof_chef',
    word: "Chef",
    categoryId: 'professions',
    categoryName: "Jobs & Professions",
    hints: {
      subtle: ["Apron", "Garnish", "Simmer"],
      balanced: ["Toque", "Kitchen", "Knife"],
      easy: ["Cook", "Restaurant", "Menu"]
    }
  },
  {
    id: 'prof_firefighter',
    word: "Firefighter",
    categoryId: 'professions',
    categoryName: "Jobs & Professions",
    hints: {
      subtle: ["Hydrant", "Siren", "Axe"],
      balanced: ["Hose", "Ladder", "Helmet"],
      easy: ["Flames", "Smoke", "Rescue"]
    }
  },
  {
    id: 'prof_pilot',
    word: "Pilot",
    categoryId: 'professions',
    categoryName: "Jobs & Professions",
    hints: {
      subtle: ["Rudder", "Checklist", "Aviator"],
      balanced: ["Cockpit", "Runway", "Altitude"],
      easy: ["Airplane", "Wings", "Fly"]
    }
  },
  {
    id: 'prof_architect',
    word: "Architect",
    categoryId: 'professions',
    categoryName: "Jobs & Professions",
    hints: {
      subtle: ["Drafting", "Facade", "Scale"],
      balanced: ["Blueprint", "Building", "Hardhat"],
      easy: ["Design", "Skyscraper", "House"]
    }
  },
  {
    id: 'prof_surgeon',
    word: "Surgeon",
    categoryId: 'professions',
    categoryName: "Jobs & Professions",
    hints: {
      subtle: ["Scrubs", "Sterile", "Forceps"],
      balanced: ["Scalpel", "Hospital", "Sutures"],
      easy: ["Doctor", "Operation", "Gloves"]
    }
  },
  {
    id: 'prof_photographer',
    word: "Photographer",
    categoryId: 'professions',
    categoryName: "Jobs & Professions",
    hints: {
      subtle: ["Aperture", "Shutter", "Darkroom"],
      balanced: ["Tripod", "Lens", "Flash"],
      easy: ["Camera", "Picture", "Shoot"]
    }
  },
  {
    id: 'prof_librarian',
    word: "Librarian",
    categoryId: 'professions',
    categoryName: "Jobs & Professions",
    hints: {
      subtle: ["Barcode", "Dewey", "Bookmarks"],
      balanced: ["Shelves", "Quiet", "Catalog"],
      easy: ["Books", "Reading", "Borrow"]
    }
  },
  {
    id: 'prof_journalist',
    word: "Journalist",
    categoryId: 'professions',
    categoryName: "Jobs & Professions",
    hints: {
      subtle: ["Deadline", "Byline", "Dictaphone"],
      balanced: ["Headline", "Interview", "Reporter"],
      easy: ["Newspaper", "News", "Article"]
    }
  },
  {
    id: 'prof_plumber',
    word: "Plumber",
    categoryId: 'professions',
    categoryName: "Jobs & Professions",
    hints: {
      subtle: ["Wrench", "Drain", "Washer"],
      balanced: ["Pipes", "Leak", "Clog"],
      easy: ["Water", "Sink", "Toilet"]
    }
  },
  {
    id: 'prof_sculptor',
    word: "Sculptor",
    categoryId: 'professions',
    categoryName: "Jobs & Professions",
    hints: {
      subtle: ["Pedestal", "Armature", "Foundry"],
      balanced: ["Chisel", "Marble", "Clay"],
      easy: ["Statue", "Artist", "Carve"]
    }
  },
  {
    id: 'prof_veterinarian',
    word: "Veterinarian",
    categoryId: 'professions',
    categoryName: "Jobs & Professions",
    hints: {
      subtle: ["Kennel", "Rabies", "Microchip"],
      balanced: ["Clinic", "Paws", "Vaccine"],
      easy: ["Animals", "Doctor", "Pets"]
    }
  },
  {
    id: 'prof_judge',
    word: "Judge",
    categoryId: 'professions',
    categoryName: "Jobs & Professions",
    hints: {
      subtle: ["Bench", "Chambers", "Objection"],
      balanced: ["Gavel", "Robe", "Verdict"],
      easy: ["Court", "Law", "Jury"]
    }
  },
  {
    id: 'prof_electrician',
    word: "Electrician",
    categoryId: 'professions',
    categoryName: "Jobs & Professions",
    hints: {
      subtle: ["Strippers", "Conduit", "Multimeter"],
      balanced: ["Breaker", "Voltage", "Outlet"],
      easy: ["Wires", "Power", "Current"]
    }
  },
  {
    id: 'prof_paramedic',
    word: "Paramedic",
    categoryId: 'professions',
    categoryName: "Jobs & Professions",
    hints: {
      subtle: ["Defibrillator", "Stretcher", "Triage"],
      balanced: ["Ambulance", "Emergency", "Oxygen"],
      easy: ["Rescue", "Hospital", "Firstaid"]
    }
  },
  {
    id: 'prof_archaeologist',
    word: "Archaeologist",
    categoryId: 'professions',
    categoryName: "Jobs & Professions",
    hints: {
      subtle: ["Sieve", "Brush", "Trowel"],
      balanced: ["Artifacts", "Excavate", "Ruins"],
      easy: ["Ancient", "Dig", "Fossils"]
    }
  },
  {
    id: 'prof_lifeguard',
    word: "Lifeguard",
    categoryId: 'professions',
    categoryName: "Jobs & Professions",
    hints: {
      subtle: ["Sunscreen", "Buoy", "Umbrella"],
      balanced: ["Whistle", "Tower", "Rescue"],
      easy: ["Beach", "Pool", "Swim"]
    }
  },
  {
    id: 'prof_flight_attendant',
    word: "Flight Attendant",
    categoryId: 'professions',
    categoryName: "Jobs & Professions",
    hints: {
      subtle: ["Aisle", "Overhead", "Briefing"],
      balanced: ["Cabin", "Cart", "Safety"],
      easy: ["Airplane", "Passengers", "Uniform"]
    }
  },
  {
    id: 'prof_carpenter',
    word: "Carpenter",
    categoryId: 'professions',
    categoryName: "Jobs & Professions",
    hints: {
      subtle: ["Sawdust", "Sandpaper", "Level"],
      balanced: ["Hammer", "Timber", "Saw"],
      easy: ["Wood", "Nails", "Build"]
    }
  },
  {
    id: 'prof_graphic_designer',
    word: "Graphic Designer",
    categoryId: 'professions',
    categoryName: "Jobs & Professions",
    hints: {
      subtle: ["Kerning", "Vector", "Pantone"],
      balanced: ["Typography", "Layout", "Tablet"],
      easy: ["Logo", "Visual", "Digital"]
    }
  },
  {
    id: 'prof_teacher',
    word: "Teacher",
    categoryId: 'professions',
    categoryName: "Jobs & Professions",
    hints: {
      subtle: ["Chalk", "Recess", "Attendance"],
      balanced: ["Classroom", "Homework", "Lesson"],
      easy: ["School", "Students", "Learn"]
    }
  },
  {
    id: 'prof_farmer',
    word: "Farmer",
    categoryId: 'professions',
    categoryName: "Jobs & Professions",
    hints: {
      subtle: ["Scarecrow", "Silo", "Trough"],
      balanced: ["Tractor", "Barn", "Harvest"],
      easy: ["Crops", "Soil", "Fields"]
    }
  },
  {
    id: 'prof_blacksmith',
    word: "Blacksmith",
    categoryId: 'professions',
    categoryName: "Jobs & Professions",
    hints: {
      subtle: ["Tongs", "Quench", "Coke"],
      balanced: ["Anvil", "Forge", "Bellows"],
      easy: ["Hammer", "Horseshoe", "Iron"]
    }
  },
  {
    id: 'prof_dentist',
    word: "Dentist",
    categoryId: 'professions',
    categoryName: "Jobs & Professions",
    hints: {
      subtle: ["Mirror", "Spit", "Floss"],
      balanced: ["Drill", "Cavity", "Enamel"],
      easy: ["Teeth", "Smile", "Mouth"]
    }
  },
  {
    id: 'prof_astronomer',
    word: "Astronomer",
    categoryId: 'professions',
    categoryName: "Jobs & Professions",
    hints: {
      subtle: ["Spectra", "Nebula", "Orbit"],
      balanced: ["Telescope", "Observatory", "Constellation"],
      easy: ["Stars", "Planets", "Space"]
    }
  },
  {
    id: 'prof_choreographer',
    word: "Choreographer",
    categoryId: 'professions',
    categoryName: "Jobs & Professions",
    hints: {
      subtle: ["Rehearsal", "Count", "Leotard"],
      balanced: ["Routine", "Stage", "Steps"],
      easy: ["Dance", "Music", "Ballet"]
    }
  },
  {
    id: 'prof_barista',
    word: "Barista",
    categoryId: 'professions',
    categoryName: "Jobs & Professions",
    hints: {
      subtle: ["Tamper", "Portafilter", "Roast"],
      balanced: ["Espresso", "Froth", "Cafe"],
      easy: ["Coffee", "Latte", "Cup"]
    }
  },
  {
    id: 'prof_fisherman',
    word: "Fisherman",
    categoryId: 'professions',
    categoryName: "Jobs & Professions",
    hints: {
      subtle: ["Trawler", "Bait", "Tackle"],
      balanced: ["Net", "Hook", "Wharf"],
      easy: ["Boat", "Ocean", "Catch"]
    }
  },
  {
    id: 'prof_mechanic',
    word: "Mechanic",
    categoryId: 'professions',
    categoryName: "Jobs & Professions",
    hints: {
      subtle: ["Dipstick", "Gasket", "Lift"],
      balanced: ["Wrench", "Engine", "Grease"],
      easy: ["Car", "Garage", "Fix"]
    }
  },
  {
    id: 'prof_baker',
    word: "Baker",
    categoryId: 'professions',
    categoryName: "Jobs & Professions",
    hints: {
      subtle: ["Proofing", "Apron", "Peel"],
      balanced: ["Yeast", "Oven", "Knead"],
      easy: ["Flour", "Bread", "Pastry"]
    }
  },
  {
    id: 'prof_florist',
    word: "Florist",
    categoryId: 'professions',
    categoryName: "Jobs & Professions",
    hints: {
      subtle: ["Shears", "Ribbon", "Greenhouse"],
      balanced: ["Bouquet", "Petals", "Roses"],
      easy: ["Flowers", "Vase", "Shop"]
    }
  },
  {
    id: 'prof_translator',
    word: "Translator",
    categoryId: 'professions',
    categoryName: "Jobs & Professions",
    hints: {
      subtle: ["Idiom", "Headset", "Dialect"],
      balanced: ["Dictionary", "Bilingual", "Grammar"],
      easy: ["Language", "Words", "Speak"]
    }
  },
  {
    id: 'prof_coach',
    word: "Coach",
    categoryId: 'professions',
    categoryName: "Jobs & Professions",
    hints: {
      subtle: ["Clipboard", "Stopwatch", "Drills"],
      balanced: ["Whistle", "Sideline", "Tactics"],
      easy: ["Team", "Training", "Win"]
    }
  },
  {
    id: 'prof_scientist',
    word: "Scientist",
    categoryId: 'professions',
    categoryName: "Jobs & Professions",
    hints: {
      subtle: ["Beaker", "Peer", "Data"],
      balanced: ["Hypothesis", "Labcoat", "Microscope"],
      easy: ["Experiment", "Research", "Lab"]
    }
  },
  {
    id: 'sport_soccer',
    word: "Soccer",
    categoryId: 'sports',
    categoryName: "Sports & Games",
    hints: {
      subtle: ["Studs", "Offside", "Penalty"],
      balanced: ["Dribble", "Goalpost", "Referee"],
      easy: ["Pitch", "Kick", "Ball"]
    }
  },
  {
    id: 'sport_basketball',
    word: "Basketball",
    categoryId: 'sports',
    categoryName: "Sports & Games",
    hints: {
      subtle: ["Squeak", "Travel", "Alleyoop"],
      balanced: ["Dribble", "Hoop", "Dunk"],
      easy: ["Court", "Shoot", "Net"]
    }
  },
  {
    id: 'sport_tennis',
    word: "Tennis",
    categoryId: 'sports',
    categoryName: "Sports & Games",
    hints: {
      subtle: ["Deuce", "Baseline", "Drop"],
      balanced: ["Racket", "Serve", "Volley"],
      easy: ["Court", "Net", "Ace"]
    }
  },
  {
    id: 'sport_swimming',
    word: "Swimming",
    categoryId: 'sports',
    categoryName: "Sports & Games",
    hints: {
      subtle: ["Turn", "Chlorine", "Blocks"],
      balanced: ["Goggles", "Lanes", "Stroke"],
      easy: ["Pool", "Water", "Dive"]
    }
  },
  {
    id: 'sport_baseball',
    word: "Baseball",
    categoryId: 'sports',
    categoryName: "Sports & Games",
    hints: {
      subtle: ["Dugout", "Umpire", "Bunt"],
      balanced: ["Bat", "Glove", "Homerun"],
      easy: ["Diamond", "Pitcher", "Bases"]
    }
  },
  {
    id: 'sport_bowling',
    word: "Bowling",
    categoryId: 'sports',
    categoryName: "Sports & Games",
    hints: {
      subtle: ["Gutter", "Split", "Turf"],
      balanced: ["Pins", "Strike", "Alley"],
      easy: ["Ball", "Spare", "Shoes"]
    }
  },
  {
    id: 'sport_snowboarding',
    word: "Snowboarding",
    categoryId: 'sports',
    categoryName: "Sports & Games",
    hints: {
      subtle: ["Bindings", "Carve", "Goggles"],
      balanced: ["Halfpipe", "Slope", "Powder"],
      easy: ["Snow", "Glide", "Winter"]
    }
  },
  {
    id: 'sport_volleyball',
    word: "Volleyball",
    categoryId: 'sports',
    categoryName: "Sports & Games",
    hints: {
      subtle: ["Rotation", "Kneepads", "Setter"],
      balanced: ["Spike", "Bump", "Block"],
      easy: ["Net", "Beach", "Serve"]
    }
  },
  {
    id: 'sport_formula_1',
    word: "Formula 1",
    categoryId: 'sports',
    categoryName: "Sports & Games",
    hints: {
      subtle: ["Chicane", "Halo", "Telemetries"],
      balanced: ["Pitstop", "Circuit", "Podium"],
      easy: ["Fast", "Tires", "Driver"]
    }
  },
  {
    id: 'sport_rugby',
    word: "Rugby",
    categoryId: 'sports',
    categoryName: "Sports & Games",
    hints: {
      subtle: ["Try", "Lineout", "Mouthguard"],
      balanced: ["Scrum", "Tackle", "Punt"],
      easy: ["Oval", "Pitch", "Pass"]
    }
  },
  {
    id: 'sport_badminton',
    word: "Badminton",
    categoryId: 'sports',
    categoryName: "Sports & Games",
    hints: {
      subtle: ["Feathers", "Drop", "Grip"],
      balanced: ["Shuttlecock", "Smash", "Racket"],
      easy: ["Net", "Court", "Fast"]
    }
  },
  {
    id: 'sport_gymnastics',
    word: "Gymnastics",
    categoryId: 'sports',
    categoryName: "Sports & Games",
    hints: {
      subtle: ["Chalk", "Dismount", "Leotard"],
      balanced: ["Vault", "Beam", "Rings"],
      easy: ["Flip", "Mat", "Flexibility"]
    }
  },
  {
    id: 'sport_golf',
    word: "Golf",
    categoryId: 'sports',
    categoryName: "Sports & Games",
    hints: {
      subtle: ["Divot", "Fairway", "Birdie"],
      balanced: ["Clubs", "Bunker", "Putter"],
      easy: ["Tee", "Hole", "Green"]
    }
  },
  {
    id: 'sport_ice_hockey',
    word: "Ice Hockey",
    categoryId: 'sports',
    categoryName: "Sports & Games",
    hints: {
      subtle: ["Zamboni", "Crease", "Slapshot"],
      balanced: ["Puck", "Skates", "Stick"],
      easy: ["Rink", "Goal", "Check"]
    }
  },
  {
    id: 'sport_cricket',
    word: "Cricket",
    categoryId: 'sports',
    categoryName: "Sports & Games",
    hints: {
      subtle: ["Crease", "Innings", "Spin"],
      balanced: ["Wicket", "Bat", "Bowler"],
      easy: ["Runs", "Pitch", "Leather"]
    }
  },
  {
    id: 'sport_boxing',
    word: "Boxing",
    categoryId: 'sports',
    categoryName: "Sports & Games",
    hints: {
      subtle: ["Jab", "Corner", "Bell"],
      balanced: ["Gloves", "Knockout", "Ring"],
      easy: ["Punch", "Rounds", "Fight"]
    }
  },
  {
    id: 'sport_figure_skating',
    word: "Figure Skating",
    categoryId: 'sports',
    categoryName: "Sports & Games",
    hints: {
      subtle: ["Axel", "Costume", "Routine"],
      balanced: ["Blades", "Spins", "Jump"],
      easy: ["Rink", "Grace", "Twirl"]
    }
  },
  {
    id: 'sport_table_tennis',
    word: "Table Tennis",
    categoryId: 'sports',
    categoryName: "Sports & Games",
    hints: {
      subtle: ["Spin", "Rubber", "Pingpong"],
      balanced: ["Paddle", "Celluloid", "Smash"],
      easy: ["Net", "Bounce", "Fast"]
    }
  },
  {
    id: 'sport_track_and_field',
    word: "Track and Field",
    categoryId: 'sports',
    categoryName: "Sports & Games",
    hints: {
      subtle: ["Baton", "Spikes", "Starting"],
      balanced: ["Hurdles", "Javelin", "Sprint"],
      easy: ["Run", "Jump", "Throw"]
    }
  },
  {
    id: 'sport_curling',
    word: "Curling",
    categoryId: 'sports',
    categoryName: "Sports & Games",
    hints: {
      subtle: ["Hog", "Skip", "Button"],
      balanced: ["Stone", "Broom", "House"],
      easy: ["Sweep", "Slide", "Target"]
    }
  },
  {
    id: 'sport_water_polo',
    word: "Water Polo",
    categoryId: 'sports',
    categoryName: "Sports & Games",
    hints: {
      subtle: ["Eggbeater", "Ejection", "Earguards"],
      balanced: ["Treading", "Goal", "Cap"],
      easy: ["Swim", "Ball", "Pool"]
    }
  },
  {
    id: 'sport_bmx',
    word: "BMX",
    categoryId: 'sports',
    categoryName: "Sports & Games",
    hints: {
      subtle: ["Berm", "Gate", "Pegs"],
      balanced: ["Dirt", "Jumps", "Helmet"],
      easy: ["Bike", "Pedal", "Tricks"]
    }
  },
  {
    id: 'sport_fencing',
    word: "Fencing",
    categoryId: 'sports',
    categoryName: "Sports & Games",
    hints: {
      subtle: ["Engarde", "Lame", "Piste"],
      balanced: ["Foil", "Mask", "Lunge"],
      easy: ["Sword", "White", "Duel"]
    }
  },
  {
    id: 'sport_dodgeball',
    word: "Dodgeball",
    categoryId: 'sports',
    categoryName: "Sports & Games",
    hints: {
      subtle: ["Opening", "Caught", "Sting"],
      balanced: ["Duck", "Eliminate", "Rubber"],
      easy: ["Throw", "Court", "Evade"]
    }
  },
  {
    id: 'sport_marathon',
    word: "Marathon",
    categoryId: 'sports',
    categoryName: "Sports & Games",
    hints: {
      subtle: ["Pacing", "Hydration", "Wall"],
      balanced: ["Twentysix", "Endurance", "Finish"],
      easy: ["Run", "Race", "Bib"]
    }
  },
  {
    id: 'sport_ski_jumping',
    word: "Ski Jumping",
    categoryId: 'sports',
    categoryName: "Sports & Games",
    hints: {
      subtle: ["Inrun", "Telemark", "Wind"],
      balanced: ["Takeoff", "Gliding", "Hill"],
      easy: ["Snow", "Fly", "Skis"]
    }
  },
  {
    id: 'sport_rowing',
    word: "Rowing",
    categoryId: 'sports',
    categoryName: "Sports & Games",
    hints: {
      subtle: ["Stroke", "Rigger", "Wake"],
      balanced: ["Coxswain", "Oars", "Shell"],
      easy: ["River", "Water", "Boat"]
    }
  },
  {
    id: 'sport_judo',
    word: "Judo",
    categoryId: 'sports',
    categoryName: "Sports & Games",
    hints: {
      subtle: ["Tatami", "Ippon", "Gentle"],
      balanced: ["Throw", "Gi", "Belt"],
      easy: ["Martial", "Mat", "Grip"]
    }
  },
  {
    id: 'sport_handball',
    word: "Handball",
    categoryId: 'sports',
    categoryName: "Sports & Games",
    hints: {
      subtle: ["Crease", "Glue", "Wing"],
      balanced: ["Goal", "Dribble", "Throw"],
      easy: ["Court", "Jump", "Fast"]
    }
  },
  {
    id: 'sport_bobsled',
    word: "Bobsled",
    categoryId: 'sports',
    categoryName: "Sports & Games",
    hints: {
      subtle: ["Runners", "Brakeman", "Push"],
      balanced: ["Chute", "Gravity", "Helmet"],
      easy: ["Sled", "Ice", "Winter"]
    }
  },
  {
    id: 'sport_triathlon',
    word: "Triathlon",
    categoryId: 'sports',
    categoryName: "Sports & Games",
    hints: {
      subtle: ["Transition", "Ironman", "Split"],
      balanced: ["Endurance", "Wetsuit", "Three"],
      easy: ["Swim", "Bike", "Run"]
    }
  },
  {
    id: 'sport_darts',
    word: "Darts",
    categoryId: 'sports',
    categoryName: "Sports & Games",
    hints: {
      subtle: ["Oche", "Flights", "Treb"],
      balanced: ["Bullseye", "Board", "Throw"],
      easy: ["Points", "Pub", "Target"]
    }
  },
  {
    id: 'sport_wrestling',
    word: "Wrestling",
    categoryId: 'sports',
    categoryName: "Sports & Games",
    hints: {
      subtle: ["Singlet", "Takedown", "Bridge"],
      balanced: ["Pin", "Mat", "Grapple"],
      easy: ["Fight", "Hold", "Weight"]
    }
  },
  {
    id: 'sport_polo',
    word: "Polo",
    categoryId: 'sports',
    categoryName: "Sports & Games",
    hints: {
      subtle: ["Chukker", "Divots", "Pony"],
      balanced: ["Mallet", "Horse", "Saddle"],
      easy: ["Ball", "Grass", "Ride"]
    }
  },
  {
    id: 'hobby_minecraft',
    word: "Minecraft",
    categoryId: 'hobbies',
    categoryName: "Hobbies & Activities",
    hints: {
      subtle: ["Creeper", "Redstone", "Diamond"],
      balanced: ["Blocks", "Pickaxe", "Crafting"],
      easy: ["Mine", "Build", "Game"]
    }
  },
  {
    id: 'hobby_pokemon',
    word: "Pokemon",
    categoryId: 'hobbies',
    categoryName: "Hobbies & Activities",
    hints: {
      subtle: ["Badge", "Professor", "Grass"],
      balanced: ["Pikachu", "Evolve", "Trainer"],
      easy: ["Catch", "Battle", "Monsters"]
    }
  },
  {
    id: 'hobby_super_mario',
    word: "Super Mario",
    categoryId: 'hobbies',
    categoryName: "Hobbies & Activities",
    hints: {
      subtle: ["Mustache", "Overalls", "Castle"],
      balanced: ["Mushroom", "Plumber", "Goomba"],
      easy: ["Jump", "Nintendo", "Coins"]
    }
  },
  {
    id: 'hobby_the_legend_of_zelda',
    word: "The Legend of Zelda",
    categoryId: 'hobbies',
    categoryName: "Hobbies & Activities",
    hints: {
      subtle: ["Ocarina", "Pots", "Rupees"],
      balanced: ["Triforce", "Hyrule", "Mastersword"],
      easy: ["Link", "Princess", "Sword"]
    }
  },
  {
    id: 'hobby_tetris',
    word: "Tetris",
    categoryId: 'hobbies',
    categoryName: "Hobbies & Activities",
    hints: {
      subtle: ["Rotate", "Cleared", "Russian"],
      balanced: ["Blocks", "Lines", "Falling"],
      easy: ["Puzzle", "Grid", "Stack"]
    }
  },
  {
    id: 'hobby_pac_man',
    word: "Pac-Man",
    categoryId: 'hobbies',
    categoryName: "Hobbies & Activities",
    hints: {
      subtle: ["Fruit", "Pellets", "Waka"],
      balanced: ["Ghosts", "Maze", "Chomp"],
      easy: ["Yellow", "Arcade", "Dots"]
    }
  },
  {
    id: 'hobby_gardening',
    word: "Gardening",
    categoryId: 'hobbies',
    categoryName: "Hobbies & Activities",
    hints: {
      subtle: ["Mulch", "Compost", "Prune"],
      balanced: ["Seeds", "Trowel", "Watering"],
      easy: ["Flowers", "Soil", "Plants"]
    }
  },
  {
    id: 'hobby_photography',
    word: "Photography",
    categoryId: 'hobbies',
    categoryName: "Hobbies & Activities",
    hints: {
      subtle: ["Bokeh", "Aperture", "Shutter"],
      balanced: ["Lens", "Tripod", "Framing"],
      easy: ["Camera", "Picture", "Shoot"]
    }
  },
  {
    id: 'hobby_scuba_diving',
    word: "Scuba Diving",
    categoryId: 'hobbies',
    categoryName: "Hobbies & Activities",
    hints: {
      subtle: ["Regulator", "Nitrox", "Wetsuit"],
      balanced: ["Tank", "Flippers", "Reef"],
      easy: ["Underwater", "Mask", "Ocean"]
    }
  },
  {
    id: 'hobby_origami',
    word: "Origami",
    categoryId: 'hobbies',
    categoryName: "Hobbies & Activities",
    hints: {
      subtle: ["Square", "Valley", "Japanese"],
      balanced: ["Crane", "Crease", "Scissors"],
      easy: ["Paper", "Fold", "Craft"]
    }
  },
  {
    id: 'hobby_skateboarding',
    word: "Skateboarding",
    categoryId: 'hobbies',
    categoryName: "Hobbies & Activities",
    hints: {
      subtle: ["Griptape", "Trucks", "Ollie"],
      balanced: ["Deck", "Wheels", "Grind"],
      easy: ["Ramp", "Park", "Tricks"]
    }
  },
  {
    id: 'hobby_baking',
    word: "Baking",
    categoryId: 'hobbies',
    categoryName: "Hobbies & Activities",
    hints: {
      subtle: ["Yeast", "Whisk", "Vanilla"],
      balanced: ["Flour", "Dough", "Oven"],
      easy: ["Cake", "Cookies", "Sweet"]
    }
  },
  {
    id: 'hobby_hiking',
    word: "Hiking",
    categoryId: 'hobbies',
    categoryName: "Hobbies & Activities",
    hints: {
      subtle: ["Blaze", "Cairn", "Switchback"],
      balanced: ["Trail", "Backpack", "Boots"],
      easy: ["Mountain", "Walk", "Nature"]
    }
  },
  {
    id: 'hobby_chess',
    word: "Chess",
    categoryId: 'hobbies',
    categoryName: "Hobbies & Activities",
    hints: {
      subtle: ["Gambit", "Enpassant", "Fianchetto"],
      balanced: ["Checkmate", "Knight", "Rook"],
      easy: ["Board", "King", "Queen"]
    }
  },
  {
    id: 'hobby_painting',
    word: "Painting",
    categoryId: 'hobbies',
    categoryName: "Hobbies & Activities",
    hints: {
      subtle: ["Impasto", "Gesso", "Turpentine"],
      balanced: ["Palette", "Easel", "Brushes"],
      easy: ["Canvas", "Color", "Art"]
    }
  },
  {
    id: 'hobby_yoga',
    word: "Yoga",
    categoryId: 'hobbies',
    categoryName: "Hobbies & Activities",
    hints: {
      subtle: ["Pranayama", "Chakra", "Savasana"],
      balanced: ["Namaste", "Asana", "Stretch"],
      easy: ["Mat", "Breathe", "Pose"]
    }
  },
  {
    id: 'hobby_camping',
    word: "Camping",
    categoryId: 'hobbies',
    categoryName: "Hobbies & Activities",
    hints: {
      subtle: ["Kindling", "Tarp", "Carabiner"],
      balanced: ["Tent", "Campfire", "Sleepingbag"],
      easy: ["Outdoors", "Woods", "Fire"]
    }
  },
  {
    id: 'hobby_pottery',
    word: "Pottery",
    categoryId: 'hobbies',
    categoryName: "Hobbies & Activities",
    hints: {
      subtle: ["Wedging", "Glaze", "Centering"],
      balanced: ["Wheel", "Kiln", "Clay"],
      easy: ["Vase", "Mug", "Ceramic"]
    }
  },
  {
    id: 'hobby_fishing',
    word: "Fishing",
    categoryId: 'hobbies',
    categoryName: "Hobbies & Activities",
    hints: {
      subtle: ["Bobber", "Sinker", "Creel"],
      balanced: ["Rod", "Bait", "Hook"],
      easy: ["Reel", "Lake", "Catch"]
    }
  },
  {
    id: 'hobby_bird_watching',
    word: "Bird Watching",
    categoryId: 'hobbies',
    categoryName: "Hobbies & Activities",
    hints: {
      subtle: ["Lifelist", "Plumage", "Hide"],
      balanced: ["Binoculars", "Guidebook", "Song"],
      easy: ["Feathers", "Woods", "Spot"]
    }
  },
  {
    id: 'hobby_knitting',
    word: "Knitting",
    categoryId: 'hobbies',
    categoryName: "Hobbies & Activities",
    hints: {
      subtle: ["Purl", "Skein", "Gauge"],
      balanced: ["Yarn", "Needles", "Stitch"],
      easy: ["Wool", "Scarf", "Sweater"]
    }
  },
  {
    id: 'hobby_rock_climbing',
    word: "Rock Climbing",
    categoryId: 'hobbies',
    categoryName: "Hobbies & Activities",
    hints: {
      subtle: ["Belay", "Chalk", "Crimp"],
      balanced: ["Harness", "Rope", "Carabiner"],
      easy: ["Cliff", "Grip", "Ascend"]
    }
  },
  {
    id: 'hobby_calligraphy',
    word: "Calligraphy",
    categoryId: 'hobbies',
    categoryName: "Hobbies & Activities",
    hints: {
      subtle: ["Nib", "Parchment", "Flourish"],
      balanced: ["Ink", "Lettering", "Quill"],
      easy: ["Pen", "Writing", "Stroke"]
    }
  },
  {
    id: 'hobby_astronomy',
    word: "Astronomy",
    categoryId: 'hobbies',
    categoryName: "Hobbies & Activities",
    hints: {
      subtle: ["Aperture", "Zenith", "Nebula"],
      balanced: ["Telescope", "Constellation", "Planets"],
      easy: ["Stars", "Moon", "Night"]
    }
  },
  {
    id: 'hobby_magic_tricks',
    word: "Magic Tricks",
    categoryId: 'hobbies',
    categoryName: "Hobbies & Activities",
    hints: {
      subtle: ["Patter", "Gimmick", "Misdirection"],
      balanced: ["Illusion", "Sleight", "Wand"],
      easy: ["Cards", "Rabbit", "Disappear"]
    }
  },
  {
    id: 'hobby_archery',
    word: "Archery",
    categoryId: 'hobbies',
    categoryName: "Hobbies & Activities",
    hints: {
      subtle: ["Nock", "Quiver", "Draw"],
      balanced: ["Bow", "Arrow", "Bullseye"],
      easy: ["Target", "Aim", "Shoot"]
    }
  },
  {
    id: 'hobby_woodworking',
    word: "Woodworking",
    categoryId: 'hobbies',
    categoryName: "Hobbies & Activities",
    hints: {
      subtle: ["Dovetail", "Planing", "Grain"],
      balanced: ["Chisel", "Sawdust", "Workbench"],
      easy: ["Timber", "Build", "Wood"]
    }
  },
  {
    id: 'hobby_kite_flying',
    word: "Kite Flying",
    categoryId: 'hobbies',
    categoryName: "Hobbies & Activities",
    hints: {
      subtle: ["Ripstop", "Bridle", "Spool"],
      balanced: ["Breeze", "String", "Diamond"],
      easy: ["Wind", "Tail", "Sky"]
    }
  },
  {
    id: 'hobby_surfing',
    word: "Surfing",
    categoryId: 'hobbies',
    categoryName: "Hobbies & Activities",
    hints: {
      subtle: ["Wax", "Leash", "Swell"],
      balanced: ["Barrel", "Board", "Tide"],
      easy: ["Waves", "Ocean", "Beach"]
    }
  },
  {
    id: 'hobby_karaoke',
    word: "Karaoke",
    categoryId: 'hobbies',
    categoryName: "Hobbies & Activities",
    hints: {
      subtle: ["Reverb", "Tambourine", "Duet"],
      balanced: ["Lyrics", "Microphone", "Screen"],
      easy: ["Sing", "Music", "Party"]
    }
  },
  {
    id: 'hobby_sudoku',
    word: "Sudoku",
    categoryId: 'hobbies',
    categoryName: "Hobbies & Activities",
    hints: {
      subtle: ["Candidates", "Logic", "Japanese"],
      balanced: ["Digits", "Grid", "Nine"],
      easy: ["Puzzle", "Numbers", "Pencil"]
    }
  },
  {
    id: 'hobby_scrapbooking',
    word: "Scrapbooking",
    categoryId: 'hobbies',
    categoryName: "Hobbies & Activities",
    hints: {
      subtle: ["Acidfree", "Washi", "Embellish"],
      balanced: ["Stickers", "Memories", "Scissors"],
      easy: ["Photos", "Album", "Glue"]
    }
  },
  {
    id: 'hobby_roller_skating',
    word: "Roller Skating",
    categoryId: 'hobbies',
    categoryName: "Hobbies & Activities",
    hints: {
      subtle: ["Toestop", "Quad", "Disco"],
      balanced: ["Wheels", "Boots", "Rink"],
      easy: ["Glide", "Roll", "Laces"]
    }
  },
  {
    id: 'hobby_jewelry_making',
    word: "Jewelry Making",
    categoryId: 'hobbies',
    categoryName: "Hobbies & Activities",
    hints: {
      subtle: ["Crimp", "Bezel", "Solder"],
      balanced: ["Beads", "Pliers", "Silver"],
      easy: ["Necklace", "Bracelet", "Gems"]
    }
  },
  {
    id: 'hobby_geocaching',
    word: "Geocaching",
    categoryId: 'hobbies',
    categoryName: "Hobbies & Activities",
    hints: {
      subtle: ["Muggle", "Logbook", "Swag"],
      balanced: ["Coordinates", "Container", "Cache"],
      easy: ["Treasure", "Gps", "Find"]
    }
  },
  {
    id: 'hobby_snorkeling',
    word: "Snorkeling",
    categoryId: 'hobbies',
    categoryName: "Hobbies & Activities",
    hints: {
      subtle: ["Purge", "Shallows", "Defogger"],
      balanced: ["Fins", "Mask", "Reef"],
      easy: ["Tube", "Swim", "Ocean"]
    }
  },
  {
    id: 'hobby_model_building',
    word: "Model Building",
    categoryId: 'hobbies',
    categoryName: "Hobbies & Activities",
    hints: {
      subtle: ["Sprue", "Decals", "Cement"],
      balanced: ["Kit", "Tweezers", "Scale"],
      easy: ["Paint", "Glue", "Plastic"]
    }
  },
  {
    id: 'hobby_board_games',
    word: "Board Games",
    categoryId: 'hobbies',
    categoryName: "Hobbies & Activities",
    hints: {
      subtle: ["Meeple", "Turn", "Rulebook"],
      balanced: ["Dice", "Tokens", "Tabletop"],
      easy: ["Cards", "Play", "Win"]
    }
  },
  {
    id: 'hobby_billiards',
    word: "Billiards",
    categoryId: 'hobbies',
    categoryName: "Hobbies & Activities",
    hints: {
      subtle: ["Chalk", "Bank", "Felt"],
      balanced: ["Cue", "Pocket", "Rack"],
      easy: ["Balls", "Table", "Eight"]
    }
  },
  {
    id: 'hobby_juggling',
    word: "Juggling",
    categoryId: 'hobbies',
    categoryName: "Hobbies & Activities",
    hints: {
      subtle: ["Cascade", "Drop", "Clubs"],
      balanced: ["Toss", "Balls", "Circus"],
      easy: ["Catch", "Air", "Hands"]
    }
  },
  {
    id: 'nat_volcano',
    word: "Volcano",
    categoryId: 'nature',
    categoryName: "Nature & Wonders",
    hints: {
      subtle: ["Basalt", "Pompeii", "Magma"],
      balanced: ["Lava", "Erupt", "Crater"],
      easy: ["Ash", "Mountain", "Fire"]
    }
  },
  {
    id: 'nat_rainbow',
    word: "Rainbow",
    categoryId: 'nature',
    categoryName: "Nature & Wonders",
    hints: {
      subtle: ["Prism", "Droplets", "Leprechaun"],
      balanced: ["Spectrum", "Colors", "Shower"],
      easy: ["Sky", "Rain", "Sun"]
    }
  },
  {
    id: 'nat_earthquake',
    word: "Earthquake",
    categoryId: 'nature',
    categoryName: "Nature & Wonders",
    hints: {
      subtle: ["Seismograph", "Epicenter", "Richter"],
      balanced: ["Tremor", "Fault", "Rumble"],
      easy: ["Shake", "Ground", "Disaster"]
    }
  },
  {
    id: 'nat_lightning',
    word: "Lightning",
    categoryId: 'nature',
    categoryName: "Nature & Wonders",
    hints: {
      subtle: ["Thunderclap", "Conductor", "Plasma"],
      balanced: ["Bolt", "Strike", "Thunder"],
      easy: ["Storm", "Flash", "Electric"]
    }
  },
  {
    id: 'nat_waterfall',
    word: "Waterfall",
    categoryId: 'nature',
    categoryName: "Nature & Wonders",
    hints: {
      subtle: ["Mist", "Plunge", "Gorge"],
      balanced: ["Cascade", "Cliff", "Roar"],
      easy: ["River", "Drop", "Spray"]
    }
  },
  {
    id: 'nat_northern_lights',
    word: "Northern Lights",
    categoryId: 'nature',
    categoryName: "Nature & Wonders",
    hints: {
      subtle: ["Borealis", "Magnetic", "Particles"],
      balanced: ["Aurora", "Curtain", "Green"],
      easy: ["Arctic", "Sky", "Glow"]
    }
  },
  {
    id: 'nat_glacier',
    word: "Glacier",
    categoryId: 'nature',
    categoryName: "Nature & Wonders",
    hints: {
      subtle: ["Moraine", "Crevasse", "Calving"],
      balanced: ["Ice", "Valley", "Slow"],
      easy: ["Melt", "Cold", "Frozen"]
    }
  },
  {
    id: 'nat_coral_reef',
    word: "Coral Reef",
    categoryId: 'nature',
    categoryName: "Nature & Wonders",
    hints: {
      subtle: ["Polyp", "Bleaching", "Atoll"],
      balanced: ["Fish", "Limestone", "Lagoon"],
      easy: ["Ocean", "Colorful", "Undersea"]
    }
  },
  {
    id: 'nat_desert_dunes',
    word: "Desert Dunes",
    categoryId: 'nature',
    categoryName: "Nature & Wonders",
    hints: {
      subtle: ["Caravan", "Sahara", "Mirage"],
      balanced: ["Sand", "Ridges", "Arid"],
      easy: ["Wind", "Hot", "Barren"]
    }
  },
  {
    id: 'nat_rainforest',
    word: "Rainforest",
    categoryId: 'nature',
    categoryName: "Nature & Wonders",
    hints: {
      subtle: ["Understory", "Bromeliad", "Amazon"],
      balanced: ["Canopy", "Jungle", "Humid"],
      easy: ["Trees", "Green", "Tropical"]
    }
  },
  {
    id: 'nat_lightning_storm',
    word: "Lightning Storm",
    categoryId: 'nature',
    categoryName: "Nature & Wonders",
    hints: {
      subtle: ["Anvil", "Barometer", "Ozone"],
      balanced: ["Thunder", "Gale", "Downpour"],
      easy: ["Clouds", "Flash", "Tempest"]
    }
  },
  {
    id: 'nat_grand_canyon',
    word: "Grand Canyon",
    categoryId: 'nature',
    categoryName: "Nature & Wonders",
    hints: {
      subtle: ["Strata", "Colorado", "Mule"],
      balanced: ["Arizona", "Abyss", "Rim"],
      easy: ["Gorge", "River", "Vast"]
    }
  },
  {
    id: 'nat_cave_system',
    word: "Cave System",
    categoryId: 'nature',
    categoryName: "Nature & Wonders",
    hints: {
      subtle: ["Spelunker", "Guano", "Echo"],
      balanced: ["Tunnels", "Stalactites", "Subterranean"],
      easy: ["Dark", "Bats", "Underground"]
    }
  },
  {
    id: 'nat_avalanche',
    word: "Avalanche",
    categoryId: 'nature',
    categoryName: "Nature & Wonders",
    hints: {
      subtle: ["Slab", "Transceiver", "Incline"],
      balanced: ["Snowpack", "Slide", "Bury"],
      easy: ["Mountain", "Snow", "Danger"]
    }
  },
  {
    id: 'nat_tsunami',
    word: "Tsunami",
    categoryId: 'nature',
    categoryName: "Nature & Wonders",
    hints: {
      subtle: ["Recede", "Subduction", "Buoy"],
      balanced: ["Surge", "Harbor", "Inundation"],
      easy: ["Wave", "Coast", "Flooding"]
    }
  },
  {
    id: 'nat_geyser',
    word: "Geyser",
    categoryId: 'nature',
    categoryName: "Nature & Wonders",
    hints: {
      subtle: ["Plumbing", "Superheated", "Oldfaithful"],
      balanced: ["Steam", "Spout", "Thermal"],
      easy: ["Erupt", "Water", "Yellowstone"]
    }
  },
  {
    id: 'nat_tornado',
    word: "Tornado",
    categoryId: 'nature',
    categoryName: "Nature & Wonders",
    hints: {
      subtle: ["Fujita", "Sirens", "Debris"],
      balanced: ["Funnel", "Vortex", "Twister"],
      easy: ["Wind", "Storm", "Spin"]
    }
  },
  {
    id: 'nat_sunburst',
    word: "Sunburst",
    categoryId: 'nature',
    categoryName: "Nature & Wonders",
    hints: {
      subtle: ["Crepuscular", "Corona", "Horizon"],
      balanced: ["Beams", "Golden", "Radiance"],
      easy: ["Light", "Dawn", "Bright"]
    }
  },
  {
    id: 'nat_meteor_shower',
    word: "Meteor Shower",
    categoryId: 'nature',
    categoryName: "Nature & Wonders",
    hints: {
      subtle: ["Perseids", "Comet", "Radiant"],
      balanced: ["Streaks", "Shooting", "Reentry"],
      easy: ["Stars", "Night", "Sky"]
    }
  },
  {
    id: 'nat_sand_dune',
    word: "Sand Dune",
    categoryId: 'nature',
    categoryName: "Nature & Wonders",
    hints: {
      subtle: ["Slipface", "Barchan", "Grains"],
      balanced: ["Mound", "Wind", "Shifting"],
      easy: ["Desert", "Beach", "Golden"]
    }
  },
  {
    id: 'nat_oasis',
    word: "Oasis",
    categoryId: 'nature',
    categoryName: "Nature & Wonders",
    hints: {
      subtle: ["Aquifer", "Dates", "Caravan"],
      balanced: ["Palms", "Spring", "Haven"],
      easy: ["Desert", "Water", "Green"]
    }
  },
  {
    id: 'nat_volcanic_crater',
    word: "Volcanic Crater",
    categoryId: 'nature',
    categoryName: "Nature & Wonders",
    hints: {
      subtle: ["Caldera", "Fumarole", "Basalt"],
      balanced: ["Rim", "Bowl", "Lava"],
      easy: ["Summit", "Vent", "Ash"]
    }
  },
  {
    id: 'nat_mangrove',
    word: "Mangrove",
    categoryId: 'nature',
    categoryName: "Nature & Wonders",
    hints: {
      subtle: ["Brackish", "Proproots", "Nursery"],
      balanced: ["Swamp", "Stilt", "Coastal"],
      easy: ["Roots", "Trees", "Tidal"]
    }
  },
  {
    id: 'nat_tundra',
    word: "Tundra",
    categoryId: 'nature',
    categoryName: "Nature & Wonders",
    hints: {
      subtle: ["Permafrost", "Lichens", "Muskox"],
      balanced: ["Treeless", "Arctic", "Barren"],
      easy: ["Cold", "Frost", "Snow"]
    }
  },
  {
    id: 'nat_fjord',
    word: "Fjord",
    categoryId: 'nature',
    categoryName: "Nature & Wonders",
    hints: {
      subtle: ["Glacial", "Norway", "Steep"],
      balanced: ["Inlet", "Cliffs", "Waterway"],
      easy: ["Sea", "Mountains", "Cruise"]
    }
  },
  {
    id: 'nat_stalactite',
    word: "Stalactite",
    categoryId: 'nature',
    categoryName: "Nature & Wonders",
    hints: {
      subtle: ["Calcite", "Speleothem", "Millennia"],
      balanced: ["Hanging", "Drip", "Icicle"],
      easy: ["Ceiling", "Cave", "Pointed"]
    }
  },
  {
    id: 'nat_hot_spring',
    word: "Hot Spring",
    categoryId: 'nature',
    categoryName: "Nature & Wonders",
    hints: {
      subtle: ["Minerals", "Onsen", "Thermal"],
      balanced: ["Boiling", "Bath", "Steam"],
      easy: ["Pool", "Soak", "Warmth"]
    }
  },
  {
    id: 'nat_wildfire',
    word: "Wildfire",
    categoryId: 'nature',
    categoryName: "Nature & Wonders",
    hints: {
      subtle: ["Embers", "Canadair", "Drought"],
      balanced: ["Blaze", "Smoke", "Forest"],
      easy: ["Flames", "Fire", "Burn"]
    }
  },
  {
    id: 'nat_tide_pool',
    word: "Tide Pool",
    categoryId: 'nature',
    categoryName: "Nature & Wonders",
    hints: {
      subtle: ["Intertidal", "Anemone", "Barnacles"],
      balanced: ["Crabs", "Starfish", "Rocks"],
      easy: ["Ocean", "Coast", "Shallow"]
    }
  },
  {
    id: 'nat_iceberg',
    word: "Iceberg",
    categoryId: 'nature',
    categoryName: "Nature & Wonders",
    hints: {
      subtle: ["Titanic", "Buoyancy", "Bergybit"],
      balanced: ["Floating", "Calved", "Massive"],
      easy: ["Ice", "Ocean", "Cold"]
    }
  },
  {
    id: 'nat_forest_canopy',
    word: "Forest Canopy",
    categoryId: 'nature',
    categoryName: "Nature & Wonders",
    hints: {
      subtle: ["Emergent", "Epiphytes", "Lianas"],
      balanced: ["Treetops", "Leaves", "Overhead"],
      easy: ["Branches", "Green", "Jungle"]
    }
  },
  {
    id: 'nat_eclipse',
    word: "Eclipse",
    categoryId: 'nature',
    categoryName: "Nature & Wonders",
    hints: {
      subtle: ["Totality", "Umbra", "Corona"],
      balanced: ["Shadow", "Moon", "Alignment"],
      easy: ["Sun", "Darkness", "Sky"]
    }
  },
  {
    id: 'nat_thunderstorm',
    word: "Thunderstorm",
    categoryId: 'nature',
    categoryName: "Nature & Wonders",
    hints: {
      subtle: ["Supercell", "Downburst", "Hailstones"],
      balanced: ["Lightning", "Rumble", "Downpour"],
      easy: ["Rain", "Clouds", "Boom"]
    }
  },
  {
    id: 'nat_sequoia_tree',
    word: "Sequoia Tree",
    categoryId: 'nature',
    categoryName: "Nature & Wonders",
    hints: {
      subtle: ["General", "Bark", "Millennia"],
      balanced: ["Giant", "Redwood", "Trunk"],
      easy: ["Forest", "Tall", "Wood"]
    }
  },
  {
    id: 'nat_bioluminescence',
    word: "Bioluminescence",
    categoryId: 'nature',
    categoryName: "Nature & Wonders",
    hints: {
      subtle: ["Luciferin", "Abyssal", "Anglerfish"],
      balanced: ["Plankton", "Fireflies", "Glow"],
      easy: ["Light", "Ocean", "Shine"]
    }
  },
  {
    id: 'nat_mist',
    word: "Mist",
    categoryId: 'nature',
    categoryName: "Nature & Wonders",
    hints: {
      subtle: ["Dewpoint", "Valley", "Haze"],
      balanced: ["Droplets", "Shrouded", "Morning"],
      easy: ["Fog", "Damp", "Vapor"]
    }
  },
  {
    id: 'nat_canyon',
    word: "Canyon",
    categoryId: 'nature',
    categoryName: "Nature & Wonders",
    hints: {
      subtle: ["Erosion", "Strata", "Plateau"],
      balanced: ["Gorge", "Cliffs", "Ravine"],
      easy: ["River", "Deep", "Valley"]
    }
  },
  {
    id: 'tech_telescope',
    word: "Telescope",
    categoryId: 'technology',
    categoryName: "Technology & Science",
    hints: {
      subtle: ["Aperture", "Galileo", "Eyepiece"],
      balanced: ["Observatory", "Lenses", "Magnify"],
      easy: ["Stars", "Space", "Moon"]
    }
  },
  {
    id: 'tech_gravity',
    word: "Gravity",
    categoryId: 'technology',
    categoryName: "Technology & Science",
    hints: {
      subtle: ["Orbits", "Tides", "Mass"],
      balanced: ["Newton", "Falling", "Weight"],
      easy: ["Pull", "Earth", "Down"]
    }
  },
  {
    id: 'tech_smartphone',
    word: "Smartphone",
    categoryId: 'technology',
    categoryName: "Technology & Science",
    hints: {
      subtle: ["Corning", "Haptic", "SIM"],
      balanced: ["Touchscreen", "Apps", "Battery"],
      easy: ["Call", "Pocket", "Screen"]
    }
  },
  {
    id: 'tech_drone',
    word: "Drone",
    categoryId: 'technology',
    categoryName: "Technology & Science",
    hints: {
      subtle: ["Gimbal", "Telemetry", "Hover"],
      balanced: ["Quadcopter", "Propellers", "Remote"],
      easy: ["Fly", "Camera", "Pilot"]
    }
  },
  {
    id: 'tech_virtual_reality',
    word: "Virtual Reality",
    categoryId: 'technology',
    categoryName: "Technology & Science",
    hints: {
      subtle: ["Latency", "Gyroscopes", "Immersion"],
      balanced: ["Headset", "Avatar", "Controllers"],
      easy: ["Goggles", "Simulation", "Gaming"]
    }
  },
  {
    id: 'tech_smartwatch',
    word: "Smartwatch",
    categoryId: 'technology',
    categoryName: "Technology & Science",
    hints: {
      subtle: ["OLED", "Haptic", "Pedometer"],
      balanced: ["Wrist", "Pulse", "Fitness"],
      easy: ["Time", "Strap", "Notifications"]
    }
  },
  {
    id: 'tech_3d_printer',
    word: "3D Printer",
    categoryId: 'technology',
    categoryName: "Technology & Science",
    hints: {
      subtle: ["Gcode", "Extruder", "Nozzle"],
      balanced: ["Filament", "Layers", "Bed"],
      easy: ["Plastic", "Build", "Fabricate"]
    }
  },
  {
    id: 'tech_satellite',
    word: "Satellite",
    categoryId: 'technology',
    categoryName: "Technology & Science",
    hints: {
      subtle: ["Transponder", "Apogee", "Thrusters"],
      balanced: ["Orbit", "Solar", "Antenna"],
      easy: ["Space", "Signals", "Dish"]
    }
  },
  {
    id: 'tech_microchip',
    word: "Microchip",
    categoryId: 'technology',
    categoryName: "Technology & Science",
    hints: {
      subtle: ["Photolithography", "Cleanroom", "Wafer"],
      balanced: ["Silicon", "Transistors", "Circuit"],
      easy: ["Tiny", "Computer", "Processor"]
    }
  },
  {
    id: 'tech_bluetooth',
    word: "Bluetooth",
    categoryId: 'technology',
    categoryName: "Technology & Science",
    hints: {
      subtle: ["Pairing", "Viking", "Frequency"],
      balanced: ["Wireless", "Headphones", "Radio"],
      easy: ["Connect", "Blue", "Cordless"]
    }
  },
  {
    id: 'tech_solar_panel',
    word: "Solar Panel",
    categoryId: 'technology',
    categoryName: "Technology & Science",
    hints: {
      subtle: ["Inverter", "Photovoltaic", "Monocrystalline"],
      balanced: ["Sunlight", "Rooftop", "Silicon"],
      easy: ["Electricity", "Renewable", "Sun"]
    }
  },
  {
    id: 'tech_robot',
    word: "Robot",
    categoryId: 'technology',
    categoryName: "Technology & Science",
    hints: {
      subtle: ["Servo", "Asimov", "Actuator"],
      balanced: ["Automated", "Sensors", "Steel"],
      easy: ["Mechanical", "Metal", "Machine"]
    }
  },
  {
    id: 'tech_artificial_intelligence',
    word: "Artificial Intelligence",
    categoryId: 'technology',
    categoryName: "Technology & Science",
    hints: {
      subtle: ["Weights", "Turing", "Inference"],
      balanced: ["Neural", "Algorithm", "Machine"],
      easy: ["Smart", "Computer", "Thinking"]
    }
  },
  {
    id: 'tech_wi_fi_router',
    word: "Wi-Fi Router",
    categoryId: 'technology',
    categoryName: "Technology & Science",
    hints: {
      subtle: ["Bandwidth", "Ethernet", "Gateway"],
      balanced: ["Antenna", "Modem", "Broadband"],
      easy: ["Internet", "Wireless", "Password"]
    }
  },
  {
    id: 'tech_supercomputer',
    word: "Supercomputer",
    categoryId: 'technology',
    categoryName: "Technology & Science",
    hints: {
      subtle: ["Petaflops", "Cryogenic", "Racks"],
      balanced: ["Processors", "Simulation", "Powerful"],
      easy: ["Fastest", "Calculations", "Complex"]
    }
  },
  {
    id: 'tech_laser',
    word: "Laser",
    categoryId: 'technology',
    categoryName: "Technology & Science",
    hints: {
      subtle: ["Coherent", "Photons", "Cavity"],
      balanced: ["Beam", "Red", "Cutting"],
      easy: ["Light", "Pointer", "Precise"]
    }
  },
  {
    id: 'tech_hoverboard',
    word: "Hoverboard",
    categoryId: 'technology',
    categoryName: "Technology & Science",
    hints: {
      subtle: ["Gyroscopic", "Lithium", "Levitate"],
      balanced: ["Balance", "Wheels", "Ride"],
      easy: ["Electric", "Feet", "Sidewalk"]
    }
  },
  {
    id: 'tech_microscope',
    word: "Microscope",
    categoryId: 'technology',
    categoryName: "Technology & Science",
    hints: {
      subtle: ["Coverslip", "Staining", "Stage"],
      balanced: ["Magnify", "Slide", "Lenses"],
      easy: ["Cells", "Bacteria", "Laboratory"]
    }
  },
  {
    id: 'tech_fiber_optic',
    word: "Fiber Optic",
    categoryId: 'technology',
    categoryName: "Technology & Science",
    hints: {
      subtle: ["Cladding", "Subsea", "Splicing"],
      balanced: ["Glass", "Light", "Cables"],
      easy: ["Fast", "Internet", "Broadband"]
    }
  },
  {
    id: 'tech_electric_car',
    word: "Electric Car",
    categoryId: 'technology',
    categoryName: "Technology & Science",
    hints: {
      subtle: ["Regenerative", "Kilowatt", "Torque"],
      balanced: ["Battery", "Motor", "Silent"],
      easy: ["Charge", "Plug", "Clean"]
    }
  },
  {
    id: 'tech_touchscreen',
    word: "Touchscreen",
    categoryId: 'technology',
    categoryName: "Technology & Science",
    hints: {
      subtle: ["Capacitive", "Oleophobic", "Digitizer"],
      balanced: ["Swipe", "Glass", "Fingers"],
      easy: ["Tap", "Panel", "Display"]
    }
  },
  {
    id: 'tech_biometric_scanner',
    word: "Biometric Scanner",
    categoryId: 'technology',
    categoryName: "Technology & Science",
    hints: {
      subtle: ["Minutiae", "Iris", "Falsereject"],
      balanced: ["Fingerprint", "Facial", "Security"],
      easy: ["Unlock", "Identity", "Sensor"]
    }
  },
  {
    id: 'tech_game_console',
    word: "Game Console",
    categoryId: 'technology',
    categoryName: "Technology & Science",
    hints: {
      subtle: ["HDMI", "Disc", "Firmware"],
      balanced: ["Controller", "Television", "PlayStation"],
      easy: ["Play", "Box", "Buttons"]
    }
  },
  {
    id: 'tech_gps_navigation',
    word: "GPS Navigation",
    categoryId: 'technology',
    categoryName: "Technology & Science",
    hints: {
      subtle: ["Trilateration", "Constellation", "Waypoints"],
      balanced: ["Satellites", "Map", "Coordinates"],
      easy: ["Route", "Directions", "Location"]
    }
  },
  {
    id: 'tech_cloud_server',
    word: "Cloud Server",
    categoryId: 'technology',
    categoryName: "Technology & Science",
    hints: {
      subtle: ["Virtualization", "Datacenter", "Redundancy"],
      balanced: ["Storage", "Racks", "Hosting"],
      easy: ["Online", "Files", "Backup"]
    }
  },
  {
    id: 'tech_wireless_charger',
    word: "Wireless Charger",
    categoryId: 'technology',
    categoryName: "Technology & Science",
    hints: {
      subtle: ["Induction", "Qi", "Coil"],
      balanced: ["Pad", "Cordless", "Magnetic"],
      easy: ["Battery", "Power", "Rest"]
    }
  },
  {
    id: 'tech_subwoofer',
    word: "Subwoofer",
    categoryId: 'technology',
    categoryName: "Technology & Science",
    hints: {
      subtle: ["Hertz", "Crossover", "Port"],
      balanced: ["Bass", "Rumble", "Speaker"],
      easy: ["Boom", "Music", "Loud"]
    }
  },
  {
    id: 'tech_smart_bulb',
    word: "Smart Bulb",
    categoryId: 'technology',
    categoryName: "Technology & Science",
    hints: {
      subtle: ["Zigbee", "Lumens", "Dimmer"],
      balanced: ["Colors", "Socket", "App"],
      easy: ["Light", "Lamp", "Voice"]
    }
  },
  {
    id: 'tech_earbuds',
    word: "Earbuds",
    categoryId: 'technology',
    categoryName: "Technology & Science",
    hints: {
      subtle: ["Silicone", "Case", "Microphone"],
      balanced: ["Music", "Bluetooth", "Canceling"],
      easy: ["Ears", "Listen", "Sound"]
    }
  },
  {
    id: 'tech_projector',
    word: "Projector",
    categoryId: 'technology',
    categoryName: "Technology & Science",
    hints: {
      subtle: ["Keystone", "Lumens", "DLP"],
      balanced: ["Lens", "Screen", "Cinema"],
      easy: ["Beam", "Movie", "Dark"]
    }
  },
  {
    id: 'tech_power_bank',
    word: "Power Bank",
    categoryId: 'technology',
    categoryName: "Technology & Science",
    hints: {
      subtle: ["Milliamp", "Port", "Lithium"],
      balanced: ["Battery", "Portable", "Charge"],
      easy: ["Travel", "Phone", "Cable"]
    }
  },
  {
    id: 'tech_self_driving_car',
    word: "Self-Driving Car",
    categoryId: 'technology',
    categoryName: "Technology & Science",
    hints: {
      subtle: ["Lidar", "Waymo", "Autopilot"],
      balanced: ["Autonomous", "Cameras", "Steering"],
      easy: ["Wheels", "Robot", "Drive"]
    }
  },
  {
    id: 'tech_motion_sensor',
    word: "Motion Sensor",
    categoryId: 'technology',
    categoryName: "Technology & Science",
    hints: {
      subtle: ["Passive", "Fresnel", "Infrared"],
      balanced: ["Detect", "Alarm", "Security"],
      easy: ["Movement", "Light", "Switch"]
    }
  },
  {
    id: 'tech_nanotechnology',
    word: "Nanotechnology",
    categoryId: 'technology',
    categoryName: "Technology & Science",
    hints: {
      subtle: ["Fullerene", "Quantum", "Graphene"],
      balanced: ["Atoms", "Nanometer", "Molecules"],
      easy: ["Microscopic", "Tiny", "Science"]
    }
  },
  {
    id: 'tech_webcam',
    word: "Webcam",
    categoryId: 'technology',
    categoryName: "Technology & Science",
    hints: {
      subtle: ["Bezel", "Shutter", "Framerate"],
      balanced: ["Conference", "Video", "Streamer"],
      easy: ["Camera", "Call", "Online"]
    }
  },
  {
    id: 'mus_guitar',
    word: "Guitar",
    categoryId: 'music',
    categoryName: "Music & Instruments",
    hints: {
      subtle: ["Capo", "Pegs", "Rosette"],
      balanced: ["Frets", "Strum", "Pick"],
      easy: ["Strings", "Chords", "Acoustic"]
    }
  },
  {
    id: 'mus_piano',
    word: "Piano",
    categoryId: 'music',
    categoryName: "Music & Instruments",
    hints: {
      subtle: ["Damper", "Bench", "Castiron"],
      balanced: ["Keys", "Hammers", "Pedals"],
      easy: ["Keyboard", "Classical", "Chopin"]
    }
  },
  {
    id: 'mus_drums',
    word: "Drums",
    categoryId: 'music',
    categoryName: "Music & Instruments",
    hints: {
      subtle: ["Lugs", "Snare", "Rimshot"],
      balanced: ["Sticks", "Cymbals", "Pedal"],
      easy: ["Beat", "Rhythm", "Skins"]
    }
  },
  {
    id: 'mus_violin',
    word: "Violin",
    categoryId: 'music',
    categoryName: "Music & Instruments",
    hints: {
      subtle: ["Rosin", "Purfling", "Stradivarius"],
      balanced: ["Bow", "Chinrest", "Strings"],
      easy: ["Orchestra", "Classical", "Fiddle"]
    }
  },
  {
    id: 'mus_microphone',
    word: "Microphone",
    categoryId: 'music',
    categoryName: "Music & Instruments",
    hints: {
      subtle: ["Diaphragm", "Phantom", "XLR"],
      balanced: ["Stand", "Vocals", "Feedback"],
      easy: ["Sing", "Voice", "Audio"]
    }
  },
  {
    id: 'mus_saxophone',
    word: "Saxophone",
    categoryId: 'music',
    categoryName: "Music & Instruments",
    hints: {
      subtle: ["Ligature", "Pads", "Adolphe"],
      balanced: ["Reed", "Brass", "Jazz"],
      easy: ["Horn", "Keys", "Solo"]
    }
  },
  {
    id: 'mus_acoustic_guitar',
    word: "Acoustic Guitar",
    categoryId: 'music',
    categoryName: "Music & Instruments",
    hints: {
      subtle: ["Bracing", "Dreadnought", "Bridgepins"],
      balanced: ["Soundhole", "Wood", "Fingerpicking"],
      easy: ["Campfire", "Strum", "Folk"]
    }
  },
  {
    id: 'mus_grand_piano',
    word: "Grand Piano",
    categoryId: 'music',
    categoryName: "Music & Instruments",
    hints: {
      subtle: ["Sostenuto", "Lid", "Concert"],
      balanced: ["Horizontal", "Pedals", "Recital"],
      easy: ["Eightyeight", "Wing", "Black"]
    }
  },
  {
    id: 'mus_drum_kit',
    word: "Drum Kit",
    categoryId: 'music',
    categoryName: "Music & Instruments",
    hints: {
      subtle: ["Hihat", "Tomtoms", "Throne"],
      balanced: ["Bassdrum", "Sticks", "Snare"],
      easy: ["Beat", "Cymbals", "Rhythm"]
    }
  },
  {
    id: 'mus_electric_bass',
    word: "Electric Bass",
    categoryId: 'music',
    categoryName: "Music & Instruments",
    hints: {
      subtle: ["Fretless", "Slap", "Groove"],
      balanced: ["Four", "Pickups", "Low"],
      easy: ["Guitar", "Strings", "Amplifier"]
    }
  },
  {
    id: 'mus_trumpet',
    word: "Trumpet",
    categoryId: 'music',
    categoryName: "Music & Instruments",
    hints: {
      subtle: ["Mute", "Spitvalve", "Embouchure"],
      balanced: ["Valves", "Brass", "Bell"],
      easy: ["Horn", "Blow", "Fanfare"]
    }
  },
  {
    id: 'mus_harmonica',
    word: "Harmonica",
    categoryId: 'music',
    categoryName: "Music & Instruments",
    hints: {
      subtle: ["Crossharp", "Comb", "Bending"],
      balanced: ["Reeds", "Blues", "Pocket"],
      easy: ["Breathe", "Mouth", "Harp"]
    }
  },
  {
    id: 'mus_cello',
    word: "Cello",
    categoryId: 'music',
    categoryName: "Music & Instruments",
    hints: {
      subtle: ["Endpin", "Bassclef", "Spruce"],
      balanced: ["Bow", "Seated", "Warm"],
      easy: ["Strings", "Orchestra", "Wood"]
    }
  },
  {
    id: 'mus_vinyl_record',
    word: "Vinyl Record",
    categoryId: 'music',
    categoryName: "Music & Instruments",
    hints: {
      subtle: ["Rpm", "Groove", "Crate"],
      balanced: ["Needle", "Turntable", "Album"],
      easy: ["Spin", "Analog", "Music"]
    }
  },
  {
    id: 'mus_synthesizer',
    word: "Synthesizer",
    categoryId: 'music',
    categoryName: "Music & Instruments",
    hints: {
      subtle: ["LFO", "Moog", "Attack"],
      balanced: ["Oscillator", "Filter", "Patch"],
      easy: ["Keyboard", "Electronic", "Knobs"]
    }
  },
  {
    id: 'mus_flute',
    word: "Flute",
    categoryId: 'music',
    categoryName: "Music & Instruments",
    hints: {
      subtle: ["Boehm", "Embouchure", "Silver"],
      balanced: ["Transverse", "Woodwind", "Highpitched"],
      easy: ["Blow", "Keys", "Metal"]
    }
  },
  {
    id: 'mus_tambourine',
    word: "Tambourine",
    categoryId: 'music',
    categoryName: "Music & Instruments",
    hints: {
      subtle: ["Thumbroll", "Zils", "Gospel"],
      balanced: ["Jingles", "Shake", "Percussion"],
      easy: ["Slap", "Ring", "Rhythm"]
    }
  },
  {
    id: 'mus_ukulele',
    word: "Ukulele",
    categoryId: 'music',
    categoryName: "Music & Instruments",
    hints: {
      subtle: ["Flea", "Koa", "GCEA"],
      balanced: ["Hawaii", "Four", "Strum"],
      easy: ["Small", "Strings", "Island"]
    }
  },
  {
    id: 'mus_accordion',
    word: "Accordion",
    categoryId: 'music',
    categoryName: "Music & Instruments",
    hints: {
      subtle: ["Treble", "Polka", "Straps"],
      balanced: ["Bellows", "Buttons", "Squeeze"],
      easy: ["Keys", "Folk", "Air"]
    }
  },
  {
    id: 'mus_harp',
    word: "Harp",
    categoryId: 'music',
    categoryName: "Music & Instruments",
    hints: {
      subtle: ["Pillar", "Soundboard", "Celtic"],
      balanced: ["Pluck", "Pedals", "Triangular"],
      easy: ["Strings", "Angelic", "Graceful"]
    }
  },
  {
    id: 'mus_bagpipes',
    word: "Bagpipes",
    categoryId: 'music',
    categoryName: "Music & Instruments",
    hints: {
      subtle: ["Chanter", "Drones", "Tartan"],
      balanced: ["Scotland", "Kilts", "Blowpipe"],
      easy: ["Loud", "Highland", "Bag"]
    }
  },
  {
    id: 'mus_turntable',
    word: "Turntable",
    categoryId: 'music',
    categoryName: "Music & Instruments",
    hints: {
      subtle: ["Tonearm", "Slipmat", "Pitch"],
      balanced: ["Platter", "Stylus", "Scratch"],
      easy: ["Spin", "Vinyl", "Dj"]
    }
  },
  {
    id: 'mus_xylophone',
    word: "Xylophone",
    categoryId: 'music',
    categoryName: "Music & Instruments",
    hints: {
      subtle: ["Rosewood", "Resonators", "Orff"],
      balanced: ["Mallets", "Bars", "Percussion"],
      easy: ["Strike", "Wood", "Melody"]
    }
  },
  {
    id: 'mus_clarinet',
    word: "Clarinet",
    categoryId: 'music',
    categoryName: "Music & Instruments",
    hints: {
      subtle: ["Grenadilla", "Rhapsody", "Bell"],
      balanced: ["Reed", "Black", "Woodwind"],
      easy: ["Blow", "Keys", "Solo"]
    }
  },
  {
    id: 'mus_trombone',
    word: "Trombone",
    categoryId: 'music',
    categoryName: "Music & Instruments",
    hints: {
      subtle: ["Waterkey", "Glissando", "Counterweight"],
      balanced: ["Slide", "Brass", "Bell"],
      easy: ["Horn", "Blow", "Jazz"]
    }
  },
  {
    id: 'mus_bongos',
    word: "Bongos",
    categoryId: 'music',
    categoryName: "Music & Instruments",
    hints: {
      subtle: ["Hembra", "Macho", "Martillo"],
      balanced: ["Pair", "Knees", "Cuban"],
      easy: ["Hands", "Drums", "Beat"]
    }
  },
  {
    id: 'mus_rock_and_roll',
    word: "Rock and Roll",
    categoryId: 'music',
    categoryName: "Music & Instruments",
    hints: {
      subtle: ["Presley", "Riff", "Distortion"],
      balanced: ["Guitar", "Chuck", "Fifties"],
      easy: ["Band", "Loud", "Beat"]
    }
  },
  {
    id: 'mus_jazz',
    word: "Jazz",
    categoryId: 'music',
    categoryName: "Music & Instruments",
    hints: {
      subtle: ["Syncopation", "Scat", "Standard"],
      balanced: ["Saxophone", "Swing", "Orleans"],
      easy: ["Club", "Trumpet", "Improv"]
    }
  },
  {
    id: 'mus_hip_hop',
    word: "Hip Hop",
    categoryId: 'music',
    categoryName: "Music & Instruments",
    hints: {
      subtle: ["Bronx", "Turntablism", "Freestyle"],
      balanced: ["Beats", "Rap", "Graffiti"],
      easy: ["Rhyme", "Dj", "Microphone"]
    }
  },
  {
    id: 'mus_classical_symphony',
    word: "Classical Symphony",
    categoryId: 'music',
    categoryName: "Music & Instruments",
    hints: {
      subtle: ["Sonata", "Allegro", "Philharmonic"],
      balanced: ["Conductor", "Movements", "Beethoven"],
      easy: ["Orchestra", "Composer", "Concert"]
    }
  },
  {
    id: 'mus_reggae',
    word: "Reggae",
    categoryId: 'music',
    categoryName: "Music & Instruments",
    hints: {
      subtle: ["Skank", "Rastafari", "Trenchtown"],
      balanced: ["Marley", "Jamaica", "Bassline"],
      easy: ["Island", "Peace", "Dreadlocks"]
    }
  },
  {
    id: 'mus_heavy_metal',
    word: "Heavy Metal",
    categoryId: 'music',
    categoryName: "Music & Instruments",
    hints: {
      subtle: ["Tritone", "Sabbath", "Moshpit"],
      balanced: ["Distortion", "Screaming", "Leather"],
      easy: ["Loud", "Guitars", "Rock"]
    }
  },
  {
    id: 'mus_orchestra',
    word: "Orchestra",
    categoryId: 'music',
    categoryName: "Music & Instruments",
    hints: {
      subtle: ["Podium", "Tuning", "Pit"],
      balanced: ["Baton", "Conductor", "Violins"],
      easy: ["Classical", "Hall", "Instruments"]
    }
  },
  {
    id: 'mus_amplifier',
    word: "Amplifier",
    categoryId: 'music',
    categoryName: "Music & Instruments",
    hints: {
      subtle: ["Vacuum", "Gain", "Ohm"],
      balanced: ["Cabinet", "Knobs", "Guitar"],
      easy: ["Loud", "Sound", "Power"]
    }
  },
  {
    id: 'mus_metronome',
    word: "Metronome",
    categoryId: 'music',
    categoryName: "Music & Instruments",
    hints: {
      subtle: ["Pendulum", "Bpm", "Winding"],
      balanced: ["Click", "Tempo", "Rhythm"],
      easy: ["Tick", "Practice", "Time"]
    }
  },
  {
    id: 'mus_concert_stage',
    word: "Concert Stage",
    categoryId: 'music',
    categoryName: "Music & Instruments",
    hints: {
      subtle: ["Truss", "Backline", "Monitors"],
      balanced: ["Spotlight", "Crowd", "Curtain"],
      easy: ["Perform", "Platform", "Arena"]
    }
  },
  {
    id: 'mus_sheet_music',
    word: "Sheet Music",
    categoryId: 'music',
    categoryName: "Music & Instruments",
    hints: {
      subtle: ["Clef", "Staves", "Coda"],
      balanced: ["Notes", "Stand", "Score"],
      easy: ["Paper", "Read", "Melody"]
    }
  },
  {
    id: 'mus_headset',
    word: "Headset",
    categoryId: 'music',
    categoryName: "Music & Instruments",
    hints: {
      subtle: ["Boom", "Earcups", "Splitter"],
      balanced: ["Gamer", "Audio", "Headband"],
      easy: ["Ears", "Talk", "Listen"]
    }
  },
  {
    id: 'land_eiffel_tower',
    word: "Eiffel Tower",
    categoryId: 'landmarks',
    categoryName: "Places & Landmarks",
    hints: {
      subtle: ["Gustave", "Champdemars", "Centennial"],
      balanced: ["Lattice", "Paris", "Spire"],
      easy: ["France", "Iron", "Monument"]
    }
  },
  {
    id: 'land_statue_of_liberty',
    word: "Statue of Liberty",
    categoryId: 'landmarks',
    categoryName: "Places & Landmarks",
    hints: {
      subtle: ["Bartholdi", "Bedloe", "Tabula"],
      balanced: ["Torch", "Crown", "Copper"],
      easy: ["Harbor", "Green", "Freedom"]
    }
  },
  {
    id: 'land_great_wall_of_china',
    word: "Great Wall of China",
    categoryId: 'landmarks',
    categoryName: "Places & Landmarks",
    hints: {
      subtle: ["Badaling", "Mortar", "Beacon"],
      balanced: ["Fortress", "Ridges", "Bricks"],
      easy: ["Longest", "Stone", "Ancient"]
    }
  },
  {
    id: 'land_colosseum',
    word: "Colosseum",
    categoryId: 'landmarks',
    categoryName: "Places & Landmarks",
    hints: {
      subtle: ["Vespasian", "Hypogeum", "Velarium"],
      balanced: ["Gladiators", "Arches", "Arena"],
      easy: ["Rome", "Italy", "Ancient"]
    }
  },
  {
    id: 'land_pyramids_of_giza',
    word: "Pyramids of Giza",
    categoryId: 'landmarks',
    categoryName: "Places & Landmarks",
    hints: {
      subtle: ["Khufu", "Limestone", "Shafts"],
      balanced: ["Sphinx", "Pharaohs", "Tombs"],
      easy: ["Desert", "Egypt", "Triangular"]
    }
  },
  {
    id: 'land_taj_mahal',
    word: "Taj Mahal",
    categoryId: 'landmarks',
    categoryName: "Places & Landmarks",
    hints: {
      subtle: ["Mumtaz", "Pietradura", "Yamuna"],
      balanced: ["Mausoleum", "Minarets", "Dome"],
      easy: ["India", "Marble", "Love"]
    }
  },
  {
    id: 'land_machu_picchu',
    word: "Machu Picchu",
    categoryId: 'landmarks',
    categoryName: "Places & Landmarks",
    hints: {
      subtle: ["Ashlar", "Intihuatana", "Urubamba"],
      balanced: ["Inca", "Terraces", "Llamas"],
      easy: ["Peru", "Andes", "Ruins"]
    }
  },
  {
    id: 'land_big_ben',
    word: "Big Ben",
    categoryId: 'landmarks',
    categoryName: "Places & Landmarks",
    hints: {
      subtle: ["Westminster", "Thirteen", "Pennies"],
      balanced: ["Clock", "Chimes", "London"],
      easy: ["Bell", "England", "Hour"]
    }
  },
  {
    id: 'land_golden_gate_bridge',
    word: "Golden Gate Bridge",
    categoryId: 'landmarks',
    categoryName: "Places & Landmarks",
    hints: {
      subtle: ["Strauss", "Marin", "Rivets"],
      balanced: ["Suspension", "Orange", "Fog"],
      easy: ["California", "Bay", "Red"]
    }
  },
  {
    id: 'land_christ_the_redeemer',
    word: "Christ the Redeemer",
    categoryId: 'landmarks',
    categoryName: "Places & Landmarks",
    hints: {
      subtle: ["Corcovado", "Soapstone", "Tijuca"],
      balanced: ["Arms", "Deco", "Summit"],
      easy: ["Statue", "Brazil", "Rio"]
    }
  },
  {
    id: 'land_sydney_opera_house',
    word: "Sydney Opera House",
    categoryId: 'landmarks',
    categoryName: "Places & Landmarks",
    hints: {
      subtle: ["Utzon", "Ceramic", "Bennelong"],
      balanced: ["Sails", "Harbor", "Music"],
      easy: ["Australia", "White", "Performance"]
    }
  },
  {
    id: 'land_leaning_tower_of_pisa',
    word: "Leaning Tower of Pisa",
    categoryId: 'landmarks',
    categoryName: "Places & Landmarks",
    hints: {
      subtle: ["Campanile", "Subsoil", "Counterweights"],
      balanced: ["Tilt", "Marble", "Bells"],
      easy: ["Italy", "Diagonal", "Galileo"]
    }
  },
  {
    id: 'land_petra',
    word: "Petra",
    categoryId: 'landmarks',
    categoryName: "Places & Landmarks",
    hints: {
      subtle: ["Siq", "Nabataean", "Urn"],
      balanced: ["Treasury", "Rosered", "Carved"],
      easy: ["Jordan", "Desert", "Ancient"]
    }
  },
  {
    id: 'land_stonehenge',
    word: "Stonehenge",
    categoryId: 'landmarks',
    categoryName: "Places & Landmarks",
    hints: {
      subtle: ["Heel", "Aubrey", "Preseli"],
      balanced: ["Solstice", "Monoliths", "Lintels"],
      easy: ["Circle", "England", "Ancient"]
    }
  },
  {
    id: 'land_mount_everest',
    word: "Mount Everest",
    categoryId: 'landmarks',
    categoryName: "Places & Landmarks",
    hints: {
      subtle: ["Khumbu", "Sherpa", "Chomolungma"],
      balanced: ["Summit", "Himalayas", "Oxygen"],
      easy: ["Highest", "Snow", "Climb"]
    }
  },
  {
    id: 'land_louvre_museum',
    word: "Louvre Museum",
    categoryId: 'landmarks',
    categoryName: "Places & Landmarks",
    hints: {
      subtle: ["Pei", "Palace", "Sully"],
      balanced: ["Pyramid", "Mona", "Venus"],
      easy: ["Paris", "Art", "Paintings"]
    }
  },
  {
    id: 'land_times_square',
    word: "Times Square",
    categoryId: 'landmarks',
    categoryName: "Places & Landmarks",
    hints: {
      subtle: ["Ball", "Naked", "Crossroads"],
      balanced: ["Billboards", "Broadway", "Midnight"],
      easy: ["Neon", "Manhattan", "Crowded"]
    }
  },
  {
    id: 'land_burj_khalifa',
    word: "Burj Khalifa",
    categoryId: 'landmarks',
    categoryName: "Places & Landmarks",
    hints: {
      subtle: ["Yshaped", "Spire", "Eighty"],
      balanced: ["Tallest", "Dubai", "Elevators"],
      easy: ["Skyscraper", "Desert", "High"]
    }
  },
  {
    id: 'land_acropolis_of_athens',
    word: "Acropolis of Athens",
    categoryId: 'landmarks',
    categoryName: "Places & Landmarks",
    hints: {
      subtle: ["Caryatids", "Pericles", "Erechtheion"],
      balanced: ["Parthenon", "Citadel", "Columns"],
      easy: ["Greece", "Ancient", "Ruins"]
    }
  },
  {
    id: 'land_empire_state_building',
    word: "Empire State Building",
    categoryId: 'landmarks',
    categoryName: "Places & Landmarks",
    hints: {
      subtle: ["Mooring", "Kong", "Limestone"],
      balanced: ["Artdeco", "Spire", "Observation"],
      easy: ["Manhattan", "Skyscraper", "Lights"]
    }
  },
  {
    id: 'land_niagara_falls',
    word: "Niagara Falls",
    categoryId: 'landmarks',
    categoryName: "Places & Landmarks",
    hints: {
      subtle: ["Maid", "Barrel", "Horseshoe"],
      balanced: ["Cataract", "Mist", "Border"],
      easy: ["Water", "River", "Roar"]
    }
  },
  {
    id: 'land_st_basil_cathedral',
    word: "St. Basil Cathedral",
    categoryId: 'landmarks',
    categoryName: "Places & Landmarks",
    hints: {
      subtle: ["Postnik", "Bonfire", "Pokrovsky"],
      balanced: ["Onion", "RedSquare", "Domes"],
      easy: ["Moscow", "Church", "Colorful"]
    }
  },
  {
    id: 'land_alcatraz_island',
    word: "Alcatraz Island",
    categoryId: 'landmarks',
    categoryName: "Places & Landmarks",
    hints: {
      subtle: ["Pelican", "Capone", "Dummy"],
      balanced: ["Prison", "Rock", "Escape"],
      easy: ["Cells", "Bay", "Guards"]
    }
  },
  {
    id: 'land_mount_fuji',
    word: "Mount Fuji",
    categoryId: 'landmarks',
    categoryName: "Places & Landmarks",
    hints: {
      subtle: ["Hokusai", "Stratovolcano", "Shinto"],
      balanced: ["Snowcapped", "Volcano", "Sacred"],
      easy: ["Japan", "Peak", "Tokyo"]
    }
  },
  {
    id: 'land_angkor_wat',
    word: "Angkor Wat",
    categoryId: 'landmarks',
    categoryName: "Places & Landmarks",
    hints: {
      subtle: ["Suryavarman", "Basrelief", "Meru"],
      balanced: ["Khmer", "Towers", "Moat"],
      easy: ["Cambodia", "Temple", "Stone"]
    }
  },
  {
    id: 'land_chichen_itza',
    word: "Chichen Itza",
    categoryId: 'landmarks',
    categoryName: "Places & Landmarks",
    hints: {
      subtle: ["Kukulkan", "Cenote", "Caracol"],
      balanced: ["Mayan", "Pyramid", "Equinox"],
      easy: ["Mexico", "Ruins", "Stone"]
    }
  },
  {
    id: 'land_notre_dame',
    word: "Notre Dame",
    categoryId: 'landmarks',
    categoryName: "Places & Landmarks",
    hints: {
      subtle: ["Gargoyles", "Quasimodo", "Spire"],
      balanced: ["Gothic", "Bells", "Rose"],
      easy: ["Paris", "Cathedral", "France"]
    }
  },
  {
    id: 'land_sagrada_familia',
    word: "Sagrada Familia",
    categoryId: 'landmarks',
    categoryName: "Places & Landmarks",
    hints: {
      subtle: ["Gaudi", "Nativity", "Organic"],
      balanced: ["Barcelona", "Unfinished", "Spires"],
      easy: ["Basilica", "Spain", "Church"]
    }
  },
  {
    id: 'land_tower_bridge',
    word: "Tower Bridge",
    categoryId: 'landmarks',
    categoryName: "Places & Landmarks",
    hints: {
      subtle: ["Bascules", "Walkways", "Victorian"],
      balanced: ["Thames", "Lifting", "Turrets"],
      easy: ["London", "England", "River"]
    }
  },
  {
    id: 'land_hollywood_sign',
    word: "Hollywood Sign",
    categoryId: 'landmarks',
    categoryName: "Places & Landmarks",
    hints: {
      subtle: ["Land", "Lee", "Peg"],
      balanced: ["Letters", "Cinema", "Hills"],
      easy: ["California", "White", "Movies"]
    }
  },
  {
    id: 'land_vatican_city',
    word: "Vatican City",
    categoryId: 'landmarks',
    categoryName: "Places & Landmarks",
    hints: {
      subtle: ["Enclave", "Swiss", "Conclave"],
      balanced: ["Pope", "Sistine", "Basilica"],
      easy: ["Catholic", "Smallest", "Rome"]
    }
  },
  {
    id: 'land_versailles_palace',
    word: "Versailles Palace",
    categoryId: 'landmarks',
    categoryName: "Places & Landmarks",
    hints: {
      subtle: ["Sunking", "Orangerie", "Trianon"],
      balanced: ["Mirrors", "Gardens", "Gilded"],
      easy: ["Royalty", "France", "Opulent"]
    }
  },
  {
    id: 'land_alhambra',
    word: "Alhambra",
    categoryId: 'landmarks',
    categoryName: "Places & Landmarks",
    hints: {
      subtle: ["Nasrid", "Muqarnas", "Generalife"],
      balanced: ["Moorish", "Courtyard", "Granada"],
      easy: ["Palace", "Spain", "Fortress"]
    }
  },
  {
    id: 'land_mount_rushmore',
    word: "Mount Rushmore",
    categoryId: 'landmarks',
    categoryName: "Places & Landmarks",
    hints: {
      subtle: ["Borglum", "Blackhills", "Dynamite"],
      balanced: ["Presidents", "Carved", "Granite"],
      easy: ["Faces", "Mountain", "Monument"]
    }
  },
  {
    id: 'land_trevi_fountain',
    word: "Trevi Fountain",
    categoryId: 'landmarks',
    categoryName: "Places & Landmarks",
    hints: {
      subtle: ["Oceanus", "Salvi", "Tritons"],
      balanced: ["Coins", "Baroque", "Marble"],
      easy: ["Rome", "Water", "Toss"]
    }
  },
  {
    id: 'brand_nike',
    word: "Nike",
    categoryId: 'brands',
    categoryName: "Popular Brands",
    hints: {
      subtle: ["Goddess", "Waffle", "Oregon"],
      balanced: ["Swoosh", "Sneakers", "Athletic"],
      easy: ["Shoes", "Jordan", "Sport"]
    }
  },
  {
    id: 'brand_apple',
    word: "Apple",
    categoryId: 'brands',
    categoryName: "Popular Brands",
    hints: {
      subtle: ["Cupertino", "Bitten", "Wozniak"],
      balanced: ["iPhone", "Macintosh", "Minimalist"],
      easy: ["Computer", "Tablet", "Tech"]
    }
  },
  {
    id: 'brand_coca_cola',
    word: "Coca-Cola",
    categoryId: 'brands',
    categoryName: "Popular Brands",
    hints: {
      subtle: ["Pemberton", "Contour", "Secret"],
      balanced: ["Soda", "Fizz", "Script"],
      easy: ["Red", "Drink", "Can"]
    }
  },
  {
    id: 'brand_google',
    word: "Google",
    categoryId: 'brands',
    categoryName: "Popular Brands",
    hints: {
      subtle: ["PageRank", "Googol", "Mountainview"],
      balanced: ["Search", "Browser", "Android"],
      easy: ["Internet", "Query", "Answers"]
    }
  },
  {
    id: 'brand_disney',
    word: "Disney",
    categoryId: 'brands',
    categoryName: "Popular Brands",
    hints: {
      subtle: ["Steamboat", "Imagineer", "Vault"],
      balanced: ["Castle", "Mickey", "Kingdom"],
      easy: ["Animation", "Movies", "Magic"]
    }
  },
  {
    id: 'brand_lego',
    word: "Lego",
    categoryId: 'brands',
    categoryName: "Popular Brands",
    hints: {
      subtle: ["Billund", "ABS", "Leggodt"],
      balanced: ["Bricks", "Studs", "Minifigure"],
      easy: ["Toy", "Build", "Plastic"]
    }
  },
  {
    id: 'brand_spotify',
    word: "Spotify",
    categoryId: 'brands',
    categoryName: "Popular Brands",
    hints: {
      subtle: ["Discover", "Wrapped", "Stockholm"],
      balanced: ["Streaming", "Playlist", "Podcasts"],
      easy: ["Music", "Songs", "Listen"]
    }
  },
  {
    id: 'brand_netflix',
    word: "Netflix",
    categoryId: 'brands',
    categoryName: "Popular Brands",
    hints: {
      subtle: ["Redenvelope", "Tadum", "Binge"],
      balanced: ["Streaming", "Series", "Movies"],
      easy: ["Subscription", "Television", "Watch"]
    }
  },
  {
    id: 'brand_nintendo',
    word: "Nintendo",
    categoryId: 'brands',
    categoryName: "Popular Brands",
    hints: {
      subtle: ["Hanafuda", "Kyoto", "Dpad"],
      balanced: ["Switch", "Mario", "Console"],
      easy: ["Gaming", "Japanese", "Play"]
    }
  },
  {
    id: 'brand_tesla',
    word: "Tesla",
    categoryId: 'brands',
    categoryName: "Popular Brands",
    hints: {
      subtle: ["Gigafactory", "Supercharger", "Ludicrous"],
      balanced: ["Autopilot", "Battery", "Sedan"],
      easy: ["Electric", "Car", "Musk"]
    }
  },
  {
    id: 'brand_starbucks',
    word: "Starbucks",
    categoryId: 'brands',
    categoryName: "Popular Brands",
    hints: {
      subtle: ["Pikeplace", "Siren", "Frappuccino"],
      balanced: ["Barista", "Espresso", "Cup"],
      easy: ["Coffee", "Cafe", "Green"]
    }
  },
  {
    id: 'brand_ikea',
    word: "Ikea",
    categoryId: 'brands',
    categoryName: "Popular Brands",
    hints: {
      subtle: ["Allen", "Smland", "Billy"],
      balanced: ["Meatballs", "Flatpack", "Showroom"],
      easy: ["Furniture", "Swedish", "Assemble"]
    }
  },
  {
    id: 'brand_adidas',
    word: "Adidas",
    categoryId: 'brands',
    categoryName: "Popular Brands",
    hints: {
      subtle: ["Dassler", "Boost", "StanSmith"],
      balanced: ["Stripes", "Trefoil", "Tracksuit"],
      easy: ["Sneakers", "Sport", "German"]
    }
  },
  {
    id: 'brand_mcdonalds',
    word: "McDonalds",
    categoryId: 'brands',
    categoryName: "Popular Brands",
    hints: {
      subtle: ["Kroc", "Playplace", "Drivethru"],
      balanced: ["Arches", "Bigmac", "Happy"],
      easy: ["Burger", "Fries", "Fastfood"]
    }
  },
  {
    id: 'brand_amazon',
    word: "Amazon",
    categoryId: 'brands',
    categoryName: "Popular Brands",
    hints: {
      subtle: ["Bezos", "Smile", "AWS"],
      balanced: ["Prime", "Delivery", "Cardboard"],
      easy: ["Shopping", "Packages", "Online"]
    }
  },
  {
    id: 'brand_playstation',
    word: "PlayStation",
    categoryId: 'brands',
    categoryName: "Popular Brands",
    hints: {
      subtle: ["DualSense", "Symbols", "Kutaragi"],
      balanced: ["Console", "Controller", "Sony"],
      easy: ["Gaming", "Play", "Games"]
    }
  },
  {
    id: 'brand_ferrari',
    word: "Ferrari",
    categoryId: 'brands',
    categoryName: "Popular Brands",
    hints: {
      subtle: ["Maranello", "Scuderia", "Enzo"],
      balanced: ["Horse", "Rosso", "Supercar"],
      easy: ["Red", "Fast", "Italian"]
    }
  },
  {
    id: 'brand_samsung',
    word: "Samsung",
    categoryId: 'brands',
    categoryName: "Popular Brands",
    hints: {
      subtle: ["Chaebol", "Suwon", "Threestars"],
      balanced: ["Galaxy", "Displays", "Korean"],
      easy: ["Phones", "Electronics", "Television"]
    }
  },
  {
    id: 'brand_rolex',
    word: "Rolex",
    categoryId: 'brands',
    categoryName: "Popular Brands",
    hints: {
      subtle: ["Oyster", "Submariner", "Geneva"],
      balanced: ["Crown", "Luxury", "Swiss"],
      easy: ["Watch", "Gold", "Time"]
    }
  },
  {
    id: 'brand_target',
    word: "Target",
    categoryId: 'brands',
    categoryName: "Popular Brands",
    hints: {
      subtle: ["Minneapolis", "Cartwheel", "Upandup"],
      balanced: ["Bullseye", "Dog", "Retail"],
      easy: ["Red", "Shopping", "Store"]
    }
  },
  {
    id: 'brand_gucci',
    word: "Gucci",
    categoryId: 'brands',
    categoryName: "Popular Brands",
    hints: {
      subtle: ["Horsebit", "Florence", "Bamboo"],
      balanced: ["Handbags", "Luxury", "Fashion"],
      easy: ["Italian", "Designer", "Leather"]
    }
  },
  {
    id: 'brand_ebay',
    word: "eBay",
    categoryId: 'brands',
    categoryName: "Popular Brands",
    hints: {
      subtle: ["Omidyar", "Laserpointer", "Feedback"],
      balanced: ["Auction", "Bidding", "Collectibles"],
      easy: ["Online", "Sell", "Buy"]
    }
  },
  {
    id: 'brand_microsoft',
    word: "Microsoft",
    categoryId: 'brands',
    categoryName: "Popular Brands",
    hints: {
      subtle: ["Redmond", "Clippy", "Ballmer"],
      balanced: ["Windows", "Office", "Xbox"],
      easy: ["Software", "Computer", "Gates"]
    }
  },
  {
    id: 'brand_harley_davidson',
    word: "Harley-Davidson",
    categoryId: 'brands',
    categoryName: "Popular Brands",
    hints: {
      subtle: ["Milwaukee", "Vtwin", "Hog"],
      balanced: ["Cruiser", "Leather", "Rumble"],
      easy: ["Motorcycle", "Ride", "Chrome"]
    }
  },
  {
    id: 'brand_youtube',
    word: "YouTube",
    categoryId: 'brands',
    categoryName: "Popular Brands",
    hints: {
      subtle: ["Jawad", "Monetize", "Sanbruno"],
      balanced: ["Subscribe", "Creator", "Channels"],
      easy: ["Video", "Watch", "Red"]
    }
  },
  {
    id: 'brand_vans',
    word: "Vans",
    categoryId: 'brands',
    categoryName: "Popular Brands",
    hints: {
      subtle: ["Waffle", "Anaheim", "Sidestripe"],
      balanced: ["Checkerboard", "Skateboarding", "Canvas"],
      easy: ["Sneakers", "Shoes", "Slipon"]
    }
  },
  {
    id: 'brand_puma',
    word: "Puma",
    categoryId: 'brands',
    categoryName: "Popular Brands",
    hints: {
      subtle: ["Herzogenaurach", "Formstrip", "Suede"],
      balanced: ["Feline", "Soccer", "Sprint"],
      easy: ["Sneakers", "Sport", "German"]
    }
  },
  {
    id: 'brand_visa',
    word: "Visa",
    categoryId: 'brands',
    categoryName: "Popular Brands",
    hints: {
      subtle: ["Deehock", "Interchange", "Everywhere"],
      balanced: ["Credit", "Debit", "Chip"],
      easy: ["Payment", "Card", "Swipe"]
    }
  },
  {
    id: 'brand_sony',
    word: "Sony",
    categoryId: 'brands',
    categoryName: "Popular Brands",
    hints: {
      subtle: ["Morita", "Trinitron", "Betamax"],
      balanced: ["Walkman", "PlayStation", "Cameras"],
      easy: ["Electronics", "Japanese", "Television"]
    }
  },
  {
    id: 'brand_red_bull',
    word: "Red Bull",
    categoryId: 'brands',
    categoryName: "Popular Brands",
    hints: {
      subtle: ["Mateschitz", "Stratos", "Taurine"],
      balanced: ["Wings", "Energy", "Extreme"],
      easy: ["Drink", "Can", "Caffeine"]
    }
  },
  {
    id: 'brand_porsche',
    word: "Porsche",
    categoryId: 'brands',
    categoryName: "Popular Brands",
    hints: {
      subtle: ["Stuttgart", "Boxer", "LeMans"],
      balanced: ["Nineeleven", "Supercar", "Coupe"],
      easy: ["Fast", "German", "Car"]
    }
  },
  {
    id: 'brand_twitch',
    word: "Twitch",
    categoryId: 'brands',
    categoryName: "Popular Brands",
    hints: {
      subtle: ["Emotes", "Bits", "Raid"],
      balanced: ["Streamer", "Chat", "Livestream"],
      easy: ["Gaming", "Purple", "Watch"]
    }
  },
  {
    id: 'brand_subway',
    word: "Subway",
    categoryId: 'brands',
    categoryName: "Popular Brands",
    hints: {
      subtle: ["DeLuca", "Footlong", "Herbs"],
      balanced: ["Sandwich", "Artist", "Toasted"],
      easy: ["Bread", "Fastfood", "Eat"]
    }
  },
  {
    id: 'brand_heineken',
    word: "Heineken",
    categoryId: 'brands',
    categoryName: "Popular Brands",
    hints: {
      subtle: ["Ayeast", "Pilsner", "Hops"],
      balanced: ["Lager", "Brewery", "Star"],
      easy: ["Beer", "Green", "Dutch"]
    }
  },
  {
    id: 'brand_audi',
    word: "Audi",
    categoryId: 'brands',
    categoryName: "Popular Brands",
    hints: {
      subtle: ["Horch", "Ingolstadt", "Vorsprung"],
      balanced: ["Rings", "Quattro", "Sedan"],
      easy: ["Car", "German", "Luxury"]
    }
  },
  {
    id: 'veh_helicopter',
    word: "Helicopter",
    categoryId: 'vehicles',
    categoryName: "Vehicles & Transport",
    hints: {
      subtle: ["Collective", "Helipad", "Chopper"],
      balanced: ["Rotors", "Hover", "Skids"],
      easy: ["Fly", "Blades", "Rescue"]
    }
  },
  {
    id: 'veh_submarine',
    word: "Submarine",
    categoryId: 'vehicles',
    categoryName: "Vehicles & Transport",
    hints: {
      subtle: ["Ballast", "Periscope", "Torpedo"],
      balanced: ["Sonar", "Submerged", "Nuclear"],
      easy: ["Underwater", "Ocean", "Dive"]
    }
  },
  {
    id: 'veh_electric_scooter',
    word: "Electric Scooter",
    categoryId: 'vehicles',
    categoryName: "Vehicles & Transport",
    hints: {
      subtle: ["Throttle", "Dockless", "Foldable"],
      balanced: ["Handlebars", "Deck", "Battery"],
      easy: ["Wheels", "Sidewalk", "Ride"]
    }
  },
  {
    id: 'veh_sailboat',
    word: "Sailboat",
    categoryId: 'vehicles',
    categoryName: "Vehicles & Transport",
    hints: {
      subtle: ["Tack", "Keel", "Halyard"],
      balanced: ["Mast", "Canvas", "Rudder"],
      easy: ["Wind", "Ocean", "Voyage"]
    }
  },
  {
    id: 'veh_hot_air_balloon',
    word: "Hot Air Balloon",
    categoryId: 'vehicles',
    categoryName: "Vehicles & Transport",
    hints: {
      subtle: ["Envelope", "Crownline", "Propane"],
      balanced: ["Burner", "Basket", "Float"],
      easy: ["Sky", "Fly", "Wicker"]
    }
  },
  {
    id: 'veh_high_speed_train',
    word: "High-Speed Train",
    categoryId: 'vehicles',
    categoryName: "Vehicles & Transport",
    hints: {
      subtle: ["Pantograph", "Maglev", "Aerodynamic"],
      balanced: ["Rails", "Bullet", "Electric"],
      easy: ["Fast", "Station", "Passengers"]
    }
  },
  {
    id: 'veh_spaceship',
    word: "Spaceship",
    categoryId: 'vehicles',
    categoryName: "Vehicles & Transport",
    hints: {
      subtle: ["Airlock", "Thrusters", "Heatshield"],
      balanced: ["Rocket", "Orbit", "Astronauts"],
      easy: ["Cosmos", "Stars", "Launch"]
    }
  },
  {
    id: 'veh_bulldozer',
    word: "Bulldozer",
    categoryId: 'vehicles',
    categoryName: "Vehicles & Transport",
    hints: {
      subtle: ["Ripper", "Hydraulic", "Clearing"],
      balanced: ["Tracks", "Blade", "Heavy"],
      easy: ["Dirt", "Yellow", "Push"]
    }
  },
  {
    id: 'veh_ambulance',
    word: "Ambulance",
    categoryId: 'vehicles',
    categoryName: "Vehicles & Transport",
    hints: {
      subtle: ["Defibrillator", "Gurney", "Paramedic"],
      balanced: ["Siren", "Emergency", "Flashers"],
      easy: ["Hospital", "White", "Rescue"]
    }
  },
  {
    id: 'veh_jet_ski',
    word: "Jet Ski",
    categoryId: 'vehicles',
    categoryName: "Vehicles & Transport",
    hints: {
      subtle: ["Impeller", "Lanyard", "Sponson"],
      balanced: ["Throttle", "Spray", "Waves"],
      easy: ["Water", "Fast", "Ride"]
    }
  },
  {
    id: 'veh_fire_truck',
    word: "Fire Truck",
    categoryId: 'vehicles',
    categoryName: "Vehicles & Transport",
    hints: {
      subtle: ["Outriggers", "Pumper", "Nozzle"],
      balanced: ["Ladder", "Hose", "Siren"],
      easy: ["Red", "Flames", "Water"]
    }
  },
  {
    id: 'veh_hovercraft',
    word: "Hovercraft",
    categoryId: 'vehicles',
    categoryName: "Vehicles & Transport",
    hints: {
      subtle: ["Skirt", "Duct", "Cushion"],
      balanced: ["Amphibious", "Propeller", "Float"],
      easy: ["Air", "Water", "Land"]
    }
  },
  {
    id: 'veh_motorcycle',
    word: "Motorcycle",
    categoryId: 'vehicles',
    categoryName: "Vehicles & Transport",
    hints: {
      subtle: ["Clutch", "Kickstand", "Fairing"],
      balanced: ["Handlebars", "Helmet", "Exhaust"],
      easy: ["Wheels", "Engine", "Ride"]
    }
  },
  {
    id: 'veh_steam_locomotive',
    word: "Steam Locomotive",
    categoryId: 'vehicles',
    categoryName: "Vehicles & Transport",
    hints: {
      subtle: ["Firebox", "Cowcatcher", "Tender"],
      balanced: ["Smokestack", "Pistons", "Whistle"],
      easy: ["Coal", "Tracks", "Choochoo"]
    }
  },
  {
    id: 'veh_monster_truck',
    word: "Monster Truck",
    categoryId: 'vehicles',
    categoryName: "Vehicles & Transport",
    hints: {
      subtle: ["Nitrogen", "GraveDigger", "Crush"],
      balanced: ["Suspension", "Arena", "Methanol"],
      easy: ["Giant", "Loud", "Jumps"]
    }
  },
  {
    id: 'veh_yacht',
    word: "Yacht",
    categoryId: 'vehicles',
    categoryName: "Vehicles & Transport",
    hints: {
      subtle: ["Helipad", "Stewardess", "Mooring"],
      balanced: ["Deck", "Luxury", "Marina"],
      easy: ["Boat", "Ocean", "White"]
    }
  },
  {
    id: 'veh_tractor',
    word: "Tractor",
    categoryId: 'vehicles',
    categoryName: "Vehicles & Transport",
    hints: {
      subtle: ["PTO", "Hitch", "Diesel"],
      balanced: ["Plow", "Fields", "Farmer"],
      easy: ["Tires", "Green", "Farm"]
    }
  },
  {
    id: 'veh_gondola',
    word: "Gondola",
    categoryId: 'vehicles',
    categoryName: "Vehicles & Transport",
    hints: {
      subtle: ["Forcola", "Ferro", "Canal"],
      balanced: ["Gondolier", "Venice", "Oar"],
      easy: ["Boat", "Black", "Romance"]
    }
  },
  {
    id: 'veh_airplane',
    word: "Airplane",
    categoryId: 'vehicles',
    categoryName: "Vehicles & Transport",
    hints: {
      subtle: ["Altimeter", "Aileron", "Turbofan"],
      balanced: ["Runway", "Wings", "Cockpit"],
      easy: ["Fly", "Sky", "Airport"]
    }
  },
  {
    id: 'veh_cable_car',
    word: "Cable Car",
    categoryId: 'vehicles',
    categoryName: "Vehicles & Transport",
    hints: {
      subtle: ["Bullwheel", "Grip", "Turntable"],
      balanced: ["Hills", "Bell", "Track"],
      easy: ["Trolley", "Sanfrancisco", "Ride"]
    }
  },
  {
    id: 'veh_hang_glider',
    word: "Hang Glider",
    categoryId: 'vehicles',
    categoryName: "Vehicles & Transport",
    hints: {
      subtle: ["Thermals", "Aframe", "Variometer"],
      balanced: ["Harness", "Wings", "Cliff"],
      easy: ["Gliding", "Fly", "Sky"]
    }
  },
  {
    id: 'veh_tugboat',
    word: "Tugboat",
    categoryId: 'vehicles',
    categoryName: "Vehicles & Transport",
    hints: {
      subtle: ["Bollard", "Fenders", "Kort"],
      balanced: ["Towing", "Harbor", "Powerful"],
      easy: ["Boat", "Push", "Water"]
    }
  },
  {
    id: 'veh_forklift',
    word: "Forklift",
    categoryId: 'vehicles',
    categoryName: "Vehicles & Transport",
    hints: {
      subtle: ["Mast", "Counterweight", "Pallet"],
      balanced: ["Prongs", "Warehouse", "Hydraulic"],
      easy: ["Lift", "Boxes", "Drive"]
    }
  },
  {
    id: 'veh_cruise_ship',
    word: "Cruise Ship",
    categoryId: 'vehicles',
    categoryName: "Vehicles & Transport",
    hints: {
      subtle: ["Promenade", "Porthole", "Lido"],
      balanced: ["Buffet", "Balcony", "Cabins"],
      easy: ["Vacation", "Ocean", "Huge"]
    }
  },
  {
    id: 'veh_snowmobile',
    word: "Snowmobile",
    categoryId: 'vehicles',
    categoryName: "Vehicles & Transport",
    hints: {
      subtle: ["Tether", "Thumbthrottle", "Carbide"],
      balanced: ["Skis", "Track", "Winter"],
      easy: ["Snow", "Ride", "Cold"]
    }
  },
  {
    id: 'veh_go_kart',
    word: "Go-Kart",
    categoryId: 'vehicles',
    categoryName: "Vehicles & Transport",
    hints: {
      subtle: ["Slicks", "Centrifugal", "Apex"],
      balanced: ["Lap", "Helmet", "Karting"],
      easy: ["Fast", "Race", "Track"]
    }
  },
  {
    id: 'veh_segway',
    word: "Segway",
    categoryId: 'vehicles',
    categoryName: "Vehicles & Transport",
    hints: {
      subtle: ["Deankamen", "Leansteer", "Gyroscopes"],
      balanced: ["Balance", "Upright", "Lean"],
      easy: ["Wheels", "Electric", "Handlebar"]
    }
  },
  {
    id: 'veh_tanker_ship',
    word: "Tanker Ship",
    categoryId: 'vehicles',
    categoryName: "Vehicles & Transport",
    hints: {
      subtle: ["Manifold", "Inert", "Draft"],
      balanced: ["Crude", "Hull", "Petroleum"],
      easy: ["Oil", "Cargo", "Ocean"]
    }
  },
  {
    id: 'veh_cargo_plane',
    word: "Cargo Plane",
    categoryId: 'vehicles',
    categoryName: "Vehicles & Transport",
    hints: {
      subtle: ["Nosedoor", "Pallets", "Payload"],
      balanced: ["Freight", "Ramp", "Logistics"],
      easy: ["Boxes", "Fly", "Airport"]
    }
  },
  {
    id: 'veh_delivery_van',
    word: "Delivery Van",
    categoryId: 'vehicles',
    categoryName: "Vehicles & Transport",
    hints: {
      subtle: ["Parcelshelf", "Handbrake", "Manifest"],
      balanced: ["Courier", "Packages", "Sliding"],
      easy: ["Boxes", "Drive", "Street"]
    }
  },
  {
    id: 'veh_camper_van',
    word: "Camper Van",
    categoryId: 'vehicles',
    categoryName: "Vehicles & Transport",
    hints: {
      subtle: ["Poptop", "Kitchenette", "Westfalia"],
      balanced: ["Camping", "Bed", "Roadtrip"],
      easy: ["Travel", "Sleep", "Wheels"]
    }
  },
  {
    id: 'veh_double_decker_bus',
    word: "Double Decker Bus",
    categoryId: 'vehicles',
    categoryName: "Vehicles & Transport",
    hints: {
      subtle: ["Routemaster", "Frontrow", "Staircase"],
      balanced: ["Upper", "Twotier", "London"],
      easy: ["Red", "Passengers", "Transit"]
    }
  },
  {
    id: 'veh_subway_train',
    word: "Subway Train",
    categoryId: 'vehicles',
    categoryName: "Vehicles & Transport",
    hints: {
      subtle: ["Thirdrail", "Turnstile", "Screech"],
      balanced: ["Tunnel", "Platform", "Metro"],
      easy: ["Underground", "Station", "Commute"]
    }
  },
  {
    id: 'veh_rowboat',
    word: "Rowboat",
    categoryId: 'vehicles',
    categoryName: "Vehicles & Transport",
    hints: {
      subtle: ["Oarlock", "Thwart", "Transom"],
      balanced: ["Oars", "Paddling", "Lake"],
      easy: ["Boat", "Water", "Fish"]
    }
  },
  {
    id: 'veh_kayak',
    word: "Kayak",
    categoryId: 'vehicles',
    categoryName: "Vehicles & Transport",
    hints: {
      subtle: ["Sprayskirt", "Eskimoroll", "Inuit"],
      balanced: ["Paddle", "Cockpit", "Rapids"],
      easy: ["Boat", "River", "Water"]
    }
  },
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
