'use client';

import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-amber-50 dark:bg-stone-900">
      <Navbar />
      <main className="relative">
        {children}
      </main>
      <Footer />
    </div>
  );
}
