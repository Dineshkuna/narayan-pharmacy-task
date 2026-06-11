import "./globals.css";

export const metadata = {
  title: "Pharmacy Rx — Drug Interaction Checker",
  description: "Prescription entry and AI-powered drug interaction checker",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 px-5 py-4 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-lg text-white shadow-sm">Rx</span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Narayan Pharmacy Task</p>
                <span className="font-semibold text-slate-900">Prescription Interaction Checker</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a href="/" className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900">
                Prescriptions
              </a>
              <a href="/new" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800">
                New Prescription
              </a>
            </div>
          </div>
        </nav>
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
