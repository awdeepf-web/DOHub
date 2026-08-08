import Link from 'next/link';

export default function GlobalNotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <h2 className="text-xl font-semibold">Halaman Tidak Ditemukan</h2>
      <p className="max-w-md text-muted-foreground">
        Halaman yang kamu cari tidak ada atau sudah dipindahkan.
      </p>
      <Link href="/" className="text-sm font-medium text-primary underline underline-offset-4">
        Kembali ke Beranda
      </Link>
    </main>
  );
}