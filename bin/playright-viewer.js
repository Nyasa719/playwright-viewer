#!/usr/bin/env node

const { createServer } = require('../lib/viewer');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0];

if (command === 'serve') {
  // Parse options
  const options = {};
  for (let i = 1; i < args.length; i += 2) {
    const key = args[i];
    const value = args[i + 1];
    
    if (key === '--port' || key === '-p') {
      options.port = parseInt(value, 10);
    } else if (key === '--report-dir' || key === '-d') {
      options.reportDir = path.resolve(process.cwd(), value);
    }
  }
  
  // Start server
  const server = createServer(options);
  const port = options.port || 4173;
  
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n❌ Error: Port ${port} is already in use. Try a different port:\n   playwright-viewer serve --port 4300\n`);
    } else {
      console.error(`\n❌ Server error:`, err.message);
    }
    process.exit(1);
  });
  
  server.listen(port, () => {
    console.log(`\n🎯 Playwright Viewer running at http://localhost:${port}\n`);
  });
} else {
  console.log(`
Usage: playwright-viewer <command>

Commands:
  serve              Start the report viewer server
  serve --port 4300  Use custom port
  serve -d ./reports Use custom report directory
  `);
  process.exit(1);
}
