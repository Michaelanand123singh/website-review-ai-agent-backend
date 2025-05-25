exports.generateReport = (url, siteContent, analysis) => {
  return {
    url,
    title: siteContent.title,
    description: siteContent.description,
    analysis,
    generatedAt: new Date().toISOString(),
  };
};
