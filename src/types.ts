// src/types.ts (Example Adjustment)

export interface CategoryBasic { // Basic info often included
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  price: number; // Stored as smallest unit (integer)
  // categoryId: string; // No longer need this directly if category object is included
  category: CategoryBasic; // Now potentially an object returned by API
  subcategory: string;
  description: string;
  imageUrl: string;
  rating: number;
  reviews: number;
  featured: boolean;
  createdAt?: string; // Optional timestamps from DB
  updatedAt?: string; // Optional timestamps from DB
}

export interface CartItem extends Product {
  quantity: number;
}

// Full Category type might still be used for the Category page itself
export interface Category {
  id: string;
  name: string;
  icon?: string | null; // Make optional fields nullable if DB allows
  imageUrl?: string | null;
  description?: string | null;
  subcategories: string[];
  createdAt?: string;
  updatedAt?: string;
}

// ... rest of your types (Testimonial, DeliveryOption, ShippingDetails)
export interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  role: string;
  content: string;
  rating: number;
}

export interface DeliveryOption {
  id: string;
  name: string;
  price: number;
  duration: string;
}

export interface ShippingDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  deliveryOption: string;
}