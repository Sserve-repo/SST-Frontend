"use client";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* <main className="grid grid-cols-1 lg:grid-cols-12 w-full h-screen">
        <div className="hidden lg:col-span-5 lg:block h-full overflow-hidden">
        </div>
        <div className="col-span-12 lg:col-span-7 overflow-auto">
          {children}
        </div>
      </main>
       */}

      <main className="grid w-full h-screen">
        <div className="col-span-12 lg:col-span-7 overflow-auto">
          {children}
        </div>
      </main>
    </>
  );
}
