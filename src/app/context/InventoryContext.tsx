import React, { createContext, useContext, useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

export interface Item {
  id: string;
  name: string;
  category: string;
  brand: string;
  condition: string;
  purchaseDate: string;
  sellDate?: string;
  buyPrice: number;
  sellPrice?: number;
  status: 'In Stock' | 'Sold' | 'Reserved';
}

interface InventoryContextType {
  items: Item[];
  addItem: (item: Omit<Item, 'id' | 'status'>) => Promise<void>;
  markSold: (id: string, sellPrice: number) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  isLoading: boolean;
  formatCurrency: (amount: number) => string;
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
        data.sort((a: Item, b: Item) => a.name.localeCompare(b.name));
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

  const addItem = async (itemData: Omit<Item, 'id' | 'status'>) => {
    const newItem: Partial<Item> = {
      ...itemData,
      status: 'In Stock',
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
        setItems((prev) => [...prev, savedItem].sort((a, b) => a.name.localeCompare(b.name)));
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  return (
    <InventoryContext.Provider value={{ items, addItem, markSold, deleteItem, isLoading, formatCurrency }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) throw new Error('useInventory must be used within an InventoryProvider');
  return context;
}
