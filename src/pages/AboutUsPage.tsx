// src/pages/AboutUsPage.tsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Sparkles, Home, Shirt, Gift } from 'lucide-react';

const AboutUsPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>About Us | ClassyCollectionHubKE</title>
        <meta name="description" content="Learn more about ClassyCollectionHubKE - your destination for quality home essentials, stylish apparel, and thoughtful gifts in Kenya." />
      </Helmet>
      <div className="bg-gradient-to-b from-teal-50 via-white to-white py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12 md:mb-16">
            <Sparkles className="h-12 w-12 mx-auto text-teal-500 mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              About ClassyCollectionHubKE
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Classy Choices, Affordable Styles! Your go-to source for enhancing your lifestyle in Kenya.
            </p>
          </div>

          {/* Our Mission/Story */}
          <div className="bg-white p-8 rounded-lg shadow-lg mb-10 md:mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Story</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              ClassyCollectionHubKE was born from a desire to bring high-quality, stylish, and practical products to homes across Kenya without the premium price tag. We believe that everyone deserves to live in a comfortable and beautiful space, and express themselves with confidence.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We carefully curate our collection, focusing on modern home essentials that blend functionality with aesthetics, chic apparel & accessories for every occasion, and unique gift ideas that show you care. From cozy bedding to elegant kitchenware and comfortable fashion, we strive to offer items that elevate your everyday life.
            </p>
          </div>

          {/* What We Offer */}
          <div className="grid md:grid-cols-3 gap-8 mb-10 md:mb-12 text-center">
            <div className="bg-white p-6 rounded-lg shadow">
              <Home className="h-10 w-10 mx-auto text-teal-600 mb-3" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Home & Living</h3>
              <p className="text-sm text-gray-600">Quality essentials for comfortable and stylish living spaces.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <Shirt className="h-10 w-10 mx-auto text-pink-500 mb-3" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Apparel & More</h3>
              <p className="text-sm text-gray-600">Fashionable and comfortable pieces for your wardrobe.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <Gift className="h-10 w-10 mx-auto text-purple-500 mb-3" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Gifts & Specials</h3>
              <p className="text-sm text-gray-600">Thoughtfully selected items for every special occasion.</p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <p className="text-gray-700 mb-6">
              We're committed to providing excellent customer service and reliable delivery across Kenya. Explore our collections today!
            </p>
            <Link
              to="/shop"
              className="inline-block bg-teal-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors text-lg"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutUsPage;