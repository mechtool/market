export function legalIdToInn(legalId: string): string {
  return legalId.replace(/:\w*/gi,'');
}
