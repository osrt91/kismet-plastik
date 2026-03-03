export interface AccessoryType {
  id: string;
  name_tr: string;
  name_en: string | null;
  name_ar: string | null;
  slug: string;
  category: 'cap' | 'pump' | 'spray' | 'dropper' | 'valve';
  neck_finish: string | null;
  thumbnail_url: string | null;
}

export interface ProductAccessory {
  id: string;
  product_id: string;
  accessory_type_id: string;
  accessory_type?: AccessoryType;
  is_default: boolean;
  sort_order: number;
}

export interface ColorOption {
  id: string;
  target_type: 'product' | 'accessory';
  target_id: string;
  color_name_tr: string;
  color_name_en: string | null;
  color_name_ar: string | null;
  color_hex: string;
  opacity: number;
  metallic: number;
  is_default: boolean;
  preview_image_url: string | null;
  sort_order: number;
}

export interface ConfiguratorState {
  selectedProduct: string | null;
  selectedBodyColor: ColorOption | null;
  selectedAccessory: ProductAccessory | null;
  selectedAccessoryColor: ColorOption | null;
}

export interface QuoteCartItem {
  productId: string;
  productName: string;
  quantity: number;
  bodyColorHex?: string;
  bodyColorName?: string;
  accessoryId?: string;
  accessoryName?: string;
  accessoryColorHex?: string;
  accessoryColorName?: string;
  notes?: string;
  thumbnailUrl?: string;
}
