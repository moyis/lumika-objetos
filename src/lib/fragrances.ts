import fragrancesData from '../data/fragrances.json';

// Available candle fragrances. Edit them in the admin panel
// (Configuración → Fragancias), which writes src/data/fragrances.json.
export const FRAGRANCES: string[] = fragrancesData.fragrances;

export type Fragrance = string;
