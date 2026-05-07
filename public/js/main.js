/* uwu proxy — main.js */

/* globals loaded via <script> tags: Ultraviolet, __uv$config */
const VERSION = "1.1.0";

// ── Data ────────────────────────────────
const GAMES = [
  // Action — all from reliable hosts (no Poki)
  { name: "Slope",              url: "https://3kh0.github.io/projects/slope/index.html",              tag: "action",  category: "action",  desc: "Roll a ball down an endless slope",    direct: true  },
  { name: "Tunnel Rush",        url: "https://3kh0.github.io/projects/tunnel-rush/index.html",        tag: "action",  category: "action",  desc: "Race through colorful tunnels",        direct: true  },
  { name: "MotoX3M",            url: "https://3kh0.github.io/projects/motox3m/index.html",            tag: "action",  category: "action",  desc: "Extreme motocross stunts",             direct: true  },
  { name: "Vex 5",              url: "https://3kh0.github.io/projects/vex5/index.html",               tag: "action",  category: "action",  desc: "Stick figure platformer",              direct: true  },
  { name: "Rooftop Snipers",    url: "https://3kh0.github.io/projects/rooftop-snipers/index.html",   tag: "action",  category: "action",  desc: "2-player rooftop battle",              direct: true  },
  { name: "Temple Run 2",       url: "https://3kh0.github.io/projects/temple-run-2/index.html",       tag: "action",  category: "action",  desc: "Classic endless runner",               direct: true  },
  { name: "Flappy Bird",        url: "https://3kh0.github.io/projects/flappy-bird/index.html",        tag: "action",  category: "action",  desc: "Tap to fly through pipes",             direct: true  },
  { name: "Geometry Dash",      url: "https://3kh0.github.io/projects/geodash/index.html",            tag: "action",  category: "action",  desc: "Rhythm-based platformer",              direct: true  },
  { name: "Doodle Jump",        url: "https://3kh0.github.io/projects/doodle-jump/index.html",        tag: "action",  category: "action",  desc: "Jump your way to the top",             direct: true  },
  { name: "Run 3",              url: "https://3kh0.github.io/projects/run3/index.html",               tag: "action",  category: "action",  desc: "Run through alien tunnels",            direct: true  },
  { name: "Stickman Hook",      url: "https://3kh0.github.io/projects/stickman-hook/index.html",      tag: "action",  category: "action",  desc: "Swing through levels with style",      direct: true  },
  { name: "Basketball Stars",   url: "https://3kh0.github.io/projects/basketball-stars/index.html",   tag: "action",  category: "action",  desc: "1v1 basketball battles",               direct: true  },
  { name: "Getaway Shootout",   url: "https://3kh0.github.io/projects/getaway-shootout/index.html",   tag: "action",  category: "action",  desc: "Race and fight to the escape",         direct: true  },
  { name: "Subway Surfers",     url: "https://3kh0.github.io/projects/subway-surfers/index.html",     tag: "action",  category: "action",  desc: "Endless subway runner",                direct: true  },
  { name: "Death Run 3D",       url: "https://3kh0.github.io/projects/death-run-3d/index.html",       tag: "action",  category: "action",  desc: "Dodge obstacles in 3D",                direct: true  },
  { name: "Drift Boss",         url: "https://3kh0.github.io/projects/drift-boss/index.html",         tag: "action",  category: "action",  desc: "Master the drift around corners",      direct: true  },
  { name: "Friday Night Funkin", url: "https://3kh0.github.io/projects/fnf/index.html",               tag: "action",  category: "action",  desc: "Rhythm battle game",                   direct: true  },
  { name: "Gun Mayhem 2",       url: "https://3kh0.github.io/projects/gun-mayhem-2/index.html",       tag: "action",  category: "action",  desc: "Platform shooter chaos",               direct: true  },
  { name: "1v1 LOL",            url: "https://3kh0.github.io/projects/1v1-lol/index.html",            tag: "action",  category: "action",  desc: "Build and battle in real-time",        direct: true  },
  { name: "Krunker",            url: "https://3kh0.github.io/projects/krunker/index.html",            tag: "action",  category: "action",  desc: "Fast-paced browser FPS",               direct: true  },
  { name: "Shell Shockers",     url: "https://3kh0.github.io/projects/shell-shockers/index.html",     tag: "action",  category: "action",  desc: "Egg-based FPS battle royale",          direct: true  },
  { name: "Vex 3",              url: "https://3kh0.github.io/projects/vex3/index.html",               tag: "action",  category: "action",  desc: "Challenging stick platformer",         direct: true  },
  { name: "Vex 4",              url: "https://3kh0.github.io/projects/vex4/index.html",               tag: "action",  category: "action",  desc: "Stick platformer with new traps",      direct: true  },
  { name: "Vex 6",              url: "https://3kh0.github.io/projects/vex6/index.html",               tag: "action",  category: "action",  desc: "Stickman obstacle course",             direct: true  },
  { name: "Vex 7",              url: "https://3kh0.github.io/projects/vex7/index.html",               tag: "action",  category: "action",  desc: "Latest Vex stickman platformer",       direct: true  },
  { name: "MotoX3M 2",          url: "https://3kh0.github.io/projects/motox3m2/index.html",           tag: "action",  category: "action",  desc: "More extreme motocross levels",        direct: true  },
  { name: "MotoX3M Pool Party", url: "https://3kh0.github.io/projects/motox3m-pool/index.html",       tag: "action",  category: "action",  desc: "Poolside moto stunts",                 direct: true  },
  { name: "MotoX3M Spooky Land", url: "https://3kh0.github.io/projects/motox3m-spooky/index.html",    tag: "action",  category: "action",  desc: "Halloween moto madness",               direct: true  },
  { name: "MotoX3M Winter",     url: "https://3kh0.github.io/projects/motox3m-winter/index.html",     tag: "action",  category: "action",  desc: "Snow and ice motocross",               direct: true  },
  { name: "Cluster Rush",       url: "https://3kh0.github.io/projects/cluster-rush/index.html",       tag: "action",  category: "action",  desc: "Jump across speeding trucks",          direct: true  },
  { name: "Slope 2",            url: "https://3kh0.github.io/projects/slope-2/index.html",            tag: "action",  category: "action",  desc: "Even faster ball rolling",             direct: true  },
  { name: "Drive Mad",          url: "https://3kh0.github.io/projects/drive-mad/index.html",          tag: "action",  category: "action",  desc: "Crazy physics driving game",           direct: true  },
  { name: "OvO",                url: "https://3kh0.github.io/projects/ovo/index.html",                tag: "action",  category: "action",  desc: "Speedy parkour platformer",            direct: true  },
  { name: "Ninja",              url: "https://3kh0.github.io/projects/ninja/index.html",              tag: "action",  category: "action",  desc: "Classic N ninja game",                 direct: true  },
  { name: "Tanuki Sunset",      url: "https://3kh0.github.io/projects/tanuki-sunset/index.html",      tag: "action",  category: "action",  desc: "Chill longboard downhill ride",        direct: true  },
  { name: "Stickman Boost",     url: "https://3kh0.github.io/projects/stickman-boost/index.html",     tag: "action",  category: "action",  desc: "Stickman speed platformer",            direct: true  },
  { name: "Madalin Stunt Cars 2", url: "https://3kh0.github.io/projects/madalin-stunt-cars-2/index.html", tag: "action", category: "action", desc: "Open-world stunt driving",           direct: true  },
  { name: "Jetpack Joyride",    url: "https://3kh0.github.io/projects/jetpack-joyride/index.html",    tag: "action",  category: "action",  desc: "Fly a jetpack through the lab",        direct: true  },
  { name: "Snow Rider 3D",      url: "https://3kh0.github.io/projects/snow-rider-3d/index.html",      tag: "action",  category: "action",  desc: "Snowboard down endless slopes",        direct: true  },
  { name: "Drift Hunters",      url: "https://3kh0.github.io/projects/drift-hunters/index.html",      tag: "action",  category: "action",  desc: "Tune cars and drift for points",       direct: true  },
  { name: "Toss the Turtle",    url: "https://3kh0.github.io/projects/toss-the-turtle/index.html",    tag: "action",  category: "action",  desc: "Launch a turtle as far as possible",   direct: true  },
  { name: "Learn to Fly 3",     url: "https://3kh0.github.io/projects/learn-to-fly-3/index.html",     tag: "action",  category: "action",  desc: "Launch a penguin into the sky",        direct: true  },
  { name: "Rolling Sky",        url: "/games/Rolling-sky.html",                                       tag: "action",  category: "action",  desc: "Roll a ball across sky platforms",     local: true   },
  { name: "The Backrooms",      url: "/games/backrooms.html",                                         tag: "action",  category: "action",  desc: "Escape the endless liminal rooms",     local: true   },
  { name: "Bullet Force",       url: "/games/bullet-force.html",                                      tag: "action",  category: "action",  desc: "3D multiplayer FPS shooter",           local: true   },
  // IO
  { name: "Paper.io 2",         url: "https://3kh0.github.io/projects/paperio2/index.html",           tag: "io",      category: "io",      desc: "Claim territory on the map",           direct: true  },
  { name: "Boxing Random",      url: "https://3kh0.github.io/projects/boxing-random/index.html",      tag: "io",      category: "io",      desc: "Random boxing mayhem",                 direct: true  },
  { name: "Slither.io",         url: "https://3kh0.github.io/projects/slither/index.html",            tag: "io",      category: "io",      desc: "Grow your snake, eat everything",      direct: true  },
  { name: "Agar.io",            url: "https://3kh0.github.io/projects/agar/index.html",               tag: "io",      category: "io",      desc: "Eat cells, grow massive",              direct: true  },
  { name: "Among Us",           url: "https://3kh0.github.io/projects/among-us/index.html",           tag: "io",      category: "io",      desc: "Find the impostor among your crew",    direct: true  },
  { name: "Smash Karts",        url: "https://3kh0.github.io/projects/smashkarts/index.html",         tag: "io",      category: "io",      desc: "Kart battle royale",                   direct: true  },
  { name: "JustFall.lol",       url: "https://3kh0.github.io/projects/just-fall/index.html",          tag: "io",      category: "io",      desc: "Fall and survive",                     direct: true  },
  { name: "Snow Battle",        url: "https://3kh0.github.io/projects/snowbattle/index.html",         tag: "io",      category: "io",      desc: "Multiplayer snowball fight",           direct: true  },
  { name: "Zombs Royale",       url: "https://3kh0.github.io/projects/zombs-royale/index.html",       tag: "io",      category: "io",      desc: "2D battle royale survival",            direct: true  },
  { name: "Tube Jumpers",       url: "https://3kh0.github.io/projects/tube-jumpers/index.html",       tag: "io",      category: "io",      desc: "Jump tubes to knock off opponents",    direct: true  },
  { name: "Soccer Random",      url: "https://3kh0.github.io/projects/soccer-random/index.html",      tag: "io",      category: "io",      desc: "Wacky physics soccer battles",         direct: true  },
  { name: "Narrow One",         url: "/games/narrow-one.html",                                        tag: "io",      category: "io",      desc: "Multiplayer archery capture the flag", local: true   },
  { name: "Bloxd.io",           url: "/games/bloxd-io.html",                                          tag: "io",      category: "io",      desc: "Multiplayer Minecraft-style building",  local: true   },
  { name: "Venge.io",           url: "/games/venge-io.html",                                          tag: "io",      category: "io",      desc: "Multiplayer FPS battle arena",         local: true   },
  { name: "Merc Zone",          url: "/games/Merc-zone.html",                                         tag: "io",      category: "io",      desc: "Top-down multiplayer shooter",         local: true   },
  { name: "Skribbl.io",         url: "https://skribbl.io/",                                           tag: "io",      category: "io",      desc: "Draw and guess with friends"                          },
  { name: "Doomz.io",           url: "https://doomz.io/",                                             tag: "io",      category: "io",      desc: "Multiplayer doom-style shooter"                       },
  { name: "LOLBeans",           url: "https://lolbeans.io/",                                          tag: "io",      category: "io",      desc: "Bean battle royale"                                   },
  // Classic
  { name: "Minecraft (Eaglercraft)", url: "https://3kh0.github.io/projects/minecraft/index.html",     tag: "classic", category: "classic", desc: "Full Minecraft browser edition",       direct: true  },
  { name: "Google Snake",       url: "https://3kh0.github.io/projects/google-snake/index.html",       tag: "classic", category: "classic", desc: "Classic snake game",                   direct: true  },
  { name: "Super Mario Bros",   url: "https://3kh0.github.io/projects/super-mario-bros/index.html",   tag: "classic", category: "classic", desc: "The original platformer legend",        direct: true  },
  { name: "Duck Life",          url: "https://3kh0.github.io/projects/duck-life/index.html",           tag: "classic", category: "classic", desc: "Train your duck to race",              direct: true  },
  { name: "Duck Life 2",        url: "https://3kh0.github.io/projects/ducklife2/index.html",           tag: "classic", category: "classic", desc: "Duck racing sequel",                   direct: true  },
  { name: "Duck Life 3",        url: "https://3kh0.github.io/projects/ducklife3/index.html",           tag: "classic", category: "classic", desc: "Duck evolution adventure",             direct: true  },
  { name: "Duck Life 4",        url: "https://3kh0.github.io/projects/ducklife4/index.html",           tag: "classic", category: "classic", desc: "Duck battle tournament",               direct: true  },
  { name: "Tank Trouble",       url: "https://3kh0.github.io/projects/tank-trouble-2/index.html",     tag: "classic", category: "classic", desc: "Tank maze battle",                     direct: true  },
  { name: "Fireboy & Watergirl",url: "https://3kh0.github.io/projects/fireboy-and-watergirl/index.html", tag: "classic", category: "classic", desc: "Elemental puzzle platformer",      direct: true  },
  { name: "Minecraft Classic",  url: "https://3kh0.github.io/projects/minecraft-classic/index.html",  tag: "classic", category: "classic", desc: "Classic Minecraft in browser",         direct: true  },
  { name: "Chess",              url: "https://3kh0.github.io/projects/chess/index.html",              tag: "classic", category: "classic", desc: "Play chess online",                    direct: true  },
  { name: "Tetris",             url: "https://3kh0.github.io/projects/tetris/index.html",             tag: "classic", category: "classic", desc: "Competitive Tetris",                   direct: true  },
  { name: "The World's Hardest Game", url: "https://3kh0.github.io/projects/worlds-hardest-game/index.html", tag: "classic", category: "classic", desc: "Brutally hard skill game",     direct: true  },
  { name: "World's Hardest Game 2", url: "https://3kh0.github.io/projects/worlds-hardest-game-2/index.html", tag: "classic", category: "classic", desc: "Even harder sequel",          direct: true  },
  { name: "Learn to Fly",       url: "https://3kh0.github.io/projects/learntofly/index.html",         tag: "classic", category: "classic", desc: "Launch a penguin into the sky",        direct: true  },
  { name: "Learn to Fly 2",     url: "https://3kh0.github.io/projects/learntofly2/index.html",        tag: "classic", category: "classic", desc: "Penguin flight upgraded",              direct: true  },
  { name: "Bad Ice Cream",      url: "https://3kh0.github.io/projects/bad-ice-cream/index.html",      tag: "classic", category: "classic", desc: "Freeze foes in icy maze",              direct: true  },
  { name: "Bad Ice Cream 2",    url: "https://3kh0.github.io/projects/bad-ice-cream-2/index.html",    tag: "classic", category: "classic", desc: "More icy maze madness",                direct: true  },
  { name: "Bad Ice Cream 3",    url: "https://3kh0.github.io/projects/bad-ice-cream-3/index.html",    tag: "classic", category: "classic", desc: "Triple the ice cream chaos",           direct: true  },
  { name: "Wolfenstein 3D",     url: "https://3kh0.github.io/projects/wolf3d/index.html",             tag: "classic", category: "classic", desc: "Classic 3D first-person shooter",      direct: true  },
  { name: "FNAF 1",             url: "/games/fnaf1.html",                                             tag: "classic", category: "classic", desc: "Five Nights at Freddy's original",      local: true   },
  { name: "FNAF 2",             url: "/games/fnaf2.html",                                             tag: "classic", category: "classic", desc: "Five Nights at Freddy's 2",             local: true   },
  { name: "FNAF 3",             url: "/games/fnaf3.html",                                             tag: "classic", category: "classic", desc: "Five Nights at Freddy's 3",             local: true   },
  { name: "FNAF 4",             url: "/games/fnaf4.html",                                             tag: "classic", category: "classic", desc: "Five Nights at Freddy's 4",             local: true   },
  { name: "FNAF Sister Location", url: "/games/sister-location.html",                                 tag: "classic", category: "classic", desc: "Five Nights at Freddy's Sister Location", local: true },
  { name: "Minecraft Tower Defense", url: "/games/Minecraft-tower-defense.html",                      tag: "classic", category: "classic", desc: "Defend your Minecraft base",            local: true   },
  { name: "Survival Craft",     url: "/games/Survival-craft.html",                                    tag: "classic", category: "classic", desc: "Eaglercraft multiplayer survival",       local: true   },
  { name: "Lichess",            url: "https://lichess.org/",                                          tag: "classic", category: "classic", desc: "Free open-source chess"                               },
  // Puzzle
  { name: "Wordle",             url: "https://3kh0.github.io/projects/wordle/index.html",             tag: "puzzle",  category: "puzzle",  desc: "Guess the 5-letter word",              direct: true  },
  { name: "Minesweeper",        url: "https://3kh0.github.io/projects/minesweeper/index.html",        tag: "puzzle",  category: "puzzle",  desc: "Clear the minefield",                  direct: true  },
  { name: "Cut the Rope",       url: "https://3kh0.github.io/projects/ctr/index.html",                tag: "puzzle",  category: "puzzle",  desc: "Feed candy to the monster",            direct: true  },
  { name: "Helix Jump",         url: "https://3kh0.github.io/projects/helix-jump/index.html",         tag: "puzzle",  category: "puzzle",  desc: "Drop through the spinning helix",      direct: true  },
  { name: "Bob the Robber",     url: "https://3kh0.github.io/projects/bob-the-robber/index.html",     tag: "puzzle",  category: "puzzle",  desc: "Sneak and steal through levels",       direct: true  },
  { name: "Crossy Road",        url: "https://3kh0.github.io/projects/crossy-road/index.html",        tag: "puzzle",  category: "puzzle",  desc: "Hop across endless roads",             direct: true  },
  { name: "2048",               url: "https://gabrielecirulli.github.io/2048/",                       tag: "puzzle",  category: "puzzle",  desc: "Slide tiles to reach 2048",            direct: true  },
  { name: "Bloxorz",           url: "https://3kh0.github.io/projects/bloxorz/index.html",            tag: "puzzle",  category: "puzzle",  desc: "Roll a block to the goal",             direct: true  },
  { name: "Tower Defense",     url: "/games/Tower-defense.html",                                      tag: "puzzle",  category: "puzzle",  desc: "Build towers, stop the enemies",       local: true   },
  { name: "Sandboxels",         url: "https://3kh0.github.io/projects/sandboxels/index.html",         tag: "puzzle",  category: "puzzle",  desc: "Mix elements in a physics sandbox",    direct: true  },
  { name: "Solitaire",          url: "https://3kh0.github.io/projects/solitaire/index.html",          tag: "puzzle",  category: "puzzle",  desc: "Classic card game",                    direct: true  },
  { name: "Sand Game",          url: "https://3kh0.github.io/projects/sand-game/index.html",          tag: "puzzle",  category: "puzzle",  desc: "Simulate falling sand physics",        direct: true  },
  { name: "There Is No Game",   url: "https://3kh0.github.io/projects/there-is-no-game/index.html",   tag: "puzzle",  category: "puzzle",  desc: "A game that isn't a game",             direct: true  },
  { name: "Little Alchemy 2",   url: "https://littlealchemy2.com/",                                   tag: "puzzle",  category: "puzzle",  desc: "Combine elements to make new things"                  },
  { name: "Connect Four",       url: "https://papergames.io/en/connect4",                             tag: "puzzle",  category: "puzzle",  desc: "Classic connect four"                                 },
  { name: "Fancy Pants",        url: "https://3kh0.github.io/projects/fancypantsadventures/index.html", tag: "action",  category: "action",  desc: "Smooth stickman platformer",           direct: true  },
  { name: "Stick War",          url: "https://3kh0.github.io/projects/stickwar/index.html",           tag: "action",  category: "action",  desc: "Build an army of stickmen",            direct: true  },
  // Casual
  { name: "Retro Bowl",         url: "https://3kh0.github.io/projects/retro-bowl/index.html",         tag: "casual",  category: "casual",  desc: "Lead your team to the championship",   direct: true  },
  { name: "Idle Breakout",      url: "https://3kh0.github.io/projects/idle-breakout/index.html",      tag: "casual",  category: "casual",  desc: "Idle ball-breaking fun",               direct: true  },
  { name: "Happy Wheels",       url: "https://3kh0.github.io/projects/happy-wheels/index.html",       tag: "casual",  category: "casual",  desc: "Ragdoll physics mayhem",               direct: true  },
  { name: "Monkey Mart",        url: "https://3kh0.github.io/projects/monkey-mart/index.html",        tag: "casual",  category: "casual",  desc: "Manage your own mart",                 direct: true  },
  { name: "Piano Tiles",        url: "https://3kh0.github.io/projects/piano-tiles/index.html",        tag: "casual",  category: "casual",  desc: "Tap the tiles to the beat",            direct: true  },
  { name: "Cookie Clicker",     url: "https://3kh0.github.io/projects/cookie-clicker/index.html",    tag: "casual",  category: "casual",  desc: "Click cookies, build an empire",       direct: true  },
  { name: "Townscaper",         url: "https://3kh0.github.io/projects/townscaper/index.html",         tag: "casual",  category: "casual",  desc: "Build colorful island towns",          direct: true  },
  { name: "Hacker Typer",       url: "https://3kh0.github.io/projects/hackertype/index.html",         tag: "casual",  category: "casual",  desc: "Look like a movie hacker",             direct: true  },
  { name: "Sort the Court",     url: "https://3kh0.github.io/projects/sort-the-court/index.html",     tag: "casual",  category: "casual",  desc: "Rule your kingdom with yes or no",     direct: true  },
  { name: "Idle Shark",         url: "https://3kh0.github.io/projects/idle-shark/index.html",         tag: "casual",  category: "casual",  desc: "Grow a massive shark empire",          direct: true  },
  { name: "Papa's Burgeria",    url: "https://3kh0.github.io/projects/papasburgeria/index.html",      tag: "casual",  category: "casual",  desc: "Flip burgers for hungry customers",    direct: true  },
  { name: "Papa's Pizzeria",    url: "https://3kh0.github.io/projects/papaspizzaria/index.html",      tag: "casual",  category: "casual",  desc: "Craft perfect pizzas",                 direct: true  },
  { name: "Chrome Dino",        url: "https://3kh0.github.io/projects/chrome-dino/index.html",        tag: "casual",  category: "casual",  desc: "The classic offline dino runner",      direct: true  },
  { name: "Rolly Vortex",       url: "https://3kh0.github.io/projects/rolly-vortex/index.html",       tag: "casual",  category: "casual",  desc: "Roll through the vortex tunnel",       direct: true  },
  { name: "Superhot",           url: "https://3kh0.github.io/projects/superhot/index.html",           tag: "casual",  category: "casual",  desc: "Time moves when you move",             direct: true  },
  { name: "Ages of Conflict",   url: "https://3kh0.github.io/projects/ages-of-conflict/index.html",   tag: "casual",  category: "casual",  desc: "World domination strategy",            direct: true  },
  { name: "Grindcraft",         url: "https://3kh0.github.io/projects/grindcraft/index.html",         tag: "casual",  category: "casual",  desc: "Minecraft-style idle crafting",        direct: true  },
  { name: "Stickman Golf",      url: "https://3kh0.github.io/projects/stickman-golf/index.html",      tag: "casual",  category: "casual",  desc: "Trick shot mini golf",                 direct: true  },
];

const APPS = [
  { name: "YouTube",     url: "https://youtube.com/",           tag: "media",        category: "media",       desc: "Watch & stream videos",       bg: "#ff0000" },
  { name: "Netflix",     url: "https://netflix.com/",           tag: "media",        category: "media",       desc: "Movies & TV shows",           bg: "#e50914" },
  { name: "Spotify",     url: "https://open.spotify.com/",      tag: "media",        category: "media",       desc: "Stream music & podcasts",     bg: "#1db954" },
  { name: "Discord",     url: "https://discord.com/app",        tag: "social",       category: "social",      desc: "Chat with your server",       bg: "#5865f2" },
  { name: "Instagram",   url: "https://instagram.com/",         tag: "social",       category: "social",      desc: "Photos & reels",              bg: "#e1306c" },
  { name: "Twitter / X", url: "https://x.com/",                 tag: "social",       category: "social",      desc: "What's happening",            bg: "#000000" },
  { name: "Reddit",      url: "https://reddit.com/",            tag: "social",       category: "social",      desc: "Front page of the internet",  bg: "#ff4500" },
  { name: "TikTok",      url: "https://www.tiktok.com/",        tag: "social",       category: "social",      desc: "Short-form video",            bg: "#010101" },
  { name: "ChatGPT",     url: "https://chatgpt.com/",           tag: "ai",           category: "ai",          desc: "AI assistant by OpenAI",      bg: "#10a37f" },
  { name: "Claude",      url: "https://claude.ai/",             tag: "ai",           category: "ai",          desc: "AI by Anthropic",             bg: "#d97706" },
  { name: "Gemini",      url: "https://gemini.google.com/",     tag: "ai",           category: "ai",          desc: "AI by Google",                bg: "#4285f4" },
  { name: "Perplexity",  url: "https://perplexity.ai/",         tag: "ai",           category: "ai",          desc: "AI-powered search",           bg: "#20b2aa" },
  { name: "Google",      url: "https://google.com/",            tag: "productivity", category: "productivity", desc: "Search the web",             bg: "#4285f4" },
  { name: "Gmail",       url: "https://mail.google.com/",       tag: "productivity", category: "productivity", desc: "Email by Google",            bg: "#ea4335" },
  { name: "Google Docs", url: "https://docs.google.com/",       tag: "productivity", category: "productivity", desc: "Write & collaborate",        bg: "#4285f4" },
  { name: "Notion",      url: "https://notion.so/",             tag: "productivity", category: "productivity", desc: "Notes, docs & wikis",        bg: "#ffffff" },
  { name: "Canva",       url: "https://canva.com/",             tag: "productivity", category: "productivity", desc: "Design anything",            bg: "#00c4cc" },
  { name: "GitHub",      url: "https://github.com/",            tag: "dev",          category: "dev",          desc: "Code & collaborate",         bg: "#24292f" },
  { name: "Replit",      url: "https://replit.com/",            tag: "dev",          category: "dev",          desc: "Code in the browser",        bg: "#f26207" },
  { name: "CodePen",     url: "https://codepen.io/",            tag: "dev",          category: "dev",          desc: "Front-end playground",       bg: "#1e1f26" },
];

const QUICK_GAMES = GAMES.slice(0, 6);
const QUICK_APPS  = APPS.slice(0, 6);

let proxyReady = false;

// ── Proxy init ───────────────────────────
async function initProxy() {
  // Navigation goes to proxy.html which handles the UV bootstrap.
  // Pre-register the UV worker so the first open is less flaky.
  proxyReady = true;
  setProxyStatus("active", "proxy active");
  document.getElementById("search-btn")?.removeAttribute("disabled");
  try {
    navigator.serviceWorker.register("/uv/sw.js", { scope: "/service/" }).catch(() => {});
  } catch {}
}

function setProxyStatus(state, text) {
  const el  = document.getElementById("proxy-status");
  const txt = document.getElementById("proxy-status-text");
  if (!el || !txt) return;
  el.className    = "proxy-badge " + state;
  txt.textContent = text;
}

// ── Navigation ───────────────────────────
function navigate(rawUrl) {
  if (!rawUrl.trim()) return;
  let url = rawUrl.trim();
  if (!/^https?:\/\//i.test(url)) url = "https://" + url;
  try { new URL(url); } catch {
    url = `https://duckduckgo.com/?q=${encodeURIComponent(rawUrl)}`;
  }
  if (!proxyReady) { toast("proxy still loading.", "error"); return; }
  addRecent(url);
  // Everything opens in the embedded proxy viewer — keeps nav/back/forward inside the site
  window.location.href = `/proxy.html?url=${encodeURIComponent(url)}`;
}

function handleSearch(raw) {
  const input = raw.trim();
  if (!input) return;
  const looksLikeUrl = /^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\/\S*)?$/.test(input);
  navigate(looksLikeUrl ? input : `https://duckduckgo.com/?q=${encodeURIComponent(input)}`);
}

// ── Favicon helper ───────────────────────
function faviconUrl(siteUrl) {
  try { return `https://www.google.com/s2/favicons?domain=${new URL(siteUrl).hostname}&sz=64`; }
  catch { return ""; }
}

// ── Recent sites ─────────────────────────
const RECENT_KEY = "uwu_recent";
function getRecent() {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]"); } catch { return []; }
}
function addRecent(url) {
  const list = getRecent().filter(r => r.url !== url);
  list.unshift({ url, domain: new URL(url).hostname.replace(/^www\./, ""), ts: Date.now() });
  localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, 8)));
  renderRecent();
}
function clearRecent() { localStorage.removeItem(RECENT_KEY); renderRecent(); toast("history cleared", "success"); }

function renderRecent() {
  const grid = document.getElementById("recent-grid");
  if (!grid) return;
  const list = getRecent();
  if (!list.length) { grid.innerHTML = '<div class="recent-empty">nothing yet — browse something.</div>'; return; }
  grid.innerHTML = list.map(r => `
    <div class="recent-card" data-url="${escHtml(r.url)}" title="${escHtml(r.url)}">
      <div class="recent-favicon"><img src="${escHtml(faviconUrl(r.url))}" alt="" loading="lazy" onerror="this.style.opacity=0"/></div>
      <div class="recent-domain">${escHtml(r.domain)}</div>
    </div>`).join("");
  grid.querySelectorAll(".recent-card").forEach(c => c.addEventListener("click", () => navigate(c.dataset.url)));
}

// ── Card renderers ───────────────────────
function quickCard(item) {
  return `<div class="card" data-url="${escHtml(item.url)}" data-name="${escHtml(item.name)}" data-direct="${item.direct ? "1" : ""}" data-local="${item.local ? "1" : ""}">
    <div class="card-favicon"><img src="${escHtml(faviconUrl(item.url))}" alt="${escHtml(item.name)}" loading="lazy" onerror="this.style.opacity=0"/></div>
    <div class="card-name">${escHtml(item.name)}</div>
    <div class="card-desc">${escHtml(item.desc)}</div>
    <div class="card-tag tag-${item.tag}">${item.tag}</div>
  </div>`;
}

function gameFrameUrl(url, name) {
  return `/game-frame.html?url=${encodeURIComponent(url)}&name=${encodeURIComponent(name || "")}`;
}

function renderQuickGames() {
  const el = document.getElementById("quick-games");
  if (!el) return;
  el.innerHTML = QUICK_GAMES.map(quickCard).join("");
  el.querySelectorAll(".card").forEach(c => c.addEventListener("click", () => {
    const target = (c.dataset.url || "").trim();
    const name = (c.dataset.name || "").trim();
    if (!target) return toast("Game URL is missing", "error");
    window.location.href = gameFrameUrl(target, name);
  }));
}

function renderQuickApps() {
  const el = document.getElementById("quick-apps");
  if (!el) return;
  el.innerHTML = QUICK_APPS.map(quickCard).join("");
  el.querySelectorAll(".card").forEach(c => c.addEventListener("click", () => navigate(c.dataset.url)));
}

function renderGames(filter = "all") {
  const grid = document.getElementById("games-grid");
  if (!grid) return;
  const list = filter === "all" ? GAMES : GAMES.filter(g => g.category === filter);
  grid.innerHTML = list.map(g => `
    <div class="game-card" data-url="${escHtml(g.url)}" data-name="${escHtml(g.name)}" data-direct="${g.direct ? "1" : ""}" data-local="${g.local ? "1" : ""}">
      <div class="game-thumb"><img src="${escHtml(faviconUrl(g.url))}" alt="${escHtml(g.name)}" loading="lazy" onerror="this.style.opacity=0"/></div>
      <div class="game-info">
        <div class="game-name">${escHtml(g.name)}</div>
        <div class="game-desc">${escHtml(g.desc)}</div>
        <div class="game-footer">
          <div class="card-tag tag-${g.tag}">${g.tag}</div>
          <button class="play-btn">play</button>
        </div>
      </div>
    </div>`).join("");
  grid.querySelectorAll(".game-card").forEach(card => {
    function openGame() {
      const target = (card.dataset.url || "").trim();
      const name = (card.dataset.name || "").trim();
      if (!target) return toast("Game URL is missing", "error");
      window.location.href = gameFrameUrl(target, name);
    }
    card.querySelector(".play-btn")?.addEventListener("click", e => { e.stopPropagation(); openGame(); });
    card.addEventListener("click", openGame);
  });
}

function renderApps(filter = "all") {
  const grid = document.getElementById("apps-grid");
  if (!grid) return;
  const list = filter === "all" ? APPS : APPS.filter(a => a.category === filter);
  grid.innerHTML = list.map(a => `
    <div class="app-card" data-url="${escHtml(a.url)}">
      <div class="app-icon" style="background:${a.bg}18;border:1px solid ${a.bg}35">
        <img src="${escHtml(faviconUrl(a.url))}" alt="${escHtml(a.name)}" loading="lazy" onerror="this.style.opacity=0"/>
      </div>
      <div class="app-name">${escHtml(a.name)}</div>
      <div class="app-desc">${escHtml(a.desc)}</div>
      <div class="card-tag tag-${a.tag}">${a.tag}</div>
    </div>`).join("");
  grid.querySelectorAll(".app-card").forEach(c => c.addEventListener("click", () => navigate(c.dataset.url)));
}

// ── Filters ──────────────────────────────
function initFilters(filterId, renderFn) {
  document.getElementById(filterId)?.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(`#${filterId} .filter-btn`).forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderFn(btn.dataset.filter);
    });
  });
}

// ── Settings modal ───────────────────────
function initSettings() {
  const overlay = document.getElementById("settings-modal");
  document.getElementById("settings-btn")?.addEventListener("click",    () => overlay?.classList.add("open"));
  document.getElementById("modal-close-btn")?.addEventListener("click", () => overlay?.classList.remove("open"));
  overlay?.addEventListener("click", e => { if (e.target === overlay) overlay.classList.remove("open"); });

  document.querySelectorAll(".cloak-preset").forEach(btn => {
    btn.addEventListener("click", () => {
      const { title, icon } = btn.dataset;
      if (document.getElementById("cloak-title")) document.getElementById("cloak-title").value = title;
      if (document.getElementById("cloak-icon"))  document.getElementById("cloak-icon").value  = icon;
      applyCloak(title, icon);
      toast(`cloaked as "${title}"`, "success");
    });
  });

  document.getElementById("apply-cloak-btn")?.addEventListener("click", () => {
    applyCloak(
      document.getElementById("cloak-title")?.value || "New Tab",
      document.getElementById("cloak-icon")?.value  || ""
    );
    toast("cloak applied", "success");
  });

  document.getElementById("clear-history-btn")?.addEventListener("click", clearRecent);
  document.getElementById("clear-recent-btn")?.addEventListener("click",  clearRecent);

  // Inject owner-only red theme toggle
  const _sess = JSON.parse(localStorage.getItem("uwu_session") || "{}");
  if (_sess.role === "owner") {
    const modalBody = document.querySelector("#settings-modal .modal-body");
    if (modalBody) {
      const grp = document.createElement("div");
      grp.className = "setting-group";
      grp.innerHTML = `
        <div class="setting-label">Appearance <span style="color:var(--yellow);font-size:0.6rem;margin-left:4px">owner only</span></div>
        <button class="btn-theme-red" id="theme-toggle-btn"></button>`;
      modalBody.appendChild(grp);
      function updateThemeBtn() {
        const btn = document.getElementById("theme-toggle-btn");
        if (!btn) return;
        const isRed = localStorage.getItem("uwu_theme") === "red";
        btn.textContent = isRed ? "🔴 Red Theme — click to reset" : "🔴 Enable Red Theme";
        btn.style.background = isRed ? "rgba(239,68,68,0.18)" : "rgba(239,68,68,0.07)";
      }
      updateThemeBtn();
      document.getElementById("theme-toggle-btn")?.addEventListener("click", () => {
        const isRed = localStorage.getItem("uwu_theme") === "red";
        applyTheme(isRed ? "default" : "red");
        updateThemeBtn();
        toast(isRed ? "default theme restored" : "red theme activated 🔴", "success");
      });
    }
  }
}

function applyCloak(title, iconUrl) {
  document.title = title;
  let link = document.querySelector('link[rel="icon"]');
  if (!link) { link = document.createElement("link"); link.rel = "icon"; document.head.appendChild(link); }
  link.href = iconUrl || "data:,";
  localStorage.setItem("uwu_cloak", JSON.stringify({ title, iconUrl }));
}

function loadCloak() {
  try { const c = JSON.parse(localStorage.getItem("uwu_cloak") || "null"); if (c) applyCloak(c.title, c.iconUrl); } catch {}
}

// ── Keyboard shortcuts ───────────────────
function initKeyboard() {
  document.addEventListener("keydown", e => {
    if (e.altKey && e.key === "p") { e.preventDefault(); window.location.href = "https://google.com"; }
    if (e.altKey && e.key === "s") { e.preventDefault(); document.getElementById("settings-modal")?.classList.toggle("open"); }
    if (e.altKey && e.key === "f") { e.preventDefault(); document.getElementById("search-input")?.focus(); }
  });
}

// ── Search form ──────────────────────────
function initSearch() {
  const form  = document.getElementById("search-form");
  const input = document.getElementById("search-input");
  if (!form || !input) return;
  form.addEventListener("submit", e => { e.preventDefault(); handleSearch(input.value); });
}

// ── Version ──────────────────────────────
function showVersion() {
  document.querySelectorAll("#version-tag, #footer-version").forEach(el => { el.textContent = `v${VERSION}`; });
}

// ── Particles + Starfield ─────────────────
function initStars() {
  const canvas = document.getElementById("stars-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener("resize", resize);

  // Static twinkling stars
  const stars = Array.from({ length: 80 }, () => ({
    x: Math.random(), y: Math.random(),
    r: Math.random() * 1.2 + 0.2,
    a: Math.random(), da: (Math.random() - 0.5) * 0.003,
    drift: (Math.random() - 0.5) * 0.00005,
  }));

  // Falling particles
  const COLORS = ["255,121,198", "189,147,249", "139,233,253", "80,250,123", "248,248,242"];
  const particles = Array.from({ length: 22 }, () => spawnParticle(true));

  function spawnParticle(randomY = false) {
    return {
      x: Math.random() * canvas.width,
      y: randomY ? Math.random() * canvas.height : -10,
      r: Math.random() * 2.5 + 0.8,
      speed: Math.random() * 0.4 + 0.15,
      drift: (Math.random() - 0.5) * 0.3,
      a: Math.random() * 0.35 + 0.1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      spin: Math.random() * Math.PI * 2,
      spinSpeed: (Math.random() - 0.5) * 0.02,
      type: Math.random() > 0.6 ? "star" : "dot",
    };
  }

  function drawStar(x, y, r, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(angle) * r * 2.5, Math.sin(angle) * r * 2.5);
    }
    ctx.stroke();
    ctx.restore();
  }

  (function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Twinkling stars
    for (const s of stars) {
      s.a += s.da; s.x += s.drift;
      if (s.a < 0) s.da = Math.abs(s.da);
      if (s.a > 1) s.da = -Math.abs(s.da);
      if (s.x < 0) s.x = 1; if (s.x > 1) s.x = 0;
      ctx.beginPath();
      ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(248,248,242,${s.a * 0.4})`;
      ctx.fill();
    }

    // Falling particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.y += p.speed;
      p.x += p.drift;
      p.spin += p.spinSpeed;

      if (p.y > canvas.height + 20) {
        particles[i] = spawnParticle(false);
        continue;
      }

      ctx.globalAlpha = p.a;
      if (p.type === "star") {
        ctx.strokeStyle = `rgba(${p.color},${p.a})`;
        ctx.lineWidth = 0.8;
        drawStar(p.x, p.y, p.r, p.spin);
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${p.a})`;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    requestAnimationFrame(draw);
  })();
}

// ── Toast ────────────────────────────────
function toast(msg, type = "info") {
  const c = document.getElementById("toast-container");
  if (!c) return;
  const el = document.createElement("div");
  el.className = `toast ${type}`;
  el.innerHTML = `<span>${{ success: "✓", error: "✕", info: "·" }[type]}</span><span>${escHtml(msg)}</span>`;
  c.appendChild(el);
  setTimeout(() => { el.style.animation = "toastOut .3s ease forwards"; setTimeout(() => el.remove(), 300); }, 3000);
}

function escHtml(s) {
  return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

// ── Theme ────────────────────────────────
function applyTheme(theme) {
  const r = document.documentElement;
  if (theme === "red") {
    r.style.setProperty("--pink",     "#ef4444");
    r.style.setProperty("--purple",   "#dc2626");
    r.style.setProperty("--border-h", "rgba(239,68,68,0.35)");
    document.body.classList.add("theme-red");
  } else {
    r.style.removeProperty("--pink");
    r.style.removeProperty("--purple");
    r.style.removeProperty("--border-h");
    document.body.classList.remove("theme-red");
  }
  localStorage.setItem("uwu_theme", theme || "default");
}

function loadTheme() {
  const t = localStorage.getItem("uwu_theme");
  if (t && t !== "default") applyTheme(t);
}

// ── Whip system ──────────────────────────
function initWhipListener() {
  const session = JSON.parse(localStorage.getItem("uwu_session") || "{}");
  if (!session.user || !session.channel) return;

  const es = new EventSource(`https://ntfy.sh/${session.channel}/sse`);

  es.addEventListener("message", e => {
    try {
      const data = JSON.parse(e.data);
      if (data.event === "message") showWhipped(data.title || "someone");
    } catch {}
  });
}

function showWhipped(by) {
  // Flash + overlay
  const overlay = document.createElement("div");
  overlay.style.cssText = `position:fixed;inset:0;z-index:99999;background:rgba(220,20,60,0.15);display:flex;flex-direction:column;align-items:center;justify-content:center;backdrop-filter:blur(2px);animation:whipIn .2s ease;`;
  overlay.innerHTML = `
    <style>@keyframes whipIn{from{opacity:0;transform:scale(1.05)}to{opacity:1;transform:scale(1)}}
    @keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}</style>
    <div style="background:#0c0c1e;border:2px solid rgba(255,45,85,0.6);border-radius:20px;padding:40px 48px;text-align:center;max-width:380px;animation:shake .4s ease .1s;box-shadow:0 0 60px rgba(255,45,85,0.3)">
      <div style="font-size:3rem;margin-bottom:12px">😵</div>
      <div style="font-family:'Space Grotesk',sans-serif;font-size:1.6rem;font-weight:700;color:#ff2d55;margin-bottom:6px">YOU GOT WHIPPED</div>
      <div style="color:#6272a4;font-size:.9rem;margin-bottom:24px">by <strong style="color:#f8f8f2">${escHtml(by)}</strong></div>
      <button onclick="this.closest('div[style]').remove()" style="padding:10px 28px;background:#ff2d55;border:none;border-radius:10px;color:#fff;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:.9rem;cursor:pointer;">ow ok</button>
    </div>`;
  document.body.appendChild(overlay);
  playWhipSound();
  setTimeout(() => overlay.remove(), 8000);
}

function playWhipSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    // whip crack: noise burst
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 3);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.6, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    src.connect(gain);
    gain.connect(ctx.destination);
    src.start();
  } catch {}
}

// ── Global Chat ──────────────────────────
const CHAT_CHANNEL             = "uwuprx-chat";
const ANNOUNCE_CHANNEL         = "uwuprx-announce";
const MAX_CHAT_MESSAGE_LENGTH  = 200;
const ANNOUNCEMENT_AUTO_HIDE_MS = 30000;

function initChat() {
  if (window.location.pathname === "/proxy.html" || window.location.pathname === "/chat.html") return;
  const session = JSON.parse(localStorage.getItem("uwu_session") || "{}");
  if (!session.user) return;

  const widget = document.createElement("div");
  widget.id = "uwu-chat";
  widget.className = "chat-widget";
  widget.innerHTML = `
    <button class="chat-fab" id="chat-fab" title="Global Chat">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
      <span class="chat-notif" id="chat-notif">0</span>
    </button>
    <div class="chat-panel" id="chat-panel">
      <div class="chat-panel-hd">
        <div>
          <div class="chat-panel-title">global chat</div>
          <div class="chat-panel-sub">everyone can see this</div>
        </div>
        <button class="chat-panel-x" id="chat-panel-x">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="chat-msgs" id="chat-msgs">
        <div class="chat-msgs-empty">no messages yet — say hi 👋</div>
      </div>
      <form class="chat-form" id="chat-form">
        <input class="chat-inp" id="chat-inp" placeholder="say something..." autocomplete="off" maxlength="${MAX_CHAT_MESSAGE_LENGTH}"/>
        <button class="chat-submit" type="submit">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </form>
    </div>`;
  document.body.appendChild(widget);

  let unread = 0;
  let chatOpen = false;
  const fab   = document.getElementById("chat-fab");
  const panel = document.getElementById("chat-panel");
  const notif = document.getElementById("chat-notif");
  const msgs  = document.getElementById("chat-msgs");
  const form  = document.getElementById("chat-form");
  const inp   = document.getElementById("chat-inp");

  function toggleChat() {
    chatOpen = !chatOpen;
    panel.classList.toggle("open", chatOpen);
    fab.classList.toggle("open", chatOpen);
    if (chatOpen) { unread = 0; notif.style.display = "none"; inp.focus(); }
  }

  fab.addEventListener("click", toggleChat);
  document.getElementById("chat-panel-x").addEventListener("click", toggleChat);

  function addChatMsg(from, text) {
    const isMe = from === session.user;
    const empty = msgs.querySelector(".chat-msgs-empty");
    if (empty) empty.remove();
    const el = document.createElement("div");
    el.className = "chat-msg" + (isMe ? " chat-msg-me" : "");
    el.innerHTML = `<div class="chat-msg-name">${escHtml(from)}</div><div class="chat-msg-bubble">${escHtml(text)}</div>`;
    msgs.appendChild(el);
    msgs.scrollTop = msgs.scrollHeight;
    if (!chatOpen) {
      unread++;
      notif.textContent = unread > 9 ? "9+" : unread;
      notif.style.display = "flex";
    }
  }

  // Subscribe via SSE relay
  const es = new EventSource(`/api/chat/stream`);
  es.addEventListener("message", e => {
    try {
      const data = JSON.parse(e.data);
      if (data.event === "message") addChatMsg(data.title || "?", data.message || "");
    } catch {}
  });

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const text = inp.value.trim();
    if (!text) return;
    inp.value = "";
    try {
      await fetch("/api/chat/send", {
        method: "POST",
        headers: { "x-chat-user": session.user },
        body: text,
      });
    } catch { toast("couldn't send message", "error"); }
  });
}

// ── Announcement listener ────────────────
function initAnnounceListener() {
  const es = new EventSource(`https://ntfy.sh/${ANNOUNCE_CHANNEL}/sse`);
  es.addEventListener("message", e => {
    try {
      const data = JSON.parse(e.data);
      if (data.event === "message") showAnnouncement(data.message || "", data.title || "");
    } catch {}
  });
}

function showAnnouncement(text, from) {
  // Remove any existing banner first
  const old = document.getElementById("uwu-announce-banner");
  if (old) old.remove();

  const banner = document.createElement("div");
  banner.id = "uwu-announce-banner";
  banner.className = "announce-banner";
  banner.innerHTML = `
    <span class="announce-icon">📣</span>
    <span class="announce-text">${escHtml(text)}<span class="announce-by">— ${escHtml(from)}</span></span>
    <button class="announce-close" title="dismiss">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
    </button>`;
  banner.querySelector(".announce-close").addEventListener("click", () => banner.remove());
  document.body.insertBefore(banner, document.body.firstChild);
  // Also show as a toast so it's noticed regardless of scroll position
  toast(`📣 ${from}: ${text}`, "info");
  playAnnounceTone();
  setTimeout(() => banner?.remove(), ANNOUNCEMENT_AUTO_HIDE_MS);
}

function playAnnounceTone() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [523, 659, 784].forEach((freq, i) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.12);
      gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + i * 0.12 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 0.3);
    });
    setTimeout(() => ctx.close(), 600);
  } catch {}
}

// ── Presence heartbeat ───────────────────
function initPresence() {
  const session = JSON.parse(localStorage.getItem("uwu_session") || "{}");
  if (!session.user || !session.channel) return;
  const code = session.channel.replace("uwuprx-", "");

  async function ping() {
    try {
      await fetch("/api/presence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
    } catch {}
  }

  ping();
  setInterval(ping, 60000);
}

// ── Boot ─────────────────────────────────
(async () => {
  loadTheme();
  loadCloak();
  showVersion();
  initStars();
  initKeyboard();
  initSearch();
  initSettings();
  renderRecent();
  renderQuickGames();
  renderQuickApps();
  renderGames();
  renderApps();
  initFilters("game-filters", renderGames);
  initFilters("app-filters",  renderApps);
  await initProxy();
  renderGames(document.querySelector("#game-filters .filter-btn.active")?.dataset.filter || "all");
  initWhipListener();
  initPresence();
  initChat();
  initAnnounceListener();
})();
