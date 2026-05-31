const fs = require("fs");

const src = fs.readFileSync("app/dashboard/page.tsx", "utf8");

// ── 1. Extract translations ─────────────────────────────────────
const transStart = src.indexOf("const translations = {");
const transEnd   = src.indexOf("\ntype DashTab");
const transBlock = src.substring(transStart, transEnd).trim();

// ── 2. Extract types/interfaces ─────────────────────────────────
const typesStart = src.indexOf("type DashTab");
const typesEnd   = src.indexOf("\nconst dashCss");
const typesBlock = src.substring(typesStart, typesEnd).trim();

// ── 3. Extract dashCss ──────────────────────────────────────────
const cssStart   = src.indexOf("const dashCss = `") + "const dashCss = `".length;
const cssEnd     = src.indexOf("`;\n\nexport default function DashboardPage");
const cssContent = src.substring(cssStart, cssEnd); // raw CSS, no backticks

// Count lines to find good split point
const cssLines  = cssContent.split("\n");
console.log("CSS lines:", cssLines.length);

// Find a split around line 350 - look for a good boundary
// Scan for a blank line / comment around line 350
let splitAt = 350;
for (let i = 340; i < 400 && i < cssLines.length; i++) {
  if (cssLines[i].trim() === "" || cssLines[i].trim().startsWith("/*")) {
    splitAt = i;
    break;
  }
}
console.log("CSS split at line:", splitAt);

const cssLayout    = cssLines.slice(0, splitAt).join("\n");
const cssComponents = cssLines.slice(splitAt).join("\n");
console.log("Layout CSS lines:", cssLayout.split("\n").length);
console.log("Components CSS lines:", cssComponents.split("\n").length);

// Show split context
console.log("--- CSS split context ---");
console.log("Last 3 of layout:", JSON.stringify(cssLines.slice(splitAt-3, splitAt)));
console.log("First 3 of components:", JSON.stringify(cssLines.slice(splitAt, splitAt+3)));

// ── 4. Extract JSX for each tab ─────────────────────────────────
// My Trainings
const myTrainingsStart = src.indexOf("activeTab === \"my-trainings\"");
const browseStart      = src.indexOf("activeTab === \"browse\"");
const habitsStart      = src.indexOf("activeTab === \"habits\"");
const profileStart     = src.indexOf("activeTab === \"profile\"");

console.log("\nJSX section starts:");
console.log("my-trainings:", myTrainingsStart);
console.log("browse:", browseStart);
console.log("habits:", habitsStart);
console.log("profile:", profileStart);

// Show function start
const fnStart = src.indexOf("export default function DashboardPage");
const stateEnd = src.indexOf("  return (", fnStart);
console.log("\nFunction start:", fnStart, "Return start:", stateEnd);
console.log("Function head lines:", src.substring(fnStart, stateEnd).split("\n").length);
