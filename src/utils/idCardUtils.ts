
import { generatePDF } from './print/pdfGenerator';
import { printDocument } from './print/printManager';
import { formatDate } from './print/formatters';

export const downloadIdCard = async (request: any) => {
  const idCardElement = document.querySelector('.id-card') as HTMLElement;
  if (!idCardElement) {
    throw new Error("Could not find ID card element");
  }
  await generatePDF(idCardElement, `employee-id-${request.employee_id || request.id}.pdf`);
};

export const printIdCard = printDocument;

export { formatDate };
