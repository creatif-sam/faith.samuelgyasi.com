const fs = require("fs");
const src = fs.readFileSync("app/dashboard/page.tsx", "utf8");

// Normalize CRLF to LF for analysis
const c = src.replace(/\r\n/g, "\n");

const cssStartMarker = "const dashCss = `";
const cssStart = c.indexOf(cssStartMarker) + cssStartMarker.length;
// Find closing backtick - look for backtick on its own line followed by semicolon
const cssEnd = c.indexOf("`;\n\nexport default function DashboardPage");
console.log("cssStart char:", cssStart);
console.log("cssEnd char:", cssEnd);

if (cssEnd === -1) {
  // Try alternative
  const alt = c.indexOf("`);\n\nexport default") || c.indexOf("`;\nexport default");
  console.log("alt:", alt);
  
  // Just search for the function declaration position
  const fnPos = c.indexOf("\nexport default function DashboardPage");
  console.log("fnPos:", fnPos);
  
  // Go back from fnPos to find the closing backtick
  let closePos = fnPos - 1;
  while (closePos > cssStart && c[closePos] !== '`') closePos--;
  console.log("closePos:", closePos, "char:", JSON.stringify(c.substring(closePos, closePos+5)));
  
  const cssContent = c.substring(cssStart, closePos);
  const cssLines = cssContent.split("\n");
  console.log("CSS lines:", cssLines.length);
  console.log("First 5 CSS lines:", cssLines.slice(0, 5));
  console.log("Last 5 CSS lines:", cssLines.slice(-5));
} else {
  const cssContent = c.substring(cssStart, cssEnd);
  const cssLines = cssContent.split("\n");
  console.log("CSS lines:", cssLines.length);
  console.log("First 5:", cssLines.slice(0, 5));
  console.log("Last 5:", cssLines.slice(-5));
}

// Total lines
console.log("Total file lines:", c.split("\n").length);
// Function start line number
const fnLine = c.substring(0, c.indexOf("\nexport default function DashboardPage")).split("\n").length;
console.log("Function start line:", fnLine);
