import React from 'react';
import { Header } from '../landing/header.component';
import { Footer } from '../landing/footer.component';
import { cn } from '../../utils/cn';

interface LandingLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const LandingLayout: React.FC<LandingLayoutProps> = React.memo(({
  children,
  className
}) => {
  return (
    <div className={cn("bg-background min-h-screen", className)}>
      <Header />
      <main role="main">
        {children}
      </main>
      <Footer />
    </div>
  );
});