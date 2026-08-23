import { create } from "zustand";
import { CartItem } from "./types";

interface CartState {
  cart: CartItem[];
  addToCart: (newItem: CartItem) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()((set, get) => ({
  cart: [],

  addToCart: (newItem) => {
    const { cart, updateQuantity } = get();
    const existingItem = cart.find((item) => item.id === newItem.id);

    if (existingItem) {
      updateQuantity(existingItem.id, existingItem.quantity + newItem.quantity);
      return;
    }

    set({ cart: [...cart, newItem] });
  },

  updateQuantity: (id, quantity) =>
    set((state) => {
      if (quantity <= 0) {
        return {
          cart: state.cart.filter((item) => item.id !== id),
        };
      }

      return {
        cart: state.cart.map((item) => (item.id === id ? { ...item, quantity: quantity } : item)),
      };
    }),

  clearCart: () => set({ cart: [] }),
}));
