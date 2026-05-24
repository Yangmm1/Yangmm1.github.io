import fs from "fs";
import path from "path";

const outDir = path.join(process.cwd(), "out");
const marker = path.join(outDir, ".nojekyll");

if (!fs.existsSync(outDir)) {
  console.error("Missing out/ directory. Run npm run build first.");
  process.exit(1);
}

fs.writeFileSync(marker, "");
console.log("Created out/.nojekyll for GitHub Pages");
