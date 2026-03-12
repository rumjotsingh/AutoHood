import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  type: 'car' | 'part';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

interface WishlistState {
  items: string[];
  addItem: (id: string) => void;
  removeItem: (id: string) => void;
  isInWishlist: (id: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      skipHydration: true,
    }
  )
);

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);
          let newItems;
          if (existingItem) {
            newItems = state.items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            );
          } else {
            newItems = [...state.items, { ...item, quantity: 1 }];
          }
          const newTotal = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
          return { items: newItems, total: newTotal };
        }),
      removeItem: (id) =>
        set((state) => {
          const newItems = state.items.filter((item) => item.id !== id);
          const newTotal = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
          return { items: newItems, total: newTotal };
        }),
      updateQuantity: (id, quantity) =>
        set((state) => {
          const newItems = state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          );
          const newTotal = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
          return { items: newItems, total: newTotal };
        }),
      clearCart: () => set({ items: [], total: 0 }),
    }),
    {
      name: 'cart-storage',
      skipHydration: true,
    }
  )
);

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (id) =>
        set((state) => ({
          items: state.items.includes(id) ? state.items : [...state.items, id],
        })),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item !== id),
        })),
      isInWishlist: (id) => get().items.includes(id),
    }),
    {
      name: 'wishlist-storage',
      skipHydration: true,
    }
  )
);
