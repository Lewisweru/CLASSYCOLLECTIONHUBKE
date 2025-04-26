// src/pages/PrivacyPolicyPage.tsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ShieldCheck } from 'lucide-react'; // Example icon

const PrivacyPolicyPage: React.FC = () => {
  const effectiveDate = "April 17, 2025"; // ** CHANGE THIS DATE **
  const companyName = "ClassyCollectionHubKE";
  const contactEmail = "classycollectionhubh@gmail.com"; // ** CHANGE THIS EMAIL **
  const websiteUrl = "https://www.classycollectionhub.co.ke"; // ** CHANGE THIS if needed **

  return (
    <>
      <Helmet>
        <title>Privacy Policy | {companyName}</title>
        <meta name="description" content={`Privacy Policy for ${companyName}. Learn how we collect, use, and protect your personal information.`} />
      </Helmet>

      <div className="bg-gray-50 py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white p-8 md:p-10 rounded-lg shadow-lg">
          <div className="text-center mb-8 border-b border-gray-200 pb-6">
             <ShieldCheck className="h-12 w-12 mx-auto text-teal-600 mb-4" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Privacy Policy</h1>
            <p className="mt-2 text-sm text-gray-500">Last Updated: {effectiveDate}</p>
          </div>

          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            <p>Welcome to {companyName}! We are committed to protecting your privacy and handling your personal data transparently and securely. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website ({websiteUrl}) and purchase products from us.</p>
            <p>Please read this policy carefully. By using our Site, you agree to the collection and use of information in accordance with this policy.</p>

            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">1. Information We Collect</h2>
            <p>We may collect information about you in various ways. The information we may collect on the Site includes:</p>
            <ul>
              <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, telephone number, that you voluntarily give to us when you register with the Site or when you choose to participate in various activities related to the Site, such as online chat and message boards, and placing orders.</li>
              <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, browser type, operating system, access times, and the pages you have viewed directly before and after accessing the Site.</li>
              <li><strong>Financial Data:</strong> We do not directly collect or store full payment card details. Financial data related to your payment method (e.g., M-Pesa details, partial card numbers) is collected and processed by our third-party payment processors (e.g., Pesapal). We may receive transaction identifiers and summaries from them. Please review their privacy policies.</li>
              <li><strong>Mobile Device Data:</strong> Device information, such as your mobile device ID, model, and manufacturer, and information about the location of your device, if you access the Site from a mobile device.</li>
              <li><strong>Order Information:</strong> Details about the products you purchase, order history, and delivery preferences.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">2. How We Use Your Information</h2>
            <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:</p>
            <ul>
              <li>Process your orders and manage your account.</li>
              <li>Deliver products and services you requested.</li>
              <li>Email you regarding your account or order.</li>
              <li>Send you newsletters, promotions, and information about products, services, and events (you can opt-out at any time).</li>
              <li>Improve our website, products, and services.</li>
              <li>Monitor and analyze usage and trends to improve your experience with the Site.</li>
              <li>Prevent fraudulent transactions, monitor against theft, and protect against criminal activity.</li>
              <li>Comply with legal and regulatory requirements.</li>
              <li>Request feedback and contact you about your use of the Site.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">3. Disclosure of Your Information</h2>
            <p>We may share information we have collected about you in certain situations. Your information may be disclosed as follows:</p>
            <ul>
              <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.</li>
              <li><strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including payment processing (Pesapal), data analysis, email delivery, hosting services, customer service, and marketing assistance, and shipping/delivery partners.</li>
              <li><strong>Business Transfers:</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
              <li><strong>With your Consent:</strong> We may disclose your personal information for any other purpose with your consent.</li>
            </ul>
            <p>We do not sell your personal information to third parties.</p>

             <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">4. Cookies and Tracking Technologies</h2>
             <p>We may use cookies, web beacons, tracking pixels, and other tracking technologies on the Site to help customize the Site and improve your experience. When you access the Site, your personal information is not collected through the use of tracking technology. Most browsers are set to accept cookies by default. You can usually choose to set your browser to remove or reject cookies, but be aware that such action could affect the availability and functionality of the Site.</p>

            <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">5. Security of Your Information</h2>
            <p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.</p>

             <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">6. Data Retention</h2>
             <p>We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy, including for the purposes of satisfying any legal, accounting, or reporting requirements.</p>

             <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">7. Your Data Protection Rights</h2>
            <p>Depending on your location and applicable law (such as the Kenyan Data Protection Act, 2019), you may have rights regarding your personal data, including the right to access, correct, delete, or restrict the processing of your data. To exercise these rights, please contact us using the information below.</p>

            <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">8. Policy for Children</h2>
            <p>We do not knowingly solicit information from or market to children under the age of 18. If you become aware of any data we have collected from children under age 18, please contact us using the contact information provided below.</p>

            <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">9. Changes to This Privacy Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.</p>

            <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">10. Contact Us</h2>
            <p>If you have questions or comments about this Privacy Policy, please contact us at:</p>
            <p>
                {companyName}<br />
                Email: <a href={`mailto:${contactEmail}`} className="text-teal-600 hover:underline">{contactEmail}</a><br />
                {/* Add Phone/Address if applicable */}
                {/* Phone: [Your Phone Number] <br /> */}
                {/* Address: [Your Physical Address, if any] */}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicyPage;