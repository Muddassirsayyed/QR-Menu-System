// app/dashboard/layout.tsx
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/Header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <DashboardHeader />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
