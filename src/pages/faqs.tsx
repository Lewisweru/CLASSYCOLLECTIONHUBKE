import React from "react";
import { Accordion, AccordionItem } from "@radix-ui/react-accordion";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "What products do you sell?",
    answer:
      "We offer a curated selection of affordable and stylish items, including women's handbags, shoes, household items, kitchenware, drinkware, and more. Our collections are regularly updated to bring you the latest trends.",
  },
  {
    question: "How can I place an order?",
    answer:
      "You can place an order by browsing our products on our social media pages and contacting us directly via call or WhatsApp at 0736082053. Our team will assist you with product availability, pricing, and delivery arrangements.",
  },
  {
    question: "Do you offer countrywide delivery?",
    answer:
      "Yes, we deliver across Kenya using your preferred courier service. Delivery charges vary based on your location and the courier's rates.",
  },
  {
    question: "How can I contact you for inquiries?",
    answer:
      "You can reach us via Phone/WhatsApp at 0736082053, on Facebook at Classy Collection Hub, or on Instagram @classy.collectionhub. We're available to assist you with any questions or concerns.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We primarily accept payments via M-Pesa, Airtel Money and Visa. Payment details will be provided upon order confirmation.",
  },
  {
    question: "Do you offer returns or exchanges?",
    answer:
      "We handle returns and exchanges on a case-by-case basis. Please contact us within 48 hours of receiving your order if you have any issues.",
  },
  {
    question: "Are your products new or second-hand?",
    answer:
      "All our products are brand new and sourced to ensure quality and affordability.",
  },
  {
    question: "Do you have a physical store?",
    answer:
      "Currently, we operate exclusively online. This allows us to offer you a wide range of products at competitive prices.",
  },
];

const Faqs = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-10">Frequently Asked Questions</h1>
      <Accordion type="single" collapsible className="space-y-4">
        {faqs.map((faq, index) => (
          <AccordionItem
            key={index}
            value={`faq-${index}`}
            className="border-b border-gray-200 pb-4"
          >
            <motion.summary
              className="cursor-pointer text-lg font-medium text-purple-700"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {faq.question}
            </motion.summary>
            <motion.p
              className="text-gray-600 mt-2 pl-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.2 + 0.2 }}
            >
              {faq.answer}
            </motion.p>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default Faqs;
