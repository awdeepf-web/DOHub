'use client';

import Link from 'next/link';
import { useFormState, useFormStatus } from 'react-dom';
import { registerAction } from '@/features/auth/auth.actions';
import { initialAuthActionState } from '@/features/auth/auth.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Memproses...' : 'Daftar Bimbel Baru'}
    </Button>
  );
}

export function RegisterForm() {
  const [state, formAction] = useFormState(registerAction, initialAuthActionState);

  if (state.success) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Registrasi Berhasil</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{state.message}</p>
          <Link href="/login" className="mt-4 inline-block text-sm font-medium text-primary underline underline-offset-4">
            Kembali ke halaman login
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daftar Bimbel Baru</CardTitle>
        <CardDescription>Buat akun Owner untuk bimbel kamu</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          {state.error && (
            <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {state.error}
            </p>
          )}

          <div className="space-y-2">
            <Label htmlFor="organizationName">Nama Bimbel</Label>
            <Input id="organizationName" name="organizationName" placeholder="Bimbel Cerdas Nusantara" required />
            {state.fieldErrors?.organizationName && (
              <p className="text-xs text-destructive">{state.fieldErrors.organizationName[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName">Nama Lengkap</Label>
            <Input id="fullName" name="fullName" placeholder="Nama kamu" required />
            {state.fieldErrors?.fullName && (
              <p className="text-xs text-destructive">{state.fieldErrors.fullName[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="nama@email.com" required />
            {state.fieldErrors?.email && (
              <p className="text-xs text-destructive">{state.fieldErrors.email[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
            {state.fieldErrors?.password && (
              <p className="text-xs text-destructive">{state.fieldErrors.password[0]}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Minimal 8 karakter, mengandung huruf besar dan angka.
            </p>
          </div>

          <SubmitButton />

          <p className="text-center text-sm text-muted-foreground">
            Sudah punya akun?{' '}
            <Link href="/login" className="font-medium text-primary underline underline-offset-4">
              Masuk di sini
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}