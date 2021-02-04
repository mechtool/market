export function hexFrom(text: string): string {
  let hex = '';
  for (let i = 0; i < text.length; i++) {
    hex += text.charCodeAt(i).toString(16);
  }
  return hex;
}

export const uniqueArray = (value, index, self) => value && self.indexOf(value) === index;
