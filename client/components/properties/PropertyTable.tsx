'use client';

import { useState, DragEvent } from 'react';
import {
  Table,
  Box,
  Badge,
  Text,
  Stack,
  IconButton,
  Skeleton,
} from '@chakra-ui/react';
import { 
  FiEdit2, 
  FiTrash2, 
  FiHome,
  FiDollarSign,
  FiMapPin,
  FiDroplet,
  FiCheckCircle,
} from 'react-icons/fi';
import { LuBed  } from "react-icons/lu";
import { Tooltip } from '@/components/ui/tooltip';
import { useColorModeValue } from '@/components/ui/color-mode';
import { Property, ColumnConfig } from '@/types/property.types';
import { HOVER_COLORS, BACKGROUND_COLORS } from '@/lib/constants/colors';

interface PropertyTableProps {
  properties: Property[];
  loading: boolean;
  columns: ColumnConfig[];
  onEdit: (property: Property) => void;
  onDelete: (property: Property) => void;
  onColumnReorder?: (columns: ColumnConfig[]) => void;
}

export function PropertyTable({
  properties,
  loading,
  columns,
  onEdit,
  onDelete,
  onColumnReorder,
}: PropertyTableProps) {
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  // Color mode aware styling
  const hoverBg = useColorModeValue(HOVER_COLORS.light.table, HOVER_COLORS.dark.table);
  const dragBg = useColorModeValue(BACKGROUND_COLORS.light.accent, BACKGROUND_COLORS.dark.accent);
  const headerHoverBg = useColorModeValue(HOVER_COLORS.light.menu, HOVER_COLORS.dark.menu);

  // Get visible columns sorted by order
  const visibleColumns = columns
    .filter((col) => col.visible)
    .sort((a, b) => a.order - b.order);

  // Get icon for column header
  const getColumnIcon = (columnKey: string) => {
    switch (columnKey) {
      case 'title':
        return <FiHome size={14} />;
      case 'price':
        return <FiDollarSign size={14} />;
      case 'location':
        return <FiMapPin size={14} />;
      case 'bedrooms':
        return <LuBed  size={14} />;
      case 'bathrooms':
        return <FiDroplet size={14} />;
      case 'status':
        return <FiCheckCircle size={14} />;
      default:
        return null;
    }
  };

  // Handle drag start
  const handleDragStart = (e: DragEvent<HTMLTableCellElement>, columnKey: string) => {
    setDraggedColumn(columnKey);
    e.dataTransfer.effectAllowed = 'move';
  };

  // Handle drag over
  const handleDragOver = (e: DragEvent<HTMLTableCellElement>, columnKey: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(columnKey);
  };

  // Handle drag leave
  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  // Handle drop
  const handleDrop = (e: DragEvent<HTMLTableCellElement>, targetColumnKey: string) => {
    e.preventDefault();
    
    if (!draggedColumn || draggedColumn === targetColumnKey || !onColumnReorder) {
      setDraggedColumn(null);
      setDragOverColumn(null);
      return;
    }

    const draggedIndex = visibleColumns.findIndex(col => col.key === draggedColumn);
    const targetIndex = visibleColumns.findIndex(col => col.key === targetColumnKey);

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedColumn(null);
      setDragOverColumn(null);
      return;
    }

    // Reorder columns
    const newColumns = [...columns];
    const draggedCol = visibleColumns[draggedIndex];
    const targetCol = visibleColumns[targetIndex];

    // Swap order values
    const tempOrder = draggedCol.order;
    const draggedColIndex = newColumns.findIndex(col => col.key === draggedColumn);
    const targetColIndex = newColumns.findIndex(col => col.key === targetColumnKey);
    
    newColumns[draggedColIndex] = { ...draggedCol, order: targetCol.order };
    newColumns[targetColIndex] = { ...targetCol, order: tempOrder };

    onColumnReorder(newColumns);
    setDraggedColumn(null);
    setDragOverColumn(null);
  };

  // Handle drag end
  const handleDragEnd = () => {
    setDraggedColumn(null);
    setDragOverColumn(null);
  };

  // Format price with currency
  const formatPrice = (price: number, currency: string) => {
    const amountNum = price / 100; // Convert cents to currency units
    let amountStr: string;

    if (amountNum >= 1000000) {
      amountStr = (amountNum / 1000000).toFixed(1) + 'M';
    } else if (amountNum >= 1000) {
      amountStr = (amountNum / 1000).toFixed(1) + 'K';
    } else {
      amountStr = amountNum.toFixed(2);
    }

    return `${amountStr} ${currency}`;
  };

  // Render cell content based on column key
  const renderCell = (property: Property, columnKey: string) => {
    switch (columnKey) {
      case 'title':
        return <Text fontWeight="medium">{property.title}</Text>;

      case 'price':
        return formatPrice(property.amount.price, property.amount.currency);

      case 'location':
        return property.location;

      case 'bedrooms':
        return property.bedrooms;

      case 'bathrooms':
        return property.bathrooms;

      case 'status':
        return (
          <Badge
            colorPalette={property.status === 'available' ? 'green' : 'gray'}
            size="sm"
          >
            {property.status}
          </Badge>
        );

      case 'actions':
        return (
          <Stack direction="row" gap={2}>
            <Tooltip content="Edit property">
              <IconButton
                size="sm"
                variant="ghost"
                onClick={() => onEdit(property)}
                aria-label="Edit property"
              >
                <FiEdit2 />
              </IconButton>
            </Tooltip>
            <Tooltip content="Delete property">
              <IconButton
                size="sm"
                variant="ghost"
                colorPalette="red"
                onClick={() => onDelete(property)}
                aria-label="Delete property"
              >
                <FiTrash2 />
              </IconButton>
            </Tooltip>
          </Stack>
        );

      default:
        return null;
    }
  };

  if (loading) {
    const placeholderRows = Array.from({ length: 6 });
    const getSkeletonWidth = (key: string) => {
      switch (key) {
        case 'title':
          return '60%';
        case 'price':
          return '72px';
        case 'location':
          return '50%';
        case 'bedrooms':
        case 'bathrooms':
          return '48px';
        case 'status':
          return '80px';
        default:
          return '60%';
      }
    };

    return (
      <Box overflowX="auto" borderWidth="1px" borderRadius="lg" bg="bg">
        <Table.Root size="md" variant="outline">
          <Table.Header>
            <Table.Row>
              {visibleColumns.map((column) => (
                <Table.ColumnHeader key={`skeleton-header-${column.key}`}>
                  <Box display="flex" alignItems="center" gap={2} width="100%">
                    {getColumnIcon(column.key)}
                    <Text fontWeight="semibold">{column.label}</Text>
                  </Box>
                </Table.ColumnHeader>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {placeholderRows.map((_, rowIdx) => (
              <Table.Row key={`skeleton-row-${rowIdx}`}>
                {visibleColumns.map((column) => (
                  <Table.Cell key={`skeleton-cell-${rowIdx}-${column.key}`}>
                    {column.key === 'actions' ? (
                      <Stack direction="row" gap={2}>
                        <Skeleton borderRadius="full" boxSize={5} />
                        <Skeleton borderRadius="full" boxSize={5} />
                      </Stack>
                    ) : (
                      <Skeleton height={4} width={getSkeletonWidth(column.key)} />
                    )}
                  </Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>
    );
  }
  if (properties.length === 0) {
    return (
      <Box textAlign="center" py={10}>
        <Text fontSize="lg" color="gray.600">
          No properties found
        </Text>
        <Text fontSize="sm" color="gray.500" mt={2}>
          Try adjusting your search or add a new property
        </Text>
      </Box>
    );
  }

  return (
    <Box overflowX="auto" borderWidth="1px" borderRadius="lg" bg="bg">
      <Table.Root size="md" variant="outline">
        <Table.Header>
          <Table.Row>
            {visibleColumns.map((column) => (
              <Table.ColumnHeader
                key={column.key}
                draggable={column.key !== 'actions'}
                onDragStart={(e) => handleDragStart(e, column.key)}
                onDragOver={(e) => handleDragOver(e, column.key)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, column.key)}
                onDragEnd={handleDragEnd}
                cursor={column.key !== 'actions' ? 'grab' : 'default'}
                userSelect="none"
                position="relative"
                bg={draggedColumn === column.key ? dragBg : undefined}
                _hover={
                  column.key !== 'actions'
                    ? { 
                        bg: headerHoverBg,
                        '& > *': { opacity: 1 }
                      }
                    : undefined
                }
                transition="all 0.2s"
                borderWidth={dragOverColumn === column.key ? '2px' : undefined}
                borderColor={dragOverColumn === column.key ? 'blue.500' : undefined}
              >
                <Tooltip 
                  content={column.key !== 'actions' ? 'Drag to reorder columns' : undefined}
                  disabled={column.key === 'actions'}
                >
                  <Box 
                    display="flex" 
                    alignItems="center" 
                    gap={2}
                    width="100%"
                  >
                    {getColumnIcon(column.key)}
                    <Text fontWeight="semibold">{column.label}</Text>
                  </Box>
                </Tooltip>
              </Table.ColumnHeader>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {properties.map((property) => (
            <Table.Row 
              key={property.id}
              _hover={{ 
                bg: hoverBg,
                '& td': { 
                  color: 'inherit'
                }
              }}
              transition="all 0.2s ease-in-out"
            >
              {visibleColumns.map((column) => (
                <Table.Cell 
                  key={`${property.id}-${column.key}`}
                  transition="all 0.2s ease-in-out"
                >
                  {renderCell(property, column.key)}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}
