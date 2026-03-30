import React from 'react';
import { ClipboardList, User, Calendar, Stethoscope, CheckCircle2, Search, Printer, Plus, FileText, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';

const doctors = [
  { id: '1', name: 'Dr. Emily Smith', specialization: 'Dermatologist' },
  { id: '2', name: 'Dr. James Wilson', specialization: 'Cosmetic Surgeon' },
  { id: '3', name: 'Dr. Sarah Chen', specialization: 'Aesthetic Specialist' },
];

const mockSlips = [
  { id: '1', tokenNumber: '101', patientName: 'Sarah Johnson', doctorName: 'Dr. Emily Smith', status: 'pending', date: new Date().toISOString() },
  { id: '2', tokenNumber: '102', patientName: 'Michael Brown', doctorName: 'Dr. James Wilson', status: 'consulted', date: new Date().toISOString() },
  { id: '3', tokenNumber: '103', patientName: 'Elena Rodriguez', doctorName: 'Dr. Emily Smith', status: 'pending', date: new Date().toISOString() },
];

export default function OPDManagement() {
  const [activeTab, setActiveTab] = React.useState<'list' | 'generate'>('list');
  const [selectedSlip, setSelectedSlip] = React.useState<any>(null);
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredSlips = mockSlips.filter(slip => 
    slip.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    slip.tokenNumber.includes(searchQuery)
  );

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('OPD Slip generated successfully!', {
      description: `Token Number: ${mockSlips.length + 104}`,
    });
    setActiveTab('list');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-10">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab('list')}
            className={cn(
              "px-8 py-3 rounded-xl text-sm font-bold transition-all",
              activeTab === 'list' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            Active Slips
          </button>
          <button
            onClick={() => setActiveTab('generate')}
            className={cn(
              "px-8 py-3 rounded-xl text-sm font-bold transition-all",
              activeTab === 'generate' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            Generate New
          </button>
        </div>

        {activeTab === 'list' && (
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search token or patient..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-12"
            />
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'list' ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredSlips.map((slip) => (
              <motion.div
                key={slip.id}
                whileHover={{ y: -5 }}
                className="glass-card p-8 rounded-3xl relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -mr-8 -mt-8 transition-all group-hover:bg-indigo-100" />
                <div className="relative">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">Token Number</p>
                      <h4 className="text-3xl font-display font-black text-indigo-600">#{slip.tokenNumber}</h4>
                    </div>
                    <span className={cn(
                      "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest",
                      slip.status === 'pending' ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"
                    )}>
                      {slip.status}
                    </span>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center text-slate-600">
                      <User size={16} className="mr-3 text-slate-400" />
                      <span className="text-sm font-bold">{slip.patientName}</span>
                    </div>
                    <div className="flex items-center text-slate-600">
                      <Stethoscope size={16} className="mr-3 text-slate-400" />
                      <span className="text-sm font-bold">{slip.doctorName}</span>
                    </div>
                    <div className="flex items-center text-slate-600">
                      <Calendar size={16} className="mr-3 text-slate-400" />
                      <span className="text-sm font-bold">{format(parseISO(slip.date), 'PP')}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={() => setSelectedSlip(slip)}
                      className="flex-1 py-3 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                    >
                      <Printer size={14} /> Print
                    </button>
                    <button className="flex-1 py-3 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                      Consult
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="generate"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-2xl mx-auto"
          >
            <div className="glass-card p-10 rounded-3xl">
              <h3 className="text-xl font-display font-bold text-slate-900 mb-10 flex items-center">
                <FileText className="mr-3 text-indigo-600" size={24} />
                Generate OPD Slip
              </h3>

              <form onSubmit={handleGenerate} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center">
                    <User size={14} className="mr-2" /> Patient Name / ID
                  </label>
                  <input 
                    required
                    className="input-field"
                    placeholder="Search patient by name or phone"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center">
                    <Stethoscope size={14} className="mr-2" /> Assign Doctor
                  </label>
                  <select 
                    required
                    className="input-field appearance-none"
                  >
                    <option value="">Select a doctor</option>
                    {doctors.map(doc => (
                      <option key={doc.id} value={doc.id}>{doc.name} ({doc.specialization})</option>
                    ))}
                  </select>
                </div>

                <div className="pt-6">
                  <button 
                    type="submit"
                    className="w-full py-5 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                  >
                    <FileText size={20} />
                    Generate & Print Slip
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slip Preview Modal */}
      <AnimatePresence>
        {selectedSlip && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="bg-indigo-600 p-8 text-white text-center relative">
                <button 
                  onClick={() => setSelectedSlip(null)}
                  className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-xl transition-all"
                >
                  <X size={20} />
                </button>
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Stethoscope size={32} />
                </div>
                <h3 className="text-2xl font-display font-black">DERMACARE CLINIC</h3>
                <p className="text-xs uppercase tracking-widest font-bold opacity-70">OPD Consultation Slip</p>
              </div>
              
              <div className="p-10 space-y-8">
                <div className="flex justify-between items-center pb-8 border-b border-slate-100">
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Token Number</p>
                    <p className="text-4xl font-display font-black text-indigo-600">#{selectedSlip.tokenNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Date</p>
                    <p className="font-bold text-slate-900">{format(parseISO(selectedSlip.date), 'PP')}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">Patient Details</p>
                    <p className="text-lg font-bold text-slate-900">{selectedSlip.patientName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">Assigned Doctor</p>
                    <p className="text-lg font-bold text-slate-900">{selectedSlip.doctorName}</p>
                  </div>
                </div>

                <div className="pt-8 flex gap-4">
                  <button 
                    onClick={() => { toast.success('Printing...'); setSelectedSlip(null); }}
                    className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
                  >
                    Print Now
                  </button>
                  <button 
                    onClick={() => setSelectedSlip(null)}
                    className="px-8 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
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
