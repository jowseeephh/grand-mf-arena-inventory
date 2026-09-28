import { prisma } from "@/lib/prisma";
import { money, num } from "@/lib/format";
import { requireAdmin } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  await requireAdmin();
  const [products, sales, pending, remitted] = await Promise.all([
    prisma.product.findMany({ where: { active: true }, select: { currentStock: true, minStock: true } }),
    prisma.sale.aggregate({ _sum: { totalSales: true, totalCost: true, profit: true } }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.remittance.aggregate({ _sum: { amount: true } }),
  ]);

  const stock = products.reduce((a, p) => a + p.currentStock, 0);
  const out = products.filter((p) => p.currentStock === 0).length;
  const low = products.filter((p) => p.currentStock > 0 && p.currentStock <= p.minStock).length;
  const totalSales = Number(sales._sum.totalSales ?? 0);
  const totalRemitted = Number(remitted._sum.amount ?? 0);

  const cards: [string, string, string?][] = [
    ["Total Products", num(products.length)],
    ["Current Stock", num(stock)],
    ["Low Stock", num(low), low ? "text-amber-600" : undefined],
    ["Out of Stock", num(out), out ? "text-red-600" : undefined],
    ["Total Sales", money(totalSales)],
    ["Total Cost", money(sales._sum.totalCost)],
    ["Total Profit", money(sales._sum.profit), "text-emerald-600"],
    ["Pending Orders", num(pending)],
    ["Total Remittance", money(totalRemitted)],
    ["Remaining Remittance", money(totalSales - totalRemitted), totalSales - totalRemitted > 0 ? "text-arena-600" : undefined],
  ];

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map(([label, value, color]) => (
          <div key={label} className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-sm text-slate-500">{label}</p>
            <p className={`mt-1 text-2xl font-bold ${color ?? ""}`}>{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
