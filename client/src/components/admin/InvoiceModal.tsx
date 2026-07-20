import { useRef } from 'react';
import { X, Printer } from 'lucide-react';

interface InvoiceProps {
  order: any;
  onClose: () => void;
}

export default function InvoiceModal({ order, onClose }: InvoiceProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const content = printRef.current?.innerHTML;
    if (!content) return;
    const win = window.open('', '_blank', 'width=1000,height=800');
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head>
      <title>TAX INVOICE #${order._id.slice(-8).toUpperCase()} — ChildToysStore</title>
      <style>${CSS}</style>
    </head><body>${content}</body></html>`);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 800);
  };

  const addr   = order.deliveryAddress ?? {};
  const isPaid = order.paymentStatus === 'Completed';
  const invNo  = 'INV-' + order._id.slice(-8).toUpperCase();
  const ordId  = '#' + order._id.slice(-10).toUpperCase();
  const orderDate   = new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const payDate     = isPaid ? orderDate : 'Awaiting Payment';
  const delivStatus = order.deliveryStatus || 'Processing';
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=${encodeURIComponent(invNo)}&color=1e3a8a&bgcolor=ffffff`;

  const subtotal = order.itemsPrice ?? order.orderItems.reduce((a: number, i: any) => a + i.price * i.qty, 0);
  const shipping = order.shippingPrice ?? 0;
  const tax      = order.taxPrice ?? 0;
  const total    = order.totalPrice ?? 0;

  const dlvBadgeColor: Record<string, string> = {
    Processing: '#6366f1', Packed: '#8b5cf6', Shipped: '#0ea5e9',
    'Out for Delivery': '#f59e0b', Delivered: '#10b981', Cancelled: '#ef4444'
  };
  const dlvColor = dlvBadgeColor[delivStatus] || '#6366f1';

  const timeline = ['Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];
  const curStep  = timeline.indexOf(delivStatus);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[93vh] flex flex-col overflow-hidden">

        {/* ── Toolbar ── */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🧸</span>
            <div>
              <h2 className="text-white font-black text-base tracking-wide">TAX INVOICE</h2>
              <p className="text-blue-300 text-xs font-medium">{invNo} &nbsp;·&nbsp; {orderDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handlePrint}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition shadow-lg">
              <Printer size={15}/> Print / Save PDF
            </button>
            <button onClick={onClose} className="p-2.5 hover:bg-white/10 rounded-xl transition text-slate-400 hover:text-white">
              <X size={20}/>
            </button>
          </div>
        </div>

        {/* ── Preview ── */}
        <div className="overflow-y-auto flex-1 bg-slate-100 p-4">
          <div ref={printRef}>
            <div className="inv-root">

              {/* ══ PAGE ══ */}

              {/* 1. HERO HEADER */}
              <div className="hero">
                <div className="hero-left">
                  <div className="logo-row">
                    <div className="logo-icon">🧸</div>
                    <div>
                      <div className="logo-name">ChildToys<span className="logo-accent">Store</span></div>
                      <div className="logo-tag">Premium Toys for Every Child</div>
                    </div>
                  </div>
                </div>
                <div className="hero-right">
                  <div className="tax-badge">TAX INVOICE</div>
                  <div className="meta-grid">
                    <div className="meta-item"><div className="meta-label">Invoice No.</div><div className="meta-value">{invNo}</div></div>
                    <div className="meta-item"><div className="meta-label">Order ID</div><div className="meta-value">{ordId}</div></div>
                    <div className="meta-item"><div className="meta-label">Invoice Date</div><div className="meta-value">{orderDate}</div></div>
                    <div className="meta-item"><div className="meta-label">Order Date</div><div className="meta-value">{orderDate}</div></div>
                    <div className="meta-item"><div className="meta-label">Payment Date</div><div className="meta-value">{payDate}</div></div>
                    <div className="meta-item">
                      <div className="meta-label">Payment Status</div>
                      <div className={isPaid ? 'badge-paid' : 'badge-pending'}>{isPaid ? '✓ PAID' : '⏳ PENDING'}</div>
                    </div>
                    <div className="meta-item">
                      <div className="meta-label">Delivery Status</div>
                      <div className="badge-delivery" style={{background: dlvColor + '18', color: dlvColor, borderColor: dlvColor + '40'}}>{delivStatus}</div>
                    </div>
                  </div>
                </div>
                <div className="qr-block">
                  <img src={qrUrl} alt="QR" className="qr-img"/>
                  <div className="qr-label">Scan to Verify</div>
                </div>
              </div>

              {/* 2. INFO CARDS */}
              <div className="info-row">
                <div className="info-card">
                  <div className="card-title">🏢 Company Information</div>
                  <div className="info-company">ChildToysStore Pvt. Ltd.</div>
                  <div className="info-line"><span className="info-key">GSTIN</span><span className="info-val">27AAXCS1234A1Z5</span></div>
                  <div className="info-line"><span className="info-key">Address</span><span className="info-val">12, Toy Lane, Andheri West, Mumbai - 400053, Maharashtra, India</span></div>
                  <div className="info-line"><span className="info-key">Email</span><span className="info-val">support@childtoysstore.com</span></div>
                  <div className="info-line"><span className="info-key">Phone</span><span className="info-val">+91 98765 43210</span></div>
                  <div className="info-line"><span className="info-key">Website</span><span className="info-val">www.childtoysstore.com</span></div>
                </div>
                <div className="info-card">
                  <div className="card-title">📦 Billing & Shipping</div>
                  <div className="info-company">{order.user?.name || 'Customer'}</div>
                  <div className="info-line"><span className="info-key">Email</span><span className="info-val">{order.user?.email || 'N/A'}</span></div>
                  {addr.houseNo && <div className="info-line"><span className="info-key">Address</span><span className="info-val">{addr.houseNo}, {addr.street}{addr.landmark ? ', ' + addr.landmark : ''}</span></div>}
                  {addr.area && <div className="info-line"><span className="info-key">Area</span><span className="info-val">{addr.area}, {addr.city}</span></div>}
                  {addr.state && <div className="info-line"><span className="info-key">State</span><span className="info-val">{addr.state} - {addr.pincode}</span></div>}
                  <div className="info-line"><span className="info-key">Country</span><span className="info-val">{addr.country || 'India'}</span></div>
                </div>
              </div>

              {/* 3. PRODUCT TABLE */}
              <div className="table-card">
                <div className="card-title" style={{padding: '18px 24px 0'}}>🛍️ Order Items</div>
                <table className="prod-table">
                  <thead>
                    <tr>
                      <th className="th-sl">#</th>
                      <th className="th-prod">Product Name</th>
                      <th className="th-num">Qty</th>
                      <th className="th-num">Unit Price</th>
                      <th className="th-num">GST</th>
                      <th className="th-num">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.orderItems.map((item: any, i: number) => (
                      <tr key={i} className={i % 2 === 0 ? 'tr-even' : 'tr-odd'}>
                        <td className="td-sl">{String(i + 1).padStart(2, '0')}</td>
                        <td className="td-prod">
                          <div className="prod-img-wrap">
                            {item.image
                              ? <img src={item.image} alt={item.name} className="prod-img"/>
                              : <div className="prod-img-ph">🧸</div>}
                          </div>
                          <div>
                            <div className="prod-name">{item.name}</div>
                            <div className="prod-sku">SKU: TOY-{item.product?.toString().slice(-6).toUpperCase()}</div>
                          </div>
                        </td>
                        <td className="td-num">{item.qty}</td>
                        <td className="td-num">₹{item.price.toFixed(0)}</td>
                        <td className="td-num gst-cell">18%</td>
                        <td className="td-num total-cell">₹{(item.price * item.qty).toFixed(0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 4. SUMMARY + DELIVERY */}
              <div className="bottom-row">

                {/* Delivery Timeline */}
                <div className="delivery-card">
                  <div className="card-title">🚚 Delivery Information</div>
                  <div className="dlv-info-line"><span className="info-key">Courier Partner</span><span className="info-val">ChildToys Delivery Network</span></div>
                  <div className="dlv-info-line"><span className="info-key">Tracking No.</span><span className="info-val">CT{order._id.slice(-10).toUpperCase()}</span></div>
                  <div className="dlv-info-line"><span className="info-key">Est. Delivery</span><span className="info-val">3–5 Business Days</span></div>
                  <div className="dlv-info-line"><span className="info-key">Status</span>
                    <span className="badge-delivery" style={{background: dlvColor + '18', color: dlvColor, borderColor: dlvColor + '40'}}>{delivStatus}</span>
                  </div>
                  <div className="timeline-label">Shipment Timeline</div>
                  <div className="timeline">
                    {timeline.map((step, idx) => (
                      <div key={step} className="tl-step">
                        <div className={`tl-dot ${idx <= curStep ? 'tl-active' : 'tl-inactive'}`}>
                          {idx < curStep ? '✓' : idx === curStep ? '●' : '○'}
                        </div>
                        {idx < timeline.length - 1 && (
                          <div className={`tl-line ${idx < curStep ? 'tl-line-done' : 'tl-line-pending'}`}/>
                        )}
                        <div className={`tl-name ${idx <= curStep ? 'tl-name-active' : 'tl-name-pending'}`}>{step}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="summary-card">
                  <div className="card-title">💰 Order Summary</div>
                  <div className="sum-line"><span>Subtotal</span><span>₹{subtotal.toFixed(0)}</span></div>
                  <div className="sum-line"><span>Product Discount</span><span className="discount">— ₹0</span></div>
                  <div className="sum-line"><span>Coupon Discount</span><span className="discount">— ₹0</span></div>
                  <div className="sum-line"><span>Shipping Charges</span><span>{shipping > 0 ? `₹${shipping.toFixed(0)}` : <span className="free">FREE</span>}</span></div>
                  <div className="sum-line"><span>GST (18%)</span><span>₹{tax.toFixed(0)}</span></div>
                  <div className="sum-divider"/>
                  <div className="grand-block">
                    <div className="grand-label">GRAND TOTAL</div>
                    <div className="grand-amount">₹{total.toFixed(0)}</div>
                  </div>
                  <div className="payment-info">
                    <div className="pay-row"><span className="info-key">Amount Paid</span><span className="info-val font-bold">₹{isPaid ? total.toFixed(0) : '0'}</span></div>
                    <div className="pay-row"><span className="info-key">Payment Method</span><span className="info-val">{order.paymentMethod || 'Razorpay'}</span></div>
                    <div className="pay-row"><span className="info-key">Transaction</span><span className="info-val">UPI / Card / Wallet</span></div>
                  </div>
                  {isPaid && <div className="paid-watermark">PAID</div>}
                </div>

              </div>

              {/* 5. TERMS */}
              <div className="terms-card">
                <div className="terms-grid">
                  <div>
                    <div className="terms-heading">📋 Terms & Conditions</div>
                    <div className="terms-text">• All prices are inclusive of applicable taxes (GST).</div>
                    <div className="terms-text">• Goods sold cannot be returned without a valid reason.</div>
                    <div className="terms-text">• Disputes are subject to Mumbai jurisdiction.</div>
                    <div className="terms-text">• This is a computer-generated invoice and requires no signature.</div>
                  </div>
                  <div>
                    <div className="terms-heading">🔄 Return & Refund Policy</div>
                    <div className="terms-text">• Returns accepted within 7 days of delivery.</div>
                    <div className="terms-text">• Items must be unused and in original packaging.</div>
                    <div className="terms-text">• Refunds processed within 5–7 business days.</div>
                    <div className="terms-text">• Visit our website for the full refund policy.</div>
                  </div>
                  <div>
                    <div className="terms-heading">🎧 Customer Support</div>
                    <div className="terms-text">📧 support@childtoysstore.com</div>
                    <div className="terms-text">📞 +91 98765 43210</div>
                    <div className="terms-text">🌐 www.childtoysstore.com</div>
                    <div className="terms-text">⏰ Mon–Sat, 9 AM – 6 PM IST</div>
                  </div>
                </div>
              </div>

              {/* 6. FOOTER */}
              <div className="inv-footer">
                <div className="footer-left">
                  <div className="footer-brand">🧸 ChildToysStore</div>
                  <div className="footer-copy">© {new Date().getFullYear()} ChildToysStore Pvt. Ltd. All rights reserved.</div>
                </div>
                <div className="footer-center">
                  <div className="social-row">
                    <span className="social-icon">📘</span>
                    <span className="social-icon">📸</span>
                    <span className="social-icon">🐦</span>
                    <span className="social-icon">▶️</span>
                  </div>
                  <div className="footer-tagline">Play · Learn · Grow · Smile</div>
                </div>
                <div className="footer-right">
                  <div className="footer-thanks">Thank You for Your Purchase! 🎉</div>
                  <div className="footer-sub">We hope your child loves it.</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────── PRINT CSS ─────────── */
const CSS = `
* { margin:0; padding:0; box-sizing:border-box; }
body { background:#f1f5f9; font-family:'Segoe UI',Arial,sans-serif; }

.inv-root {
  background:#fff;
  max-width:900px;
  margin:16px auto;
  border-radius:20px;
  overflow:hidden;
  box-shadow:0 24px 80px rgba(0,0,0,0.14);
}

/* ─ 1. HERO ─ */
.hero {
  display:flex;
  align-items:flex-start;
  gap:24px;
  padding:32px 36px 28px;
  background:linear-gradient(135deg,#f8faff 0%,#eef3ff 100%);
  border-bottom:2px solid #e8eeff;
}
.hero-left { flex:1; }
.logo-row { display:flex; align-items:center; gap:14px; margin-bottom:8px; }
.logo-icon { font-size:38px; }
.logo-name { font-size:24px; font-weight:900; color:#0f172a; letter-spacing:-0.5px; }
.logo-accent { color:#2563eb; }
.logo-tag { font-size:11px; color:#64748b; font-weight:600; letter-spacing:1px; text-transform:uppercase; margin-top:3px; }

.hero-right { flex:1.4; }
.tax-badge {
  display:inline-block;
  background:linear-gradient(135deg,#1e3a8a,#2563eb);
  color:#fff;
  font-size:11px;
  font-weight:800;
  letter-spacing:3px;
  text-transform:uppercase;
  padding:6px 18px;
  border-radius:99px;
  margin-bottom:14px;
}
.meta-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px 20px; }
.meta-item {}
.meta-label { font-size:9px; font-weight:700; color:#94a3b8; text-transform:uppercase; letter-spacing:1px; margin-bottom:2px; }
.meta-value { font-size:12px; font-weight:700; color:#1e293b; }
.badge-paid { display:inline-block; background:#dcfce7; color:#166534; border:1px solid #bbf7d0; font-size:11px; font-weight:800; padding:3px 10px; border-radius:99px; }
.badge-pending { display:inline-block; background:#fef3c7; color:#92400e; border:1px solid #fde68a; font-size:11px; font-weight:800; padding:3px 10px; border-radius:99px; }
.badge-delivery { display:inline-block; font-size:10px; font-weight:800; padding:3px 10px; border-radius:99px; border:1px solid; }

.qr-block { display:flex; flex-direction:column; align-items:center; gap:6px; }
.qr-img { width:80px; height:80px; border:3px solid #e2e8f0; border-radius:12px; padding:4px; background:#fff; }
.qr-label { font-size:9px; color:#94a3b8; font-weight:600; text-align:center; letter-spacing:0.5px; }

/* ─ 2. INFO CARDS ─ */
.info-row { display:grid; grid-template-columns:1fr 1fr; gap:0; border-bottom:1px solid #f1f5f9; }
.info-card { padding:22px 28px; border-right:1px solid #f1f5f9; }
.info-card:last-child { border-right:none; }
.card-title { font-size:11px; font-weight:800; color:#2563eb; text-transform:uppercase; letter-spacing:1.5px; margin-bottom:12px; padding-bottom:8px; border-bottom:2px solid #dbeafe; }
.info-company { font-size:15px; font-weight:800; color:#0f172a; margin-bottom:10px; }
.info-line { display:flex; gap:10px; margin-bottom:6px; align-items:flex-start; }
.info-key { font-size:10px; font-weight:700; color:#94a3b8; text-transform:uppercase; letter-spacing:0.5px; min-width:58px; flex-shrink:0; padding-top:1px; }
.info-val { font-size:12px; color:#374151; font-weight:500; line-height:1.5; }

/* ─ 3. TABLE ─ */
.table-card { border-bottom:1px solid #f1f5f9; }
.prod-table { width:100%; border-collapse:collapse; margin-top:12px; }
.prod-table thead tr { background:linear-gradient(90deg,#0f172a,#1e3a8a); }
.prod-table thead th { color:rgba(255,255,255,0.7); font-size:9px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; padding:11px 14px; }
.th-sl { width:40px; text-align:center; }
.th-prod { text-align:left; }
.th-num { width:90px; text-align:right; }
.tr-even { background:#ffffff; }
.tr-odd  { background:#f8fafc; }
.tr-even:hover,.tr-odd:hover { background:#eff6ff; transition:background 0.15s; }
.td-sl { font-size:11px; color:#94a3b8; font-weight:700; text-align:center; padding:13px 8px; }
.td-prod { display:flex; align-items:center; gap:12px; padding:13px 14px; }
.prod-img-wrap { width:44px; height:44px; border-radius:10px; overflow:hidden; border:2px solid #e2e8f0; flex-shrink:0; background:#f8fafc; display:flex; align-items:center; justify-content:center; }
.prod-img { width:100%; height:100%; object-fit:cover; }
.prod-img-ph { font-size:22px; }
.prod-name { font-size:13px; font-weight:700; color:#1e293b; }
.prod-sku { font-size:10px; color:#94a3b8; margin-top:2px; font-weight:600; }
.td-num { font-size:12px; color:#475569; text-align:right; padding:13px 16px 13px 8px; }
.gst-cell { color:#2563eb; font-weight:700; }
.total-cell { color:#0f172a; font-weight:800; font-size:13px; }

/* ─ 4. SUMMARY + DELIVERY ─ */
.bottom-row { display:grid; grid-template-columns:1fr 1fr; gap:0; border-bottom:1px solid #f1f5f9; }
.delivery-card { padding:22px 28px; border-right:1px solid #f1f5f9; }
.dlv-info-line { display:flex; gap:10px; margin-bottom:8px; align-items:center; }
.timeline-label { font-size:10px; font-weight:700; color:#94a3b8; text-transform:uppercase; letter-spacing:1px; margin:16px 0 10px; }
.timeline { display:flex; align-items:center; gap:0; }
.tl-step { display:flex; flex-direction:column; align-items:center; position:relative; }
.tl-dot { font-size:13px; font-weight:900; width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; }
.tl-active { color:#2563eb; background:#dbeafe; border:2px solid #2563eb; font-size:11px; }
.tl-inactive { color:#cbd5e1; background:#f8fafc; border:2px solid #e2e8f0; font-size:11px; }
.tl-line { height:2px; width:28px; }
.tl-line-done { background:#2563eb; }
.tl-line-pending { background:#e2e8f0; }
.tl-name { font-size:8px; font-weight:600; text-align:center; margin-top:5px; max-width:50px; }
.tl-name-active { color:#2563eb; }
.tl-name-pending { color:#cbd5e1; }

.summary-card { padding:22px 28px; position:relative; overflow:hidden; background:#fafbff; }
.sum-line { display:flex; justify-content:space-between; font-size:13px; color:#475569; padding:7px 0; border-bottom:1px dashed #f1f5f9; }
.discount { color:#10b981; font-weight:700; }
.free { color:#10b981; font-weight:800; font-size:11px; background:#dcfce7; padding:2px 8px; border-radius:99px; }
.sum-divider { border:none; border-top:2px solid #e2e8f0; margin:10px 0; }
.grand-block {
  background:linear-gradient(135deg,#1e3a8a,#2563eb,#3b82f6);
  border-radius:14px;
  padding:16px 20px;
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:14px;
}
.grand-label { font-size:10px; font-weight:800; color:rgba(255,255,255,0.7); text-transform:uppercase; letter-spacing:2px; }
.grand-amount { font-size:22px; font-weight:900; color:#fff; }
.payment-info { background:#f1f5f9; border-radius:10px; padding:12px 14px; }
.pay-row { display:flex; justify-content:space-between; font-size:11px; color:#64748b; margin-bottom:5px; }
.pay-row:last-child { margin-bottom:0; }
.paid-watermark {
  position:absolute;
  top:50%; right:-10px;
  transform:translateY(-20%) rotate(-28deg);
  font-size:55px; font-weight:900;
  color:rgba(22,163,74,0.08);
  letter-spacing:5px;
  pointer-events:none; user-select:none;
}

/* ─ 5. TERMS ─ */
.terms-card { padding:22px 28px; background:#f8fafc; border-bottom:1px solid #f1f5f9; }
.terms-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:24px; }
.terms-heading { font-size:10px; font-weight:800; color:#2563eb; text-transform:uppercase; letter-spacing:1px; margin-bottom:10px; padding-bottom:6px; border-bottom:1.5px solid #dbeafe; }
.terms-text { font-size:11px; color:#64748b; margin-bottom:5px; line-height:1.6; }

/* ─ 6. FOOTER ─ */
.inv-footer {
  background:linear-gradient(135deg,#0f172a,#1e3a8a);
  padding:20px 36px;
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:20px;
}
.footer-brand { font-size:16px; font-weight:900; color:#fff; margin-bottom:3px; }
.footer-copy { font-size:10px; color:#475569; }
.social-row { display:flex; gap:8px; justify-content:center; margin-bottom:4px; }
.social-icon { font-size:16px; }
.footer-tagline { font-size:10px; color:#64748b; text-align:center; font-weight:600; letter-spacing:2px; }
.footer-thanks { font-size:13px; font-weight:800; color:#fbbf24; text-align:right; }
.footer-sub { font-size:10px; color:#64748b; text-align:right; margin-top:3px; }

@media print {
  body { background:#fff; }
  .inv-root { box-shadow:none; margin:0; border-radius:0; }
  * { print-color-adjust:exact; -webkit-print-color-adjust:exact; }
}
`;
