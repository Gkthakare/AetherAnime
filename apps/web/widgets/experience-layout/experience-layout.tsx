import type { ReactNode } from 'react';

interface ExperienceLayoutProps {
  children: ReactNode;
}

/**
 * ExperienceLayout — shell for immersive experience scenes.
 *
 * Uses semantic theme surfaces so Soft Aether climate is consistent.
 * Does not own scene choreography or widget visuals.
 */
export function ExperienceLayout({ children }: Readonly<ExperienceLayoutProps>) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background text-foreground">
      <main className="relative flex flex-1 flex-col items-center justify-center">
        {children}
      </main>
    </div>
  );
}
