// Mock of Google Gemini API call (replace with real API call once you have access)
exports.analyzeContent = async (siteContent) => {
  // Simulate LLM processing with a fake detailed summary
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
