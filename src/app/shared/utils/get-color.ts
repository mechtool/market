export function randomARGB(): string {
  const index = Math.floor(Math.random() * 10000000);
  // tslint:disable-next-line:no-bitwise max-line-length
  let hex = ((index >> 24) & 0xFF).toString(16) + ((index >> 16) & 0xFF).toString(16) + ((index >> 8) & 0xFF).toString(16) + (index & 0xFF).toString(16);
  hex += '000000';
  const number = hex.substring(0, 6);

  return `#${number}`;
}
