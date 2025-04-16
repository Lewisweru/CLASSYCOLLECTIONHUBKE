// src/types.ts

export interface CategoryBasic { // Basic info often included
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  price: number; // Stored as smallest unit (integer)
  category: CategoryBasic; // Still expect category object from API
  subcategory: string;
  description: string;
  // --- CHANGE START ---
  // imageUrl: string; // REMOVE THIS OLD FIELD
  imageUrls: string[]; // ADD THIS NEW FIELD (array of strings)
  // --- CHANGE END ---
  rating: number;
  reviews: number;
  featured: boolean;
  createdAt?: string; // Optional timestamps from DB
  updatedAt?: string; // Optional timestamps from DB
}

export interface CartItem extends Product {
  quantity: number;
}

// Full Category type (no changes needed here)
export interface Category {
  id: string;
  name: string;
  icon?: string | null;
  imageUrl?: string | null;
  description?: string | null;
  subcategories: string[];
  createdAt?: string;
  updatedAt?: string;
}

// Testimonial Type (if used, keep as is)
export interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  role: string;
  content: string;
  rating: number;
}

// DeliveryOption Type (keep as is)
export interface DeliveryOption {
  id: string;
  name: string;
  price: number; // Smallest unit
  duration: string;
}

// ShippingDetails Type (keep as is)
export interface ShippingDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  deliveryOption: string; // 'standard' or 'express'
}


export interface OrderItem {
  id: string;
  quantity: number;
  price: number; // Price AT THE TIME OF ORDER (Smallest unit)
  orderId: string;
  productId: string;
  // Include product details if your backend sends them nested
  product?: Pick<Product, 'id' | 'name' | 'imageUrls' | 'subcategory'>; // Use Pick<> for specific fields
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  shippingCity: string;
  deliveryOption: string;
  totalAmount: number; // Smallest unit
  currency: string;
  status: string; // Consider using a union type: 'PENDING' | 'PAID' | 'FAILED' etc.
  merchantReference: string;
  orderTrackingId?: string | null;
  paymentMethod?: string | null;
  createdAt?: string; // ISO Date string
  updatedAt?: string; // ISO Date string
  items: OrderItem[]; // Array of OrderItem
}