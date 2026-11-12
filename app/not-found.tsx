import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#090B11] text-white flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="text-xs font-mono text-[#F472B6]">404 · Page Not Found</div>
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
        URWidgets — KDE Plasma 5 Desktop Ecosystem
      </h1>
      <p className="text-sm text-slate-400 max-w-md">
        The requested page could not be found. Return to the official URWidgets
        product website.
      </p>
      <Link
        href="/"
        className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#E84A7F] hover:opacity-95 transition-opacity"
      >
        Return to URWidgets Home
      </Link>
    </div>
  );
}
