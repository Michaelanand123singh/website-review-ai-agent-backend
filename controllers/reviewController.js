const crawlerService = require('../services/crawlerService');
const analyzerService = require('../services/analyzerService');
const reportGenerator = require('../services/reportGenerator');
const pdfService = require('../services/pdfService');

// In-memory report store (replace with DB in prod)
const reports = {};
let reportIdCounter = 1;

exports.createReview = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required' });

    // 1. Crawl website
    const siteContent = await crawlerService.crawlWebsite(url);

    // 2. Analyze content with Gemini
    const analysis = await analyzerService.analyzeContent(siteContent);

    // 3. Generate detailed report
    const report = reportGenerator.generateReport(url, siteContent, analysis);

    // 4. Save report (in-memory)
    const id = reportIdCounter++;
    reports[id] = report;

    res.json({ id, report });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create review' });
  }
};

exports.getReport = (req, res) => {
  const { id } = req.params;
  const report = reports[id];
  if (!report) return res.status(404).json({ error: 'Report not found' });

  res.json(report);
};

exports.downloadReport = async (req, res) => {
  const { id } = req.params;
  const report = reports[id];
  if (!report) return res.status(404).json({ error: 'Report not found' });

  try {
    const pdfBuffer = await pdfService.generatePdf(report);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=report-${id}.pdf`,
      'Content-Length': pdfBuffer.length,
    });
    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
};
