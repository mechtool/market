export function hexFrom(text: string): string {
  let hex = '';
  for (let i = 0; i < text.length; i++) {
    hex += text.charCodeAt(i).toString(16);
  }
  return hex;
}

export function waitFor(condition, callback): void {
  if(!condition()) {
    const t = window.setTimeout(()=> {
      window.clearTimeout(t);
      waitFor(condition, callback);
    }, 100);
  } else {
    callback();
  }
}

export const uniqueArray = (value, index, self) => value && self.indexOf(value) === index;

