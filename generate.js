const fs = require("fs");
const path = require("path");

const redirects = require("./redirects.json");

// Files and directories that should never be deleted (not shortlinks)
const PROTECTED_ITEMS = new Set([
  '.git',
  '.github',
  'node_modules',
  'CNAME',
  'LICENSE',
  'README.md',
  'generate.js',
  'generate-index.js',
  'redirects.json',
  'validate.js',
  'server.js',
  'package.json',
  '404.html',
  'index.html',
  'about',
  'terms',
  'privacy',
  'files',
  'resume.pdf'
]);

/**
 * Validates a URL string
 * @param {string} url - The URL to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Escapes HTML special characters to prevent XSS
 * @param {string} str - The string to escape
 * @returns {string} - The escaped string
 */
function escapeHtml(str) {
  const htmlEntities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return str.replace(/[&<>"']/g, char => htmlEntities[char]);
}

/**
 * Checks if a directory is a shortlink redirect directory
 * @param {string} dirPath - The directory path to check
 * @returns {boolean} - True if it's a shortlink directory
 */
function isShortlinkDirectory(dirPath) {
  const indexPath = path.join(dirPath, "index.html");
  if (!fs.existsSync(indexPath)) {
    return false;
  }
  
  try {
    const content = fs.readFileSync(indexPath, "utf8");
    // Check if it contains our redirect markers
    return content.includes('meta http-equiv="refresh"') && 
           content.includes('lkang.au Shortlink');
  } catch {
    return false;
  }
}

/**
 * Removes a directory and its contents recursively
 * @param {string} dirPath - The directory path to remove
 * @throws {Error} If deletion fails
 */
function removeDirectory(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
}

/**
 * Generates an HTML redirect page for a given URL
 * @param {string} url - The destination URL
 * @param {string} slug - The shortlink slug (for display purposes)
 * @returns {string} - The HTML content
 */
function generateRedirectHtml(url, slug) {
  const escapedUrl = escapeHtml(url);
  const jsEscapedUrl = JSON.stringify(url);
  const displayName = escapeHtml(slug === "" ? "lkang.au" : (slug || "lkang.au"));
  
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="refresh" content="0; url=${escapedUrl}">
    <link rel="canonical" href="${escapedUrl}">
    <title>Redirecting to ${escapedUrl}</title>
    
    <!-- Open Graph / Social Media -->
    <meta property="og:title" content="${displayName} - lkang.au Shortlink">
    <meta property="og:description" content="Redirecting to ${escapedUrl}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${escapedUrl}">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="${displayName} - lkang.au Shortlink">
    <meta name="twitter:description" content="Redirecting to ${escapedUrl}">
    
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
        background: #f5f5f5;
        color: #333;
      }
      .container {
        text-align: center;
        padding: 2rem;
      }
      a {
        color: #3498db;
        text-decoration: none;
      }
      a:hover {
        text-decoration: underline;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <p>Redirecting to <a href="${escapedUrl}">${escapedUrl}</a>...</p>
      <noscript>
        <p>If you are not redirected automatically, <a href="${escapedUrl}">click here</a>.</p>
      </noscript>
    </div>
    <script>
      window.location.replace(${jsEscapedUrl});
    </script>
  </body>
</html>`;
}

// Track statistics
let generated = 0;
let skipped = 0;
const errors = [];

console.log("🔗 lkang.au Shortlink Generator\n");
console.log("Processing redirects.json...\n");

for (const slug in redirects) {
  const entry = redirects[slug];
  let url;
  let metadata = {};

  // Support both string URLs and object format with metadata
  if (typeof entry === "string") {
    url = entry;
  } else if (typeof entry === "object" && entry !== null) {
    url = entry.url;
    metadata = entry;
  } else {
    errors.push({ slug, url: "", reason: "Invalid entry format" });
    skipped++;
    continue;
  }
  
  // Validate URL
  if (!isValidUrl(url)) {
    errors.push({ slug, url, reason: "Invalid URL format" });
    skipped++;
    continue;
  }
  
  const dir = path.join(__dirname, slug);
  const html = generateRedirectHtml(url, slug);

  try {
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "index.html"), html);
    
    // Display with metadata if available
    const displayInfo = metadata.owner ? ` (${metadata.owner})` : "";
    console.log(`  ✓ ${slug || "(root)"} → ${url}${displayInfo}`);
    generated++;
  } catch (err) {
    errors.push({ slug, url, reason: err.message });
    skipped++;
  }
}

// Clean up old shortlinks that are no longer in redirects.json
console.log("\n🧹 Cleaning up old shortlinks...\n");
let deleted = 0;

// Get list of valid slugs from redirects.json
const validSlugs = new Set(Object.keys(redirects));

// Scan directory for potential old shortlink directories
const items = fs.readdirSync(__dirname);
for (const item of items) {
  // Skip protected items and files
  if (PROTECTED_ITEMS.has(item)) {
    continue;
  }
  
  const itemPath = path.join(__dirname, item);
  
  // Skip if not a directory (with error handling for inaccessible files)
  try {
    if (!fs.statSync(itemPath).isDirectory()) {
      continue;
    }
  } catch (err) {
    // Skip items we can't access
    continue;
  }
  
  // Skip if it's a current valid slug
  if (validSlugs.has(item)) {
    continue;
  }
  
  // Check if it's an old shortlink directory (has our redirect marker)
  if (isShortlinkDirectory(itemPath)) {
    try {
      removeDirectory(itemPath);
      console.log(`  🗑️  Deleted: ${item}/`);
      deleted++;
    } catch (err) {
      errors.push({ slug: item, url: "", reason: `Failed to delete: ${err.message}` });
    }
  }
}

if (deleted === 0) {
  console.log("  No old shortlinks to clean up.");
}

console.log("\n" + "─".repeat(50));
console.log(`\n📊 Summary:`);
console.log(`   Generated: ${generated} redirect(s)`);
console.log(`   Deleted: ${deleted} old shortlink(s)`);
if (skipped > 0) {
  console.log(`   Skipped: ${skipped} redirect(s)`);
}
if (errors.length > 0) {
  console.log(`\n⚠️  Errors:`);
  errors.forEach(({ slug, url, reason }) => {
    console.log(`   - ${slug || "(root)"}: ${reason}`);
  });
}
console.log("");