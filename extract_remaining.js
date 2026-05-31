// Extract my-story translations and split upcoming styles
const fs = require("fs");
const path = require("path");

function ensureDir(d) { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); }

// ─────────────────────────────────────────────────────────
// 1. my-story/page.tsx: extract translations
// ─────────────────────────────────────────────────────────
{
  const src = fs.readFileSync("app/my-story/page.tsx", "utf8");
  const c = src.replace(/\r\n/g, "\n");
  
  const transStart = c.indexOf("\nconst translations = {");
  const compStart  = c.indexOf("\nexport default function");
  
  const transBlock = c.substring(transStart + 1, compStart).trim(); // remove leading \n
  
  // Write translations file
  fs.writeFileSync("app/my-story/myStoryTranslations.ts", `${transBlock}\n\nexport { translations };\nexport type MyStoryTranslations = typeof translations["en"];\n`);
  
  // Remove translations from page.tsx and add import
  const useClientEnd = c.indexOf("\n", c.indexOf('"use client"')) + 1;
  const importLine = `import { translations } from "./myStoryTranslations";\n`;
  
  const newPage = c.substring(0, useClientEnd) + importLine + c.substring(useClientEnd, transStart) + c.substring(compStart);
  fs.writeFileSync("app/my-story/page.tsx", newPage);
  
  console.log("my-story/page.tsx:", newPage.split("\n").length, "lines");
  console.log("myStoryTranslations.ts:", transBlock.split("\n").length, "lines");
}

// ─────────────────────────────────────────────────────────
// 2. upcoming/components/styles.ts: split into 2 files
// ─────────────────────────────────────────────────────────
{
  const src = fs.readFileSync("app/upcoming/components/styles.ts", "utf8");
  const c = src.replace(/\r\n/g, "\n");
  const lines = c.split("\n");
  console.log("\nupcoming/styles.ts:", lines.length, "lines");
  
  // Find what's in the file
  console.log("First 5 lines:", JSON.stringify(lines.slice(0, 5)));
  console.log("Last 5 lines:", JSON.stringify(lines.slice(-5)));
  
  // Find split around line 380 (look for comment/blank)
  let splitAt = 380;
  for (let i = 370; i < Math.min(420, lines.length); i++) {
    const l = lines[i].trim();
    if (l === "" || l.startsWith("/*") || l.startsWith("//")) { splitAt = i; break; }
  }
  console.log("Split at:", splitAt, JSON.stringify(lines[splitAt]));
  
  const part1 = lines.slice(0, splitAt).join("\n");
  const part2 = lines.slice(splitAt).join("\n");
  console.log("Part1:", part1.split("\n").length, "Part2:", part2.split("\n").length);
  
  // Write split files - but we need to figure out the export structure
  // Check what's exported
  const exportNames = [];
  for (const l of lines) {
    const m = l.match(/^export (const|let|var) (\w+)/);
    if (m) exportNames.push(m[2]);
  }
  console.log("Exports:", exportNames);
}
