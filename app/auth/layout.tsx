"use client";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <main className="grid w-full h-screen">
        <div className="col-span-12 lg:col-span-7 overflow-auto">
          {children}
        </div>
      </main>
    </>
  );
}
