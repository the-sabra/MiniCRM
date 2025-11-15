'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Input,
  Stack,
  Text,
  Flex,
  Dialog,
  Portal,
  CloseButton,
  Switch,
} from '@chakra-ui/react';
import { 
  FiSearch, 
  FiPlus, 
  FiColumns 
} from 'react-icons/fi';
import { Tooltip } from '@/components/ui/tooltip';
import { useColorModeValue } from '@/components/ui/color-mode';
import { ColumnConfig } from '@/types/property.types';
import { HOVER_COLORS } from '@/lib/constants/colors';

interface TableControlsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddProperty: () => void;
  columns: ColumnConfig[];
  onColumnVisibilityChange: (key: string, visible: boolean) => void;
  onColumnReorder: (columns: ColumnConfig[]) => void;
}

export function TableControls({
  searchQuery,
  onSearchChange,
  onAddProperty,
  columns,
  onColumnVisibilityChange,
}: TableControlsProps) {
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [isDialogOpen, setDialogOpen] = useState(false);

  // Color mode aware styling
  const menuHoverBg = useColorModeValue(HOVER_COLORS.light.menu, HOVER_COLORS.dark.menu);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value);
  };

  // Debounce search updates
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, onSearchChange]);

  const visibleColumns = columns.filter((col) => col.visible);
  const toggleableColumns = columns.filter((col) => col.key !== 'actions');

  return (
    <Stack
      direction={{ base: 'column', md: 'row' }}
      gap={4}
      justify="space-between"
      align={{ base: 'stretch', md: 'center' }}
      mb={6}
    >
      {/* Search Input */}
      <Box flex={1} maxW={{ md: '420px' }} position="relative">
        <Box 
          position="absolute" 
          left={3} 
          top="50%" 
          transform="translateY(-50%)"
          color="gray.500"
          zIndex={2}
          pointerEvents="none"
        >
          <FiSearch size={18} />
        </Box>
        <Input
          placeholder="Search by title or location..."
          value={localSearch}
          onChange={handleSearchChange}
          size="md"
          pl={10}
        />
      </Box>

      {/* Action Buttons */}
      <Stack direction="row" gap={3} align="center">
        {/* Column Visibility Dialog */}
        <Tooltip content="Manage visible columns">
          <Dialog.Root lazyMount open={isDialogOpen} onOpenChange={(e) => setDialogOpen(e.open)}>
            <Dialog.Trigger asChild>
              <Button variant="outline" gap={2} size="md">
                <FiColumns size={18} />
                <Text display={{ base: 'none', sm: 'inline' }}>
                  Columns ({visibleColumns.length})
                </Text>
              </Button>
            </Dialog.Trigger>
            <Portal>
              <Dialog.Backdrop />
              <Dialog.Positioner>
                <Dialog.Content>
                  <Dialog.Header>
                    <Dialog.Title>Manage Columns</Dialog.Title>
                  </Dialog.Header>
                  <Dialog.Body>
                    <Stack gap={1}>
                      {toggleableColumns.map((col) => (
                        <Flex
                          key={col.key}
                          align="center"
                          justify="space-between"
                          px={2}
                          py={2}
                          borderRadius="md"
                          _hover={{ bg: menuHoverBg }}
                        >
                          <Text>{col.label}</Text>
                          <Switch.Root
                            checked={col.visible}
                            onCheckedChange={({ checked }) => onColumnVisibilityChange(col.key, checked)}
                          >
                            <Switch.HiddenInput />
                            <Switch.Control />
                          </Switch.Root>
                        </Flex>
                      ))}
                    </Stack>
                  </Dialog.Body>
                  <Dialog.Footer>
                    <Dialog.ActionTrigger asChild>
                      <Button variant="outline">Close</Button>
                    </Dialog.ActionTrigger>
                  </Dialog.Footer>
                  <Dialog.CloseTrigger asChild>
                    <CloseButton size="sm" />
                  </Dialog.CloseTrigger>
                </Dialog.Content>
              </Dialog.Positioner>
            </Portal>
          </Dialog.Root>
        </Tooltip>

        {/* Add Property Button */}
        <Tooltip content="Create a new property">
          <Button colorPalette="blue" onClick={onAddProperty} gap={2} size="md">
            <FiPlus size={18} />
            <Text display={{ base: 'none', sm: 'inline' }}>
              Add Property
            </Text>
          </Button>
        </Tooltip>
      </Stack>
    </Stack>
  );
}
