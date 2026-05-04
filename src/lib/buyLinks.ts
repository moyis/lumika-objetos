export function whatsappLink(number: string, productTitle: string): string {
  const message = `Hola! Me interesa ${productTitle}`;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function instagramLink(handle: string): string {
  return `https://instagram.com/${handle}`;
}

export function emailLink(address: string, productTitle?: string): string {
  if (!productTitle) return `mailto:${address}`;
  const subject = encodeURIComponent(`Consulta: ${productTitle}`);
  return `mailto:${address}?subject=${subject}`;
}
