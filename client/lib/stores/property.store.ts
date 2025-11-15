import { create } from 'zustand';
import { ApiError, propertyApi } from '@/lib/api';
import { Property, PropertyFormData } from '@/types/property.types';

interface PropertyMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

interface PropertyState {
  properties: Property[];
  loading: boolean;
  error: string | null;
  meta: PropertyMeta | null;

  currentPage: number;
  itemsPerPage: number;
  searchQuery: string;

  fetchProperties: () => Promise<void>;
  createProperty: (data: PropertyFormData) => Promise<void>;
  updateProperty: (id: string, data: PropertyFormData) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;

  setPage: (page: number) => void;
  setItemsPerPage: (take: number) => void;
  setSearchQuery: (query: string) => void;

  clearError: () => void;
  reset: () => void;
}

const initialState = {
  properties: [],
  loading: false,
  error: null,
  meta: null,
  currentPage: 1,
  itemsPerPage: 10,
  searchQuery: '',
};

export const usePropertyStore = create<PropertyState>((set, get) => ({
  ...initialState,

  fetchProperties: async () => {
    set({ loading: true, error: null });

    try {
      const { currentPage, itemsPerPage, searchQuery } = get();

      const response = await propertyApi.getAll({
        page: currentPage,
        take: itemsPerPage,
        search: searchQuery || undefined,
      });

      if (response.status === 'success' && response.data) {
        set({
          properties: response.data,
          meta: response.meta || null,
          loading: false,
        });
      } else {
        set({
          error: response.message || 'Failed to fetch properties',
          loading: false,
        });
      }
    } catch (err: ApiError | unknown) {
      set({
        error: err instanceof ApiError ? err.message : 'An error occurred while fetching properties',
        loading: false,
      });
    }
  },

  createProperty: async (data: PropertyFormData) => {
    set({ error: null });

    try {
      const response = await propertyApi.create(data);

      if (response.status === 'success') {
        await get().fetchProperties();
      } else {
        const errorMsg = response.message || 'Failed to create property';
        set({ error: errorMsg });
        throw new Error(errorMsg);
      }
    } catch (err: ApiError | unknown) {
      const errorMsg = err instanceof ApiError ? err.message : 'An error occurred while creating property';
      set({ error: errorMsg });
      throw err;
    }
  },

  updateProperty: async (id: string, data: PropertyFormData) => {
    set({ error: null });

    try {
      const response = await propertyApi.update(id, data);

      if (response.status === 'success') {
        await get().fetchProperties();
      } else {
        const errorMsg = response.message || 'Failed to update property';
        set({ error: errorMsg });
        throw new Error(errorMsg);
      }
    } catch (err: ApiError | unknown) {
      const errorMsg = err instanceof ApiError ? err.message : 'An error occurred while updating property';
      set({ error: errorMsg });
      throw err;
    }
  },

  deleteProperty: async (id: string) => {
    set({ error: null });

    try {
      const response = await propertyApi.delete(id);

      if (response.status === 'success') {
        await get().fetchProperties();
      } else {
        const errorMsg = response.message || 'Failed to delete property';
        set({ error: errorMsg });
        throw new Error(errorMsg);
      }
    } catch (err: ApiError | unknown) {
      const errorMsg = err instanceof ApiError ? err.message : 'An error occurred while deleting property';
      set({ error: errorMsg });
      throw err;
    }
  },

  setPage: (page: number) => {
    set({ currentPage: page });
    get().fetchProperties();
  },

  setItemsPerPage: (take: number) => {
    set({ itemsPerPage: take, currentPage: 1 });
    get().fetchProperties();
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query, currentPage: 1 });
    get().fetchProperties();
  },

  clearError: () => set({ error: null }),

  reset: () => set(initialState),
}));
