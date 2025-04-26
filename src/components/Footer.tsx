// src/components/Footer.tsx
import { Link } from 'react-router-dom';
import { Facebook, Instagram } from 'lucide-react';
import { SiTiktok } from 'react-icons/si';

const socialLinks = [ /* ... social links ... */
    { name: 'Instagram', url: 'https://www.instagram.com/classy.collectionhub', icon: Instagram, ariaLabel: 'Follow ClassyCollectionHub on Instagram', colorClass: 'text-pink-600', hoverColorClass: 'hover:text-pink-500' }, { name: 'TikTok', url: 'https://www.tiktok.com/@classycollection.hub', icon: SiTiktok, ariaLabel: 'Follow ClassyCollectionHub on TikTok', colorClass: 'text-black dark:text-white', hoverColorClass: 'hover:text-gray-600 dark:hover:text-gray-400' }, { name: 'Facebook', url: 'https://www.facebook.com/ClassyCollectionHub.ke', icon: Facebook, ariaLabel: 'Visit ClassyCollectionHub on Facebook', colorClass: 'text-blue-600', hoverColorClass: 'hover:text-blue-500' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-gray-400 mt-16 overflow-hidden"> {/* Added overflow-hidden */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">

          {/* About & Social Section */}
          <div className="md:col-span-2"> {/* ... content ... */}
            <h3 className="text-lg font-semibold text-white mb-4">ClassyCollectionHub</h3> <p className="text-sm mb-5 leading-relaxed"> Your destination for quality home essentials, stylish apparel, and thoughtful gifts delivered across Kenya. </p> <div className="flex space-x-5"> {socialLinks.map((link) => ( <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.ariaLabel} className="transition-opacity duration-200 hover:opacity-80"> <link.icon className={`h-6 w-6 ${link.colorClass} ${link.hoverColorClass} transition-colors duration-200`} /> </a> ))} </div>
          </div>

          
          <div> 
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3> <ul className="space-y-2 text-sm"> <li><Link to="/" className="hover:text-white hover:underline">Home</Link></li> <li><Link to="/cart" className="hover:text-white hover:underline">Cart</Link></li> <li><Link to="/saved-items" className="hover:text-white hover:underline">Saved Items</Link></li> <li><Link to="/terms-of-service" className="hover:text-white hover:underline">Terms of Service</Link></li> <li><Link to="/privacy-policy" className="hover:text-white hover:underline">Privacy Policy</Link></li> </ul>
           </div>

          {/* Contact/Newsletter */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Stay Connected</h3>
             <p className="text-sm mb-3">Subscribe for updates & deals.</p>
             {/* --- Form --- */}
             {/* Apply similar responsive fixes: flex-wrap, min-width-0 */}
             <form className="flex flex-wrap sm:flex-nowrap gap-2">
                <label htmlFor="footer-newsletter-email" className="sr-only">Email address</label>
                <input
                    id="footer-newsletter-email"
                    type="email"
                    placeholder="Your email address"
                    aria-label="Email for newsletter"
                    required
                    // Added min-w-0
                    className="flex-grow sm:flex-1 min-w-0 px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-sm w-full sm:w-auto" />
                <button
                    type="submit"
                    // Added flex-shrink-0
                    className="w-full sm:w-auto flex-shrink-0 bg-teal-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-800 btn-click-effect"
                >
                    Subscribe
                </button>
             </form>
             {/* --- End Form --- */}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8 text-center text-sm">
          <p>© {currentYear} ClassyCollectionHubKE. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}