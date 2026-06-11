import "./globals.css";

export const metadata = {
  title: "Pharmacy Rx — Drug Interaction Checker",
  description: "Prescription entry and AI-powered drug interaction checker",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💊</span>
            <span className="font-bold text-lg text-slate-800">PharmacyRx</span>
          </div>
          <div className="flex gap-4">
            <a href="/" className="text-slate-600 hover:text-blue-600 text-sm font-medium transition-colors">
              Prescriptions
            </a>
            <a href="/new" className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              + New Prescription
            </a>
          </div>
        </nav>
        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
