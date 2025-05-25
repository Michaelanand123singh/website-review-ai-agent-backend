const crawlerService = require('../services/crawlerService');
const analyzerService = require('../services/analyzerService');
const reportGenerator = require('../services/reportGenerator');
const pdfService = require('../services/pdfService');

// In-memory report store (replace with DB in prod)
const reports = {};
let reportIdCounter = 1;

// POST /api/review
exports.createReview = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      console.warn('URL is missing in request body');
      return res.status(400).json({ error: 'URL is required' });
    }

    console.log(`🔍 Starting website review for: ${url}`);

    // 1. Crawl website
    const siteContent = await crawlerService.crawlWebsite(url);
    console.log('✅ Website crawled successfully');

    // 2. Analyze content (mock or real)
    const analysis = await analyzerService.analyzeContent(siteContent);
    console.log('✅ Content analyzed successfully');

    // 3. Generate report
    const report = reportGenerator.generateReport(url, siteContent, analysis);
    console.log('✅ Report generated');

    // 4. Save report (in-memory)
    const id = reportIdCounter++;
    reports[id] = report;

    console.log(`📝 Report stored with ID: ${id}`);
    res.status(201).json({ id, report });
  } catch (err) {
    console.error('❌ Error in createReview:', err.message);
    console.error(err.stack);
    res.status(500).json({ error: 'Failed to create review' });
  }
};

// GET /api/reports/:id
exports.getReport = (req, res) => {
  const { id } = req.params;
  const report = reports[id];
  if (!report) {
    console.warn(`⚠️ Report not found for ID: ${id}`);
    return res.status(404).json({ error: 'Report not found' });
  }

  console.log(`📄 Retrieved report for ID: ${id}`);
  res.status(200).json(report);
};

// GET /api/reports/:id/download
exports.downloadReport = async (req, res) => {
  const { id } = req.params;
  const report = reports[id];
  if (!report) {
    console.warn(`⚠️ Report not found for download, ID: ${id}`);
    return res.status(404).json({ error: 'Report not found' });
  }

  try {
    const pdfBuffer = await pdfService.generatePdf(report);
    console.log(`📥 PDF generated for report ID: ${id}`);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=report-${id}.pdf`,
      'Content-Length': pdfBuffer.length,
    });
    res.send(pdfBuffer);
  } catch (err) {
    console.error(`❌ Failed to generate PDF for ID ${id}:`, err.message);
    console.error(err.stack);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
};
