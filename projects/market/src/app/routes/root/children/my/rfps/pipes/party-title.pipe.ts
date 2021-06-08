import { Pipe, PipeTransform } from '@angular/core';
import { innKppToLegalId } from "#shared/utils";

@Pipe({
  name: 'marketPartyTitle',
})
export class PartyTitlePipe implements PipeTransform {

  transform(party: { inn: string; kpp: string; name: string }): string {
    if (!party) {
      return null;
    }
    if (party.name) {
      return party.name;
    }
    return innKppToLegalId(party.inn, party.kpp);
  }

}
