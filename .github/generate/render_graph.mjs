import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});
const page = await browser.newPage();

// Wait for full page load including network (React + fetch)
await page.goto(`file://${process.cwd()}/.github/generate/workflow-graph-app/build/index.html`, {
  waitUntil: 'networkidle0'
});

// Debug: uncomment to log the rendered HTML (optional)
// const content = await page.content();
// console.log(content);

// Wait for the SVG to be present (D3 graph)
await page.waitForSelector('svg', { timeout: 10000 });

// Extra safety: wait for a few seconds to ensure graph is fully rendered
await page.waitForTimeout(3000);

// Take screenshot
await page.screenshot({ path: '.github/generate/workflow_diagram.png' });

await browser.close();

console.log("✅ Screenshot saved to .github/generate/workflow_diagram.png");
