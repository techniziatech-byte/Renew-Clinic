import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Stethoscope, Pill, ClipboardList, Plus, Trash2, CheckCircle2, User, Activity, FileText, AlertCircle, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';

export default function ConsultationModule() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = React.useState<any>(null);
  const [prescriptions, setPrescriptions] = React.useState<any[]>([]);
  const [diagnosis, setDiagnosis] = React.useState('');
  const [vitals, setVitals] = React.useState({
    bp: '',
    pulse: '',
    weight: '',
    temp: ''
  });
  const [suggestedProcedures, setSuggestedProcedures] = React.useState<any[]>([]);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchPatient = async () => {
      if (!patientId) {
        setIsLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', patientId)
        .single();
      
      if (error) {
        console.error('Error fetching patient:', error);
        toast.error('Failed to load patient context');
      } else {
        setPatient(data);
      }
      setIsLoading(false);
    };
    fetchPatient();
  }, [patientId]);

  const addPrescription = () => {
    setPrescriptions([...prescriptions, { id: Date.now(), medicine: '', dosage: '', duration: '' }]);
  };

  const removePrescription = (id: number) => {
    setPrescriptions(prescriptions.filter(p => p.id !== id));
  };

  const updatePrescription = (id: number, field: string, value: string) => {
    setPrescriptions(prescriptions.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const toggleProcedure = (procName: string) => {
    const existing = suggestedProcedures.find(p => p.name === procName);
    if (existing) {
      setSuggestedProcedures(suggestedProcedures.filter(p => p.name !== procName));
    } else {
      setSuggestedProcedures([...suggestedProcedures, { name: procName, notes: '', fee: '0', paid: '0', recoveryTime: 'Immediate' }]);
    }
  };

  const updateProcedure = (index: number, field: string, value: string) => {
    const newProcs = [...suggestedProcedures];
    newProcs[index] = { ...newProcs[index], [field]: value };
    setSuggestedProcedures(newProcs);
  };

  const saveConsultation = async () => {
    if (!diagnosis) {
      toast.error('Please enter a diagnosis');
      return;
    }
    if (!patientId) {
      toast.error('No patient selected');
      return;
    }
    setIsSaving(true);
    
    const { error } = await supabase
      .from('consultations')
      .insert([{
        patient_id: patientId,
        diagnosis,
        vitals,
        prescriptions,
        suggested_procedures: suggestedProcedures
      }]);

    if (error) {
      console.error('Error saving consultation:', error);
      toast.error('Failed to save consultation');
    } else {
      toast.success('Consultation saved successfully!');
      // Update patient's last visit
      await supabase
        .from('patients')
        .update({ last_visit: new Date().toISOString().split('T')[0] })
        .eq('id', patientId);
      
      navigate(`/patients/${patientId}`);
    }
    setIsSaving(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-10">
      <div className="flex items-center gap-6 mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-display font-black text-slate-900">New Consultation</h2>
          <p className="text-slate-500 font-medium">Record diagnosis and treatment plan</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
        </div>
      ) : !patientId ? (
        <div className="glass-card p-10 rounded-3xl text-center">
          <User size={48} className="mx-auto text-slate-200 mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">No Patient Selected</h3>
          <p className="text-slate-500 mb-6">Please select a patient from the directory to start a consultation.</p>
          <button 
            onClick={() => navigate('/patients')}
            className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all"
          >
            Go to Directory
          </button>
        </div>
      ) : (
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
              {/* Vitals Section */}
              <div className="space-y-6">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center">
                  <Activity size={14} className="mr-2" /> Vital Signs
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Blood Pressure</p>
                    <input 
                      value={vitals.bp}
                      onChange={(e) => setVitals({ ...vitals, bp: e.target.value })}
                      placeholder="120/80"
                      className="w-full bg-white px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Pulse (bpm)</p>
                    <input 
                      value={vitals.pulse}
                      onChange={(e) => setVitals({ ...vitals, pulse: e.target.value })}
                      placeholder="72"
                      className="w-full bg-white px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Weight (kg)</p>
                    <input 
                      value={vitals.weight}
                      onChange={(e) => setVitals({ ...vitals, weight: e.target.value })}
                      placeholder="65"
                      className="w-full bg-white px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Temp (°F)</p>
                    <input 
                      value={vitals.temp}
                      onChange={(e) => setVitals({ ...vitals, temp: e.target.value })}
                      placeholder="98.6"
                      className="w-full bg-white px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

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
                            value={p.medicine}
                            onChange={(e) => updatePrescription(p.id, 'medicine', e.target.value)}
                            placeholder="Medicine Name"
                            className="w-full bg-white px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Dosage</p>
                          <input 
                            value={p.dosage}
                            onChange={(e) => updatePrescription(p.id, 'dosage', e.target.value)}
                            placeholder="e.g. 1-0-1 After Meal"
                            className="w-full bg-white px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                        <div className="space-y-2 relative">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Duration</p>
                          <div className="flex gap-2">
                            <input 
                              value={p.duration}
                              onChange={(e) => updatePrescription(p.id, 'duration', e.target.value)}
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
                  {['Laser Hair Removal', 'Chemical Peel', 'HydraFacial', 'Botox', 'Fillers', 'Microneedling'].map((proc) => {
                    const isSelected = suggestedProcedures.some(p => p.name === proc);
                    return (
                      <button
                        key={proc}
                        onClick={() => toggleProcedure(proc)}
                        className={cn(
                          "px-4 py-4 rounded-2xl border text-xs font-bold transition-all",
                          isSelected
                            ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100"
                            : "bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-slate-50"
                        )}
                      >
                        {proc}
                      </button>
                    );
                  })}
                </div>

                {/* Detailed Procedure Notes */}
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {suggestedProcedures.map((proc, index) => (
                      <motion.div
                        key={proc.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-indigo-900 flex items-center">
                            <Activity size={16} className="mr-2" /> {proc.name} Details
                          </h4>
                          <button 
                            onClick={() => toggleProcedure(proc.name)}
                            className="text-[10px] font-black text-rose-600 hover:text-rose-700 uppercase tracking-widest"
                          >
                            Remove
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Procedure Notes</p>
                            <textarea 
                              value={proc.notes}
                              onChange={(e) => updateProcedure(index, 'notes', e.target.value)}
                              placeholder="Specific instructions or areas to focus on..."
                              className="w-full bg-white px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                              rows={2}
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Estimated Fee (Rs)</p>
                              <input 
                                type="number"
                                min="0"
                                value={proc.fee}
                                onChange={(e) => updateProcedure(index, 'fee', e.target.value)}
                                placeholder="e.g. 500"
                                className="w-full bg-white px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>
                            <div className="space-y-2">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Paid Amount (Rs)</p>
                              <input 
                                type="number"
                                min="0"
                                value={proc.paid}
                                onChange={(e) => updateProcedure(index, 'paid', e.target.value)}
                                placeholder="0"
                                className="w-full bg-white px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>
                            <div className="space-y-2">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Recovery Time</p>
                              <input 
                                type="text"
                                value={proc.recoveryTime}
                                onChange={(e) => updateProcedure(index, 'recoveryTime', e.target.value)}
                                placeholder="e.g. 2-3 Days"
                                className="w-full bg-white px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
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
                <h5 className="text-xl font-display font-bold text-slate-900">{patient?.name || 'Loading...'}</h5>
                <p className="text-sm text-slate-500 font-medium">{patient?.age} Years • {patient?.gender} • #{String(patient?.id).slice(-4)}</p>
              </div>
            </div>
            
            <div className="space-y-8">
              <div className="p-6 bg-rose-50 rounded-2xl border border-rose-100">
                <div className="flex items-center gap-2 text-rose-600 mb-3">
                  <AlertCircle size={16} />
                  <p className="text-[10px] uppercase font-bold tracking-widest">Medical Alerts</p>
                </div>
                <p className="text-xs text-rose-700 font-bold leading-relaxed">
                  {patient?.medical_history || 'No medical history recorded.'}
                </p>
              </div>
              
              <div className="space-y-2">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Last Visit</p>
                <p className="text-sm font-bold text-slate-700">{patient?.last_visit || 'No previous visits'}</p>
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

              {suggestedProcedures.length > 0 && (
                <div className="pt-6 border-t border-slate-100 space-y-4">
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Procedure Summary</p>
                  <div className="space-y-4">
                    {suggestedProcedures.map((proc) => (
                      <div key={proc.name} className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-600 font-medium">{proc.name}</span>
                          <span className="text-slate-900 font-bold">${proc.fee || '0'}</span>
                        </div>
                        {proc.recoveryTime && (
                          <p className="text-[10px] text-slate-400 italic">Recovery: {proc.recoveryTime}</p>
                        )}
                      </div>
                    ))}
                    <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-900 uppercase">Total Est. Fee</span>
                      <span className="text-lg font-display font-bold text-indigo-600">
                        ${suggestedProcedures.reduce((acc, curr) => acc + (parseFloat(curr.fee) || 0), 0)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
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
      )}
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
