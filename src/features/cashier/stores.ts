import { create } from "zustand";
import { Product } from "../product/types";
import { CartItem } from "./types";

interface CartState {
  cart: CartItem[];
  addToCart: (menu: Product) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()((set) => ({
  cart: [],

  addToCart: (menu) =>
    set((state) => {
      const itemExist = state.cart.find((item) => item.id === menu.id);

      if (itemExist) {
        return {
          cart: state.cart.map((item) => (item.id === menu.id ? { ...item, quantity: item.quantity + 1 } : item)),
        };
      }

      const newItem: CartItem = { id: menu.id, name: menu.name, price: menu.price, quantity: 1, image: menu.image };

      return { cart: [...state.cart, newItem] };
    }),

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
