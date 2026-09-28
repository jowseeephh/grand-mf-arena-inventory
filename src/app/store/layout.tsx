import Shell, { NavItem } from "@/components/Shell";
import { requireStore } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { logout } from "@/app/login/actions";

const NAV: NavItem[] = [
  ["Dashboard", "/store"], ["Products", "/store/products"], ["Cart", "/store/cart"],
  ["My Orders", "/store/orders"], ["Purchase History", "/store/purchase-history"], ["Remittance", "/store/remittance"],
].map(([label, href]) => ({ label, href }));

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const s = await requireStore();
  const store = await prisma.store.findUnique({ where: { id: s.storeId } });
  return <Shell nav={NAV} title={store?.name ?? "Store"} user={s.name} logout={logout}>{children}</Shell>;
}
