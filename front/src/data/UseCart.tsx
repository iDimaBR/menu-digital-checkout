import { create } from 'zustand'

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  quantity: number;
}

interface ProductState {
  items: Product[];
  AddItem: (product: Product) => void;
  RemoveItem: (product: Product) => void;
  clearCart: () => void;
}

const UseCart = create<ProductState>((set) => ({
  items: [] as Product[],
  AddItem: (product: Product) =>
    set((state) => {
      const item = state.items.find((item) => item.id === product.id);
      if (item) {
        item.quantity += 1;
        return { items: [...state.items] };
      }else{
        state.items.push({ ...product, quantity: isNaN(product.quantity) ? 1 : product.quantity });
        return { items: [...state.items] };
      }
    }),
  RemoveItem: (product: Product) =>
    set((state) => {

      const item = state.items.find((item) => item.id === product.id);
      if (item) {
        item.quantity -= 1;
        return { items: [...state.items] };
      }

      return { items: [...state.items, { ...product, quantity: 1 }] };
    }),
  clearCart: () => set({ items: [] }),
}))

export default UseCart;