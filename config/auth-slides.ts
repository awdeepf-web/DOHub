export interface AuthSlide {
  title: string;
  subtitle: string;
  /**
   * Opsional. Kalau diisi URL gambar (misal hasil upload ke Supabase Storage
   * atau link foto), gambar itu akan dipakai sebagai background slide.
   * Kalau dikosongkan (undefined), sistem otomatis pakai ilustrasi gradient
   * bawaan (tidak perlu gambar asli, aman dari copyright & tidak mudah rusak).
   */
  imageUrl?: string;
}

/**
 * Ganti/tambah/kurangi slide di array ini untuk mengubah tampilan
 * background halaman Login & Register. Slide akan bergantian otomatis
 * tiap 5 detik. Minimal 1 slide.
 */
export const AUTH_SLIDES: AuthSlide[] = [
  {
    title: 'Kelola Bimbel Kamu Lebih Mudah',
    subtitle: 'Satu platform untuk siswa, guru, kelas, absensi, hingga pembayaran.',
    imageUrl: 'https://i.ibb.co.com/LDq7v95K/Gemini-Generated-Image-8sm2b48sm2b48sm2.png', // <-- Masukkan URL gambar 1 di sini
  },
  {
    title: 'Laporan Keuangan Real-time',
    subtitle: 'Pantau pemasukan dan tagihan bimbel kapan saja, di mana saja.',
    imageUrl: 'https://i.ibb.co.com/m5M0Rz4G/Gemini-Generated-Image-6l5h826l5h826l5h.png', // <-- Masukkan URL gambar 2 di sini
  },
  {
    title: 'Landing Page Otomatis',
    subtitle: 'Setiap bimbel dapat halaman promosi sendiri, tanpa perlu coding.',
    imageUrl: 'https://i.ibb.co.com/qLVNmMC6/Gemini-Generated-Image-ll30rvll30rvll30.png', // <-- Masukkan URL gambar 3 di sini
  },
];

/** Durasi tiap slide tampil, dalam milidetik. */
export const AUTH_SLIDE_INTERVAL_MS = 5000;