/**
 * HyperStaker Brand Color System
 * 
 * Centralized color constants that align with the Mantine theme
 * and provide consistent brand colors across the application.
 */

export const colors = {
  // Primary brand colors
  brand: {
    lightest: "#F3F0FF",
    veryLight: "#E9E4FF", 
    light: "#D6CAF1",      // text-nav-link
    mediumLight: "#B8A6E8",
    medium: "#9B84DF",
    primary: "#7c3aed",    // primary brand purple
    dark: "#6d28d9",       // darker purple
    darker: "#5b21b6",     // dark purple
    veryDark: "#4c1d95",   // very dark
    darkest: "#2e1065",    // darkest
  },

  // Background and surface colors (replacing grays)
  surface: {
    lightest: "#F8F9FF",
    veryLight: "#F0F2FF", 
    light: "#E8EBFF",
    mediumLight: "#D0D5FF",
    medium: "#B8BFFF",
    muted: "#242b3d",      // border-muted
    dark: "#1A2332",       // darker
    veryDark: "#0E1525",   // bg-muted/header/footer
    darker: "#100826",     // darker
    darkest: "#0E1525",    // bg-base (darkest)
  },

  // Text colors (replacing grays)
  text: {
    primary: "#FCE9DE",    // lightest purple
    secondary: "#B8A6E8",  // lighter purple  
    muted: "#9B84DF",      // light purple
    accent: "#7D62D6",     // medium purple
    inverse: "#2e1065",    // dark on light backgrounds
  },

  // State colors
  states: {
    success: {
      light: "#10B981",
      primary: "#059669", 
      dark: "#047857",
    },
    warning: {
      light: "#F59E0B",
      primary: "#D97706",
      dark: "#B45309", 
    },
    error: {
      light: "#EF4444",
      primary: "#DC2626",
      dark: "#B91C1C",
    },
    info: {
      light: "#3B82F6", 
      primary: "#2563EB",
      dark: "#1D4ED8",
    },
  },

  // Interactive states
  interactive: {
    hover: "#6d28d9",      // brand dark
    active: "#7c3aed",     // brand primary
    focus: "#9B84DF",      // light purple
    disabled: "#4A2FB8",   // muted purple
  },

  // Legacy Tailwind mapping (for gradual migration)
  legacy: {
    bgBase: "#0E1525",
    bgMuted: "#0E1525", 
    bgHeader: "#0E1525",
    bgFooter: "#0E1525",
    borderMuted: "#242b3d",
    textNavLink: "#D6CAF1",
    customLink: "#1791AC",
  },
} as const;

// CSS Custom Properties for easy use in styles
export const cssVariables = {
  "--color-brand-primary": colors.brand.primary,
  "--color-brand-light": colors.brand.light,
  "--color-brand-dark": colors.brand.dark,
  "--color-surface-darkest": colors.surface.darkest,
  "--color-surface-dark": colors.surface.veryDark,
  "--color-surface-muted": colors.surface.muted,
  "--color-text-primary": colors.text.primary,
  "--color-text-secondary": colors.text.secondary,
  "--color-interactive-hover": colors.interactive.hover,
  "--color-interactive-active": colors.interactive.active,
} as const;

// Utility functions for common color operations
export const colorUtils = {
  /**
   * Get a surface color based on depth (0 = lightest, 9 = darkest)
   */
  getSurface: (depth: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9) => {
    const surfaces = [
      colors.surface.lightest,    // 0
      colors.surface.veryLight,   // 1  
      colors.surface.light,       // 2
      colors.surface.mediumLight, // 3
      colors.surface.medium,      // 4
      colors.surface.muted,       // 5
      colors.surface.dark,        // 6
      colors.surface.veryDark,    // 7
      colors.surface.darker,      // 8
      colors.surface.darkest,     // 9
    ];
    return surfaces[depth];
  },

  /**
   * Get a brand color based on intensity (0 = lightest, 9 = darkest)
   */
  getBrand: (intensity: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9) => {
    const brands = [
      colors.brand.lightest,    // 0
      colors.brand.veryLight,   // 1
      colors.brand.light,       // 2
      colors.brand.mediumLight, // 3
      colors.brand.medium,      // 4
      colors.brand.primary,     // 5
      colors.brand.dark,        // 6
      colors.brand.darker,      // 7
      colors.brand.veryDark,    // 8
      colors.brand.darkest,     // 9
    ];
    return brands[intensity];
  },

  /**
   * Get text color based on background darkness
   */
  getTextForBackground: (isDark: boolean) => {
    return isDark ? colors.text.primary : colors.text.inverse;
  },
};

export default colors;