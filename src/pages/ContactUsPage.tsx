// src/pages/ContactUsPage.tsx
import React, { useState, FormEvent } from 'react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { Phone, Mail, MapPin, Send, Loader2 } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa'; // Using react-icons for WhatsApp
import { Facebook, Instagram } from 'lucide-react'; // Using Lucide for these
import { SiTiktok } from 'react-icons/si'; // Using react-icons for TikTok

// Re-define social links here or import from a shared location if needed elsewhere
const socialLinks = [
  { name: 'Instagram', url: 'https://www.instagram.com/classy.collectionhub', icon: Instagram, colorClass: 'text-pink-600', hoverColorClass: 'hover:text-pink-500' },
  { name: 'TikTok', url: 'https://www.tiktok.com/@classycollection.hub', icon: SiTiktok, colorClass: 'text-black dark:text-white', hoverColorClass: 'hover:text-gray-600 dark:hover:text-gray-400' },
  { name: 'Facebook', url: 'https://www.facebook.com/ClassyCollectionHub.ke', icon: Facebook, colorClass: 'text-blue-600', hoverColorClass: 'hover:text-blue-500' },
];

const ContactUsPage: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
        toast.error('Please fill in all fields.');
        return;
    }
    setIsSubmitting(true);
    setSubmitStatus('idle');
    const toastId = toast.loading('Sending message...');

    // ** Simulate API Call **
    // Replace this with your actual API call to a backend endpoint
    // that handles form submissions (e.g., using Nodemailer or another service)
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
    // ------------------------

    // Example success/error handling
    const success = Math.random() > 0.2; // Simulate success/failure randomly for demo
    if (success) {
        toast.success('Message sent successfully!', { id: toastId });
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' }); // Clear form
    } else {
        toast.error('Failed to send message. Please try again.', { id: toastId });
        setSubmitStatus('error');
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | ClassyCollectionHubKE</title>
        <meta name="description" content="Get in touch with ClassyCollectionHubKE. Contact us via phone, WhatsApp, email, or our contact form." />
      </Helmet>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">Get In Touch</h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions or need assistance? We're here to help!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 md:gap-16">
          {/* Contact Info Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Information</h2>
            <div className="flex items-start space-x-4">
              <MapPin className="h-6 w-6 text-teal-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-gray-800">Location</h3>
                <p className="text-gray-600">Nairobi, Kenya (Online Store)</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Phone className="h-6 w-6 text-teal-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-gray-800">Phone / WhatsApp</h3>
                <a href="tel:+254736082053" className="text-gray-600 hover:text-teal-700 hover:underline">+254 736 082 053</a> <br/>
                 <a href="https://wa.me/254736082053" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-green-600 hover:text-green-700 hover:underline text-sm">
                     <FaWhatsapp className="mr-1"/> Chat on WhatsApp
                 </a>
              </div>
            </div>
             <div className="flex items-start space-x-4">
               <Mail className="h-6 w-6 text-teal-600 mt-1 flex-shrink-0" />
               <div>
                 <h3 className="font-medium text-gray-800">Email</h3>
                 {/* Replace with your actual email */}
                 <a href="mailto:info@classycollectionhub.co.ke" className="text-gray-600 hover:text-teal-700 hover:underline">info@classycollectionhub.co.ke</a>
               </div>
             </div>

             {/* Social Links */}
             <div className="pt-4">
                 <h3 className="font-medium text-gray-800 mb-3">Follow Us</h3>
                 <div className="flex space-x-4">
                    {socialLinks.map((link) => (
                      <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.name} className="transition-opacity duration-200 hover:opacity-80">
                        <link.icon className={`h-6 w-6 ${link.colorClass} ${link.hoverColorClass} transition-colors duration-200`} />
                      </a>
                    ))}
                  </div>
             </div>
          </div>

          {/* Contact Form Section */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-5">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input type="text" id="name" name="name" required value={formData.name} onChange={handleInputChange} className="form-input" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                <input type="email" id="email" name="email" required value={formData.email} onChange={handleInputChange} className="form-input" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                <textarea id="message" name="message" rows={5} required value={formData.message} onChange={handleInputChange} className="form-textarea"></textarea>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-70 btn-click-effect"
                >
                  {isSubmitting ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : <Send className="h-5 w-5 mr-2"/>}
                  Send Message
                </button>
              </div>
              {submitStatus === 'success' && <p className="text-sm text-green-600 text-center">Thank you! Your message has been sent.</p>}
              {submitStatus === 'error' && <p className="text-sm text-red-600 text-center">Something went wrong. Please try again.</p>}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactUsPage;