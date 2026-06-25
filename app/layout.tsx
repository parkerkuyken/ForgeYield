import './globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { ReactNode } from 'react';
import Providers from '../components/Providers';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E🔨%3C/text%3E%3C/svg%3E" />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}