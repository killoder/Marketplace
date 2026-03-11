import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { Trash2 } from 'lucide-react';

export function Sold() {
  const { items, deleteItem, isLoading } = useInventory();
  const soldItems = items.filter(i => i.status === 'Sold');

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="w-8 h-8 border-3 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
        <p className="text-slate-400 font-medium">Loading history...</p>
      </div>
    );
  }

  const totalProfit = soldItems.reduce((sum, item) => sum + ((item.sellPrice || 0) - item.buyPrice), 0);
  const totalRevenue = soldItems.reduce((sum, item) => sum + (item.sellPrice || 0), 0);

  return (
    <div className="space-y-10">
      
      {/* Summary Stats */}
      <div className="flex gap-8 pb-8 border-b border-slate-200">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">Total Profit</p>
          <p className={`text-3xl font-bold tracking-tight ${totalProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {totalProfit >= 0 ? '+' : ''}${totalProfit.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">Total Revenue</p>
          <p className="text-3xl font-bold tracking-tight text-slate-900">
            ${totalRevenue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Sold Items List */}
      <div>
        <div className="flex justify-between items-end mb-4 border-b border-slate-900 pb-2">
          <h2 className="font-semibold text-slate-900">Sold Items ({soldItems.length})</h2>
        </div>
        
        <div className="flex flex-col">
          {soldItems.length > 0 ? (
            soldItems.map(item => {
              const profit = (item.sellPrice || 0) - item.buyPrice;
              return (
                <div key={item.id} className="group flex justify-between py-4 border-b border-slate-200/60 transition-opacity">
                  <div className="flex-1 pr-4">
                    <div className="text-lg font-medium text-slate-900">{item.name}</div>
                    <div className="text-slate-500 text-sm mt-0.5">
                      Bought for ${item.buyPrice.toLocaleString()} • Sold for ${(item.sellPrice || 0).toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end justify-center gap-1">
                    <span className={`font-bold ${profit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {profit >= 0 ? '+' : ''}${profit.toLocaleString()}
                    </span>
                    <button 
                      onClick={() => deleteItem(item.id)} 
                      className="text-slate-300 hover:text-rose-500 p-1 opacity-0 group-hover:opacity-100 transition-all text-xs flex items-center gap-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-slate-400 italic text-center">
              No items sold yet. Go to Active items to mark some as sold.
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
}
