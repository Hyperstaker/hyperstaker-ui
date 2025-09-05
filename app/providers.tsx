"use client";

import { MantineProvider, createTheme, MantineTheme } from "@mantine/core";
import "@mantine/core/styles.css";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { ReactNode } from "react";
import { designTokens } from "@/lib/design-tokens";

// Define the theme configuration using design tokens as single source of truth
const mantineTheme = createTheme({
  colors: {
    // Legacy input background (keep for compatibility)
    "input-bg": ["#1a263f", "#1a263f", "#1a263f", "#1a263f", "#1a263f", "#1a263f", "#1a263f", "#1a263f", "#1a263f", "#1a263f"],
    
    // Standard blue palette (keep existing)
    blue: [
      "#e6f2ff", "#cce5ff", "#99caff", "#66b0ff", "#3395ff",
      "#007fff", "#0066cc", "#004d99", "#003366", "#001a33",
    ],
    
    // Use design tokens for primary colors
    brand: [
      "#F3F0FF", "#E9E4FF", "#D6CAF1", "#B8A6E8", "#9B84DF", 
      "#4F45E4", "#4338CA", "#3730A3", "#312E81", "#1E1B4B"
    ],
    surface: [
      "#F8F9FF", "#F0F2FF", "#E8EBFF", "#D0D5FF", "#B8BFFF", 
      "#242b3d", "#1A2332", "#150B31", "#0E1525", "#0A0F1A"
    ],
    dark: [
      "#D1D5DB", "#D6CAF1", "#B8A6E8", "#9B84DF", "#7D62D6", 
      "#5A4A9D", "#4A2FB8", "#3A2494", "#2A1A70", "#2e1065"
    ],
  },
  primaryColor: "brand",
  primaryShade: 5,
  components: {
    // Global component styling using design tokens
    TextInput: {
      styles: (theme: MantineTheme) => ({
        input: {
          backgroundColor: theme.colors.surface[8], // backgrounds
          color: theme.colors.dark[0], // light text
          borderColor: theme.colors.surface[5], // borders
          "&:focus": {
            borderColor: theme.colors.brand[5], // PRIMARY button color focus
          },
        },
      }),
    },
    NumberInput: {
      styles: (theme: MantineTheme) => ({
        input: {
          backgroundColor: theme.colors.surface[8],
          color: theme.colors.dark[0],
          borderColor: theme.colors.surface[5],
          "&:focus": {
            borderColor: theme.colors.brand[5], // PRIMARY button color focus
          },
        },
      }),
    },
    Paper: {
      styles: (theme: MantineTheme) => ({
        root: {
          backgroundColor: theme.colors.surface[8],
          borderColor: theme.colors.surface[5],
        },
      }),
    },
    Card: {
      styles: (theme: MantineTheme) => ({
        root: {
          backgroundColor: theme.colors.surface[8],
          borderColor: theme.colors.surface[5],
        },
      }),
    },
    Button: {
      styles: (theme: MantineTheme) => ({
        root: {
          // Ensure all primary buttons use #4F45E4
          "&[data-variant=\"filled\"]": {
            backgroundColor: theme.colors.brand[5], // PRIMARY button color
            "&:hover": {
              backgroundColor: theme.colors.brand[6],
            },
            "&:active": {
              backgroundColor: theme.colors.brand[7],
            },
          },
        },
      }),
    },
  },
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MantineProvider defaultColorScheme="dark" theme={mantineTheme}>
      <ModalsProvider>
        <Notifications position="top-right" />
        {children}
      </ModalsProvider>
    </MantineProvider>
  );
} 