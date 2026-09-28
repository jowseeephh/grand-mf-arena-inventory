import { prisma } from "@/lib/prisma";
import { money, num } from "@/lib/format";
import { requireStore } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function StoreDashboard() {
  const { storeId } = await requireStore(); // scoped by session, never by URL
  const [orders, pending, sales, remitted] = await Promise.all([
    prisma.order.count({ where: { storeId } }),
    prisma.order.count({ where: { storeId, status: { in: ["PENDING", "APPROVED", "PREPARING"] } } }),
    prisma.sale.aggregate({ where: { storeId }, _sum: { totalSales: true } }),
    prisma.remittance.aggregate({ where: { storeId }, _sum: { amount: true } }),
  ]);
  const total = Number(sales._sum.totalSales ?? 0);
  const paid = Number(remitted._sum.amount ?? 0);
  const cards: [string, string][] = [
    ["Total Orders", num(orders)], ["Open Orders", num(pending)],
    ["Total Purchases", money(total)], ["Amount Remitted", money(paid)], ["Remaining Balance", money(total - paid)],
  ];
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map(([l, v]) => (
          <div key={l} className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-sm text-slate-500">{l}</p><p className="mt-1 text-2xl font-bold">{v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
