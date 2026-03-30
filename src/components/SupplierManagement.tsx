import React from 'react';
import { Truck, User, Phone, Package, Plus, Search, Printer, CheckCircle2, Trash2, Activity, FileText, DollarSign, ExternalLink, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

export default function SupplierManagement() {
  const [suppliers, setSuppliers] = React.useState([
    { id: '1', name: 'MediCorp Supplies', contact: '9876543210', products: ['Paracetamol', 'Amoxicillin'], status: 'active' },
    { id: '2', name: 'Dermacare Pharma', contact: '9123456780', products: ['Face Serum', 'Chemical Peel'], status: 'active' },
    { id: '3', name: 'Global Health Ltd', contact: '9988776655', products: ['Glass Bottles', 'Packaging'], status: 'inactive' },
  ]);

  const addSupplier = () => {
    toast.success('New supplier registration form opened');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by supplier or product" 
            className="input-field pl-12"
          />
        </div>
        <button 
          onClick={addSupplier}
          className="flex items-center px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-[0.98] gap-3"
        >
          <Plus size={20} />
          Register New Supplier
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-3xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-widest font-black border-b border-slate-100">
                <th className="px-8 py-6">Supplier</th>
                <th className="px-8 py-6">Contact Info</th>
                <th className="px-8 py-6">Products Supplied</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {suppliers.map((sup) => (
                <tr key={sup.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl shadow-inner flex items-center justify-center text-slate-400 group-hover:text-indigo-500 transition-colors">
                        <Truck size={20} />
                      </div>
                      <span className="font-bold text-slate-900">{sup.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-slate-600 font-medium">
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-slate-400" />
                      {sup.contact}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-wrap gap-2">
                      {sup.products.map((p, i) => (
                        <span key={i} className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={cn(
                      "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                      sup.status === 'active' ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-500"
                    )}>
                      {sup.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-slate-200">
                        <ExternalLink size={18} />
                      </button>
                      <button className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all border border-slate-200">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 glass-card p-8 rounded-3xl"
        >
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
            <FileText size={16} className="text-indigo-600" />
            Recent Purchase Invoices
          </h4>
          <div className="space-y-4">
            {[
              { id: 'INV-001', supplier: 'MediCorp', amount: 45000, date: '2026-03-28' },
              { id: 'INV-002', supplier: 'Dermacare', amount: 12000, date: '2026-03-29' },
            ].map((inv) => (
              <div key={inv.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-all group">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{inv.id}</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{inv.date}</span>
                </div>
                <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{inv.supplier}</p>
                <p className="text-lg font-black text-slate-900 mt-2 flex items-center gap-1">
                  <span className="text-xs font-bold text-slate-400">Rs.</span>
                  {inv.amount.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all text-xs uppercase tracking-widest">
            View All Invoices
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 glass-card p-10 rounded-3xl bg-indigo-50/50 border-indigo-100 flex flex-col md:flex-row items-center gap-10"
        >
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-600 text-white rounded-lg">
                <ShieldCheck size={20} />
              </div>
              <h3 className="text-2xl font-display font-bold text-indigo-900">Supplier & Invoice Management</h3>
            </div>
            <p className="text-indigo-700/80 leading-relaxed mb-8 font-medium">
              Track your suppliers and manage purchase invoices seamlessly. 
              Stock is automatically updated in the central warehouse upon 
              invoice approval.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-100">
                <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mb-2">Total Suppliers</p>
                <p className="text-3xl font-display font-black text-indigo-900">12</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-100">
                <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mb-2">Pending Payments</p>
                <p className="text-3xl font-display font-black text-indigo-900 flex items-center gap-1">
                  <span className="text-sm font-bold text-indigo-400">Rs.</span>
                  1.2M
                </p>
              </div>
            </div>
          </div>
          <motion.div 
            animate={{ x: [0, 10, 0], rotate: [0, 2, -2, 0] }}
            transition={{ repeat: Infinity, duration: 8 }}
            className="hidden lg:block"
          >
            <Truck size={140} className="text-indigo-200/50" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
