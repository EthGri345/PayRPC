import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PayRPC - Pay-Per-Request Solana API',
  description: 'HTTP 402 powered blockchain data access for autonomous agents. No registration. Just pay and go.',
  keywords: ['Solana', 'API', 'Web3', 'HTTP 402', 'Blockchain', 'Crypto', 'DeFi'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
