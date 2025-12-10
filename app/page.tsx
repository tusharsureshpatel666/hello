import PaytmScanner from "./components/QrReader";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-300 dark:from-zinc-900 dark:to-black p-6">
      <div className="w-full max-w-xl p-8 rounded-2xl shadow-xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-700">
        <h1 className="text-3xl font-bold mb-6 text-center text-zinc-800 dark:text-zinc-100">
          Place QR Scanner
        </h1>
        <p className="text-center text-zinc-600 dark:text-zinc-400 mb-6">
          Scan your Password QR code to auto-fill withdrawal details.
        </p>
        <div className="flex items-center justify-center">
          <PaytmScanner />
        </div>
      </div>
    </main>
  );
}
