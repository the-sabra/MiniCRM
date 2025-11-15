'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Stack,
  Dialog,
  Portal,
  ButtonGroup,
  IconButton,
  Pagination,
  NativeSelect,
  Text,
  Flex,
  Button,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { usePropertyStore } from '@/lib/stores/property.store';
import { PropertyTable } from '@/components/properties/PropertyTable';
import { TableControls } from '@/components/properties/TableControls';
import { PropertyForm } from '@/components/properties/PropertyForm';
import { DeleteConfirmation } from '@/components/properties/DeleteConfirmation';
import { Property, ColumnConfig } from '@/types/property.types';
import { PropertyFormSchema } from '@/lib/validations/property.schema';
import { Toaster, toaster } from '@/components/ui/toaster';

const DEFAULT_COLUMNS: ColumnConfig[] = [
  { key: 'title', label: 'Title', visible: true, order: 1 },
  { key: 'price', label: 'Price', visible: true, order: 2 },
  { key: 'location', label: 'Location', visible: true, order: 3 },
  { key: 'bedrooms', label: 'Bedrooms', visible: true, order: 4 },
  { key: 'bathrooms', label: 'Bathrooms', visible: true, order: 5 },
  { key: 'status', label: 'Status', visible: true, order: 6 },
  { key: 'actions', label: 'Actions', visible: true, order: 7 },
];

const COLUMNS_STORAGE_KEY = 'property-columns-config';

// Load columns from localStorage or use defaults
const loadColumnsFromStorage = (): ColumnConfig[] => {
  if (typeof window === 'undefined') return DEFAULT_COLUMNS;
  
  try {
    const stored = localStorage.getItem(COLUMNS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as ColumnConfig[];
      // Validate that all default columns exist
      const hasAllColumns = DEFAULT_COLUMNS.every(
        defaultCol => parsed.some(col => col.key === defaultCol.key)
      );
      if (hasAllColumns) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Failed to load columns from localStorage:', error);
  }
  return DEFAULT_COLUMNS;
};

// Save columns to localStorage
const saveColumnsToStorage = (columns: ColumnConfig[]) => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(COLUMNS_STORAGE_KEY, JSON.stringify(columns));
  } catch (error) {
    console.error('Failed to save columns to localStorage:', error);
  }
};

export default function PropertiesPage() {
  // Zustand store
  const {
    properties,
    loading,
    meta,
    currentPage,
    itemsPerPage,
    searchQuery,
    fetchProperties,
    createProperty,
    updateProperty,
    deleteProperty,
    setSearchQuery,
    setPage,
    setItemsPerPage,
  } = usePropertyStore();

  const [columns, setColumns] = useState<ColumnConfig[]>(() => loadColumnsFromStorage());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  useEffect(() => {
    saveColumnsToStorage(columns);
  }, [columns]);

  // Handle add property
  const handleAddProperty = () => {
    setSelectedProperty(null);
    setIsFormOpen(true);
  };

  // Handle edit property
  const handleEditProperty = (property: Property) => {
    setSelectedProperty(property);
    setIsFormOpen(true);
  };

  // Handle delete property
  const handleDeleteProperty = (property: Property) => {
    setSelectedProperty(property);
    setIsDeleteOpen(true);
  };

  // Handle form submit (create or update)
  const handleFormSubmit = async (data: PropertyFormSchema) => {
    setIsSubmitting(true);

    try {
      if (selectedProperty) {
        await updateProperty(selectedProperty.id, data);
        toaster.create({
          title: 'Success',
          description: 'Property updated successfully',
          type: 'success',
          duration: 3000,
        });
      } else {
        await createProperty(data);
        toaster.create({
          title: 'Success',
          description: 'Property created successfully',
          type: 'success',
          duration: 3000,
        });
      }
      setIsFormOpen(false);
      setSelectedProperty(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!selectedProperty) return;

    setIsSubmitting(true);

    try {
      await deleteProperty(selectedProperty.id);
      toaster.create({
        title: 'Success',
        description: 'Property deleted successfully',
        type: 'success',
        duration: 3000,
      });
      setIsDeleteOpen(false);
      setSelectedProperty(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle column visibility change
  const handleColumnVisibilityChange = (key: string, visible: boolean) => {
    setColumns((prev) =>
      prev.map((col) => (col.key === key ? { ...col, visible } : col))
    );
  };

  // Handle column reorder
  const handleColumnReorder = (newColumns: ColumnConfig[]) => {
    setColumns(newColumns);
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Stack gap={6}>
        {/* Page Header */}
        <Box>
          <Flex justify="space-between" align={{ base: 'stretch', md: 'center' }} direction={{ base: 'column', md: 'row' }} gap={3}>
            <Box>
              <Heading size="2xl" mb={2}>
                Property Management
              </Heading>
              <Box color="gray.600">
                Manage your property listings
              </Box>
            </Box>
            <NextLink href="/properties/statistics">
              <Button variant="solid" colorPalette="blue">View Statistics</Button>
            </NextLink>
          </Flex>
        </Box>

        {/* Table Controls */}
        <TableControls
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddProperty={handleAddProperty}
          columns={columns}
          onColumnVisibilityChange={handleColumnVisibilityChange}
          onColumnReorder={handleColumnReorder}
        />

        {/* Property Table */}
        <PropertyTable
          properties={properties}
          loading={loading}
          columns={columns}
          onEdit={handleEditProperty}
          onDelete={handleDeleteProperty}
          onColumnReorder={handleColumnReorder}
        />

        {/* Pagination Controls */}
        <Flex
          align={{ base: 'stretch', md: 'center' }}
          justify="space-between"
          direction={{ base: 'column', md: 'row' }}
          gap={3}
        >
          {/* Rows per page (mobile) */}
          <Stack
            direction={{ base: 'column', sm: 'row' }}
            align={{ base: 'stretch', sm: 'center' }}
            gap={2}
            w={{ base: 'full', md: 'auto' }}
          >
            <Text color="gray.600" display={{ base: 'none', sm: 'inline' }}>
              Rows per page
            </Text>
            <Text color="gray.600" display={{ base: 'inline', sm: 'none' }}>
              Rows
            </Text>
            <NativeSelect.Root size="sm" width={{ base: 'full', sm: '120px' }}>
              <NativeSelect.Field
                value={String(itemsPerPage)}
                onChange={(e) => setItemsPerPage(parseInt(e.currentTarget.value))}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Stack>

          {/* Paginator (mobile) */}
          <Pagination.Root
            count={meta?.totalItems ?? 0}
            pageSize={itemsPerPage}
            page={currentPage}
            onPageChange={(e) => setPage(e.page)}
            w={{ base: 'full', md: 'auto' }}
          >
            <ButtonGroup
              variant="ghost"
              size="sm"
              display="flex"
              justifyContent={{ base: 'space-between', md: 'flex-end' }}
              flexWrap="wrap"
              gap={2}
              w="full"
            >
              <Pagination.PageText
                format="compact"
                display={{ base: 'inline', md: 'none' }}
              />
              <Pagination.PageText
                format="long"
                display={{ base: 'none', md: 'inline' }}
              />
              <Pagination.PrevTrigger asChild>
                <IconButton aria-label="Previous page" minW="auto">
                  ‹
                </IconButton>
              </Pagination.PrevTrigger>
              <Pagination.NextTrigger asChild>
                <IconButton aria-label="Next page" minW="auto">
                  ›
                </IconButton>
              </Pagination.NextTrigger>
            </ButtonGroup>
          </Pagination.Root>
        </Flex>

        {/* Add/Edit Property Dialog */}
        <Dialog.Root
          open={isFormOpen}
          onOpenChange={(e) => setIsFormOpen(e.open)}
          size="lg"
        >
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content>
                <Dialog.Header>
                  <Dialog.Title>
                    {selectedProperty ? 'Edit Property' : 'Add New Property'}
                  </Dialog.Title>
                  <Dialog.CloseTrigger />
                </Dialog.Header>
                <Dialog.Body>
                  <PropertyForm
                    property={selectedProperty || undefined}
                    onSubmit={handleFormSubmit}
                    onCancel={() => setIsFormOpen(false)}
                    isSubmitting={isSubmitting}
                  />
                </Dialog.Body>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmation
          open={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={handleDeleteConfirm}
          propertyTitle={selectedProperty?.title || ''}
          isDeleting={isSubmitting}
        />

        {/* Toast Notifications */}
        <Toaster />
      </Stack>
    </Container>
  );
}
