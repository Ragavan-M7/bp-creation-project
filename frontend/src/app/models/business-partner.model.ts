// src/app/models/business-partner.model.ts
// TypeScript interfaces for type safety across frontend

export type BpStatus = 'Approved' | 'Rejected' | 'Pending';

export interface BusinessPartner {
  id?: number;
  bp_code?: string;
  bp_name: string;
  email: string;
  mobile_no: string;
  status: BpStatus;
  customer_group?: string;
  contact_person?: string;
  gst_no?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  address?: string;
  ship_city?: string;
  ship_state?: string;
  ship_country?: string;
  ship_postal?: string;
  ship_address?: string;
  created_at?: string;
  updated_at?: string;
}

// API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  total?: number;
}
