// src/pages/TermsOfServicePage.tsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react'; // Example icon

const TermsOfServicePage: React.FC = () => {
    const effectiveDate = "April 17, 2025"; // ** CHANGE THIS DATE **
    const companyName = "ClassyCollectionHubKE";
    const websiteUrl = "https://www.classycollectionhub.co.ke"; // ** CHANGE THIS if needed **
    const contactEmail = "info@classycollectionhub.co.ke"; // ** CHANGE THIS EMAIL **
    const governingLaw = "Kenya"; // ** CONFIRM this **

    return (
        <>
        <Helmet>
            <title>Terms of Service | {companyName}</title>
            <meta name="description" content={`Terms of Service for ${companyName}. Review the terms and conditions for using our website and services.`} />
        </Helmet>

        <div className="bg-gray-50 py-12 md:py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white p-8 md:p-10 rounded-lg shadow-lg">
            <div className="text-center mb-8 border-b border-gray-200 pb-6">
                 <FileText className="h-12 w-12 mx-auto text-teal-600 mb-4" />
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Terms of Service</h1>
                <p className="mt-2 text-sm text-gray-500">Effective Date: {effectiveDate}</p>
            </div>

            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                <p>Welcome to {companyName}! These Terms of Service ("Terms") govern your access to and use of the {companyName} website, located at {websiteUrl} (the "Site"), and any services offered through the Site (collectively, the "Services"). Please read these Terms carefully before using the Site or Services.</p>
                <p>By accessing or using the Site or Services, you agree to be bound by these Terms and our <Link to="/privacy-policy" className="text-teal-600 hover:underline">Privacy Policy</Link>. If you do not agree to all of these Terms, do not use the Site or Services.</p>

                <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">1. Use of the Site</h2>
                <p><strong>Eligibility:</strong> You must be at least 18 years old to use our Services and place orders.</p>
                <p><strong>Account Responsibility:</strong> If you use our website, you are responsible for maintaining the confidentiality of your information and  all activities that occur under your account.</p>
                <p><strong>Prohibited Conduct:</strong> You agree not to use the Site for any unlawful purpose or any purpose prohibited under this clause. You agree not to use the Site in any way that could damage the Site, Services, or general business of {companyName}. Prohibited uses include, but are not limited to: harassing others, violating intellectual property rights, spamming, attempting to gain unauthorized access, or interfering with the Site's security features.</p>

                <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">2. Products and Orders</h2>
                <p><strong>Product Descriptions:</strong> We strive to be as accurate as possible in the descriptions of our products. However, we do not warrant that product descriptions or other content on the Site are accurate, complete, reliable, current, or error-free.</p>
                <p><strong>Pricing:</strong> All prices are listed in Kenyan Shillings (KES). We reserve the right to change prices for products displayed on the Site at any time and to correct pricing errors that may inadvertently occur. Prices do not include delivery costs, which will be added to the total amount due.</p>
                <p><strong>Order Acceptance:</strong> We reserve the right to refuse or cancel any order for any reason, including limitations on quantities available, inaccuracies or errors in product or pricing information, or problems identified by our credit and fraud avoidance department. We will contact you if all or any portion of your order is canceled or if additional information is required to accept your order.</p>
                <p><strong>Payment:</strong> Payment must be made through our designated payment gateway (Pesapal). By providing payment information, you represent and warrant that you are authorized to use the designated payment method.</p>
                <p><strong>Shipping and Delivery:</strong> We will arrange for shipment of the products to you according to the delivery option you select. Shipping and delivery dates are estimates only and cannot be guaranteed. We are not liable for any delays in shipments. Risk of loss and title for items purchased pass to you upon our delivery to the carrier. Currently, we deliver within {governingLaw}.</p>

                <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">3. Intellectual Property</h2>
                <p>All content included on the Site, such as text, graphics, logos, images, as well as the compilation thereof, and any software used on the Site, is the property of {companyName} or its suppliers and protected by copyright and other laws. You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the Service, use of the Service, or access to the Service without express written permission by us.</p>

                {/* Optional: Add section on User Content (reviews, comments) if applicable */}

                <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">4. Disclaimers</h2>
                <p>THE SITE AND SERVICES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. {companyName} MAKES NO REPRESENTATIONS OR WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, AS TO THE OPERATION OF THE SITE OR THE INFORMATION, CONTENT, MATERIALS, OR PRODUCTS INCLUDED ON THE SITE. TO THE FULL EXTENT PERMISSIBLE BY APPLICABLE LAW, {companyName} DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE. {companyName} DOES NOT WARRANT THAT THE SITE, ITS SERVERS, OR E-MAIL SENT FROM {companyName} ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.</p>

                <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">5. Limitation of Liability</h2>
                <p>TO THE FULL EXTENT PERMISSIBLE BY APPLICABLE LAW, {companyName} WILL NOT BE LIABLE FOR ANY DAMAGES OF ANY KIND ARISING FROM THE USE OF THIS SITE OR FROM ANY INFORMATION, CONTENT, MATERIALS, PRODUCTS OR SERVICES INCLUDED ON OR OTHERWISE MADE AVAILABLE TO YOU THROUGH THIS SITE, INCLUDING, BUT NOT LIMITED TO DIRECT, INDIRECT, INCIDENTAL, PUNITIVE, AND CONSEQUENTIAL DAMAGES, UNLESS OTHERWISE SPECIFIED IN WRITING.</p>

                 <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">6. Indemnification</h2>
                 <p>You agree to indemnify, defend, and hold harmless {companyName}, its officers, directors, employees, agents, and third parties, for any losses, costs, liabilities, and expenses (including reasonable attorney’s fees) relating to or arising out of your use of or inability to use the Site or Services, your violation of any terms of this Agreement or your violation of any rights of a third party, or your violation of any applicable laws, rules or regulations.</p>

                <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">7. Governing Law</h2>
                <p>These Terms shall be governed by and construed in accordance with the laws of {governingLaw}, without regard to its conflict of law principles.</p>

                {/* Optional: Add Dispute Resolution section */}
                {/* <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">8. Dispute Resolution</h2> <p>Any disputes arising out of or relating to these Terms or the Services shall be resolved through amicable negotiation. If negotiation fails, disputes shall be submitted to the competent courts of [City, Kenya].</p> */}

                <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">8. Changes to Terms</h2>
                <p>We reserve the right, in our sole discretion, to change these Terms at any time. We will post the revised Terms on the Site and update the "Effective Date" top. Your continued use of the Site after such changes constitutes your acceptance of the new Terms.</p>

                <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">9. Contact Information</h2>
                <p>Questions about the Terms of Service should be sent to us at <a href={`mailto:${contactEmail}`} className="text-teal-600 hover:underline">{contactEmail}</a>.</p>
            </div>
            </div>
        </div>
        </>
    );
};

export default TermsOfServicePage;