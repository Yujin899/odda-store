export const getPremiumEmailHtml = (params: {
  bodyText: string;
  customerName: string;
  orderNumber: string;
  items: any[];
  totalAmount: number;
  isAr: boolean;
  baseUrl: string;
}) => {
  const { bodyText, customerName, orderNumber, items, totalAmount, isAr, baseUrl } = params;
  const dir = isAr ? 'rtl' : 'ltr';
  const textAlign = isAr ? 'right' : 'left';
  const brandName = isAr ? 'عدة' : 'Odda';
  const trackingText = isAr ? 'تتبع طلبك' : 'Track Your Order';
  const orderSummaryText = isAr ? 'ملخص الطلب' : 'Order Summary';
  const totalText = isAr ? 'الإجمالي' : 'Total';
  const egpText = isAr ? 'ج.م' : 'EGP';

  return `
    <!DOCTYPE html>
    <html lang="${isAr ? 'ar' : 'en'}" dir="${dir}">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      ${isAr ? '<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap" rel="stylesheet">' : ''}
      <style>
        body { margin: 0; padding: 0; background-color: #f8fafc; font-family: ${isAr ? "'Cairo', sans-serif" : "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"}; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
        .header { background-color: #0f172a; padding: 40px; text-align: center; }
        .header h1 { color: #84cc16; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -0.025em; text-transform: uppercase; }
        .header p { color: #94a3b8; margin: 10px 0 0; font-size: 10px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; }
        .content { padding: 40px; }
        .greeting { font-size: 20px; font-weight: 800; color: #0f172a; margin-bottom: 20px; text-align: ${textAlign}; }
        .body-text { color: #475569; line-height: 1.6; font-size: 15px; margin-bottom: 30px; text-align: ${textAlign}; white-space: pre-wrap; }
        .order-summary { background-color: #f1f5f9; border-radius: 8px; padding: 24px; margin-bottom: 30px; }
        .summary-title { font-size: 11px; font-weight: 900; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 15px; text-align: ${textAlign}; }
        .item { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; font-weight: 700; color: #1e293b; }
        .item-name { flex: 1; text-align: ${textAlign}; }
        .item-price { margin-${isAr ? 'right' : 'left'}: 20px; }
        .total-row { border-top: 1px solid #e2e8f0; margin-top: 15px; padding-top: 15px; display: flex; justify-content: space-between; font-weight: 900; color: #0f172a; font-size: 18px; }
        .button-container { text-align: center; margin-top: 40px; }
        .button { background-color: #0f172a; color: #ffffff !important; padding: 18px 36px; border-radius: 6px; text-decoration: none; font-weight: 800; font-size: 12px; text-transform: uppercase; letter-spacing: 0.15em; display: inline-block; }
        .footer { padding: 40px; text-align: center; border-top: 1px solid #f1f5f9; background-color: #fafafa; }
        .footer p { color: #94a3b8; font-size: 11px; font-weight: 700; margin: 0; text-transform: uppercase; letter-spacing: 0.05em; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${brandName}</h1>
          <p>Premium Clinical Instruments</p>
        </div>
        <div class="content">
          <div class="greeting">${isAr ? 'مرحباً' : 'Welcome'}, ${customerName}</div>
          <div class="body-text">${bodyText}</div>
          
          <div class="order-summary">
            <div class="summary-title">${orderSummaryText}</div>
            ${items.map((item: any) => `
              <div class="item">
                <span class="item-name">${item.quantity}x ${isAr && item.nameAr ? item.nameAr : item.name}</span>
                <span class="item-price">${(item.price * item.quantity).toLocaleString()} ${egpText}</span>
              </div>
            `).join('')}
            <div class="total-row">
              <span>${totalText}</span>
              <span>${totalAmount.toLocaleString()} ${egpText}</span>
            </div>
          </div>

          <div class="button-container">
            <a href="${baseUrl}/order-tracking?order=${orderNumber}" class="button">${trackingText}</a>
          </div>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} ${brandName} - Built for Excellence</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
