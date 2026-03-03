import { create } from 'zustand';
import type { ColorOption, ProductAccessory } from '@/types/configurator';
import type { Product } from '@/types/product';

interface ConfiguratorStore {
  // Selected product
  product: Product | null;
  setProduct: (product: Product | null) => void;

  // Body color
  bodyColor: ColorOption | null;
  setBodyColor: (color: ColorOption | null) => void;

  // Selected accessory
  accessory: ProductAccessory | null;
  setAccessory: (accessory: ProductAccessory | null) => void;

  // Accessory color
  accessoryColor: ColorOption | null;
  setAccessoryColor: (color: ColorOption | null) => void;

  // Available data from DB
  accessories: ProductAccessory[];
  setAccessories: (accessories: ProductAccessory[]) => void;
  bodyColors: ColorOption[];
  setBodyColors: (colors: ColorOption[]) => void;
  accessoryColors: ColorOption[];
  setAccessoryColors: (colors: ColorOption[]) => void;

  // Reset
  reset: () => void;
}

export const useConfiguratorStore = create<ConfiguratorStore>()((set) => ({
  product: null,
  setProduct: (product) =>
    set({
      product,
      bodyColor: null,
      accessory: null,
      accessoryColor: null,
      accessories: [],
      bodyColors: [],
      accessoryColors: [],
    }),

  bodyColor: null,
  setBodyColor: (bodyColor) => set({ bodyColor }),

  accessory: null,
  setAccessory: (accessory) => set({ accessory, accessoryColor: null, accessoryColors: [] }),

  accessoryColor: null,
  setAccessoryColor: (accessoryColor) => set({ accessoryColor }),

  accessories: [],
  setAccessories: (accessories) => set({ accessories }),
  bodyColors: [],
  setBodyColors: (bodyColors) => set({ bodyColors }),
  accessoryColors: [],
  setAccessoryColors: (accessoryColors) => set({ accessoryColors }),

  reset: () =>
    set({
      product: null,
      bodyColor: null,
      accessory: null,
      accessoryColor: null,
      accessories: [],
      bodyColors: [],
      accessoryColors: [],
    }),
}));
