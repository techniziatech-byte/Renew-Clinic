import React from 'react';
import { ClipboardList, User, Calendar, DollarSign, CheckCircle2, Search, Printer, Plus, Activity, TrendingUp, CreditCard, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';

const mockProcedures = [
  { id: '1', patient: 'Sarah Johnson', procedure: 'Laser Hair Removal', date: '2026-03-30', fee: 5000, paid: 5000, status: 'completed' },
  { id: '2', patient: 'Michael Brown', procedure: 'Chemical Peel', date: '2026-03-30', fee: 3500, paid: 2000, status: 'pending' },
  { id: '3', patient: 'Elena Rodriguez', procedure: 'HydraFacial', date: '2026-03-31', fee: 4500, paid: 0, status: 'pending' },
];

export default function ProcedureManagement() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeFilter, setActiveFilter] = React.useState<'all' | 'pending' | 'completed'>('all');

  const filteredProcedures = mockProcedures.filter(proc => {
    const matchesSearch = proc.patient.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         proc.procedure.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || proc.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const stats = [
    { label: 'Total Revenue', value: 'Rs. 13,000', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Collected', value: 'Rs. 7,000', icon: CreditCard, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Pending', value: 'Rs. 6,000', icon: Clock, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-10">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-8 rounded-3xl flex items-center gap-6"
          >
            <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner", stat.bg, stat.color)}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">{stat.label}</p>
              <h4 className="text-2xl font-display font-black text-slate-900">{stat.value}</h4>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit">
          {['all', 'pending', 'completed'].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f as any)}
              className={cn(
                "px-6 py-2.5 rounded-xl text-xs font-bold transition-all capitalize",
                activeFilter === f ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search patient or procedure..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-12"
            />
          </div>
          <button 
            onClick={() => toast.success('New procedure form opened')}
            className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] flex items-center gap-2 whitespace-nowrap"
          >
            <Plus size={20} />
            New Entry
          </button>
        </div>
      </div>

      {/* Table Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-3xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] uppercase font-bold tracking-widest text-slate-400">Patient Details</th>
                <th className="px-8 py-5 text-[10px] uppercase font-bold tracking-widest text-slate-400">Procedure</th>
                <th className="px-8 py-5 text-[10px] uppercase font-bold tracking-widest text-slate-400">Date</th>
                <th className="px-8 py-5 text-[10px] uppercase font-bold tracking-widest text-slate-400">Fee (Rs)</th>
                <th className="px-8 py-5 text-[10px] uppercase font-bold tracking-widest text-slate-400">Paid (Rs)</th>
                <th className="px-8 py-5 text-[10px] uppercase font-bold tracking-widest text-slate-400">Status</th>
                <th className="px-8 py-5 text-[10px] uppercase font-bold tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProcedures.map((proc) => (
                <tr key={proc.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 mr-4 shadow-inner">
                        <User size={18} />
                      </div>
                      <span className="font-bold text-slate-900">{proc.patient}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center text-slate-600">
                      <Activity size={16} className="mr-3 text-indigo-400" />
                      <span className="font-bold">{proc.procedure}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-slate-500 font-bold text-sm">{format(parseISO(proc.date), 'PP')}</td>
                  <td className="px-8 py-6 font-black text-slate-900">Rs. {proc.fee.toLocaleString()}</td>
                  <td className="px-8 py-6">
                    <span className={cn(
                      "font-black",
                      proc.paid === proc.fee ? "text-emerald-600" : "text-indigo-600"
                    )}>
                      Rs. {proc.paid.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={cn(
                      "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest",
                      proc.status === 'completed' ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                    )}>
                      {proc.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                        <Printer size={18} />
                      </button>
                      <button className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all">
                        <DollarSign size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredProcedures.length === 0 && (
          <div className="py-20 text-center">
            <Activity size={48} className="mx-auto text-slate-100 mb-4" />
            <p className="text-slate-400 font-bold">No procedures found Matching your criteria</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
