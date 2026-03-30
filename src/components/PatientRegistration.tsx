import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Search, UserPlus, History, MapPin, Phone, User, Calendar as CalendarIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

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
  const [searchPhone, setSearchPhone] = React.useState('');
  const [isSearching, setIsSearching] = React.useState(false);
  const [existingPatient, setExistingPatient] = React.useState<any>(null);

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      gender: 'male',
    }
  });

  const handleSearch = async () => {
    if (!searchPhone) return;
    setIsSearching(true);
    // Simulate search
    setTimeout(() => {
      // Mock existing patient
      if (searchPhone === '1234567890') {
        const mockPatient = {
          name: 'John Doe',
          phone: '1234567890',
          age: 35,
          gender: 'male',
          address: '123 Main St, City',
          medicalHistory: 'None',
        };
        setExistingPatient(mockPatient);
        Object.entries(mockPatient).forEach(([key, value]) => {
          setValue(key as any, value);
        });
        toast.success('Patient record found!');
      } else {
        setExistingPatient(null);
        reset({ phone: searchPhone });
        toast.info('No existing record found. Please register.');
      }
      setIsSearching(false);
    }, 1000);
  };

  const onSubmit = (data: PatientFormValues) => {
    console.log('Patient Data:', data);
    toast.success(existingPatient ? 'Patient record updated!' : 'Patient registered successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-10">
      {/* Search Section */}
      <div className="glass-card p-10 rounded-3xl">
        <h3 className="text-xl font-display font-bold text-slate-900 mb-8 flex items-center">
          <Search className="mr-3 text-indigo-600" size={24} />
          Find Existing Patient
        </h3>
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Enter Phone Number" 
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
              className="input-field pl-14"
            />
          </div>
          <button 
            onClick={handleSearch}
            disabled={isSearching}
            className="px-10 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all disabled:opacity-50 active:scale-95"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {/* Registration Form */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-10 rounded-3xl"
      >
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
            <button 
              type="button"
              onClick={() => { reset(); setExistingPatient(null); setSearchPhone(''); }}
              className="px-10 py-5 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all"
            >
              Clear Form
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
