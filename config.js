// -----------------------------------------------------------------------------
// Portfolio Config
// -----------------------------------------------------------------------------
// Everything shown on the website is driven by this object.
// Edit this file to add/update your content without touching HTML/JS.
//
// Tips:
// - Keep URLs absolute (https://...) for external links.
// - Keep local file paths relative to website root (example: images/foo.png).
// - Markdown files can be used in `currentlySelling[].md`.
// -----------------------------------------------------------------------------
//
const CONFIG = {
  // ---------------------------------------------------------------------------
  // Identity / Hero
  // ---------------------------------------------------------------------------
  name: "NetherGate",
  brandText: "NetherGate.llc",
  tagline: "NetherGate — Projects & Minecraft Network",
  subtitle:
    "We operate a fully custom Minecraft Network featuring KitPvP; Factions SMP; and Skyblock. We also build custom tools, plugins, and mods to support our network and the broader Minecraft community.",

  // Contact + social
  email: "contact@nethergate.llc",
  github: "https://github.com/NetherGate-LLC",
  discord: "nethergate",

  FOOTER: {
    tagLine: "Not affiliated with Mojang Studios. Minecraft is a trademark of Mojang Studios.",
  },

  // ---------------------------------------------------------------------------
  // Stats (displayed in hero/stats area if enabled by layout)
  // ---------------------------------------------------------------------------
  // Shape: { num: string, label: string }
  // Example:
  // { num: "10+", label: "Production Deployments" }
  stats: [
    { num: "5+", label: "Projects" },
    { num: "3+", label: "Game Mode Types" },
    { num: "24/7", label: "Reliable Support" },
    { num: "sigma", label: "ohio" },
  ],

  // ---------------------------------------------------------------------------
  // Skills chips
  // ---------------------------------------------------------------------------
  skills: [
    "World Design",
    "Server Engineering",
    "Lore & Narrative",
    "Plugin Systems",
    "Community Events",
    "Modpack Curation",
    "Infrastructure",
    "Content Pipeline",
  ],

  // ---------------------------------------------------------------------------
  // Projects
  // ---------------------------------------------------------------------------
  // Required fields:
  // - title, desc
  // Optional fields:
  // - icon (emoji), tags (string[]), status ("active" | "wip" | "archived")
  // - slug (custom URL slug, example: "CrabSMP-Engine")
  // - color (hex), cover (image path), links ([{label,url}]), gallery ([{url,caption}])
  //
  // Example project template:
  // {
  //   icon: "🧩",
  //   title: "Project Name",
  //   desc: "Short description.",
  //   tags: ["TypeScript", "API"],
  //   status: "active",
  //   color: "#42A5F5",
  //   cover: "images/project-cover.png",
  //   links: [{ label: "GitHub", url: "https://github.com/user/repo" }],
  //   gallery: [
  //     { url: "images/project-1.png", caption: "Dashboard" },
  //     { url: "images/project-2.png", caption: "Settings" },
  //   ],
  // }
  projects: [
    {
      icon: "🔥",
      title: "NetherGate Server",
      desc: "A fully custom built Minecraft Bedrock Network, featuring: KitPvP, Factions SMP, and Skyblock game modes with unique features, discord / web integration, and much more.",
      tags: ["PvP", "Network", "Bedrock"],
      status: "wip",
      color: "#E24A2B",
      cover: "images/cover-art/NetherGate.png",
      links: [{ label: "View More", url: "https://nethergate.llc/minecraft" }],
      gallery: [],
    },
    {
      icon: "🧱",
      title: "Python NetherNet",
      desc: "A port of PrismarineJS's Bedrock Protocol to the Python programming language, enabling Python developers to build Bedrock protocol tools straight from Python.",
      tags: ["Tools", "Free Resource", "Backend"],
      status: "active",
      color: "#7B3B2E",
      cover: "images/cover-art/Bedrock-NetherNet.png",
      links: [{ label: "View Repository", url: "https://github.com/NetherGate-LLC/bedrock-nethernet" }],
      gallery: [],
    },
    {
      icon: "🛡️",
      title: "NetherGate Utilities",
      desc: "A Minecraft Bedrock Realm / Server utilities add-on, featuring: in-game commands, player ranks, warps, homes, and custom more.",
      tags: ["Add-on", "Free", "Open-source"],
      status: "wip",
      color: "#C4552D",
      cover: "images/cover-art/NetherGate-Utilities.png",
      links: [{ label: "View Repository", url: "https://github.com/NetherGate-LLC/NetherGate-Utilities" }, { label: "Add-on Page", url: "https://nethergate.gg/nethergate-utilities" }],
      gallery: [],
    },
    {
      icon: "🧩",
      title: "AdemDEV's Portfolio",
      desc: "AdemDEV's personal portfolio website, built with on a static site, featuring a Minecraft OreUI inspired design with fully configurable layouts, modules, and more. Fun Fact: This website is a fork of the original portfolio!",
      tags: ["Open-source", "Free Resource", "Website"],
      status: "active",
      color: "#7B3B2E",
      cover: "images/cover-art/AdemDEV-Portfolio.png",
      links: [{ label: "View Repository", url: "https://github.com/AdemDEV/AdemDEV-Portfolio" }, { label: "View Live Site", url: "https://ademdev.xyz" }],
      gallery: [],
    }
  ],

  // ---------------------------------------------------------------------------
  // Services
  // ---------------------------------------------------------------------------
  // Shape: { icon: string, name: string, desc: string }
  // Example:
  // { icon: "🛠", name: "Plugin Maintenance", desc: "Bug fixes and updates." }
  services: [
    {
      icon: "🧭",
      name: "Commissions Available",
      desc: "Custom projects featuring: MCBE Scripting API, Endstone Python Plugin, and Discord bots for Minecraft communities.",
    },
    {
      icon: "🕹️",
      name: "Gameplay Systems",
      desc: "Progression, quests, economies, and combat tuning designed for long-term community play.",
    },
    {
      icon: "🧰",
      name: "Open-sourced Tools",
      desc: "Built for any developer to use, modify, and contribute to. Check out our GitHub for more details.",
    },
    {
      icon: "🔥",
      name: "Community Programs",
      desc: "Seasonal events, partnerships, and creator support with a fairly active staff team!",
    },
  ],

  // ---------------------------------------------------------------------------
  // Feature flags
  // ---------------------------------------------------------------------------
  // Set to false to temporarily hide the Store section and related links.
  featureFlags: {
    showStoreSection: false,
  },

  // ---------------------------------------------------------------------------
  // Store hidden fallback CTA (hero top button)
  // ---------------------------------------------------------------------------
  // Used only when `featureFlags.showStoreSection` is false.
  // action: "copy" | "url"
  // - "copy": copies `copyText` to clipboard
  // - "url": opens `url`
  // If omitted, defaults to copying `discord`.
  storeHiddenCta: {
    action: "url",
    label: "Join Discord ↩",
    copyText: "NetherGate",
    url: "https://discord.gg/nethergate",
  },

  // ---------------------------------------------------------------------------
  // Currently Selling (store cards + selling modal)
  // ---------------------------------------------------------------------------
  // `md` supports either:
  // - inline markdown string
  // - local markdown path (example: "markdown/astral-engine.md")
  //
  // Store item template:
  // {
  //   id: "unique-id",
  //   slug: "AstralCraft-Engine",
  //   title: "Product Name",
  //   price: "$20 USD",
  //   cover: "images/product-cover.png", (size: 1000x400)
  //   images: [{ url: "images/product-1.png", caption: "Screenshot 1" }],
  //   tags: ["engine", "minecraft"],
  //   md: "markdown/product.md",
  //   links: [{ label: "Buy", url: "https://..." }],
  // }



  currentlySelling: [], // look at original project for template

  // ---------------------------------------------------------------------------
  // Profile menu (markdown modal)
  // ---------------------------------------------------------------------------
  profileMenu: {
    enabled: true,
    navLabel: "About",
    title: "About NetherGate",
    markdownUrl: "markdown/nethergate.md",
    accentColor: "#ff6a3d",
    buttons: [
      { label: "Discord", url: "https://discord.gg/nethergate" },
      { label: "Bedrock Server", url: "https://nethergate.llc/minecraft" },
      { label: "Roadmap", url: "https://nethergate.llc/roadmap" },
    ],
  },
  // ---------------------------------------------------------------------------
  // Minecraft Server Page
  // ---------------------------------------------------------------------------
  serverPage: {
    statusEndpoint: "https://api.mcstatus.io/v2/status/bedrock/play.crabsmp.net",
    brandText: "NetherGate",
    navLinks: [
      { label: "Home", href: "../index.html" },
      { label: "Join", href: "#join", cta: true },
      { label: "Status", href: "#status" },
      { label: "About", href: "#about" },
      { label: "Features", href: "#features" },
      { label: "Reviews", href: "#reviews" },
      { label: "Team", href: "#team" },
      { label: "Rules", href: "#rules" },
    ],
    hero: {
      title: "NetherGate Server",
      subtitle: "A fully custom built Minecraft Network, featuring: KitPvP, Factions SMP, and Skyblock game modes!",
      logo: "A.png",
      background: "images/netherrack.png",
      kpiLabels: {
        status: "Live Status",
        players: "Players Online",
        version: "Version",
      },
    },
    status: {
      label: "STATUS",
      heading: "Live Server Status",
      note: "METRICS",
      cards: [
        {
          title: "Network IP",
          fields: [
            { label: "IP Address", id: "status-ip", value: "Pending" },
            { label: "Host", id: "status-host", value: "Pending" },
          ],
          note: "Updated every 60 seconds.",
          noteId: "status-updated",
        },
        {
          title: "Current Population",
          fields: [
            { label: "Online", id: "status-online", value: "000" },
            { label: "Capacity", id: "status-max", value: "000" },
          ],
          note: "Join at off-peak times for the smoothest experience.",
        },
        {
          title: "Server Details",
          fields: [
            { label: "Gamemode", id: "status-gamemode", value: "Unknown" },
            { label: "Edition", id: "status-edition", value: "Unknown" },
          ],
          note: "MOTD will appear here.",
          noteId: "status-motd",
        },
      ],
    },
    join: {
      label: "JOIN",
      heading: "IP & Port Viewer",
      note: "CONNECTION DETAILS",
      cards: [
        {
          title: "PC & Mobile",
          fields: [
            { label: "Server IP", id: "join-ip", value: "play.nethergate.llc" },
            { label: "Port", id: "join-port", value: "19132" },
          ],
          note: "Add a server in Bedrock and enter the IP + port.",
          button: { label: "Copy IP", href: "#" },
        },
        {
          title: "Friend Connect",
          fields: [
            { label: "Connection User", value: "JoinNetherGate" },
          ],
          note: "Add the Friend, load Minecraft, and join their world to connect to the server.",
          button: { label: "Join Server", href: "#" },
        },
      ],
    },
    about: {
      label: "ABOUT",
      heading: "What is NetherGate?",
      cards: [
        {
          title: "Network Vision",
          text: "NetherGate is a multi-realm Bedrock network focused on PvP, competitive seasons, and a player-first economy.",
        },
        {
          title: "Operating Principles",
          text: "Transparent staff decisions, consistent rule enforcement, and new content drops each season.",
        },
        {
          title: "How We Play",
          text: "Factions, exploration, and events that push NetherGate forward.",
        },
      ],
    },
    features: {
      label: "FEATURES",
      heading: "What We Have",
      cards: [
        { title: "Custom Combat", text: "Ability-driven combat, seasonal artifacts, and tuned PvP balancing." },
        { title: "Integrated Discord", text: "Chat relay, staff alerts, and event announcements synced live." },
        { title: "Automated Events", text: "Boss Fights, PvP Pits, and last to live wins." },
        { title: "Custom Kits", text: "The ability to create and customize your own kits. Pre-built kits available." },
        { title: "Player Market", text: "Auction house, loot-drops, and trading halls." },
        { title: "Performance Focused", text: "Low-lag regions with automated restarts and monitoring." },
      ],
    },
    reviews: {
      label: "REVIEWS",
      heading: "What Players Say",
      items: [
        { name: "Server", stars: 5, text: "No reviews yet." },
      ],
    },
    team: {
      label: "TEAM",
      heading: "The Crew Behind the Gate",
      members: [
        { role: "CEO", name: "Kai", text: "Handles overall strategy and direction." },
        { role: "CEO", name: "Sammy", text: "Oversees operation within the Network." },
        { role: "Chief Development Officer", name: "AdemDEV", text: "Main infrastructure developer." },
        { role: "Chief Development Officer", name: "Ghulq", text: "Second main infrastructure developer." },
        { role: "Chief Human Resources Officer", name: "Typed", text: "Player support, and staff management." },
        { role: "Chief Operations Officer", name: "Sense", text: "Project management and development help." },
      ],
    },
    rules: {
      label: "RULES",
      heading: "Server Rules & Terms",
      items: [
        { title: "01 - Be Respectful", text: "No harassment, hate speech, or toxic behavior." },
        { title: "02 - No Cheating", text: "No hacks, dupes, or exploits that harm the economy." },
        { title: "03 - Fair Play", text: "Honor event rules and staff decisions." },
        { title: "04 - Keep Builds Safe", text: "No griefing outside of faction war zones." },
      ],
    },
    footer: {
      copy: "© 2026 NetherGate — Server Network Overview",
      links: [
        { label: "Home", href: "../index.html" },
        { label: "Join", href: "#join" },
        { label: "Features", href: "#features" },
        { label: "Rules", href: "#rules" },
      ],
    },
  },
  // ---------------------------------------------------------------------------
  // Labels
  // ---------------------------------------------------------------------------
  labels: {
    sellingCardLabel: "NETWORK NODE",
    projectCardLabel: "PROJECT",
  },
};
