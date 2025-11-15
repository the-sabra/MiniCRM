/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { PropertyApiResponse, SinglePropertyApiResponse, PropertyFormData, PropertyStatisticsApiResponse } from '@/types/property.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 180000, // 3 minutes (180 seconds)
  headers: {
    'Content-Type': 'application/json',
  },
});

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const retryRequest = async (
  error: AxiosError,
  config: AxiosRequestConfig & { _retry?: number }
): Promise<any> => {
  const retryCount = config._retry || 0;

  const shouldRetry =
    !error.response ||
    (error.response.status >= 500 && error.response.status < 600);

  if (retryCount < MAX_RETRIES && shouldRetry) {
    config._retry = retryCount + 1;

    // Exponential backoff
    const delay = RETRY_DELAY * Math.pow(2, retryCount);

    await new Promise((resolve) => setTimeout(resolve, delay));

    return apiClient.request(config);
  }

  return Promise.reject(error);
};

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as AxiosRequestConfig & { _retry?: number };

    if (config) {
      return retryRequest(error, config);
    }

    return Promise.reject(error);
  }
);

class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Helper function to handle API errors
function handleApiError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<any>;

    if (axiosError.response) {
      // Server responded with error
      throw new ApiError(
        axiosError.response.status,
        axiosError.response.data?.message || 'An error occurred',
        axiosError.response.data
      );
    } else if (axiosError.request) {
      // Request made but no response received
      throw new ApiError(0, 'No response from server. Please check your connection.');
    }
  }

  // Generic error
  throw new ApiError(500, 'An unexpected error occurred');
}

export const propertyApi = {
  async getAll(params?: { page?: number; take?: number; search?: string }): Promise<PropertyApiResponse> {
    try {
      const response = await apiClient.get<PropertyApiResponse>('/properties', {
        params,
      });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  async create(data: PropertyFormData): Promise<SinglePropertyApiResponse> {
    try {
      // Convert price from dollars to cents
      const payload = {
        title: data.title,
        amount: {
          price: Math.floor(data.price * 100), // Convert to cents
          currency: data.currency,
        },
        location: data.location,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        status: data.status,
      };

      const response = await apiClient.post<SinglePropertyApiResponse>('/properties', payload);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  async update(id: string, data: PropertyFormData): Promise<SinglePropertyApiResponse> {
    try {
      const payload = {
        title: data.title,
        amount: {
          price: Math.floor(data.price * 100), // Convert to cents
          currency: data.currency,
        },
        location: data.location,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        status: data.status,
      };

      const response = await apiClient.put<SinglePropertyApiResponse>(`/properties/${id}`, payload);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Delete a property
  async delete(id: string): Promise<{ status: string; message: string }> {
    try {
      const response = await apiClient.delete<{ status: string; message: string }>(`/properties/${id}`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  async getStatistics(): Promise<PropertyStatisticsApiResponse> {
    try {
      const response = await apiClient.get<PropertyStatisticsApiResponse>(`/properties/statistics`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
};

export { apiClient, ApiError };
