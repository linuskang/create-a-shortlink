const fs = require("fs");
const path = require("path");

// Reserved slugs that cannot be used as shortlinks
const RESERVED_SLUGS = new Set([
  "admin", "api", "assets", "config", "files", "images", "public",
  "static", "uploads", "test", "staging", "prod", "production",
  "dev", "development", "www", "mail", "ftp", "ssh", "cdn",
  "help", "support", "docs", "documentation", "about", "contact",
  "legal", "privacy", "terms", "tos", "dmca", "abuse"
]);

// Configuration
const MAX_SLUG_LENGTH = 50;
const MIN_SLUG_LENGTH = 2;
const MAX_URL_LENGTH = 2000;

/**
 * Validates a URL string
 * @param {string} url - The URL to validate
 * @returns {{valid: boolean, error?: string}} - Validation result
 */
function validateUrl(url) {
  if (typeof url !== "string") {
    return { valid: false, error: "URL must be a string" };
  }

  if (url.length === 0) {
    return { valid: false, error: "URL cannot be empty" };
  }

  if (url.length > MAX_URL_LENGTH) {
    return { valid: false, error: `URL exceeds maximum length of ${MAX_URL_LENGTH} characters` };
  }

  try {
    const urlObj = new URL(url);
    
    // Check protocol
    if (!["http:", "https:", "mailto:"].includes(urlObj.protocol)) {
      return { valid: false, error: `Invalid protocol: ${urlObj.protocol}. Only http, https, and mailto are allowed.` };
    }

    // Check for localhost/private IPs (basic check)
    const hostname = urlObj.hostname.toLowerCase();
    if (hostname === "localhost" || hostname === "127.0.0.1" || hostname.startsWith("192.168.") || hostname.startsWith("10.") || hostname.startsWith("172.")) {
      return { valid: false, error: "Cannot use localhost or private IP addresses" };
    }

    return { valid: true };
  } catch (error) {
    return { valid: false, error: "Invalid URL format" };
  }
}

/**
 * Validates a shortlink slug
 * @param {string} slug - The slug to validate
 * @returns {{valid: boolean, error?: string}} - Validation result
 */
function validateSlug(slug) {
  if (typeof slug !== "string") {
    return { valid: false, error: "Slug must be a string" };
  }

  // Check length
  if (slug.length < MIN_SLUG_LENGTH) {
    return { valid: false, error: `Slug must be at least ${MIN_SLUG_LENGTH} characters long` };
  }

  if (slug.length > MAX_SLUG_LENGTH) {
    return { valid: false, error: `Slug cannot exceed ${MAX_SLUG_LENGTH} characters` };
  }

  // Check format: lowercase alphanumeric and hyphens, must start/end with alphanumeric
  const slugPattern = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
  if (!slugPattern.test(slug)) {
    return { valid: false, error: "Slug must contain only lowercase letters, numbers, and hyphens, and must start and end with a letter or number" };
  }

  // Check for consecutive hyphens
  if (slug.includes("--")) {
    return { valid: false, error: "Slug cannot contain consecutive hyphens" };
  }

  // Check reserved words
  if (RESERVED_SLUGS.has(slug)) {
    return { valid: false, error: `Slug "${slug}" is reserved and cannot be used` };
  }

  return { valid: true };
}

/**
 * Validates the redirects.json file
 * @returns {{valid: boolean, errors: Array, warnings: Array}} - Validation result
 */
function validateRedirects() {
  const errors = [];
  const warnings = [];

  // Check if redirects.json exists
  const redirectsPath = path.join(__dirname, "redirects.json");
  if (!fs.existsSync(redirectsPath)) {
    errors.push("redirects.json file not found");
    return { valid: false, errors, warnings };
  }

  // Try to parse JSON
  let redirects;
  try {
    const content = fs.readFileSync(redirectsPath, "utf8");
    redirects = JSON.parse(content);
  } catch (error) {
    errors.push(`Failed to parse redirects.json: ${error.message}`);
    return { valid: false, errors, warnings };
  }

  // Check if it's an object
  if (typeof redirects !== "object" || redirects === null || Array.isArray(redirects)) {
    errors.push("redirects.json must contain a JSON object");
    return { valid: false, errors, warnings };
  }

  // Validate each entry
  const seenUrls = new Map();
  const slugs = Object.keys(redirects);

  if (slugs.length === 0) {
    warnings.push("redirects.json is empty");
  }

  for (const slug of slugs) {
    const entry = redirects[slug];
    let url;
    let metadata = {};

    // Support both string URLs and object format
    if (typeof entry === "string") {
      url = entry;
    } else if (typeof entry === "object" && entry !== null) {
      url = entry.url;
      metadata = entry;

      // Validate metadata fields
      if (!url) {
        errors.push(`[${slug}] Missing required "url" field in object format`);
        continue;
      }

      if (entry.description && typeof entry.description !== "string") {
        errors.push(`[${slug}] Description must be a string`);
      }

      if (entry.owner && typeof entry.owner !== "string") {
        errors.push(`[${slug}] Owner must be a string`);
      }
    } else {
      errors.push(`[${slug}] Value must be a string URL or object with url field`);
      continue;
    }

    // Validate slug
    const slugValidation = validateSlug(slug);
    if (!slugValidation.valid) {
      errors.push(`[${slug}] Invalid slug: ${slugValidation.error}`);
    }

    // Validate URL
    const urlValidation = validateUrl(url);
    if (!urlValidation.valid) {
      errors.push(`[${slug}] Invalid URL: ${urlValidation.error}`);
    }

    // Check for duplicate URLs
    if (seenUrls.has(url)) {
      warnings.push(`[${slug}] Duplicate URL detected: also used by "${seenUrls.get(url)}"`);
    } else {
      seenUrls.set(url, slug);
    }

    // Warn about very long URLs
    if (url.length > 500) {
      warnings.push(`[${slug}] URL is very long (${url.length} characters)`);
    }
  }

  // Check for duplicate slugs (case-insensitive)
  const slugsLower = slugs.map(s => s.toLowerCase());
  const duplicates = slugsLower.filter((s, i) => slugsLower.indexOf(s) !== i);
  if (duplicates.length > 0) {
    errors.push(`Duplicate slugs detected (case-insensitive): ${[...new Set(duplicates)].join(", ")}`);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    stats: {
      total: slugs.length,
      withMetadata: slugs.filter(s => typeof redirects[s] === "object").length
    }
  };
}

// Main execution
console.log("🔍 Validating redirects.json...\n");

const result = validateRedirects();

if (result.errors.length > 0) {
  console.log("❌ Validation failed with errors:\n");
  result.errors.forEach(error => console.log(`   • ${error}`));
  console.log("");
}

if (result.warnings.length > 0) {
  console.log("⚠️  Warnings:\n");
  result.warnings.forEach(warning => console.log(`   • ${warning}`));
  console.log("");
}

if (result.valid) {
  console.log("✅ Validation successful!\n");
  console.log("📊 Statistics:");
  console.log(`   Total shortlinks: ${result.stats.total}`);
  console.log(`   With metadata: ${result.stats.withMetadata}`);
  console.log("");
  process.exit(0);
} else {
  console.log("❌ Please fix the errors above and try again.\n");
  process.exit(1);
}
