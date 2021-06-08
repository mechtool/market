export function getBase64MimeType(b64: string): string {
  const DEFAULT_MIME_TYPE = 'application/octet-stream';
  const signatures = {
    '/9j': 'image/jpeg',
    iVBORw0KGgo: 'image/png',
    R0lGODdh: 'image/gif',
    R0lGODlh: 'image/gif',
    JVBERi0: 'application/pdf',
  };

  const foundSignature = Object.keys(signatures).find((signature) => {
    return b64.indexOf(signature) === 0;
  })

  return foundSignature ? signatures[foundSignature] : DEFAULT_MIME_TYPE;
}
