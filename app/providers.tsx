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
    dark: [
      "#C1C2C5", "#A6A7AB", "#909296", "#5C5F66", "#373A40",
      "#2C2E33", "#25262B", "#1A1B1E", "#141517", "#101113",
    ],
  },
  primaryColor: "blue",
  primaryShade: 6,
  components: {
    TextInput: {
      styles: (theme: MantineTheme) => ({
        input: {
          backgroundColor: theme.colors["input-bg"][6],
          color: theme.white,
          borderColor: theme.colors.dark[4],
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