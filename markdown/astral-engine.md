## Astral-Engine

Selling a fully fledged out MCBE add-on made for a Realm or Server. This includes very popular and complex modules such as **Factions**, **Auction House**, **Server Shop** with sub-categories, and many **custom UI's**. As well as many niche features such as a **dual font system**, fully customisable **user settings**, **bounties**, and much much more. 

This add-on has also been **fully tested** and I guarantee no bugs. However if you experience any issues then let me know.

---

**Engine Stack**
- Main TypeScript Add-on with over 6 months of development work.
- *Optional* Endstone python plugin with Discord API support. (built into the add-on)
- Refined and easily customisable resource pack (containing many custom built UI's)
- Custom Glyphs made by Me! (with some assets taken from free open sourced glyph packs)
- ALL of AstralCraft Assets

**Recommended Knowledge**
- You should be able to build this typescript addon into a mcaddon within Visual Studio Code. (or any CLI based terminal)
- You should have a decent code editor to change the globalConfig.ts file, or any other files. (notepad is fine, just recommend vs-code)
- If you are wanting to use the fully custom Discord Integration, you will need an Endstone BDS server.

**Features**
> **Main menu hub**: with Warps, Factions, TPA, Donator, Shop, Auction, Mailbox, and Staff/Admin access
> **Full faction system**: create/join, bank, logs, claims, faction home, invites, and management tools
> **Teleport System**: warps, homes, wild teleport, spawn/hub, and TPA
> **Shop System**: with categories, buy/sell flow, sell multipliers, and special shop support
> **Auction House**: with listings, bids, history, notifications, and staff moderation tools
> **Mailbox**: delivery for items/coins when inventories are full, offline sending
> **Donator Plans**: with perks (extra homes/auction slots, sell multipliers) and in-game management UI
> **Crates & Money Drops**: tokens and crate keys + crate system with animated rewards
> Cosmetics system with particle effects (uses A&S legacy particles)
> **Staff GUI**: moderation tools, money manager, faction/claims/auction management, inventory viewer, ranks, leaderboard setup
> **Custom UI**: screens and panels for menus + shop interfaces
> **Custom Font**: pack and glyph sheets included
> **Custom Commands**: framework and event hooks for chat, blocks, entities, spawn, etc.
> **Discord Integration**: relay channels for logs and automation events

**Configuration**

You are able to change many elements within the `globalConfig.ts` file. Once done you then build the add-on into a `.mcaddon` file and import it to Minecraft Bedrock. You may refer to the `README.md` file which includes direct instructions on building the add-on.

```ts
export const SERVER_INFO = {
    serverName: "AstralCraft", // plain server name without formatting
    serverNameX: `§dAstral§fCraft`, // formatted server name with color codes for display in-game
    shortServerName: "Astral", // a shorter version of the server name for compact displays (formatting is optional)
    version: "1.0.0", // server version for display in help menus and about sections
    discordInvite: "astralcraft", // discord invite link (only the code part, not the full URL)
    serverIP: "play.astralcraft.xyz", // server IP for display in help menus and about sections
    website: "astralcraft.xyz", // website URL for display in help menus and about sections
    storePage: "store.astralcraft.xyz", // store URL for display in help menus and about sections
    friendConnectBot: "JoinAstral", // friend connect bot username for display in help menus and about sections

    engineName: "Astral-Engine", // internal engine name without formatting
    engineNameX: `§dAstral§8-§fEngine`, // formatted engine name with color codes for display in-game
    engineNameUpperX: `§dASTRAL§8-§fENGINE`, // formatted engine name in uppercase with color codes for display in-game
    engineNameUpper: "ASTRAL-ENGINE", // internal engine name in uppercase without formatting

    serverOwner: ["AdemDEV"], // server owner names for display in help menus and about sections
    developers: ["AdemDEV"], // developer names for display in help menus and about sections

    // these variables aren't used yet. 
    primaryColor: "§d", // primary color code for the server (used in menus and highlights)
    secondaryColor: "§f", // secondary color code for the server (used in menus and highlights)
};
```

Above is the main configuation for the add-on. These variables are referenced throughout the scripts, this reduces the hassle of going through each individual file and changing elements to suit your needs. (You are allowed to change the `developers` variable to remove my name, however it would be appreciated if I were kept on there ❤️)

There are also many other configurations inside `globalConfig.ts` such as world border config, faction config, discord kit items, full entire shop config, and more.

**Assets from other sources**
- Main Menu UI taken from [Ozorical's Crab Engine](https://github.com/ozorical/crab-engine)
- [MinecraftFive](https://fontstruct.com/fontstructions/show/2507692/minecraft-five-8) font has been used.
- File `glyph_E1.png` has been taken from [here](https://github.com/ozorical/CRAB-ENGINE/blob/main/resource_packs/crabSMP/font/glyph_E1.png). (with light modifications)
- File `glyph_E4.png` has been made from an unknown original source, however it it has been imported from a project by [Bateman Dev](https://batemandev.com/).
- File `glyph_E9.png` has been taken from [here](https://github.com/ozorical/CRAB-ENGINE/blob/main/resource_packs/crabSMP/font/glyph_E9.png).

**Additional Service**

Upon buying Astral-Engine, I am able to re-texture some UI elements to suit your needs, I am able to change hard-coded text on UI, I am able to update the `globalConfig.ts` to suit your needs if you wish (except the shop config as that is a hassle), I am able to provide bug fixes to the add-on (free of charge), I am able to disable certain features you may wish not to have included.

**Additional Notes**

The Shop configuation seems like a complete hassle to get the texture paths right, as well as deciding on the prices. However I have already added a previously used preset to the configuration which is most optimised for members actually playing the server and getting materials, instead of abusing said shop. This configuration was made with me, and a few other members of the Minecraft community. It has been well thought out and we recommend you use our configuration if you prefer your members have a useful, yet not fully reliant shop experience. And again, like I said above I will not be providing any further configurations to the shop as it is a major hassle. However in the `README.md` file, you will find useful VSCODE extensions such as the Minecraft Texture Path finder for the icons on the shop.

This whole add-on has taken months of development time, I was originally going to release a server and I did, however it was eventually discontinued. All the scripts have been fully tested by me and my previous team at Astral Studios. I have also taken the time to update the scripts, however not much was needing updated as it was made pretty recent.

**Common Questions**

- **Why the high price tag?** This was because certain modules within this add-on are at a very high cost within the MCBE community. I tried my best on evaulation the price and keeping it low; however I was recommended several times that the price should be raised. This is most definitely a fair price for what I am offering.
- **Did you solo develop this?** Yes mainly. There were *some* files taken from other private sources, however they were insanely modified and mostly rewritten by me. 
- **Can I use this on Realms?** Yes this is completely supported for Realms, BDS, and Worlds. 
- **Why does this look similar to Crab-Engine?** This is because Crab-Engine was a fork of this project! A *lighter* copy was given to it's owner. However it has been heavily modified for CrabSMP. 

**Payment - $300 USD**
- PayPal
- UK Banking (with Account Number, and Sort Code)

Upon purchasing, you will receive a LICENSE to use the project. The project will be delivered via a .zip file on Discord. (or email)

```
ASTRAL ENGINE LICENSE
Copyright (c) 2026 AdemDEV

Permission is hereby granted to any person obtaining a copy of this software
and associated files (the "Software") to use the Software for personal or
internal purposes only, subject to the following conditions:

1. PROHIBITED ACTIONS
   - You may NOT sell, sublicense, or commercially distribute the Software.
   - You may NOT redistribute the Software or any modified version of it to
     third parties without explicit written permission from the copyright holder.
   - You may NOT claim ownership or authorship of the Software.

2. PERMITTED ACTIONS
   - You MAY use the Software for personal, educational, or internal purposes.
   - You MAY modify the Software for your own private use.

3. OWNERSHIP
   All rights, title, and interest in and out of the Software remain exclusively
   with the copyright holder. This license does not transfer any ownership rights.

4. NO WARRANTY
   The Software is provided "as is", without warranty of any kind. The copyright
   holder is not liable for any damages arising from its use.
```
