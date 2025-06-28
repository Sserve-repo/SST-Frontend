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
    <>
      <AuthGuard>
        <div className="flex h-screen bg-slate-50/60">
          <DashboardNav />
          <div className="flex flex-col flex-1 h-full">
            <Header />
            <div className="flex-1 overflow-y-auto">
              <PageWrapper>{children}</PageWrapper>
            </div>
          </div>
        </div>
      </AuthGuard>
    </>
  );
}
