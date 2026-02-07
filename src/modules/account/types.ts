export interface IBankItems {
  data: IBankItemsData[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface IBankItemsData {
  code: string;
  quantity: number;
}
