import { cn } from "@/lib/utils";
import { Sidebar } from "./sidebar";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function Layout({ children, className }: LayoutProps) {
  return (
    <div className="grid border border-gray-200 min-h-[30rem] shadow-sm rounded-3xl w-full lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <main className={cn("flex-1 overflow-hidden", className)}>
        {children}
      </main>
    </div>
  );
}
