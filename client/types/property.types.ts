export interface Property {
  id: string;
  title: string;
  amount: {
    price: number; // in cents
    currency: string; // ISO currency code
  };
  location: string;
  bedrooms: number;
  bathrooms: number;
  status: 'available' | 'sold';
  createdAt: string;
  updatedAt: string;
}

export interface PropertyFormData {
  title: string;
  price: number; // in currency (will be converted to cents)
  currency: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  status: 'available' | 'sold';
}

export interface PropertyApiResponse {
  status: 'success' | 'fail';
  message: string;
  statusCode: number;
    data: Property[];
    meta?: {
      totalItems: number;
      itemCount: number;
      itemsPerPage: number;
      totalPages: number;
      currentPage: number;
    };
}

export interface SinglePropertyApiResponse {
  status: 'success' | 'fail';
  message: string;
  statusCode: number;
  data?: Property;
}

export type ColumnKey = 'title' | 'price' | 'location' | 'bedrooms' | 'bathrooms' | 'status' | 'actions';

export interface ColumnConfig {
  key: ColumnKey;
  label: string;
  visible: boolean;
  order: number;
}

// Statistics types
export interface PropertyStatistics {
  totalProperties: number;
  // average price in cents per currency
  averagePrice: {
    EGP: number;
    SAR: number;
  };
  statusCount: {
    available: number;
    sold: number;
  };
  locationStats: Array<{
    location: string;
    averageBedrooms: number;
    averageBathrooms: number;
  }>;
}

export interface PropertyStatisticsApiResponse {
  status: 'success' | 'fail';
  message: string;
  statusCode: number;
  data: PropertyStatistics;
}