import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportToPDF = async () => {
    // Hidden loading overlay can be added here if needed
    const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [1920, 1080]
    });

    const captureSection = async (elementId: string, addPage = true) => {
        const element = document.getElementById(elementId);
        if (!element) return;

        // Target aspect ratio 16:9
        const targetWidth = 1920;
        const targetHeight = 1080;

        const canvas = await html2canvas(element, {
            scale: 2, // Higher scale for text clarity
            useCORS: true,
            backgroundColor: '#050505',
            logging: false,
            windowWidth: targetWidth,
            windowHeight: targetHeight
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.95);

        if (addPage) {
            pdf.addPage([targetWidth, targetHeight], 'landscape');
        }

        // Maintain 16:9 and prevent squashing
        // We ensure the image is drawn precisely to fit or be centered
        const canvasAspect = canvas.width / canvas.height;
        const targetAspect = targetWidth / targetHeight;

        let renderWidth, renderHeight, xOffset, yOffset;

        if (canvasAspect > targetAspect) {
            // Canvas is wider than target
            renderWidth = targetWidth;
            renderHeight = targetWidth / canvasAspect;
            xOffset = 0;
            yOffset = (targetHeight - renderHeight) / 2;
        } else {
            // Canvas is taller than target
            renderHeight = targetHeight;
            renderWidth = targetHeight * canvasAspect;
            xOffset = (targetWidth - renderWidth) / 2;
            yOffset = 0;
        }

        pdf.addImage(imgData, 'JPEG', xOffset, yOffset, renderWidth, renderHeight);
    };

    // Sequence of 6 main pages (Deploy split into 3)
    await captureSection('hero-section', false);
    await captureSection('infrastructure-section');
    await captureSection('evaluation-section');

    // Deployment Pages
    await captureSection('deploy-section-1'); // AI Hackathon
    await captureSection('deploy-section-2'); // Demoday & Festival
    await captureSection('deploy-section-3'); // Global Collab

    await captureSection('bridge-section');
    await captureSection('proposal-section');

    pdf.save('NEORDINARY_CATALOG_2026.pdf');
};
