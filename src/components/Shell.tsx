"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, LogOut } from "lucide-react";

export type NavItem = { label: string; href: string };

export default function Shell({
  nav, title, user, logout, children,
}: { nav: NavItem[]; title: string; user: string; logout: () => Promise<void>; children: React.ReactNode }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => (href.split("/").length <= 2 ? path === href : path === href || path.startsWith(href + "/"));

  const menu = (
    <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
      {nav.map((n) => (
        <Link key={n.href} href={n.href} onClick={() => setOpen(false)}
          className={`block rounded-md px-3 py-2 text-sm font-medium ${isActive(n.href) ? "bg-arena-500 text-white" : "text-slate-300 hover:bg-ink-700 hover:text-white"}`}>
          {n.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen lg:flex">
      <aside className="hidden w-60 shrink-0 flex-col bg-ink-900 lg:flex">
        <div className="px-5 py-5"><p className="font-bold text-white">Grand MF Arena</p><p className="text-xs text-slate-400">{title}</p></div>
        {menu}
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col bg-ink-900">
            <div className="flex items-center justify-between px-5 py-5">
              <p className="font-bold text-white">Grand MF Arena</p>
              <button aria-label="Close menu" onClick={() => setOpen(false)} className="text-white"><X size={20} /></button>
            </div>
            {menu}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
          <button aria-label="Open menu" className="lg:hidden" onClick={() => setOpen(true)}><Menu size={22} /></button>
          <span className="hidden text-sm text-slate-500 lg:block">{title}</span>
          <div className="flex items-center gap-3 text-sm">
            <span className="font-medium">{user}</span>
            <form action={logout}><button className="flex items-center gap-1 text-slate-600 hover:text-arena-600"><LogOut size={16} />Sign out</button></form>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
