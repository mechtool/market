export function mapStock(stock: string): string {
  switch (stock) {
    case 'HIGH':
      return 'много';
    case 'MEDIUM':
      return 'умеренно';
    case 'LOW':
      return 'мало';
    case 'OUT_OF_STOCK':
      return 'нет на складе';
    default:
      return null;
  }
}
