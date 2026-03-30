import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Calendar as CalendarIcon, Clock, User, Stethoscope, CheckCircle2, AlertCircle, CalendarCheck, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { format, addDays, startOfToday, isSameDay, parseISO } from 'date-fns';
import { cn } from '../lib/utils';

const appointmentSchema = z.object({
  patientName: z.string().min(2, 'Patient name is required'),
  doctorId: z.string().min(1, 'Please select a doctor'),
  date: z.string().min(1, 'Please select a date'),
  time: z.string().min(1, 'Please select a time slot'),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

const doctors = [
  { id: '1', name: 'Dr. Emily Smith', specialization: 'Dermatologist' },
  { id: '2', name: 'Dr. James Wilson', specialization: 'Cosmetic Surgeon' },
  { id: '3', name: 'Dr. Sarah Chen', specialization: 'Aesthetic Specialist' },
];

const timeSlots = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
];

export default function AppointmentScheduling() {
  const [selectedDate, setSelectedDate] = React.useState<Date>(startOfToday());
  const [selectedTime, setSelectedTime] = React.useState<string | null>(null);
  const [isBooking, setIsBooking] = React.useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      date: format(startOfToday(), 'yyyy-MM-dd'),
    }
  });

  const watchedDoctor = watch('doctorId');
  const watchedPatient = watch('patientName');

  const next7Days = Array.from({ length: 7 }, (_, i) => addDays(startOfToday(), i));
  const bookedSlots = ['10:00 AM', '02:30 PM']; // Mock data

  const onSubmit = (data: AppointmentFormValues) => {
    if (!selectedTime) {
      toast.error('Please select a time slot');
      return;
    }
    setIsBooking(true);
    setTimeout(() => {
      console.log('Booking Data:', { ...data, time: selectedTime });
      toast.success(`Appointment confirmed for ${data.patientName} on ${format(selectedDate, 'PPP')} at ${selectedTime}`);
      setIsBooking(false);
      reset();
      setSelectedTime(null);
      setSelectedDate(startOfToday());
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Form */}
        <div className="lg:col-span-2 space-y-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-10 rounded-3xl"
          >
            <h3 className="text-xl font-display font-bold text-slate-900 mb-10 flex items-center">
              <CalendarCheck className="mr-3 text-indigo-600" size={24} />
              Book New Appointment
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center">
                    <User size={14} className="mr-2" /> Patient Name
                  </label>
                  <input 
                    {...register('patientName')}
                    className="input-field"
                    placeholder="Enter patient name"
                  />
                  {errors.patientName && <p className="text-xs text-rose-500 font-bold mt-1">{errors.patientName.message}</p>}
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center">
                    <Stethoscope size={14} className="mr-2" /> Select Doctor
                  </label>
                  <select 
                    {...register('doctorId')}
                    className="input-field appearance-none"
                  >
                    <option value="">Choose a doctor</option>
                    {doctors.map(doc => (
                      <option key={doc.id} value={doc.id}>{doc.name} ({doc.specialization})</option>
                    ))}
                  </select>
                  {errors.doctorId && <p className="text-xs text-rose-500 font-bold mt-1">{errors.doctorId.message}</p>}
                </div>
              </div>

              {/* Date Selection */}
              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select Date</label>
                <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                  {next7Days.map((date) => {
                    const isSelected = isSameDay(date, selectedDate);
                    return (
                      <button
                        key={date.toISOString()}
                        type="button"
                        onClick={() => {
                          setSelectedDate(date);
                          setValue('date', format(date, 'yyyy-MM-dd'));
                        }}
                        className={cn(
                          "flex-shrink-0 w-24 py-4 rounded-2xl border transition-all flex flex-col items-center gap-1",
                          isSelected 
                            ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200" 
                            : "bg-white border-slate-200 text-slate-600 hover:border-indigo-300"
                        )}
                      >
                        <span className="text-[10px] uppercase font-bold tracking-tighter opacity-70">{format(date, 'EEE')}</span>
                        <span className="text-xl font-display font-bold">{format(date, 'd')}</span>
                        <span className="text-[10px] uppercase font-bold tracking-tighter opacity-70">{format(date, 'MMM')}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Selection */}
              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select Time Slot</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {timeSlots.map((time) => {
                    const isBooked = bookedSlots.includes(time);
                    const isSelected = selectedTime === time;
                    return (
                      <button
                        key={time}
                        type="button"
                        disabled={isBooked}
                        onClick={() => {
                          setSelectedTime(time);
                          setValue('time', time);
                        }}
                        className={cn(
                          "py-3 rounded-xl text-xs font-bold transition-all border",
                          isBooked 
                            ? "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed" 
                            : isSelected
                              ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100"
                              : "bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-slate-50"
                        )}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
                {errors.time && <p className="text-xs text-rose-500 font-bold mt-1">{errors.time.message}</p>}
              </div>

              <div className="pt-6">
                <button 
                  type="submit"
                  disabled={isBooking}
                  className="w-full py-5 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                >
                  {isBooking ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Confirming...
                    </>
                  ) : (
                    <>
                      <CalendarCheck size={20} />
                      Confirm Appointment
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>

        {/* Right Column: Summary & Info */}
        <div className="space-y-10">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-10 rounded-3xl bg-indigo-600 text-white"
          >
            <h3 className="text-xl font-display font-bold mb-8">Appointment Summary</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest opacity-70">Patient</p>
                  <p className="font-bold">{watchedPatient || 'Not specified'}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                  <CalendarIcon size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest opacity-70">Date</p>
                  <p className="font-bold">{format(selectedDate, 'PPPP')}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest opacity-70">Time</p>
                  <p className="font-bold">{selectedTime || 'Not selected'}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Stethoscope size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest opacity-70">Doctor</p>
                  <p className="font-bold">
                    {doctors.find(d => d.id === watchedDoctor)?.name || 'Select a doctor'}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-10 pt-10 border-t border-white/20">
              <div className="flex items-center gap-3 text-indigo-100 text-sm">
                <Info size={16} />
                <p>Confirmation will be sent via SMS</p>
              </div>
            </div>
          </motion.div>

          <div className="glass-card p-8 rounded-3xl">
            <h4 className="text-sm font-bold text-slate-900 mb-4">Quick Tips</h4>
            <ul className="space-y-3 text-xs text-slate-500 font-medium">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                Select a date to see available slots
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                Grayed out slots are already booked
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                Appointments can be rescheduled up to 24h before
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
