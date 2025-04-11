export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'home-living' | 'apparel' | 'bags' | 'kitchen' | 'gifts';
  subcategory: string;
  description: string;
  imageUrl: string;
  rating: number;
  reviews: number;
  featured: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  imageUrl: string;
  description: string;
  subcategories: string[];
}

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