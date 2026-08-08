'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';

interface ClassOption {
  id: string;
  name: string;
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function ClassDatePicker({ classOptions }: { classOptions: ClassOption[] }) {
  const router = useRouter();
  const [classId, setClassId] = useState('');
  const [date, setDate] = useState(todayIso());

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!classId || !date) return;
    router.push(`/dashboard/absensi/ambil?classId=${classId}&date=${date}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-md border p-4 md:flex-row md:items-end">
      <div className="flex-1 space-y-2">
        <Label htmlFor="classId">Pilih Kelas</Label>
        <Select id="classId" value={classId} onChange={(e) => setClassId(e.target.value)} required>
          <option value="" disabled>
            Pilih kelas...
          </option>
          {classOptions.map((klass) => (
            <option key={klass.id} value={klass.id}>
              {klass.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Tanggal</Label>
        <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </div>

      <Button type="submit">Ambil Absensi</Button>
    </form>
  );
}