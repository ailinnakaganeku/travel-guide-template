import jsPDF from 'jspdf';
import { Location } from '../types/locations';

export function generateItineraryPDF(cityName: string, locations: Location[]) {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  pdf.setFillColor(240, 240, 240);
  pdf.rect(0, 0, pageWidth, 40, 'F');

  pdf.setFontSize(24);
  pdf.setTextColor(50, 50, 50);
  pdf.text(`${cityName} Travel Guide`, pageWidth / 2, 25, { align: 'center' });

  yPosition = 50;

  pdf.setFontSize(12);
  pdf.setTextColor(100, 100, 100);
  const dateText = `Generated on ${new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })}`;
  pdf.text(dateText, pageWidth / 2, yPosition, { align: 'center' });

  yPosition = 65;

  locations.forEach((location, index) => {
    if (yPosition > pageHeight - 60) {
      pdf.addPage();
      yPosition = margin;
    }

    pdf.setFillColor(230, 240, 255);
    pdf.roundedRect(margin, yPosition, maxWidth, 10, 2, 2, 'F');

    pdf.setFontSize(14);
    pdf.setTextColor(30, 64, 175);
    pdf.setFont(undefined, 'bold');
    pdf.text(`${index + 1}. ${location.name}`, margin + 5, yPosition + 7);

    yPosition += 15;

    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    pdf.setFont(undefined, 'italic');
    pdf.text(location.category, margin + 5, yPosition);

    yPosition += 8;

    pdf.setFontSize(10);
    pdf.setTextColor(60, 60, 60);
    pdf.setFont(undefined, 'normal');

    const splitDescription = pdf.splitTextToSize(location.description, maxWidth - 10);
    pdf.text(splitDescription, margin + 5, yPosition);

    yPosition += splitDescription.length * 6 + 10;
  });

  pdf.setFontSize(8);
  pdf.setTextColor(150, 150, 150);
  pdf.text(
    'Created with ❤️ for your Spanish adventure',
    pageWidth / 2,
    pageHeight - 10,
    { align: 'center' }
  );

  const fileName = `${cityName.toLowerCase()}-travel-guide.pdf`;
  pdf.save(fileName);
}
