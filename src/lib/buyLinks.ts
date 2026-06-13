// Business WhatsApp number (international format, no +). Hardcoded so order
// links work regardless of build-time env config.
export const WHATSAPP_NUMBER = '5492233042700';

export function whatsappLink(number: string, message: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function orderMessage(productTitle: string, fragrance?: string): string {
  return fragrance
    ? `Hola, quiero pedir "${productTitle}" con fragancia "${fragrance}"`
    : `Hola, quiero pedir "${productTitle}"`;
}

export function instagramLink(handle: string): string {
  return `https://instagram.com/${handle}`;
}

// Opens the Instagram DM thread directly. Instagram has no URL param to
// prefill message text, so callers copy the message to the clipboard instead.
export function instagramDmLink(handle: string): string {
  return `https://ig.me/m/${handle}`;
}

export function emailLink(address: string, productTitle?: string): string {
  if (!productTitle) return `mailto:${address}`;
  const subject = encodeURIComponent(`Consulta: ${productTitle}`);
  return `mailto:${address}?subject=${subject}`;
}
