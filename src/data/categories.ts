import { Category } from '../types';

export const categories: Category[] = [
  {
    id: 'home-living',
    name: 'Home & Living',
    icon: '🛋️',
    imageUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af',
    description: 'Quality home essentials for comfortable living',
    subcategories: [
      'Sleeping & Living Essentials',
      'Wardrobes & Shoe Racks',
      'Dishracks'
    ]
  },
  {
    id: 'apparel',
    name: 'Apparel & Accessories',
    icon: '👚',
    imageUrl: 'https://images.unsplash.com/photo-1589810635657-232948472d98',
    description: 'Stylish apparel for every occasion',
    subcategories: [
      'Boobtapes, Trainers & Bralets',
      'Sleepwear',
      'Lingerie'
    ]
  },
  {
    id: 'bags',
    name: 'Bags & Carriers',
    icon: '👜',
    imageUrl: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c',
    description: 'Fashionable bags for all your needs',
    subcategories: [
      'Handbags',
      'Travel Bags',
      'Totes'
    ]
  },
  {
    id: 'kitchen',
    name: 'Kitchen & Dining',
    icon: '🍳',
    imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f',
    description: 'Essential kitchenware for your culinary journey',
    subcategories: [
      'Kitchenware',
      'Cookware Sets'
    ]
  },
  {
    id: 'gifts',
    name: 'Specials & Gift Ideas',
    icon: '🎁',
    imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48',
    description: 'Thoughtful gift sets for special occasions',
    subcategories: [
      'Gift Sets'
    ]
  }
];