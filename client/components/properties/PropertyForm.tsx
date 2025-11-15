'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { propertyFormSchema, PropertyFormSchema } from '@/lib/validations/property.schema';
import { Property } from '@/types/property.types';
import {
  Box,
  Button,
  Input,
  Stack,
  Field,
  NativeSelectRoot,
  NativeSelectField,
} from '@chakra-ui/react';

interface PropertyFormProps {
  property?: Property;
  onSubmit: (data: PropertyFormSchema) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function PropertyForm({ property, onSubmit, onCancel, isSubmitting = false }: PropertyFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PropertyFormSchema>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: property
      ? {
          title: property.title,
          price: property.amount.price / 100, // Convert cents to dollars
          currency: property.amount.currency as 'EGP' | 'SAR',
          location: property.location,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          status: property.status,
        }
      : {
          title: '',
          price: 0,
          currency: 'EGP',
          location: '',
          bedrooms: 1,
          bathrooms: 1,
          status: 'available',
        },
  });

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack gap={4}>
        {/* Title Field */}
        <Field.Root
          required
          invalid={!!errors.title}
        >
          <Field.Label>Title</Field.Label>
          <Field.ErrorText>{errors.title?.message}</Field.ErrorText>
          <Input
            {...register('title')}
            placeholder="Enter property title"
          />
        </Field.Root>

        {/* Price and Currency Row */}
        <Stack direction={{ base: 'column', md: 'row' }} gap={4}>
          <Field.Root
            required
            invalid={!!errors.price}
            flex={2}
          >
            <Field.Label>Price</Field.Label>
            <Field.ErrorText>{errors.price?.message}</Field.ErrorText>
            <Input
              {...register('price', { valueAsNumber: true })}
              type="number"
              step="0.01"
              placeholder="0.00"
            />
          </Field.Root>

          <Field.Root
            required
            invalid={!!errors.currency}
            flex={1}
          >
            <Field.Label>Currency</Field.Label>
            <Field.ErrorText>{errors.currency?.message}</Field.ErrorText>
            <NativeSelectRoot>
              <NativeSelectField {...register('currency')}>
                <option value="EGP">EGP</option>
                <option value="SAR">SAR</option>
              </NativeSelectField>
            </NativeSelectRoot>
          </Field.Root>
        </Stack>

        {/* Location Field */}
        <Field.Root
          required
          invalid={!!errors.location}
        >
          <Field.Label>Location</Field.Label>
          <Field.ErrorText>{errors.location?.message}</Field.ErrorText>
          <Input
            {...register('location')}
            placeholder="Enter location"
          />
        </Field.Root>

        {/* Bedrooms and Bathrooms Row */}
        <Stack direction={{ base: 'column', md: 'row' }} gap={4}>
          <Field.Root
            required
            invalid={!!errors.bedrooms}
            flex={1}
          >
            <Field.Label>Bedrooms</Field.Label>
            <Field.ErrorText>{errors.bedrooms?.message}</Field.ErrorText>
            <Input
              {...register('bedrooms', { valueAsNumber: true })}
              type="number"
              min={1}
              placeholder="1"
            />
          </Field.Root>

          <Field.Root
            required
            invalid={!!errors.bathrooms}
            flex={1}
          >
            <Field.Label>Bathrooms</Field.Label>
            <Field.ErrorText>{errors.bathrooms?.message}</Field.ErrorText>
            <Input
              {...register('bathrooms', { valueAsNumber: true })}
              type="number"
              min={1}
              placeholder="1"
            />
          </Field.Root>
        </Stack>

        {/* Status Field */}
        <Field.Root
          required
          invalid={!!errors.status}
        >
          <Field.Label>Status</Field.Label>
          <Field.ErrorText>{errors.status?.message}</Field.ErrorText>
          <NativeSelectRoot>
            <NativeSelectField {...register('status')}>
              <option value="available">Available</option>
              <option value="sold">Sold</option>
            </NativeSelectField>
          </NativeSelectRoot>
        </Field.Root>

        {/* Action Buttons */}
        <Stack direction="row" gap={3} justify="flex-end" mt={4}>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            colorPalette="blue"
            loading={isSubmitting}
          >
            {property ? 'Update' : 'Create'} Property
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
