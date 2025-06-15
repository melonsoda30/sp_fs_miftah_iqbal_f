import { ButtonLogout } from "@/components/layout/button-logout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <div className="flex flex-col h-screen overflow-hidden">
    //   {" "}
    //   {/* Full height layout */}
    //   {/* Header - fixed height */}
    //   <header className="flex-none w-full flex justify-between items-center p-4 border-b">
    //     <Link className="font-bold text-lg" href="/">
    //       Project Management App
    //     </Link>
    //     <Button>Logout</Button>
    //   </header>
    //   {/* Kontainer list card - fills remaining space */}
    //   <main className="flex-1 overflow-y-auto p-4">
    //     <div className="  grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    //       {children}
    //     </div>
    //   </main>
    // </div>

    <div className="flex flex-col min-h-screen bg-muted">
      <header className="w-full flex justify-end items-center p-4 border-b">
        <ButtonLogout />
      </header>

      {children}
    </div>
  );
}
