import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});
const page = await browser.newPage();

await page.goto(`file://${process.cwd()}/.github/generate/workflow-graph-app/build/index.html`, {
  waitUntil: 'domcontentloaded'
});

// Wait for the SVG element to ensure graph is rendered
await page.waitForSelector('svg', { timeout: 5000 });
await page.waitForTimeout(2000); // Optional: ensure rendering finishes

await page.screenshot({ path: '.github/generate/workflow_diagram.png' });

await browser.close();
