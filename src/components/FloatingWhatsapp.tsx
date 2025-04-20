// src/components/FloatingWhatsApp.tsx
import React from 'react';
import { FaWhatsapp } from 'react-icons/fa'; // Using Font Awesome WhatsApp icon

const FloatingWhatsApp: React.FC = () => {
    // Replace with your full WhatsApp number including country code, without '+' or spaces
    const whatsappNumber = "254736082053";
    const whatsappLink = `https://wa.me/${whatsappNumber}`;

    return (
        <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with us on WhatsApp"
            title="Chat on WhatsApp"
            className="fixed bottom-5 right-5 z-40 bg-green-500 text-white p-3.5 rounded-full shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 ease-in-out hover:scale-110 btn-click-effect"
        >
            <FaWhatsapp className="h-7 w-7" />
        </a>
    );
};

export default FloatingWhatsApp;