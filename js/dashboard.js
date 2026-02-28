// Dashboard Interactions
document.addEventListener('DOMContentLoaded', () => {
    console.log("Crediflow Dashboard Loaded");

    // Simulate real-time score update effect
    const scoreElement = document.querySelector('.percentage');
    if (scoreElement) {
        // Simple counter animation could go here, for now it's static in SVG
    }

    // Handle "Download Data" button
    const downloadBtn = document.querySelector('button[onclick="window.print()"]');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', (e) => {
            // In a real app, this would generate a PDF
            console.log("Generating report...");
        });
    }
});
