import React from 'react';
import { Pill, Search, Plus, ShoppingCart, Printer, CheckCircle2, Trash2, User, Activity, Package, DollarSign, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

export default function PharmacyManagement() {
  const [cart, setCart] = React.useState<any[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [inventory, setInventory] = React.useState([
    { id: '1', name: 'Paracetamol', quantity: 500, price: 10, category: 'General' },
    { id: '2', name: 'Amoxicillin', quantity: 200, price: 50, category: 'Antibiotic' },
    { id: '3', name: 'Cetirizine', quantity: 300, price: 15, category: 'Antihistamine' },
    { id: '4', name: 'Ibuprofen', quantity: 150, price: 25, category: 'Painkiller' },
  ]);

  const addToCart = (medicine: any) => {
    const existingItem = cart.find(item => item.id === medicine.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === medicine.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...medicine, quantity: 1 }]);
    }
    toast.success(`${medicine.name} added to cart`);
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const processPayment = () => {
    if (cart.length === 0) return;
    toast.success('Payment processed successfully!', {
      description: `Total Amount: Rs. ${totalAmount}`,
    });
    setCart([]);
  };

  const filteredInventory = inventory.filter(med => 
    med.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    med.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10 pb-10">
      {/* Inventory Section */}
      <div className="lg:col-span-2 space-y-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-10 rounded-3xl"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <h3 className="text-xl font-display font-bold text-slate-900 flex items-center">
              <Pill className="mr-3 text-indigo-600" size={24} />
              Medicine Inventory
            </h3>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search medicines..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-12"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredInventory.map((med) => (
              <motion.div 
                key={med.id}
                whileHover={{ y: -5 }}
                className="p-6 rounded-3xl border border-slate-100 bg-slate-50/50 flex items-center justify-between group transition-all"
              >
                <div className="flex items-center">
                  <div className="w-14 h-14 bg-white rounded-2xl shadow-inner flex items-center justify-center mr-5">
                    <Activity size={24} className="text-indigo-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{med.name}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{med.category}</p>
                    <p className="text-xs text-slate-500 font-medium mt-1">{med.quantity} in stock</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-black text-indigo-600">Rs. {med.price}</span>
                  <button 
                    onClick={() => addToCart(med)}
                    className="w-10 h-10 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center active:scale-90"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="glass-card p-10 rounded-3xl bg-indigo-600 text-white flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <h3 className="text-2xl font-display font-bold mb-4">Automated Stock Management</h3>
            <p className="text-indigo-100 leading-relaxed mb-8 font-medium">
              Inventory levels are updated automatically with every sale. 
              Low stock alerts will notify the manager when supplies are running low.
            </p>
            <div className="flex gap-4">
              <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest">
                Total SKUs: 124
              </div>
              <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest text-rose-200">
                Low Stock: 08
              </div>
            </div>
          </div>
          <motion.div 
            animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 6 }}
            className="hidden lg:block"
          >
            <Package size={120} className="text-white/20" />
          </motion.div>
        </div>
      </div>

      {/* Cart Section */}
      <div className="space-y-10">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-8 rounded-3xl flex flex-col h-full sticky top-32"
        >
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8 flex items-center">
            <ShoppingCart size={16} className="mr-3 text-indigo-600" />
            Current Invoice
          </h4>

          <div className="flex-1 space-y-4 overflow-y-auto max-h-[450px] pr-2 scrollbar-hide">
            <AnimatePresence mode="popLayout">
              {cart.length === 0 ? (
                <div className="text-center py-20">
                  <ShoppingCart size={56} className="mx-auto text-slate-100 mb-6" />
                  <p className="text-slate-400 font-bold">Your cart is empty</p>
                </div>
              ) : (
                cart.map((item) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100"
                  >
                    <div className="flex-1 min-w-0 mr-4">
                      <p className="font-bold text-slate-900 truncate">{item.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Qty: {item.quantity} x Rs. {item.price}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-black text-slate-900">Rs. {item.price * item.quantity}</span>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-100 space-y-5">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Subtotal</span>
              <span className="text-slate-900 font-black">Rs. {totalAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Tax (0%)</span>
              <span className="text-slate-900 font-black">Rs. 0</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-sm text-slate-900 font-black uppercase tracking-widest">Total Amount</span>
              <span className="text-3xl font-display font-black text-indigo-600">Rs. {totalAmount.toLocaleString()}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6">
              <button 
                onClick={processPayment}
                disabled={cart.length === 0}
                className="col-span-2 py-5 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
              >
                <CreditCard size={20} />
                Process Payment
              </button>
              <button 
                disabled={cart.length === 0}
                className="py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center text-xs gap-2"
              >
                <Printer size={16} />
                Print
              </button>
              <button 
                onClick={() => setCart([])}
                disabled={cart.length === 0}
                className="py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
