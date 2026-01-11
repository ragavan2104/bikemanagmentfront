// Using const objects instead of enums for erasableSyntaxOnly compatibility
export const UserRole = {
  ADMIN: 'admin',
  WORKER: 'worker'
} as const;
export type UserRole = typeof UserRole[keyof typeof UserRole];

export const BikeStatus = {
  AVAILABLE: 'available',
  SOLD: 'sold'
} as const;
export type BikeStatus = typeof BikeStatus[keyof typeof BikeStatus];

export interface User {
  id: string;
  email: string;
  role: UserRole;
  displayName: string;
}

export interface Bike {
  id: string;
  bikeName: string;
  year: number;
  registrationNumber: string;
  ownerPhone: string;
  ownerAadhar: string;
  ownerAddress: string;
  purchasePrice: number;
  sellingPrice: number;
  status: BikeStatus;
  addedBy: string;
  createdAt: any;
  updatedAt: any;
}

export interface Sale {
  id: string;
  bikeId: string;
  bikeName: string;
  bikeYear: number;
  purchasePrice: number;
  salePrice: number;
  profit: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAadhar: string;
  customerAddress: string;
  soldBy: string;
  saleDate: any;
  createdAt: any;
}

export interface KPIData {
  totalProfit: number;
  totalExpenses: number;
  totalRevenue: number;
  totalBikesSold: number;
  totalBikesAvailable: number;
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  displayName: string;
  createdAt: any;
  updatedAt?: any;
}

export interface MonthlySalesData {
  month: string;
  sales: number;
  purchases: number;
  profit: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
