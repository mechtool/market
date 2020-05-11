export class NavItemModel {
  id?: number;
  label: string;
  icon?: string;
  command?: () => any;
  url?: string;
  routerLink?: string[];
  queryParams?: { [k: string]: any };
  style?: any;
  styleClass?: string;
  title?: string; // Tooltip
  items?: NavItemModel[];
  expanded?: boolean;
  active?: boolean;
  counter?: number;

  constructor(params) {
    Object.assign(this, params);
  }
}
