import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  UserPlus,
  Calendar, 
  TrendingUp, 
  AlertCircle, 
  Activity,
  CheckCircle2,
  Clock,
  ClipboardList,
  Search
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const data = [
  { name: 'Mon', patients: 40, revenue: 2400 },
  { name: 'Tue', patients: 30, revenue: 1398 },
  { name: 'Wed', patients: 20, revenue: 9800 },
  { name: 'Thu', patients: 27, revenue: 3908 },
  { name: 'Fri', patients: 18, revenue: 4800 },
  { name: 'Sat', patients: 23, revenue: 3800 },
  { name: 'Sun', patients: 34, revenue: 4300 },
];

const StatCard = ({ title, value, icon: Icon, trend, color }: any) => (
  <motion.div 
    whileHover={{ y: -6, scale: 1.02 }}
    className="glass-card p-8 rounded-3xl flex items-start justify-between transition-all duration-300"
  >
    <div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{title}</p>
      <h3 className="text-3xl font-display font-bold text-slate-900">{value}</h3>
      {trend && (
        <div className={cn(
          "flex items-center mt-3 text-xs font-bold px-2 py-1 rounded-lg w-fit",
          trend > 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
        )}>
          <TrendingUp size={14} className={cn("mr-1", trend < 0 && "rotate-180")} />
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    <div className={cn("p-4 rounded-2xl shadow-lg", color)}>
      <Icon size={28} className="text-white" />
    </div>
  </motion.div>
);

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-10 pb-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard 
          title="Total Patients" 
          value="1,284" 
          icon={Users} 
          trend={12} 
          color="bg-indigo-600 shadow-indigo-200" 
        />
        <StatCard 
          title="Today's Appointments" 
          value="24" 
          icon={Calendar} 
          trend={-5} 
          color="bg-sky-500 shadow-sky-200" 
        />
        <StatCard 
          title="Monthly Revenue" 
          value="Rs. 45,200" 
          icon={Activity} 
          trend={8} 
          color="bg-emerald-500 shadow-emerald-200" 
        />
        <StatCard 
          title="Low Stock Alerts" 
          value="12" 
          icon={AlertCircle} 
          color="bg-rose-500 shadow-rose-200" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="glass-card p-10 rounded-3xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-display font-bold text-slate-900">Patient Traffic</h3>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 bg-indigo-600 rounded-full"></span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Weekly View</span>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '12px 20px' }}
                />
                <Area type="monotone" dataKey="patients" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorPatients)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-10 rounded-3xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-display font-bold text-slate-900">Revenue Analysis</h3>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 bg-sky-500 rounded-full"></span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Monthly Growth</span>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '12px 20px' }}
                />
                <Bar dataKey="revenue" fill="#0ea5e9" radius={[10, 10, 0, 0]} barSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 glass-card rounded-3xl overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
            <h3 className="text-xl font-display font-bold text-slate-900">Recent Appointments</h3>
            <button 
              onClick={() => navigate('/appointments')}
              className="text-sm font-bold text-indigo-600 hover:text-indigo-700 px-4 py-2 bg-indigo-50 rounded-xl transition-all"
            >
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-widest font-bold">
                  <th className="px-8 py-5">Patient</th>
                  <th className="px-8 py-5">Doctor</th>
                  <th className="px-8 py-5">Time</th>
                  <th className="px-8 py-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[
                  { name: 'Sarah Johnson', doctor: 'Dr. Emily Smith', time: '10:30 AM', status: 'Completed' },
                  { name: 'Michael Brown', doctor: 'Dr. James Wilson', time: '11:15 AM', status: 'In Progress' },
                  { name: 'Elena Rodriguez', doctor: 'Dr. Emily Smith', time: '12:00 PM', status: 'Scheduled' },
                  { name: 'David Lee', doctor: 'Dr. James Wilson', time: '02:30 PM', status: 'Scheduled' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold mr-4 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                          {row.name.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-900">{row.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-slate-500 font-medium">{row.doctor}</td>
                    <td className="px-8 py-6 text-slate-500 font-medium">{row.time}</td>
                    <td className="px-8 py-6">
                      <span className={cn(
                        "px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider",
                        row.status === 'Completed' ? "bg-emerald-50 text-emerald-600" :
                        row.status === 'In Progress' ? "bg-sky-50 text-sky-600" :
                        "bg-amber-50 text-amber-600"
                      )}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card p-10 rounded-3xl">
          <h3 className="text-xl font-display font-bold text-slate-900 mb-8">Quick Actions</h3>
          <div className="space-y-4">
            <button 
              onClick={() => navigate('/patients')}
              className="w-full flex items-center p-5 rounded-2xl border border-slate-100 hover:bg-indigo-600 hover:border-indigo-600 hover:shadow-xl hover:shadow-indigo-200 transition-all group"
            >
              <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 group-hover:bg-white/20 group-hover:text-white transition-colors">
                <UserPlus size={22} />
              </div>
              <span className="ml-5 font-bold text-slate-700 group-hover:text-white">Register Patient</span>
            </button>
            <button 
              onClick={() => navigate('/patients')}
              className="w-full flex items-center p-5 rounded-2xl border border-slate-100 hover:bg-slate-800 hover:border-slate-800 hover:shadow-xl hover:shadow-slate-200 transition-all group"
            >
              <div className="p-3 bg-slate-100 rounded-xl text-slate-600 group-hover:bg-white/20 group-hover:text-white transition-colors">
                <Search size={22} />
              </div>
              <span className="ml-5 font-bold text-slate-700 group-hover:text-white">Patient Directory</span>
            </button>
            <button 
              onClick={() => navigate('/appointments')}
              className="w-full flex items-center p-5 rounded-2xl border border-slate-100 hover:bg-sky-500 hover:border-sky-500 hover:shadow-xl hover:shadow-sky-200 transition-all group"
            >
              <div className="p-3 bg-sky-50 rounded-xl text-sky-600 group-hover:bg-white/20 group-hover:text-white transition-colors">
                <Calendar size={22} />
              </div>
              <span className="ml-5 font-bold text-slate-700 group-hover:text-white">Book Appointment</span>
            </button>
            <button 
              onClick={() => navigate('/opd')}
              className="w-full flex items-center p-5 rounded-2xl border border-slate-100 hover:bg-emerald-500 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-200 transition-all group"
            >
              <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 group-hover:bg-white/20 group-hover:text-white transition-colors">
                <ClipboardList size={22} />
              </div>
              <span className="ml-5 font-bold text-slate-700 group-hover:text-white">Generate OPD Slip</span>
            </button>
          </div>

          <div className="mt-10 p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center mb-4">
              <div className="w-2 h-2 bg-indigo-600 rounded-full mr-2 animate-pulse"></div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Status</span>
            </div>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              All systems operational. Next automated backup scheduled for 12:00 AM.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
