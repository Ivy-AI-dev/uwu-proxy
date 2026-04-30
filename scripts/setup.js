import { createRequire } from "module";
import { copyFile, mkdir, access } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const outputDir = join(__dirname, "..", "public", "uv");

try {
  await mkdir(outputDir, { recursive: true });

  const uvPkgJson = require.resolve("@titaniumnetwork-dev/ultraviolet/package.json");
  const distDir   = join(dirname(uvPkgJson), "dist");

  // sw.js is the real service worker entry (uses relative importScripts)
  // uv.sw.js provides UVServiceWorker class (loaded by sw.js via config.sw)
  // sw.js is NOT copied — we use our own custom entry at public/uv/sw.js
  const filemap = {
    "uv.bundle.js":  "uv.bundle.js",
    "uv.handler.js": "uv.handler.js",
    "uv.sw.js":      "uv.sw.js",
    "uv.client.js":  "uv.client.js",
  };

  for (const [src_name, dest_name] of Object.entries(filemap)) {
    const src  = join(distDir, src_name);
    const dest = join(outputDir, dest_name);
    try {
      await access(src);
      await copyFile(src, dest);
      console.log(`  ✓ copied ${src_name}`);
    } catch {
      console.warn(`  ⚠ ${src_name} not found — skipping`);
    }
  }

  console.log("UV setup complete.\n");
} catch (err) {
  console.error("Setup failed:", err.message);
  console.error("Run `npm install` first.\n");
}
