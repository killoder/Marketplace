import React, { useState } from 'react';
import { useInventory, Item } from '../context/InventoryContext';
import { Trash2 } from 'lucide-react';

function ActiveItemRow({ item, onSell, onDelete }: { item: Item; onSell: (id: string, price: number) => void; onDelete: (id: string) => void }) {
  const [sellPrice, setSellPrice] = useState('');
  const [isSelling, setIsSelling] = useState(false);
  const { formatCurrency } = useInventory();

  const handleSell = (e: React.FormEvent) => {
    e.preventDefault();
    if (sellPrice) {
      onSell(item.id, parseFloat(sellPrice));
    }
  };

  return (
    <div className="group flex flex-row items-center justify-between py-3 border-b border-slate-200/60 gap-4 transition-opacity min-h-[56px]">
      <div className="flex flex-1 flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-8 min-w-0">
        <div className="text-lg font-medium text-slate-900 truncate leading-none">{item.name}</div>
        <div className="text-slate-400 text-sm whitespace-nowrap leading-none font-normal">Bought for {formatCurrency(item.buyPrice)}</div>
      </div>
      
      <div className="flex items-center gap-3 shrink-0">
        {isSelling ? (
          <form onSubmit={handleSell} className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-200">
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-medium">€</span>
              <input 
                type="number" 
                required
                autoFocus
                min="0"
                step="0.01"
                placeholder="0.00" 
                value={sellPrice}
                onChange={(e) => setSellPrice(e.target.value)}
                className="w-24 pl-5 pr-2 py-1 bg-white border border-slate-300 rounded text-sm outline-none focus:border-slate-900 focus:ring-0 transition-colors"
              />
            </div>
            <button 
              type="submit" 
              className="text-xs font-bold bg-slate-900 text-white px-3 py-1.5 rounded hover:bg-slate-800 transition-colors uppercase tracking-wider"
            >
              Confirm
            </button>
            <button 
              type="button" 
              onClick={() => {
                setIsSelling(false);
                setSellPrice('');
              }}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 px-1 transition-colors uppercase tracking-wider"
            >
              ✕
            </button>
          </form>
        ) : (
          <button 
            onClick={() => setIsSelling(true)}
            className="text-xs font-bold text-slate-500 hover:text-slate-900 px-3 py-1.5 rounded border border-slate-200 hover:border-slate-400 transition-all bg-white uppercase tracking-wider"
          >
            Mark Sold
          </button>
        )}
        
        {!isSelling && (
          <button 
            onClick={() => onDelete(item.id)} 
            className="text-slate-200 hover:text-rose-500 p-1 transition-all"
            title="Delete item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export function Home() {
  const { items, addItem, markSold, deleteItem, isLoading, formatCurrency } = useInventory();
  const activeItems = items.filter(i => i.status === 'In Stock');

  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [buyPrice, setBuyPrice] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && buyPrice) {
      addItem({
        name,
        buyPrice: parseFloat(buyPrice),
        category: 'Uncategorized',
        brand: '',
        condition: 'Good',
        purchaseDate: new Date().toISOString().split('T')[0]
      });
      setName('');
      setBuyPrice('');
      setIsAdding(false);
    }
  };

  const totalInvested = activeItems.reduce((sum, item) => sum + item.buyPrice, 0);

  return (
    <div className="space-y-6">
      
      {/* Quick Add Form (Absolute overlay or inline) */}
      {isAdding && (
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 mb-8 animate-in fade-in slide-in-from-top-2 duration-300">
          <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-4 items-end sm:items-center">
            <div className="flex-1 w-full">
              <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1 ml-0.5">Product Name</label>
              <input 
                type="text" 
                required
                autoFocus
                placeholder="What did you buy?" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent border-b border-slate-300 py-1.5 text-lg text-slate-900 placeholder:text-slate-400 outline-none focus:border-slate-900 transition-colors rounded-none"
              />
            </div>
            <div className="flex gap-4 w-full sm:w-auto">
              <div className="relative w-full sm:w-32">
                <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1 ml-0.5">Cost</label>
                <div className="relative">
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400 text-lg font-medium">€</span>
                  <input 
                    type="number" 
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00" 
                    value={buyPrice}
                    onChange={(e) => setBuyPrice(e.target.value)}
                    className="w-full bg-transparent border-b border-slate-300 pl-4 py-1.5 text-lg text-slate-900 placeholder:text-slate-400 outline-none focus:border-slate-900 transition-colors rounded-none"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => {
                    setIsAdding(false);
                    setName('');
                    setBuyPrice('');
                  }}
                  className="text-sm font-semibold text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="text-sm font-semibold bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Add Item
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Active Items List */}
      <div>
        <div className="flex justify-between items-end mb-6 border-b border-slate-900 pb-3">
          <div>
            <h2 className="font-bold text-slate-900 text-xl tracking-tight">Current Inventory ({activeItems.length})</h2>
            <p className="text-sm font-medium text-slate-500 mt-0.5">Total Invested: {formatCurrency(totalInvested)}</p>
          </div>
          
          {!isAdding && (
            <button 
              onClick={() => setIsAdding(true)}
              className="text-slate-600 hover:text-slate-900 font-semibold transition-colors flex items-center gap-1.5 pb-0.5 group"
            >
              <span className="text-xl leading-none transition-transform group-hover:scale-110">+</span> 
              <span className="text-sm">Add item</span>
            </button>
          )}
        </div>
        
        <div className="flex flex-col">
          {isLoading ? (
            <div className="py-12 flex justify-center">
              <div className="w-6 h-6 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
            </div>
          ) : activeItems.length > 0 ? (
            activeItems.map(item => (
              <ActiveItemRow 
                key={item.id} 
                item={item} 
                onSell={markSold} 
                onDelete={deleteItem}
              />
            ))
          ) : (
            <div className="py-8 text-slate-400 italic text-center">
              You don't have any active items. Add something above.
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
}
