#!/usr/bin/env node
import { chromium } from 'playwright';
import fs from 'fs';

async function run() {
  fs.mkdirSync('screenshots', { recursive: true });
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });

  try {
    await page.goto('http://localhost:8080', { waitUntil: 'networkidle' });
    await page.screenshot({ path: 'screenshots/home.png', fullPage: true });
    console.log('saved screenshots/home.png');
  } catch (e) {
    console.error('homepage screenshot failed:', e.message);
  }

  try {
    await page.goto('http://localhost:8080/admin.html', { waitUntil: 'networkidle' });
    await page.screenshot({ path: 'screenshots/admin.png', fullPage: true });
    console.log('saved screenshots/admin.png');
  } catch (e) {
    console.error('admin screenshot failed:', e.message);
  }

  await browser.close();
}

run().catch(e => { console.error(e); process.exit(1); });
