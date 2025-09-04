"use client";

import { MantineProvider, createTheme, MantineTheme } from "@mantine/core";
import "@mantine/core/styles.css";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { ReactNode } from "react";

// Define the theme configuration within the Client Component
const mantineTheme = createTheme({
  colors: {
    "input-bg": ["#1a263f", "#1a263f", "#1a263f", "#1a263f", "#1a263f", "#1a263f", "#1a263f", "#1a263f", "#1a263f", "#1a263f"],
    blue: [
      "#e6f2ff", "#cce5ff", "#99caff", "#66b0ff", "#3395ff",
      "#007fff", "#0066cc", "#004d99", "#003366", "#001a33",
    ],
    // Brand-aligned dark/gray replacement with purple-blue tones
    dark: [
      "#D6CAF1", // lightest - text-nav-link color
      "#B8A6E8", // lighter purple
      "#9B84DF", // light purple
      "#7D62D6", // medium purple  
      "#5F40CD", // darker purple
      "#4A2FB8", // brand purple
      "#3A2494", // dark purple
      "#2A1A70", // darker purple
      "#1A0F4C", // very dark purple
      "#0E0528", // darkest purple
    ],
    // Custom brand color palette
    brand: [
      "#F3F0FF", // lightest
      "#E9E4FF", // very light
      "#D6CAF1", // light - matches text-nav-link
      "#B8A6E8", // medium light  
      "#9B84DF", // medium
      "#7c3aed", // primary brand purple
      "#6d28d9", // darker purple
      "#5b21b6", // dark purple
      "#4c1d95", // very dark
      "#2e1065", // darkest
    ],
    // Background color palette
    surface: [
      "#F8F9FF", // lightest
      "#F0F2FF", // very light
      "#E8EBFF", // light
      "#D0D5FF", // medium light
      "#B8BFFF", // medium
      "#242b3d", // border-muted
      "#1A2332", // darker
      "#0E1525", // bg-muted/header/footer
      "#100826", // darker
      "#0E1525", // bg-base (darkest)
    ],
  },
  primaryColor: "brand",
  primaryShade: 5,
  components: {
    TextInput: {
      styles: (theme: MantineTheme) => ({
        input: {
          backgroundColor: theme.colors.surface[7], // bg-muted equivalent
          color: theme.colors.dark[0], // light purple text
          borderColor: theme.colors.surface[5], // border-muted
          '&:focus': {
            borderColor: theme.colors.brand[5], // brand purple focus
          },
        },
      }),
    },
    NumberInput: {
      styles: (theme: MantineTheme) => ({
        input: {
          backgroundColor: theme.colors.surface[7],
          color: theme.colors.dark[0],
          borderColor: theme.colors.surface[5],
          '&:focus': {
            borderColor: theme.colors.brand[5],
          },
        },
      }),
    },
    Paper: {
      styles: (theme: MantineTheme) => ({
        root: {
          backgroundColor: theme.colors.surface[7],
          borderColor: theme.colors.surface[5],
        },
      }),
    },
    Card: {
      styles: (theme: MantineTheme) => ({
        root: {
          backgroundColor: theme.colors.surface[7],
          borderColor: theme.colors.surface[5],
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