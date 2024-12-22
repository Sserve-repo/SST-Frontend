import { Header } from "@/components/dashboard/header";
import { DashboardNav } from "@/components/dashboard/nav";
import { PageWrapper } from "@/components/dashboard/page-wrapper";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50/60">
      <DashboardNav />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <PageWrapper>{children}</PageWrapper>
      </div>
    </div>
  );
}

