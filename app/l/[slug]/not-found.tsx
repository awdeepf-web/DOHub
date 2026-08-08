import Link from 'next/link';

export default function LandingNotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-bold">Halaman Tidak Ditemukan</h1>
      <p className="text-muted-foreground">Bimbel yang kamu cari tidak tersedia atau URL salah.</p>
      <Link href="/" className="text-sm font-medium text-primary underline underline-offset-4">
        Kembali ke Beranda
      </Link>
    </main>
  );
}