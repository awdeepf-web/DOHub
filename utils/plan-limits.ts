import type { PlanType } from '@/types/database.types';

export function canUseCustomDomain(plan: PlanType): boolean {
  return plan === 'pro';
}

export function canUseAnalytics(plan: PlanType): boolean {
  return plan === 'pro';
}

export function canRemoveWatermark(plan: PlanType): boolean {
  return plan === 'pro';
}

export function getMaxSections(plan: PlanType): number {
  return plan === 'free' ? 3 : Infinity;
}

export function canUseCustomColor(plan: PlanType): boolean {
  return plan === 'pro';
}

/**
 * Warna default untuk akun Free — dipakai sebagai fallback saat
 * canUseCustomColor() bernilai false, supaya tampilan tetap konsisten
 * dengan identitas visual platform (bukan warna bebas milik tenant).
 */
export const FREE_PLAN_DEFAULT_PRIMARY = '#3ecf8e';
export const FREE_PLAN_DEFAULT_SECONDARY = '#1c1c1c';