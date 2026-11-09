const fs = require('fs');

const brands = [
  {
    word: 'Nike',
    subtle: [
      { hint: 'Goddess', rationale: 'Winged Greek deity of victory inspiring corporate moniker.' },
      { hint: 'Waffle', rationale: 'Kitchen appliance used by Bill Bowerman to mold first sole.' },
      { hint: 'Oregon', rationale: 'Northwest US state where track coach and runner founded company.' }
    ],
    balanced: [
      { hint: 'Swoosh', rationale: 'Fluid curved checkmark logo representing motion.' },
      { hint: 'Sneakers', rationale: 'High-performance athletic running and basketball shoes.' },
      { hint: 'Athletic', rationale: 'Sports apparel and performance gear category.' }
    ],
    easy: [
      { hint: 'Shoes', rationale: 'Footwear products worn by athletes worldwide.' },
      { hint: 'Jordan', rationale: 'Legendary basketball star powering sub-brand.' },
      { hint: 'Sport', rationale: 'Global athletic apparel industry.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Athletic footwear titan known for the Swoosh logo.' }
  },
  {
    word: 'Apple',
    subtle: [
      { hint: 'Cupertino', rationale: 'Silicon Valley headquarters campus designed as circular spaceship.' },
      { hint: 'Bitten', rationale: 'Iconic fruit silhouette missing a side chunk.' },
      { hint: 'Wozniak', rationale: 'Technical co-founder who hand-soldered original boards.' }
    ],
    balanced: [
      { hint: 'iPhone', rationale: 'Revolutionary smartphone driving majority of global revenues.' },
      { hint: 'Macintosh', rationale: 'Personal computer line introduced in famous 1984 commercial.' },
      { hint: 'Minimalist', rationale: 'Clean aluminum hardware aesthetic spearheaded by Jony Ive.' }
    ],
    easy: [
      { hint: 'Computer', rationale: 'High-end consumer tech laptops and desktops.' },
      { hint: 'Tablet', rationale: 'iPad device dominating handheld touchscreen market.' },
      { hint: 'Tech', rationale: 'Most valuable consumer electronics company globally.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Consumer tech giant renowned for iPhone, iPad, and Mac.' }
  },
  {
    word: 'Coca-Cola',
    subtle: [
      { hint: 'Pemberton', rationale: 'Atlanta pharmacist who concocted original syrup recipe.' },
      { hint: 'Contour', rationale: 'Hobbleskirt fluted glass bottle designed to be recognized in dark.' },
      { hint: 'Secret', rationale: 'Locked bank vault formula guarded for over a century.' }
    ],
    balanced: [
      { hint: 'Soda', rationale: 'Sweet effervescent carbonated soft drink category.' },
      { hint: 'Fizz', rationale: 'Carbon dioxide bubbles effervescing in glass.' },
      { hint: 'Script', rationale: 'Flowing Spencerian white cursive wordmark.' }
    ],
    easy: [
      { hint: 'Red', rationale: 'Bright crimson hue of cans and delivery trucks.' },
      { hint: 'Drink', rationale: 'Cold refreshing beverage served over ice.' },
      { hint: 'Can', rationale: 'Twelve-ounce aluminum cylinder popped open.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Global carbonated soda icon in red cans and contour bottles.' }
  },
  {
    word: 'Google',
    subtle: [
      { hint: 'PageRank', rationale: 'Original link-analysis algorithm patented by founders.' },
      { hint: 'Googol', rationale: 'Mathematical digit one followed by one hundred zeros.' },
      { hint: 'Mountainview', rationale: 'California campus city housing the Googleplex.' }
    ],
    balanced: [
      { hint: 'Search', rationale: 'Core internet web index answering billions of queries.' },
      { hint: 'Browser', rationale: 'Chrome application dominating web navigation.' },
      { hint: 'Android', rationale: 'Open-source mobile operating system powering phones.' }
    ],
    easy: [
      { hint: 'Internet', rationale: 'World wide web indexed and organized.' },
      { hint: 'Query', rationale: 'Text entered into clean white homepage bar.' },
      { hint: 'Answers', rationale: 'Instant information returned across ranked links.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Search engine titan organizing the world information.' }
  },
  {
    word: 'Disney',
    subtle: [
      { hint: 'Steamboat', rationale: 'Black and white animated short debuting synchronized sound.' },
      { hint: 'Imagineer', rationale: 'Creative engineering title designing theme park rides.' },
      { hint: 'Vault', rationale: 'Historical practice restricting home video releases.' }
    ],
    balanced: [
      { hint: 'Castle', rationale: 'Fairy tale spires forming iconic opening studio logo.' },
      { hint: 'Mickey', rationale: 'Whimsical round-eared cartoon mouse mascot.' },
      { hint: 'Kingdom', rationale: 'Theme park resort in Florida and California.' }
    ],
    easy: [
      { hint: 'Animation', rationale: 'Classic hand-drawn and digital feature cartoons.' },
      { hint: 'Movies', rationale: 'Family cinema entertainment franchise.' },
      { hint: 'Magic', rationale: 'Whimsical brand theme celebrated by fans.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Entertainment empire of theme parks, animated classics, and Mickey.' }
  },
  {
    word: 'Lego',
    subtle: [
      { hint: 'Billund', rationale: 'Danish carpentry village where wooden toys originated.' },
      { hint: 'ABS', rationale: 'High-precision durable thermoplastic molded to micro-tolerances.' },
      { hint: 'Leg-godt', rationale: 'Danish phrase meaning play well inspiring company name.' }
    ],
    balanced: [
      { hint: 'Bricks', rationale: 'Interlocking plastic blocks with studs and tubes.' },
      { hint: 'Studs', rationale: 'Round circular raised bumps interlocking atop blocks.' },
      { hint: 'Minifigure', rationale: 'Articulated yellow plastic smiling toy person.' }
    ],
    easy: [
      { hint: 'Toy', rationale: 'Childhood creative construction play sets.' },
      { hint: 'Build', rationale: 'Assembling castles and spaceships from step-by-step booklets.' },
      { hint: 'Plastic', rationale: 'Colorful injection-molded components.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Danish interlocking plastic brick construction toy titan.' }
  },
  {
    word: 'Spotify',
    subtle: [
      { hint: 'Discover', rationale: 'Weekly algorithmic playlist recommending new tracks.' },
      { hint: 'Wrapped', rationale: 'Viral year-end infographic revealing personal listening habits.' },
      { hint: 'Stockholm', rationale: 'Swedish capital where streaming audio service launched.' }
    ],
    balanced: [
      { hint: 'Streaming', rationale: 'Instant on-demand audio delivery without downloading.' },
      { hint: 'Playlist', rationale: 'Curated sequence of songs organized by genre or mood.' },
      { hint: 'Podcasts', rationale: 'Spoken episodic audio shows hosted on platform.' }
    ],
    easy: [
      { hint: 'Music', rationale: 'Tens of millions of licensed songs in pocket.' },
      { hint: 'Songs', rationale: 'Audio tracks played through headphones.' },
      { hint: 'Listen', rationale: 'Auditory enjoyment on mobile and desktop app.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Swedish audio streaming platform with playlists and Wrapped.' }
  },
  {
    word: 'Netflix',
    subtle: [
      { hint: 'Red-envelope', rationale: 'Original DVD mail delivery packaging before streaming.' },
      { hint: 'Ta-dum', rationale: 'Iconic two-note sonic intro branding opening screens.' },
      { hint: 'Binge', rationale: 'Cultural habit of watching entire seasons in one sitting.' }
    ],
    balanced: [
      { hint: 'Streaming', rationale: 'Instant digital video playback over high-speed internet.' },
      { hint: 'Series', rationale: 'Original television seasons produced in-house.' },
      { hint: 'Movies', rationale: 'Vast catalogue of feature films and documentaries.' }
    ],
    easy: [
      { hint: 'Subscription', rationale: 'Monthly fee providing unlimited screen access.' },
      { hint: 'Television', rationale: 'Living room app watched on smart screens.' },
      { hint: 'Watch', rationale: 'Viewing entertainment content from comfort of couch.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Pioneering subscription streaming service for movies and TV.' }
  },
  {
    word: 'Nintendo',
    subtle: [
      { hint: 'Hanafuda', rationale: 'Traditional Japanese playing cards manufactured in 1889.' },
      { hint: 'Kyoto', rationale: 'Historic Japanese city headquarters of company.' },
      { hint: 'D-pad', rationale: 'Cross-shaped directional control pad invented for Game & Watch.' }
    ],
    balanced: [
      { hint: 'Switch', rationale: 'Hybrid console transitioning seamlessly from TV to handheld.' },
      { hint: 'Mario', rationale: 'Mustachioed platformer mascot exploring Mushroom Kingdom.' },
      { hint: 'Console', rationale: 'Dedicated hardware system designed for family gaming.' }
    ],
    easy: [
      { hint: 'Gaming', rationale: 'Interactive video game entertainment industry.' },
      { hint: 'Japanese', rationale: 'East Asian cultural heritage and toy pioneer.' },
      { hint: 'Play', rationale: 'Family-friendly interactive pastime.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Beloved Japanese gaming pioneer behind Mario and Switch.' }
  },
  {
    word: 'Tesla',
    subtle: [
      { hint: 'Gigafactory', rationale: 'Massive automated battery and vehicle manufacturing plant.' },
      { hint: 'Supercharger', rationale: 'High-voltage proprietary fast-charging station network.' },
      { hint: 'Ludicrous', rationale: 'Acceleration mode hitting 60 mph in under three seconds.' }
    ],
    balanced: [
      { hint: 'Autopilot', rationale: 'Camera-based driver assistance highway navigation.' },
      { hint: 'Battery', rationale: 'Floorpan lithium-ion cell pack powering electric motors.' },
      { hint: 'Sedan', rationale: 'Model S and Model 3 aerodynamic family vehicles.' }
    ],
    easy: [
      { hint: 'Electric', rationale: 'Battery powertrain replacing gasoline engines.' },
      { hint: 'Car', rationale: 'Motorized automobile driving on highways.' },
      { hint: 'Musk', rationale: 'Prominent eccentric CEO executive leading brand.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Electric automobile automaker revolutionizing battery transport.' }
  },
  {
    word: 'Starbucks',
    subtle: [
      { hint: 'Pikeplace', rationale: 'Seattle public market where original beans shop opened in 1971.' },
      { hint: 'Siren', rationale: 'Twin-tailed mythological sea mermaid in circular green logo.' },
      { hint: 'Frappuccino', rationale: 'Blended iced coffee beverage topped with whipped cream.' }
    ],
    balanced: [
      { hint: 'Barista', rationale: 'Apron-wearing staff pulling shots and steaming milk.' },
      { hint: 'Espresso', rationale: 'Dark roasted coffee shot forming base of drinks.' },
      { hint: 'Cup', rationale: 'White cardboard takeaway cup with green sleeve.' }
    ],
    easy: [
      { hint: 'Coffee', rationale: 'Core hot caffeinated beverage brewed daily.' },
      { hint: 'Cafe', rationale: 'Corner storefront with leather armchairs and Wi-Fi.' },
      { hint: 'Green', rationale: 'Dominant corporate logo and apron color.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Global coffeehouse chain famed for green siren and lattes.' }
  },
  {
    word: 'Ikea',
    subtle: [
      { hint: 'Allen', rationale: 'Hexagonal L-shaped metal key supplied with hardware.' },
      { hint: 'Småland', rationale: 'Swedish province origin and in-store children play ball pit.' },
      { hint: 'Billy', rationale: 'Iconic bestselling standardized bookcase unit.' }
    ],
    balanced: [
      { hint: 'Meatballs', rationale: 'Swedish cafeteria dish served with lingonberry jam.' },
      { hint: 'Flatpack', rationale: 'Cardboard carton packing knocked-down furniture panels.' },
      { hint: 'Showroom', rationale: 'Maze-like floor plan displaying furnished rooms.' }
    ],
    easy: [
      { hint: 'Furniture', rationale: 'Chairs, desks, beds, and tables sold for homes.' },
      { hint: 'Swedish', rationale: 'Nordic national heritage in blue and yellow colors.' },
      { hint: 'Assemble', rationale: 'DIY customer assembly using pictorial instruction booklets.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Swedish flatpack furniture giant famous for DIY assembly.' }
  },
  {
    word: 'Adidas',
    subtle: [
      { hint: 'Dassler', rationale: 'Bavarian cobbler Adi who founded company after sibling rift.' },
      { hint: 'Boost', rationale: 'Expanded thermoplastic polyurethane midsole cushioning pellet foam.' },
      { hint: 'Stan-Smith', rationale: 'Classic clean white leather tennis court shoe.' }
    ],
    balanced: [
      { hint: 'Stripes', rationale: 'Three parallel diagonal lines branding sneakers and tracksuits.' },
      { hint: 'Trefoil', rationale: 'Three-leaf vintage botanical heritage logo.' },
      { hint: 'Tracksuit', rationale: 'Zip-up polyester athletic warm-up jacket and pants.' }
    ],
    easy: [
      { hint: 'Sneakers', rationale: 'Athletic footwear worn for sports and street style.' },
      { hint: 'Sport', rationale: 'Global athletic performance apparel industry.' },
      { hint: 'German', rationale: 'Bavarian European national corporate home.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'German sportswear powerhouse renowned for the three stripes.' }
  },
  {
    word: 'McDonalds',
    subtle: [
      { hint: 'Kroc', rationale: 'Ray who franchised the brothers California hamburger stand.' },
      { hint: 'Playplace', rationale: 'Indoor plastic tunnel and ball pit play maze for kids.' },
      { hint: 'Drive-thru', rationale: 'Curbside window ordering meals from car seat.' }
    ],
    balanced: [
      { hint: 'Arches', rationale: 'Golden M-shaped yellow architectural neon sign.' },
      { hint: 'Bigmac', rationale: 'Double-decker hamburger with special secret sauce.' },
      { hint: 'Happy', rationale: 'Meal box packaged with toy prize for children.' }
    ],
    easy: [
      { hint: 'Burger', rationale: 'Beef patty on sesame bun with pickles and ketchup.' },
      { hint: 'Fries', rationale: 'Golden crispy shoestring salted potato batons.' },
      { hint: 'Fastfood', rationale: 'Speedy inexpensive restaurant chain dining.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Global fast-food giant famed for golden arches and Big Macs.' }
  },
  {
    word: 'Amazon',
    subtle: [
      { hint: 'Bezos', rationale: 'Founder who started online bookstore in Seattle garage.' },
      { hint: 'Smile', rationale: 'Curved arrow in logo pointing from letter A to letter Z.' },
      { hint: 'AWS', rationale: 'Cloud computing division powering massive web infrastructure.' }
    ],
    balanced: [
      { hint: 'Prime', rationale: 'Subscription program offering two-day free shipping.' },
      { hint: 'Delivery', rationale: 'Fleet of dark blue vans dropping parcels on doorsteps.' },
      { hint: 'Cardboard', rationale: 'Brown shipping cartons sealed with paper tape.' }
    ],
    easy: [
      { hint: 'Shopping', rationale: 'Purchasing millions of products online.' },
      { hint: 'Packages', rationale: 'Boxes delivered directly to home doors.' },
      { hint: 'Online', rationale: 'Digital retail marketplace platform.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'E-commerce behemoth delivering packages with Prime vans.' }
  },
  {
    word: 'PlayStation',
    subtle: [
      { hint: 'DualSense', rationale: 'Wireless controller featuring adaptive trigger resistance.' },
      { hint: 'Symbols', rationale: 'Triangle, circle, cross, and square face buttons.' },
      { hint: 'Kutaragi', rationale: 'Sony engineer regarded as father of the console.' }
    ],
    balanced: [
      { hint: 'Console', rationale: 'Living room hardware plugged into TV.' },
      { hint: 'Controller', rationale: 'Wireless gamepad gripped with twin analog thumbsticks.' },
      { hint: 'Sony', rationale: 'Japanese electronics parent company.' }
    ],
    easy: [
      { hint: 'Gaming', rationale: 'Interactive video game platform.' },
      { hint: 'Play', rationale: 'Enjoying blockbusters like God of War and Spider-Man.' },
      { hint: 'Games', rationale: 'Disc and digital interactive entertainment library.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Sony home gaming console franchise with iconic geometric buttons.' }
  },
  {
    word: 'Ferrari',
    subtle: [
      { hint: 'Maranello', rationale: 'Northern Italian factory town where supercars are crafted.' },
      { hint: 'Scuderia', rationale: 'Historic racing stable competing in Formula 1 since 1950.' },
      { hint: 'Enzo', rationale: 'Passionate founder whose name graces flagship supercar.' }
    ],
    balanced: [
      { hint: 'Horse', rationale: 'Black prancing stallion emblem on yellow shield.' },
      { hint: 'Rosso', rationale: 'Corse iconic bright red racing livery paint.' },
      { hint: 'Supercar', rationale: 'Exotic mid-engine high-performance vehicle.' }
    ],
    easy: [
      { hint: 'Red', rationale: 'Signature fiery paint color of Italian sports cars.' },
      { hint: 'Fast', rationale: 'Blistering acceleration and top speeds.' },
      { hint: 'Italian', rationale: 'Country of automotive passion and craftsmanship.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Italian luxury supercar icon bearing the prancing horse.' }
  },
  {
    word: 'Samsung',
    subtle: [
      { hint: 'Chaebol', rationale: 'Massive South Korean family-controlled corporate conglomerate.' },
      { hint: 'Suwon', rationale: 'Digital City corporate headquarters complex in Korea.' },
      { hint: 'Three-stars', rationale: 'Korean literal translation of founding corporate moniker.' }
    ],
    balanced: [
      { hint: 'Galaxy', rationale: 'Flagship Android smartphone and tablet hardware line.' },
      { hint: 'Displays', rationale: 'Global market leader producing AMOLED television panels.' },
      { hint: 'Korean', rationale: 'East Asian nation where tech giant is based.' }
    ],
    easy: [
      { hint: 'Phones', rationale: 'Mobile devices competing with iPhone worldwide.' },
      { hint: 'Electronics', rationale: 'Consumer appliances, chips, and televisions.' },
      { hint: 'Television', rationale: 'Living room flat screens and smart displays.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'South Korean tech conglomerate producing Galaxy phones and TVs.' }
  },
  {
    word: 'Rolex',
    subtle: [
      { hint: 'Oyster', rationale: 'World first waterproof hermetically sealed wristwatch case.' },
      { hint: 'Submariner', rationale: 'Classic luxury stainless steel diving watch icon.' },
      { hint: 'Geneva', rationale: 'Swiss lakeside city of headquarters manufacture.' }
    ],
    balanced: [
      { hint: 'Crown', rationale: 'Five-pointed golden coronet logo above brand text.' },
      { hint: 'Luxury', rationale: 'Status symbol and high-end horological investment.' },
      { hint: 'Swiss', rationale: 'Nation synonymous with precision horology.' }
    ],
    easy: [
      { hint: 'Watch', rationale: 'Precision mechanical timepiece worn on wrist.' },
      { hint: 'Gold', rationale: 'Precious metal crafted into luxury bezels and bands.' },
      { hint: 'Time', rationale: 'Mechanical chronometer measuring hours precisely.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Swiss luxury mechanical watchmaker with the golden crown logo.' }
  },
  {
    word: 'Target',
    subtle: [
      { hint: 'Minneapolis', rationale: 'Twin Cities headquarters where chain was founded.' },
      { hint: 'Cartwheel', rationale: 'Former savings app integrated into store rewards.' },
      { hint: 'Up-and-up', rationale: 'Everyday household store brand with arrow packaging.' }
    ],
    balanced: [
      { hint: 'Bullseye', rationale: 'Red and white concentric circle logo.' },
      { hint: 'Dog', rationale: 'White bull terrier mascot with painted red eye patch.' },
      { hint: 'Retail', rationale: 'Big-box discount department store shopping.' }
    ],
    easy: [
      { hint: 'Red', rationale: 'Vibrant corporate branding color throughout aisles.' },
      { hint: 'Shopping', rationale: 'Purchasing clothes, groceries, and decor in store.' },
      { hint: 'Store', rationale: 'Large suburban department store venue.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'American big-box retail department store with red bullseye logo.' }
  },
  {
    word: 'Gucci',
    subtle: [
      { hint: 'Horsebit', rationale: 'Metal equestrian bridle hardware adorning leather loafers.' },
      { hint: 'Florence', rationale: 'Tuscan leather craftsmanship cradle of the fashion house.' },
      { hint: 'Bamboo', rationale: 'Curved heated cane handle on iconic luxury handbag.' }
    ],
    balanced: [
      { hint: 'Handbags', rationale: 'High-end leather purses carried on fashion runways.' },
      { hint: 'Luxury', rationale: 'Exclusive designer couture fashion status.' },
      { hint: 'Fashion', rationale: 'Italian haute couture designer runway collections.' }
    ],
    easy: [
      { hint: 'Italian', rationale: 'Mediterranean European nation of design origin.' },
      { hint: 'Designer', rationale: 'Prestigious runway fashion label.' },
      { hint: 'Leather', rationale: 'Fine grain material crafted into belts and bags.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Florentine luxury fashion house famed for leather handbags.' }
  },
  {
    word: 'eBay',
    subtle: [
      { hint: 'Omidyar', rationale: 'Founder Pierre who launched AuctionWeb on Labor Day 1995.' },
      { hint: 'Laser-pointer', rationale: 'Broken classroom device sold as first transaction.' },
      { hint: 'Feedback', rationale: 'Star score rating seller trustworthiness and reliability.' }
    ],
    balanced: [
      { hint: 'Auction', rationale: 'Bidding system selling items to highest bidder at timer.' },
      { hint: 'Bidding', rationale: 'Submitting competitive incremental monetary offers.' },
      { hint: 'Collectibles', rationale: 'Vintage toys, trading cards, and rare coins traded.' }
    ],
    easy: [
      { hint: 'Online', rationale: 'Internet marketplace website connecting buyers and sellers.' },
      { hint: 'Sell', rationale: 'Listing secondhand goods to clear clutter.' },
      { hint: 'Buy', rationale: 'Purchasing items using Buy It Now or winning bids.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Online marketplace pioneer famous for auctions and bidding.' }
  },
  {
    word: 'Microsoft',
    subtle: [
      { hint: 'Redmond', rationale: 'Washington state wooded corporate campus city.' },
      { hint: 'Clippy', rationale: 'Animated paperclip assistant offering advice in Word.' },
      { hint: 'Ballmer', rationale: 'High-energy former CEO famous for developers chant.' }
    ],
    balanced: [
      { hint: 'Windows', rationale: 'Dominant PC operating system deployed globally.' },
      { hint: 'Office', rationale: 'Productivity suite of Word, Excel, and PowerPoint.' },
      { hint: 'Xbox', rationale: 'Gaming console division competing in living room.' }
    ],
    easy: [
      { hint: 'Software', rationale: 'Computer programs written for work and productivity.' },
      { hint: 'Computer', rationale: 'Personal PC machines powered by operating system.' },
      { hint: 'Gates', rationale: 'Billionaire co-founder Bill who started company.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Software giant behind Windows, Office, and Xbox.' }
  },
  {
    word: 'Harley-Davidson',
    subtle: [
      { hint: 'Milwaukee', rationale: 'Wisconsin industrial city where founding shed stood.' },
      { hint: 'V-twin', rationale: 'Forty-five-degree dual-cylinder engine layout.' },
      { hint: 'Hog', rationale: 'Colloquial acronym and ticker symbol for large cruisers.' }
    ],
    balanced: [
      { hint: 'Cruiser', rationale: 'Low-slung heavy touring bike with forward footpegs.' },
      { hint: 'Leather', rationale: 'Heavy jackets and chaps worn by biker clubs.' },
      { hint: 'Rumble', rationale: 'Distinct potato-potato exhaust idle sound.' }
    ],
    easy: [
      { hint: 'Motorcycle', rationale: 'Two-wheeled open highway touring machine.' },
      { hint: 'Ride', rationale: 'Cruising open American highways on two wheels.' },
      { hint: 'Chrome', rationale: 'Polished shiny metal pipes and engine covers.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'American cruiser motorcycle legend known for rumbling V-twins.' }
  },
  {
    word: 'YouTube',
    subtle: [
      { hint: 'Jawad', rationale: 'Co-founder Karim standing in front of elephants in first clip.' },
      { hint: 'Monetize', rationale: 'Ad revenue split allowing creators to earn living.' },
      { hint: 'Sanbruno', rationale: 'California headquarters city housing video platform.' }
    ],
    balanced: [
      { hint: 'Subscribe', rationale: 'Clicking button to follow creator channel uploads.' },
      { hint: 'Creator', rationale: 'Content producer filming vlogs and tutorials.' },
      { hint: 'Channels', rationale: 'Personal video pages organizing broadcast uploads.' }
    ],
    easy: [
      { hint: 'Video', rationale: 'Moving picture clips watched by billions daily.' },
      { hint: 'Watch', rationale: 'Streaming clips on phones and smart televisions.' },
      { hint: 'Red', rationale: 'Color of play button icon badge.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'World largest video sharing and streaming website.' }
  },
  {
    word: 'Vans',
    subtle: [
      { hint: 'Waffle', rationale: 'Distinctive vulcanized rubber outsole grid pattern.' },
      { hint: 'Anaheim', rationale: 'Southern California birthplace of Van Doren rubber shoes.' },
      { hint: 'Sidestripe', rationale: 'Jazz stripe doodle drawn by founder along shoe flank.' }
    ],
    balanced: [
      { hint: 'Checkerboard', rationale: 'Black and white square pattern on slip-on canvas.' },
      { hint: 'Skateboarding', rationale: 'Southern California street sport culture embracing brand.' },
      { hint: 'Canvas', rationale: 'Cotton fabric upper stitched over rubber soles.' }
    ],
    easy: [
      { hint: 'Sneakers', rationale: 'Casual low-top footwear slipped on daily.' },
      { hint: 'Shoes', rationale: 'Footwear worn by skaters and casual youth.' },
      { hint: 'Slip-on', rationale: 'Laceless shoe model kicked on in seconds.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'California skate shoe brand famous for checkerboard slip-ons.' }
  },
  {
    word: 'Puma',
    subtle: [
      { hint: 'Herzogenaurach', rationale: 'Bavarian town split by river between rival brothers.' },
      { hint: 'Formstrip', rationale: 'Curved stabilizing leather side pattern on sneakers.' },
      { hint: 'Suede', rationale: 'Soft napped leather basketball classic sneaker from 1968.' }
    ],
    balanced: [
      { hint: 'Feline', rationale: 'Leaping wild mountain cat in jumping silhouette logo.' },
      { hint: 'Soccer', rationale: 'Boots worn by legends like Pelé, Maradona, and Neymar.' },
      { hint: 'Sprint', rationale: 'Gold spikes worn by fastest human Usain Bolt.' }
    ],
    easy: [
      { hint: 'Sneakers', rationale: 'Athletic footwear designed for track and street.' },
      { hint: 'Sport', rationale: 'Global athletic performance and lifestyle brand.' },
      { hint: 'German', rationale: 'Bavarian heritage of footwear manufacturer.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'German sports brand featuring the leaping feline logo.' }
  },
  {
    word: 'Visa',
    subtle: [
      { hint: 'Dee-hock', rationale: 'Visionary founder who conceived decentralized bank network.' },
      { hint: 'Interchange', rationale: 'Fee split between merchant and issuing bank on swipes.' },
      { hint: 'Everywhere', rationale: 'Famous slogan claiming acceptance everywhere you want to be.' }
    ],
    balanced: [
      { hint: 'Credit', rationale: 'Borrowing transaction line billed at month end.' },
      { hint: 'Debit', rationale: 'Direct withdrawal from linked checking account.' },
      { hint: 'Chip', rationale: 'Embedded metallic smart card contact for security.' }
    ],
    easy: [
      { hint: 'Payment', rationale: 'Settling bill at cash register counter.' },
      { hint: 'Card', rationale: 'Plastic rectangle carried in leather wallet.' },
      { hint: 'Swipe', rationale: 'Gliding card through merchant terminal.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Global payment network card carried in wallets everywhere.' }
  },
  {
    word: 'Sony',
    subtle: [
      { hint: 'Morita', rationale: 'Co-founder Akio who championed portable transistor audio.' },
      { hint: 'Trinitron', rationale: 'Aperture-grille cathode ray tube setting television standard.' },
      { hint: 'Betamax', rationale: 'High-quality videocassette format losing tape war.' }
    ],
    balanced: [
      { hint: 'Walkman', rationale: 'Revolutionary portable cassette player with lightweight headphones.' },
      { hint: 'PlayStation', rationale: 'Global video game console hardware line.' },
      { hint: 'Cameras', rationale: 'Mirrorless Alpha digital photography bodies.' }
    ],
    easy: [
      { hint: 'Electronics', rationale: 'Consumer tech audio, video, and gaming devices.' },
      { hint: 'Japanese', rationale: 'Tokyo technology and media conglomerate.' },
      { hint: 'Television', rationale: 'Bravia flat screen displays in living rooms.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Tokyo electronics and entertainment titan behind Walkman and PlayStation.' }
  },
  {
    word: 'Red Bull',
    subtle: [
      { hint: 'Mateschitz', rationale: 'Austrian marketer who adapted Thai tonic Krating Daeng.' },
      { hint: 'Stratos', rationale: 'Felix Baumgartner record supersonic parachute jump from edge of space.' },
      { hint: 'Taurine', rationale: 'Amino acid ingredient blended into stimulating recipe.' }
    ],
    balanced: [
      { hint: 'Wings', rationale: 'Famous marketing slogan promising to give you wings.' },
      { hint: 'Energy', rationale: 'High-caffeine physical and mental alertness boost.' },
      { hint: 'Extreme', rationale: 'Sponsorship of cliff diving, air races, and F1.' }
    ],
    easy: [
      { hint: 'Drink', rationale: 'Chilled canned functional beverage.' },
      { hint: 'Can', rationale: 'Silver and blue slim aluminum cylinder.' },
      { hint: 'Caffeine', rationale: 'Stimulant providing rapid energy kick.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Energy drink giant famous for giving you wings and extreme sports.' }
  },
  {
    word: 'Porsche',
    subtle: [
      { hint: 'Stuttgart', rationale: 'German automotive industrial city home to headquarters.' },
      { hint: 'Boxer', rationale: 'Horizontally opposed six-cylinder engine layout.' },
      { hint: 'Le-Mans', rationale: 'Twenty-Four hour endurance race won record 19 times.' }
    ],
    balanced: [
      { hint: 'Nine-eleven', rationale: 'Rear-engine iconic sports car silhouette produced since 1964.' },
      { hint: 'Supercar', rationale: 'Precision-engineered German high-speed performance automobile.' },
      { hint: 'Coupe', rationale: 'Sloping fastback roofline of two-door sports car.' }
    ],
    easy: [
      { hint: 'Fast', rationale: 'High acceleration and autobahn speeds.' },
      { hint: 'German', rationale: 'European nation of precision automotive engineering.' },
      { hint: 'Car', rationale: 'High-performance luxury sports vehicle.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'German sports car marque famed for the rear-engine 911.' }
  },
  {
    word: 'Twitch',
    subtle: [
      { hint: 'Emotes', rationale: 'Kappa and PogChamp illustrated chat reaction icons.' },
      { hint: 'Bits', rationale: 'Virtual currency tipped in chat to cheer streamers.' },
      { hint: 'Raid', rationale: 'Sending viewers to another channel when ending broadcast.' }
    ],
    balanced: [
      { hint: 'Streamer', rationale: 'Creator broadcasting gameplay with facecam and headset.' },
      { hint: 'Chat', rationale: 'Fast-scrolling viewer text window reacting live.' },
      { hint: 'Livestream', rationale: 'Real-time unedited video broadcast over web.' }
    ],
    easy: [
      { hint: 'Gaming', rationale: 'Live gameplay footage watched by millions.' },
      { hint: 'Purple', rationale: 'Corporate brand color of site and app.' },
      { hint: 'Watch', rationale: 'Viewing favorite creators play games in real time.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Live streaming platform popular for gaming and purple chat.' }
  },
  {
    word: 'Subway',
    subtle: [
      { hint: 'DeLuca', rationale: 'Fred who borrowed one thousand dollars in 1965 to fund shop.' },
      { hint: 'Footlong', rationale: 'Twelve-inch sandwich size celebrated in promotional jingle.' },
      { hint: 'Herbs', rationale: 'Italian cheese and oregano seasoning baked onto bread.' }
    ],
    balanced: [
      { hint: 'Sandwich', rationale: 'Split sub roll loaded with meats, cheese, and veggies.' },
      { hint: 'Artist', rationale: 'Title bestowed on staff assembling customized orders.' },
      { hint: 'Toasted', rationale: 'Sandwich warmed under high-speed infrared oven.' }
    ],
    easy: [
      { hint: 'Bread', rationale: 'Footlong rolls baked fresh daily in store ovens.' },
      { hint: 'Fastfood', rationale: 'Quick-service chain boasting thousands of locations.' },
      { hint: 'Eat', rationale: 'Casual dining meal grabbed on lunch break.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Global sandwich chain famed for customizable footlong subs.' }
  },
  {
    word: 'Heineken',
    subtle: [
      { hint: 'A-yeast', rationale: 'Proprietary bottom-fermenting strain developed in 1886.' },
      { hint: 'Pilsner', rationale: 'Pale golden lager style originating in central Europe.' },
      { hint: 'Hops', rationale: 'Bitter aromatic flowers flavoring brewed malt liquid.' }
    ],
    balanced: [
      { hint: 'Lager', rationale: 'Crisp cold-fermented golden alcoholic beverage.' },
      { hint: 'Brewery', rationale: 'Industrial facility fermenting malt, water, and hops.' },
      { hint: 'Star', rationale: 'Red five-pointed star emblem centered on label.' }
    ],
    easy: [
      { hint: 'Beer', rationale: 'Alcoholic beverage served cold in pubs.' },
      { hint: 'Green', rationale: 'Color of glass bottle and aluminum can.' },
      { hint: 'Dutch', rationale: 'Amsterdam Netherlands heritage and origin.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'Dutch pale lager brewery in green bottles with red star.' }
  },
  {
    word: 'Audi',
    subtle: [
      { hint: 'Horch', rationale: 'Founder August whose German surname meaning listen was translated to Latin.' },
      { hint: 'Ingolstadt', rationale: 'Bavarian industrial city where headquarters museum stands.' },
      { hint: 'Vorsprung', rationale: 'First word of famous slogan meaning advancement through tech.' }
    ],
    balanced: [
      { hint: 'Rings', rationale: 'Four interlocking silver circles symbolizing four merged automakers.' },
      { hint: 'Quattro', rationale: 'Permanent all-wheel-drive rally and road powertrain.' },
      { hint: 'Sedan', rationale: 'A4 and A6 German executive road vehicles.' }
    ],
    easy: [
      { hint: 'Car', rationale: 'Automotive vehicle cruising highways.' },
      { hint: 'German', rationale: 'European nation of precision engineering.' },
      { hint: 'Luxury', rationale: 'Premium automotive status competing with BMW and Mercedes.' }
    ],
    editorial: { wordFamiliarity: 'high', hintFamiliarity: 'high', semanticStrength: 'strong', culturalAccessibility: 'global', multiImposterFairness: 'balanced', recommendation: 'strong_candidate', notes: 'German luxury car manufacturer recognized by four interlocking rings.' }
  }
];

// Clean any special characters in hints
brands.forEach(item => {
  [...item.subtle, ...item.balanced, ...item.easy].forEach(h => {
    h.hint = h.hint.replace(/[^a-zA-Z0-9]/g, '');
  });
});

fs.writeFileSync('scripts/curated_vocabulary/part14_brands.json', JSON.stringify({ brands }, null, 2), 'utf8');
console.log('Successfully wrote part14_brands.json (35 words)');
