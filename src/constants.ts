export const USER_ROLES = {
  ADMIN: 'admin',
  STAFF: 'staff',
  DOCTOR: 'doctor',
  PHARMACIST: 'pharmacist',
  INVENTORY_MANAGER: 'inventory_manager',
} as const;

export const GENDERS = ['male', 'female', 'other'] as const;

export const APPOINTMENT_STATUS = {
  SCHEDULED: 'scheduled',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const OPD_STATUS = {
  PENDING: 'pending',
  CONSULTED: 'consulted',
} as const;

export const PROCEDURE_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
} as const;

export const WAREHOUSE_TYPES = {
  FINISHED: 'finished',
  UNFINISHED: 'unfinished',
} as const;
