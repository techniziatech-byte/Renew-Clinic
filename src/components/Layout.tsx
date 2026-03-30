import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  ClipboardList, 
  Stethoscope, 
  Pill, 
  Package, 
  Warehouse, 
  Truck, 
  LayoutDashboard, 
  LogOut,
  UserCircle,
  Menu,
  X,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface LayoutProps {
  children: React.ReactNode;
  userRole?: string;
  userName?: string;
  onLogout?: () => void;
}

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard, roles: ['admin', 'staff', 'doctor', 'pharmacist', 'inventory_manager'] },
  { name: 'Patients', path: '/patients', icon: Users, roles: ['admin', 'staff', 'doctor'] },
  { name: 'Appointments', path: '/appointments', icon: Calendar, roles: ['admin', 'staff', 'doctor'] },
  { name: 'OPD Slips', path: '/opd', icon: ClipboardList, roles: ['admin', 'staff', 'doctor'] },
  { name: 'Consultations', path: '/consultations', icon: Stethoscope, roles: ['admin', 'doctor'] },
  { name: 'Procedures', path: '/procedures', icon: ClipboardList, roles: ['admin', 'staff', 'doctor'] },
  { name: 'Pharmacy', path: '/pharmacy', icon: Pill, roles: ['admin', 'pharmacist'] },
  { name: 'Inventory', path: '/inventory', icon: Package, roles: ['admin', 'pharmacist', 'inventory_manager'] },
  { name: 'Warehouse', path: '/warehouse', icon: Warehouse, roles: ['admin', 'inventory_manager'] },
  { name: 'Suppliers', path: '/suppliers', icon: Truck, roles: ['admin', 'inventory_manager'] },
  { name: 'Patient Portal', path: '/patient-portal', icon: UserCircle, roles: ['admin', 'staff', 'doctor'] },
];

export default function Layout({ children, userRole = 'admin', userName = 'Admin User', onLogout }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const filteredNavItems = navItems.filter(item => item.roles.includes(userRole));

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 88 }}
        className="bg-white border-r border-slate-200/60 flex flex-col z-20 relative overflow-hidden"
      >
        {/* Subtle Sidebar Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:20px_20px]"></div>
        </div>

        <div className="p-8 flex items-center justify-between relative">
          {isSidebarOpen && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <Activity className="text-white" size={24} />
              </div>
              <span className="text-2xl font-display font-bold text-slate-900 tracking-tight">
                Derma<span className="text-indigo-600">Care</span>
              </span>
            </motion.div>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2.5 rounded-2xl hover:bg-slate-100 text-slate-500 transition-colors"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto scrollbar-hide relative">
          {filteredNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center p-3.5 rounded-2xl transition-all duration-300 group relative",
                location.pathname === item.path 
                  ? "bg-indigo-600 text-white shadow-xl shadow-indigo-200/50" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-indigo-600"
              )}
            >
              <item.icon size={22} className={cn(
                "min-w-[22px] transition-transform duration-300 group-hover:scale-110",
                location.pathname === item.path ? "text-white" : "text-slate-400 group-hover:text-indigo-500"
              )} />
              {isSidebarOpen && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="ml-4 font-semibold whitespace-nowrap"
                >
                  {item.name}
                </motion.span>
              )}
              {location.pathname === item.path && (
                <motion.div 
                  layoutId="activeNav"
                  className="absolute left-0 w-1 h-6 bg-white rounded-r-full"
                />
              )}
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-100 relative">
          <div className="flex items-center p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
              {userName.charAt(0)}
            </div>
            {isSidebarOpen && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="ml-3 overflow-hidden"
              >
                <p className="text-sm font-bold text-slate-900 truncate">{userName}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{userRole.replace('_', ' ')}</p>
              </motion.div>
            )}
          </div>
          <button 
            onClick={onLogout}
            className="mt-4 w-full flex items-center p-3.5 rounded-2xl text-rose-500 hover:bg-rose-50 transition-all group font-semibold"
          >
            <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
            {isSidebarOpen && <span className="ml-3">Sign Out</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-100/30 blur-[120px] rounded-full -mr-64 -mt-64 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sky-100/20 blur-[100px] rounded-full -ml-48 -mb-48 pointer-events-none"></div>

        <header className="h-20 bg-white/60 backdrop-blur-md border-b border-slate-200/60 flex items-center px-10 justify-between z-10">
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-display font-bold text-slate-900">
                {navItems.find(item => item.path === location.pathname)?.name || 'Dashboard'}
              </h1>
              {window.location.hostname.includes('run.app') && !process.env.VITE_SUPABASE_URL && (
                <span className="px-3 py-1 bg-amber-100 text-amber-600 text-[10px] font-bold uppercase tracking-widest rounded-full border border-amber-200">
                  Demo Mode
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 font-medium">Welcome back, {userName.split(' ')[0]}!</p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex flex-col items-end">
              <span className="text-sm font-bold text-slate-900">
                {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
              </span>
            </div>
            <div className="w-px h-8 bg-slate-200"></div>
            <button className="relative p-2 text-slate-400 hover:text-indigo-600 transition-colors">
              <div className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></div>
              <Activity size={20} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
