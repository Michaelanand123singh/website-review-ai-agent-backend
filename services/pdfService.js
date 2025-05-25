const puppeteer = require('puppeteer');

exports.generatePdf = async (report) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const htmlContent = `
  <html>
    <head>
      <title>Report for ${report.title}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { color: #333; }
        pre { white-space: pre-wrap; word-wrap: break-word; background: #f4f4f4; padding: 10px; border-radius: 5px; }
      </style>
    </head>
    <body>
      <h1>Marketing Agency Review</h1>
      <h2>${report.title}</h2>
      <p><strong>URL:</strong> <a href="${report.url}">${report.url}</a></p>
      <p><strong>Description:</strong> ${report.description}</p>
      <h3>Detailed Analysis:</h3>
      <pre>${report.analysis}</pre>
      <p><em>Report generated at: ${report.generatedAt}</em></p>
    </body>
  </html>
  `;

  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

  const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

  await browser.close();

  return pdfBuffer;
};
