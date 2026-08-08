'use server';

import { redirect } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { loginSchema, registerSchema } from '@/features/auth/auth.validation';
import { initialAuthActionState, type AuthActionState } from '@/features/auth/auth.types';

export async function loginAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!parsed.success) {
    return {
      ...initialAuthActionState,
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { error } = await authService.login(parsed.data);

  if (error) {
    return { ...initialAuthActionState, error };
  }

  redirect('/dashboard');
}

export async function registerAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = registerSchema.safeParse({
    organizationName: formData.get('organizationName'),
    fullName: formData.get('fullName'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!parsed.success) {
    return {
      ...initialAuthActionState,
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { error, needsEmailConfirmation } = await authService.register(parsed.data);

  if (error) {
    return { ...initialAuthActionState, error };
  }

  if (needsEmailConfirmation) {
    return {
      ...initialAuthActionState,
      success: true,
      message: 'Registrasi berhasil! Silakan cek email kamu untuk konfirmasi sebelum login.',
    };
  }

  redirect('/dashboard');
}

export async function logoutAction(): Promise<void> {
  await authService.logout();
  redirect('/login');
}