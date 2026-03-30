export type UserRole = 'admin' | 'staff' | 'doctor' | 'pharmacist' | 'inventory_manager';

export interface User {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Patient {
  id?: string;
  name: string;
  phone: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  address: string;
  medicalHistory?: string;
  createdAt: string;
}

export interface Doctor {
  id?: string;
  name: string;
  specialization: string;
  schedule?: Record<string, any>;
}

export interface Appointment {
  id?: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface OPDSlip {
  id?: string;
  patientId: string;
  tokenNumber: number;
  date: string;
  doctorId: string;
  status: 'pending' | 'consulted';
}

export interface Prescription {
  medicineId: string;
  medicineName: string;
  dosage: string;
  duration: string;
  quantity: number;
}

export interface Consultation {
  id?: string;
  opdSlipId: string;
  diagnosis: string;
  prescriptions: Prescription[];
  suggestedProcedures: string[];
}

export interface Procedure {
  id?: string;
  patientId: string;
  procedureName: string;
  date: string;
  fee: number;
  paidAmount: number;
  status: 'pending' | 'completed';
}

export interface Medicine {
  id?: string;
  name: string;
  quantity: number;
  price: number;
  category: string;
  lowStockAlert: number;
}

export interface WarehouseItem {
  id?: string;
  name: string;
  type: 'finished' | 'unfinished';
  quantity: number;
  unit: string;
}

export interface Supplier {
  id?: string;
  name: string;
  contact: string;
  products: string[];
}

export interface PurchaseInvoice {
  id?: string;
  supplierId: string;
  date: string;
  items: { itemId: string; name: string; quantity: number; price: number }[];
  totalAmount: number;
}
