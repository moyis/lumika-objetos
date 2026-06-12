import type { ProductTag } from './productTags';

// SEO-facing metadata for the category landing pages at /tienda/{slug}.
// Each category targets one local-search intent ("{categoría} en Mar del
// Plata"), so the copy here is the primary ranking signal — keep one clear
// intent per entry and avoid keyword stuffing.
export interface Category {
  /** URL slug and product tag (1:1). e.g. "aros". */
  slug: ProductTag;
  /** Plural display name for chips/breadcrumbs. e.g. "Aros". */
  label: string;
  /** <title> (Layout appends "· Lumika Objetos"). ~45-55 chars. */
  title: string;
  /** <meta description>. ~120-160 chars, honest, local + category keyword. */
  description: string;
  /** On-page H1. */
  heading: string;
  /** 60-100 word intro paragraph with category + handmade + local terms. */
  intro: string;
}

export const CATEGORIES: Category[] = [
  {
    slug: 'velas',
    label: 'Velas',
    title: 'Velas de soja artesanales en Mar del Plata',
    description:
      'Velas de cera de soja hechas a mano en Mar del Plata: aromáticas, decorativas y para regalo. Piezas únicas, pedí por WhatsApp.',
    heading: 'Velas de soja artesanales',
    intro:
      'Nuestras velas están hechas a mano en Mar del Plata con cera de soja, una cera vegetal que arde más limpia y dura más que la parafina. Cada pieza se cuela, perfuma y termina de a una, así que no hay dos iguales. Encontrás velas aromáticas, cupcakes, postres y diseños marmolados, ideales para regalar o ambientar tu casa. Hacé tu pedido por WhatsApp o Instagram y coordinamos la entrega.',
  },
  {
    slug: 'aros',
    label: 'Aros',
    title: 'Aros de resina artesanales en Mar del Plata',
    description:
      'Aros de resina hechos a mano en Mar del Plata. Diseños únicos con colores, transparencias y brillos. Piezas livianas, pedí por WhatsApp.',
    heading: 'Aros de resina artesanales',
    intro:
      'Diseñamos aros de resina a mano en Mar del Plata, mezclando colores, transparencias y brillos en cada par. Al ser un proceso totalmente artesanal, no existen dos piezas exactamente iguales: cada par es único. Son livianos, cómodos para todo el día y le dan a tu look ese toque hecho a mano que no se consigue en serie. Mirá los modelos disponibles y pedí el tuyo por WhatsApp o Instagram.',
  },
  {
    slug: 'collares',
    label: 'Collares',
    title: 'Collares de resina artesanales en Mar del Plata',
    description:
      'Collares de resina hechos a mano en Mar del Plata. Piezas únicas con colores y diseños propios. Accesorios artesanales, pedí por WhatsApp.',
    heading: 'Collares de resina artesanales',
    intro:
      'Nuestros collares de resina se hacen a mano en Mar del Plata, pieza por pieza, combinando colores y diseños propios. Como cada uno se cuela y se pule de forma artesanal, vas a llevar un accesorio único que nadie más tiene. Perfectos para sumar color a un look diario o para regalar algo distinto. Elegí tu favorito y coordinamos el pedido por WhatsApp o Instagram.',
  },
  {
    slug: 'llaveros',
    label: 'Llaveros',
    title: 'Llaveros de resina artesanales en Mar del Plata',
    description:
      'Llaveros de resina hechos a mano en Mar del Plata. Diseños únicos con brillos y colores: mariposas, planetas y más. Pedí por WhatsApp.',
    heading: 'Llaveros de resina artesanales',
    intro:
      'Hacemos llaveros de resina a mano en Mar del Plata, pieza por pieza, con formas divertidas como mariposas y planetas, llenos de brillos y color. Al ser un proceso artesanal, no hay dos iguales: cada llavero es único. Son livianos, resistentes y perfectos para tus llaves, la mochila o como charm de regalo. Elegí tu favorito y coordinamos el pedido por WhatsApp o Instagram.',
  },
];

export const CATEGORY_BY_SLUG: Record<string, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, c]),
);
