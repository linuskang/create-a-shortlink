const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 8080;

// Simple HTTP server for testing redirects locally
const server = http.createServer((req, res) => {
  // Remove leading slash and decode URL
  let requestPath = decodeURIComponent(req.url.substring(1));
  
  // Handle root path
  if (requestPath === "" || requestPath === "/") {
    requestPath = "index.html";
  }
  
  // If no extension, try to serve directory/index.html
  if (!path.extname(requestPath)) {
    requestPath = path.join(requestPath, "index.html");
  }
  
  const filePath = path.join(__dirname, requestPath);
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    // Serve 404 page
    const notFoundPath = path.join(__dirname, "404.html");
    if (fs.existsSync(notFoundPath)) {
      res.writeHead(404, { "Content-Type": "text/html" });
      res.end(fs.readFileSync(notFoundPath));
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 - Not Found");
    }
    return;
  }
  
  // Determine content type
  const ext = path.extname(filePath);
  const contentTypes = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon"
  };
  
  const contentType = contentTypes[ext] || "text/plain";
  
  // Serve file
  try {
    const content = fs.readFileSync(filePath);
    res.writeHead(200, { "Content-Type": contentType });
    res.end(content);
  } catch (error) {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("500 - Internal Server Error");
  }
});

server.listen(PORT, () => {
  console.log("🌐 Local Shortlink Server");
  console.log("─".repeat(50));
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log("");
  console.log("Available shortlinks:");
  
  // Read and display available shortlinks
  try {
    const redirects = require("./redirects.json");
    let count = 0;
    
    for (const slug in redirects) {
      const entry = redirects[slug];
      const url = typeof entry === "string" ? entry : entry.url;
      const displaySlug = slug || "(root)";
      
      console.log(`  • http://localhost:${PORT}/${slug} → ${url}`);
      count++;
      
      if (count >= 20) {
        const remaining = Object.keys(redirects).length - count;
        if (remaining > 0) {
          console.log(`  ... and ${remaining} more`);
        }
        break;
      }
    }
    
    if (count === 0) {
      console.log("  (none configured)");
    }
  } catch (error) {
    console.log("  Error reading redirects.json");
  }
  
  console.log("");
  console.log("Press Ctrl+C to stop the server");
});

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n\n👋 Server stopped");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n\n👋 Server stopped");
  process.exit(0);
});
