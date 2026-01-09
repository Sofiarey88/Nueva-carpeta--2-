'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (!res.ok) {
      const body = await res.json();
      setError(body.message ?? "Error al iniciar sesión");
      setLoading(false);
      return;
    }

    const redirect = searchParams.get("redirect") || "/admin";
    router.push(redirect);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-900 text-slate-50">
      <div className="mx-auto flex max-w-md flex-col gap-6 px-6 py-16">
        <header className="space-y-2 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Admin</p>
          <h1 className="text-3xl font-semibold">Ingresar</h1>
          <p className="text-sm text-slate-400">Protegemos el panel con una clave corta.</p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur"
        >
          <div className="space-y-2">
            <label className="text-sm text-slate-200">Contraseña</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm text-white outline-none focus:border-amber-300/60"
            />
          </div>

          {error && <p className="mt-3 text-sm text-amber-300/90">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-amber-300 disabled:opacity-60"
          >
            {loading ? "Verificando..." : "Entrar"}
          </button>
        </form>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3">
          <h2 className="text-sm font-semibold text-slate-200">Credenciales disponibles:</h2>
          <div className="space-y-2 text-xs text-slate-400">
            <div>
              <p className="text-amber-300/80 font-semibold">Admin:</p>
              <p className="text-slate-300">admin1234</p>
              <p className="text-slate-500">(Editar, agregar y eliminar productos)</p>
            </div>
            <div className="border-t border-white/5 pt-2">
              <p className="text-blue-300/80 font-semibold">Empleado:</p>
              <p className="text-slate-300">emp1234</p>
              <p className="text-slate-500">(Solo lectura)</p>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400">
          Cambia las credenciales usando las variables de entorno ADMIN_PASSWORD y EMPLOYEE_PASSWORD.
        </p>
      </div>
    </div>
  );
}
