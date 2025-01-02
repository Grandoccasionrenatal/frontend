import {create} from 'zustand';
import {persist} from 'zustand/middleware' 
import { produce } from 'immer'
import { cartProductInterface} from '../types'

interface CartStoreState {
  open: boolean,
  setOpen: (i: boolean) => void,
  cart: cartProductInterface[];
  addToCart: (product: cartProductInterface) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

const useCartStore = create<CartStoreState>()(
  persist(
    (set) => ({
      cart: [],
      open: false,
      setOpen: (i)=>
      set((state)=>({
        open: i
      })),
      addToCart: (product: cartProductInterface) =>
        set((state) =>
          produce(state, (draft) => {
            const existingProductIndex = draft.cart.findIndex(
              (item) => item.product.id === product.product.id
            );
    
            if (existingProductIndex !== -1) {
              draft.cart[existingProductIndex].quantity += product.quantity;
            } else {
              draft.cart.push(product);
            }
          })
        ),
    
      removeFromCart: (productId: number) =>
        set((state) =>
          produce(state, (draft) => {
            draft.cart = draft.cart.filter(
              (item) => item.product.id !== productId
            );
          })
        ),
    
      updateQuantity: (productId: number, quantity: number) =>
        set((state) =>
          produce(state, (draft) => {
            const productIndex = draft.cart.findIndex(
              (item) => item.product.id === productId
            );
    
            if (productIndex !== -1) {
              draft.cart[productIndex].quantity = quantity;
            }
          })
        ),
      clearCart: () => set((state) => ({ cart: [], open: false })),
    }),
    {
      name: 'cart-storage'
    }
  )
);

export default useCartStore;
