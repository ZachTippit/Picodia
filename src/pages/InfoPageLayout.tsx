import type { ReactNode } from "react";

interface InfoPageLayoutProps {
  children: ReactNode;
}

const InfoPageLayout = ({ children }: InfoPageLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-200 px-4 py-10 text-gray-900">
      <main className="mx-auto flex max-w-3xl flex-col gap-8 rounded-xl bg-white/80 px-6 py-10 shadow-sm backdrop-blur">
        {children}
      </main>
    </div>
  );
};

export default InfoPageLayout;
