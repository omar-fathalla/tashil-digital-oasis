
import { formatDate } from './formatters';

export const generateIdCardHTML = (request: any) => {
  const company = request.company_name || 'Company Name';
  const formattedDate = formatDate(request.submission_date);
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Employee ID Card</title>
      <style>
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          .id-card-container {
            width: 5cm;
            height: 2.5cm;
            margin: 0 auto;
            page-break-inside: avoid;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
          .id-card {
            border: 1px solid #ccc;
            border-radius: 5px;
            overflow: hidden;
            background: white;
            width: 100%;
            height: 100%;
            box-shadow: none;
          }
        }
        
        body {
          font-family: Arial, sans-serif;
          background: white;
        }
        .id-card-container {
          width: 5cm;
          height: 2.5cm;
          margin: 50px auto;
        }
        .id-card {
          border: 1px solid #ccc;
          border-radius: 5px;
          overflow: hidden;
          background: white;
          width: 100%;
          height: 100%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .id-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 4px;
          border-bottom: 1px solid #eee;
        }
        .id-card-logo {
          display: flex;
          align-items: center;
        }
        .id-card-logo img {
          width: 16px;
          height: 16px;
          margin-right: 4px;
        }
        .id-card-company {
          font-weight: bold;
          font-size: 8px;
        }
        .id-number {
          font-size: 6px;
          color: #666;
        }
        .id-card-body {
          padding: 4px;
        }
        .employee-info {
          display: flex;
          margin-bottom: 4px;
        }
        .employee-avatar {
          width: 14px;
          height: 14px;
          background: #f0f0f0;
          border-radius: 50%;
          margin-right: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .employee-name {
          font-size: 9px;
          font-weight: bold;
        }
        .issue-date {
          font-size: 6px;
          color: #666;
        }
        .id-card-footer {
          display: flex;
          justify-content: space-between;
          padding: 2px 4px;
          font-size: 6px;
          color: #666;
        }
        .qr-code {
          width: 16px;
          height: 16px;
          background: #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      </style>
    </head>
    <body>
      <div class="id-card-container">
        <div class="id-card">
          <div class="id-card-header">
            <div class="id-card-logo">
              <div style="width:16px;height:16px;background:#f0f0f0;"></div>
              <span class="id-card-company">${company}</span>
            </div>
            <div class="id-number">ID: ${request.employee_id?.substring(0, 8) || 'N/A'}</div>
          </div>
          
          <div class="id-card-body">
            <div class="employee-info">
              <div class="employee-avatar">👤</div>
              <div>
                <div class="employee-name">${request.full_name}</div>
                <div class="issue-date">Issue: ${formattedDate}</div>
              </div>
            </div>
          </div>
          
          <div class="id-card-footer">
            <div>${company}</div>
            <div class="qr-code">QR</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};
