import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  User, 
  FileText, 
  History, 
  ChevronLeft, 
  Activity, 
  Download,
  ExternalLink,
  Stethoscope,
  ClipboardList,
  AlertCircle,
  Plus,
  Eye,
  Printer,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { supabase } from '../lib/supabase';

export default function PatientRecords() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState<'overview' | 'consultations' | 'procedures' | 'files'>('overview');
  const [selectedProcedure, setSelectedProcedure] = React.useState<any>(null);
  const [patient, setPatient] = React.useState<any>(null);
  const [consultations, setConsultations] = React.useState<any[]>([]);
  const [medicalFiles, setMedicalFiles] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchData = async () => {
    if (!id) return;
    setIsLoading(true);
    
    // Fetch patient
    const { data: patientData, error: patientError } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .single();

    if (patientError) {
      console.error('Error fetching patient:', patientError);
      toast.error('Patient not found');
      navigate('/patients');
      return;
    }
    setPatient(patientData);

    // Fetch consultations
    const { data: consultationData, error: consultationError } = await supabase
      .from('consultations')
      .select('*')
      .eq('patient_id', id)
      .order('created_at', { ascending: false });

    if (consultationError) {
      console.error('Error fetching consultations:', consultationError);
    } else {
      setConsultations(consultationData || []);
    }

    // Fetch medical files
    const { data: fileData, error: fileError } = await supabase
      .from('medical_files')
      .select('*')
      .eq('patient_id', id)
      .order('created_at', { ascending: false });

    if (fileError) {
      console.error('Error fetching files:', fileError);
    } else {
      setMedicalFiles(fileData || []);
    }

    setIsLoading(false);
  };

  React.useEffect(() => {
    fetchData();
  }, [id]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !id) return;

    toast.loading(`Uploading ${file.name}...`);
    
    // 1. Upload to Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${id}/${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from('medical-files')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      toast.dismiss();
      toast.error('Failed to upload file to storage');
      return;
    }

    // 2. Get Public URL
    const { data: { publicUrl } } = supabase.storage
      .from('medical-files')
      .getPublicUrl(filePath);

    // 3. Save to Database
    const { error: dbError } = await supabase
      .from('medical_files')
      .insert([{
        patient_id: id,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        type: file.type.includes('pdf') ? 'PDF' : 'Image',
        url: publicUrl
      }]);

    toast.dismiss();
    if (dbError) {
      console.error('Database error:', dbError);
      toast.error('Failed to save file record');
    } else {
      toast.success('File uploaded successfully!');
      fetchData();
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto space-y-8 pb-10">
        {/* Back Button & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/patients')}
            className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h2 className="text-3xl font-display font-black text-slate-900">{patient?.name || 'Loading...'}</h2>
            <p className="text-slate-500 font-medium">Patient ID: <span className="text-indigo-600 font-bold">#DC-{String(patient?.id || '').slice(-4)}</span></p>
          </div>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => navigate(`/consultations/${patient?.id}`)}
            className="flex items-center px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all gap-2 text-sm"
          >
            <Plus size={18} /> New Consultation
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Age / Gender', value: `${patient?.age}y / ${patient?.gender}`, icon: User, color: 'text-sky-600 bg-sky-50' },
              { label: 'Last Visit', value: patient?.last_visit || 'N/A', icon: Calendar, color: 'text-indigo-600 bg-indigo-50' },
              { label: 'Total Visits', value: consultations.length.toString(), icon: Activity, color: 'text-emerald-600 bg-emerald-50' },
              { label: 'Balance Due', value: '$0.00', icon: ClipboardList, color: 'text-rose-600 bg-rose-50' },
            ].map((stat, i) => (
              <div key={i} className="glass-card p-6 rounded-3xl flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-lg font-bold text-slate-900">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit">
        {[
          { id: 'overview', name: 'Overview', icon: Activity },
          { id: 'consultations', name: 'Consultations', icon: Stethoscope },
          { id: 'procedures', name: 'Procedures', icon: ClipboardList },
          { id: 'files', name: 'Medical Files', icon: FileText },
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
            <tab.icon size={14} className="mr-2" />
            {tab.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="glass-card p-8 rounded-3xl">
                  <h3 className="text-lg font-display font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <AlertCircle className="text-rose-500" size={20} />
                    Medical Alerts & History
                  </h3>
                  <div className="p-6 bg-rose-50 rounded-2xl border border-rose-100 mb-6">
                    <p className="text-sm text-rose-700 font-bold leading-relaxed">
                      {patient?.medical_history || 'No medical history recorded.'}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Address</p>
                      <p className="text-sm font-medium text-slate-700">{patient?.address}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phone</p>
                      <p className="text-sm font-medium text-slate-700">{patient?.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-8 rounded-3xl">
                  <h3 className="text-lg font-display font-bold text-slate-900 mb-6">Recent Activity</h3>
                  <div className="space-y-4">
                    {consultations.slice(0, 3).map((c) => (
                      <div key={c.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-50 hover:bg-slate-50 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                            <Stethoscope size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">Consultation</p>
                            <p className="text-xs text-slate-500">{new Date(c.created_at).toLocaleDateString()} • {c.diagnosis}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setActiveTab('consultations')}
                          className="text-xs font-bold text-indigo-600 hover:underline"
                        >
                          View Details
                        </button>
                      </div>
                    ))}
                    {consultations.length === 0 && (
                      <p className="text-sm text-slate-400 italic text-center py-4">No recent activity.</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'consultations' && (
              <motion.div
                key="consultations"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass-card p-8 rounded-3xl"
              >
                <h3 className="text-lg font-display font-bold text-slate-900 mb-8">Consultation History</h3>
                <div className="space-y-6">
                  {consultations.map((c) => (
                    <div key={c.id} className="p-6 rounded-3xl border border-slate-100 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">{new Date(c.created_at).toLocaleDateString()}</p>
                          <h4 className="text-lg font-bold text-slate-900">{c.diagnosis}</h4>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-slate-50">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Prescriptions</p>
                        <div className="flex flex-wrap gap-2">
                          {c.prescriptions?.map((p: any, i: number) => (
                            <span key={i} className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-medium text-slate-600">
                              {p.medicine} ({p.dosage})
                            </span>
                          ))}
                          {(!c.prescriptions || c.prescriptions.length === 0) && <span className="text-xs text-slate-400 italic">None</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                  {consultations.length === 0 && (
                    <div className="text-center py-12">
                      <Stethoscope size={40} className="mx-auto text-slate-200 mb-4" />
                      <p className="text-sm text-slate-400 italic">No consultations recorded yet.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'procedures' && (
              <motion.div
                key="procedures"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass-card p-8 rounded-3xl"
              >
                <h3 className="text-lg font-display font-bold text-slate-900 mb-8">Procedure History</h3>
                <div className="space-y-6">
                  {consultations.flatMap(c => (c.suggested_procedures || []).map((p: any) => ({ ...p, date: c.created_at }))).map((p: any, i: number) => (
                    <div key={i} className="p-6 rounded-3xl border border-slate-100 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-lg font-bold text-slate-900">{p.name}</h4>
                          <p className="text-xs text-slate-500 mt-1">{p.notes}</p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-50 text-amber-600">
                          Suggested
                        </span>
                      </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-50">
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Estimated Fee</p>
                            <p className="text-sm font-bold text-slate-900">Rs {p.fee}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Paid Amount</p>
                            <p className="text-sm font-bold text-indigo-600">Rs {p.paid || 0}</p>
                          </div>
                          <div className="flex items-end justify-end">
                            <button 
                              onClick={() => setSelectedProcedure(p)}
                              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-600 text-xs font-bold rounded-xl transition-all"
                            >
                              <Printer size={14} />
                              Print Slip
                            </button>
                          </div>
                        </div>
                    </div>
                  ))}
                  {consultations.every(c => !c.suggested_procedures || c.suggested_procedures.length === 0) && (
                    <div className="text-center py-12">
                      <ClipboardList size={40} className="mx-auto text-slate-200 mb-4" />
                      <p className="text-sm text-slate-400 italic">No procedures suggested yet.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'files' && (
              <motion.div
                key="files"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass-card p-8 rounded-3xl"
              >
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-display font-bold text-slate-900">Medical Files & Reports</h3>
                  <label className="cursor-pointer px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all flex items-center gap-2 text-sm">
                    <Plus size={18} />
                    Upload Document
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {medicalFiles.map((file) => (
                    <div key={file.id} className="p-6 rounded-3xl border border-slate-100 flex items-center justify-between hover:bg-slate-50 transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-all">
                          <FileText size={24} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{file.name}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{new Date(file.created_at).toLocaleDateString()} • {file.size}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <a 
                          href={file.url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        >
                          <Download size={18} />
                        </a>
                        <a 
                          href={file.url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        >
                          <Eye size={18} />
                        </a>
                      </div>
                    </div>
                  ))}
                  {medicalFiles.length === 0 && (
                    <div className="col-span-full text-center py-12">
                      <FileText size={40} className="mx-auto text-slate-200 mb-4" />
                      <p className="text-sm text-slate-400 italic">No medical files uploaded yet.</p>
                    </div>
                  )}
                </div>

                <div className="mt-10 p-8 border-2 border-dashed border-slate-100 rounded-3xl text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText size={32} className="text-slate-200" />
                  </div>
                  <p className="text-sm text-slate-400 font-medium italic">Drag and drop more files here to upload to patient record.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-8">
          <div className="glass-card p-8 rounded-3xl">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Vital Signs (Latest)</h4>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-600">Blood Pressure</span>
                <span className="text-sm font-bold text-slate-900">{consultations[0]?.vitals?.bp || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-600">Heart Rate</span>
                <span className="text-sm font-bold text-slate-900">{consultations[0]?.vitals?.pulse ? `${consultations[0].vitals.pulse} bpm` : 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-600">Weight</span>
                <span className="text-sm font-bold text-slate-900">{consultations[0]?.vitals?.weight ? `${consultations[0].vitals.weight} kg` : 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-600">Temperature</span>
                <span className="text-sm font-bold text-slate-900">{consultations[0]?.vitals?.temp ? `${consultations[0].vitals.temp} °F` : 'N/A'}</span>
              </div>
            </div>
            <button 
              onClick={() => navigate(`/consultations/${patient?.id}`)}
              className="w-full mt-8 py-3 border border-slate-100 text-slate-500 text-xs font-bold rounded-xl hover:bg-slate-50 transition-all"
            >
              Update Vitals
            </button>
          </div>

          <div className="glass-card p-8 rounded-3xl bg-slate-900 text-white">
            <h4 className="text-sm font-bold mb-6 flex items-center gap-2">
              <ClipboardList size={18} className="text-indigo-400" />
              Active Prescriptions
            </h4>
            <div className="space-y-4">
              {consultations.flatMap(c => c.prescriptions || []).slice(0, 5).map((p: any, i: number) => (
                <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <p className="text-xs font-bold text-white">{p.medicine}</p>
                  <p className="text-[10px] text-slate-400">{p.dosage} • {p.duration}</p>
                </div>
              ))}
              {consultations.every(c => !c.prescriptions || c.prescriptions.length === 0) && (
                <p className="text-xs text-slate-500 italic">No active prescriptions.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      </>
    )}
  </div>

  {/* Procedure Slip Modal */}
  <AnimatePresence>
    {selectedProcedure && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden relative"
        >
          <button 
            onClick={() => setSelectedProcedure(null)}
            className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all z-10 print:hidden"
          >
            <X size={20} />
          </button>

          <div className="p-10" id="procedure-slip">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
                <Activity size={32} className="text-white" />
              </div>
              <h2 className="text-2xl font-display font-bold text-slate-900">Procedure Slip</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">Dermatology & Aesthetic Clinic</p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-8 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Treatment No.</p>
                  <p className="text-sm font-bold text-slate-900">#PROC-{Math.floor(1000 + Math.random() * 9000)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</p>
                  <p className="text-sm font-bold text-slate-900">{new Date(selectedProcedure.date).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="space-y-4 px-2">
                <div className="flex justify-between items-center py-3 border-b border-slate-100">
                  <span className="text-sm font-medium text-slate-500">Patient Name</span>
                  <span className="text-sm font-bold text-slate-900">{patient?.name}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-100">
                  <span className="text-sm font-medium text-slate-500">Procedure</span>
                  <span className="text-sm font-bold text-indigo-600">{selectedProcedure.name}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-100">
                  <span className="text-sm font-medium text-slate-500">Total Fee</span>
                  <span className="text-sm font-bold text-slate-900">Rs {selectedProcedure.fee}</span>
                </div>
                <div className="flex justify-between items-center py-4 bg-indigo-50/50 px-4 rounded-2xl">
                  <span className="text-sm font-bold text-indigo-900">Paid Amount</span>
                  <span className="text-lg font-black text-indigo-600">Rs {selectedProcedure.paid || 0}</span>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-slate-100 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Authorized Signature</p>
              <div className="w-40 h-px bg-slate-200 mx-auto mb-10"></div>
              
              <button 
                onClick={() => {
                  window.print();
                  toast.success('Preparing for print...');
                }}
                className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-200 print:hidden"
              >
                <Printer size={18} />
                Print Procedure Slip
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
</>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
