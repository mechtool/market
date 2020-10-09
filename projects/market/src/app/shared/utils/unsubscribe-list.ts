import { Subscription } from 'rxjs';

export function unsubscribeList(subsciptions: Subscription[]): void {
  subsciptions.forEach((subscription) => subscription?.unsubscribe?.());
}
