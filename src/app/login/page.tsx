import { login } from "./actions";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="hidden bg-ink-900 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <p className="text-xl font-bold tracking-tight">Grand MF Arena</p>
        <div>
          <h1 className="max-w-md text-4xl font-bold leading-tight">Every crate counted. Every peso remitted.</h1>
          <p className="mt-4 max-w-md text-slate-300">Inventory, ordering, sales and remittance for event days.</p>
        </div>
        <p className="text-sm text-slate-400">Office and store accounts only.</p>
      </section>
      <section className="flex items-center justify-center p-6">
        <form action={login} className="w-full max-w-sm space-y-4">
          <h2 className="text-2xl font-bold">Sign in</h2>
          {error && <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-700">Email or password is incorrect.</p>}
          <label className="block text-sm font-medium">Email
            <input name="email" type="email" required autoComplete="username" className="input mt-1" />
          </label>
          <label className="block text-sm font-medium">Password
            <input name="password" type="password" required autoComplete="current-password" className="input mt-1" />
          </label>
          <button className="btn w-full">Sign in</button>
        </form>
      </section>
    </main>
  );
}
