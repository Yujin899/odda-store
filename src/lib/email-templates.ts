interface OrderItem {
  name: string;
  nameAr?: string;
  quantity: number;
  price: number;
}

interface EmailParams {
  subject: string;
  bodyText: string;
  customerName: string;
  orderNumber: string;
  items: OrderItem[];
  totalAmount: number;
  isAr: boolean;
  baseUrl: string;
  trackingUrl?: string;
}

export const getPremiumEmailHtml = (params: EmailParams) => {
  const { 
    bodyText, 
    customerName, 
    orderNumber, 
    items, 
    totalAmount, 
    isAr, 
    baseUrl,
    trackingUrl = `${baseUrl}/order-tracking?order=${orderNumber}`
  } = params;
  
  const dir = isAr ? 'rtl' : 'ltr';
  const textAlign = isAr ? 'right' : 'left';
  const brandName = isAr ? 'عُدّة' : 'Odda';
  
  // Translation Mapping
  const t = {
    product: isAr ? 'المنتج' : 'Product',
    qty: isAr ? 'الكمية' : 'Qty',
    unitPrice: isAr ? 'سعر الوحدة' : 'Unit Price',
    total: isAr ? 'الإجمالي' : 'Total',
    orderTotal: isAr ? 'إجمالي الطلب' : 'Order Total',
    trackOrder: isAr ? 'تتبع طلبك' : 'Track Your Order',
    allRightsReserved: isAr ? 'جميع الحقوق محفوظة' : 'All rights reserved',
    currency: isAr ? 'ج.م' : 'EGP'
  };

  return `
    <!DOCTYPE html>
    <html lang="${isAr ? 'ar' : 'en'}" dir="${dir}">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${params.subject}</title>
      ${isAr ? '<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap" rel="stylesheet">' : ''}
      <style>
        body { 
          margin: 0; 
          padding: 0; 
          background-color: #f8fafc; 
          font-family: ${isAr ? "'Cairo', sans-serif" : "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"}; 
          -webkit-font-smoothing: antialiased;
        }
        .wrapper {
          width: 100%;
          table-layout: fixed;
          background-color: #f8fafc;
          padding-bottom: 40px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
        }
        .header {
          background-color: #0A192F;
          padding: 40px 20px;
          text-align: center;
        }
        .header h1 {
          color: #ffffff;
          margin: 0;
          font-size: 24px;
          font-weight: 900;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .body {
          padding: 40px;
        }
        .greeting {
          font-size: 18px;
          font-weight: 700;
          color: #0A192F;
          margin-bottom: 16px;
          text-align: ${textAlign};
        }
        .message {
          font-size: 15px;
          line-height: 1.6;
          color: #475569;
          margin-bottom: 32px;
          text-align: ${textAlign};
          white-space: pre-wrap;
        }
        .order-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 32px;
        }
        .order-table th {
          background-color: #f1f5f9;
          color: #64748B;
          font-size: 12px;
          text-transform: uppercase;
          font-weight: 700;
          padding: 12px;
          text-align: ${textAlign};
          border-bottom: 2px solid #e2e8f0;
        }
        .order-table td {
          padding: 12px;
          font-size: 14px;
          color: #1e293b;
          border-bottom: 1px solid #f1f5f9;
          text-align: ${textAlign};
        }
        .total-row {
          background-color: #fafafa;
        }
        .total-row td {
          font-weight: 900;
          font-size: 16px;
          color: #0A192F;
          border-bottom: none;
          padding: 20px 12px;
        }
        .button-wrap {
          text-align: center;
          padding: 20px 0;
        }
        .button {
          background-color: #0073E6;
          color: #ffffff !important;
          padding: 16px 32px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 700;
          font-size: 14px;
          display: inline-block;
        }
        .footer {
          text-align: center;
          padding: 32px 20px;
          color: #94a3b8;
          font-size: 12px;
        }
      </style>
    </head>
    <body dir="${dir}">
      <center class="wrapper">
        <div class="container">
          <!-- Header -->
          <div class="header">
            <h1>${brandName}</h1>
          </div>

          <!-- Body -->
          <div class="body">
            <div class="greeting">${isAr ? 'مرحباً' : 'Hello'} ${customerName},</div>
            <div class="message">${bodyText}</div>

            <!-- Order Table -->
            <table class="order-table" dir="${dir}">
              <thead>
                <tr>
                  <th>${t.product}</th>
                  <th style="text-align: center;">${t.qty}</th>
                  <th>${t.unitPrice}</th>
                  <th style="text-align: ${isAr ? 'left' : 'right'};">${t.total}</th>
                </tr>
              </thead>
              <tbody>
                ${items.map(item => {
                  const itemName = (isAr && item.nameAr) ? item.nameAr : item.name;
                  return `
                    <tr>
                      <td>${itemName}</td>
                      <td style="text-align: center;">${item.quantity}</td>
                      <td>${item.price.toLocaleString()} ${t.currency}</td>
                      <td style="text-align: ${isAr ? 'left' : 'right'}; font-weight: 700;">${(item.price * item.quantity).toLocaleString()} ${t.currency}</td>
                    </tr>
                  `;
                }).join('')}
                <tr class="total-row">
                  <td colspan="3" style="text-align: ${isAr ? 'left' : 'right'};">${t.orderTotal}</td>
                  <td style="text-align: ${isAr ? 'left' : 'right'}; color: #0073E6;">${totalAmount.toLocaleString()} ${t.currency}</td>
                </tr>
              </tbody>
            </table>

            <!-- Action -->
            <div class="button-wrap">
              <a href="${trackingUrl}" class="button">${t.trackOrder}</a>
            </div>
          </div>

          <!-- Footer -->
          <div class="footer">
            <p>© ${new Date().getFullYear()} ${brandName}. ${t.allRightsReserved}.</p>
          </div>
        </div>
      </center>
    </body>
    </html>
  `;
};
