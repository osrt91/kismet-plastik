/**
 * Product filter values.
 * IMPORTANT: ML, GR, MM are always uppercase.
 * All values match the original Turkish data exactly.
 */

export const FILTER_VOLUMES = [
  "30 ML", "50 ML", "55 ML", "100 ML", "110 ML", "125 ML",
  "150 ML", "170 ML", "175 ML", "200 ML", "230 ML", "250 ML",
  "300 ML", "325 ML", "350 ML", "375 ML", "380 ML", "400 ML",
  "420 ML", "500 ML", "530 ML",
] as const;

export const FILTER_MATERIALS = [
  "PET", "HDPE", "PP", "LDPE",
] as const;

export const FILTER_MODELS = [
  "ARI", "BAKLAVALI", "CAM KOZALAK", "CEMBERLI", "CIZGILI",
  "DAMLA", "DUZ", "ELIT", "INCE BELLI", "KAFES", "KARE",
  "KONIK", "KOSELI", "KRISTAL", "LALE", "OMUZLU", "OVAL",
  "SIRMA", "SILINDIR", "TOMBUL", "VAZO", "VAZO DUZ",
  "YAPRAK", "YASSI",
] as const;

export const FILTER_COLORS = [
  "SEFFAF", "ALTINYALDIZ", "AMBER", "BEYAZ", "BORDO", "FUME",
  "GOLD - BEYAZ", "GOLD - GUMUS", "GOLD - SIYAH", "GOLD - SEFFAF",
  "GRI", "GUMUS - BEYAZ", "GUMUS - GOLD", "GUMUS - SIYAH", "GUMUS - SEFFAF",
  "KIRMIZI", "LACIVERT", "LILA", "M.GOLD", "M.GUMUS",
  "MAVI", "MOR", "N.KIRMIZI", "N.MAVI", "N.MOR", "N.PEMBE", "N.SARI", "N.TURUNCU", "N.YESIL",
  "PEMBE", "PEMBE - ACIK", "PEMBE - KOYU", "SARI", "SEDEF", "SIYAH",
  "T.AMBER", "T.GOLD", "T.KIRMIZI", "T.LACIVERT", "T.MAVI", "T.MOR", "T.PEMBE", "T.SARI", "T.SIYAH", "T.TURUNCU", "T.YESIL",
  "TEN", "TURUNCU", "YESIL", "YESIL - ACIK", "YESIL - KOYU",
] as const;

export const FILTER_SHAPES = [
  "DUZ", "OVAL", "SILINDIR", "YUVARLAK",
] as const;

export const FILTER_SURFACE_TYPES = [
  "DUZ", "KARE", "OZEL",
] as const;

export const FILTER_WEIGHTS = [
  "8 GR", "9,5 GR", "15 GR", "17 GR", "21 GR",
  "24 GR", "25,5 GR", "26 GR", "29 GR", "32 GR",
] as const;

export const FILTER_NECK_FINISHES = [
  "18 MM", "20 MM", "24 MM - KLASIK", "24 MM - MODERN", "28 MM",
] as const;

export type FilterVolume = typeof FILTER_VOLUMES[number];
export type FilterMaterial = typeof FILTER_MATERIALS[number];
export type FilterModel = typeof FILTER_MODELS[number];
export type FilterColor = typeof FILTER_COLORS[number];
export type FilterShape = typeof FILTER_SHAPES[number];
export type FilterSurfaceType = typeof FILTER_SURFACE_TYPES[number];
export type FilterWeight = typeof FILTER_WEIGHTS[number];
export type FilterNeckFinish = typeof FILTER_NECK_FINISHES[number];

export interface ProductFilters {
  volume: FilterVolume[];
  material: FilterMaterial[];
  model: FilterModel[];
  color: FilterColor[];
  shape: FilterShape[];
  surfaceType: FilterSurfaceType[];
  weight: FilterWeight[];
  neckFinish: FilterNeckFinish[];
}
