'use client';

interface LineChartPoint {
  label: string;
  value: number;
}

/**
 * Grafik garis melengkung (smooth curve) memakai SVG murni, tanpa
 * dependency tambahan. Warna otomatis ikut --brand-primary organisasi.
 */
export function LineChart({ data, height = 160 }: { data: LineChartPoint[]; height?: number }) {
  if (data.length === 0) {
    return <p className="text-sm text-muted-foreground">Belum ada data.</p>;
  }

  const width = 600;
  const paddingY = 20;
  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const stepX = data.length > 1 ? width / (data.length - 1) : 0;

  const points = data.map((d, i) => ({
    x: i * stepX,
    y: height - paddingY - (d.value / maxValue) * (height - paddingY * 2),
  }));

  // Ubah titik-titik jadi path melengkung halus (Catmull-Rom → Bezier)
  function buildSmoothPath(pts: { x: number; y: number }[]): string {
    const firstPoint = pts[0];
    if (!firstPoint || pts.length < 2) return '';

    let path = `M ${firstPoint.x} ${firstPoint.y}`;

    for (let i = 0; i < pts.length - 1; i++) {
      const p1 = pts[i];
      const p2 = pts[i + 1];

      if (!p1 || !p2) continue;

      const p0 = pts[i - 1] ?? p1;
      const p3 = pts[i + 2] ?? p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }

    return path;
  }

  const linePath = buildSmoothPath(points);
  const lastPoint = points[points.length - 1];
  const areaPath = lastPoint
    ? `${linePath} L ${lastPoint.x} ${height} L 0 ${height} Z`
    : '';

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="lineChartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--brand-chart-color, var(--primary)))" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(var(--brand-chart-color, var(--primary)))" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="var(--brand-primary, hsl(var(--primary)))" fillOpacity="0.12" />
        <path d={linePath} fill="none" stroke="var(--brand-primary, hsl(var(--primary)))" strokeWidth="2.5" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="var(--brand-primary, hsl(var(--primary)))" />
        ))}
      </svg>
      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
        {data.map((d, i) => (
          <span key={i}>{d.label}</span>
        ))}
      </div>
    </div>
  );
}