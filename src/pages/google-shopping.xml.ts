import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const prerender = true;

// Google Merchant product feed (RSS 2.0 + g: namespace). Submit this URL in
// Merchant Center: https://www.lumikaobjetos.com.ar/google-shopping.xml
// Spec: https://support.google.com/merchants/answer/7052112

const GOOGLE_NS = 'http://base.google.com/ns/1.0';

const escapeXml = (s: string) =>
  s.replace(/[<>&'"]/g, (c) => `&${{ '<': 'lt', '>': 'gt', '&': 'amp', "'": 'apos', '"': 'quot' }[c]};`);

// Strip markdown links/syntax and collapse whitespace into a plain-text blurb.
const plainText = (md: string) =>
  md
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[#*_>`~]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

export const GET: APIRoute = async ({ site }) => {
  if (!site) throw new Error('astro.config `site` must be set to build the Google Shopping feed');
  const products = await getCollection('products');

  const items = products
    .map((p) => {
      const d = p.data;
      const link = new URL(`/shop/${d.slug}`, site).toString();
      const [primary, ...rest] = d.images.map((img) => new URL(img.src, site).toString());
      const description = plainText(p.body ?? '') || d.subtitle || d.title;
      const availability = d.stock === 0 ? 'out_of_stock' : 'in_stock';

      return [
        '    <item>',
        `      <g:id>${escapeXml(d.sku ?? d.slug)}</g:id>`,
        `      <g:title>${escapeXml(d.title)}</g:title>`,
        `      <g:description>${escapeXml(description)}</g:description>`,
        `      <g:link>${escapeXml(link)}</g:link>`,
        primary && `      <g:image_link>${escapeXml(primary)}</g:image_link>`,
        ...rest.slice(0, 10).map((u) => `      <g:additional_image_link>${escapeXml(u)}</g:additional_image_link>`),
        `      <g:availability>${availability}</g:availability>`,
        `      <g:price>${d.price.toFixed(2)} ${d.currency}</g:price>`,
        `      <g:condition>new</g:condition>`,
        `      <g:brand>Lumika Objetos</g:brand>`,
        // Handmade pieces have no GTIN/MPN; tell Google not to expect them.
        `      <g:identifier_exists>no</g:identifier_exists>`,
        '    </item>',
      ]
        .filter(Boolean)
        .join('\n');
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="${GOOGLE_NS}">
  <channel>
    <title>Lumika Objetos</title>
    <link>${escapeXml(site.toString())}</link>
    <description>Velas de soja y accesorios de resina hechos a mano en Mar del Plata.</description>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
