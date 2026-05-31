// Split upcoming/components/styles.ts into two files
const fs = require("fs");

const src = fs.readFileSync("app/upcoming/components/styles.ts", "utf8");
const c = src.replace(/\r\n/g, "\n");
const lines = c.split("\n");

// First line is: export const upcomingStyles = `
// Last lines are: `; (two lines)
// Find opening and closing backtick
const openIdx = c.indexOf("export const upcomingStyles = `") + "export const upcomingStyles = `".length;
let closeIdx = c.lastIndexOf("`");

const cssContent = c.substring(openIdx, closeIdx);
const cssLines = cssContent.split("\n");
console.log("Total CSS lines:", cssLines.length);

// Find split around line 380
let splitAt = 380;
for (let i = 370; i < Math.min(420, cssLines.length); i++) {
  const l = cssLines[i].trim();
  if (l === "" || l.startsWith("/*") || l.startsWith("//")) { splitAt = i; break; }
}
console.log("Split at:", splitAt, "context:", JSON.stringify(cssLines.slice(splitAt-1, splitAt+2)));

const css1 = cssLines.slice(0, splitAt).join("\n");
const css2 = cssLines.slice(splitAt).join("\n");
console.log("Part1:", css1.split("\n").length, "Part2:", css2.split("\n").length);

fs.writeFileSync("app/upcoming/components/upcomingLayoutStyles.ts", 
  `export const upcomingLayoutStyles = \`\n${css1}\n\`;\n`);
fs.writeFileSync("app/upcoming/components/upcomingComponentStyles.ts",
  `export const upcomingComponentStyles = \`\n${css2}\n\`;\n`);

// Update the original styles.ts to re-export combined
fs.writeFileSync("app/upcoming/components/styles.ts",
  `import { upcomingLayoutStyles } from "./upcomingLayoutStyles";\nimport { upcomingComponentStyles } from "./upcomingComponentStyles";\n\nexport const upcomingStyles = upcomingLayoutStyles + upcomingComponentStyles;\n`);

console.log("✓ Done. styles.ts now:", fs.readFileSync("app/upcoming/components/styles.ts", "utf8").split("\n").length, "lines");
