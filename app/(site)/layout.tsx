import ClientLayout from "@/components/extras/ClientLayout";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ClientLayout>{children}</ClientLayout>
    </>
  );
}
