export function stringToRGB(str: string): string {
  let hash = 0;
  if (!str || str.length === 0) return 'rgb(255, 255,255)';
  for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
      hash = hash & hash;
  }
  let rgb = [0, 0, 0];
  for (let i = 0; i < 3; i++) {
      let value = (hash >> (i * 8)) & 255;
      rgb[i] = value;
  }
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

export function stringToHex(str: string): string {
  let hash = 0;
  if (!str || str.length === 0) return '#ffffff';
  for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
      hash = hash & hash;
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
      let value = (hash >> (i * 8)) & 255;
      color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
}
