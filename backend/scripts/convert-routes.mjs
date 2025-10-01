import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROUTES_DIR = path.resolve(__dirname, "..", "routes");

// Files Render tried to mount (from your logs) — add more if needed
const CANDIDATES = [
  "admin.routes.js",
  "adminRoutes.js",
  "adminAuth.routes.js",
  "admin-auth.routes.js",
  "adminProtected.js",
  "admin.protected.js",
  "booking.routes.js",
  "bookingRoutes.js",
  "car.routes.js",
  "carRoutes.js",
  "comments.js",
  "comment.routes.js",
  "cruise.route.js",
  "cruise.routes.js",
  "flight.routes.js",
  "flights.routes.js",
  "hotel.routes.js",
  "hotels.routes.js",
  "notification.routes.js",
  "notifications.routes.js",
  "package.routes.js",
  "pkg.routes.js",
  "place.routes.js",
  "placeRoutes.js",
  "dm.js",
];

// Utilities
function exists(p) {
  try {
    fs.accessSync(p);
    return true;
  } catch {
    return false;
  }
}
function backup(file) {
  const bak = file + ".bak";
  fs.copyFileSync(file, bak);
}
function write(file, content) {
  fs.writeFileSync(file, content, "utf8");
}

function convertCommonJsToEsmRoutes(source) {
  let s = source;

  // Normalize line endings to simplify regex
  s = s.replace(/\r\n/g, "\n");

  // 1) Replace `const express = require('express')` or `var/let express = require('express')`
  s = s.replace(
    /(?:const|var|let)\s+express\s*=\s*require\(['"]express['"]\);?/g,
    `import { Router } from 'express';\nconst router = Router();`
  );

  // 2) Replace `const router = express.Router()` if not already created above
  if (!/const\s+router\s*=\s*Router\(\)/.test(s)) {
    s = s.replace(
      /(?:const|var|let)\s+router\s*=\s*express\.Router\(\);?/g,
      `const router = Router();`
    );
  }

  // 3) Replace `module.exports = router` → `export default router`
  s = s.replace(/module\.exports\s*=\s*router\s*;?/g, `export default router`);

  // 4) Replace `exports = module.exports = router` (edge case)
  s = s.replace(
    /exports\s*=\s*module\.exports\s*=\s*router\s*;?/g,
    `export default router`
  );

  // 5) Replace simple local requires → import default (best-effort)
  //    const X = require('./something')
  s = s.replace(
    /(?:const|var|let)\s+([A-Za-z0-9_$]+)\s*=\s*require\(\s*['"](\.\.?(?:\/[^'"]*)?)['"]\s*\);?/g,
    `import $1 from '$2';`
  );

  // 6) Replace destructured local requires → import named (best-effort)
  //    const { A, B } = require('./something')
  s = s.replace(
    /(?:const|var|let)\s*\{\s*([^}]+)\s*\}\s*=\s*require\(\s*['"](\.\.?(?:\/[^'"]*)?)['"]\s*\);?/g,
    (m, names, mod) => `import { ${names.trim()} } from '${mod}';`
  );

  // 7) If file still has `require(` for node/built-ins or externals, leave them (could be non-route logic).
  //    Optional: convert `const x = require('y')` externals to ESM as well:
  s = s.replace(
    /(?:const|var|let)\s+([A-Za-z0-9_$]+)\s*=\s*require\(\s*['"]([^.'"][^'"]*)['"]\s*\);?/g,
    `import $1 from '$2';`
  );
  s = s.replace(
    /(?:const|var|let)\s*\{\s*([^}]+)\s*\}\s*=\s*require\(\s*['"]([^.'"][^'"]*)['"]\s*\);?/g,
    (m, names, mod) => `import { ${names.trim()} } from '${mod}';`
  );

  // 8) Ensure we imported Router at least once if we created `router = Router()`
  if (
    /const\s+router\s*=\s*Router\(\)/.test(s) &&
    !/from\s+['"]express['"]/.test(s)
  ) {
    s = `import { Router } from 'express';\n` + s;
  }

  // 9) If no `export default router` at the end and `router` exists, append it (safety)
  if (/const\s+router\s*=/.test(s) && !/export\s+default\s+router/.test(s)) {
    s = s.trimEnd() + `\n\nexport default router\n`;
  }

  return s;
}

function ensureDmRouter(source) {
  // Make sure dm.js declares a router if missing
  let s = source.replace(/\r\n/g, "\n");
  const hasRouterDecl =
    /const\s+router\s*=\s*Router\(\)/.test(s) || /express\.Router\(\)/.test(s);
  if (!hasRouterDecl) {
    // After first import of express, inject router creation, or at top if not found
    if (/from\s+['"]express['"]/.test(s)) {
      s = s.replace(
        /from\s+['"]express['"]\s*;?\n?/,
        (m) => m + `const router = Router();\n`
      );
    } else {
      s = `import { Router } from 'express';\nconst router = Router();\n` + s;
    }
  }
  if (!/export\s+default\s+router/.test(s)) {
    s = s.trimEnd() + `\n\nexport default router\n`;
  }
  return s;
}

function run() {
  if (!exists(ROUTES_DIR)) {
    console.error("[convert] Could not find routes dir:", ROUTES_DIR);
    process.exit(1);
  }

  let fixedCount = 0;

  for (const name of CANDIDATES) {
    const file = path.join(ROUTES_DIR, name);
    if (!exists(file)) continue;

    const src = fs.readFileSync(file, "utf8");
    backup(file);

    let out = convertCommonJsToEsmRoutes(src);

    // Special case for dm.js
    if (name === "dm.js") {
      out = ensureDmRouter(out);
    }

    write(file, out);
    fixedCount++;
    console.log(`[convert] Converted ${name} → ESM (backup: ${name}.bak)`);
  }

  if (fixedCount === 0) {
    console.log(
      "[convert] No candidate route files found. If your filenames differ, add them to CANDIDATES."
    );
  } else {
    console.log(`[convert] Done. Converted ${fixedCount} file(s).`);
  }
}

run();
