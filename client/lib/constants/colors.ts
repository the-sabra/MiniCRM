/**
 * Standardized color constants for consistent theming across the application
 */

export const HOVER_COLORS = {
  // Light mode hover colors
  light: {
    table: 'gray.50',
    menu: 'gray.100',
    button: 'gray.100',
    card: 'gray.50',
  },
  // Dark mode hover colors
  dark: {
    table: 'gray.700',
    menu: 'gray.700',
    button: 'gray.700',
    card: 'gray.800',
  },
} as const;

export const BACKGROUND_COLORS = {
  light: {
    primary: 'white',
    secondary: 'gray.50',
    accent: 'blue.50',
  },
  dark: {
    primary: 'gray.800',
    secondary: 'gray.900',
    accent: 'blue.900',
  },
} as const;

export const BORDER_COLORS = {
  light: {
    default: 'gray.200',
    hover: 'gray.300',
    active: 'blue.500',
  },
  dark: {
    default: 'gray.700',
    hover: 'gray.600',
    active: 'blue.400',
  },
} as const;

export const TEXT_COLORS = {
  light: {
    primary: 'gray.900',
    secondary: 'gray.600',
    muted: 'gray.500',
  },
  dark: {
    primary: 'gray.100',
    secondary: 'gray.400',
    muted: 'gray.500',
  },
} as const;
