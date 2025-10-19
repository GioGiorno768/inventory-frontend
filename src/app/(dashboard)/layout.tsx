import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <Sidebar />
      <div className="pt-16 lg:pl-64">
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
