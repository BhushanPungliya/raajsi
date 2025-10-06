"use client";

export default function TermsConditions() {
  return (
    <>
      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding-top: 120px;
          padding-bottom: 80px;
          font-family: Avenir, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        
        .header {
          text-align: center;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 1px solid #eee;
        }
        
        .title {
          font-family: 'Rose Velt Personal Use Only', serif;
          color: #4C0A2E;
          font-size: 2rem;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .subtitle {
          font-size: 1rem;
          color: #666;
          margin: 10px 0 0 0;
        }
        
        .section {
          margin-bottom: 30px;
        }
        
        .section-title {
          font-family: 'Rose Velt Personal Use Only', serif;
          color: #4C0A2E;
          font-size: 1.3rem;
          margin: 0 0 15px 0;
          text-transform: uppercase;
        }
        
        .content ol {
          margin: 15px 0;
          padding-left: 20px;
        }
        
        .content ul {
          margin: 15px 0;
          padding-left: 20px;
        }
        
        .content li {
          margin-bottom: 10px;
          font-size: 0.95rem;
        }
        
        @media (max-width: 768px) {
          .container {
            padding-top:100px;
            padding-bottom: 40px;
          }

          .section-title {
            font-family: 'Rose Velt Personal Use Only', serif;
            color: #4C0A2E!important;
            font-size: 1.3rem;
            text-shadow: none!important;
            margin: 0 0 15px 0;
            text-transform: uppercase;
          }
          
          .title {
            font-size: 1.5rem;
          }
          
          .section-title {
            font-size: 1.1rem;
          }
          
          .content {
            font-size: 0.9rem;
          }
        }
        
        @media (max-width: 480px) {
          .container {
            padding-left: 15px;
            padding-right: 15px;
            padding-top: 90px;
            margin: 0 auto;
          }
          
          .title {
            font-size: 1.3rem;
            line-height: 1.3;
            margin-bottom: 10px;
          }
          
          .subtitle {
            font-size: 0.9rem;
            line-height: 1.4;
          }
          
          .section {
            margin-bottom: 25px;
          }
          
          .section-title {
            font-size: 1rem;
            margin-bottom: 12px;
            line-height: 1.3;
          }
          
          .content {
            font-size: 0.85rem;
            line-height: 1.5;
            margin-bottom: 15px;
          }
          
          .content ol,
          .content ul {
            padding-left: 18px;
            margin: 12px 0;
          }
          
          .content li {
            margin-bottom: 8px;
            font-size: 0.85rem;
            line-height: 1.5;
          }
          
          .header {
            margin-bottom: 30px;
            padding-bottom: 15px;
          }
        }
      `}</style>

      <div className="container">
        <div className="header">
          <h1 className="title">Terms And Conditions</h1>
          <p className="subtitle">Please read these terms carefully before using our services.</p>
        </div>
        
        <div className="section">
          <h2 className="section-title">Terms of Use</h2>
          <p className="content">
            Welcome to Raajsi. By accessing or using our website, you agree to the following terms:
          </p>
          <ol className="content">
            <li>All product images, descriptions, and content are for informational purposes and may vary slightly in appearance.</li>
            <li>Although our products are crafted using natural, ayurvedic ingredients, we recommend conducting a patch test before use, as individual skin responses may vary.</li>
            <li>We reserve the right to update prices, policies, and product offerings without prior notice.</li>
            <li>Orders are confirmed only upon successful payment and availability.</li>
            <li>Raajsi retains ownership of this website&rsquo;s content, trademarks, and intellectual property.</li>
          </ol>
          <p className="content">
            Your use of our platform implies your acceptance of these terms. For questions or clarifications, feel free to contact us.
          </p>
          <p className="content" style={{fontStyle: 'italic', textAlign: 'center', marginTop: '20px'}}>
            &ldquo;Grace begins with clarity.&rdquo;
          </p>
        </div>
        
        <div className="section">
          <h2 className="section-title">Returns And Refund Policy</h2>
          <p className="content">
            We hope every Raajsi ritual brings you joy. But in the rare case that something doesn&rsquo;t feel right, we&rsquo;re here to make it better.
          </p>
          <ul className="content">
            <li>Returns are accepted within 7 days of delivery for unused, sealed products in their original packaging.</li>
            <li>For damaged or incorrect items, please contact us within 48 hours of delivery along with clear photographs.</li>
            <li>All returns, including faulty or damaged items, must be initiated within 15 days of receiving your order.</li>
            <li>Opened, used, or tampered products cannot be returned due to hygiene and safety standards.</li>
            <li>Returns will not be accepted if packaging, labels, or included gift/sample items are missing.</li>
            <li>If your order included a gift or sample, please return it along with the product.</li>
          </ul>
        </div>
        
        <div className="section">
          <h2 className="section-title">Refund Process</h2>
          <ul className="content">
            <li>Once your return is approved, the refund will be processed within 7–10 working days.</li>
            <li>For card payments, refunds will be made to the same debit/credit card.</li>
            <li>For Cash on Delivery (COD) orders, we&rsquo;ll reach out via email to collect your bank details and process the refund via bank transfer within 24–48 business hours of receiving the product. Funds may take 4–5 additional business days to reflect in your account.</li>
          </ul>
          <p className="content">
            We&rsquo;re committed to offering you the best in self-grooming and wellness. If you feel we&rsquo;ve missed the mark, let us know — we&rsquo;ll do our best to make it right. Write to us at Info@phyinternational.com for return initiation.
          </p>
          <p className="content" style={{fontStyle: 'italic', textAlign: 'center', marginTop: '30px', fontSize: '1.1rem'}}>
            &ldquo;Your satisfaction is part of our royal promise.&rdquo;
          </p>
        </div>
      </div>
    </>
  );
}