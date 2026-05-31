const fs = require("fs");
const path = require("path");

// Ensure dirs exist
function ensureDir(d) { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); }

const src = fs.readFileSync("app/dashboard/page.tsx", "utf8");
const c = src.replace(/\r\n/g, "\n"); // normalize for searching

// ────────────────────────────────────────────────────────────
// 1. EXTRACT TRANSLATIONS
// ────────────────────────────────────────────────────────────
const transStart = c.indexOf("const translations = {");
const transEnd   = c.indexOf("\ntype DashTab");
const transBlock = c.substring(transStart, transEnd).trim();

fs.writeFileSync("app/dashboard/translations.ts", `// Auto-extracted translations\n${transBlock}\n\nexport { translations };\nexport type Translations = typeof translations["en"];\nexport type Lang = keyof typeof translations;\n`);
console.log("✓ translations.ts:", transBlock.split("\n").length, "lines");

// ────────────────────────────────────────────────────────────
// 2. EXTRACT TYPES
// ────────────────────────────────────────────────────────────
const typesStart = c.indexOf("type DashTab");
const typesEnd   = c.indexOf("\nconst dashCss");
const typesBlock = c.substring(typesStart, typesEnd).trim();

fs.writeFileSync("app/dashboard/types.ts", `// Dashboard types\n${typesBlock}\n`);
console.log("✓ types.ts:", typesBlock.split("\n").length, "lines");

// ────────────────────────────────────────────────────────────
// 3. EXTRACT CSS AND SPLIT
// ────────────────────────────────────────────────────────────
const cssStartMarker = "const dashCss = `";
const cssStart = c.indexOf(cssStartMarker) + cssStartMarker.length;
const cssEnd   = c.indexOf("`;\n\nexport default function DashboardPage");
const cssContent = c.substring(cssStart, cssEnd);
const cssLines = cssContent.split("\n");
console.log("CSS lines:", cssLines.length);

// Find a good split point around line 370 (look for comment or blank line)
let splitAt = 370;
for (let i = 360; i < 420 && i < cssLines.length; i++) {
  const l = cssLines[i].trim();
  if (l === "" || l.startsWith("/*") || l.startsWith("/* --")) { splitAt = i; break; }
}
console.log("CSS split at line:", splitAt, "| content:", JSON.stringify(cssLines[splitAt]));

const cssLayout = cssLines.slice(0, splitAt).join("\n");
const cssTabs   = cssLines.slice(splitAt).join("\n");
console.log("layoutStyles lines:", cssLayout.split("\n").length);
console.log("tabStyles lines:", cssTabs.split("\n").length);

ensureDir("app/dashboard/styles");
fs.writeFileSync("app/dashboard/styles/layoutStyles.ts", `export const layoutStyles = \`\n${cssLayout}\n\`;\n`);
fs.writeFileSync("app/dashboard/styles/tabStyles.ts",    `export const tabStyles = \`\n${cssTabs}\n\`;\n`);
console.log("✓ styles split");

// ────────────────────────────────────────────────────────────
// 4. EXTRACT JSX SECTIONS (for reference)
// ────────────────────────────────────────────────────────────
// We'll create the component files manually below with the right props
// But first, let's extract the function body sections

const fnStart   = c.indexOf("\nexport default function DashboardPage") + 1;
const returnIdx = c.indexOf("  return (", fnStart);
const functionBody = c.substring(fnStart, returnIdx);

// The full JSX return
const jsxStart = returnIdx;
const jsxEnd   = c.lastIndexOf("}\n"); // end of the function

// Extract individual tab JSX
function extractTabJsx(tabName, nextTabName) {
  const start = c.indexOf(`{activeTab === "${tabName}" &&`);
  const end   = nextTabName
    ? c.indexOf(`{activeTab === "${nextTabName}" &&`)
    : c.indexOf("\n            </>\n          )}\n        </main>") + 1;
  return c.substring(start, end).trim();
}

const myTrainingsJsx = extractTabJsx("my-trainings", "browse");
const browseJsx      = extractTabJsx("browse", "habits");
const habitsJsx      = extractTabJsx("habits", "profile");
const profileJsx     = extractTabJsx("profile", null);

fs.writeFileSync("app/dashboard/_extracted_jsx.txt", 
  `=== MY-TRAININGS ===\n${myTrainingsJsx}\n\n=== BROWSE ===\n${browseJsx}\n\n=== HABITS ===\n${habitsJsx}\n\n=== PROFILE ===\n${profileJsx}\n`
);

console.log("Tab JSX lines: my-trainings=%d browse=%d habits=%d profile=%d",
  myTrainingsJsx.split("\n").length,
  browseJsx.split("\n").length,
  habitsJsx.split("\n").length,
  profileJsx.split("\n").length
);

// Output function body for manual component extraction  
fs.writeFileSync("app/dashboard/_function_body.txt", functionBody);
console.log("Function body lines:", functionBody.split("\n").length);
console.log("Done — check _extracted_jsx.txt and _function_body.txt");
