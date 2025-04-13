import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, Product } from '../types';
import toast from 'react-hot-toast';

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  // Total is calculated outside or via selector now
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(item => item.id === product.id);
          let newItems;
          if (existingItem) {
            newItems = state.items.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          } else {
            newItems = [...state.items, { ...product, quantity: quantity }];
          }
          toast.success(`${product.name} added to cart!`);
          return { items: newItems };
        });
      },
      removeItem: (productId) => {
        set((state) => {
          const itemToRemove = state.items.find(item => item.id === productId);
          if (itemToRemove) {
            toast.error(`${itemToRemove.name} removed from cart.`);
          }
          return { items: state.items.filter(item => item.id !== productId) };
        });
      },
      updateQuantity: (productId, quantity) => {
        const targetQuantity = Math.max(1, quantity); // Ensure quantity is at least 1
        set((state) => ({
          items: state.items.map(item =>
            item.id === productId
              ? { ...item, quantity: targetQuantity }
              : item
          )
        }));
      },
      clearCart: () => {
        set({ items: [] });
         // Optionally add toast here if needed, e.g., after order placement
      },
    }),
    {
      name: 'cart-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // use localStorage
      partialize: (state) => ({ items: state.items }), // Only persist items array
    }
  )
);

// Selector to calculate total easily
export const useCartTotal = () => useCartStore((state) =>
  state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
);

// Selector for item count
export const useCartItemCount = () => useCartStore((state) =>
  state.items.reduce((sum, item) => sum + item.quantity, 0)
);

// Function to get item quantity (useful for checking before adding)
export const getCartItemQuantity = (productId: string): number => {
    const items = useCartStore.getState().items;
    const item = items.find(i => i.id === productId);
    return item ? item.quantity : 0;
};