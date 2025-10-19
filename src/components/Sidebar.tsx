"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import {
  LayoutDashboard,
  Package,
  ArrowLeftRight,
  FileText,
  Users,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const isAdmin = useAuthStore((state) => state.isAdmin);

  const menuItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      roles: ["admin", "staff"],
    },
    {
      name: "Barang",
      href: "/items",
      icon: Package,
      roles: ["admin", "staff"],
    },
    {
      name: "Transaksi",
      href: "/transactions",
      icon: ArrowLeftRight,
      roles: ["admin", "staff"],
    },
    {
      name: "Laporan",
      href: "/reports",
      icon: FileText,
      roles: ["admin"],
    },
    {
      name: "Users",
      href: "/users",
      icon: Users,
      roles: ["admin"],
    },
  ];

  const filteredMenu = menuItems.filter((item) =>
    isAdmin ? true : item.roles.includes("staff")
  );

  return (
    <aside
      id="sidebar"
      className="fixed top-0 left-0 z-20 flex flex-col flex-shrink-0 w-64 h-full pt-16 duration-300 lg:flex transition-all -translate-x-full lg:translate-x-0"
    >
      <div className="relative flex flex-col flex-1 min-h-0 pt-0 bg-white border-r border-gray-200">
        <div className="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
          <div className="flex-1 px-3 space-y-1 bg-white">
            {filteredMenu.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
