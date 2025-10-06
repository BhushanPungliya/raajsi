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
          <p className="subtitle">Last Updated: October 10, 2025</p>
        </div>

        <div className="section">
          <p className="subtitle">Welcome to Raajsi, where ancient Ayurveda meets modern care.</p>
          <p className="subtitle">By accessing or using our website (www.raajsi.in) and services, you agree to be bound by the following terms and conditions. Please read them carefully before making a purchase or using our platform.</p>
          <h2 className="section-title py-[20px]">1. General</h2>
          <p className="content pb-[14px]">The website www.raajsi.in is owned and operated by Raajsi (referred to as “we”, “our”, “us”).</p>
          <p className="content pb-[14px]">By visiting or purchasing from our website, you engage in our “Service” and agree to be bound by these Terms and Conditions, our Privacy Policy, and Refund Policy.</p>
          <p className="content pb-[14px]">We reserve the right to update or modify these terms at any time without prior notice. Your continued use of the website constitutes acceptance of those changes.</p>
        </div>

        <div className="section">
          <h2 className="section-title">2. Products and Descriptions</h2>
          <p className="content pb-[14px]">
            All product descriptions, images, and information are provided for general informational purposes and may vary slightly due to lighting, screen display, or packaging updates.
          </p>
          <p className="content pb-[14px]">
            While our products are made using natural, ayurvedic ingredients, we recommend conducting a patch test before use. Raajsi will not be liable for any allergic reactions or side effects that may occur.
          </p>
        </div>

        <div className="section">
          <h2 className="section-title">3. Pricing and Payment</h2>
          <p className="content pb-[14px]">
            All prices listed on the website are in Indian Rupees (INR) and are inclusive of applicable taxes, unless stated otherwise.
          </p>
          <p className="content pb-[14px]">
            We reserve the right to modify prices, offers, and discounts without prior notice.
          </p>
          <p className="content pb-[14px]">
            Orders are confirmed only after successful payment and product availability.
          </p>
          <p className="content pb-[14px]">
            Payment gateways like Razorpay are used for secure transactions. We do not store your payment details.
          </p>
        </div>
        <div className="section">
          <h2 className="section-title">4. Shipping and Delivery</h2>
          <p className="content pb-[14px]">
            Orders are processed within 2–5 working days and shipped through trusted courier partners.
          </p>
          <p className="content pb-[14px]">
            Delivery timelines may vary depending on your location.
          </p>
          <p className="content pb-[14px]">
            Raajsi is not responsible for delays caused by courier agencies, weather conditions, or other external factors beyond our control.
          </p>
        </div>
        <div className="section">
          <h2 className="section-title">5. Returns, Replacements, and Refunds</h2>
          <p className="content pb-[14px]">
            Please refer to our detailed Returns & Refund Policy section below:
          </p>
          <p className="content pb-[14px]">
            Returns are accepted within 7 days of delivery for unused, sealed products in their original packaging.
          </p>
          <p className="content pb-[14px]">
            For damaged or incorrect items, please contact us within 48 hours of delivery with clear photos.
          </p>
          <p className="content pb-[14px]">
            Opened or used products cannot be returned due to hygiene reasons.
          </p>
          <p className="content pb-[14px]">
            Refunds (if applicable) will be processed within 7–10 business days after inspection and approval.
          </p>
          <p className="content pb-[14px]">
            For all return or refund requests, please write to us at info@raajsi.in.
          </p>
        </div>
        <div className="section">
          <h2 className="section-title">6. Cancellations</h2>
          <p className="content pb-[14px]">
            Orders can be cancelled only before dispatch. Once shipped, cancellations are not possible.
          </p>
          <p className="content pb-[14px]">
            Refunds for cancelled orders will be processed within 5–7 business days to the original payment method.
          </p>
        </div>
        <div className="section">
          <h2 className="section-title">7. Limitation of Liability</h2>
          <p className="content pb-[14px]">
            Raajsi shall not be held liable for any indirect, incidental, or consequential damages arising from the use or inability to use our products or website.
          </p>
          <p className="content pb-[14px]">
            Product effectiveness may vary from person to person; results are not guaranteed.
          </p>
        </div>
        <div className="section">
          <h2 className="section-title">8. Contact Us</h2>
          <p className="content pb-[14px]">
            For any queries, suggestions, or complaints, please contact info@raajsi.in
          </p>
        </div>
      </div>
    </>
  );
}