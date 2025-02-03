import { Header } from "@/components/dashboard/header";
import { DashboardNav } from "@/components/dashboard/nav";
import { PageWrapper } from "@/components/dashboard/page-wrapper";
import { AuthGuard } from "@/components/auth/auth-guard";
import type React from "react"; // Added import for React

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden bg-slate-50/60">
        <DashboardNav />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />
          <PageWrapper>{children}</PageWrapper>
        </div>
      </div>
    </AuthGuard>
  );
}
