import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '108-Day Experiment',
  description: 'Personal 108-Day Experiment application',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
