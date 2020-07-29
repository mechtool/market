export function innKppToLegalId(inn: string, kpp?: string) {
  return `${inn}${kpp ? `:${kpp}` : ''}`;
}
