const puppeteer = require('puppeteer');

exports.crawlWebsite = async (url) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

  // Simple extraction: get page title, meta description, and all visible text content
  const siteContent = await page.evaluate(() => {
    const title = document.querySelector('title')?.innerText || '';
    const description = document.querySelector('meta[name="description"]')?.content || '';
    const bodyText = document.body.innerText || '';
    return { title, description, bodyText };
  });

  await browser.close();
  return siteContent;
};
