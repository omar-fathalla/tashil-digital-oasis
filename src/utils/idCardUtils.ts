
export const generateIdCardHTML = (request: any) => {
  return `
    <html>
      <body style="font-family: Arial, sans-serif; padding: 20px;">
        <div style="border: 2px solid #000; padding: 20px; max-width: 400px; margin: 0 auto;">
          <h2 style="text-align: center;">Employee Digital ID</h2>
          <div style="margin: 10px 0;">
            <strong>Name:</strong> ${request.full_name}
          </div>
          <div style="margin: 10px 0;">
            <strong>Employee ID:</strong> ${request.id_card?.id || 'N/A'}
          </div>
          <div style="margin: 10px 0;">
            <strong>Registration Date:</strong> ${new Date(request.submission_date).toLocaleDateString()}
          </div>
          <div style="margin: 10px 0;">
            <strong>ID Card Issue Date:</strong> ${request.id_card ? new Date(request.id_card.issue_date).toLocaleDateString() : 'N/A'}
          </div>
          <div style="margin: 10px 0;">
            <strong>ID Card Expiry Date:</strong> ${request.id_card ? new Date(request.id_card.expiry_date).toLocaleDateString() : 'N/A'}
          </div>
        </div>
      </body>
    </html>
  `;
};

export const downloadIdCard = (request: any) => {
  const idCardHTML = generateIdCardHTML(request);
  const blob = new Blob([idCardHTML], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `employee-id-${request.id_card?.id || request.id}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const printIdCard = (request: any) => {
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(generateIdCardHTML(request));
    printWindow.document.close();
  }
};
