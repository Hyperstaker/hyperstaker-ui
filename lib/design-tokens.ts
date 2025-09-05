/**
 * HyperStaker Design Tokens
 * 
 * Single source of truth for all colors, spacing, and design values.
 * This file generates configurations for both Mantine and Tailwind CSS.
 */

// Base color palette following standard color scale (50-950)
export const designTokens = {
  colors: {
    // Primary brand colors (purple scale)
    brand: {
      50: "#F3F0FF",   // lightest
      100: "#E9E4FF",  // very light  
      200: "#D6CAF1",  // light (text-nav-link)
      300: "#B8A6E8",  // medium light
      400: "#9B84DF",  // medium
      500: "#4F45E4",  // PRIMARY button color
      600: "#4338CA",  // dark
      700: "#3730A3",  // darker  
      800: "#312E81",  // very dark
      900: "#1E1B4B",  // darkest
    },

    // Surface colors (replacing all grays)
    surface: {
      50: "#F8F9FF",   // lightest
      100: "#F0F2FF",  // very light
      200: "#E8EBFF",  // light
      300: "#D0D5FF",  // medium light
      400: "#B8BFFF",  // medium
      500: "#242b3d",  // BORDERS (border-muted)
      600: "#1A2332",  // cards/containers
      700: "#150B31",  // components (deprecated - use 800)
      800: "#0E1525",  // BACKGROUNDS (bg-base/bg-muted)
      900: "#0A0F1A",  // darkest possible
    },

    // Semantic state colors
    success: {
      50: "#ECFDF5",
      500: "#10B981",  // primary success
      600: "#059669",  // dark success
      700: "#047857",  // darker success
    },

    warning: {
      50: "#FFFBEB", 
      500: "#F59E0B",  // primary warning
      600: "#D97706",  // dark warning
      700: "#B45309",  // darker warning
    },

    error: {
      50: "#FEF2F2",
      500: "#EF4444",  // primary error
      600: "#DC2626",  // dark error  
      700: "#B91C1C",  // darker error
    },

    info: {
      50: "#EFF6FF",
      500: "#3B82F6",  // primary info
      600: "#2563EB",  // dark info
      700: "#1D4ED8",  // darker info
    },

    // Neutral colors for text (using brand-tinted neutrals)
    neutral: {
      50: "#D1D5DB",   // lightest text - rgb(209, 213, 219)
      100: "#D6CAF1",  // light text (text-nav-link)
      200: "#B8A6E8",  // secondary text
      300: "#9B84DF",  // muted text
      400: "#7D62D6",  // accent text
      500: "#5A4A9D",  // medium text
      600: "#4A2FB8",  // dark text
      700: "#0E1525",  // darker text
      800: "#2A1A70",  // very dark text
      900: "#2e1065",  // darkest text (inverse)
    },

    // Legacy support colors (for gradual migration)
    legacy: {
      customLink: "#1791AC",
      white: "#FFFFFF",
      black: "#000000",
      transparent: "transparent",
    },
  },

  // Semantic color mappings (what developers should actually use)
  semantic: {
    // Backgrounds
    background: {
      primary: "#0E1525",    // surface.800
      secondary: "#1A2332",  // surface.600  
      tertiary: "#242b3d",   // surface.500
      inverse: "#FFFFFF",
    },

    // Text colors
    text: {
      primary: "#D1D5DB",    // neutral.50 - brightest text
      secondary: "#D6CAF1",  // neutral.100 - secondary text
      muted: "#B8A6E8",      // neutral.200 - muted text
      accent: "#4F45E4",     // brand.500 - accent/link text
      inverse: "#2e1065",    // neutral.900 - dark text on light bg
    },

    // Interactive states  
    interactive: {
      primary: "#4F45E4",      // brand.500 - PRIMARY button color
      primaryHover: "#4338CA", // brand.600
      primaryActive: "#3730A3", // brand.700
      secondary: "#242b3d",     // surface.500
      secondaryHover: "#1A2332", // surface.600
    },

    // Borders
    border: {
      primary: "#242b3d",    // surface.500
      secondary: "#1A2332",  // surface.600
      accent: "#4F45E4",     // brand.500
    },
  },

  // Generate Mantine color arrays (10 shades each)
  getMantineColors: () => ({
    brand: [
      designTokens.colors.brand[50],
      designTokens.colors.brand[100], 
      designTokens.colors.brand[200],
      designTokens.colors.brand[300],
      designTokens.colors.brand[400],
      designTokens.colors.brand[500], // index 5 = primary
      designTokens.colors.brand[600],
      designTokens.colors.brand[700],
      designTokens.colors.brand[800],
      designTokens.colors.brand[900],
    ],
    surface: [
      designTokens.colors.surface[50],
      designTokens.colors.surface[100],
      designTokens.colors.surface[200], 
      designTokens.colors.surface[300],
      designTokens.colors.surface[400],
      designTokens.colors.surface[500], // borders
      designTokens.colors.surface[600], // cards
      designTokens.colors.surface[700], // deprecated
      designTokens.colors.surface[800], // backgrounds
      designTokens.colors.surface[900],
    ],
    // Override default 'dark' to use our neutral colors
    dark: [
      designTokens.colors.neutral[50],  // lightest
      designTokens.colors.neutral[100], 
      designTokens.colors.neutral[200],
      designTokens.colors.neutral[300],
      designTokens.colors.neutral[400],
      designTokens.colors.neutral[500],
      designTokens.colors.neutral[600],
      designTokens.colors.neutral[700],
      designTokens.colors.neutral[800],
      designTokens.colors.neutral[900], // darkest
    ],
  }),

  // Generate Tailwind colors object
  getTailwindColors: () => ({
    // Semantic colors
    brand: designTokens.colors.brand,
    surface: designTokens.colors.surface,
    neutral: designTokens.colors.neutral,
    success: designTokens.colors.success,
    warning: designTokens.colors.warning,
    error: designTokens.colors.error,
    info: designTokens.colors.info,
    
    // Legacy colors (keep existing Tailwind class names working)
    gray: {
      50: designTokens.colors.neutral[50],
      100: designTokens.colors.neutral[100],
      200: designTokens.colors.neutral[200],
      300: designTokens.colors.neutral[300],
      400: designTokens.colors.neutral[400],
      500: designTokens.colors.neutral[500],
      600: designTokens.colors.neutral[600],
      700: designTokens.colors.neutral[700],
      800: designTokens.colors.surface[800], // backgrounds
      900: designTokens.colors.neutral[900],
    },

    // Keep specific legacy values
    "custom-link": designTokens.colors.legacy.customLink,
    "border-muted": designTokens.colors.surface[500],
    "bg-base": designTokens.colors.surface[800],
    "bg-muted": designTokens.colors.surface[800],
    "bg-header": designTokens.colors.surface[800],  
    "bg-footer": designTokens.colors.surface[800],
    "text-nav-link": designTokens.colors.neutral[100],
  }),

  // CSS Custom Properties for direct style usage
  getCSSVariables: () => ({
    // Semantic variables
    "--color-bg-primary": designTokens.colors.surface[800],
    "--color-bg-secondary": designTokens.colors.surface[600],
    "--color-bg-tertiary": designTokens.colors.surface[500],
    
    "--color-text-primary": "#D1D5DB",
    "--color-text-secondary": designTokens.colors.neutral[100],
    "--color-text-muted": designTokens.colors.neutral[200],
    
    "--color-brand-primary": "#4F45E4",  // PRIMARY button color
    "--color-brand-hover": "#4338CA",
    "--color-brand-active": "#3730A3",
    
    "--color-border-primary": designTokens.colors.surface[500],
    "--color-border-secondary": designTokens.colors.surface[600],
  }),
} as const;

export default designTokens;