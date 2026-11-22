export const GOYAD_WHATSAPP_NUMBER = '917997226661'

export type WhatsAppFormData = Record<string, string | number | boolean | undefined>

export function buildWhatsAppMessage(serviceType: string, formData: WhatsAppFormData): string {
  const details = Object.entries(formData)
    .filter(([, value]) => value !== undefined && value !== '' && value !== false)
    .map(([field, value]) => `- ${field}: ${value}`)
    .join('\n')

  return [
    'Hello GOYAD Travel! I would like to enquire about:',
    `*Service:* ${serviceType}`,
    '*Details:*',
    details || '- Please help me with the available options.',
  ].join('\n')
}

export function redirectToWhatsApp(serviceType: string, formData: WhatsAppFormData = {}): void {
  const message = buildWhatsAppMessage(serviceType, formData)
  const url = `https://wa.me/${GOYAD_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`

  if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    window.location.href = url
  } else {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}
