import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GEOTHERM SHIELD | Climate-Aware Passive Shelter & Solar Optimization',
  description: 'Software-based engineering decision-support platform for location-specific shelter thermal comfort maintenance and solar optimization (SIH26051).',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-navy-950 text-slate-100 antialiased min-h-screen selection:bg-teal-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
