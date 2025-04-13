import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import toast from 'react-hot-toast';
import { Product } from '../types'; // Import Product type if needed for toasts

interface SavedItemsStore {
  savedItemIds: string[];
  addSavedItem: (productId: string, productName?: string) => void;
  removeSavedItem: (productId: string, productName?: string) => void;
  toggleSavedItem: (product: Product) => void;
  isSaved: (productId: string) => boolean;
  getSavedItemCount: () => number;
}

export const useSavedItemsStore = create<SavedItemsStore>()(
  persist(
    (set, get) => ({
      savedItemIds: [],
      addSavedItem: (productId, productName) => {
        if (!get().savedItemIds.includes(productId)) {
          set((state) => ({ savedItemIds: [...state.savedItemIds, productId] }));
          toast.success(`${productName || 'Item'} saved!`);
        }
      },
      removeSavedItem: (productId, productName) => {
        set((state) => ({ savedItemIds: state.savedItemIds.filter(id => id !== productId) }));
        toast.error(`${productName || 'Item'} removed from saved items.`);
      },
      toggleSavedItem: (product) => {
        const isCurrentlySaved = get().isSaved(product.id);
        if (isCurrentlySaved) {
          get().removeSavedItem(product.id, product.name);
        } else {
          get().addSavedItem(product.id, product.name);
        }
      },
      isSaved: (productId) => {
        return get().savedItemIds.includes(productId);
      },
      getSavedItemCount: () => {
        return get().savedItemIds.length;
      }
    }),
    {
      name: 'saved-items-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ savedItemIds: state.savedItemIds }),
    }
  )
);