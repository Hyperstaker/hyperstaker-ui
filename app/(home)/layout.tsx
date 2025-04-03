import './globals.css';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import { createTheme } from '@mantine/core';

const mantineTheme = createTheme({
  colors: {
    blue: [
      '#e6f2ff',
      '#cce5ff',
      '#99caff',
      '#66b0ff',
      '#3395ff',
      '#007fff',
      '#0066cc',
      '#004d99',
      '#003366',
      '#001a33',
    ],
    dark: [
      '#C1C2C5',
      '#A6A7AB',
      '#909296',
      '#5C5F66',
      '#373A40',
      '#2C2E33',
      '#25262B',
      '#262626',
      '#141517',
      '#101113',
    ],
  },
  primaryColor: 'blue',
  primaryShade: 6,
});

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-mantine-color-scheme="dark" className={`h-full`}>
      <body className="h-full w-full overflow-x-hidden">
        <MantineProvider defaultColorScheme="dark" theme={mantineTheme}>
          <ModalsProvider>
            <Notifications position="top-right" />
            {children}
          </ModalsProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
