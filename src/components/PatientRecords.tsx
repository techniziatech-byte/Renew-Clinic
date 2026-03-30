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
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';

const MOCK_PATIENTS = [
  { id: '1', name: 'John Doe', phone: '1234567890', age: 35, gender: 'male', address: '123 Main St, City', medicalHistory: 'None', lastVisit: '2026-03-15' },
  { id: '2', name: 'Sarah Johnson', phone: '9876543210', age: 28, gender: 'female', address: '456 Oak Ave, Town', medicalHistory: 'Allergic to Penicillin', lastVisit: '2026-03-20' },
  { id: '3', name: 'Michael Brown', phone: '5551234567', age: 42, gender: 'male', address: '789 Pine Rd, Village', medicalHistory: 'Hypertension', lastVisit: '2026-03-10' },
  { id: '4', name: 'Emily Davis', phone: '4449876543', age: 31, gender: 'female', address: '321 Elm St, Suburb', medicalHistory: 'None', lastVisit: '2026-03-25' },
];

export default function PatientRecords() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState<'overview' | 'consultations' | 'procedures' | 'files'>('overview');

  const patient = MOCK_PATIENTS.find(p => p.id === id) || MOCK_PATIENTS[0];

  const consultations = [
    { id: 'c1', date: '2026-03-15', doctor: 'Dr. Emily Smith', diagnosis: 'Mild Acne', treatment: 'Topical Cream' },
    { id: 'c2', date: '2026-01-10', doctor: 'Dr. Emily Smith', diagnosis: 'Routine Checkup', treatment: 'None' },
  ];

  const procedures = [
    { id: 'p1', date: '2026-02-20', name: 'Chemical Peel', doctor: 'Dr. Sarah Chen', status: 'Completed', fee: '$250', recoveryTime: '2 Days' },
    { id: 'p2', date: '2026-03-15', name: 'HydraFacial', doctor: 'Dr. Emily Smith', status: 'Scheduled', fee: '$150', recoveryTime: 'None' },
  ];

  return (
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
            <h2 className="text-3xl font-display font-black text-slate-900">{patient.name}</h2>
            <p className="text-slate-500 font-medium">Patient ID: <span className="text-indigo-600 font-bold">#DC-{patient.id.padStart(4, '0')}</span></p>
          </div>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/consultations')}
            className="flex items-center px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all gap-2 text-sm"
          >
            <Plus size={18} /> New Consultation
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Age / Gender', value: `${patient.age}y / ${patient.gender}`, icon: User, color: 'text-sky-600 bg-sky-50' },
          { label: 'Last Visit', value: patient.lastVisit, icon: Calendar, color: 'text-indigo-600 bg-indigo-50' },
          { label: 'Total Visits', value: '12', icon: Activity, color: 'text-emerald-600 bg-emerald-50' },
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
                      {patient.medicalHistory}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Address</p>
                      <p className="text-sm font-medium text-slate-700">{patient.address}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phone</p>
                      <p className="text-sm font-medium text-slate-700">{patient.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-8 rounded-3xl">
                  <h3 className="text-lg font-display font-bold text-slate-900 mb-6">Recent Activity</h3>
                  <div className="space-y-4">
                    {consultations.map((c) => (
                      <div key={c.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-50 hover:bg-slate-50 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                            <Stethoscope size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">Consultation with {c.doctor}</p>
                            <p className="text-xs text-slate-500">{c.date} • {c.diagnosis}</p>
                          </div>
                        </div>
                        <button className="text-xs font-bold text-indigo-600 hover:underline">View Details</button>
                      </div>
                    ))}
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
                          <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">{c.date}</p>
                          <h4 className="text-lg font-bold text-slate-900">{c.diagnosis}</h4>
                        </div>
                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                          <Download size={18} />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Doctor</p>
                          <p className="text-sm font-medium text-slate-700">{c.doctor}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Treatment</p>
                          <p className="text-sm font-medium text-slate-700">{c.treatment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
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
                  {procedures.map((p) => (
                    <div key={p.id} className="p-6 rounded-3xl border border-slate-100 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">{p.date}</p>
                          <h4 className="text-lg font-bold text-slate-900">{p.name}</h4>
                        </div>
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                          p.status === 'Completed' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                        )}>
                          {p.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-50">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Doctor</p>
                          <p className="text-sm font-medium text-slate-700">{p.doctor}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Fee</p>
                          <p className="text-sm font-bold text-slate-900">{p.fee}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Recovery</p>
                          <p className="text-sm font-medium text-slate-700">{p.recoveryTime}</p>
                        </div>
                      </div>
                    </div>
                  ))}
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
                <span className="text-sm font-bold text-slate-900">120/80</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-600">Heart Rate</span>
                <span className="text-sm font-bold text-slate-900">72 bpm</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-600">Weight</span>
                <span className="text-sm font-bold text-slate-900">68 kg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-600">Temperature</span>
                <span className="text-sm font-bold text-slate-900">98.6 °F</span>
              </div>
            </div>
            <button className="w-full mt-8 py-3 border border-slate-100 text-slate-500 text-xs font-bold rounded-xl hover:bg-slate-50 transition-all">
              Update Vitals
            </button>
          </div>

          <div className="glass-card p-8 rounded-3xl bg-slate-900 text-white">
            <h4 className="text-sm font-bold mb-6 flex items-center gap-2">
              <ClipboardList size={18} className="text-indigo-400" />
              Active Prescriptions
            </h4>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-xs font-bold text-white">Tretinoin 0.05% Cream</p>
                <p className="text-[10px] text-slate-400">Apply nightly before bed</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-xs font-bold text-white">Doxycycline 100mg</p>
                <p className="text-[10px] text-slate-400">Once daily after meal</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
