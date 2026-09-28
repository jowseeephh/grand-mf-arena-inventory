"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, PackagePlus, Truck, History, X, Pencil } from "lucide-react";
import { money, num } from "@/lib/format";

export type InventoryProduct = {
  id: string;
  name: string;
  category: string;
  unit: string;
  costPrice: number;
  sellingPrice: number;
  currentStock: number;
  minStock: number;
};

export type StockMovementRow = {
  id: string;
  productName: string;
  type: "RECEIVE" | "SALE" | "ADJUSTMENT";
  quantity: number;
  previousStock: number;
  newStock: number;
  note: string | null;
  createdByName: string | null;
  createdAt: string;
};

type Status = "IN STOCK" | "LOW STOCK" | "OUT OF STOCK";

function statusOf(p: InventoryProduct): Status {
  if (p.currentStock <= 0) return "OUT OF STOCK";
  if (p.currentStock <= p.minStock) return "LOW STOCK";
  return "IN STOCK";
}

function StatusBadge({ status }: { status: Status }) {
  const styles: Record<Status, string> = {
    "IN STOCK": "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    "LOW STOCK": "border-amber-500/30 bg-amber-500/10 text-amber-400",
    "OUT OF STOCK": "border-red-500/30 bg-red-500/10 text-red-400",
  };
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide ${styles[status]}`}>
      {status}
    </span>
  );
}

const movementStyles: Record<StockMovementRow["type"], string> = {
  RECEIVE: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  SALE: "border-sky-500/30 bg-sky-500/10 text-sky-400",
  ADJUSTMENT: "border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37]",
};

export default function InventoryTable({
  products,
  movements,
}: {
  products: InventoryProduct[];
  movements: StockMovementRow[];
}) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | Status>("ALL");
  const [historyOpen, setHistoryOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const matchesQuery = !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "ALL" || statusOf(p) === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [products, query, statusFilter]);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search product or category..."
              className="w-full rounded-lg border border-[#D4AF37]/25 bg-[#111111] py-2 pl-9 pr-3 text-sm text-gray-100 placeholder:text-gray-500 outline-none focus:border-[#D4AF37]/60 focus:ring-2 focus:ring-[#D4AF37]/20"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "ALL" | Status)}
            className="rounded-lg border border-[#D4AF37]/25 bg-[#111111] px-3 py-2 text-sm text-gray-100 outline-none focus:border-[#D4AF37]/60 focus:ring-2 focus:ring-[#D4AF37]/20"
          >
            <option value="ALL">All statuses</option>
            <option value="IN STOCK">In stock</option>
            <option value="LOW STOCK">Low stock</option>
            <option value="OUT OF STOCK">Out of stock</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-b from-[#E9C767] to-[#B8912C] px-4 py-2 text-sm font-semibold text-black shadow-[0_0_0_1px_rgba(212,175,55,0.4)] transition hover:brightness-110"
          >
            <PackagePlus size={16} /> Add Product
          </Link>
          <Link
            href="/admin/stock-receiving"
            className="inline-flex items-center gap-2 rounded-lg border border-[#D4AF37]/50 px-4 py-2 text-sm font-semibold text-[#D4AF37] transition hover:bg-[#D4AF37]/10"
          >
            <Truck size={16} /> Receive Stock
          </Link>
          <button
            onClick={() => setHistoryOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-[#D4AF37]/50 px-4 py-2 text-sm font-semibold text-[#D4AF37] transition hover:bg-[#D4AF37]/10"
          >
            <History size={16} /> View Stock History
          </button>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-xl border border-[#D4AF37]/20 bg-[#0d0d0d] sm:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#D4AF37]/20 bg-[#141414] text-xs uppercase tracking-wide text-[#D4AF37]/80">
                <th className="px-4 py-3 font-semibold">Product Name</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Unit</th>
                <th className="px-4 py-3 text-right font-semibold">Cost Price</th>
                <th className="px-4 py-3 text-right font-semibold">Selling Price</th>
                <th className="px-4 py-3 text-right font-semibold">Current Stock</th>
                <th className="px-4 py-3 text-right font-semibold">Minimum Stock</th>
                <th className="px-4 py-3 font-semibold">Stock Status</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D4AF37]/10">
              {filtered.map((p) => (
                <tr key={p.id} className="text-gray-200 transition hover:bg-[#D4AF37]/[0.04]">
                  <td className="px-4 py-3 font-medium text-white">{p.name}</td>
                  <td className="px-4 py-3 text-gray-400">{p.category}</td>
                  <td className="px-4 py-3 text-gray-400">{p.unit}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{money(p.costPrice)}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{money(p.sellingPrice)}</td>
                  <td className="px-4 py-3 text-right tabular-nums font-semibold text-white">{num(p.currentStock)}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-gray-400">{num(p.minStock)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={statusOf(p)} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href="/admin/products"
                      className="inline-flex items-center gap-1 rounded-md border border-[#D4AF37]/30 px-2.5 py-1.5 text-xs font-medium text-[#D4AF37] transition hover:bg-[#D4AF37]/10"
                    >
                      <Pencil size={13} /> Edit
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-gray-500">
                    No products match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile card list */}
      <div className="space-y-3 sm:hidden">
        {filtered.map((p) => (
          <div key={p.id} className="rounded-xl border border-[#D4AF37]/20 bg-[#0d0d0d] p-4">
            <div className="mb-2 flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-white">{p.name}</p>
                <p className="text-xs text-gray-500">{p.category} &middot; {p.unit}</p>
              </div>
              <StatusBadge status={statusOf(p)} />
            </div>
            <div className="grid grid-cols-2 gap-y-1.5 text-sm">
              <span className="text-gray-500">Cost Price</span>
              <span className="text-right tabular-nums text-gray-200">{money(p.costPrice)}</span>
              <span className="text-gray-500">Selling Price</span>
              <span className="text-right tabular-nums text-gray-200">{money(p.sellingPrice)}</span>
              <span className="text-gray-500">Current Stock</span>
              <span className="text-right tabular-nums font-semibold text-white">{num(p.currentStock)}</span>
              <span className="text-gray-500">Minimum Stock</span>
              <span className="text-right tabular-nums text-gray-400">{num(p.minStock)}</span>
            </div>
            <Link
              href="/admin/products"
              className="mt-3 inline-flex items-center gap-1 rounded-md border border-[#D4AF37]/30 px-2.5 py-1.5 text-xs font-medium text-[#D4AF37] transition hover:bg-[#D4AF37]/10"
            >
              <Pencil size={13} /> Edit
            </Link>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="rounded-xl border border-[#D4AF37]/20 bg-[#0d0d0d] p-6 text-center text-sm text-gray-500">
            No products match your search.
          </div>
        )}
      </div>

      {/* Stock history modal */}
      {historyOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 sm:items-center sm:p-4">
          <div className="max-h-[85vh] w-full overflow-hidden rounded-t-2xl border border-[#D4AF37]/30 bg-[#0d0d0d] sm:max-w-2xl sm:rounded-2xl">
            <div className="flex items-center justify-between border-b border-[#D4AF37]/20 px-5 py-4">
              <h2 className="flex items-center gap-2 font-semibold text-[#D4AF37]">
                <History size={18} /> Stock History
              </h2>
              <button onClick={() => setHistoryOpen(false)} aria-label="Close" className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto p-5">
              {movements.length === 0 ? (
                <p className="py-8 text-center text-sm text-gray-500">No stock movements recorded yet.</p>
              ) : (
                <ul className="space-y-3">
                  {movements.map((m) => (
                    <li key={m.id} className="rounded-lg border border-[#D4AF37]/15 bg-[#141414] p-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-medium text-white">{m.productName}</span>
                        <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide ${movementStyles[m.type]}`}>
                          {m.type}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400">
                        <span>
                          {m.quantity > 0 ? "+" : ""}
                          {num(m.quantity)} &middot; {num(m.previousStock)} &rarr; {num(m.newStock)}
                        </span>
                        <span>{new Date(m.createdAt).toLocaleString("en-PH")}</span>
                      </div>
                      {(m.note || m.createdByName) && (
                        <p className="mt-1 text-xs text-gray-500">
                          {m.note ?? ""}
                          {m.note && m.createdByName ? " — " : ""}
                          {m.createdByName ? `by ${m.createdByName}` : ""}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
