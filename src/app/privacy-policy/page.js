"use client";

export default function PrivacyPolicy() {
  return (
    <>
      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding-top: 120px;
          padding-bottom: 40px;
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
        
        .content {
          font-size: 0.95rem;
          margin-bottom: 15px;
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
          
          .header {
            margin-bottom: 30px;
            padding-bottom: 15px;
          }
        }
      `}</style>

      <div className="container">
        <div className="header">
          <h1 className="title">Privacy Policy</h1>
          <p className="subtitle">Because trust is the most timeless luxury.</p>
        </div>
        
        <div className="section">
          <h2 className="section-title">Privacy Commitment</h2>
          <p className="content">
            At Raajsi, your privacy is our royal priority. We are committed to safeguarding your personal information with utmost integrity and discretion.
          </p>
          <p className="content">
            We collect only the information necessary to process your orders, improve your experience, and communicate updates, with your consent. Your data will never be sold, traded, or disclosed without your permission, unless required by law.
          </p>
        </div>
        
        <div className="section">
          <h2 className="section-title">Security and Support</h2>
          <p className="content">
            All transactions are encrypted and secure. For any questions or requests regarding your data, please contact our support team.
          </p>
          <p className="content" style={{fontStyle: 'italic', textAlign: 'center', marginTop: '30px', fontSize: '1.1rem'}}>
            &ldquo;Because trust is the most timeless luxury.&rdquo;
          </p>
        </div>
      </div>
    </>
  );
}