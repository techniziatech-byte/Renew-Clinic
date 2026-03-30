import React from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  FileText, 
  History, 
  ChevronRight, 
  Activity, 
  ShieldCheck, 
  Download,
  ExternalLink,
  Search,
  Filter,
  Bell,
  AlertCircle,
  Stethoscope,
  ClipboardList
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import { cn } from '../lib/utils';

export default function PatientPortal() {
  const [activeTab, setActiveTab] = React.useState<'appointments' | 'records' | 'profile' | 'history'>('appointments');

  const upcomingAppointments = [
    { id: '1', doctor: 'Dr. Emily Smith', date: '2026-04-05', time: '10:30 AM', type: 'Follow-up', status: 'Confirmed' },
    { id: '2', doctor: 'Dr. James Wilson', date: '2026-04-12', time: '02:00 PM', type: 'Consultation', status: 'Pending' },
  ];

  const appointmentHistory = [
    { id: 'h1', doctor: 'Dr. Emily Smith', date: '2026-03-15', time: '09:00 AM', type: 'Initial Consultation', diagnosis: 'Mild Acne' },
    { id: 'h2', doctor: 'Dr. Sarah Chen', date: '2026-02-20', time: '11:30 AM', type: 'Procedure', diagnosis: 'Chemical Peel' },
  ];

  const medicalRecords = [
    { id: 'r1', title: 'Blood Test Results', date: '2026-03-16', type: 'Laboratory', size: '1.2 MB' },
    { id: 'r2', title: 'Prescription - Acne Treatment', date: '2026-03-15', type: 'Prescription', size: '450 KB' },
    { id: 'r3', title: 'Skin Analysis Report', date: '2026-02-20', type: 'Diagnostic', size: '2.8 MB' },
  ];

  const medicalHistory = {
    conditions: [
      { id: 'c1', name: 'Mild Acne', diagnosedDate: '2026-03-15', status: 'Ongoing' },
      { id: 'c2', name: 'Seasonal Allergies', diagnosedDate: '2024-05-10', status: 'Managed' },
    ],
    allergies: [
      { id: 'a1', substance: 'Penicillin', severity: 'High' },
      { id: 'a2', substance: 'Latex', severity: 'Moderate' },
    ],
    notes: [
      { id: 'n1', date: '2026-03-15', content: 'Patient responded well to initial topical treatment. Advised to avoid direct sunlight.' },
      { id: 'n2', date: '2026-02-20', content: 'Chemical peel procedure completed without complications.' },
    ]
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-3xl bg-indigo-600 flex items-center justify-center shadow-xl shadow-indigo-200 text-white relative">
            <User size={40} />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full"></div>
          </div>
          <div>
            <h2 className="text-3xl font-display font-black text-slate-900">John Doe</h2>
            <p className="text-slate-500 font-medium flex items-center gap-2">
              Patient ID: <span className="text-indigo-600 font-bold">DC-8842</span>
              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
              Member since 2024
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-all relative">
            <Bell size={20} />
            <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
          </button>
          <button className="flex items-center px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-[0.98] gap-3">
            <Calendar size={20} />
            Book New Appointment
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit">
        {[
          { id: 'appointments', name: 'Appointments', icon: Calendar },
          { id: 'history', name: 'Medical History', icon: History },
          { id: 'records', name: 'Medical Records', icon: FileText },
          { id: 'profile', name: 'My Profile', icon: User },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center px-8 py-3 rounded-xl text-xs font-bold transition-all",
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-10">
          <AnimatePresence mode="wait">
            {activeTab === 'appointments' && (
              <motion.div
                key="appointments"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-10"
              >
                {/* Upcoming */}
                <div className="glass-card p-10 rounded-3xl">
                  <h3 className="text-xl font-display font-bold text-slate-900 mb-8 flex items-center gap-3">
                    <Clock className="text-indigo-600" size={24} />
                    Upcoming Appointments
                  </h3>
                  <div className="space-y-6">
                    {upcomingAppointments.map((apt) => (
                      <div key={apt.id} className="p-8 rounded-3xl border border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-indigo-200 transition-all">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-white rounded-2xl shadow-inner flex items-center justify-center text-indigo-600">
                            <Calendar size={28} />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">{apt.type}</p>
                            <h4 className="text-lg font-bold text-slate-900">{apt.doctor}</h4>
                            <div className="flex items-center gap-4 mt-1 text-sm text-slate-500 font-medium">
                              <span className="flex items-center gap-1.5">
                                <Calendar size={14} className="text-slate-400" />
                                {format(new Date(apt.date), 'PPPP')}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Clock size={14} className="text-slate-400" />
                                {apt.time}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <span className={cn(
                            "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                            apt.status === 'Confirmed' ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                          )}>
                            {apt.status}
                          </span>
                          <button className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-slate-200">
                            <ChevronRight size={20} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* History */}
                <div className="glass-card p-10 rounded-3xl">
                  <h3 className="text-xl font-display font-bold text-slate-900 mb-8 flex items-center gap-3">
                    <History className="text-indigo-600" size={24} />
                    Appointment History
                  </h3>
                  <div className="space-y-4">
                    {appointmentHistory.map((apt) => (
                      <div key={apt.id} className="p-6 rounded-2xl border border-slate-100 flex items-center justify-between group hover:bg-slate-50 transition-all">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                            <Activity size={20} />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900">{apt.doctor}</h4>
                            <p className="text-xs text-slate-500 font-medium">
                              {format(new Date(apt.date), 'MMM d, yyyy')} • {apt.diagnosis}
                            </p>
                          </div>
                        </div>
                        <button className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
                          View Summary
                          <ExternalLink size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'history' && (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-10"
              >
                {/* Past Conditions */}
                <div className="glass-card p-10 rounded-3xl">
                  <h3 className="text-xl font-display font-bold text-slate-900 mb-8 flex items-center gap-3">
                    <Stethoscope className="text-indigo-600" size={24} />
                    Past Conditions
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {medicalHistory.conditions.map((condition) => (
                      <div key={condition.id} className="p-6 rounded-3xl border border-slate-100 bg-slate-50/50 flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-slate-900">{condition.name}</h4>
                          <p className="text-xs text-slate-500 font-medium">Diagnosed: {format(new Date(condition.diagnosedDate), 'MMM d, yyyy')}</p>
                        </div>
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                          condition.status === 'Ongoing' ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"
                        )}>
                          {condition.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Allergies */}
                <div className="glass-card p-10 rounded-3xl">
                  <h3 className="text-xl font-display font-bold text-slate-900 mb-8 flex items-center gap-3">
                    <AlertCircle className="text-rose-500" size={24} />
                    Allergies
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {medicalHistory.allergies.map((allergy) => (
                      <div key={allergy.id} className="p-6 rounded-3xl border border-slate-100 bg-rose-50/30 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-rose-500 shadow-sm">
                            <AlertCircle size={20} />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900">{allergy.substance}</h4>
                            <p className="text-xs text-slate-500 font-medium">Severity: <span className="text-rose-600 font-bold">{allergy.severity}</span></p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Medical Notes */}
                <div className="glass-card p-10 rounded-3xl">
                  <h3 className="text-xl font-display font-bold text-slate-900 mb-8 flex items-center gap-3">
                    <ClipboardList className="text-indigo-600" size={24} />
                    Relevant Notes
                  </h3>
                  <div className="space-y-6">
                    {medicalHistory.notes.map((note) => (
                      <div key={note.id} className="p-6 rounded-3xl border border-slate-100 bg-slate-50/50">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Medical Note</span>
                          <span className="text-xs text-slate-400 font-medium">{format(new Date(note.date), 'MMM d, yyyy')}</span>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed font-medium">{note.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'records' && (
              <motion.div
                key="records"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass-card p-10 rounded-3xl"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                  <h3 className="text-xl font-display font-bold text-slate-900 flex items-center gap-3">
                    <FileText className="text-indigo-600" size={24} />
                    Medical Records
                  </h3>
                  <div className="flex gap-4">
                    <div className="relative w-full md:w-64">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="text" 
                        placeholder="Search records..." 
                        className="input-field pl-12 py-2.5 text-sm"
                      />
                    </div>
                    <button className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-slate-200">
                      <Filter size={18} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {medicalRecords.map((record) => (
                    <div key={record.id} className="p-6 rounded-3xl border border-slate-100 bg-slate-50/50 group hover:border-indigo-200 transition-all">
                      <div className="flex items-start justify-between mb-6">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-inner flex items-center justify-center text-indigo-600">
                          <FileText size={24} />
                        </div>
                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                          <Download size={18} />
                        </button>
                      </div>
                      <h4 className="font-bold text-slate-900 mb-1">{record.title}</h4>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{record.type}</p>
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <span className="text-xs text-slate-500 font-medium">{record.date}</span>
                        <span className="text-xs text-slate-400 font-bold">{record.size}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass-card p-10 rounded-3xl"
              >
                <h3 className="text-xl font-display font-bold text-slate-900 mb-10">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                      <p className="text-lg font-bold text-slate-900">John Doe</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</label>
                      <p className="text-lg font-bold text-slate-900">john.doe@example.com</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Number</label>
                      <p className="text-lg font-bold text-slate-900">+1 (555) 000-1234</p>
                    </div>
                  </div>
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date of Birth</label>
                      <p className="text-lg font-bold text-slate-900">May 15, 1990</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Blood Group</label>
                      <p className="text-lg font-bold text-slate-900">O Positive</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Emergency Contact</label>
                      <p className="text-lg font-bold text-slate-900">Jane Doe (+1 555-000-5678)</p>
                    </div>
                  </div>
                </div>
                <div className="mt-12 pt-10 border-t border-slate-100">
                  <button className="px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all text-xs uppercase tracking-widest">
                    Edit Profile Details
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-10">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-10 rounded-3xl bg-indigo-600 text-white"
          >
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-8">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-2xl font-display font-bold mb-4">Secure Health Data</h3>
            <p className="text-indigo-100 leading-relaxed mb-10 font-medium">
              Your medical records are encrypted and stored securely. Only you and authorized medical staff can access this information.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm font-bold">
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                HIPAA Compliant
              </div>
              <div className="flex items-center gap-3 text-sm font-bold">
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                End-to-End Encrypted
              </div>
            </div>
          </motion.div>

          <div className="glass-card p-10 rounded-3xl">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">Health Summary</h4>
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500">
                    <Activity size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Heart Rate</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Last checked: 2 days ago</p>
                  </div>
                </div>
                <span className="text-lg font-black text-slate-900">72 <span className="text-xs text-slate-400">BPM</span></span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center text-sky-500">
                    <Activity size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Blood Pressure</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Last checked: 2 days ago</p>
                  </div>
                </div>
                <span className="text-lg font-black text-slate-900">120/80</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
