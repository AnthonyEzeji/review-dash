'use client';

import React from 'react';
import Navigation from './Navigation';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <>
      <Navigation />
      <main>{children}</main>
    </>
  );
} 