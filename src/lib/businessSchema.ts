interface BusinessSchemaInput {
  /** Absolute URL of the page embedding the schema. */
  url: string;
  /** Absolute URL of a raster image (Google ignores SVG here). */
  image: string;
  whatsapp: string;
  instagram: string;
  email: string;
}

// Single source of truth for the LocalBusiness/Store structured data, shared by
// the homepage and contact page so the local-SEO signals never drift apart.
// Address/geo target Mar del Plata, the primary local-search market.
export function localBusinessSchema({
  url,
  image,
  whatsapp,
  instagram,
  email,
}: BusinessSchemaInput) {
  return {
    '@context': 'https://schema.org',
    // HomeGoodsStore adds the home-decor signal for "decoración en Mar del
    // Plata" searches; Store/LocalBusiness keep the general local signal.
    '@type': ['Store', 'HomeGoodsStore', 'LocalBusiness'],
    name: 'Lumika Objetos',
    description:
      'Velas artesanales y objetos de decoración en Mar del Plata: velas de cera de soja y piezas de resina hechas a mano.',
    url,
    image,
    telephone: `+${whatsapp}`,
    email,
    priceRange: '$$',
    currenciesAccepted: 'ARS',
    paymentAccepted: 'Efectivo, Transferencia',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Mar del Plata',
      addressRegion: 'Buenos Aires',
      addressCountry: 'AR',
    },
    geo: { '@type': 'GeoCoordinates', latitude: -38.0055, longitude: -57.5426 },
    areaServed: { '@type': 'City', name: 'Mar del Plata' },
    knowsLanguage: 'es-AR',
    makesOffer: {
      '@type': 'OfferCatalog',
      name: 'Catálogo Lumika Objetos',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: 'Velas de soja artesanales' },
        },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Accesorios de resina' } },
        {
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: 'Objetos de decoración artesanal' },
        },
      ],
    },
    sameAs: [`https://instagram.com/${instagram}`],
  };
}
