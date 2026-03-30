import React from 'react';
import { Stethoscope, Pill, ClipboardList, Plus, Trash2, CheckCircle2, User, Activity, FileText, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

export default function ConsultationModule() {
  const [prescriptions, setPrescriptions] = React.useState<any[]>([]);
  const [diagnosis, setDiagnosis] = React.useState('');
  const [suggestedProcedures, setSuggestedProcedures] = React.useState<string[]>([]);
  const [isSaving, setIsSaving] = React.useState(false);

  const addPrescription = () => {
    setPrescriptions([...prescriptions, { id: Date.now(), medicine: '', dosage: '', duration: '' }]);
  };

  const removePrescription = (id: number) => {
    setPrescriptions(prescriptions.filter(p => p.id !== id));
  };

  const toggleProcedure = (proc: string) => {
    if (suggestedProcedures.includes(proc)) {
      setSuggestedProcedures(suggestedProcedures.filter(p => p !== proc));
    } else {
      setSuggestedProcedures([...suggestedProcedures, proc]);
    }
  };

  const saveConsultation = () => {
    if (!diagnosis) {
      toast.error('Please enter a diagnosis');
      return;
    }
    setIsSaving(true);
    setTimeout(() => {
      toast.success('Consultation saved successfully!');
      console.log({ diagnosis, prescriptions, suggestedProcedures });
      setIsSaving(false);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Consultation Form */}
        <div className="lg:col-span-2 space-y-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-10 rounded-3xl"
          >
            <h3 className="text-xl font-display font-bold text-slate-900 mb-10 flex items-center">
              <Stethoscope className="mr-3 text-indigo-600" size={24} />
              Doctor Consultation
            </h3>

            <div className="space-y-10">
              {/* Diagnosis Section */}
              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center">
                  <FileText size={14} className="mr-2" /> Diagnosis & Clinical Notes
                </label>
                <textarea 
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  rows={4}
                  className="input-field resize-none"
                  placeholder="Enter detailed diagnosis, symptoms, and clinical observations..."
                />
              </div>

              {/* Prescriptions Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center">
                    <Pill size={14} className="mr-2" /> Prescribed Medicines
                  </label>
                  <button 
                    onClick={addPrescription}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 bg-indigo-50 px-4 py-2 rounded-xl transition-all"
                  >
                    <Plus size={14} /> Add Medicine
                  </button>
                </div>

                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {prescriptions.map((p) => (
                      <motion.div 
                        key={p.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100 relative group"
                      >
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Medicine</p>
                          <input 
                            placeholder="Medicine Name"
                            className="w-full bg-white px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Dosage</p>
                          <input 
                            placeholder="e.g. 1-0-1 After Meal"
                            className="w-full bg-white px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                        <div className="space-y-2 relative">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Duration</p>
                          <div className="flex gap-2">
                            <input 
                              placeholder="e.g. 5 Days"
                              className="flex-1 bg-white px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <button 
                              onClick={() => removePrescription(p.id)}
                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {prescriptions.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-3xl">
                      <Pill size={40} className="mx-auto text-slate-200 mb-4" />
                      <p className="text-sm text-slate-400 font-medium italic">No medicines prescribed yet.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Procedures Section */}
              <div className="space-y-6">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center">
                  <Activity size={14} className="mr-2" /> Suggested Procedures
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {['Laser Hair Removal', 'Chemical Peel', 'HydraFacial', 'Botox', 'Fillers', 'Microneedling'].map((proc) => (
                    <button
                      key={proc}
                      onClick={() => toggleProcedure(proc)}
                      className={cn(
                        "px-4 py-4 rounded-2xl border text-xs font-bold transition-all",
                        suggestedProcedures.includes(proc)
                          ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100"
                          : "bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-slate-50"
                      )}
                    >
                      {proc}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <button 
                  onClick={saveConsultation}
                  disabled={isSaving}
                  className="w-full py-5 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                >
                  {isSaving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving Consultation...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={20} />
                      Complete & Save Consultation
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Patient Info Sidebar */}
        <div className="space-y-10">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-10 rounded-3xl"
          >
            <h4 className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-8">Patient Context</h4>
            <div className="flex items-center mb-10">
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mr-5 shadow-inner">
                <User size={32} />
              </div>
              <div>
                <h5 className="text-xl font-display font-bold text-slate-900">Sarah Johnson</h5>
                <p className="text-sm text-slate-500 font-medium">28 Years • Female • #101</p>
              </div>
            </div>
            
            <div className="space-y-8">
              <div className="p-6 bg-rose-50 rounded-2xl border border-rose-100">
                <div className="flex items-center gap-2 text-rose-600 mb-3">
                  <AlertCircle size={16} />
                  <p className="text-[10px] uppercase font-bold tracking-widest">Medical Alerts</p>
                </div>
                <p className="text-xs text-rose-700 font-bold leading-relaxed">
                  Allergic to Penicillin. History of mild eczema.
                </p>
              </div>
              
              <div className="space-y-2">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Last Visit</p>
                <p className="text-sm font-bold text-slate-700">15th Jan 2026 - Routine Checkup</p>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Vital Signs</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <p className="text-[10px] text-slate-400 font-bold">BP</p>
                    <p className="text-sm font-bold text-slate-700">120/80</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <p className="text-[10px] text-slate-400 font-bold">Pulse</p>
                    <p className="text-sm font-bold text-slate-700">72 bpm</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="glass-card p-8 rounded-3xl bg-slate-900 text-white">
            <div className="flex items-center mb-6">
              <ClipboardList size={20} className="mr-3 text-indigo-400" />
              <h4 className="text-sm font-bold">Next Steps</h4>
            </div>
            <ul className="space-y-4">
              {[
                'Prescription sent to Pharmacy',
                'Procedure slip sent to Desk',
                'Follow-up scheduled in 2 weeks'
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 size={12} className="text-indigo-400" />
                  </div>
                  <span className="text-xs text-slate-400 font-medium">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
