import React, { createContext, useContext, useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

export interface Item {
  id: string;
  name: string;
  buyPrice: number;
  sellPrice?: number;
  status: 'Active' | 'Sold';
}

interface InventoryContextType {
  items: Item[];
  addItem: (name: string, buyPrice: number) => Promise<void>;
  markSold: (id: string, sellPrice: number) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  isLoading: boolean;
}

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-d694d660`;

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE}/items`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (err) {
      console.error("Error fetching items:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const addItem = async (name: string, buyPrice: number) => {
    const newItem: Partial<Item> = {
      name,
      buyPrice,
      status: 'Active',
    };
    
    try {
      const response = await fetch(`${API_BASE}/items`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newItem)
      });
      
      if (response.ok) {
        const savedItem = await response.json();
        setItems((prev) => [savedItem, ...prev]);
      }
    } catch (err) {
      console.error("Error adding item:", err);
    }
  };

  const markSold = async (id: string, sellPrice: number) => {
    try {
      const response = await fetch(`${API_BASE}/items/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sellPrice, status: 'Sold' })
      });
      
      if (response.ok) {
        const updatedItem = await response.json();
        setItems((prev) =>
          prev.map((item) => (item.id === id ? updatedItem : item))
        );
      }
    } catch (err) {
      console.error("Error marking as sold:", err);
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE}/items/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        setItems((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  return (
    <InventoryContext.Provider value={{ items, addItem, markSold, deleteItem, isLoading }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) throw new Error('useInventory must be used within an InventoryProvider');
  return context;
}
