import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class PdfExporterService {

  async exportToPdf(elementId: string, title: string) {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error('Element not found:', elementId);
      return;
    }

    // Clone the element to render full content off-screen
    const clone = element.cloneNode(true) as HTMLElement;

    // Style the clone to expand full height
    clone.style.width = `${element.offsetWidth}px`;
    clone.style.height = 'auto'; // Let it expand
    clone.style.position = 'absolute';
    clone.style.top = '-9999px';
    clone.style.left = '-9999px';
    clone.style.overflow = 'visible';
    clone.style.background = '#ffffff'; // Ensure white background

    document.body.appendChild(clone);

    try {
      const canvas = await html2canvas(clone, {
        scale: 2, // Higher quality
        useCORS: true,
        logging: false,
        windowHeight: clone.scrollHeight,
        height: clone.scrollHeight // Force height capture
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${title.replace(/\s+/g, '_')}_dialogue.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      document.body.removeChild(clone);
    }
  }
}
