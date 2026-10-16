export interface CountryballStats {
  defense: number;     // 0-100
  mining: number;      // 0-100
  culture: number;     // 0-100
  science: number;     // 0-100
  speed: number;       // 0-100
  space: number;       // 0-100 (Poland = 0!)
}

export interface CountryballData {
  id: number;
  name: string;
  officialName: string;
  commonName: string;
  capital: string;
  region: 'Europe' | 'Americas' | 'Asia' | 'Africa' | 'Oceania' | 'Middle East';
  color: string;
  flag: string;
  motto: string;
  polandballQuote: string;
  iconicProp: string;
  lorePerk: string;
  historicalEra: string;
  historicalFacts: [string, string, string];
  polandballTrivia: string;
  stats: CountryballStats;
}

export const COUNTRYBALLS_DATA: CountryballData[] = [
  // 1. Poland
  {
    id: 5,
    name: 'Poland',
    officialName: 'Republic of Poland',
    commonName: 'Polandball',
    capital: 'Warsaw',
    region: 'Europe',
    color: 'bg-white',
    flag: 'linear-gradient(to bottom, #dc2626 50%, #ffffff 50%)',
    motto: 'Bóg, Honor, Ojczyzna (God, Honor, Fatherland)',
    polandballQuote: 'Poland CAN into space! ...wait, no into space?! Kurwa!',
    iconicProp: 'Legendary Head Plunger',
    lorePerk: '+30% Jump Boost & Swift Earth Excavation. Immune to existential despair.',
    historicalEra: '966 AD (Baptism of Mieszko I)',
    historicalFacts: [
      'Europe’s first written constitution, the Constitution of 3 May 1791, was drafted and adopted in Poland-Lithuania.',
      'Polish cryptologists Marian Rejewski, Jerzy Różycki, and Henryk Zygalski first broke the military Enigma code in 1932 before WWII.',
      'Warsaw’s historic Old Town was rebuilt almost brick-by-brick from 18th-century Bernardo Bellotto landscape paintings after WWII devastation.'
    ],
    polandballTrivia: 'The original protagonist of the Polandball meme genre created in 2009 by user "Falco". The flag is traditionally inverted (red on top, white on bottom) by canon rule!',
    stats: { defense: 68, mining: 74, culture: 88, science: 82, speed: 70, space: 0 }
  },

  // 2. USA
  {
    id: 1,
    name: 'USA',
    officialName: 'United States of America',
    commonName: 'Americaball',
    capital: 'Washington, D.C.',
    region: 'Americas',
    color: 'bg-blue-700',
    flag: 'linear-gradient(to bottom, #b91c1c 25%, #ffffff 25%, #ffffff 50%, #b91c1c 50%, #b91c1c 75%, #ffffff 75%)',
    motto: 'In God We Trust / E Pluribus Unum',
    polandballQuote: 'Did somebody say... OIL?! Freedom and double cheeseburgers on the way!',
    iconicProp: 'Cool Aviator Sunglasses',
    lorePerk: '+35% Rare Ore Discovery & High-Impact Pickaxe Knockback.',
    historicalEra: '1776 (Declaration of Independence)',
    historicalFacts: [
      'The Apollo 11 moon mission achieved the first crewed lunar landing on July 20, 1969, fulfilling Neil Armstrong\'s historic lunar walk.',
      'The U.S. National Park System was born with Yellowstone in 1872, inspiring global nature conservation worldwide.',
      'Invented aviation with the Wright Brothers at Kitty Hawk (1903) and the global ARPANET internet precursor in 1969.'
    ],
    polandballTrivia: 'Always wears sunglasses, loves aircraft carriers, and assumes every unexplored cave system must hold untapped petroleum reserves.',
    stats: { defense: 98, mining: 90, culture: 89, science: 96, speed: 85, space: 100 }
  },

  // 3. United Kingdom
  {
    id: 6,
    name: 'UK',
    officialName: 'United Kingdom of Great Britain and Northern Ireland',
    commonName: 'Britainball',
    capital: 'London',
    region: 'Europe',
    color: 'bg-blue-800',
    flag: 'radial-gradient(circle, #dc2626 22%, #1e3a8a 23%)',
    motto: 'Dieu et mon droit (God and my right)',
    polandballQuote: 'Pip pip, cheerio! Time for afternoon tea and Victorian industrial dominance!',
    iconicProp: 'Aristocratic Top Hat & Monocle',
    lorePerk: '+40% Castle Architecture Fortress HP & Naval Fleet Navigation.',
    historicalEra: '1707 (Acts of Union)',
    historicalFacts: [
      'Birthplace of the Industrial Revolution in the 18th century, inventing steam locomotives, modern textile factories, and iron bridges.',
      'The Magna Carta signed at Runnymede in 1215 established the fundamental rule of law limiting sovereign authority.',
      'Produced William Shakespeare, Isaac Newton, Charles Darwin, Ada Lovelace, and Alan Turing.'
    ],
    polandballTrivia: 'Refuses to go anywhere without a steaming porcelain cup of Earl Grey tea, speaks in dignified Queens English, and holds a gold monocle.',
    stats: { defense: 88, mining: 76, culture: 95, science: 94, speed: 72, space: 80 }
  },

  // 4. Germany
  {
    id: 9,
    name: 'Germany',
    officialName: 'Federal Republic of Germany',
    commonName: 'Germanyball',
    capital: 'Berlin',
    region: 'Europe',
    color: 'bg-black',
    flag: 'linear-gradient(to bottom, #171717 33%, #dc2626 33%, #dc2626 66%, #eab308 66%)',
    motto: 'Einigkeit und Recht und Freiheit (Unity and Justice and Freedom)',
    polandballQuote: 'Work must be done! Maximum engineering precision, no nonsense allowed!',
    iconicProp: 'Pickelhaube Brass Spike & Toolbelt',
    lorePerk: 'Ultra-Rapid Smelting & Automation. +45% Stone & Redstone Contraption Crafting Speed.',
    historicalEra: '1871 (Unification under Bismarck)',
    historicalFacts: [
      'Home to Johannes Gutenberg, who invented the movable-type printing press around 1440, launching the global information age.',
      'Carl Benz patented the first modern petrol-powered automobile, the Benz Patent-Motorwagen, in 1886.',
      'Pioneered modern theoretical physics through Albert Einstein, Max Planck, and Werner Heisenberg.'
    ],
    polandballTrivia: 'The relentless workaholic of Europe. Known in comic lore for transforming into "Reichtangle" when rules are broken.',
    stats: { defense: 86, mining: 88, culture: 87, science: 98, speed: 78, space: 88 }
  },

  // 5. France
  {
    id: 7,
    name: 'France',
    officialName: 'French Republic',
    commonName: 'Franceball',
    capital: 'Paris',
    region: 'Europe',
    color: 'bg-blue-600',
    flag: 'linear-gradient(to right, #2563eb 33%, #ffffff 33%, #ffffff 66%, #dc2626 66%)',
    motto: 'Liberté, Égalité, Fraternité (Liberty, Equality, Fraternity)',
    polandballQuote: 'Hon hon hon! A crispy warm baguette and revolutionary philosophy!',
    iconicProp: 'Artist Beret, Mustache & Baguette',
    lorePerk: 'Master Culinary Baker: All Bread and Pastries restore 2.5x Hunger & Heart Regeneration.',
    historicalEra: '843 AD (Treaty of Verdun)',
    historicalFacts: [
      'The French Revolution (1789) adopted the Declaration of the Rights of Man and of the Citizen, inspiring modern democratic republics.',
      'Constructed the Eiffel Tower in 1889 as the grand centerpiece for the World’s Fair, which stood as the world’s tallest human-made structure for 41 years.',
      'Home to the Enlightenment philosophers Voltaire, Rousseau, and Montesquieu, and Marie Curie, the first person to win two Nobel Prizes.'
    ],
    polandballTrivia: 'Laughs with a loud "hon hon hon", wields a freshly baked baguette like a fencing rapier, and claims ownership of the finest art in Europe.',
    stats: { defense: 84, mining: 70, culture: 99, science: 90, speed: 76, space: 86 }
  },

  // 6. Japan
  {
    id: 4,
    name: 'Japan',
    officialName: 'State of Japan',
    commonName: 'Japanball',
    capital: 'Tokyo',
    region: 'Asia',
    color: 'bg-white',
    flag: 'radial-gradient(circle, #dc2626 35%, #ffffff 36%)',
    motto: 'Peace and Harmony (Wa)',
    polandballQuote: 'Sugoi! Ultra high-speed Shinkansen precision and cute anime power!',
    iconicProp: 'Anime Nekomimi Cat Ears & Headband',
    lorePerk: 'High-Tech Artisan: 2x Tool Durability on all crafted Pickaxes, Swords & Redstone gadgets.',
    historicalEra: '660 BC (Traditional founding by Emperor Jimmu)',
    historicalFacts: [
      'Home to the world\'s oldest continuously operating business, Kongō Gumi, a Buddhist temple construction firm founded in 578 AD.',
      'Pioneered the modern high-speed rail era in 1964 with the Shinkansen Tokaido line between Tokyo and Osaka, operating with zero passenger fatalities.',
      'Origin of global gaming culture (Nintendo, PlayStation), manga, anime, and the world\'s highest concentration of robotics engineering.'
    ],
    polandballTrivia: 'Wears cute kitty cat ears, bows respectfully, and gets super excited whenever robotics or gaming consoles are mentioned.',
    stats: { defense: 80, mining: 72, culture: 98, science: 97, speed: 92, space: 90 }
  },

  // 7. Canada
  {
    id: 8,
    name: 'Canada',
    officialName: 'Canada',
    commonName: 'Canadaball',
    capital: 'Ottawa',
    region: 'Americas',
    color: 'bg-red-500',
    flag: 'linear-gradient(to right, #dc2626 30%, #ffffff 30%, #ffffff 70%, #dc2626 70%)',
    motto: 'A Mari Usque Ad Mare (From Sea to Sea)',
    polandballQuote: 'So sorry for chopping all your birch trees, eh! Have some warm maple syrup!',
    iconicProp: 'Lumberjack Trapper Fur Hat',
    lorePerk: 'Lumberjack Titan: Fells entire trees in one swing and collects 2x timber logs.',
    historicalEra: '1867 (Confederation / BNA Act)',
    historicalFacts: [
      'Contains more than 2 million lakes—holding roughly 20% of the entire planet\'s surface freshwater.',
      'Invented modern medical insulin in 1921 by Frederick Banting and Charles Best at the University of Toronto.',
      'Developed the robotic Canadarm for NASA Space Shuttles and the International Space Station, pivotal in assembling orbital stations.'
    ],
    polandballTrivia: 'The friendliest countryball in the world who apologizes profusely for winning games, but turns into a fierce hockey berserker on ice.',
    stats: { defense: 80, mining: 88, culture: 82, science: 88, speed: 76, space: 82 }
  },

  // 8. Italy
  {
    id: 41,
    name: 'Italy',
    officialName: 'Italian Republic',
    commonName: 'Italyball',
    capital: 'Rome',
    region: 'Europe',
    color: 'bg-green-600',
    flag: 'linear-gradient(to right, #009246 33%, #ffffff 33%, #ffffff 66%, #ce2b37 66%)',
    motto: 'L’Italia è una Repubblica democratica, fondata sul lavoro',
    polandballQuote: 'Mamma Mia! Never break spaghetti in half! Passion, pasta, and Renaissance!',
    iconicProp: 'Chef Toque Hat & Pizza Slice',
    lorePerk: '+50% Healing Potency from all meals. High artistic flair boosts structure aesthetics.',
    historicalEra: '753 BC (Founding of Rome) / 1861 (Unification)',
    historicalFacts: [
      'Birthplace of the Italian Renaissance in Florence, home to polymath Leonardo da Vinci, Michelangelo, Galileo Galilei, and Raphael.',
      'Possesses 60 UNESCO World Heritage sites, the highest total of any single country on Earth.',
      'Invented modern banking, the double-entry bookkeeping system, the battery (Volta), and the radio transmitter (Marconi).'
    ],
    polandballTrivia: 'Cannot speak without dramatic hand gestures, passionately defends authentic culinary traditions, and has an ancient Roman ancestor ball.',
    stats: { defense: 74, mining: 72, culture: 100, science: 86, speed: 78, space: 78 }
  },

  // 9. Russia
  {
    id: 3,
    name: 'Russia',
    officialName: 'Russian Federation',
    commonName: 'Russiaball',
    capital: 'Moscow',
    region: 'Europe',
    color: 'bg-blue-600',
    flag: 'linear-gradient(to bottom, #ffffff 33%, #0039a6 33%, #0039a6 66%, #d52b1e 66%)',
    motto: 'Rossiya – svyashchennaya nasha derzhava',
    polandballQuote: 'Winter is just warm summer for bear! Deep subterranean caverns are mine!',
    iconicProp: 'Furry Ushanka with Red Star',
    lorePerk: 'Cryo-Fortitude: Complete immunity to subzero freezing, blizzards, and powder snow.',
    historicalEra: '862 AD (Rurik Dynasty at Novgorod)',
    historicalFacts: [
      'Launched the first artificial satellite, Sputnik 1 (1957), and put the first human in space, Yuri Gagarin, aboard Vostok 1 on April 12, 1961.',
      'Spans 11 continuous time zones and contains Lake Baikal, the deepest and oldest freshwater lake on Earth holding 20% of unfrozen lake water.',
      'Produced literary titans Leo Tolstoy, Fyodor Dostoevsky, and classical composers Tchaikovsky and Rachmaninoff.'
    ],
    polandballTrivia: 'Drinks hot samovar tea, plays balalaika tunes, wrestles with friendly brown bears, and laughs "xaxaxaxa".',
    stats: { defense: 92, mining: 94, culture: 88, science: 90, speed: 68, space: 95 }
  },

  // 10. China
  {
    id: 2,
    name: 'China',
    officialName: 'People’s Republic of China',
    commonName: 'Chinaball',
    capital: 'Beijing',
    region: 'Asia',
    color: 'bg-red-600',
    flag: 'linear-gradient(to right, #de2910, #b91c1c)',
    motto: 'Serve the People (Wei Renmin Fuwu)',
    polandballQuote: 'Build the Great Wall! Rapid megastructure construction complete overnight!',
    iconicProp: 'Imperial Jade Emblem & Red Ribbon',
    lorePerk: '+50% Block Placement Speed and 2x Brick / Cobblestone wall fortress durability.',
    historicalEra: '221 BC (Qin Dynasty Unification)',
    historicalFacts: [
      'Invented the Four Great Inventions of antiquity: the magnetic compass, gunpowder, papermaking, and woodblock/movable printing.',
      'Built the Great Wall of China over multiple dynasties, stretching more than 21,000 kilometers across northern frontiers.',
      'Constructed the world\'s largest high-speed rail network spanning over 45,000 km and the Tiangong space station in low Earth orbit.'
    ],
    polandballTrivia: 'Can manufacture anything in seconds, builds 50-story towers before breakfast, and values tea ceremony and dragon festivals.',
    stats: { defense: 94, mining: 92, culture: 96, science: 94, speed: 82, space: 96 }
  },

  // 11. Brazil
  {
    id: 43,
    name: 'Brazil',
    officialName: 'Federative Republic of Brazil',
    commonName: 'Brazilball',
    capital: 'Brasília',
    region: 'Americas',
    color: 'bg-green-600',
    flag: 'radial-gradient(circle, #002776 25%, #ffdf00 26%, #ffdf00 60%, #009c3b 61%)',
    motto: 'Ordem e Progresso (Order and Progress)',
    polandballQuote: 'Come to Brazil! Samba rhythm and bicycle kick goals on the Copacabana!',
    iconicProp: 'Carnival Samba Plumes & Soccer Ball',
    lorePerk: '+25% Sprint Speed & Bouncy Rubber Physics. Immunity to fall damage from heights up to 10 blocks.',
    historicalEra: '1822 (Independence from Portugal)',
    historicalFacts: [
      'Home to the Amazon Rainforest, which produces massive shares of the world\'s oxygen and houses 10% of all known species on Earth.',
      'Only nation to win the FIFA World Cup five times (1958, 1962, 1970, 1994, 2002), legendary homeland of Pelé.',
      'Pioneered early aviation pioneer Alberto Santos-Dumont, who made the first public powered airplane flight in Europe (1906).'
    ],
    polandballTrivia: 'Famous for the universal invitation "COME TO BRAZIL!", carnival percussion beats, and cheerful laughter "huehuehuehue".',
    stats: { defense: 72, mining: 84, culture: 94, science: 76, speed: 92, space: 65 }
  },

  // 12. Mexico
  {
    id: 42,
    name: 'Mexico',
    officialName: 'United Mexican States',
    commonName: 'Mexicoball',
    capital: 'Mexico City',
    region: 'Americas',
    color: 'bg-green-700',
    flag: 'linear-gradient(to right, #006847 33%, #ffffff 33%, #ffffff 66%, #ce1126 66%)',
    motto: 'La Patria es Primero (The Homeland is First)',
    polandballQuote: '¡Órale! Festive Mariachi guitars and hot chili tacos! Creepers beware!',
    iconicProp: 'Woven Sombrero & Curled Mustache',
    lorePerk: 'Blast Shield: 50% Damage Reduction against exploding Creepers and TNT blasts.',
    historicalEra: '1325 (Tenochtitlan) / 1810 (Grito de Dolores)',
    historicalFacts: [
      'Gave chocolate (xocolātl), corn, vanilla, avocados, and tomatoes to global agriculture from indigenous Mesoamerican civilizations.',
      'Mexico City is built on the ruins of the ancient Aztec island capital Tenochtitlan, featuring the grand Templo Mayor.',
      'Home to Chichén Itzá, the world-famous Mayan stepped pyramid demonstrating astronomical alignment with equinox shadows.'
    ],
    polandballTrivia: 'Wears a sombrero with pride, serves authentic spicy tacos, and plays guitar songs while dancing the Jarabe Tapatío.',
    stats: { defense: 78, mining: 82, culture: 96, science: 75, speed: 78, space: 60 }
  },

  // 13. Spain
  {
    id: 10,
    name: 'Spain',
    officialName: 'Kingdom of Spain',
    commonName: 'Spainball',
    capital: 'Madrid',
    region: 'Europe',
    color: 'bg-red-600',
    flag: 'linear-gradient(to bottom, #aa151b 25%, #f1bf00 25%, #f1bf00 75%, #aa151b 75%)',
    motto: 'Plus Ultra (Further Beyond)',
    polandballQuote: '¡Siesta over, fiesta begins! Discovering gold galleons across the seven oceans!',
    iconicProp: 'Royal Conquistador Helmet & Guitar',
    lorePerk: 'Golden Age Prospector: Multiplies rare Gold and Emerald ore mining yields by 1.5x.',
    historicalEra: '1492 (Reconquista & Voyages of Columbus)',
    historicalFacts: [
      'Sponsored the Magellan-Elcano expedition (1519–1522), completing the very first recorded circumnavigation of planet Earth.',
      'Produced literary pioneer Miguel de Cervantes, whose masterwork "Don Quixote" (1605) is considered the first modern novel.',
      'Home to architectural genius Antoni Gaudí, designer of Barcelona’s legendary Basilica of the Sagrada Família.'
    ],
    polandballTrivia: 'Enjoys an afternoon siesta followed by late-night tapas and passionate flamenco guitar playing.',
    stats: { defense: 76, mining: 80, culture: 96, science: 82, speed: 74, space: 72 }
  },

  // 14. Australia
  {
    id: 46,
    name: 'Australia',
    officialName: 'Commonwealth of Australia',
    commonName: 'Australiaball',
    capital: 'Canberra',
    region: 'Oceania',
    color: 'bg-blue-800',
    flag: 'linear-gradient(to right, #00247d, #00008b)',
    motto: 'Advance Australia Fair',
    polandballQuote: 'G\'day mate! Throw another shrimp on the barbie and watch out for drop bears!',
    iconicProp: 'Slouch Hat with Dangling Corks',
    lorePerk: '+30% Boomerang / Arrow Ranged Knockback & complete poison spider venom resistance.',
    historicalEra: '1901 (Federation of Colonies)',
    historicalFacts: [
      'Home to the Great Barrier Reef, the world\'s largest coral reef ecosystem, visible from outer space and stretching over 2,300 km.',
      'Indigenous Australians have the oldest continuous living cultural history on Earth, dating back at least 65,000 years.',
      'Invented the electronic pacemaker (1926), WiFi chip technology (CSIRO in 1992), and the flight data black box.'
    ],
    polandballTrivia: 'Depicted upside-down in classic Polandball comics because it is in the Southern Hemisphere, wrangles venomous critters before breakfast.',
    stats: { defense: 78, mining: 92, culture: 82, science: 88, speed: 82, space: 76 }
  },

  // 15. Sweden
  {
    id: 47,
    name: 'Sweden',
    officialName: 'Kingdom of Sweden',
    commonName: 'Swedenball',
    capital: 'Stockholm',
    region: 'Europe',
    color: 'bg-blue-600',
    flag: 'linear-gradient(to right, #006aa7, #fecc00)',
    motto: 'För Sverige – i tiden (For Sweden – With the Times)',
    polandballQuote: 'Bork bork bork! Homeland of Minecraft! Time to assemble the flatpack furniture!',
    iconicProp: 'Viking Horned Helmet',
    lorePerk: 'Minecraft Homeland Blessing: +40% Crafting Table Speed and 2x Wooden Structure Durability.',
    historicalEra: '1523 (Gustav Vasa Independence)',
    historicalFacts: [
      'Original homeland of Minecraft, created in Stockholm by Markus "Notch" Persson and Mojang Studios in 2009.',
      'Alfred Nobel, Swedish chemist and inventor of dynamite, established the world-renowned Nobel Prizes in his 1895 will.',
      'Pioneered modern sustainability, recycling nearly 99% of all household waste and producing iconic global innovations like Spotify and IKEA.'
    ],
    polandballTrivia: 'Speaks with the classic Swedish Chef "bork bork bork", loves assembling flatpack furniture with Allen keys, and celebrates Midsummer.',
    stats: { defense: 80, mining: 84, culture: 88, science: 94, speed: 78, space: 84 }
  },

  // 16. Netherlands
  {
    id: 48,
    name: 'Netherlands',
    officialName: 'Kingdom of the Netherlands',
    commonName: 'Netherlandsball',
    capital: 'Amsterdam',
    region: 'Europe',
    color: 'bg-red-600',
    flag: 'linear-gradient(to bottom, #ae1c28 33%, #ffffff 33%, #ffffff 66%, #21468b 66%)',
    motto: 'Je Maintiendrai (I will maintain)',
    polandballQuote: 'Gezellig! Keep pumping the dikes! Tulips, windmills, and bicycle superhighways!',
    iconicProp: 'Orange Scarf & Fresh Tulip',
    lorePerk: 'Canal Master: +50% Water Flow Swimming Speed and rapid Dike / Aqueduct construction.',
    historicalEra: '1581 (Act of Abjuration / Dutch Republic)',
    historicalFacts: [
      'Pioneered hydraulic engineering with the Delta Works, dubbed one of the Seven Wonders of the Modern World, protecting land below sea level.',
      'Established the Dutch East India Company (VOC) in 1602, creating the world\'s first formal stock exchange and public company.',
      'Produced Golden Age painting masters Rembrandt, Johannes Vermeer, and post-impressionist icon Vincent van Gogh.'
    ],
    polandballTrivia: 'Tallest countryball on average, wears bright orange, rides a bicycle everywhere, and keeps water from flooding the map.',
    stats: { defense: 78, mining: 74, culture: 92, science: 92, speed: 85, space: 78 }
  },

  // 17. Greece
  {
    id: 84,
    name: 'Greece',
    officialName: 'Hellenic Republic',
    commonName: 'Greeceball',
    capital: 'Athens',
    region: 'Europe',
    color: 'bg-blue-600',
    flag: 'linear-gradient(to bottom, #0d5eaf 20%, #ffffff 20%, #ffffff 40%, #0d5eaf 40%, #0d5eaf 60%, #ffffff 60%, #ffffff 80%, #0d5eaf 80%)',
    motto: 'Eleftheria i Thanatos (Freedom or Death)',
    polandballQuote: 'Eureka! Ancient philosophers and Olympic champions! Gyros for everyone!',
    iconicProp: 'Golden Olive Laurel Wreath',
    lorePerk: 'Philosopher’s Insight: +40% Chance to discover Ancient Underground Dungeons & Temple Ruins.',
    historicalEra: '776 BC (First Olympic Games) / 1821 (Independence)',
    historicalFacts: [
      'Cradle of Western civilization, pioneering democracy, Western philosophy (Socrates, Plato, Aristotle), theatre, and the Olympic Games.',
      'Built the Parthenon atop the Acropolis of Athens in 438 BC, an enduring masterpiece of Classical Doric architecture.',
      'Constructed the Antikythera mechanism (circa 150 BC), regarded by historians as the world\'s oldest analog mechanical computer.'
    ],
    polandballTrivia: 'Frequently reminds Germany of ancient Greek heritage, wears a golden laurel crown, and loves feta cheese, olives, and sirtaki dance.',
    stats: { defense: 75, mining: 70, culture: 100, science: 90, speed: 72, space: 60 }
  },

  // 18. South Korea
  {
    id: 85,
    name: 'South Korea',
    officialName: 'Republic of Korea',
    commonName: 'SouthKoreaball',
    capital: 'Seoul',
    region: 'Asia',
    color: 'bg-white',
    flag: 'radial-gradient(circle, #c60c30 30%, #003478 31%)',
    motto: 'Hongik Ingan (To Broadly Benefit Humanity)',
    polandballQuote: 'Daebak! APM 400 StarCraft gaming speed and neon cyber K-Pop beats!',
    iconicProp: 'Neon K-Pop Shades & Taegeuk Band',
    lorePerk: '+35% Action Agility and instant crafting response. Night vision boosted by neon cyber flair.',
    historicalEra: '2333 BC (Legendary Gojoseon) / 1948',
    historicalFacts: [
      'King Sejong the Great created the Hangul alphabet in 1443, celebrated globally as one of the most scientific, phonetic writing systems.',
      'Achieved the "Miracle on the Han River", transforming from war-torn devastation into one of the top technological and manufacturing powerhouses.',
      'Global leader in ultra-fast broadband, semiconductor chip fabrication, and cultural phenomenon "Hallyu" (K-pop, cinema, esports).'
    ],
    polandballTrivia: 'Extreme pro-gamer with blindingly fast hands, constantly playing StarCraft and rhythm games while drinking iced americanos.',
    stats: { defense: 84, mining: 76, culture: 94, science: 96, speed: 96, space: 84 }
  },

  // 19. Egypt
  {
    id: 86,
    name: 'Egypt',
    officialName: 'Arab Republic of Egypt',
    commonName: 'Egyptball',
    capital: 'Cairo',
    region: 'Middle East',
    color: 'bg-amber-600',
    flag: 'linear-gradient(to bottom, #ce1126 33%, #ffffff 33%, #ffffff 66%, #000000 66%)',
    motto: 'Silence, for the glory of history is speaking',
    polandballQuote: 'Pyramids stand eternal! Master of desert sands and golden pharaoh tombs!',
    iconicProp: 'Pharaoh Nemes Headdress',
    lorePerk: 'Pyramid Architect: 2x Sandstone and Gold harvest in desert biomes. Sandstorm resistance.',
    historicalEra: '3100 BC (Unification of Upper & Lower Egypt)',
    historicalFacts: [
      'The Great Pyramid of Giza (built c. 2560 BC for Pharaoh Khufu) is the oldest and only surviving Wonder of the Ancient World.',
      'Invented 365-day solar calendar, early geometry for land surveying along the Nile floodplains, and papyrus paper writing.',
      'The Library of Alexandria was the ancient world\'s greatest capital of universal knowledge and scholarly inquiry.'
    ],
    polandballTrivia: 'Wears the golden headdress of Tutankhamun, guards the mysterious Sphinx, and claims the oldest recorded jokes in human history.',
    stats: { defense: 82, mining: 88, culture: 98, science: 85, speed: 70, space: 65 }
  },

  // 20. India
  {
    id: 87,
    name: 'India',
    officialName: 'Republic of India (Bharat)',
    commonName: 'Indiaball',
    capital: 'New Delhi',
    region: 'Asia',
    color: 'bg-orange-500',
    flag: 'linear-gradient(to bottom, #ff9933 33%, #ffffff 33%, #ffffff 66%, #138808 66%)',
    motto: 'Satyameva Jayate (Truth Alone Triumphs)',
    polandballQuote: 'Namaste! Mathematical zero invented, spicy curry brewing, and Chandrayaan to the Moon!',
    iconicProp: 'Saffron Turban & Peacock Feather',
    lorePerk: 'Cosmic Calculator: Math & Science crafting formulas yield 20% bonus output.',
    historicalEra: '2500 BC (Indus Valley Civilization) / 1947',
    historicalFacts: [
      'Invented the concept of zero (shunya) and the decimal place-value system via mathematicians Aryabhata and Brahmagupta.',
      'Became the fourth nation to land on the Moon and the very first to successfully soft-land near the lunar south pole with Chandrayaan-3 (2023).',
      'Birthplace of four major world religions (Hinduism, Buddhism, Jainism, Sikhism) and yoga philosophy.'
    ],
    polandballTrivia: 'Loves rich spices, celebrates Diwali with fireworks, and codes brilliant software while bobbing head agreeably.',
    stats: { defense: 86, mining: 84, culture: 98, science: 94, speed: 80, space: 92 }
  },

  // 21. Turkey
  {
    id: 88,
    name: 'Turkey',
    officialName: 'Republic of Türkiye',
    commonName: 'Turkeyball',
    capital: 'Ankara',
    region: 'Middle East',
    color: 'bg-red-600',
    flag: 'radial-gradient(circle at 35% 50%, #ffffff 28%, #e30a17 29%)',
    motto: 'Yurtta sulh, cihanda sulh (Peace at home, peace in the world)',
    polandballQuote: 'Remove bad vibes! Turkish coffee brewing and kebabs roasting on the Bosphorus bridge!',
    iconicProp: 'Classic Crimson Fez Hat',
    lorePerk: 'Transcontinental Bridge: +30% Merchant Trading Profits & Emerald trading discounts.',
    historicalEra: '1299 (Ottoman Empire) / 1923 (Republic founded by Atatürk)',
    historicalFacts: [
      'Istanbul (formerly Byzantium and Constantinople) is the only historic metropolis straddling two continents: Europe and Asia.',
      'Home to Göbekli Tepe, widely recognized by archaeologists as the world\'s oldest known monumental megalithic temple site (~9500 BC).',
      'The Grand Bazaar of Istanbul, founded in 1455, is one of the world’s oldest and largest covered markets spanning 61 streets.'
    ],
    polandballTrivia: 'Wears a handsome red fez with tassel, brews ultra-thick coffee with Turkish delight, and guards the straits between East and West.',
    stats: { defense: 84, mining: 78, culture: 94, science: 80, speed: 78, space: 70 }
  },

  // 22. Switzerland
  {
    id: 89,
    name: 'Switzerland',
    officialName: 'Swiss Confederation',
    commonName: 'Switzerlandball',
    capital: 'Bern',
    region: 'Europe',
    color: 'bg-red-600',
    flag: 'radial-gradient(circle, #ffffff 22%, #dc2626 23%)',
    motto: 'Unus pro omnibus, omnes pro uno (One for all, all for one)',
    polandballQuote: '100% strictly neutral! Storing gold ingots in Alpine mountain vaults!',
    iconicProp: 'Swiss Army Knife & Alpine Cowbell',
    lorePerk: 'Vault Security: Chests and storage vaults are 100% blast-proof and immune to theft.',
    historicalEra: '1291 (Federal Charter)',
    historicalFacts: [
      'Has maintained armed neutrality in international conflicts continuously since the Treaty of Paris in 1815.',
      'Home to CERN near Geneva, where Tim Berners-Lee invented the World Wide Web in 1989 and scientists discovered the Higgs boson.',
      'World-famous for mechanical horology precision, Alpine chocolate craftsmanship, and the headquarters of the Red Cross.'
    ],
    polandballTrivia: 'Refuses to pick sides in any conflict, counts gold ingots with a pocket watch, and holds a multi-tool knife with 40 attachments.',
    stats: { defense: 95, mining: 88, culture: 86, science: 96, speed: 72, space: 82 }
  },

  // 23. Ukraine
  {
    id: 92,
    name: 'Ukraine',
    officialName: 'Ukraine',
    commonName: 'Ukraineball',
    capital: 'Kyiv',
    region: 'Europe',
    color: 'bg-blue-500',
    flag: 'linear-gradient(to bottom, #0057b7 50%, #ffd700 50%)',
    motto: 'Slava Ukraini! (Glory to Ukraine!)',
    polandballQuote: 'Sunflower fields bloom under blue skies! Cossack spirit will never break!',
    iconicProp: 'Sunflower Garland & Cossack Sabred',
    lorePerk: 'Breadbasket Bounty: Wheat and grain crops grow 2x faster and yield double seeds.',
    historicalEra: '882 AD (Kievan Rus) / 1991',
    historicalFacts: [
      'Contains roughly 25–30% of the world’s rich "chornozem" (black soil), making it one of the most fertile grain producers on the planet.',
      'Constructed the Antonov An-225 "Mriya", the heaviest aircraft ever built with the greatest wingspan of any operational plane.',
      'Kyiv, founded in the 5th century, is one of Eastern Europe\'s oldest cultural centers with ancient golden-domed cathedrals.'
    ],
    polandballTrivia: 'Wears a crown of bright yellow sunflowers, loves savory borscht with garlic pampushky, and demonstrates legendary resilience.',
    stats: { defense: 90, mining: 82, culture: 90, science: 84, speed: 76, space: 75 }
  },

  // 24. Norway
  {
    id: 93,
    name: 'Norway',
    officialName: 'Kingdom of Norway',
    commonName: 'Norwayball',
    capital: 'Oslo',
    region: 'Europe',
    color: 'bg-red-600',
    flag: 'linear-gradient(to right, #ba0c2f, #00205b)',
    motto: 'Alt for Norge (All for Norway)',
    polandballQuote: 'Sailing through majestic fjords under Northern Lights! Sovereign wealth secured!',
    iconicProp: 'Viking Shield & Ski Poles',
    lorePerk: 'Fjord Explorer: Boats move 50% faster and never break on lilypads or rocks.',
    historicalEra: '872 AD (Battle of Hafrsfjord under Harald Fairhair)',
    historicalFacts: [
      'Home to dramatic glacial fjords like Geirangerfjord and Nærøyfjord, carved over ice ages and recognized as UNESCO treasures.',
      'Roald Amundsen of Norway led the first expedition to reach the geographic South Pole on December 14, 1911.',
      'Built the world\'s largest sovereign wealth fund (over $1.6 trillion) from responsible petroleum revenue stewardship.'
    ],
    polandballTrivia: 'Skis across mountains, eats delicious smoked salmon, and ranks consistently near #1 on global happiness indices.',
    stats: { defense: 84, mining: 90, culture: 88, science: 90, speed: 82, space: 78 }
  },

  // 25. Finland
  {
    id: 94,
    name: 'Finland',
    officialName: 'Republic of Finland',
    commonName: 'Finlandball',
    capital: 'Helsinki',
    region: 'Europe',
    color: 'bg-white',
    flag: 'linear-gradient(to right, #ffffff 30%, #002f6c 30%, #002f6c 45%, #ffffff 45%)',
    motto: 'Sisu (Grit, Courage, and Tenacity)',
    polandballQuote: 'Perkele! 100°C sauna steaming, ice hole swimming, and unbreakable Sisu!',
    iconicProp: 'Snow Goggles & Wood Chopping Axe',
    lorePerk: 'Sisu Tenacity: When below 20% Health, gain 3x Defense and double movement speed.',
    historicalEra: '1917 (Declaration of Independence)',
    historicalFacts: [
      'Has more saunas than passenger cars—roughly 3.3 million saunas for a population of 5.5 million people.',
      'Created Linux operating system kernel (Linus Torvalds at University of Helsinki in 1991) and mobile tech giant Nokia.',
      'Consistently ranked as the World’s Happiest Country by the UN World Happiness Report for 7+ consecutive years.'
    ],
    polandballTrivia: 'Quiet, introspective, sits in hot steam saunas with birch branches, and shouts "Perkele!" when surprised.',
    stats: { defense: 88, mining: 80, culture: 86, science: 94, speed: 80, space: 75 }
  },

  // 26. Argentina
  {
    id: 95,
    name: 'Argentina',
    officialName: 'Argentine Republic',
    commonName: 'Argentinaball',
    capital: 'Buenos Aires',
    region: 'Americas',
    color: 'bg-sky-400',
    flag: 'linear-gradient(to bottom, #74acdf 33%, #ffffff 33%, #ffffff 66%, #74acdf 66%)',
    motto: 'En Unión y Libertad (In Union and Liberty)',
    polandballQuote: '¡Che! Tango passion, sizzling Asado steaks, and World Cup glory!',
    iconicProp: 'Sun of May Golden Headband',
    lorePerk: 'Golden Touch: Meat meals cooked on campfires grant instant absorption hearts.',
    historicalEra: '1816 (Congress of Tucumán)',
    historicalFacts: [
      'Home to the highest peak in both the Western and Southern Hemispheres: Mount Aconcagua (6,961 meters in the Andes).',
      'Birthplace of Tango music and dance, which originated in the immigrant port neighborhoods of Buenos Aires in the late 19th century.',
      'Three-time FIFA World Cup champions (1978, 1986, 2022), legendary home of Diego Maradona and Lionel Messi.'
    ],
    polandballTrivia: 'Very proud, drinks yerba mate from a wooden gourd with a silver bombilla straw, and says "¡Che!" every three words.',
    stats: { defense: 74, mining: 78, culture: 96, science: 80, speed: 84, space: 70 }
  },

  // 27. Ireland
  {
    id: 96,
    name: 'Ireland',
    officialName: 'Ireland (Éire)',
    commonName: 'Irelandball',
    capital: 'Dublin',
    region: 'Europe',
    color: 'bg-emerald-600',
    flag: 'linear-gradient(to right, #169b62 33%, #ffffff 33%, #ffffff 66%, #ff883e 66%)',
    motto: 'Ceol agus Craic (Music and Good Times)',
    polandballQuote: 'Top of the morning! Four-leaf clovers, fiddle reels, and the Emerald Isle!',
    iconicProp: 'Leprechaun Bowler Hat & Shamrock',
    lorePerk: 'Leprechaun Luck: +40% Fortune enchantment probability on mining ores.',
    historicalEra: '1922 (Irish Free State)',
    historicalFacts: [
      'Origin of Halloween from the ancient Celtic festival of Samhain, celebrated more than 2,000 years ago as summer ended.',
      'Boasts four Nobel Prize laureates in Literature: W.B. Yeats, George Bernard Shaw, Samuel Beckett, and Seamus Heaney (plus James Joyce).',
      'The island is known as the "Emerald Isle" due to 40 shades of lush green meadows sustained by Atlantic rainfall.'
    ],
    polandballTrivia: 'Plays the tin whistle and bodhrán drum, loves good craic and storytelling by the fireplace, and guards pots of gold.',
    stats: { defense: 75, mining: 76, culture: 96, science: 84, speed: 82, space: 68 }
  },

  // 28. Portugal
  {
    id: 97,
    name: 'Portugal',
    officialName: 'Portuguese Republic',
    commonName: 'Portugalball',
    capital: 'Lisbon',
    region: 'Europe',
    color: 'bg-red-700',
    flag: 'linear-gradient(to right, #006600 40%, #ff0000 40%)',
    motto: 'Esta é a ditosa Pátria minha amada',
    polandballQuote: 'Obrigado! Caravels unfurled, pastel de nata fresh from the oven, sailing the oceans!',
    iconicProp: 'Naval Astrolabe & Sailor Cap',
    lorePerk: 'Age of Discovery: Map making reveals 2x wider radius and marks ocean monuments.',
    historicalEra: '1139 (Founding under Afonso Henriques)',
    historicalFacts: [
      'Possesses the oldest defined borders in Europe, largely unchanged since the Treaty of Alcanizes in 1297.',
      'Pioneered ocean navigation during the Age of Discovery with Prince Henry the Navigator, Vasco da Gama, and Ferdinand Magellan.',
      'Home to the world\'s oldest operating bookstore, Bertrand in Lisbon, founded in 1732.'
    ],
    polandballTrivia: 'Sings melancholic Fado ballads, eats bacalhau prepared 365 different ways, and loves football legend Cristiano Ronaldo.',
    stats: { defense: 76, mining: 74, culture: 92, science: 82, speed: 80, space: 68 }
  },

  // 29. Belgium
  {
    id: 98,
    name: 'Belgium',
    officialName: 'Kingdom of Belgium',
    commonName: 'Belgiumball',
    capital: 'Brussels',
    region: 'Europe',
    color: 'bg-black',
    flag: 'linear-gradient(to right, #000000 33%, #ffd90c 33%, #ffd90c 66%, #f31830 66%)',
    motto: 'L\'union fait la force (Unity Makes Strength)',
    polandballQuote: 'Capital of Europe! Golden crispy waffles and premier chocolate pralines!',
    iconicProp: 'Waffle Iron & Diplomat Tie',
    lorePerk: 'Diplomatic Shield: Reduces hostile mob aggro range by 30%.',
    historicalEra: '1830 (Belgian Revolution)',
    historicalFacts: [
      'De facto capital of the European Union and headquarters of NATO, hosting key global diplomatic institutions in Brussels.',
      'Produces over 220,000 tons of gourmet chocolate annually, inventing the stuffed praline confection in 1912.',
      'Birthplace of iconic comic book pioneers Hergé ("The Adventures of Tintin"), Peyo ("The Smurfs"), and surrealist painter René Magritte.'
    ],
    polandballTrivia: 'Juggles Flemish and French languages, serves double-fried crispy frites with mayonnaise, and wears a diplomatic briefcase.',
    stats: { defense: 80, mining: 74, culture: 92, science: 88, speed: 76, space: 78 }
  },

  // 30. Austria
  {
    id: 99,
    name: 'Austria',
    officialName: 'Republic of Austria',
    commonName: 'Austriaball',
    capital: 'Vienna',
    region: 'Europe',
    color: 'bg-red-600',
    flag: 'linear-gradient(to bottom, #ed2939 33%, #ffffff 33%, #ffffff 66%, #ed2939 66%)',
    motto: 'Land der Berge, Land am Strome',
    polandballQuote: 'Classical symphony playing! Mozart waltzes and warm Apple Strudel!',
    iconicProp: 'Conductor Baton & Alpine Feather',
    lorePerk: 'Harmonic Melody: Jukebox and note blocks play with 2x volume and soothe nearby animals.',
    historicalEra: '996 AD (Ostarrîchi document) / 1918',
    historicalFacts: [
      'The historical musical capital of the world, home to Wolfgang Amadeus Mozart, Ludwig van Beethoven, Franz Schubert, and Johann Strauss.',
      'The Austrian flag is among the oldest national flags in the world, tracing back to Duke Leopold V at the Siege of Acre in 1191.',
      'Vienna has repeatedly topped global Quality of Living indices, celebrated for green spaces, public transit, and historic coffeehouse culture.'
    ],
    polandballTrivia: 'Conducts classical orchestras, sips Viennese Melange coffee with Sachertorte, and reminds everyone "NOT AUSTRALIA, NO KANGAROOS!".',
    stats: { defense: 80, mining: 76, culture: 98, science: 88, speed: 74, space: 74 }
  },

  // 31. Denmark
  {
    id: 100,
    name: 'Denmark',
    officialName: 'Kingdom of Denmark',
    commonName: 'Denmarkball',
    capital: 'Copenhagen',
    region: 'Europe',
    color: 'bg-red-600',
    flag: 'linear-gradient(to right, #c60c30, #ffffff)',
    motto: 'Guds hjælp, Folkets kærlighed, Danmarks styrke',
    polandballQuote: 'Hygge cozy warmth! Watch your step, do not step on the LEGO brick!',
    iconicProp: 'Toy Brick on Head & Viking Horn',
    lorePerk: 'Brickmaster: Bricks and colored wool blocks craft with 25% material discount.',
    historicalEra: '965 AD (Jelling stones by Harald Bluetooth)',
    historicalFacts: [
      'The Dannebrog flag, recorded in use since the 13th century, holds the Guinness World Record for the oldest continuously used national flag.',
      'Invented LEGO bricks in Billund (1932 by Ole Kirk Christiansen), whose name comes from Danish "leg godt" ("play well").',
      'Harald Bluetooth, 10th-century king of Denmark and Norway, inspired the name and Nordic rune symbol for Bluetooth wireless technology.'
    ],
    polandballTrivia: 'Practices "Hygge" cozy vibes by candlelight, rides bicycles in all weather, and builds castles out of interlocking plastic bricks.',
    stats: { defense: 80, mining: 78, culture: 90, science: 90, speed: 82, space: 76 }
  },

  // 32. Singapore
  {
    id: 101,
    name: 'Singapore',
    officialName: 'Republic of Singapore',
    commonName: 'Tringapore',
    capital: 'Singapore',
    region: 'Asia',
    color: 'bg-red-600',
    flag: 'linear-gradient(to bottom, #ed2939 50%, #ffffff 50%)',
    motto: 'Majulah Singapura (Onward Singapore)',
    polandballQuote: 'No chewing gum allowed! Clean, green, futuristic Garden City power, lah!',
    iconicProp: 'Triangle Shape ("Tringapore") & Golden Crescent',
    lorePerk: 'Trade Gateway: Automates inventory sorting and eliminates clutter. +50% Gold trading.',
    historicalEra: '1819 (Raffles) / 1965 (Independence)',
    historicalFacts: [
      'One of only three surviving sovereign city-states in the world (alongside Monaco and Vatican City).',
      'Transformed from a developing port into one of the world’s top financial and logistics hubs under founding Prime Minister Lee Kuan Yew.',
      'Pioneered urban biophilic design with the iconic "Gardens by the Bay", featuring 50-meter-tall solar-powered Supertree vertical gardens.'
    ],
    polandballTrivia: 'CANON TRIVIA: In Polandball comics, Singapore is drawn as a TRIANGLE ("Tringapore") because of the Indonesia-Malaysia-Singapore Growth Triangle!',
    stats: { defense: 88, mining: 70, culture: 88, science: 98, speed: 88, space: 80 }
  },

  // 33. Philippines
  {
    id: 102,
    name: 'Philippines',
    officialName: 'Republic of the Philippines',
    commonName: 'Philippinesball',
    capital: 'Manila',
    region: 'Asia',
    color: 'bg-blue-600',
    flag: 'linear-gradient(to bottom, #0038a8 50%, #ce1126 50%)',
    motto: 'Maka-Diyos, Maka-Tao, Makakalikasan at Makabansa',
    polandballQuote: 'Mabuhay! Karaoke mic ready, sweet mangoes peeled, and Jeepney rolling!',
    iconicProp: 'Golden Sun & 3 Stars Bandana',
    lorePerk: 'Festive Karaoke: Singing inspires nearby companions with speed and regeneration.',
    historicalEra: '1898 (Independence from Spain)',
    historicalFacts: [
      'Consists of 7,641 tropical islands, boasting one of the world\'s longest combined coastlines and marine biodiversity hotbeds.',
      'The Banaue Rice Terraces, carved into the mountains of Ifugao largely by hand 2,000 years ago, are known as the "Eighth Wonder of the World".',
      'Known as the social media and texting capital of the world, celebrated for hospitality and musical karaoke culture.'
    ],
    polandballTrivia: 'Always has a microphone ready for karaoke, serves delicious adobo and halo-halo, and drives colorful customized Jeepneys.',
    stats: { defense: 74, mining: 76, culture: 94, science: 78, speed: 84, space: 62 }
  },

  // 34. Indonesia
  {
    id: 103,
    name: 'Indonesia',
    officialName: 'Republic of Indonesia',
    commonName: 'Indonesiaball',
    capital: 'Jakarta (Nusantara)',
    region: 'Asia',
    color: 'bg-red-600',
    flag: 'linear-gradient(to bottom, #ff0000 50%, #ffffff 50%)',
    motto: 'Bhinneka Tunggal Ika (Unity in Diversity)',
    polandballQuote: 'Archipelago of 17,000 islands! Spicy sambal and Komodo dragon power!',
    iconicProp: 'Traditional Songkok Cap & Batik Sash',
    lorePerk: 'Island Hopper: Swimming uses zero stamina and grants water breathing for 60 seconds.',
    historicalEra: '1945 (Proclamation of Independence)',
    historicalFacts: [
      'The world\'s largest island nation, comprising over 17,500 islands and home to more than 300 distinct ethnic and linguistic groups.',
      'Contains Borobudur, built in the 8th–9th centuries, the world\'s largest Buddhist temple monument decorated with 504 Buddha statues.',
      'Home to the prehistoric Komodo dragon, the world\'s largest living lizard species, native to Komodo and Flores islands.'
    ],
    polandballTrivia: 'Wears a black velvet songkok hat to distinguish itself from Polandball (since both share the red-and-white bicolor flag)!',
    stats: { defense: 78, mining: 85, culture: 92, science: 76, speed: 82, space: 68 }
  },

  // 35. Vietnam
  {
    id: 104,
    name: 'Vietnam',
    officialName: 'Socialist Republic of Vietnam',
    commonName: 'Vietnamball',
    capital: 'Hanoi',
    region: 'Asia',
    color: 'bg-red-600',
    flag: 'radial-gradient(circle, #ffff00 30%, #da251d 31%)',
    motto: 'Độc lập – Tự do – Hạnh phúc (Independence – Freedom – Happiness)',
    polandballQuote: 'Steaming bowl of Phở ready! Ancient limestone karsts of Hạ Long Bay rising!',
    iconicProp: 'Conical Bamboo Leaf Hat (Nón Lá)',
    lorePerk: 'Jungle Camouflage: Undetectable to hostile mobs when standing still in grass or leaves.',
    historicalEra: '2879 BC (Hồng Bàng) / 1945 (Declaration)',
    historicalFacts: [
      'Hạ Long Bay features over 1,600 towering limestone emerald karsts and islets rising from the sea, a world-famous natural wonder.',
      'The world\'s largest natural cave, Sơn Đoòng Cave in Phong Nha-Kẻ Bàng, has its own localized weather system, clouds, and subterranean jungle.',
      'Second-largest coffee producer in the world, celebrated for Robusta beans and rich condensed milk egg coffee.'
    ],
    polandballTrivia: 'Wears a conical straw hat (nón lá), sips iced drip coffee with condensed milk, and knows every secret path in the jungle.',
    stats: { defense: 88, mining: 78, culture: 92, science: 80, speed: 84, space: 65 }
  },

  // 36. Thailand
  {
    id: 105,
    name: 'Thailand',
    officialName: 'Kingdom of Thailand',
    commonName: 'Thailandball',
    capital: 'Bangkok',
    region: 'Asia',
    color: 'bg-red-600',
    flag: 'linear-gradient(to bottom, #a51931 16%, #f4f5f8 16%, #f4f5f8 33%, #2d2a4a 33%, #2d2a4a 66%, #f4f5f8 66%, #f4f5f8 83%, #a51931 83%)',
    motto: 'Chat, Satsana, Phra Mahakasat (Nation, Religion, King)',
    polandballQuote: 'Land of Smiles! Golden temples, Pad Thai noodles, and Tuk-Tuk races!',
    iconicProp: 'Golden Chada Pagoda Crown',
    lorePerk: 'Land of Smiles: Hostile mobs within 5 blocks have their attack damage halved.',
    historicalEra: '1238 (Sukhothai Kingdom)',
    historicalFacts: [
      'The only Southeast Asian nation never colonized by European powers, earning the historic name "Mueang Thai" ("Land of the Free").',
      'The ceremonial full name of Bangkok is the longest city name in the world (168 letters), beginning "Krungthepmahanakhon...".',
      'Famous for Muay Thai ("The Art of Eight Limbs"), one of the most dynamic martial arts using punches, kicks, elbows, and knees.'
    ],
    polandballTrivia: 'Always smiling warmly with folded hands "Wai" greeting, loves spicy Tom Yum soup, and zips through traffic in a Tuk-Tuk.',
    stats: { defense: 78, mining: 74, culture: 96, science: 78, speed: 86, space: 65 }
  },

  // 37. South Africa
  {
    id: 106,
    name: 'South Africa',
    officialName: 'Republic of South Africa',
    commonName: 'SouthAfricaball',
    capital: 'Pretoria (Exec) / Cape Town (Leg) / Bloemfontein (Jud)',
    region: 'Africa',
    color: 'bg-green-700',
    flag: 'linear-gradient(to right, #007749, #001489)',
    motto: '!ke e: /xarra //ke (Diverse People Unite)',
    polandballQuote: 'Rainbow Nation! Vuvuzela sounding from Table Mountain to Kruger Park!',
    iconicProp: 'Loud Vuvuzela Horn & Springbok Cap',
    lorePerk: 'Safari Tracker: Identifies all animal and mob spawn locations within 60 blocks.',
    historicalEra: '1910 (Union) / 1994 (Democratic Elections)',
    historicalFacts: [
      'The "Rainbow Nation" has three official capital cities and 12 official languages, led to peaceful democracy by Nelson Mandela.',
      'Christiaan Barnard performed the world\'s first successful human heart transplant at Groote Schuur Hospital in Cape Town in 1967.',
      'Contains the Vredefort Crater, the oldest and largest verified meteorite impact crater on Earth, created over 2 billion years ago.'
    ],
    polandballTrivia: 'Blows the famously loud stadium vuvuzela horn at full blast, barbecues "braai" with friends, and watches rugby with pride.',
    stats: { defense: 80, mining: 92, culture: 92, science: 82, speed: 82, space: 72 }
  },

  // 38. New Zealand
  {
    id: 107,
    name: 'New Zealand',
    officialName: 'New Zealand (Aotearoa)',
    commonName: 'NewZealandball',
    capital: 'Wellington',
    region: 'Oceania',
    color: 'bg-blue-900',
    flag: 'linear-gradient(to right, #00247d, #001b69)',
    motto: 'Land of the Long White Cloud (Aotearoa)',
    polandballQuote: 'Kia Ora! Haka dance ready! The Shire and Mount Doom are in our backyard!',
    iconicProp: 'Fluffy Kiwi Bird Companion & Fern',
    lorePerk: 'Middle-earth Explorer: Mountain terrain traversal costs zero hunger and grants jump boost.',
    historicalEra: '1840 (Treaty of Waitangi)',
    historicalFacts: [
      'First self-governing country in the world to grant all women the right to vote in parliamentary elections (1893).',
      'Sir Edmund Hillary from New Zealand, alongside Sherpa Tenzing Norgay, achieved the first confirmed summit of Mount Everest (1953).',
      'Iconic cinematic filming location for "The Lord of the Rings" trilogy, showcasing its volcanic peaks and glacial fiords.'
    ],
    polandballTrivia: 'Carries a sweet flightless Kiwi bird, performs the spine-chilling All Blacks Haka dance, and complains about being left off world maps!',
    stats: { defense: 78, mining: 76, culture: 92, science: 86, speed: 84, space: 76 }
  },

  // 39. Chile
  {
    id: 108,
    name: 'Chile',
    officialName: 'Republic of Chile',
    commonName: 'Chileball',
    capital: 'Santiago',
    region: 'Americas',
    color: 'bg-red-600',
    flag: 'linear-gradient(to bottom, #0039a6 50%, #d52b1e 50%)',
    motto: 'Por la razón o la fuerza (By reason or by force)',
    polandballQuote: 'Longest country on the map! From Atacama stargazing to Patagonian glaciers!',
    iconicProp: 'Accordion Shape / Red Chili Pepper',
    lorePerk: 'Telescopic Vision: High zoom magnification across distant horizons like an observatory.',
    historicalEra: '1818 (Independence under O\'Higgins)',
    historicalFacts: [
      'The longest north-south country in the world, stretching over 4,300 km while averaging just 177 km in width.',
      'The Atacama Desert in northern Chile is the driest non-polar desert on Earth, hosting more than 40% of the world\'s optical astronomy telescopes.',
      'Home to Easter Island (Rapa Nui), famous for its nearly 1,000 monumental carved volcanic stone "Moai" statues.'
    ],
    polandballTrivia: 'CANON TRIVIA: Often drawn as an extremely long worm-like / accordion-shaped countryball snake because of its narrow geography!',
    stats: { defense: 80, mining: 95, culture: 86, science: 92, speed: 82, space: 70 }
  },

  // 40. Colombia
  {
    id: 109,
    name: 'Colombia',
    officialName: 'Republic of Colombia',
    commonName: 'Colombiaball',
    capital: 'Bogotá',
    region: 'Americas',
    color: 'bg-yellow-500',
    flag: 'linear-gradient(to bottom, #fcd116 50%, #003893 50%, #003893 75%, #ce1126 75%)',
    motto: 'Libertad y Orden (Liberty and Order)',
    polandballQuote: '¡Vaya! Emerald green mountains and world-champion Arabica coffee beans!',
    iconicProp: 'Steaming Coffee Mug & Sombrero Vueltiao',
    lorePerk: 'Caffeine Rush: Drinking milk or coffee grants 2x mining haste and running speed.',
    historicalEra: '1810 (Declaration of Independence)',
    historicalFacts: [
      'Produces the world\'s finest quality emeralds, responsible for over 70–90% of the global emerald gemstone market.',
      'Second most biodiverse country on Earth (and #1 in bird and orchid species), spanning the Andes, Amazon, and two ocean coasts.',
      'Home to Nobel laureate author Gabriel García Márquez, father of literary magical realism ("One Hundred Years of Solitude").'
    ],
    polandballTrivia: 'Wears the traditional woven "sombrero vueltiao", sips fresh highland coffee, and dances cumbia and salsa.',
    stats: { defense: 76, mining: 88, culture: 94, science: 78, speed: 84, space: 62 }
  },

  // 41. Peru
  {
    id: 110,
    name: 'Peru',
    officialName: 'Republic of Peru',
    commonName: 'Peruball',
    capital: 'Lima',
    region: 'Americas',
    color: 'bg-red-600',
    flag: 'linear-gradient(to right, #d91023 33%, #ffffff 33%, #ffffff 66%, #d91023 66%)',
    motto: 'Firme y feliz por la unión',
    polandballQuote: 'Machu Picchu high in the Andes! Cradle of the Inca Empire and 4,000 potato varieties!',
    iconicProp: 'Andean Chullo Llama Wool Hat',
    lorePerk: 'Inca Masonry: Stone blocks lock seamlessly with 0% seam gap and enhanced blast defense.',
    historicalEra: '1438 (Inca Empire under Pachacuti) / 1821',
    historicalFacts: [
      'Capital of the Inca Empire, Tahuantinsuyo, which built Machu Picchu 2,430 meters above sea level with mortar-free stone masonry.',
      'Original birthplace of the potato, cultivating over 4,000 native varieties in the high Andean valleys.',
      'Home to the mysterious ancient Nazca Lines, gigantic geoglyphs etched into desert plains depicting animals and geometric forms.'
    ],
    polandballTrivia: 'Wears a warm patterned Chullo hat with earflaps, pets friendly fluffy alpacas, and explores ancient Inca ruins.',
    stats: { defense: 82, mining: 90, culture: 98, science: 80, speed: 76, space: 64 }
  },

  // 42. Saudi Arabia
  {
    id: 111,
    name: 'Saudi Arabia',
    officialName: 'Kingdom of Saudi Arabia',
    commonName: 'SaudiArabia',
    capital: 'Riyadh',
    region: 'Middle East',
    color: 'bg-emerald-700',
    flag: 'linear-gradient(to bottom, #165b33, #0d381e)',
    motto: 'There is no god but Allah; Muhammad is the messenger of Allah',
    polandballQuote: 'Desert dunes and boundless energy! Building the future in the shimmering sands!',
    iconicProp: 'Keffiyeh & Golden Scimitar',
    lorePerk: 'Oil Baron Wealth: Coal and furnace fuels burn for 3x longer duration.',
    historicalEra: '1932 (Unification under Ibn Saud)',
    historicalFacts: [
      'Home to the two holiest cities of Islam: Mecca and Medina, welcoming millions of international pilgrims annually for the Hajj.',
      'Possesses the Rub\' al Khali ("Empty Quarter"), the world\'s largest continuous sand desert covering 650,000 square kilometers.',
      'Constructing futuristic megaprojects like NEOM and THE LINE, powered entirely by renewable wind and solar energy.'
    ],
    polandballTrivia: 'Wears the traditional red-and-white keffiyeh headdress, drives luxury desert supercars, and trades black gold.',
    stats: { defense: 86, mining: 98, culture: 90, science: 80, speed: 76, space: 78 }
  },

  // 43. Iceland
  {
    id: 112,
    name: 'Iceland',
    officialName: 'Iceland',
    commonName: 'Icelandball',
    capital: 'Reykjavik',
    region: 'Europe',
    color: 'bg-blue-600',
    flag: 'linear-gradient(to right, #02529c, #dc1e35)',
    motto: 'Land of Fire and Ice',
    polandballQuote: 'Land of Fire and Ice! Geothermal geysers and ancient Viking sagas!',
    iconicProp: 'Puffin Feather & Geothermal Flask',
    lorePerk: 'Geothermal Thermal: Immunity to lava burn damage for 8 seconds after contact.',
    historicalEra: '930 AD (Althing Parliament founded)',
    historicalFacts: [
      'Home to the Althing, founded in 930 AD at Thingvellir, widely considered the world\'s oldest continuous parliamentary assembly.',
      'Powered 100% by renewable energy: roughly 70% from hydroelectric dams and 30% from geothermal steam volcanic energy.',
      'Has zero mosquitoes, no standing military army, and boasts the world\'s highest book publishing per capita.'
    ],
    polandballTrivia: 'Baths in natural volcanic hot springs while snow falls, reads ancient Viking sagas, and befriends cute puffins.',
    stats: { defense: 78, mining: 84, culture: 90, science: 92, speed: 74, space: 70 }
  },

  // 44. Czech Republic
  {
    id: 113,
    name: 'Czech Republic',
    officialName: 'Czech Republic (Czechia)',
    commonName: 'Czechball',
    capital: 'Prague',
    region: 'Europe',
    color: 'bg-blue-600',
    flag: 'linear-gradient(to bottom, #ffffff 50%, #d7141a 50%)',
    motto: 'Pravda vítězí (Truth prevails)',
    polandballQuote: 'City of a Hundred Spires! Toast with original Pilsner and marvel at the Astronomical Clock!',
    iconicProp: 'Pilsner Mug & Bohemian Crystal',
    lorePerk: 'Bohemian Glassblower: Crystal and Amethyst geodes drop double crystal shards.',
    historicalEra: '870 AD (Duchy of Bohemia) / 1993',
    historicalFacts: [
      'Prague Astronomical Clock (Orloj), installed in 1410, is the oldest operating astronomical clock in the world.',
      'Birthplace of original Pilsner golden lager beer in Plzeň (1842) and inventor of the word "Robot" (Karel Čapek, 1920 play R.U.R.).',
      'Contains over 2,000 castles and chateaux, the highest density of castles in all of Europe.'
    ],
    polandballTrivia: 'Drinks the finest golden foam beer, crafts exquisite Bohemian glass crystals, and strolls across Charles Bridge.',
    stats: { defense: 80, mining: 80, culture: 94, science: 90, speed: 76, space: 76 }
  },

  // 45. Hungary
  {
    id: 114,
    name: 'Hungary',
    officialName: 'Hungary (Magyarország)',
    commonName: 'Hungaryball',
    capital: 'Budapest',
    region: 'Europe',
    color: 'bg-red-600',
    flag: 'linear-gradient(to bottom, #ce2939 33%, #ffffff 33%, #ffffff 66%, #477050 66%)',
    motto: 'Isten, áldd meg a magyart (God bless the Hungarian)',
    polandballQuote: 'Lengyel, magyar – két jó barát! Solving the Rubik’s cube in 5 seconds flat!',
    iconicProp: 'Rubik’s Cube & Paprika Shaker',
    lorePerk: 'Magyar Solidarity: Standing near Polandball boosts all stats by +15% (historic brotherhood).',
    historicalEra: '895 AD (Conquest of the Carpathian Basin by Árpád)',
    historicalFacts: [
      'Invented the world-famous Rubik\'s Cube (Ernő Rubik, 1974), the ballpoint pen (László Bíró, 1938), and holographic imaging (Dennis Gabor).',
      'The Budapest Metro Line 1 (opened 1896) is the oldest electrified underground railway on the European continent.',
      'Hungary and Poland share a centuries-old brotherhood expressed in the famous historic proverb: "Pole and Hungarian, two good friends".'
    ],
    polandballTrivia: 'Always best friends with Polandball in comic canon, twists colorful Rubik\'s cubes, and seasons every dish with rich red paprika.',
    stats: { defense: 80, mining: 78, culture: 92, science: 92, speed: 78, space: 75 }
  },

  // 46. Kazakhstan (The Famous Kazakhbrick!)
  {
    id: 115,
    name: 'Kazakhstan',
    officialName: 'Republic of Kazakhstan',
    commonName: 'Kazakhbrick',
    capital: 'Astana',
    region: 'Asia',
    color: 'bg-cyan-500',
    flag: 'linear-gradient(to bottom, #00afca, #00afca)',
    motto: 'Menıñ Qazaqstanym (My Kazakhstan)',
    polandballQuote: 'I AM BRICK! Cosmodrome Baikonur launching rockets into high orbit!',
    iconicProp: 'Rectangular Brick Shape ("Kazakhbrick")',
    lorePerk: 'Solid Brick Block: Cannot be knocked back by explosions or hostile arrows.',
    historicalEra: '1465 (Kazakh Khanate) / 1991',
    historicalFacts: [
      'The largest landlocked country in the world and 9th largest nation overall, spanning boundless Central Asian steppes.',
      'Home to the historic Baikonur Cosmodrome, the world\'s first and largest space launch facility, which launched Sputnik 1 and Yuri Gagarin.',
      'The original ancestral home of all domesticated apples (Malus sieversii), which originated in the wild apple forests of Almaty.'
    ],
    polandballTrivia: 'CANON TRIVIA: Unlike circular balls, Kazakhstan is drawn as a SOLID RECTANGULAR BRICK ("Kazakhbrick") in homage to classic forum board layout glitches!',
    stats: { defense: 98, mining: 92, culture: 86, science: 88, speed: 70, space: 95 }
  },

  // 47. Jamaica
  {
    id: 116,
    name: 'Jamaica',
    officialName: 'Jamaica',
    commonName: 'Jamaicaball',
    capital: 'Kingston',
    region: 'Americas',
    color: 'bg-black',
    flag: 'linear-gradient(to right, #009b3a 50%, #fed100 50%)',
    motto: 'Out of Many, One People',
    polandballQuote: 'One Love, One Heart! Reggae basslines grooving under Caribbean sunshine!',
    iconicProp: 'Rasta Knitted Beanie & Sun',
    lorePerk: 'Sprint Champion: +45% Base Sprinting Velocity (homeland of the fastest sprinters on Earth).',
    historicalEra: '1962 (Independence)',
    historicalFacts: [
      'Birthplace of Reggae music, created and popularized globally by cultural icon Bob Marley and the Wailers.',
      'Dominated Olympic sprinting history through Usain Bolt, the fastest human in recorded history (100m world record: 9.58s).',
      'First Caribbean nation to compete in the Winter Olympics with its famous bobsleigh team at the 1988 Calgary Games.'
    ],
    polandballTrivia: 'Wears a vibrant red-gold-green Rasta tam, radiates pure chill vibes, and outruns every mob in the game with ease.',
    stats: { defense: 72, mining: 70, culture: 98, science: 74, speed: 100, space: 60 }
  },

  // 48. Mongolia
  {
    id: 117,
    name: 'Mongolia',
    officialName: 'Mongolia',
    commonName: 'Mongoliaball',
    capital: 'Ulaanbaatar',
    region: 'Asia',
    color: 'bg-red-600',
    flag: 'linear-gradient(to right, #da2032 33%, #005bae 33%, #005bae 66%, #da2032 66%)',
    motto: 'Eternal Blue Sky (Möngke Tengri)',
    polandballQuote: 'Throat singing reverberating across the steppe! Mount your steed and gallop!',
    iconicProp: 'Steppe Nomad Fur Helmet & Soyombo',
    lorePerk: 'Nomad Horse Archer: 2x Mount riding speed and 100% bow accuracy while on horseback.',
    historicalEra: '1206 (Mongol Empire under Genghis Khan)',
    historicalFacts: [
      'The Mongol Empire founded by Genghis Khan in 1206 became the largest contiguous land empire in human history.',
      'Revered for deep polyphonic throat singing (Khoomei) and the iconic horsehead fiddle (Morin Khuur).',
      'The least densely populated sovereign nation on Earth, known as the "Land of the Eternal Blue Sky" with over 250 sunny days per year.'
    ],
    polandballTrivia: 'Echoes with deep harmonic throat singing, wears a nomad fur hat with horns, and gallops swiftly across mountain steppes.',
    stats: { defense: 86, mining: 82, culture: 94, science: 75, speed: 95, space: 65 }
  }
];

export const REGIONS_LIST = ['All', 'Europe', 'Americas', 'Asia', 'Africa', 'Oceania', 'Middle East'] as const;
