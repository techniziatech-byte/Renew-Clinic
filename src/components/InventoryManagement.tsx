import React from 'react';
import { Package, Warehouse, Truck, AlertCircle, TrendingUp, TrendingDown, Plus, Search, Filter, ArrowRightLeft, Factory, Layers, Box, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

const StatCard = ({ title, value, icon: Icon, color, bg }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="glass-card p-8 rounded-3xl flex items-center gap-6"
  >
    <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner", bg, color)}>
      <Icon size={28} />
    </div>
    <div>
      <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">{title}</p>
      <h3 className="text-2xl font-display font-black text-slate-900">{value}</h3>
    </div>
  </motion.div>
);

export default function InventoryManagement() {
  const [activeTab, setActiveTab] = React.useState<'pharmacy' | 'warehouse' | 'production'>('warehouse');
  const [isProducing, setIsProducing] = React.useState(false);

  const [warehouseStock, setWarehouseStock] = React.useState([
    { id: 'w1', name: 'Glass Bottles (50ml)', type: 'unfinished', quantity: 5000, unit: 'pcs' },
    { id: 'w2', name: 'Cardboard Boxes', type: 'unfinished', quantity: 10000, unit: 'pcs' },
    { id: 'w3', name: 'Aesthetic Cream Base', type: 'unfinished', quantity: 250, unit: 'kg' },
    { id: 'w4', name: 'Finished Face Serum', type: 'finished', quantity: 120, unit: 'units' },
  ]);

  const produceFinishedGoods = () => {
    setIsProducing(true);
    toast.info('Production process started...', {
      description: 'Converting raw materials to finished goods...',
    });
    
    setTimeout(() => {
      setWarehouseStock(prev => prev.map(item => {
        if (item.name === 'Glass Bottles (50ml)') return { ...item, quantity: item.quantity - 50 };
        if (item.name === 'Finished Face Serum') return { ...item, quantity: item.quantity + 50 };
        return item;
      }));
      toast.success('Production completed!', {
        description: '50 units of Face Serum added to finished goods.',
      });
      setIsProducing(false);
    }, 3000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-10">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard title="Total SKUs" value="452" icon={Package} color="text-indigo-600" bg="bg-indigo-50" />
        <StatCard title="Warehouse Value" value="Rs. 1.2M" icon={Warehouse} color="text-sky-600" bg="bg-sky-50" />
        <StatCard title="Active Suppliers" value="12" icon={Truck} color="text-emerald-600" bg="bg-emerald-50" />
        <StatCard title="Low Stock Alerts" value="15" icon={AlertCircle} color="text-rose-600" bg="bg-rose-50" />
      </div>

      {/* Main Content */}
      <div className="glass-card rounded-3xl overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit">
            {[
              { id: 'pharmacy', name: 'Pharmacy Store', icon: Package },
              { id: 'warehouse', name: 'Central Warehouse', icon: Warehouse },
              { id: 'production', name: 'Production Unit', icon: Factory },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center px-6 py-2.5 rounded-xl text-xs font-bold transition-all",
                  activeTab === tab.id 
                    ? "bg-white text-indigo-600 shadow-sm" 
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                <tab.icon size={16} className="mr-2" />
                {tab.name}
              </button>
            ))}
          </div>
          <div className="flex gap-4">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search inventory..." 
                className="input-field pl-12 py-2.5"
              />
            </div>
            <button className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-slate-200">
              <Filter size={20} />
            </button>
          </div>
        </div>

        <div className="p-10">
          <AnimatePresence mode="wait">
            {activeTab === 'warehouse' && (
              <motion.div 
                key="warehouse"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-display font-bold text-slate-900">Warehouse Stock Levels</h3>
                  <button className="flex items-center px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all text-sm gap-2">
                    <Plus size={18} />
                    Add New Stock
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {warehouseStock.map((item) => (
                    <motion.div 
                      key={item.id} 
                      whileHover={{ y: -3 }}
                      className="p-8 rounded-3xl border border-slate-100 bg-slate-50/50 flex items-center justify-between group transition-all"
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-white rounded-2xl shadow-inner flex items-center justify-center text-slate-400 group-hover:text-indigo-500 transition-colors">
                          {item.type === 'finished' ? <Box size={24} /> : <Layers size={24} />}
                        </div>
                        <div>
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-2 inline-block",
                            item.type === 'finished' ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                          )}>
                            {item.type}
                          </span>
                          <h4 className="text-lg font-bold text-slate-900">{item.name}</h4>
                          <p className="text-sm text-slate-500 font-medium mt-1">Current Stock: <span className="text-slate-900 font-bold">{item.quantity} {item.unit}</span></p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-4">
                        <div className="flex items-center text-emerald-600 text-xs font-bold bg-emerald-50 px-3 py-1 rounded-lg">
                          <TrendingUp size={14} className="mr-1.5" />
                          +12%
                        </div>
                        <button className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-slate-200">
                          <ArrowRightLeft size={18} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'production' && (
              <motion.div 
                key="production"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-3xl mx-auto space-y-10 text-center py-10"
              >
                <div className="relative inline-block">
                  <div className="p-10 bg-indigo-50 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <Factory size={56} className="text-indigo-600" />
                  </div>
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute -top-2 -right-2 p-3 bg-amber-400 text-white rounded-2xl shadow-lg"
                  >
                    <Zap size={24} />
                  </motion.div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-3xl font-display font-black text-slate-900">Aesthetic Product Manufacturing</h3>
                  <p className="text-slate-500 leading-relaxed max-w-xl mx-auto font-medium">
                    Convert unfinished raw materials (bottles, packaging, bases) into 
                    finished aesthetic products ready for sale in the pharmacy.
                  </p>
                </div>

                <div className="bg-slate-50 p-10 rounded-3xl border border-dashed border-slate-200 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-transparent pointer-events-none" />
                  <div className="flex items-center justify-between mb-8 relative">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Input (Raw Materials)</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Output (Finished Goods)</span>
                  </div>
                  <div className="flex items-center justify-between relative">
                    <div className="text-left space-y-2">
                      <p className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-400" />
                        50x Glass Bottles
                      </p>
                      <p className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-400" />
                        5kg Cream Base
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <ArrowRightLeft className="text-indigo-400" size={48} />
                      <span className="text-[10px] font-black text-indigo-400 uppercase tracking-tighter">Processing</span>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-display font-black text-indigo-600 flex items-center gap-3">
                        50x Face Serum Units
                        <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                      </p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={produceFinishedGoods}
                  disabled={isProducing}
                  className="px-16 py-5 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-[0.98] flex items-center justify-center gap-3 mx-auto disabled:opacity-50"
                >
                  {isProducing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing Batch...
                    </>
                  ) : (
                    <>
                      <Zap size={20} />
                      Start Production Batch
                    </>
                  )}
                </button>
              </motion.div>
            )}

            {activeTab === 'pharmacy' && (
              <motion.div 
                key="pharmacy"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-24"
              >
                <Package size={80} className="mx-auto text-slate-100 mb-6" />
                <h4 className="text-xl font-display font-bold text-slate-900 mb-2">Pharmacy Store View</h4>
                <p className="text-slate-400 font-medium">This module is currently being synchronized with the main pharmacy system.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
