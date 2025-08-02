import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});
const page = await browser.newPage();

await page.goto(`file://${process.cwd()}/.github/generate/workflow-graph-app/build/index.html`, {
  waitUntil: 'domcontentloaded'
});

// Wait for graph container to load — update selector if needed
await page.waitForSelector('#graph-container', { timeout: 5000 });

await page.screenshot({ path: '.github/generate/workflow_diagram.png' });
