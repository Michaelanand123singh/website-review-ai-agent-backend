const puppeteer = require('puppeteer');

exports.crawlWebsite = async (url) => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    const siteContent = await page.evaluate(() => {
      const title = document.querySelector('title')?.innerText || '';
      const description = document.querySelector('meta[name="description"]')?.content || '';
      const bodyText = document.body.innerText || '';
      return { title, description, bodyText };
    });

    return siteContent;
  } catch (err) {
    console.error('Error crawling website:', err);
    throw err; // let controller handle this error
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

// Mock analyzeContent function simulating Gemini API call
exports.analyzeContent = async (siteContent) => {
  const detailedAnalysis = `
  Analysis of website titled "${siteContent.title}":

  Meta Description: ${siteContent.description}

  Content Overview:
  ${siteContent.bodyText.slice(0, 500)}...

  Business Model Insights:
  - Focuses on digital marketing services like SEO, PPC, Social Media Marketing.
  - Target clients: SMEs and startups in Dubai.
  - Unique selling points: Customized marketing solutions, local market expertise.
  - Pricing and packages are not clearly stated.
  `;

  return detailedAnalysis;
};
