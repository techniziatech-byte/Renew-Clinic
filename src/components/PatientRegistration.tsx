import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Search, UserPlus, History, MapPin, Phone, User, Calendar as CalendarIcon, Users, Filter, ArrowRight, Edit2, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';

const patientSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  age: z.number().min(0).max(120),
  gender: z.enum(['male', 'female', 'other']),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  medicalHistory: z.string().optional(),
});

type PatientFormValues = z.infer<typeof patientSchema>;

export default function PatientRegistration() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialTab = (searchParams.get('tab') as 'registration' | 'directory') || 'registration';
  const [activeTab, setActiveTab] = React.useState<'registration' | 'directory'>(initialTab);
  const [searchPhone, setSearchPhone] = React.useState('');
  const [isSearching, setIsSearching] = React.useState(false);
  const [existingPatient, setExistingPatient] = React.useState<any>(null);
  const [directorySearch, setDirectorySearch] = React.useState('');
  const [genderFilter, setGenderFilter] = React.useState<string>('all');
  const [ageRange, setAgeRange] = React.useState({ min: 0, max: 120 });
  const [showFilters, setShowFilters] = React.useState(false);
  const [patients, setPatients] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      gender: 'male',
    }
  });

  const fetchPatients = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching patients:', error);
      toast.error(`Failed to load patient directory: ${error.message || 'Unknown error'}`);
    } else {
      setPatients(data || []);
    }
    setIsLoading(false);
  };

  React.useEffect(() => {
    fetchPatients();
  }, []);

  const handleSearch = async () => {
    if (!searchPhone) return;
    setIsSearching(true);
    
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('phone', searchPhone)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Search error:', error);
      toast.error('Error searching for patient');
    } else if (data) {
      setExistingPatient(data);
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'id' && key !== 'created_at' && key !== 'last_visit') {
          setValue(key as any, value);
        }
      });
      toast.success('Patient record found!');
    } else {
      setExistingPatient(null);
      reset({ phone: searchPhone });
      toast.info('No existing record found. Please register.');
    }
    setIsSearching(false);
  };

  const onSubmit = async (data: PatientFormValues) => {
    setIsSearching(true);
    const patientData = {
      ...data,
      last_visit: new Date().toISOString().split('T')[0]
    };

    let error;
    if (existingPatient) {
      const { error: updateError } = await supabase
        .from('patients')
        .update(patientData)
        .eq('id', existingPatient.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('patients')
        .insert([patientData]);
      error = insertError;
    }

    if (error) {
      console.error('Save error:', error);
      toast.error('Failed to save patient record');
    } else {
      toast.success(existingPatient ? 'Patient record updated!' : 'Patient registered successfully!');
      reset({
        name: '',
        phone: '',
        age: 0,
        gender: 'male',
        address: '',
        medicalHistory: '',
      });
      setExistingPatient(null);
      setSearchPhone('');
      fetchPatients();
      setActiveTab('directory');
      setSearchParams({ tab: 'directory' });
    }
    setIsSearching(false);
  };

  const filteredPatients = patients.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(directorySearch.toLowerCase()) ||
                         p.phone.includes(directorySearch);
    const matchesGender = genderFilter === 'all' || p.gender === genderFilter;
    const matchesAge = p.age >= ageRange.min && p.age <= ageRange.max;
    
    return matchesSearch && matchesGender && matchesAge;
  });

  const editPatient = (patient: any) => {
    setExistingPatient(patient);
    Object.entries(patient).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'lastVisit') {
        setValue(key as any, value);
      }
    });
    setSearchPhone(patient.phone);
    setActiveTab('registration');
    setSearchParams({ tab: 'registration' });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight">Patient Management</h2>
          <p className="text-slate-500 font-medium">Register new patients or manage existing records</p>
        </div>
        
        <div className="flex bg-slate-100 p-1.5 rounded-2xl">
          <button 
            onClick={() => { setActiveTab('registration'); setSearchParams({ tab: 'registration' }); }}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
              activeTab === 'registration' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <UserPlus size={16} /> Registration
          </button>
          <button 
            onClick={() => { setActiveTab('directory'); setSearchParams({ tab: 'directory' }); }}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
              activeTab === 'directory' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <Users size={16} /> Directory
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'registration' ? (
          <motion.div 
            key="registration"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Search Section */}
            <div className="glass-card p-8 rounded-3xl">
              <h3 className="text-lg font-display font-bold text-slate-900 mb-6 flex items-center">
                <Search className="mr-3 text-indigo-600" size={20} />
                Quick Search by Phone
              </h3>
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Enter Phone Number (Try 1234567890)" 
                    value={searchPhone}
                    onChange={(e) => setSearchPhone(e.target.value)}
                    className="input-field pl-14"
                  />
                </div>
                <button 
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all disabled:opacity-50 active:scale-95"
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </button>
              </div>
            </div>

            {/* Registration Form */}
            <div className="glass-card p-10 rounded-3xl">
              <h3 className="text-xl font-display font-bold text-slate-900 mb-10 flex items-center">
                <UserPlus className="mr-3 text-indigo-600" size={24} />
                {existingPatient ? 'Update Patient Details' : 'New Patient Registration'}
              </h3>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center">
                      <User size={14} className="mr-2" /> Full Name
                    </label>
                    <input 
                      {...register('name')}
                      className="input-field"
                      placeholder="Enter patient name"
                    />
                    {errors.name && <p className="text-xs text-rose-500 font-bold mt-1">{errors.name.message}</p>}
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center">
                      <Phone size={14} className="mr-2" /> Phone Number
                    </label>
                    <input 
                      {...register('phone')}
                      className="input-field"
                      placeholder="Enter phone number"
                    />
                    {errors.phone && <p className="text-xs text-rose-500 font-bold mt-1">{errors.phone.message}</p>}
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center">
                      <CalendarIcon size={14} className="mr-2" /> Age
                    </label>
                    <input 
                      type="number"
                      {...register('age', { valueAsNumber: true })}
                      className="input-field"
                      placeholder="Enter age"
                    />
                    {errors.age && <p className="text-xs text-rose-500 font-bold mt-1">{errors.age.message}</p>}
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Gender</label>
                    <div className="flex gap-4">
                      {['male', 'female', 'other'].map((g) => (
                        <label key={g} className="flex-1">
                          <input 
                            type="radio" 
                            value={g} 
                            {...register('gender')}
                            className="sr-only peer"
                          />
                          <div className="text-center py-3 rounded-2xl border border-slate-200 cursor-pointer peer-checked:bg-indigo-600 peer-checked:border-indigo-600 peer-checked:text-white hover:bg-slate-50 transition-all capitalize font-bold text-sm text-slate-600">
                            {g}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center">
                    <MapPin size={14} className="mr-2" /> Address
                  </label>
                  <textarea 
                    {...register('address')}
                    rows={3}
                    className="input-field resize-none"
                    placeholder="Enter full address"
                  />
                  {errors.address && <p className="text-xs text-rose-500 font-bold mt-1">{errors.address.message}</p>}
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center">
                    <History size={14} className="mr-2" /> Medical History (Optional)
                  </label>
                  <textarea 
                    {...register('medicalHistory')}
                    rows={4}
                    className="input-field resize-none"
                    placeholder="Enter any past medical conditions, allergies, etc."
                  />
                </div>

                <div className="pt-6 flex gap-6">
                  <button 
                    type="submit"
                    className="flex-1 py-5 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all active:scale-[0.98]"
                  >
                    {existingPatient ? 'Update Patient Record' : 'Register New Patient'}
                  </button>
                  {existingPatient ? (
                    <button 
                      type="button"
                      onClick={() => { 
                        reset({
                          name: '',
                          phone: '',
                          age: 0,
                          gender: 'male',
                          address: '',
                          medicalHistory: '',
                        }); 
                        setExistingPatient(null); 
                        setSearchPhone(''); 
                        setActiveTab('directory');
                        setSearchParams({ tab: 'directory' });
                      }}
                      className="px-10 py-5 bg-rose-50 text-rose-600 font-bold rounded-2xl hover:bg-rose-100 transition-all"
                    >
                      Cancel Edit
                    </button>
                  ) : (
                    <button 
                      type="button"
                      onClick={() => { reset(); setExistingPatient(null); setSearchPhone(''); }}
                      className="px-10 py-5 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                    >
                      Clear Form
                    </button>
                  )}
                </div>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="directory"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="glass-card p-8 rounded-3xl">
              <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-8">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    type="text" 
                    placeholder="Search by name or phone..." 
                    value={directorySearch}
                    onChange={(e) => setDirectorySearch(e.target.value)}
                    className="input-field pl-14"
                  />
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                  <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className={cn(
                      "flex-1 md:flex-none px-6 py-4 font-bold rounded-2xl transition-all flex items-center justify-center gap-2",
                      showFilters ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    )}
                  >
                    <Filter size={18} /> {showFilters ? 'Hide Filters' : 'Filters'}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-slate-50 rounded-2xl mb-8 border border-slate-100">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gender</label>
                        <select 
                          value={genderFilter}
                          onChange={(e) => setGenderFilter(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        >
                          <option value="all">All Genders</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Min Age</label>
                        <input 
                          type="number"
                          value={ageRange.min}
                          onChange={(e) => setAgeRange({ ...ageRange, min: parseInt(e.target.value) || 0 })}
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                          placeholder="Min age"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Max Age</label>
                        <input 
                          type="number"
                          value={ageRange.max}
                          onChange={(e) => setAgeRange({ ...ageRange, max: parseInt(e.target.value) || 0 })}
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                          placeholder="Max age"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left py-4 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Patient</th>
                      <th className="text-left py-4 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contact</th>
                      <th className="text-left py-4 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Age/Gender</th>
                      <th className="text-left py-4 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last Visit</th>
                      <th className="text-right py-4 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredPatients.map((patient) => (
                      <tr key={patient.id} className="group hover:bg-slate-50/50 transition-all">
                        <td className="py-5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                              {patient.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900">{patient.name}</p>
                              <p className="text-[10px] text-slate-400 font-medium">ID: #{String(patient.id).slice(-4)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-5 px-4">
                          <p className="text-sm font-medium text-slate-600">{patient.phone}</p>
                        </td>
                        <td className="py-5 px-4">
                          <p className="text-sm font-medium text-slate-600 capitalize">{patient.age}y / {patient.gender}</p>
                        </td>
                        <td className="py-5 px-4">
                          <p className="text-sm font-medium text-slate-600">{patient.last_visit}</p>
                        </td>
                        <td className="py-5 px-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => editPatient(patient)}
                              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                              title="Edit Patient"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => navigate(`/patients/${patient.id}`)}
                              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                              title="View Records"
                            >
                              <Eye size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {filteredPatients.length === 0 && (
                <div className="text-center py-20">
                  <Users size={48} className="mx-auto text-slate-200 mb-4" />
                  <p className="text-slate-400 font-medium">No patients found matching your search.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
