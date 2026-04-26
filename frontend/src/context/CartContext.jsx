import { createContext, useState, useEffect, useContext } from 'react';
import { cartService } from '../services/cartService';
import { AuthContext } from './AuthContext';

export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState({ items: [], totalAmount: 0, itemCount: 0 });
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!user) { setCart({ items: [], totalAmount: 0, itemCount: 0 }); return; }
    try {
      setLoading(true);
      const data = await cartService.getCart();
      setCart(data);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCart(); }, [user]);

  const addItem = async (variantId, quantity) => {
    const data = await cartService.addItem({ variantId, quantity });
    setCart(data);
    return data;
  };

  const updateQty = async (itemId, quantity) => {
    const data = await cartService.updateItem(itemId, quantity);
    setCart(data);
    return data;
  };

  const removeItem = async (itemId) => {
    const data = await cartService.removeItem(itemId);
    setCart(data);
    return data;
  };

  const clearCart = async () => {
    const data = await cartService.clearCart();
    setCart(data);
    return data;
  };

  return (
    <CartContext.Provider value={{ cart, loading, fetchCart, addItem, updateQty, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}
