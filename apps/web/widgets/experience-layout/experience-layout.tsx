import type { ReactNode } from 'react';

interface ExperienceLayoutProps {
  children: ReactNode;
}

export function ExperienceLayout({ children }: Readonly<ExperienceLayoutProps>) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-black text-white">
      <main className="relative flex flex-1 flex-col items-center justify-center">
        {children}
      </main>
    </div>
  );
}
