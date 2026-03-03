/** Kısmet Plastik founding year */
export const FOUNDING_YEAR = 1969;

/** Calculate company age dynamically */
export function getCompanyAge(): number {
  return new Date().getFullYear() - FOUNDING_YEAR;
}
