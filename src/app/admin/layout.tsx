import Shell, { NavItem } from "@/components/Shell";
import { requireAdmin } from "@/lib/session";
import { logout } from "@/app/login/actions";

const NAV: NavItem[] = [
  ["Dashboard", "/admin"], ["Events", "/admin/events"], ["Products", "/admin/products"],
  ["Inventory", "/admin/inventory"], ["Stock Receiving", "/admin/stock-receiving"], ["Orders", "/admin/orders"],
  ["Stores", "/admin/stores"], ["Sales", "/admin/sales"], ["Remittance", "/admin/remittance"],
  ["Reports", "/admin/reports"], ["Activity Logs", "/admin/activity-logs"], ["Settings", "/admin/settings"],
].map(([label, href]) => ({ label, href }));

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const s = await requireAdmin();
  return <Shell nav={NAV} title="Admin / Office" user={s.name} logout={logout}>{children}</Shell>;
}
