// src/components/Newsletter.tsx
import React from 'react';
import { Send } from 'lucide-react';

export default function Newsletter() {
  return (
    <section className="bg-teal-600 py-16 overflow-hidden"> {/* Added overflow-hidden to section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Join Our Newsletter
          </h2>
          <p className="text-teal-100 mb-8 max-w-2xl mx-auto">
            Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
          </p>
          {/* --- Form --- */}
          {/* Removed fixed max-width, let container handle it. Added flex-wrap */}
          <form className="w-full sm:max-w-md mx-auto flex flex-wrap sm:flex-nowrap gap-2 sm:gap-4 justify-center">
            <label htmlFor="newsletter-email" className="sr-only">Email address</label> {/* Added label for accessibility */}
            <input
              id="newsletter-email"
              type="email"
              placeholder="Enter your email"
              required // Added required
              // Adjusted padding/sizing for smaller screens, ensured min-width is 0 to allow shrinking
              className="flex-grow sm:flex-1 min-w-0 px-4 py-2.5 sm:py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300 text-sm w-full sm:w-auto"
            />
            <button
              type="submit"
              // Adjusted padding/sizing, allow shrinking on mobile
              className="w-full sm:w-auto bg-white text-teal-600 px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium hover:bg-teal-50 transition-colors flex items-center justify-center gap-2 flex-shrink-0"
            >
              <span>Subscribe</span>
              <Send className="h-4 w-4" />
            </button>
          </form>
          {/* --- End Form --- */}
        </div>
      </div>
    </section>
  );
}