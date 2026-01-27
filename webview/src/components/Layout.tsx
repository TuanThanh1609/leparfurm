import type { ReactNode } from "react";

export function Layout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-brand-cream/50 flex items-center justify-center font-sans">
            <main className="w-full max-w-md h-[100dvh] md:h-[850px] bg-white md:rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col md:border-8 md:border-brand-dark/5">
                {children}
            </main>
        </div>
    );
}
