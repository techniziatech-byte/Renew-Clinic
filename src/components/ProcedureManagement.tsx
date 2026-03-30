import React from 'react';
import { ClipboardList, User, Calendar, DollarSign, CheckCircle2, Search, Printer, Plus, Activity, TrendingUp, CreditCard, Clock, FileText, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { supabase } from '../lib/supabase';

export default function ProcedureManagement() {
  const [procedures, setProcedures] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeFilter, setActiveFilter] = React.useState<'all' | 'pending' | 'completed'>('all');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [newEntry, setNewEntry] = React.useState({
    patient: '',
    procedure: '',
    date: new Date().toISOString().split('T')[0],
    fee: 0,
    paid: 0,
    status: 'pending'
  });

  React.useEffect(() => {
    fetchProcedures();
  }, []);

  const fetchProcedures = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('procedures')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      toast.error('Failed to fetch procedures');
    } else {
      setProcedures(data || []);
    }
    setLoading(false);
  };

  const handleAddProcedure = async (e: React.FormEvent) => {
    e.preventDefault();
    const treatmentNo = `TR-${Math.floor(1000 + Math.random() * 9000)}`;
    const { data, error } = await supabase
      .from('procedures')
      .insert([{ ...newEntry, treatmentNo }]);

    if (error) {
      toast.error('Failed to add procedure');
    } else {
      toast.success('Procedure added successfully');
      setIsModalOpen(false);
      setNewEntry({
        patient: '',
        procedure: '',
        date: new Date().toISOString().split('T')[0],
        fee: 0,
        paid: 0,
        status: 'pending'
      });
      fetchProcedures();
    }
  };

  const generateInvoice = (proc: any) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(79, 70, 229); // Indigo-600
    doc.text('DERMACARE CLINIC', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(100, 116, 139); // Slate-500
    doc.text('Premium Dermatology & Aesthetic Services', 105, 28, { align: 'center' });
    
    doc.setDrawColor(226, 232, 240); // Slate-200
    doc.line(20, 35, 190, 35);
    
    // Invoice Info
    doc.setFontSize(18);
    doc.setTextColor(15, 23, 42); // Slate-900
    doc.text('INVOICE', 20, 50);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Invoice Date: ${format(new Date(), 'PP')}`, 190, 50, { align: 'right' });
    
    // Patient & Procedure Details
    autoTable(doc, {
      startY: 60,
      head: [['Description', 'Details']],
      body: [
        ['Treatment Number', proc.treatmentNo],
        ['Patient Name', proc.patient],
        ['Procedure', proc.procedure],
        ['Date', format(parseISO(proc.date), 'PP')],
      ],
      theme: 'striped',
      headStyles: { fillColor: [79, 70, 229] },
      styles: { fontSize: 11, cellPadding: 5 }
    });
    
    // Financials
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text('Financial Summary', 20, finalY);
    
    autoTable(doc, {
      startY: finalY + 5,
      body: [
        ['Total Fee', `Rs. ${proc.fee.toLocaleString()}`],
        ['Amount Paid', `Rs. ${proc.paid.toLocaleString()}`],
        ['Balance Due', `Rs. ${(proc.fee - proc.paid).toLocaleString()}`],
      ],
      theme: 'plain',
      styles: { fontSize: 11, cellPadding: 5 },
      columnStyles: {
        0: { fontStyle: 'bold', textColor: [100, 116, 139] },
        1: { halign: 'right', fontStyle: 'bold' }
      }
    });
    
    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(10);
    doc.setTextColor(148, 163, 184); // Slate-400
    doc.text('Thank you for choosing Dermacare Clinic.', 105, pageHeight - 20, { align: 'center' });
    doc.text('This is a computer generated invoice.', 105, pageHeight - 15, { align: 'center' });
    
    doc.save(`Invoice_${proc.treatmentNo}_${proc.patient.replace(/\s+/g, '_')}.pdf`);
    toast.success('Invoice generated successfully!');
  };

  const filteredProcedures = procedures.filter(proc => {
    const matchesSearch = proc.patient.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         proc.procedure.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || proc.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const totalRevenue = procedures.reduce((acc, curr) => acc + Number(curr.fee), 0);
  const totalCollected = procedures.reduce((acc, curr) => acc + Number(curr.paid), 0);
  const totalPending = totalRevenue - totalCollected;

  const stats = [
    { label: 'Total Revenue', value: `Rs. ${totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Collected', value: `Rs. ${totalCollected.toLocaleString()}`, icon: CreditCard, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Pending', value: `Rs. ${totalPending.toLocaleString()}`, icon: Clock, color: 'text-rose-600', bg: 'bg-rose-50' },
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
            onClick={() => setIsModalOpen(true)}
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
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-8 py-10 text-center text-slate-400 font-bold">Loading procedures...</td>
                </tr>
              ) : filteredProcedures.map((proc) => (
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
                      <button 
                        onClick={() => generateInvoice(proc)}
                        className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                        title="Generate Invoice"
                      >
                        <FileText size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && filteredProcedures.length === 0 && (
          <div className="py-20 text-center">
            <Activity size={48} className="mx-auto text-slate-100 mb-4" />
            <p className="text-slate-400 font-bold">No procedures found Matching your criteria</p>
          </div>
        )}
      </motion.div>

      {/* New Entry Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-2xl font-display font-bold text-slate-900">New Procedure Entry</h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <X size={20} className="text-slate-400" />
                </button>
              </div>
              
              <form onSubmit={handleAddProcedure} className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Patient Name</label>
                    <input 
                      required
                      type="text" 
                      className="input-field" 
                      placeholder="Enter patient name"
                      value={newEntry.patient}
                      onChange={(e) => setNewEntry({...newEntry, patient: e.target.value})}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Procedure Name</label>
                    <input 
                      required
                      type="text" 
                      className="input-field" 
                      placeholder="e.g. Laser Hair Removal"
                      value={newEntry.procedure}
                      onChange={(e) => setNewEntry({...newEntry, procedure: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Date</label>
                    <input 
                      required
                      type="date" 
                      className="input-field"
                      value={newEntry.date}
                      onChange={(e) => setNewEntry({...newEntry, date: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Status</label>
                    <select 
                      className="input-field"
                      value={newEntry.status}
                      onChange={(e) => setNewEntry({...newEntry, status: e.target.value})}
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Total Fee (Rs)</label>
                    <input 
                      required
                      type="number" 
                      className="input-field" 
                      placeholder="0"
                      value={newEntry.fee}
                      onChange={(e) => setNewEntry({...newEntry, fee: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Amount Paid (Rs)</label>
                    <input 
                      required
                      type="number" 
                      className="input-field" 
                      placeholder="0"
                      value={newEntry.paid}
                      onChange={(e) => setNewEntry({...newEntry, paid: Number(e.target.value)})}
                    />
                  </div>
                </div>
                
                <div className="pt-4 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-6 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all"
                  >
                    Save Entry
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
