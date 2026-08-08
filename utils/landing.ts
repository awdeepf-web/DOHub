import type { LandingSectionType } from '@/types/database.types';

export const SECTION_TYPE_OPTIONS: { value: LandingSectionType; label: string }[] = [
  { value: 'hero', label: 'Hero (Banner Utama)' },
  { value: 'about', label: 'Tentang Kami' },
  { value: 'features', label: 'Keunggulan/Fitur' },
  { value: 'cta', label: 'Ajakan Bertindak (CTA)' },
  { value: 'contact', label: 'Kontak' },
  { value: 'custom', label: 'Lainnya' },
];

const SECTION_TYPE_LABEL_MAP: Record<LandingSectionType, string> = {
  hero: 'Hero (Banner Utama)',
  about: 'Tentang Kami',
  features: 'Keunggulan/Fitur',
  cta: 'Ajakan Bertindak (CTA)',
  contact: 'Kontak',
  custom: 'Lainnya',
};

export function getSectionTypeLabel(type: LandingSectionType): string {
  return SECTION_TYPE_LABEL_MAP[type];
}