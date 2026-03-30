import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import PatientRegistration from './components/PatientRegistration';
import AppointmentScheduling from './components/AppointmentScheduling';
import OPDManagement from './components/OPDManagement';
import PharmacyManagement from './components/PharmacyManagement';
import InventoryManagement from './components/InventoryManagement';
import ConsultationModule from './components/ConsultationModule';
import ProcedureManagement from './components/ProcedureManagement';
import SupplierManagement from './components/SupplierManagement';
import PatientPortal from './components/PatientPortal';
import PatientRecords from './components/PatientRecords';

export default function App() {
  const [user, setUser] = React.useState({
    name: 'Dr. Emily Smith',
    role: 'admin',
  });

  return (
    <Router>
      <Toaster position="top-right" richColors />
      <Layout 
        userRole={user.role} 
        userName={user.name} 
        onLogout={() => console.log('Logout')}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/patients" element={<PatientRegistration />} />
          <Route path="/patients/:id" element={<PatientRecords />} />
          <Route path="/appointments" element={<AppointmentScheduling />} />
          <Route path="/opd" element={<OPDManagement />} />
          <Route path="/pharmacy" element={<PharmacyManagement />} />
          <Route path="/inventory" element={<InventoryManagement />} />
          <Route path="/warehouse" element={<InventoryManagement />} />
          <Route path="/consultations" element={<ConsultationModule />} />
          <Route path="/procedures" element={<ProcedureManagement />} />
          <Route path="/suppliers" element={<SupplierManagement />} />
          <Route path="/patient-portal" element={<PatientPortal />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}
