export function legalIdToInn(legalId: string): string {
  return legalId.replace(/:\w*/gi,'');
}

export function innKppToLegalId(inn: string, kpp?: string) {
  return `${inn}${!!+kpp ? `:${kpp}` : ''}`;
}
