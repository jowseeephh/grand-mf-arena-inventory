import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { money, num } from "@/lib/format";
import InventoryTable, { InventoryProduct, StockMovementRow } from "@/components/inventory/InventoryTable";
import { Boxes, PackageSearch, AlertTriangle, PackageX, Coins } from "lucide-react";
import type { ComponentType } from "react";

export const dynamic = "force-dynamic";

export default async function InventoryPage() {
  await requireAdmin();

  const [products, movements] = await Promise.all([
    prisma.product.findMany({
      where: { active: true },
      include: { category: true },
      orderBy: { name: "asc" },
    }),
    prisma.stockMovement.findMany({
      include: { product: { select: { name: true } }, createdBy: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 25,
    }),
  ]);

  const rows: InventoryProduct[] = products.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category.name,
    unit: p.unit,
    costPrice: Number(p.costPrice),
    sellingPrice: Number(p.sellingPrice),
    currentStock: p.currentStock,
    minStock: p.minStock,
  }));

  const movementRows: StockMovementRow[] = movements.map((m) => ({
    id: m.id,
    productName: m.product.name,
    type: m.type,
    quantity: m.quantity,
    previousStock: m.previousStock,
    newStock: m.newStock,
    note: m.note,
    createdByName: m.createdBy?.name ?? null,
    createdAt: m.createdAt.toISOString(),
  }));

  const totalProducts = rows.length;
  const totalStock = rows.reduce((sum, p) => sum + p.currentStock, 0);
  const lowStock = rows.filter((p) => p.currentStock > 0 && p.currentStock <= p.minStock).length;
  const outOfStock = rows.filter((p) => p.currentStock <= 0).length;
  const inventoryValue = rows.reduce((sum, p) => sum + p.currentStock * p.costPrice, 0);

  const stats: [string, string, ComponentType<{ size?: number; className?: string }>][] = [
    ["Total Products", num(totalProducts), PackageSearch],
    ["Total Stock", num(totalStock), Boxes],
    ["Low Stock", num(lowStock), AlertTriangle],
    ["Out of Stock", num(outOfStock), PackageX],
    ["Inventory Value", money(inventoryValue), Coins],
  ];

  return (
    <div className="-m-4 min-h-[calc(100vh-57px)] space-y-6 bg-black p-4 sm:-m-6 sm:p-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-[#D4AF37]/30 bg-gradient-to-br from-black via-[#0c0c0c] to-[#1a1305] p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#D4AF37]/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-10 bottom-0 h-48 w-48 rounded-full bg-[#D4AF37]/5 blur-3xl" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/gma-logo.jpg"
          alt=""
          aria-hidden
          className="pointer-events-none absolute right-2 top-1/2 hidden h-48 w-48 -translate-y-1/2 object-contain opacity-[0.06] sm:block sm:h-64 sm:w-64"
        />
        <div className="relative flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/gma-logo.jpg"
            alt="Grand MF Arena"
            className="h-14 w-14 shrink-0 rounded-full object-cover ring-1 ring-[#D4AF37]/40 sm:h-16 sm:w-16"
          />
          <div>
            <p className="text-xl font-bold tracking-wide text-[#D4AF37] sm:text-2xl">Grand MF Arena</p>
            <p className="text-sm text-gray-300 sm:text-base">Inventory Management</p>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map(([label, value, Icon]) => (
          <div
            key={label}
            className="rounded-xl border border-[#D4AF37]/20 bg-[#0d0d0d] p-4 transition hover:border-[#D4AF37]/40"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-400 sm:text-sm">{label}</p>
              <Icon size={16} className="text-[#D4AF37]/70" />
            </div>
            <p className="mt-1 text-xl font-bold text-white sm:text-2xl">{value}</p>
          </div>
        ))}
      </div>

      {/* Table + toolbar */}
      <InventoryTable products={rows} movements={movementRows} />
    </div>
  );
}
