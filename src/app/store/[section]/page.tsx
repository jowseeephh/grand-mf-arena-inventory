import { requireStore } from "@/lib/session";

export default async function Section({ params }: { params: Promise<{ section: string }> }) {
  await requireStore();
  const { section } = await params;
  return (
    <div>
      <h1 className="text-2xl font-bold capitalize">{section.replace(/-/g, " ")}</h1>
      <p className="mt-2 text-slate-500">This section is built in an upcoming step.</p>
    </div>
  );
}
