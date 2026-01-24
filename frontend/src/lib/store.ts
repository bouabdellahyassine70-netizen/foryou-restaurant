import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  modifierIds?: string[];
  modifiers?: Array<{ id: string; name: string; price: number }>;
  notes?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (menuItemId: string, modifierIds?: string[]) => void;
  updateQuantity: (menuItemId: string, quantity: number, modifierIds?: string[]) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const items = get().items;
        const existingIndex = items.findIndex(
          (i) =>
            i.menuItemId === item.menuItemId &&
            JSON.stringify(i.modifierIds?.sort()) === JSON.stringify(item.modifierIds?.sort()),
        );

        if (existingIndex >= 0) {
          const updated = [...items];
          updated[existingIndex].quantity += item.quantity;
          set({ items: updated });
        } else {
          set({ items: [...items, item] });
        }
      },
      removeItem: (menuItemId, modifierIds) => {
        set({
          items: get().items.filter(
            (i) =>
              !(i.menuItemId === menuItemId &&
                JSON.stringify(i.modifierIds?.sort()) === JSON.stringify(modifierIds?.sort())),
          ),
        });
      },
      updateQuantity: (menuItemId, quantity, modifierIds) => {
        if (quantity <= 0) {
          get().removeItem(menuItemId, modifierIds);
          return;
        }
        const items = get().items;
        const index = items.findIndex(
          (i) =>
            i.menuItemId === menuItemId &&
            JSON.stringify(i.modifierIds?.sort()) === JSON.stringify(modifierIds?.sort()),
        );
        if (index >= 0) {
          const updated = [...items];
          updated[index].quantity = quantity;
          set({ items: updated });
        }
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        return get().items.reduce((sum, item) => {
          const itemTotal = Number(item.price) * item.quantity;
          const modifierTotal =
            item.modifiers?.reduce((mSum, m) => mSum + Number(m.price) * item.quantity, 0) || 0;
          return sum + itemTotal + modifierTotal;
        }, 0);
      },
      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

interface AuthStore {
  user: any | null;
  token: string | null;
  setAuth: (user: any, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        set({ user, token });
      },
      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ user: null, token: null });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

